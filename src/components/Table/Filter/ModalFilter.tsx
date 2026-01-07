import { PlusOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { Button, Form, Modal, Space, Typography } from 'antd';
import { useEffect } from 'react';
import { useIntl } from 'umi';
import { useTableContext } from '../components/TableContext';
import { useFilterFields } from '../hooks/useFilterFields';
import { normalizeFilters } from '../utils';
import { ModalFooter } from './ModalFooter';
import RowFilter from './RowFilter';

const { Text } = Typography;

const ModalFilter = () => {
	const intl = useIntl();
	const { finalColumns: columns, setFilters, visibleFilter, setVisibleFilter, filters } = useTableContext();
	const [form] = Form.useForm();
	const { fieldsFilterable } = useFilterFields(columns, form);

	const handleFinish = (values: any) => {
		const normalizedFilters = normalizeFilters(values.filters);
		setFilters(normalizedFilters);
		setVisibleFilter(false);
	};

	useEffect(() => {
		if (visibleFilter) {
			form.setFieldsValue({ filters: filters || [] });
		}
	}, [visibleFilter, filters, form]);

	const handleReset = () => {
		form.resetFields();
	};

	return (
		<Modal
			open={visibleFilter}
			onCancel={() => setVisibleFilter(false)}
			footer={<ModalFooter onReset={handleReset} onCancel={() => setVisibleFilter(false)} />}
			title={intl.formatMessage({ id: 'global.table.customfilter.title' })}
			width={800}
		>
			<div style={{ marginBottom: 8 }}>
				<Text type='secondary'>{intl.formatMessage({ id: 'global.table.customfilter.dieukien' })}:</Text>
			</div>

			<Form
				form={form}
				layout='vertical'
				onFinish={handleFinish}
				id='custom-filter-form'
				initialValues={{ filters: [] }}
			>
				<Form.List name='filters'>
					{(fields, { add, remove }) => {
						return (
							<>
								{fields.length > 0 && (
									<Space direction='vertical' size={8} style={{ marginBottom: '16px', width: '100%' }}>
										{fields.map(({ key, name, ...restField }) => {
											return (
												<RowFilter
													key={key}
													name={name}
													formOwner={form}
													onRemove={() => remove(name)}
													allowGrouping
													level={0}
													{...restField}
												/>
											);
										})}
									</Space>
								)}

								<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
									<Button
										block
										type='dashed'
										disabled={!fieldsFilterable.length}
										icon={<PlusOutlined />}
										onClick={() => {
											const firstAvailableField = fieldsFilterable[0]?.replace(/"/g, '') ?? '';
											if (firstAvailableField) {
												add({
													field: firstAvailableField,
													operator: undefined,
													values: undefined,
													active: true,
												});
											}
										}}
									>
										{intl.formatMessage({ id: 'global.table.customfilter.button.them' })}
									</Button>
									<Button
										type='dashed'
										block
										disabled={!fieldsFilterable.length}
										icon={<PlusSquareOutlined />}
										onClick={() => {
											add({
												operator: 'and',
												active: true,
												filters: [],
											});
										}}
									>
										{intl.formatMessage({ id: 'global.table.customfilter.button.themnhom' })}
									</Button>
								</div>
							</>
						);
					}}
				</Form.List>
			</Form>
		</Modal>
	);
};

export default ModalFilter;

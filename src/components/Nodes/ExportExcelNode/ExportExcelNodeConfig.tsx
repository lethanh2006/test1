import { ConfigProps, ExportExcelConfig } from '@/components/Nodes/type';
import { VariableSelector } from '@/components/Nodes/components/VariableSelector';
import { useIntl } from '@umijs/max';
import { Button, Checkbox, Form, Input, InputNumber, Space } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect, useRef } from 'react';
import { handleNodeValuesChange } from '../utils';

export const ExportExcelNodeConfig = ({
	initialValues,
	onValuesChange,
	availableVariables,
	form: propsForm,
}: ConfigProps<ExportExcelConfig>) => {
	const intl = useIntl();
	const [localForm] = Form.useForm();
	const form = propsForm || localForm;
	const initializedRef = useRef(false);

	useEffect(() => {
		if (!initializedRef.current) {
			form.setFieldsValue({
			    ...initialValues,
			    data: typeof initialValues.data !== 'string' && initialValues.data ? JSON.stringify(initialValues.data) : initialValues.data
			});
			initializedRef.current = true;
		}
	}, [initialValues, form]);

	return (
		<Form
			form={form}
			layout='vertical'
			onValuesChange={(changed, all) => handleNodeValuesChange(changed, all, form, onValuesChange)}
		>
			<Form.Item
				name='id'
				label={intl.formatMessage({ id: 'workflow.node.code' })}
				rules={[{ required: true, message: intl.formatMessage({ id: 'workflow.node.code.required' }) }]}
			>
				<Input placeholder={intl.formatMessage({ id: 'workflow.node.code.placeholder' })} />
			</Form.Item>

			<Form.Item
				name='label'
				label={intl.formatMessage({ id: 'workflow.node.label' })}
				rules={[{ required: true, message: intl.formatMessage({ id: 'workflow.node.label.required' }) }]}
			>
				<Input placeholder={intl.formatMessage({ id: 'workflow.node.label.placeholder' })} />
			</Form.Item>

			<Form.Item name='save' valuePropName='checked'>
				<Checkbox>Lưu file vào hệ thống (Trả về URL)</Checkbox>
			</Form.Item>

			<Form.Item
				name='fileName'
				label='File Name'
			>
				<Input placeholder='DanhSachHoSo_BaoCao.xlsx' />
			</Form.Item>

			<Form.Item
				name='data'
				label='Data Source'
				rules={[{ required: true, message: 'Source data is required' }]}
			>
				<VariableSelector
					availableVariables={availableVariables}
					placeholder='={{NODE_GET_INSTANCES}}'
				/>
			</Form.Item>

			<Form.List name='columns'>
				{(fields, { add, remove }) => (
					<>
						<Form.Item label='Columns Configuration'>
							<Button type='dashed' onClick={() => add({})} block icon={<PlusOutlined />}>
								Thêm Cột
							</Button>
						</Form.Item>
						{fields.map(({ key, name, ...restField }) => (
							<Space key={key} style={{ display: 'flex', marginBottom: 8 }} align='baseline'>
								<Form.Item
									{...restField}
									name={[name, 'key']}
									rules={[{ required: true, message: 'Key is required' }]}
								>
									<Input placeholder='Key (e.g. name)' />
								</Form.Item>
								<Form.Item
									{...restField}
									name={[name, 'title']}
									rules={[{ required: true, message: 'Title is required' }]}
								>
									<Input placeholder='Title (e.g. Họ Tên)' />
								</Form.Item>
								<Form.Item
									{...restField}
									name={[name, 'width']}
								>
									<InputNumber placeholder='Width' min={1} />
								</Form.Item>
								<DeleteOutlined onClick={() => remove(name)} style={{ color: '#ff4d4f' }} />
							</Space>
						))}
					</>
				)}
			</Form.List>
		</Form>
	);
};

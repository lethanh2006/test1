import ButtonExtend from '@/components/Table/ButtonExtend';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Form, Select, Space } from 'antd';
import { useIntl } from 'umi';
import { useTableContext } from '../components/TableContext';
import { EOperatorType } from '../constant';
import { useFilterFields } from '../hooks/useFilterFields';
import { type RowFilterProps } from '../typing';
import RowFilter from './RowFilter';

const FilterGroup = (props: RowFilterProps) => {
	const intl = useIntl();
	const { name, onRemove, allowGrouping = true, level = 0, formOwner, parentPath, ...restProps } = props;
	const { finalColumns: columns } = useTableContext();
	const formInstance = Form.useFormInstance();
	const { fieldsFilterable } = useFilterFields(columns, formInstance);

	const namePath = Array.isArray(name) ? name : [name];
	const fullPath = parentPath ? [...parentPath, ...namePath] : ['filters', ...namePath];

	return (
		<Card
			size='small'
			styles={{ body: { padding: 8 } }}
			style={{
				backgroundColor: level === 0 ? '#f9f9f9' : '#f0f8ff',
				border: level === 0 ? '1px solid #d9d9d9' : '1px solid #91d5ff',
			}}
			title={
				<Space>
					<Form.Item valuePropName='checked' initialValue={true} name={[...namePath, 'active']} noStyle>
						<Checkbox>{intl.formatMessage({ id: 'global.table.customfilter.label.nhomdieukien' })}</Checkbox>
					</Form.Item>
					<Form.Item name={[...namePath, 'operator']} initialValue='and' style={{ margin: 0 }} noStyle>
						<Select
							options={[
								{ label: intl.formatMessage({ id: `global.table.operator.${EOperatorType.AND}` }), value: 'and' },
								{ label: intl.formatMessage({ id: `global.table.operator.${EOperatorType.OR}` }), value: 'or' },
							]}
							style={{ width: 100 }}
							size='small'
						/>
					</Form.Item>
				</Space>
			}
			extra={
				onRemove && (
					<ButtonExtend
						type='text'
						size='small'
						icon={<CloseOutlined />}
						onClick={onRemove}
						danger
						tooltip={intl.formatMessage({ id: 'global.table.customfilter.button.xoanhomdieukien' })}
					/>
				)
			}
		>
			<Form.List name={[...namePath, 'filters']}>
				{(fields, { remove, add }) => (
					<>
						{fields.map((field, index) => {
							return (
								<RowFilter
									key={field.key}
									name={field.name}
									parentPath={[...fullPath, 'filters']}
									onRemove={() => remove(field.name)}
									allowGrouping={allowGrouping}
									level={level + 1}
									formOwner={formOwner}
									{...restProps}
								/>
							);
						})}

						<Space style={{ marginTop: '12px' }}>
							<Button
								type='dashed'
								size='small'
								icon={<PlusOutlined />}
								onClick={() => {
									const firstAvailableField = fieldsFilterable[0]?.replace(/"/g, '') ?? '';
									if (!firstAvailableField) return;
									add({
										active: true,
										field: firstAvailableField,
										operator: undefined,
										values: [],
									});
								}}
								disabled={!fieldsFilterable.length}
							>
								{intl.formatMessage({ id: 'global.table.customfilter.button.them' })}
							</Button>
						</Space>
					</>
				)}
			</Form.List>
		</Card>
	);
};

export default FilterGroup;

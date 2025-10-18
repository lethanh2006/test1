import rules from '@/utils/rules';
import { CloseOutlined, PlusOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Col, Divider, Form, Input, InputNumber, Row, Select, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import MyDatePicker from '../MyDatePicker';
import ButtonExtend from './ButtonExtend';
import { EOperatorType, OperatorLabel } from './constant';
import { type RowFilterProps, type TDataOption, type TFilter } from './typing';

const { Text } = Typography;

const RowFilter = (props: RowFilterProps) => {
	const { index, columns, filter, onChange, fieldsFilterable, onRemove, allowGrouping = false, level = 0, path = ['filters', index] } = props;
	const [operators, setOperators] = useState<EOperatorType[]>([]);
	const filterColumn = columns.find((item) => JSON.stringify(item.dataIndex) === JSON.stringify(filter.field));
	const filterType = filterColumn?.filterType;

	useEffect(() => {
		let opers: EOperatorType[];
		switch (filterType) {
			case 'string':
				opers = [
					EOperatorType.CONTAIN,
					EOperatorType.NOT_CONTAIN,
					EOperatorType.START_WITH,
					EOperatorType.END_WITH,
					EOperatorType.EQUAL,
					EOperatorType.NOT_EQUAL,
					EOperatorType.NULL,
					EOperatorType.NOT_NULL,
				];
				break;
			case 'number':
			case 'date':
			case 'datetime':
				opers = [
					EOperatorType.EQUAL,
					EOperatorType.NOT_EQUAL,
					EOperatorType.LESS_THAN,
					EOperatorType.LESS_EQUAL,
					EOperatorType.GREAT_THAN,
					EOperatorType.GREAT_EQUAL,
					EOperatorType.BETWEEN,
					EOperatorType.NOT_BETWEEN,
				];
				break;
			case 'select':
			case 'customselect':
				opers = [EOperatorType.INCLUDE, EOperatorType.NOT_INCLUDE];
				break;

			default:
				opers = [];
				break;
		}
		setOperators(opers);
	}, [filterType]);

	const renderDataComponent = () => {
		switch (filterType) {
			case 'string':
				return <Input placeholder='Giá trị' />;
			case 'date':
				return <MyDatePicker />;
			case 'datetime':
				return <MyDatePicker format='DD/MM/YYYY HH:mm' showTime />;
			case 'number':
				return <InputNumber style={{ width: '100%' }} placeholder='Giá trị' />;
			case 'select':
				return (
					<Select
						options={filterColumn?.filterData?.map((item: string | TDataOption) =>
							typeof item === 'string'
								? { key: item, value: item, label: item }
								: { key: item.value, value: item.value, label: item.label },
						)}
						mode='multiple'
						optionFilterProp='label'
						placeholder='Chọn giá trị'
						showSearch
					/>
				);
			case 'customselect':
				return filterColumn?.filterCustomSelect;

			default:
				return <></>;
		}
	};

	const isGroup = filter.filters && Array.isArray(filter.filters);
	if (isGroup) {
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
						<Text strong>Nhóm điều kiện:</Text>
						<Select
							value={filter.logicOperator || 'and'}
							onChange={(operator: 'and' | 'or') => {
								onChange({
									...filter,
									logicOperator: operator,
								});
							}}
							options={[
								{ label: OperatorLabel[EOperatorType.AND], value: 'and' },
								{ label: OperatorLabel[EOperatorType.OR], value: 'or' },
							]}
							style={{ width: 100 }}
							size='small'
						/>
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
							tooltip='Xóa nhóm điều kiện'
						/>
					)
				}
			>
				{filter.filters?.map((subFilter, subIndex) => (
					<div key={subIndex}>
						{subIndex > 0 && (
							<Divider style={{ margin: '8px 0' }}>
								<Text type='secondary'>
									{filter.logicOperator === 'or' ? OperatorLabel[EOperatorType.OR] : OperatorLabel[EOperatorType.AND]}
								</Text>
							</Divider>
						)}

						<RowFilter
							index={subIndex}
							columns={columns}
							filter={subFilter}
							fieldsFilterable={fieldsFilterable}
							level={level + 1}
							path={[...path, 'filters', subIndex]}
							onChange={(updatedFilter) => {
								const updatedFilters = [...(filter.filters || [])];
								updatedFilters[subIndex] = updatedFilter;
								onChange({
									...filter,
									filters: updatedFilters,
								});
							}}
							onRemove={() => {
								const updatedFilters = (filter.filters || []).filter((_, i) => i !== subIndex);
								onChange({
									...filter,
									filters: updatedFilters,
								});
							}}
							allowGrouping={true}
						/>
					</div>
				))}

				<Space style={{ marginTop: '12px' }}>
					<Button
						type='dashed'
						size='small'
						icon={<PlusOutlined />}
						onClick={() => {
							const newFilter: TFilter<any> = {
								active: true,
								field: fieldsFilterable[0]?.replace(/"/g, '') ?? '',
								values: [],
							};
							onChange({
								...filter,
								filters: [...(filter.filters || []), newFilter],
							});
						}}
						disabled={!fieldsFilterable.length}
					>
						Thêm điều kiện
					</Button>
					{/* {level <= 0 && (
						<Button
							type='dashed'
							size='small'
							icon={<PlusSquareOutlined />}
							onClick={() => {
								const newGroup: TFilter<any> = {
									logicOperator: 'and',
									filters: [],
								};
								onChange({
									...filter,
									filters: [...(filter.filters || []), newGroup],
								});
							}}
						>
							Thêm nhóm
						</Button>
					)} */}
				</Space>
			</Card>
		);
	}

	return (
		<Card styles={{ body: { padding: 8 } }} variant='borderless'>
			<Row gutter={[8, 8]}>
				<Col span={22} md={23}>
					<Row gutter={[8, 0]}>
						<Col span={12}>
							<Form.Item
								rules={[...rules.required]}
								label={
									<Space>
										<Form.Item
											name={[...path, 'active']}
											valuePropName='checked'
											initialValue={true}
											style={{ margin: 0 }}
											noStyle
										>
											<Checkbox
												checked={filter.active}
												onChange={(e) => {
													onChange({ ...filter, active: e.target.checked });
												}}
											/>
										</Form.Item>{' '}
										Thuộc tính
									</Space>
								}
							>
								<Select
									options={columns
										.filter(
											(item) =>
												fieldsFilterable.includes(JSON.stringify(item.dataIndex)) ||
												JSON.stringify(item.dataIndex) === JSON.stringify(filter.field),
										)
										.map((item) => ({
											key: item.dataIndex?.toString() ?? '',
											value: Array.isArray(item.dataIndex)
												? item.dataIndex.join('.')
												: (item.dataIndex?.toString() ?? ''),
											label: item.title,
										}))}
									value={Array.isArray(filter.field) ? filter.field.join('.') : filter.field?.toString()}
									onChange={(val: string) => {
										const temp = { ...filter };
										temp.field = val;
										onChange(temp);
									}}
									placeholder='Chọn thuộc tính'
								/>
							</Form.Item>
						</Col>

						<Col span={12}>
							<Form.Item rules={[...rules.required]} label='Điều kiện'>
								<Select
									options={operators.map((item) => ({
										key: item,
										value: item,
										label: OperatorLabel[item],
									}))}
									value={filter.operator}
									onChange={(val: EOperatorType) => {
										const temp = { ...filter };
										temp.operator = val;
										onChange(temp);
									}}
									placeholder='Chọn điều kiện'
								/>
							</Form.Item>
						</Col>

						{!!filter.operator &&
							filter.operator !== EOperatorType.NULL &&
							filter.operator !== EOperatorType.NOT_NULL ? (
							<>
								<Col
									span={24}
									md={
										filter.operator === EOperatorType.BETWEEN || filter.operator === EOperatorType.NOT_BETWEEN ? 12 : 24
									}
								>
									<Form.Item
										name={
											filter.operator === EOperatorType.INCLUDE || filter.operator === EOperatorType.NOT_INCLUDE
												? [...path, 'values']
												: [...path, 'values', 0]
										}
										rules={[...rules.required]}
										label='Giá trị'
									>
										{renderDataComponent()}
									</Form.Item>
								</Col>

								{filter.operator === EOperatorType.BETWEEN || filter.operator === EOperatorType.NOT_BETWEEN ? (
									<Col span={24} md={12}>
										<Form.Item name={[...path, 'values', 1]} rules={[...rules.required]} label='Giá trị đến'>
											{renderDataComponent()}
										</Form.Item>
									</Col>
								) : null}
							</>
						) : null}
					</Row>
				</Col>

				<Col span={2} md={1}>
					<Space direction='vertical' align='center' style={{ width: '100%' }} size={4}>
						{allowGrouping && level === 0 && (
							<ButtonExtend
								type='text'
								size='small'
								icon={<PlusSquareOutlined />}
								onClick={() => {
									onChange({
										active: true,
										logicOperator: 'and',
										filters: [{ ...filter }],
									});
								}}
								tooltip='Chuyển thành nhóm'
							/>
						)}
						{onRemove && (
							<ButtonExtend
								type='text'
								size='small'
								icon={<CloseOutlined />}
								onClick={onRemove}
								danger
								tooltip='Xóa điều kiện'
							/>
						)}
					</Space>
				</Col>
			</Row>
		</Card>
	);
};

export default RowFilter;

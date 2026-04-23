import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Row, Select, Space, Typography, theme } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { VariableSelector } from '../../components/VariableSelector';

const { Text } = Typography;

interface FieldMappingConfigProps {
	availableVariables: any[];
	form: FormInstance;
}

const ObjectArrayConfig = ({ fieldIndex, availableVariables }: { fieldIndex: number; availableVariables: any[] }) => {
	return (
		<Form.List name={[fieldIndex, 'valueArray']}>
			{(objects, { add: addObj, remove: removeObj }) => (
				<Space direction='vertical' style={{ width: '100%' }} size='small'>
					{objects.map((obj, objIndex) => (
						<Row key={obj.key} gutter={8} align='middle'>
							<Col span={1}>
								<Form.Item>
									<Text type='secondary'>{objIndex + 1}.</Text>
								</Form.Item>
							</Col>
							<Col span={10}>
								<Form.Item
									name={[obj.name, 0, 'name']}
									rules={[{ required: true, message: 'Yêu cầu tên' }]}
									style={{ marginBottom: 0 }}
								>
									<Input placeholder='Tên thuộc tính' />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item name={[obj.name, 0, 'value']} style={{ marginBottom: 0 }}>
									<VariableSelector availableVariables={availableVariables} placeholder='Giá trị mapping' />
								</Form.Item>
							</Col>
							<Col span={1}>
								<Form.Item>
									<DeleteOutlined onClick={() => removeObj(obj.name)} style={{ color: '#ff4d4f', cursor: 'pointer' }} />
								</Form.Item>
							</Col>
							<Form.Item name={[obj.name, 0, 'isArray']} initialValue={false} hidden>
								<Input />
							</Form.Item>
						</Row>
					))}
					<Button
						type='dashed'
						size='small'
						onClick={() => addObj([{ name: '', value: '', isArray: false }])}
						block
						icon={<PlusOutlined />}
					>
						Thêm thuộc tính cho đối tượng
					</Button>
				</Space>
			)}
		</Form.List>
	);
};

export const FieldMappingConfig = ({ availableVariables, form }: FieldMappingConfigProps) => {
	const { token } = theme.useToken();

	const handleTypeChange = (fieldIndex: number, isArray: boolean) => {
		if (isArray) {
			form.setFieldValue(['fields', fieldIndex, 'value'], undefined);
			const currentValueArray = form.getFieldValue(['fields', fieldIndex, 'valueArray']);
			if (!currentValueArray || currentValueArray.length === 0) {
				form.setFieldValue(['fields', fieldIndex, 'valueArray'], [[{ name: '', value: '', isArray: false }]]);
			}
		} else {
			form.setFieldValue(['fields', fieldIndex, 'valueArray'], undefined);
			form.setFieldValue(['fields', fieldIndex, 'value'], '');
		}
	};

	return (
		<Form.List name='fields'>
			{(fields, { add, remove }) => (
				<Space direction='vertical' style={{ width: '100%' }} size='middle'>
					{fields.map((field) => (
						<Card key={field.key} size='small'>
							<Row gutter={12} align='top'>
								<Col span={8}>
									<Form.Item
										name={[field.name, 'name']}
										label='Tên trường'
										rules={[
											{ required: true, message: 'Yêu cầu tên' },
											{ pattern: /^[a-zA-Z0-9_]+$/, message: 'Chỉ cho phép a-z, 0-9, _' },
											({ getFieldValue }) => ({
												validator(_, value) {
													const allFields = getFieldValue('fields') || [];
													const isDuplicate = allFields.some(
														(item: any, idx: number) => item?.name === value && idx !== field.name,
													);
													if (isDuplicate) {
														return Promise.reject(new Error('Trùng tên trường'));
													}
													return Promise.resolve();
												},
											}),
										]}
									>
										<Input placeholder='Ví dụ: fullName' />
									</Form.Item>
								</Col>

								<Col span={4}>
									<Form.Item name={[field.name, 'isArray']} initialValue={false} label='Loại dữ liệu'>
										<Select
											options={[
												{ label: 'TEXT', value: false },
												{ label: 'OBJECT', value: true },
											]}
											onChange={(isArray) => handleTypeChange(field.name, isArray)}
										/>
									</Form.Item>
								</Col>

								<Col span={11}>
									<Form.Item
										noStyle
										shouldUpdate={(prev, curr) =>
											prev.fields?.[field.name]?.isArray !== curr.fields?.[field.name]?.isArray
										}
									>
										{({ getFieldValue }) => {
											const isArray = getFieldValue(['fields', field.name, 'isArray']);

											if (isArray) {
												return (
													<Form.Item
														noStyle
														shouldUpdate={(prev, curr) =>
															prev.fields?.[field.name]?.valueArray !== curr.fields?.[field.name]?.valueArray
														}
													>
														{({ getFieldValue: getVal }) => {
															const valueArray = getVal(['fields', field.name, 'valueArray']);
															const count = Array.isArray(valueArray) ? valueArray.length : 0;
															return (
																<Form.Item label='Số lượng đối tượng'>
																	<div style={{ height: 32, display: 'flex', alignItems: 'center' }}>
																		<Text strong style={{ color: token.colorPrimary }}>
																			{count} đối tượng
																		</Text>
																	</div>
																</Form.Item>
															);
														}}
													</Form.Item>
												);
											}

											return (
												<Form.Item name={[field.name, 'value']} initialValue='' label='Giá trị mapping'>
													<VariableSelector availableVariables={availableVariables} placeholder='Ví dụ: {{data}}' />
												</Form.Item>
											);
										}}
									</Form.Item>
								</Col>
								<Col span={1} style={{ textAlign: 'right', paddingTop: 30 }}>
									<Form.Item>
										<DeleteOutlined
											onClick={() => remove(field.name)}
											style={{ color: '#ff4d4f', cursor: 'pointer' }}
										/>
									</Form.Item>
								</Col>
							</Row>

							<Form.Item
								noStyle
								shouldUpdate={(prev, curr) => prev.fields?.[field.name]?.isArray !== curr.fields?.[field.name]?.isArray}
							>
								{({ getFieldValue }) => {
									const isArray = getFieldValue(['fields', field.name, 'isArray']);
									if (isArray) {
										return (
											<div style={{ marginTop: 12 }}>
												<ObjectArrayConfig fieldIndex={field.name} availableVariables={availableVariables} />
											</div>
										);
									}
									return null;
								}}
							</Form.Item>
						</Card>
					))}

					<Button
						type='dashed'
						onClick={() => add({ name: '', isArray: false, value: '' })}
						block
						icon={<PlusOutlined />}
					>
						Thêm trường mới
					</Button>
				</Space>
			)}
		</Form.List>
	);
};

import { EditFieldsConfig } from '@/components/Nodes/EditFieldNode/util';
import { VariableSelector } from '@/components/Nodes/components/VariableSelector';
import { ConfigProps } from '@/components/Nodes/type';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import { Button, Card, Col, Form, Input, Row, Select } from 'antd';
import { useEffect, useRef } from 'react';
import { handleNodeValuesChange } from '../utils';

const EditFieldNodeConfig = ({ initialValues, onValuesChange, availableVariables }: ConfigProps<EditFieldsConfig>) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const initializedRef = useRef(false);

	useEffect(() => {
		if (!initializedRef.current) {
			form.setFieldsValue(initialValues);
			initializedRef.current = true;
		}
	}, [form, initialValues]);

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

			{/* Fields List */}
			<Form.List name='fields'>
				{(fields, { add, remove }) => (
					<>
						<Form.Item label='Danh sách trường chỉnh sửa'>
							<Button
								type='dashed'
								onClick={() => add({ name: '', type: 'string', value: '' })}
								block
								icon={<PlusOutlined />}
							>
								Thêm trường
							</Button>
						</Form.Item>
						{fields.map(({ key, name, ...restField }) => (
							<Card key={key} size='small' style={{ marginBottom: 12 }}>
								<Row gutter={12} align='top'>
									<Col span={8}>
										<Form.Item
											{...restField}
											name={[name, 'name']}
											label='Tên trường'
											rules={[
												{ required: true, message: 'Yêu cầu tên trường' },
												{ pattern: /^[a-zA-Z0-9_]+$/, message: 'Chỉ cho phép a-z, 0-9, _' },
											]}
										>
											<Input placeholder='Ví dụ: key1, ABC123' />
										</Form.Item>
									</Col>
									<Col span={4}>
										<Form.Item {...restField} name={[name, 'type']} label='Kiểu dữ liệu' initialValue='string'>
											<Select
												options={[
													{ label: 'String', value: 'string' },
													{ label: 'Object', value: 'object' },
													{ label: 'Number', value: 'number' },
													{ label: 'Boolean', value: 'boolean' },
													{ label: 'Array', value: 'array' },
													{ label: 'Date', value: 'date' },
												]}
											/>
										</Form.Item>
									</Col>
									<Col span={11}>
										<Form.Item {...restField} name={[name, 'value']} label='Giá trị (Mapping)'>
											<VariableSelector
												availableVariables={availableVariables || []}
												placeholder='Chọn biến hoặc nhập giá trị'
											/>
										</Form.Item>
									</Col>
									<Col span={1} style={{ textAlign: 'right', paddingTop: 30 }}>
										<Form.Item>
											<DeleteOutlined onClick={() => remove(name)} style={{ color: '#ff4d4f', cursor: 'pointer' }} />
										</Form.Item>
									</Col>
								</Row>
							</Card>
						))}
					</>
				)}
			</Form.List>
		</Form>
	);
};

export default EditFieldNodeConfig;

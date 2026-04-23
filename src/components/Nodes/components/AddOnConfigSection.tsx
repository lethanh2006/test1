import {
	CheckCircleOutlined,
	CloseCircleOutlined,
	DeleteOutlined,
	DownloadOutlined,
	FileExcelOutlined,
	FilePdfOutlined,
	FileTextOutlined,
	LinkOutlined,
	MailOutlined,
	PlusOutlined,
	PrinterOutlined,
	RightCircleOutlined,
	SaveOutlined,
	SearchOutlined,
	SendOutlined,
	SettingOutlined,
	TeamOutlined,
	UploadOutlined,
	UserOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Divider, Flex, Form, FormInstance, Input, Row, Select, Space, Switch } from 'antd';
import { AddOnScope } from '../type';
import { VariableSelector } from './VariableSelector';

const AVAILABLE_ICONS = [
	{ name: 'Khởi chạy (RightCircle)', value: 'RightCircleOutlined', icon: <RightCircleOutlined /> },
	{ name: 'Tải xuống (Download)', value: 'DownloadOutlined', icon: <DownloadOutlined /> },
	{ name: 'Tải lên (Upload)', value: 'UploadOutlined', icon: <UploadOutlined /> },
	{ name: 'Máy in (Printer)', value: 'PrinterOutlined', icon: <PrinterOutlined /> },
	{ name: 'Excel (FileExcel)', value: 'FileExcelOutlined', icon: <FileExcelOutlined /> },
	{ name: 'PDF (FilePdf)', value: 'FilePdfOutlined', icon: <FilePdfOutlined /> },
	{ name: 'Email (Mail)', value: 'MailOutlined', icon: <MailOutlined /> },
	{ name: 'Gửi (Send)', value: 'SendOutlined', icon: <SendOutlined /> },
	{ name: 'Duyệt (CheckCircle)', value: 'CheckCircleOutlined', icon: <CheckCircleOutlined /> },
	{ name: 'Từ chối (CloseCircle)', value: 'CloseCircleOutlined', icon: <CloseCircleOutlined /> },
	{ name: 'Cấu hình (Setting)', value: 'SettingOutlined', icon: <SettingOutlined /> },
	{ name: 'Người dùng (User)', value: 'UserOutlined', icon: <UserOutlined /> },
	{ name: 'Nhóm (Team)', value: 'TeamOutlined', icon: <TeamOutlined /> },
	{ name: 'Văn bản (FileText)', value: 'FileTextOutlined', icon: <FileTextOutlined /> },
	{ name: 'Lưu (Save)', value: 'SaveOutlined', icon: <SaveOutlined /> },
	{ name: 'Tìm kiếm (Search)', value: 'SearchOutlined', icon: <SearchOutlined /> },
	{ name: 'Liên kết (Link)', value: 'LinkOutlined', icon: <LinkOutlined /> },
];

export const AddOnConfigSection = ({
	form,
	nodes,
	availableVariables,
	addonVariablesMap,
}: {
	form: FormInstance;
	nodes?: any[];
	availableVariables?: any[];
	addonVariablesMap?: Record<string, any[]>;
}) => {
	return (
		<Form.List name={['addOn', 'actions']}>
			{(fields, { add, remove }) => (
				<>
					<Form.Item>
						<Button
							type='dashed'
							onClick={() => add({ enabled: true, scope: AddOnScope.GLOBAL })}
							block
							icon={<PlusOutlined />}
						>
							Thêm Add-on Action
						</Button>
					</Form.Item>
					{fields.map(({ key, name, ...restField }) => (
						<Card
							key={key}
							size='small'
							style={{ marginBottom: 16, position: 'relative' }}
							title={`Action ${name + 1}`}
							extra={<DeleteOutlined onClick={() => remove(name)} style={{ color: '#ff4d4f' }} />}
						>
							<Row gutter={8}>
								<Col span={12}>
									<Form.Item
										{...restField}
										name={[name, 'id']}
										label='ID'
										rules={[{ required: true, message: 'Bắt buộc' }]}
									>
										<Input placeholder='action_id' />
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item
										{...restField}
										name={[name, 'name']}
										label='Tên (Label)'
										rules={[{ required: true, message: 'Bắt buộc' }]}
									>
										<Input placeholder='Tên Action' />
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={8}>
								<Col span={8}>
									<Form.Item {...restField} name={[name, 'icon']} label='Icon'>
										<Select allowClear placeholder='Chọn Icon' showSearch optionFilterProp='children'>
											{AVAILABLE_ICONS.map((i) => (
												<Select.Option key={i.value} value={i.value} label={i.name}>
													<Space>
														{i.icon}
														{i.name}
													</Space>
												</Select.Option>
											))}
										</Select>
									</Form.Item>
								</Col>
								<Col span={8}>
									<Form.Item
										{...restField}
										name={[name, 'scope']}
										label='Scope'
										rules={[{ required: true, message: 'Bắt buộc' }]}
									>
										<Select>
											<Select.Option value={AddOnScope.GLOBAL}>GLOBAL</Select.Option>
											<Select.Option value={AddOnScope.INSTANCE}>INSTANCE</Select.Option>
										</Select>
									</Form.Item>
								</Col>
								<Col span={8}>
									<Form.Item {...restField} name={[name, 'enabled']} label='Kích hoạt' valuePropName='checked'>
										<Switch />
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={8}>
								<Col span={24}>
									<Form.Item
										{...restField}
										name={[name, 'nextNodeId']}
										label='Add on Node'
										rules={[{ required: true, message: 'Bắt buộc' }]}
									>
										<Select allowClear placeholder='Chọn node'>
											{nodes?.map((n) => (
												<Select.Option key={n.id} value={n.id}>
													{n.id} - {n.data?.label}
												</Select.Option>
											))}
										</Select>
									</Form.Item>
								</Col>
							</Row>

							<Divider plain style={{ margin: '8px 0' }} orientation='left'>
								Response Mappings
							</Divider>
							<Form.List name={[name, 'response']}>
								{(resFields, { add: addRes, remove: resRemove }) => (
									<>
										{resFields.map(({ key: resKey, name: resName, ...resRestField }) => (
											<Flex key={resKey} style={{ marginBottom: 8, width: '100%' }} align='flex-start' gap={8}>
												<Form.Item
													{...resRestField}
													name={[resName, 'key']}
													rules={[{ required: true, message: 'Key required' }]}
													style={{ marginBottom: 0 }}
												>
													<Input placeholder='Key (e.g., url)' style={{ width: 150 }} />
												</Form.Item>
												<Form.Item
													{...resRestField}
													name={[resName, 'value']}
													rules={[{ required: true, message: 'Value required' }]}
													style={{ marginBottom: 0, flex: 1 }}
												>
													<VariableSelector
														availableVariables={
															form.getFieldValue(['addOn', 'actions', name, 'nextNodeId']) && addonVariablesMap
																? addonVariablesMap[form.getFieldValue(['addOn', 'actions', name, 'nextNodeId'])]
																: []
														}
														placeholder='={{node.field}}'
													/>
												</Form.Item>
												<Button
													type='text'
													danger
													icon={<DeleteOutlined />}
													onClick={() => resRemove(resName)}
													style={{ marginTop: 4 }}
												/>
											</Flex>
										))}
										<Button type='dashed' onClick={() => addRes({})} block icon={<PlusOutlined />}>
											Thêm Response Mapping
										</Button>
									</>
								)}
							</Form.List>
						</Card>
					))}
				</>
			)}
		</Form.List>
	);
};

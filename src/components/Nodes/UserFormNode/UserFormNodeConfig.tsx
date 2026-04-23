import { AddOnConfigSection } from '@/components/Nodes/components/AddOnConfigSection';
import PreviewExternalForm from '@/components/Nodes/components/PreviewExternalForm';
import { ThamQuyenSection } from '@/components/Nodes/components/ThamQuyenSection';
import { VariableSelector } from '@/components/Nodes/components/VariableSelector';
import { BaseUserConfig, ConfigProps } from '@/components/Nodes/type';
import ButtonExtend from '@/components/Table/ButtonExtend';
import SelectFormDong from '@/pages/DanhMuc/BieuMauKhaiBao/components/select/SelectFormDong';
import { DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { useIntl, useModel } from '@umijs/max';
import { Button, Card, Col, Divider, Form, Input, Modal, Row, Segmented, Select, Space, Switch, Tabs } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { handleNodeValuesChange } from '../utils';

export interface UserFormConfig extends BaseUserConfig {
	id?: string;
	externalFormId?: string;
	autoExecute?: boolean;
	dataSource?: string;
	urlFile?: string;
	editable?: boolean;
	fields?: Array<{
		name: string;
		label?: string;
		type?: string;
		required?: boolean;
		defaultValue?: string;
		readonly?: boolean;
		placeholder?: string;
	}>;
}

export const UserFormNodeConfig = ({
	initialValues,
	onValuesChange,
	availableVariables,
	nodes,
	addonVariablesMap,
}: ConfigProps<UserFormConfig>) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const initializedRef = useRef(false);
	const [formType, setFormType] = useState<'external' | 'internal'>('internal');
	const [visiblePreview, setVisiblePreview] = useState(false);
	const externalFormIdSelected = Form.useWatch('externalFormId', form);
	const { getByIdModel, record } = useModel('danhmuc.bieumau');

	useEffect(() => {
		if (externalFormIdSelected && formType === 'external') {
			getByIdModel(externalFormIdSelected, true);
		}
	}, [externalFormIdSelected, formType]);
	const autoExecute = Form.useWatch('autoExecute', form);

	useEffect(() => {
		if (!initializedRef.current) {
			form.setFieldsValue(initialValues);
			if (initialValues.externalFormId) {
				setFormType('external');
			}
			initializedRef.current = true;
		}
	}, [form, initialValues, formType, setFormType]);

	const handleSyncChange = (changedValues: any, allValues: any) => {
		if (changedValues.externalFormId) {
			form.setFieldsValue({ fields: [] });
			onValuesChange?.(changedValues, { ...allValues, fields: [] });
		} else {
			onValuesChange?.(changedValues, allValues);
		}
	};

	return (
		<>
			<Tabs defaultActiveKey='1' style={{ marginBottom: 16 }}>
				<Tabs.TabPane tab='Cấu hình Node' key='1'>
					<Form
						form={form}
						layout='vertical'
						onValuesChange={(changed, all) => handleNodeValuesChange(changed, all, form, handleSyncChange)}
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

						<Form.Item name='editable' label={'Cho phép chỉnh sửa node'} initialValue={true} valuePropName='checked'>
							<Switch />
						</Form.Item>

						<Row gutter={16}>
							<Col span={12}>
								<Form.Item
									name='autoExecute'
									label={intl.formatMessage({ id: 'workflow.node.userForm.autoExecute' })}
									valuePropName='checked'
								>
									<Switch />
								</Form.Item>
							</Col>
							<Col span={12}>
								{autoExecute && (
									<Form.Item name='dataSource' label={intl.formatMessage({ id: 'workflow.node.userForm.dataSource' })}>
										<VariableSelector availableVariables={availableVariables} placeholder='e.g., ={{context.data}}' />
									</Form.Item>
								)}
							</Col>
						</Row>

						{/* Thẩm quyền xử lý Section */}
						<ThamQuyenSection />

						<Divider orientation='left' plain style={{ margin: '24px 0 16px', fontWeight: 600, color: '#1890ff' }}>
							{intl.formatMessage({ id: 'workflow.node.userForm.section.form' })}
						</Divider>

						<Form.Item label='Loại biểu mẫu' style={{ marginBottom: 16 }}>
							<Segmented
								value={formType}
								onChange={(value) => {
									const type = value as 'external' | 'internal';
									setFormType(type);
									if (type === 'internal') {
										const updates: any = { externalFormId: undefined };

										if (initialValues?.fields && initialValues.fields.length > 0) {
											updates.fields = initialValues.fields;
										}

										form.setFieldsValue(updates);
										onValuesChange?.(updates, { ...form.getFieldsValue(), ...updates });
									} else {
										if (initialValues?.externalFormId) {
											form.setFieldValue('externalFormId', initialValues.externalFormId);
											onValuesChange?.(
												{ externalFormId: initialValues.externalFormId },
												{ ...form.getFieldsValue(), externalFormId: initialValues.externalFormId },
											);
										}
									}
								}}
								options={[
									{ label: 'External Form (Biểu mẫu động)', value: 'external' },
									{ label: 'Internal Form (Custom Fields)', value: 'internal' },
								]}
								block
							/>
						</Form.Item>

						{formType === 'external' ? (
							<>
								<Row gutter={8}>
									<Col flex={'auto'}>
										<Form.Item
											name='externalFormId'
											label={intl.formatMessage({ id: 'workflow.node.userForm.externalFormId' })}
											tooltip={intl.formatMessage({ id: 'workflow.node.userForm.externalFormId.tooltip' })}
											rules={[{ required: true, message: 'Vui lòng chọn biểu mẫu' }]}
										>
											<SelectFormDong allowClear />
										</Form.Item>
									</Col>
									<Col flex={'40px'}>
										<Form.Item label=' '>
											<ButtonExtend
												tooltip='Xem trước form'
												disabled={!externalFormIdSelected}
												onClick={() => setVisiblePreview(true)}
											>
												<EyeOutlined />
											</ButtonExtend>
										</Form.Item>
									</Col>
								</Row>
								{externalFormIdSelected && (
									<Card size='small' title='Cấu hình giá trị mặc định cho biểu mẫu' style={{ marginTop: 8 }}>
										<Form.List name='fields'>
											{(fields, { add, remove }) => (
												<>
													{fields.map(({ key, name, ...restField }) => (
														<div
															key={key}
															style={{
																padding: '8px 12px',
																marginBottom: 8,
																border: '1px solid #f0f0f0',
																borderRadius: 4,
																backgroundColor: '#fafafa',
																position: 'relative',
															}}
														>
															<DeleteOutlined
																onClick={() => remove(name)}
																style={{ position: 'absolute', top: 8, right: 8, color: '#ff4d4f', zIndex: 1 }}
															/>
															<Space direction='vertical' style={{ width: '100%' }} size={4}>
																<Row gutter={8}>
																	<Col span={12}>
																		<Form.Item
																			{...restField}
																			name={[name, 'name']}
																			label='Trường thông tin'
																			rules={[{ required: true, message: 'Vui lòng chọn trường thông tin' }]}
																			style={{ marginBottom: 4 }}
																		>
																			<Select
																				size='small'
																				showSearch
																				optionFilterProp='children'
																				placeholder='Chọn trường dữ liệu'
																				onChange={(_, option: any) => {
																					const currentFields = form.getFieldValue('fields') || [];
																					currentFields[name] = {
																						...currentFields[name],
																						label: option?.label,
																					};
																					form.setFieldsValue({ fields: currentFields });
																					onValuesChange?.({ fields: currentFields }, form.getFieldsValue());
																				}}
																				options={
																					record?.cauHinhLoaiHinh?.map((item: any) => ({
																						label: item.ten,
																						value: item.ma,
																					})) || []
																				}
																			/>
																		</Form.Item>
																	</Col>
																	<Col span={12}>
																		<Form.Item
																			{...restField}
																			name={[name, 'defaultValue']}
																			label='Giá trị mặc định'
																			style={{ marginBottom: 4 }}
																		>
																			<VariableSelector
																				availableVariables={availableVariables}
																				placeholder='e.g., ={{userForm.value}}'
																			/>
																		</Form.Item>
																	</Col>
																</Row>
															</Space>
														</div>
													))}
													<Button
														type='dashed'
														onClick={() =>
															add({
																name: undefined,
																defaultValue: undefined,
															})
														}
														block
														icon={<PlusOutlined />}
													>
														Thêm giá trị mặc định
													</Button>
												</>
											)}
										</Form.List>
									</Card>
								)}
							</>
						) : (
							<Card
								size='small'
								title={intl.formatMessage({ id: 'workflow.node.userForm.customFields' })}
								style={{ marginTop: 8 }}
							>
								<Form.List name='fields'>
									{(fields, { add, remove }) => (
										<>
											{fields.map(({ key, name, ...restField }) => (
												<div
													key={key}
													style={{
														padding: '8px 12px',
														marginBottom: 8,
														border: '1px solid #f0f0f0',
														borderRadius: 4,
														backgroundColor: '#fafafa',
														position: 'relative',
													}}
												>
													<DeleteOutlined
														onClick={() => remove(name)}
														style={{ position: 'absolute', top: 8, right: 8, color: '#ff4d4f', zIndex: 1 }}
													/>
													<Space direction='vertical' style={{ width: '100%' }} size={4}>
														<Row gutter={8}>
															<Col flex={4}>
																<Form.Item
																	{...restField}
																	name={[name, 'name']}
																	label={intl.formatMessage({ id: 'workflow.node.userForm.field.key' })}
																	rules={[
																		{
																			required: true,
																			message: intl.formatMessage({ id: 'workflow.node.userForm.field.key.required' }),
																		},
																	]}
																	style={{ marginBottom: 4 }}
																>
																	<Input size='small' placeholder='e.g., full_name' />
																</Form.Item>
															</Col>
															<Col flex={2}>
																<Form.Item
																	{...restField}
																	name={[name, 'type']}
																	label={intl.formatMessage({ id: 'workflow.node.userForm.field.type' })}
																	initialValue='text'
																	style={{ marginBottom: 4 }}
																>
																	<Select size='small' style={{ width: '100%' }}>
																		<Select.Option value='text'>Text</Select.Option>
																		<Select.Option value='number'>Number</Select.Option>
																		<Select.Option value='date'>Date</Select.Option>
																		<Select.Option value='email'>Email</Select.Option>
																		<Select.Option value='file'>File</Select.Option>
																	</Select>
																</Form.Item>
															</Col>
														</Row>
														<Form.Item
															{...restField}
															name={[name, 'label']}
															label={intl.formatMessage({ id: 'workflow.node.userForm.field.label' })}
															rules={[
																{
																	required: true,
																	message: intl.formatMessage({ id: 'workflow.node.userForm.field.label.required' }),
																},
															]}
															style={{ marginBottom: 4 }}
														>
															<Input size='small' placeholder='e.g., Họ và tên' />
														</Form.Item>
														<Form.Item
															{...restField}
															name={[name, 'defaultValue']}
															label={'Default Value'}
															style={{ marginBottom: 4 }}
														>
															<VariableSelector
																availableVariables={availableVariables}
																placeholder='e.g., ={{userForm.value}}'
															/>
														</Form.Item>
														<Form.Item
															{...restField}
															name={[name, 'placeholder']}
															label={intl.formatMessage({ id: 'workflow.node.userForm.field.placeholder' })}
															style={{ marginBottom: 4 }}
														>
															<Input size='small' placeholder='e.g., Họ và tên' />
														</Form.Item>
														<div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 24 }}>
															<Form.Item {...restField} name={[name, 'required']} valuePropName='checked' noStyle>
																<Switch size='small' />
															</Form.Item>
															<span style={{ fontSize: 12, color: 'rgba(0, 0, 0, 0.85)', userSelect: 'none' }}>
																{intl.formatMessage({ id: 'workflow.node.userForm.field.required' })}
															</span>
														</div>
														<div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 24 }}>
															<Form.Item {...restField} name={[name, 'readonly']} valuePropName='checked' noStyle>
																<Switch size='small' />
															</Form.Item>
															<span style={{ fontSize: 12, color: 'rgba(0, 0, 0, 0.85)', userSelect: 'none' }}>
																Read Only
															</span>
														</div>
													</Space>
												</div>
											))}
											<Button
												type='dashed'
												onClick={() =>
													add({
														name: '',
														label: '',
														type: 'text',
														required: false,
													})
												}
												block
												icon={<PlusOutlined />}
											>
												{intl.formatMessage({ id: 'workflow.node.userForm.field.add' })}
											</Button>
										</>
									)}
								</Form.List>
							</Card>
						)}
					</Form>
				</Tabs.TabPane>
				<Tabs.TabPane tab='Cấu hình Add-on' key='2'>
					<Form
						form={form}
						layout='vertical'
						onValuesChange={(changed, all) => handleNodeValuesChange(changed, all, form, handleSyncChange)}
					>
						<AddOnConfigSection
							form={form}
							nodes={nodes}
							availableVariables={availableVariables}
							addonVariablesMap={addonVariablesMap}
						/>
					</Form>
				</Tabs.TabPane>
			</Tabs>
			<Modal
				zIndex={1000}
				styles={{ body: { padding: 0 } }}
				footer={
					<Button type='primary' onClick={() => setVisiblePreview(false)}>
						OK
					</Button>
				}
				width={900}
				open={visiblePreview}
				onCancel={() => setVisiblePreview(false)}
			>
				{visiblePreview && <PreviewExternalForm externalFormId={externalFormIdSelected} />}
			</Modal>
		</>
	);
};

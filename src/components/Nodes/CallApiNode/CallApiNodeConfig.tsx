import { ConfigProps } from '@/components/Nodes/type';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import { Button, Form, Input, Radio, Select, Tabs } from 'antd';
import { useEffect, useRef } from 'react';
import { handleNodeValuesChange } from '../utils';
import { VariableSelector } from '../components/VariableSelector';

export interface ApiCallConfig {
	id?: string;
	type: 'http' | 'internal';
	url?: string;
// ... (omitted lines in instruction, but I'll write the full block)
	pattern?: string;
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	headers?: Record<string, string>;
	query?: Record<string, any>;
	body?: any;
	payload?: any;
	response?: string[];
	tcpClient?: 'local' | 'core';
}

export const CallApiNodeConfig = ({
	initialValues,
	onValuesChange,
	availableVariables,
	form: propsForm,
}: ConfigProps<ApiCallConfig>) => {
	const intl = useIntl();
	const [localForm] = Form.useForm();
	const form = propsForm || localForm;
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

			<Form.Item name='type' label={intl.formatMessage({ id: 'workflow.node.callApi.type' })} initialValue='http'>
				<Radio.Group>
					<Radio.Button value='http'>HTTP</Radio.Button>
					<Radio.Button value='internal'>Internal</Radio.Button>
				</Radio.Group>
			</Form.Item>

			<Form.Item noStyle shouldUpdate={(prev, curr) => prev.type !== curr.type}>
				{({ getFieldValue }) => {
					const type = getFieldValue('type');
					return type === 'http' ? (
						<>
							<div style={{ display: 'flex', gap: 8, width: '100%' }}>
								<Form.Item
									name='method'
									label={intl.formatMessage({ id: 'workflow.node.callApi.method' })}
									initialValue='GET'
									style={{ marginBottom: 16 }}
								>
									<Select style={{ width: 100 }}>
										<Select.Option value='GET'>GET</Select.Option>
										<Select.Option value='POST'>POST</Select.Option>
										<Select.Option value='PUT'>PUT</Select.Option>
										<Select.Option value='PATCH'>PATCH</Select.Option>
										<Select.Option value='DELETE'>DELETE</Select.Option>
									</Select>
								</Form.Item>
								<Form.Item
									name='url'
									label='URL'
									rules={[
										{ required: true, message: intl.formatMessage({ id: 'workflow.node.callApi.url.required' }) },
									]}
									style={{ flex: 1, marginBottom: 16 }}
								>
									<VariableSelector
										availableVariables={availableVariables}
										placeholder='https://api.example.com/v1/resource'
									/>
								</Form.Item>
							</div>
						</>
					) : (
						<>
							<Form.Item
								name='pattern'
								label={intl.formatMessage({ id: 'workflow.node.callApi.pattern' })}
								rules={[
									{ required: true, message: intl.formatMessage({ id: 'workflow.node.callApi.pattern.required' }) },
								]}
							>
								<Input placeholder='e.g., data-partition-user/get-one' />
							</Form.Item>
							<Form.Item
								name='tcpClient'
								label={intl.formatMessage({ id: 'workflow.node.callApi.tcpClient' })}
								initialValue='core'
							>
								<Radio.Group>
									<Radio.Button value='local'>Local</Radio.Button>
									<Radio.Button value='core'>Core</Radio.Button>
									<Radio.Button value='qldt'>QLDT</Radio.Button>
								</Radio.Group>
							</Form.Item>
						</>
					);
				}}
			</Form.Item>

			<Tabs
				size='small'
				items={[
					{
						key: 'params',
						label: intl.formatMessage({ id: 'workflow.node.callApi.tabs.params' }),
						children: (
							<Form.Item noStyle shouldUpdate={(prev, curr) => prev.type !== curr.type}>
								{({ getFieldValue }) => {
									const type = getFieldValue('type');
									if (type !== 'http')
										return (
											<div style={{ color: '#8c8c8c' }}>
												{intl.formatMessage({ id: 'workflow.node.callApi.internalHint' })}
											</div>
										);
									return (
										<>
											<Form.Item label={intl.formatMessage({ id: 'workflow.node.callApi.headers' })}>
												<Form.List name='headerList'>
													{(fields, { add, remove }) => (
														<>
															{fields.map(({ key, name, ...restField }) => (
																<div
																	key={key}
																	style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}
																>
																	<Form.Item {...restField} name={[name, 'key']} style={{ marginBottom: 0, flex: 1 }}>
																		<Input placeholder='Key' />
																	</Form.Item>
																	<Form.Item {...restField} name={[name, 'value']} style={{ marginBottom: 0, flex: 1 }}>
																		<VariableSelector availableVariables={availableVariables} placeholder='Value' />
																	</Form.Item>
																	<DeleteOutlined onClick={() => remove(name)} style={{ color: '#ff4d4f' }} />
																</div>
															))}
															<Button
																type='dashed'
																onClick={() => add({ key: '', value: '' })}
																block
																icon={<PlusOutlined />}
															>
																{intl.formatMessage({ id: 'workflow.node.callApi.addHeader' })}
															</Button>
														</>
													)}
												</Form.List>
											</Form.Item>
											<Form.Item label={intl.formatMessage({ id: 'workflow.node.callApi.queryParams' })}>
												<Form.List name='queryList'>
													{(fields, { add, remove }) => (
														<>
															{fields.map(({ key, name, ...restField }) => (
																<div
																	key={key}
																	style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}
																>
																	<Form.Item {...restField} name={[name, 'key']} style={{ marginBottom: 0, flex: 1 }}>
																		<Input placeholder='Key' />
																	</Form.Item>
																	<Form.Item {...restField} name={[name, 'value']} style={{ marginBottom: 0, flex: 1 }}>
																		<VariableSelector availableVariables={availableVariables} placeholder='Value' />
																	</Form.Item>
																	<DeleteOutlined onClick={() => remove(name)} style={{ color: '#ff4d4f' }} />
																</div>
															))}
															<Button
																type='dashed'
																onClick={() => add({ key: '', value: '' })}
																block
																icon={<PlusOutlined />}
															>
																{intl.formatMessage({ id: 'workflow.node.callApi.addQuery' })}
															</Button>
														</>
													)}
												</Form.List>
											</Form.Item>
										</>
									);
								}}
							</Form.Item>
						),
					},
					{
						key: 'data',
						label: intl.formatMessage({ id: 'workflow.node.callApi.tabs.body' }),
						children: (
							<Form.Item noStyle shouldUpdate={(prev, curr) => prev.type !== curr.type}>
								{({ getFieldValue }) => {
									const type = getFieldValue('type');
									const isHttp = type === 'http';
									return (
										<Form.Item
											name={isHttp ? 'body' : 'payload'}
											label={
												isHttp
													? intl.formatMessage({ id: 'workflow.node.callApi.body' })
													: intl.formatMessage({ id: 'workflow.node.callApi.payload' })
											}
										>
											<Input.TextArea
												rows={6}
												placeholder={isHttp ? '{"id": "{{user.id}}"}' : '{"id": 123}'}
												style={{ fontFamily: 'monospace' }}
											/>
										</Form.Item>
									);
								}}
							</Form.Item>
						),
					},
					{
						key: 'response',
						label: intl.formatMessage({ id: 'workflow.node.callApi.tabs.response' }),
						children: (
							<Form.Item label={intl.formatMessage({ id: 'workflow.node.callApi.responseMapping' })}>
								<Form.List name='response'>
									{(fields, { add, remove }) => (
										<>
											{fields.map(({ key, name, ...restField }) => (
												<div key={key} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
													<Form.Item
														{...restField}
														name={name}
														style={{ marginBottom: 0, flex: 1 }}
														rules={[
															{
																required: true,
																message: intl.formatMessage({ id: 'workflow.node.callApi.path.required' }),
															},
														]}
													>
														<Input placeholder='e.g., data.name hoặc items.0.id' />
													</Form.Item>
													<DeleteOutlined onClick={() => remove(name)} style={{ color: '#ff4d4f' }} />
												</div>
											))}
											<Button type='dashed' onClick={() => add('')} block icon={<PlusOutlined />}>
												{intl.formatMessage({ id: 'workflow.node.callApi.addOutput' })}
											</Button>
											<div style={{ fontSize: 11, color: '#8c8c8c', marginTop: 8 }}>
												{intl.formatMessage({ id: 'workflow.node.callApi.outputHint' })}
											</div>
										</>
									)}
								</Form.List>
							</Form.Item>
						),
					},
				]}
			/>
		</Form>
	);
};

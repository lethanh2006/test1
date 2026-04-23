import { ThamQuyenSection } from '@/components/Nodes/components/ThamQuyenSection';
import { BaseUserConfig, ConfigProps } from '@/components/Nodes/type';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import { Button, Form, Input, Select, Switch, Tabs } from 'antd';
import { AddOnConfigSection } from '@/components/Nodes/components/AddOnConfigSection';
import { useEffect, useRef } from 'react';
import { handleNodeValuesChange } from '../utils';

export interface UserActionConfig extends BaseUserConfig {
	id?: string;
	editable?: boolean;
// ...
	actions: Array<{
		id: string; // "approved", "rejected" - Map with key trong 'next'
		label: string; // "Phê duyệt", "Từ chối"
		variant?: 'default' | 'primary' | 'destructive' | 'secondary';
	}>;
}

export const UserActionNodeConfig = ({ initialValues, onValuesChange, availableVariables, nodes, addonVariablesMap }: ConfigProps<UserActionConfig>) => {
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
		<Tabs defaultActiveKey="1">
			<Tabs.TabPane tab="Cấu hình Node" key="1">
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

					<Form.Item name='editable' label={'Cho phép chỉnh sửa node'} initialValue={true} valuePropName='checked'>
						<Switch />
					</Form.Item>

					{/* Thẩm quyền xử lý Section */}
					<ThamQuyenSection />

					{/* Actions List */}
					<Form.List name='actions'>
						{(fields, { add, remove }) => (
							<>
								<Form.Item label={intl.formatMessage({ id: 'workflow.node.userAction.actions' })}>
									<Button type='dashed' onClick={() => add({ label: '' })} block icon={<PlusOutlined />}>
										{intl.formatMessage({ id: 'workflow.node.userAction.add' })}
									</Button>
								</Form.Item>
								{fields.map(({ key, name, ...restField }) => (
									<div
										key={key}
										style={{
											padding: '12px 12px 0 12px',
											marginBottom: 12,
											border: '1px solid #f0f0f0',
											borderRadius: 8,
											backgroundColor: '#fafafa',
											position: 'relative',
										}}
									>
										<div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
											<Form.Item
												label={'ID'}
												{...restField}
												name={[name, 'id']}
												rules={[
													{
														required: true,
														message: intl.formatMessage({ id: 'workflow.node.userAction.id.required' }),
													},
												]}
												style={{ flex: 1, marginBottom: 12 }}
											>
												<Input placeholder='ID' />
											</Form.Item>
											<Form.Item
												label={'Label'}
												{...restField}
												name={[name, 'label']}
												rules={[
													{
														required: true,
														message: intl.formatMessage({ id: 'workflow.node.userAction.label.required' }),
													},
												]}
												style={{ flex: 1, marginBottom: 12 }}
											>
												<Input placeholder={intl.formatMessage({ id: 'workflow.node.userForm.field.label' })} />
											</Form.Item>
											<Form.Item
												label={'Variant'}
												{...restField}
												name={[name, 'variant']}
												style={{ flex: 1, marginBottom: 12 }}
											>
												<Select
													placeholder={intl.formatMessage({ id: 'workflow.node.userAction.variant' })}
													style={{ width: '100%' }}
												>
													<Select.Option value='default'>Default</Select.Option>
													<Select.Option value='primary'>Primary</Select.Option>
													<Select.Option value='destructive'>Destructive</Select.Option>
													<Select.Option value='secondary'>Secondary</Select.Option>
												</Select>
											</Form.Item>
											<Button
												type='text'
												danger
												icon={<DeleteOutlined />}
												onClick={() => remove(name)}
												style={{ marginTop: 4 }}
											/>
										</div>
									</div>
								))}
							</>
						)}
					</Form.List>
				</Form>
			</Tabs.TabPane>
			<Tabs.TabPane tab="Cấu hình Add-on" key="2">
				<Form
					form={form}
					layout='vertical'
					onValuesChange={(changed, all) => handleNodeValuesChange(changed, all, form, onValuesChange)}
				>
					<AddOnConfigSection form={form} nodes={nodes} availableVariables={availableVariables} addonVariablesMap={addonVariablesMap} />
				</Form>
			</Tabs.TabPane>
		</Tabs>
	);
};

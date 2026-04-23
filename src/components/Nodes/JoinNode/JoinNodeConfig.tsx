import { ConfigProps } from '@/components/Nodes/type';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import { Button, Form, Input, Space } from 'antd';
import { useEffect, useRef } from 'react';
import { handleNodeValuesChange } from '../utils';

export interface JoinConfig {
	id?: string;
	requiredNodeIds: string[]; // Danh sách node cha cần chờ
}

export const JoinNodeConfig = ({ initialValues, onValuesChange }: ConfigProps<JoinConfig>) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const initializedRef = useRef(false);

	useEffect(() => {
		if (!initializedRef.current) {
			form.setFieldsValue(initialValues);
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

			{/* Required Node IDs */}
			<Form.List name='requiredNodeIds'>
				{(fields, { add, remove }) => (
					<>
						<Form.Item label={intl.formatMessage({ id: 'workflow.node.join.requiredNodes' })}>
							<div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 8 }}>
								{intl.formatMessage({ id: 'workflow.node.join.hint' })}
							</div>
							<Button type='dashed' onClick={() => add('')} block icon={<PlusOutlined />}>
								{intl.formatMessage({ id: 'workflow.node.join.add' })}
							</Button>
						</Form.Item>
						{fields.map(({ key, name, ...restField }) => (
							<Space key={key} style={{ display: 'flex', marginBottom: 8 }} align='baseline'>
								<Form.Item
									{...restField}
									name={name}
									rules={[{ required: true, message: intl.formatMessage({ id: 'workflow.node.join.id.required' }) }]}
									style={{ marginBottom: 0, flex: 1 }}
								>
									<Input placeholder='Node ID (e.g., node_123)' style={{ width: 300 }} />
								</Form.Item>
								<DeleteOutlined onClick={() => remove(name)} style={{ color: '#ff4d4f' }} />
							</Space>
						))}
						{fields.length === 0 && (
							<div
								style={{
									padding: 16,
									textAlign: 'center',
									color: '#8c8c8c',
									border: '1px dashed #d9d9d9',
									borderRadius: 4,
									fontSize: 12,
								}}
							>
								{intl.formatMessage({ id: 'workflow.node.join.empty' })}
							</div>
						)}
					</>
				)}
			</Form.List>
		</Form>
	);
};

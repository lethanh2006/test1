import { ConfigProps } from '@/components/Nodes/type';
import { useIntl } from '@umijs/max';
import { Form, Input } from 'antd';
import { useEffect, useRef } from 'react';
import { handleNodeValuesChange } from '../utils';

export interface ScriptConfig {
	id?: string;
	script: string; // "return context.a + context.b;"
}

export const ScriptNodeConfig = ({ initialValues, onValuesChange, form: propsForm }: ConfigProps<ScriptConfig>) => {
	const intl = useIntl();
	const [localForm] = Form.useForm();
	const form = propsForm || localForm;
	const initializedRef = useRef(false);

	useEffect(() => {
		if (!initializedRef.current) {
			form.setFieldsValue(initialValues);
			initializedRef.current = true;
		}
	}, [initialValues, form]);

	// Validator to check if script contains return statement
	const validateScript = (_: unknown, value: string) => {
		if (!value || value.trim() === '') {
			return Promise.reject(new Error(intl.formatMessage({ id: 'workflow.node.script.code.required' })));
		}
		if (!value.includes('return')) {
			return Promise.reject(new Error(intl.formatMessage({ id: 'workflow.node.script.code.returnRequired' })));
		}
		return Promise.resolve();
	};

	return (
		<Form
			form={form}
			layout='vertical'
			onValuesChange={(changed, all) => handleNodeValuesChange(changed, all, form, onValuesChange)}
		>
			{/* Node Label */}
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

			{/* Script Input */}
			<Form.Item
				name='script'
				label={intl.formatMessage({ id: 'workflow.node.script.code' })}
				rules={[{ required: true, validator: validateScript }]}
				tooltip={intl.formatMessage({ id: 'workflow.node.script.tooltip' })}
			>
				<Input.TextArea
					placeholder={`return context.amount * 1.1;`}
					rows={8}
					style={{ fontFamily: 'monospace', fontSize: 13 }}
				/>
			</Form.Item>

			<div style={{ fontSize: 12, color: '#8c8c8c', marginTop: -10, marginBottom: 16 }}>
				💡 Example: <code style={{ fontSize: 11 }}>return context.a + context.b;</code>
			</div>
		</Form>
	);
};

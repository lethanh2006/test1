import { ConfigProps } from '@/components/Nodes/type';
import { useIntl } from '@umijs/max';
import { Form, Input } from 'antd';
import { useEffect, useRef } from 'react';
import { handleNodeValuesChange } from '../utils';

interface EndNodeConfigData {
	id?: string;
	label: string;
}

export const EndNodeConfig = ({ initialValues, onValuesChange }: ConfigProps<EndNodeConfigData>) => {
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
		</Form>
	);
};

import { ConfigProps, GetInstancesConfig } from '@/components/Nodes/type';
import SelectWorkflow from '@/components/Nodes/components/SelectWorkflow';
import { useIntl } from '@umijs/max';
import { Form, Input, Select } from 'antd';
import { useEffect, useMemo } from 'react';
import { handleNodeValuesChange } from '../utils';

export const GetInstancesNodeConfig = ({
	initialValues,
	onValuesChange,
	availableVariables,
	form: propsForm,
}: ConfigProps<GetInstancesConfig>) => {
	const intl = useIntl();
	const [localForm] = Form.useForm();
	const form = propsForm || localForm;

	const formInitialValues = useMemo(() => {
		return {
			...initialValues,
			condition:
				typeof initialValues.condition === 'string'
					? initialValues.condition
					: initialValues.condition
					? JSON.stringify(initialValues.condition, null, 2)
					: undefined,
			query:
				typeof initialValues.query === 'string'
					? initialValues.query
					: initialValues.query
					? JSON.stringify(initialValues.query, null, 2)
					: undefined,
		};
	}, [initialValues]);

	useEffect(() => {
		form.setFieldsValue(formInitialValues);
	}, [formInitialValues, form]);

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

			<Form.Item
				name='workflowId'
				label='Workflow'
				rules={[{ required: true, message: 'Workflow is required' }]}
			>
				<SelectWorkflow />
			</Form.Item>

			<Form.Item name='condition' label='Condition (Filter Obj)'>
				<Input.TextArea placeholder='{"trangThai": "DANG_XU_LY"}' rows={4} />
			</Form.Item>

			<Form.Item name='query' label='Query (Obj)'>
				<Input.TextArea placeholder='{}' rows={4} />
			</Form.Item>

			<Form.Item name='population' label='Population (Fields to populate)'>
				<Select mode="tags" style={{ width: '100%' }} placeholder="e.g., workflow, user" />
			</Form.Item>

			<Form.Item name='filters' label='Filters'>
				<Select mode="tags" style={{ width: '100%' }} placeholder="e.g., name, status" />
			</Form.Item>
		</Form>
	);
};

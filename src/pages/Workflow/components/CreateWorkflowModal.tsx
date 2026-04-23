import { Workflow } from '@/services/Workflow/typing';
import { resetFieldsForm } from '@/utils/utils';
import { useIntl, useModel } from '@umijs/max';
import { Button, Card, Form, Input } from 'antd';
import { useEffect } from 'react';

export const CreateWorkflowForm = () => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
		useModel('workflow.workflow');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: Workflow.IRecordWorkflow) => {
		const payload = { ...record, ...values };
		if (edit) {
			putModel(record?._id ?? '', payload)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel({ ...values, phanHeQuyTrinh: 'DANG_KY_MO_NGANH', node: {} })
				.then(() => form.resetFields())
				.catch((er) => console.log(er));
	};

	return (
		<Card
			title={
				edit
					? intl.formatMessage({ id: 'workflow.modal.edit.title' })
					: intl.formatMessage({ id: 'workflow.modal.create.title' })
			}
		>
			<Form form={form} onFinish={onFinish} layout='vertical' autoComplete='off'>
				<Form.Item
					label={intl.formatMessage({ id: 'workflow.modal.name' })}
					name='ten'
					rules={[{ required: true, message: intl.formatMessage({ id: 'workflow.modal.name.required' }) }]}
				>
					<Input placeholder={intl.formatMessage({ id: 'workflow.modal.name.placeholder' })} />
				</Form.Item>

				<Form.Item label={intl.formatMessage({ id: 'workflow.modal.description' })} name='moTa'>
					<Input.TextArea rows={3} placeholder={intl.formatMessage({ id: 'workflow.modal.description.placeholder' })} />
				</Form.Item>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{edit
							? intl.formatMessage({ id: 'workflow.common.save' })
							: intl.formatMessage({ id: 'workflow.common.add' })}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'workflow.common.cancel' })}</Button>
				</div>
			</Form>
		</Card>
	);
};

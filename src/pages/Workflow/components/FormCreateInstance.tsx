import { SelectDonVi } from '@/components/Nodes/components/SelectDonVi';
import { history, useIntl, useModel } from '@umijs/max';
import { Button, Col, Form, Input, message, Row, Space } from 'antd';
import { useEffect } from 'react';

interface IProps {
	workflowId: string;
	onCancel: () => void;
}

const FormCreateInstance = ({ workflowId, onCancel }: IProps) => {
	const { initialState } = useModel('@@initialState');
	const { startInstance } = useModel('workflow.instance');
	const intl = useIntl();
	const [form] = Form.useForm();

	useEffect(() => {
		if (initialState) {
			form.setFieldsValue({
				ssoId: initialState?.currentUser?.ssoId,
				hoTen: initialState.currentUser?.family_name
					? `${initialState.currentUser.family_name} ${initialState.currentUser?.given_name ?? ''}`
					: (initialState.currentUser?.name ?? (initialState.currentUser?.preferred_username || '')),
				email: initialState?.currentUser?.email,
			});
		}
	}, [initialState]);

	const handleDonViSelect = (donVi: { maDonVi: string; ten: string; donViId?: string }) => {
		form.setFieldsValue({
			maDonVi: donVi.maDonVi,
			donViId: donVi.donViId,
		});
	};

	const handleFinish = async (values: any) => {
		if (!workflowId) return;
		try {
			const payload = {
				data: {
					_userInfo: {
						ssoId: values.ssoId,
						hoTen: values.hoTen,
						email: values.email,
						donViId: values.donViId,
						maDonVi: values.maDonVi,
					},
				},
			};

			await startInstance(workflowId, payload);
			onCancel();
			setTimeout(() => {
				history.push('/instance');
			}, 800);
		} catch (error) {
			message.error(intl.formatMessage({ id: 'workflow.instance.error.start' }));
		} finally {
			form.resetFields();
		}
	};

	return (
		<Form form={form} layout='vertical' onFinish={handleFinish}>
			<Row gutter={16}>
				<Form.Item name='ssoId' initialValue={initialState?.currentUser?.ssoId} hidden>
					<Input />
				</Form.Item>

				<Col span={12}>
					<Form.Item
						name='hoTen'
						label={intl.formatMessage({ id: 'workflow.instance.fullname' })}
						rules={[{ required: true }]}
					>
						<Input placeholder={intl.formatMessage({ id: 'workflow.instance.fullname.placeholder' })} />
					</Form.Item>
				</Col>

				<Col span={12}>
					<Form.Item
						name='email'
						label={intl.formatMessage({ id: 'workflow.member.email' })}
						rules={[{ required: true, type: 'email' }]}
					>
						<Input placeholder={intl.formatMessage({ id: 'workflow.instance.email.placeholder' })} />
					</Form.Item>
				</Col>

				<Col span={12}>
					<Form.Item
						name='maDonViXuLy'
						label={intl.formatMessage({ id: 'workflow.assignee.unit' })}
						rules={[{ required: true, message: intl.formatMessage({ id: 'workflow.assignee.unit.required' }) }]}
					>
						<SelectDonVi onSelectDonVi={handleDonViSelect} />
					</Form.Item>
				</Col>

				<Form.Item name='donViId' hidden>
					<Input />
				</Form.Item>

				<Col span={12}>
					<Form.Item name='maDonVi' label={intl.formatMessage({ id: 'workflow.assignee.unitCode' })}>
						<Input placeholder={intl.formatMessage({ id: 'workflow.instance.unitCode.placeholder' })} />
					</Form.Item>
				</Col>
			</Row>

			<Form.Item style={{ marginTop: 16 }}>
				<Space style={{ width: '100%', justifyContent: 'flex-end' }}>
					<Button onClick={onCancel}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
					<Button type='primary' htmlType='submit'>
						{intl.formatMessage({ id: 'global.button.xacnhan' })}
					</Button>
				</Space>
			</Form.Item>
		</Form>
	);
};

export default FormCreateInstance;

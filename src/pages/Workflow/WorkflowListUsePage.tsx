import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { IColumn } from '@/components/Table/typing';
import { Workflow } from '@/services/Workflow/typing';
import { PlusOutlined } from '@ant-design/icons';
import { history, useIntl, useModel } from '@umijs/max';
import { Button, Form, Input, Modal, message } from 'antd';
import { useState } from 'react';

const WorkflowListUsePage = () => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const [open, setOpen] = useState(false);
	const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);

	const { initialState } = useModel('@@initialState');
	const { page, limit } = useModel('workflow.workflow');
	const { startInstance } = useModel('workflow.instance');

	const openCreateInstanceModal = (workflowId: string) => {
		setSelectedWorkflowId(workflowId);
		setOpen(true);
	};

	const closeCreateInstanceModal = () => {
		setOpen(false);
		setSelectedWorkflowId(null);
		form.resetFields();
	};

	const onCreateInstance = async (values: { moTa?: string }) => {
		if (!initialState || !selectedWorkflowId) return;

		setSubmitting(true);

		const payload = {
			moTa: values.moTa?.trim() || '',
			data: {
				_userInfo: {
					ssoId: initialState?.currentUser?.ssoId,
					hoTen: initialState.currentUser?.family_name
						? `${initialState.currentUser.family_name} ${initialState.currentUser?.given_name ?? ''}`
						: (initialState.currentUser?.name ?? (initialState.currentUser?.preferred_username || '')),
					email: initialState?.currentUser?.email,
					// donViId: initialState?.currentUser?.donViId,
					// maDonVi: initialState?.currentUser?.maDonVi,
				},
			},
		};

		try {
			const res = await startInstance(selectedWorkflowId, payload);
			closeCreateInstanceModal();

			setTimeout(() => {
				history.push(`/instance/${res?._id}`);
			}, 800);
		} catch (error) {
			message.error(intl.formatMessage({ id: 'workflow.instance.error.start' }));
		} finally {
			setSubmitting(false);
		}
	};

	const columns: IColumn<Workflow.IRecordWorkflow>[] = [
		{
			title: 'TT',
			dataIndex: 'index',
			width: 60,
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'workflow.list.column.name' }),
			dataIndex: 'ten',
			width: 280,
			ellipsis: true,
		},
		{
			title: intl.formatMessage({ id: 'workflow.list.column.description' }),
			dataIndex: 'moTa',
			width: 320,
			ellipsis: true,
		},
		{
			title: intl.formatMessage({ id: 'workflow.common.action' }),
			align: 'center',
			key: 'action',
			width: 100,
			fixed: 'right' as const,
			render: (_: any, record: Workflow.IRecordWorkflow) => (
				<ButtonExtend type='link' icon={<PlusOutlined />} onClick={() => openCreateInstanceModal(record._id!)} />
			),
		},
	];

	return (
		<>
			<TableBase
				title={intl.formatMessage({ id: 'workflow.table.title' })}
				columns={columns}
				buttons={{ create: false }}
				dependencies={[page, limit]}
				modelName='workflow.workflow'
				addStt={false}
			/>

			<Modal
				title={intl.formatMessage({ id: 'workflow.instance.create' })}
				open={open}
				onCancel={closeCreateInstanceModal}
				footer={null}
				destroyOnClose
				width={520}
			>
				<Form form={form} layout='vertical' onFinish={onCreateInstance}>
					<Form.Item name='moTa' label='Mô tả instance'>
						<Input.TextArea rows={4} placeholder='Nhập mô tả để phân biệt instance...' />
					</Form.Item>

					<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
						<Button onClick={closeCreateInstanceModal}>Hủy</Button>
						<Button type='primary' htmlType='submit' loading={submitting}>
							Xác nhận
						</Button>
					</div>
				</Form>
			</Modal>
		</>
	);
};

export default WorkflowListUsePage;

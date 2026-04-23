import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { IColumn } from '@/components/Table/typing';
import FormCreateInstance from '@/pages/Workflow/components/FormCreateInstance';
import { Workflow } from '@/services/Workflow/typing';
import { CopyOutlined, DeleteOutlined, EditOutlined, MenuOutlined, PlusOutlined } from '@ant-design/icons';
import { history, useIntl, useModel } from '@umijs/max';
import { Modal, Popconfirm, Popover } from 'antd';
import { useEffect, useState } from 'react';
import { CreateWorkflowForm } from './components/CreateWorkflowModal';

const WorkflowListPage = () => {
	const intl = useIntl();
	const workflowModel = useModel('workflow.workflow');
	const { getAllModel, danhSach } = useModel('tochucnhansu.thongtinnhansu');
	const { handleEdit, deleteModel, duplicateWorkflow, limit, page } = workflowModel;
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null);

	const onEdit = (record: Workflow.IRecordWorkflow) => {
		handleEdit(record);
	};

	useEffect(() => {
		if (!danhSach.length)
			getAllModel(false, undefined, {
				trangThaiChinhSua: 'Duyệt - đang áp dụng',
				trangThai: 'Đang làm việc',
			});
	}, []);

	const onCreateInstance = async (workflowId: string) => {
		setSelectedWorkflowId(workflowId);
		setModalVisible(true);
	};

	const handleCloseModal = () => {
		setModalVisible(false);
		setSelectedWorkflowId(null);
	};

	const handleDelete = (record: Workflow.IRecordWorkflow) => {
		deleteModel(record._id!);
	};

	const onCell = (record: Workflow.IRecordWorkflow) => ({
		onClick: () => history.push(`/workflow/design/${record._id}`),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<Workflow.IRecordWorkflow>[] = [
		{
			title: intl.formatMessage({ id: 'workflow.list.column.name' }),
			dataIndex: 'ten',
			onCell,
			ellipsis: true,
		},
		{
			title: intl.formatMessage({ id: 'workflow.list.column.description' }),
			dataIndex: 'moTa',
			onCell,
			ellipsis: true,
		},
		{
			title: intl.formatMessage({ id: 'workflow.common.action' }),
			align: 'center',
			key: 'action',
			width: 100,
			fixed: 'right' as const,
			render: (_: any, record: Workflow.IRecordWorkflow) => (
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<Popover
						placement='left'
						content={
							<>
								<ButtonExtend
									hidden
									tooltip={intl.formatMessage({ id: 'workflow.instance.create' })}
									onClick={() => onCreateInstance(record?._id!)}
									type='link'
									icon={<PlusOutlined />}
								/>

								<ButtonExtend
									onClick={() => {
										Modal.confirm({
											title: intl.formatMessage({ id: 'workflow.list.duplicateConfirm' }),
											onOk: () => duplicateWorkflow(record._id!),
											okText: intl.formatMessage({ id: 'workflow.common.yes' }),
											cancelText: intl.formatMessage({ id: 'workflow.common.no' }),
										});
									}}
									tooltip={intl.formatMessage({ id: 'workflow.list.duplicate' })}
									type='link'
									icon={<CopyOutlined />}
								/>

								<ButtonExtend
									onClick={() => onEdit(record)}
									tooltip={intl.formatMessage({ id: 'global.button.chinhsua' })}
									type='link'
									icon={<EditOutlined />}
								/>

								<Popconfirm
									onConfirm={() => handleDelete(record)}
									title={intl.formatMessage({ id: 'workflow.assignee.deleteWorkflowConfirm' })}
									placement='topRight'
								>
									<ButtonExtend
										tooltip={intl.formatMessage({ id: 'workflow.common.delete' })}
										type='link'
										danger
										icon={<DeleteOutlined />}
									/>
								</Popconfirm>
							</>
						}
					>
						<ButtonExtend type='link' icon={<MenuOutlined />} />
					</Popover>
				</div>
			),
		},
	];

	return (
		<>
			<TableBase
				title={intl.formatMessage({ id: 'workflow.list.title' })}
				columns={columns}
				dependencies={[page, limit]}
				modelName='workflow.workflow'
				Form={CreateWorkflowForm}
			/>

			<Modal
				title={intl.formatMessage({ id: 'workflow.instance.create' })}
				open={modalVisible}
				onCancel={handleCloseModal}
				footer={null}
				destroyOnClose
				width={700}
			>
				<FormCreateInstance workflowId={selectedWorkflowId || ''} onCancel={handleCloseModal} />
			</Modal>
		</>
	);
};

export default WorkflowListPage;

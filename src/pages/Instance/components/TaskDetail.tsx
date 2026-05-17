import { AssigneeTable } from '@/components/Nodes/components/AssigneeTable';
import PreviewFile from '@/components/PreviewFile';
import ButtonExtend from '@/components/Table/ButtonExtend';
import ModalExpandable from '@/components/Table/ModalExpandable';
import { ETrangThaiInstanceTask, MapTrangThaiInstanceTaskColor } from '@/services/Instance/constance';
import { b64toBlob } from '@/utils/utils';
import { ReloadOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Alert, Button, Card, Col, Descriptions, Divider, Empty, Row, Tag } from 'antd';
import fileDownload from 'js-file-download';
import React, { useState } from 'react';
import { useIntl } from 'umi';
import { getTaskRenderer } from './TaskViews/registry';


interface TaskDetailProps {
	task: (Instance.IInstanceTask & { clickable?: boolean; isActOnSelf?: boolean }) | null;
	loading?: boolean;
	disabled?: boolean;
	instanceId?: string;
	allowReoperate?: boolean;
	isNotAllowAction?: boolean;
	onSubmit: (payload: { outcome: Record<string, any> }) => Promise<void>;
	onCheckAllowReoperate: () => Promise<void>;
	actionRefresh?: () => Promise<void>;
}


export const TaskDetail: React.FC<TaskDetailProps> = ({
	task,
	onSubmit,
	loading,
	disabled,
	instanceId,
	onCheckAllowReoperate,
	allowReoperate,
	actionRefresh,
	isNotAllowAction,
}) => {
	const intl = useIntl();


	if (!task) {
		return (
			<Card
				style={{ height: '100%', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
			>
				<Empty description={intl.formatMessage({ id: 'workflow.instance.detail.emptyTask' })} />
			</Card>
		);
	}


	const renderer = getTaskRenderer(task.loai || '');
	const RendererComponent = renderer?.component;
	const { triggerInstanceNodeAddon } = useModel('workflow.instance');
	const actions = task?.config?.addOn?.actions?.filter((item: any) => item?.scope === 'GLOBAL') ?? [];
	const [previewOpen, setPreviewOpen] = useState(false);
	const [urlFile, setUrlFile] = useState('');


	const getActionLabel = (action: any) => {
		const actionKey = action?.key ?? action?.id;
		const actionName = `${action?.name ?? ''}`.trim().toLowerCase();


		if (
			actionKey === 'xuatDanhSachDon' ||
			actionKey === 'xuat-danh-sach-don' ||
			actionName === 'xuất danh sách đơn' ||
			actionName === 'export application list'
		) {
			return intl.formatMessage({ id: 'workflow.instance.action.exportApplicationList' });
		}


		return action?.name;
	};


	const downloadFile = async (fileData: any) => {
		if (!fileData?.value) return;


		const { type, value, fileName } = fileData;


		if (type === 'base64') {
			const blob = b64toBlob(value, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
			if (!blob) throw new Error('Invalid base64 file');


			return fileDownload(blob, fileName);
		}


		if (type === 'url') {
			try {
				const blob = await fetch(value).then((r) => {
					if (!r.ok) throw new Error();
					return r.blob();
				});
				return fileDownload(blob, fileName);
			} catch { }
		}
	};


	const handleTriggerAddon = async (action: any) => {
		const workflowId = task?.workflowId;
		const workflowNodeId = task?.nodeId;
		const addonId = action?.id ?? task?.config?.addOn?.id;


		if (!workflowId || !workflowNodeId || !addonId) return;


		try {
			const res = await triggerInstanceNodeAddon(workflowId, workflowNodeId, addonId, { action });
			const fileData = res?.file ?? res?.data?.file;
			await downloadFile(fileData);
		} catch { }
	};


	return (
		<Card
			title={
				<Row justify='space-between'>
					<Col>{task.ten}</Col>
					<Col>
						{actions.map((item: any) => (
							<ButtonExtend
								onClick={() => handleTriggerAddon(item)}
								size='small'
								style={{ marginRight: 8 }}
								type='primary'
								key={item.name}
							>
								{getActionLabel(item)}
							</ButtonExtend>
						))}
						<ReloadOutlined spin={loading} onClick={actionRefresh} style={{ cursor: 'pointer' }} />
					</Col>
				</Row>
			}
			style={{
				height: '100%',
				overflowY: 'auto',
				borderRadius: 8,
				boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
			}}
		>
			{/* <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div></div>


                <Space>
                    <Tag color={MapTrangThaiInstanceTaskColor[task.trangThai as ETrangThaiInstanceTask]} bordered={false}>
                        {MapTrangThaiInstanceTask[task.trangThai as ETrangThaiInstanceTask]}
                    </Tag>
                </Space>
            </div> */}


			{disabled ? (
				<Alert
					type='info'
					message={
						<span>
							<strong>{intl.formatMessage({ id: 'workflow.instance.detail.alert.disabled.message' })}</strong>:{' '}
							{intl.formatMessage({ id: 'workflow.instance.detail.alert.disabled.description' })}
						</span>
					}
					showIcon
				/>
			) : (
				!task.isActOnSelf && (
					<Alert
						type='warning'
						message={
							<span>
								<strong>{intl.formatMessage({ id: 'workflow.instance.detail.alert.accessDenied.message' })}</strong>:{' '}
								{intl.formatMessage({ id: 'workflow.instance.detail.alert.accessDenied.description' })}
							</span>
						}
						showIcon
					/>
				)
			)}
			{task?.config?.assignee && task.config.assignee.length > 0 && (
				<div style={{ marginBottom: 24 }}>
					<Divider orientation='left' orientationMargin={0} style={{ fontSize: 14, fontWeight: 'bold' }}>
						{intl.formatMessage({ id: 'workflow.instance.detail.section.generalInfo' })}
					</Divider>
					<Descriptions bordered>
						<Descriptions.Item span={2} label={intl.formatMessage({ id: 'workflow.instance.detail.field.status' })}>
							<Tag color={MapTrangThaiInstanceTaskColor[task.trangThai as ETrangThaiInstanceTask]} bordered={false}>
								{task.trangThai}
							</Tag>
						</Descriptions.Item>
						<Descriptions.Item
							span={2}
							label={intl.formatMessage({ id: 'workflow.instance.detail.field.assigneeUnit' })}
						>
							<AssigneeTable value={task.config.assignee} isView />
						</Descriptions.Item>
						{task?.ketQua?.ghiChu && (
							<Descriptions.Item span={6} label={intl.formatMessage({ id: 'workflow.instance.detail.field.note' })}>
								<div dangerouslySetInnerHTML={{ __html: task.ketQua.ghiChu }}></div>
							</Descriptions.Item>
						)}
						{task?.ketQua?.vanBanKemTheo && (
							<Descriptions.Item
								span={2}
								label={intl.formatMessage({ id: 'workflow.instance.detail.field.attachment' })}
							>
								{task.ketQua.vanBanKemTheo?.map((item: string, index: number) => {
									const fileName =
										decodeURIComponent(item?.substring(item.lastIndexOf('/') + 1)) ||
										intl.formatMessage({ id: 'workflow.instance.detail.fileDefault' }, { index: index + 1 });
									return (
										<Button
											onClick={() => {
												setPreviewOpen(true);
												setUrlFile(item);
											}}
											type='link'
										>
											{index + 1}. {fileName}
										</Button>
									);
								})}
							</Descriptions.Item>
						)}
					</Descriptions>
				</div>
			)}


			<Divider orientation='left' orientationMargin={0} style={{ fontSize: 14, fontWeight: 'bold' }}>
				{intl.formatMessage({ id: 'workflow.instance.detail.section.processingContent' })}
			</Divider>


			<div
				style={{
					padding: '0 4px',
					// pointerEvents: disabled || !task.isActOnSelf ? 'none' : 'auto',
					// opacity: disabled || !task.isActOnSelf ? 0.8 : 1,
				}}
			>
				{RendererComponent ? (
					<RendererComponent
						task={task}
						onSubmit={onSubmit}
						loading={loading}
						instanceId={instanceId}
						onCheckAllowReoperate={onCheckAllowReoperate}
						allowReoperate={allowReoperate}
						isNotAllowAction={isNotAllowAction}
					/>
				) : (
					<Alert
						type='warning'
						message={intl.formatMessage({ id: 'workflow.instance.detail.alert.unsupported.message' })}
						description={intl.formatMessage(
							{ id: 'workflow.instance.detail.alert.unsupported.description' },
							{ type: task.loai },
						)}
						showIcon
					/>
				)}
			</div>
			<ModalExpandable
				title={intl.formatMessage({ id: 'workflow.instance.detail.modal.preview.title' })}
				width={1200}
				open={previewOpen}
				footer={null}
				onCancel={() => setPreviewOpen(false)}
			>
				<PreviewFile file={[urlFile]} />


				<div className='form-footer'>
					<Button onClick={() => setPreviewOpen(false)}>{intl.formatMessage({ id: 'workflow.common.close' })}</Button>
				</div>
			</ModalExpandable>
		</Card>
	);
};





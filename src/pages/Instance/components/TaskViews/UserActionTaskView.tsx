import { TASK_RENDERER_REGISTRY } from '@/pages/Instance/components/TaskViews/registry';
import ResultFormDetail from '@/pages/Instance/components/TaskViews/ResultFormDetail';
import { transformBackendToWorkflow } from '@/pages/Workflow/utils';
import { ETrangThaiInstanceTask } from '@/services/Instance/constance';
import { useIntl, useModel } from '@umijs/max';
import { Alert, Button, Card, Col, Row, Space, Spin, Typography, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { TaskRendererProps } from './types';

const { Paragraph } = Typography;

const findParentFormNode = (currentNodeId: string, edges: any[], nodes: any[]): string | null => {
	// Tìm tất cả edges có target là currentNodeId
	const incomingEdges = edges.filter((edge) => edge.target === currentNodeId);

	// Duyệt qua các source nodes
	for (const edge of incomingEdges) {
		const sourceNode = nodes.find((n) => n.id === edge.source);
		if (sourceNode?.type === 'user.form') {
			return sourceNode.id;
		}
	}
	return null;
};

export const UserActionTaskView: React.FC<TaskRendererProps> = ({
	task,
	onSubmit,
	loading,
	instanceId,
	isNotAllowAction,
}) => {
	const intl = useIntl();
	const actions =
		(task.config?.actions as Array<{
			id: string;
			label: string;
			variant?: 'default' | 'primary' | 'destructive' | 'secondary';
		}>) || [];

	const [parentFormState, setParentFormState] = useState<{
		data: Instance.IInstanceTask | null;
		loading: boolean;
	}>({
		data: null,
		loading: false,
	});

	const workflowModel = useModel('workflow.workflow');
	const instanceTaskModel = useModel('workflow.instancetask');

	const handleActionClick = async (actionId: string) => {
		const payload = TASK_RENDERER_REGISTRY['user.action'].buildSubmitPayload(actionId);
		await onSubmit(payload);
	};

	const getButtonType = (variant?: string): 'default' | 'primary' | 'dashed' | 'link' | 'text' => {
		switch (variant) {
			case 'primary':
			case 'destructive':
				return 'primary';
			case 'secondary':
				return 'default';
			default:
				return 'default';
		}
	};

	const getButtonDanger = (variant?: string): boolean => {
		return variant === 'destructive';
	};

	const requestRef = React.useRef<{
		nodeId: string | null;
		workflowId: string | null;
		loading: boolean;
	}>({ nodeId: null, workflowId: null, loading: false });

	useEffect(() => {
		const loadParentFormData = async () => {
			if (!task.nodeId || !instanceId || !task.workflowId) return;

			if (
				requestRef.current.nodeId === task.nodeId &&
				requestRef.current.workflowId === task.workflowId &&
				(requestRef.current.loading || parentFormState.data)
			) {
				return;
			}

			// Update ref to mark as loading
			requestRef.current = {
				nodeId: task.nodeId,
				workflowId: task.workflowId,
				loading: true,
			};

			setParentFormState({ data: null, loading: true });
			try {
				const workflow = await workflowModel.getByIdModel(task.workflowId);
				if (!workflow || !workflow._id) {
					setParentFormState({ data: null, loading: false });
					requestRef.current.loading = false;
					return;
				}

				const transformedWorkflow = transformBackendToWorkflow(workflow as any);

				// Tìm parent form node
				const parentNodeId = findParentFormNode(task.nodeId, transformedWorkflow.edges, transformedWorkflow.nodes);

				// Fetch dữ liệu parent nếu tìm thấy
				if (parentNodeId) {
					const parentData = await instanceTaskModel.getInforNode(instanceId, parentNodeId);
					setParentFormState({ data: parentData, loading: false });
				} else {
					setParentFormState({ data: null, loading: false });
				}
			} catch (error) {
				console.error('Error loading parent form data:', error);
				setParentFormState({ data: null, loading: false });
			} finally {
				requestRef.current.loading = false;
			}
		};

		loadParentFormData();
	}, [task.nodeId, task.workflowId, instanceId]);

	if (!actions.length) {
		return (
			<Paragraph type='secondary'>{intl.formatMessage({ id: 'instances.khongcohanhdongnaoduoccauhinh' })}</Paragraph>
		);
	}

	const resultAction = task.config?.actions?.find((action: any) => action.id === task.ketQua?.value)?.label;

	return (
		<div>
			<Space size='middle' direction='vertical' style={{ width: '100%' }}>
				{parentFormState.loading && (
					<Card style={{ marginBottom: 16 }}>
						<Spin tip={intl.formatMessage({ id: 'instances.dangtaithongtinform' })} size='small' />
					</Card>
				)}

				<ResultFormDetail data={parentFormState.data} />
				{task.trangThai === ETrangThaiInstanceTask.DA_XU_LY ? (
					<>
						<Paragraph type='secondary'>
							{intl.formatMessage({ id: 'instances.ketqua' })}: {resultAction}{' '}
						</Paragraph>
					</>
				) : (
					<>
						<Paragraph style={{ marginBottom: 20, color: 'rgba(0,0,0,0.65)' }}>
							{intl.formatMessage({ id: 'instances.chonmothanhdongdetieptuc' })}
						</Paragraph>
						{isNotAllowAction ? (
							<Alert
								type='warning'
								message={intl.formatMessage({ id: 'instances.bankhongcoquyenthuchientasknay' })}
								showIcon
							/>
						) : (
							<>
								<Row gutter={6} justify='end'>
									{actions.map((action) => (
										<Col key={action.id}>
											<Button
												disabled={!task.isActOnSelf}
												type={getButtonType(action.variant)}
												danger={getButtonDanger(action.variant)}
												onClick={() => handleActionClick(action.id)}
												loading={loading}
												size='small'
											>
												{action.label}
											</Button>
										</Col>
									))}
								</Row>
							</>
						)}
					</>
				)}
			</Space>
		</div>
	);
};

import { ETrangThaiInstanceTask } from '@/services/Instance/constance';
import { useModel } from '@umijs/max';
import { Affix, Modal, Spin, message } from 'antd';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane/lib/Pane';
import { useIntl, useParams } from 'umi';
import FormSubmitTask from './components/FormSubmitTask';
import { TaskDetail } from './components/TaskDetail';
import { TaskList } from './components/TaskList';


const InstanceDetailPage = (props: { instanceId?: string; onRefresh?: () => void }) => {
	const intl = useIntl();
	const { instanceId, onRefresh } = props;
	const { id } = useParams<{ id: string }>();
	const currentInstanceId = instanceId ?? id;
	const instanceTaskModel = useModel('workflow.instancetask');
	const instanceModel = useModel('workflow.instance');


	const {
		getListTask,
		getInstanceTaskMe,
		listTask,
		loading,
		selectedTaskId,
		listTaskMe,
		setSelectedTaskId,
		autoSelectTask,
		completeTask,
		editTask,
		checkAllowReoperate,
		visibleForm,
		setVisibleForm,
	} = instanceTaskModel;
	const [outcome, setOutcome] = useState<any>();
	const [inforCurrentNode, setInforCurrentNode] = useState<Instance.IInstanceTask>();
	const [workflowIdOfInstance, setWorkflowIdOfInstance] = useState<string>();
	const [allowReoperate, setAllowReoperate] = useState<boolean>(false);
	const [paneSize, setPaneSize] = useState<string | number>('20%');


	const handlePaneSizeChange = (size: string | number | (string | number)[]) => {
		setPaneSize(Array.isArray(size) ? size[0] : size);
	};


	const modelRef = useRef(instanceTaskModel);
	modelRef.current = instanceTaskModel;


	const instanceModelRef = useRef(instanceModel);
	instanceModelRef.current = instanceModel;


	// init data
	useEffect(() => {
		if (!currentInstanceId) return;
		setSelectedTaskId(undefined);
		setInforCurrentNode(undefined);
		getListTask(currentInstanceId);
		getInstanceTaskMe(currentInstanceId);
		instanceModel.getByIdModel(currentInstanceId).then((res) => {
			setWorkflowIdOfInstance(res?.workflowId);
		});
	}, [currentInstanceId]);


	useEffect(() => {
		if (!currentInstanceId || !selectedTaskId) return;


		let isCanceled = false;


		modelRef.current.getInforNode(currentInstanceId, selectedTaskId).then((res) => {
			if (!isCanceled) {
				setInforCurrentNode(res);
			}
		});


		return () => {
			isCanceled = true;
		};
	}, [selectedTaskId, currentInstanceId]);


	useEffect(() => {
		if (listTask?.length) {
			const currentTask = listTask.find((t) => t.nodeId === selectedTaskId);
			if (!selectedTaskId || !currentTask) {
				autoSelectTask(listTask);
			}
		}
	}, [listTask, selectedTaskId, autoSelectTask]);


	const listTaskCanActOnSelf = useMemo(() => {
		return listTaskMe
			?.filter((t: Instance.IInstanceTask) => t.nodeId === selectedTaskId)
			.sort((a, b) => new Date(b?.createdAt || '').getTime() - new Date(a?.createdAt || '').getTime());
	}, [listTaskMe, selectedTaskId]);


	const canActOnSelf = listTaskCanActOnSelf[0];


	const stepTask = useMemo(() => {
		return listTask?.find((t) => t.nodeId === selectedTaskId);
	}, [listTask, selectedTaskId]);


	const selectedTask = useMemo(() => {
		if (!stepTask) return null;
		return {
			_id: canActOnSelf?._id,
			nodeId: stepTask.nodeId,
			ten: stepTask.node.name || stepTask.node.id || stepTask.nodeId,
			loai: stepTask.node.type,
			config: stepTask.node.config,
			clickable: stepTask.clickable,
			trangThai: inforCurrentNode?.trangThai,
			ketQua: inforCurrentNode?.ketQua,
			isActOnSelf: !!canActOnSelf,
			workflowId: workflowIdOfInstance,
		} as Instance.IInstanceTask & { clickable: boolean; isActOnSelf?: boolean };
	}, [stepTask, canActOnSelf, inforCurrentNode, workflowIdOfInstance]);


	const handleRefreshAfterAction = async () => {
		if (!currentInstanceId) return;
		const currentSelectedTaskId = selectedTaskId;


		await modelRef.current.refreshAction(currentInstanceId);
		instanceModelRef.current.getByIdModel(currentInstanceId).then((res) => {
			setWorkflowIdOfInstance(res?.workflowId);
			onRefresh?.();
		});
		if (currentSelectedTaskId) {
			const res = await modelRef.current.getInforNode(currentInstanceId, currentSelectedTaskId);
			setInforCurrentNode(res);
		}
	};


	const handleSubmitTask = async (payload: { outcome: Record<string, any> }) => {
		if (!currentInstanceId || !selectedTaskId) return;
		if (
			!canActOnSelf ||
			(canActOnSelf.trangThai !== ETrangThaiInstanceTask.MOI_DANG_KY &&
				canActOnSelf.trangThai !== ETrangThaiInstanceTask.LUU_NHAP)
		) {
			message.error(intl.formatMessage({ id: 'workflow.instance.task.error.noPermission' }));
			return;
		}
		setVisibleForm(false);
		setOutcome(payload.outcome);
		try {
			await completeTask(canActOnSelf._id, payload);
			message.success(intl.formatMessage({ id: 'workflow.instance.task.success.saved' }));
			setVisibleForm(false);
			setSelectedTaskId(undefined);
			await handleRefreshAfterAction();
		} catch (error: any) {
			setVisibleForm(false);
			message.error(error?.message || intl.formatMessage({ id: 'workflow.instance.task.error.complete' }));
		}
	};


	const handleCheckAllowReoperate = async () => {
		if (!currentInstanceId || !selectedTaskId) return;


		if (canActOnSelf.trangThai !== ETrangThaiInstanceTask.DA_XU_LY) {
			message.error(intl.formatMessage({ id: 'workflow.instance.task.error.notProcessed' }));
			return;
		}


		try {
			const res = await checkAllowReoperate(canActOnSelf._id);
			setAllowReoperate(res);


			if (!res) {
				message.error(intl.formatMessage({ id: 'workflow.instance.task.error.reoperateUnavailable' }));
			}
		} catch (error: any) {
			message.error(error?.message || intl.formatMessage({ id: 'workflow.instance.task.error.updateResult' }));
		}
	};


	const handleReoperateTask = async (payload: { outcome: Record<string, any> }) => {
		if (!currentInstanceId || !selectedTaskId) return;


		if (!allowReoperate || canActOnSelf.trangThai !== ETrangThaiInstanceTask.DA_XU_LY) {
			message.error(intl.formatMessage({ id: 'workflow.instance.task.error.reoperateUnavailable' }));
			return;
		}


		try {
			await editTask(canActOnSelf._id, payload);
			setAllowReoperate(false);
			message.success(intl.formatMessage({ id: 'workflow.instance.task.success.updated' }));
			await handleRefreshAfterAction();
		} catch (error: any) {
			message.error(error?.message || intl.formatMessage({ id: 'workflow.instance.task.error.updateResult' }));
		}
	};


	const isNotAllowAction = !canActOnSelf || canActOnSelf.trangThai !== ETrangThaiInstanceTask.MOI_DANG_KY;


	const handleSelectTask = useCallback(
		(nodeId: string) => {
			const task = listTask?.find((t) => t.nodeId === nodeId);
			if (task?.clickable) {
				setSelectedTaskId(nodeId);
				setAllowReoperate(false);
			}
		},
		[listTask],
	);


	return (
		<Spin spinning={loading}>
			<SplitPane split='vertical' onChange={handlePaneSizeChange}>
				<Pane initialSize={paneSize} minSize='280px' maxSize='40%' style={{ minWidth: 280, height: '100%' }}>

					<TaskList
						tasks={listTask || []}
						selectedTaskId={selectedTaskId}
						onSelectTask={handleSelectTask}
						loading={loading}
					/>

				</Pane>


				<Pane style={{ height: '100%', minWidth: 0 }}>
					<div style={{ height: '100%', paddingLeft: 8 }}>

						<TaskDetail
							actionRefresh={handleRefreshAfterAction}
							task={selectedTask}
							onSubmit={allowReoperate ? handleReoperateTask : handleSubmitTask}
							onCheckAllowReoperate={handleCheckAllowReoperate}
							allowReoperate={allowReoperate}
							loading={loading}
							disabled={!selectedTask?.clickable}
							instanceId={id}
							isNotAllowAction={isNotAllowAction}
						/>
						<Modal
							styles={{ body: { padding: 0 } }}
							open={visibleForm}
							onCancel={() => setVisibleForm(false)}
							footer={null}
							width={800}
							destroyOnClose
						>
							<FormSubmitTask
								outcome={outcome}
								canActOnSelf={canActOnSelf}
								handleRefreshAfterAction={handleRefreshAfterAction}
							/>
						</Modal>
					</div>
				</Pane>
			</SplitPane>
		</Spin>
	);
};


export default InstanceDetailPage;















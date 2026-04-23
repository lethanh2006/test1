import { WorkflowNodeType } from '@/components/Nodes/nodeConstants';
import { NODE_REGISTRY } from '@/components/Nodes/registry';
import { convertDotToCamelCase } from '@/pages/Workflow/utils';
import { FlowCanvas } from '@/pages/Workflow/WorkflowCanvas/FlowCanvas';
import { NodeConfigPanel } from '@/pages/Workflow/WorkflowCanvas/NodeConfigPanel';
import { NodePalette } from '@/pages/Workflow/WorkflowCanvas/NodePalette';
import { Toolbar } from '@/pages/Workflow/WorkflowCanvas/Toolbar';
import { Workflow } from '@/services/Workflow/typing';
import { type Node } from '@xyflow/react';
import { Modal, Spin, message } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { history, useModel, useParams } from 'umi';

const WorkflowDesignPage = () => {
	const { id } = useParams<{ id: string }>();
	const workflowModel = useModel('workflow.workflow');
	const {
		currentWorkflow,
		nodes,
		edges,
		selectedNodeId,
		isDirty,
		loading,
		loadWorkflowForEdit,
		saveWorkflow,
		setNodes,
		setEdges,
		setSelectedNodeId,
		updateNodeConfig,
		setIsDirty,
		setCurrentWorkflow,
		deleteNode,
		onConnect,
		onEdgesDelete,
	} = workflowModel;

	const reactFlowWrapper = useRef<HTMLDivElement>(null);
	const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
	console.log('id', id);
	useEffect(() => {
		if (id) {
			loadWorkflowForEdit(id);
		} else {
			history.push('/workflow');
		}
	}, [id]);
	console.log('currentWorkflow', currentWorkflow);

	useEffect(() => {
		if (currentWorkflow) {
			setCurrentWorkflow({
				...currentWorkflow,
				nodes: nodes as Workflow.INode[],
				edges: edges as Workflow.IEdge[],
			});
		}
	}, [nodes, edges]);

	useEffect(() => {
		if (!isDirty) return;
		const unblock = history.block((tx) => {
			Modal.confirm({
				title: 'Bạn có thay đổi chưa lưu',
				content: 'Nếu bạn rời đi, các thay đổi sẽ không được lưu. Bạn có chắc chắn muốn rời đi?',
				okText: 'Rời đi',
				cancelText: 'Hủy',
				onOk: () => {
					unblock();
					tx.retry();
				},
			});
			return false;
		});

		return () => {
			unblock();
		};
	}, [isDirty]);

	const onNodeDragStart = (event: React.DragEvent, nodeType: WorkflowNodeType) => {
		event.dataTransfer.setData('application/reactflow', nodeType);
		event.dataTransfer.effectAllowed = 'move';
	};

	const onDrop = useCallback(
		(event: React.DragEvent) => {
			event.preventDefault();

			const type = event.dataTransfer.getData('application/reactflow') as WorkflowNodeType;
			if (!type || !reactFlowInstance) return;

			const position = reactFlowInstance.screenToFlowPosition({
				x: event.clientX,
				y: event.clientY,
			});

			const nodeConfig = NODE_REGISTRY[type];
			const newNode: Workflow.INode = {
				id: `${convertDotToCamelCase(type)}_${Date.now()}`,
				type,
				position,
				data: {
					label: nodeConfig.label,
					config: nodeConfig.initialData || {},
				},
			};

			setNodes((nds) => [...nds, newNode]);
			setIsDirty(true);
		},
		[reactFlowInstance, setNodes, setIsDirty],
	);

	const onDragOver = useCallback((event: React.DragEvent) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = 'move';
	}, []);

	const handleNodesChange = useCallback(
		(updatedNodes: Node[]) => {
			setNodes(updatedNodes as Workflow.INode[]);
			setIsDirty(true);
		},
		[setNodes, setIsDirty],
	);

	const handleEdgesChange = useCallback(
		(updatedEdges: any[]) => {
			setEdges(updatedEdges);
			setIsDirty(true);
		},
		[setEdges, setIsDirty],
	);

	const handleNodeClick = useCallback(
		(nodeId: string) => {
			setSelectedNodeId(nodeId);
		},
		[setSelectedNodeId],
	);

	const handleConfigChange = useCallback(
		(nodeId: string, config: Record<string, unknown>) => {
			updateNodeConfig(nodeId, config);
		},
		[updateNodeConfig],
	);

	const handleSave = useCallback(async () => {
		// Validate all nodes before saving
		for (const node of nodes) {
			const nodeRegistry = NODE_REGISTRY[node.type as keyof typeof NODE_REGISTRY];
			if (nodeRegistry?.validate) {
				const result = nodeRegistry.validate({
					label: node.data.label,
					...(node.data.config || {}),
				});
				if (!result.isValid) {
					setSelectedNodeId(node.id);
					message.error(`Lỗi tại node "${node.data.label}": ${result.message}`);
					return;
				}
			}
		}

		const success = await saveWorkflow();
		if (success) {
			setTimeout(() => {
				history.push('/workflow');
			}, 500);
		}
	}, [nodes, saveWorkflow, setSelectedNodeId]);

	if (loading && !currentWorkflow) {
		return (
			<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
				<Spin size='large' />
			</div>
		);
	}

	return (
		<div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
			<Toolbar onSave={handleSave} isDirty={isDirty} workflowName={currentWorkflow?.name} />

			<div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
				{/* Left Sidebar - Node Palette */}
				<div style={{ width: 250, borderRight: '1px solid #f0f0f0', backgroundColor: '#fafafa' }}>
					<NodePalette onNodeDragStart={onNodeDragStart} />
				</div>

				{/* Main Canvas */}
				<div ref={reactFlowWrapper} style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
					<FlowCanvas
						initialNodes={nodes}
						initialEdges={edges}
						onNodesChange={handleNodesChange}
						onEdgesChange={handleEdgesChange}
						onConnect={onConnect}
						onEdgesDelete={onEdgesDelete}
						onNodeClick={handleNodeClick}
						onDrop={onDrop}
						onDragOver={onDragOver}
						onInit={setReactFlowInstance}
					/>
				</div>

				<NodeConfigPanel
					onDeleteNode={(nodeId) => deleteNode(nodeId)}
					open={!!selectedNodeId}
					onClose={() => setSelectedNodeId(null)}
					selectedNodeId={selectedNodeId}
					nodes={nodes}
					edges={edges}
					onConfigChange={handleConfigChange}
				/>
			</div>
		</div>
	);
};

export default WorkflowDesignPage;

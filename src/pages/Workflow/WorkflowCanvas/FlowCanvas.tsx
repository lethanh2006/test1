import { NODE_REGISTRY } from '@/components/Nodes/registry';
import {
	addEdge,
	Background,
	ConnectionLineType,
	Controls,
	ReactFlow,
	useEdgesState,
	useNodesState,
	type Connection,
	type Edge,
	type Node,
	type NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useEffect, useMemo } from 'react';

interface FlowCanvasProps {
	initialNodes: Node[];
	initialEdges: Edge[];
	onNodesChange: (nodes: Node[]) => void;
	onEdgesChange: (edges: Edge[]) => void;
	onNodeClick: (nodeId: string) => void;
	onDrop: (event: React.DragEvent) => void;
	onDragOver: (event: React.DragEvent) => void;
	onInit?: (instance: any) => void;
	onConnect?: (connection: Connection) => void;
	onEdgesDelete?: (edges: Edge[]) => void;
}

export const FlowCanvas = ({
	initialNodes,
	initialEdges,
	onNodesChange,
	onEdgesChange,
	onNodeClick,
	onDrop,
	onDragOver,
	onInit,
	onConnect: onConnectProp,
	onEdgesDelete: onEdgesDeleteProp,
}: FlowCanvasProps) => {
	const [nodes, setNodes, handleNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, handleEdgesChange] = useEdgesState(initialEdges);

	useEffect(() => {
		setNodes(initialNodes);
	}, [initialNodes, setNodes]);

	useEffect(() => {
		setEdges(initialEdges);
	}, [initialEdges, setEdges]);

	// Build nodeTypes from registry
	const nodeTypes: NodeTypes = useMemo(() => {
		const types: Record<string, React.ComponentType<any>> = {};
		Object.entries(NODE_REGISTRY).forEach(([type, config]) => {
			types[type] = config.visualComponent as React.ComponentType<any>;
		});
		return types;
	}, []);

	const onConnect = useCallback(
		(connection: Connection) => {
			if (onConnectProp) {
				onConnectProp(connection);
			} else {
				setEdges((eds) => {
					const newEdges = addEdge(connection, eds);
					setTimeout(() => onEdgesChange(newEdges), 0);
					return newEdges;
				});
			}
		},
		[onConnectProp, onEdgesChange, setEdges],
	);

	// Sync changes back to parent
	const handleNodesChangeWrapper = useCallback(
		(changes: any) => {
			handleNodesChange(changes);
			// Notify parent after a short delay to get updated nodes
			setTimeout(() => {
				setNodes((nds) => {
					onNodesChange(nds);
					return nds;
				});
			}, 0);
		},
		[handleNodesChange, onNodesChange, setNodes],
	);

	const handleEdgesChangeWrapper = useCallback(
		(changes: any) => {
			handleEdgesChange(changes);
			setTimeout(() => {
				setEdges((eds) => {
					onEdgesChange(eds);
					return eds;
				});
			}, 0);
		},
		[handleEdgesChange, onEdgesChange, setEdges],
	);

	const handleEdgesDeleteWrapper = useCallback(
		(deletedEdges: Edge[]) => {
			if (onEdgesDeleteProp) {
				onEdgesDeleteProp(deletedEdges);
			}
		},
		[onEdgesDeleteProp]
	);

	const handleNodeClickWrapper = useCallback(
		(_: React.MouseEvent, node: Node) => {
			onNodeClick(node.id);
		},
		[onNodeClick],
	);

	return (
		<div style={{ width: '100%', height: '100%' }}>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={handleNodesChangeWrapper}
				onEdgesChange={handleEdgesChangeWrapper}
				onConnect={onConnect}
				onEdgesDelete={handleEdgesDeleteWrapper}
				onNodeClick={handleNodeClickWrapper}
				nodeTypes={nodeTypes}
				onDrop={onDrop}
				onDragOver={onDragOver}
				onInit={onInit}
				fitView
				snapToGrid
				snapGrid={[15, 15]}
				connectionLineType={ConnectionLineType.SmoothStep}
				defaultEdgeOptions={{
					type: 'smoothstep',
					animated: true,
					style: { stroke: '#94a3b8', strokeWidth: 2 },
				}}
			>
				<Background />
				<Controls />
				{/* <MiniMap
					nodeColor={(node) => {
						const config = NODE_REGISTRY[node.type as keyof typeof NODE_REGISTRY];
						return config?.color || '#ccc';
					}}
				/> */}
			</ReactFlow>
		</div>
	);
};

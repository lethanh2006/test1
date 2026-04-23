import { WorkflowNodeType } from '@/components/Nodes/nodeConstants';

declare module Workflow {
	/**
	 * Workflow record
	 */
	export interface IRecordWorkflow {
		_id?: string;
		quyTrinhId?: string;
		ten: string;
		moTa: string;
		node: any;
		phanHeQuyTrinh: string;
	}

	export interface WorkflowNode {
		id: string; // Định danh duy nhất trong workflow
		name?: string; // Tên hiển thị (User friendly)
		type: WorkflowNodeType; // Loại node
		position?: {
			x: number;
			y: number;
		};
		next?: string[] | { [key: string]: string }; // Node tiếp theo (String, Array hoặc Map)
		config?: any;
	}

	export interface IWorkflow {
		_id?: string;
		name: string;
		description?: string;
		nodes: INode[];
		edges: IEdge[];
	}

	/**
	 * Node on canvas (extends React Flow Node)
	 */
	export interface INode {
		id: string;
		type: WorkflowNodeType; // WorkflowNodeType
		position: {
			x: number;
			y: number;
		};
		data: {
			label: string;
			config: Record<string, unknown>;
		};
	}

	/**
	 * Edge/Connection between nodes
	 */
	export interface IEdge {
		id: string;
		source: string;
		target: string;
		sourceHandle?: string;
		targetHandle?: string;
		type?: string;
		animated?: boolean;
		style?: React.CSSProperties;
	}
}

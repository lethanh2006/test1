import { BaseNode } from '@/components/Nodes/BaseNode';
import { WorkflowNodeType } from '@/components/Nodes/nodeConstants';
import { NODE_REGISTRY } from '@/components/Nodes/registry';
import { AppNode } from '@/components/Nodes/type';
import { FileExcelOutlined } from '@ant-design/icons';
import { NodeProps } from '@xyflow/react';
import React from 'react';

export const ExportExcelNodeVisual: React.FC<NodeProps<AppNode>> = (props) => {
	return (
		<BaseNode
			{...props}
			icon={<FileExcelOutlined style={{ color: '#722ed1' }} />}
			color={NODE_REGISTRY[WorkflowNodeType.SERVICE_EXPORT_EXCEL].color}
			title={NODE_REGISTRY[WorkflowNodeType.SERVICE_EXPORT_EXCEL].label}
		/>
	);
};

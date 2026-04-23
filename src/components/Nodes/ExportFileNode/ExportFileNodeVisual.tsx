import { BaseNode } from '@/components/Nodes/BaseNode';
import { WorkflowNodeType } from '@/components/Nodes/nodeConstants';
import { NODE_REGISTRY } from '@/components/Nodes/registry';
import { AppNode } from '@/components/Nodes/type';
import { FileWordOutlined } from '@ant-design/icons';
import { NodeProps } from '@xyflow/react';
import React from 'react';

export const ExportFileNodeVisual: React.FC<NodeProps<AppNode>> = (props) => {
	return (
		<BaseNode
			{...props}
			icon={<FileWordOutlined style={{ color: '#722ed1' }} />}
			color={NODE_REGISTRY[WorkflowNodeType.SERVICE_EXPORT_FILE].color}
			title={NODE_REGISTRY[WorkflowNodeType.SERVICE_EXPORT_FILE].label}
		/>
	);
};

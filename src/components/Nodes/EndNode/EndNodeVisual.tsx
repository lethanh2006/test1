import { AppNode } from '@/components/Nodes/type';
import { StopOutlined } from '@ant-design/icons';
import type { NodeProps } from '@xyflow/react';
import React from 'react';
import { BaseNode } from '../BaseNode';
import { NODE_COLORS, NODE_TITLES, WorkflowNodeType } from '../nodeConstants';

export const EndNodeVisual: React.FC<NodeProps<AppNode>> = ({ data }) => {
	return (
		<BaseNode
			data={data}
			title={NODE_TITLES[WorkflowNodeType.END]}
			icon={<StopOutlined />}
			color={NODE_COLORS[WorkflowNodeType.END]}
			outputs={false}
		/>
	);
};

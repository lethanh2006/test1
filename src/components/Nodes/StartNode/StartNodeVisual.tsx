import { PlayCircleOutlined } from '@ant-design/icons';
import type { NodeProps } from '@xyflow/react';
import React from 'react';
import { BaseNode } from '../BaseNode';
import { NODE_COLORS, NODE_TITLES, WorkflowNodeType } from '../nodeConstants';
import type { AppNode } from '../type';

export const StartNodeVisual: React.FC<NodeProps<AppNode>> = ({ data }) => {
	return (
		<BaseNode
			data={data}
			title={NODE_TITLES[WorkflowNodeType.START]}
			icon={<PlayCircleOutlined />}
			color={NODE_COLORS[WorkflowNodeType.START]}
			inputs={false}
			outputs={true}
		/>
	);
};

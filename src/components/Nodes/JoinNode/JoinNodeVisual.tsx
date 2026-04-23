import { AppNode } from '@/components/Nodes/type';
import { MergeCellsOutlined } from '@ant-design/icons';
import type { NodeProps } from '@xyflow/react';
import { Tag } from 'antd';
import React from 'react';
import { BaseNode } from '../BaseNode';
import { NODE_COLORS, NODE_TITLES, WorkflowNodeType } from '../nodeConstants';
import { JoinConfig } from './JoinNodeConfig';

export const JoinNodeVisual: React.FC<NodeProps<AppNode>> = ({ data }) => {
	const config = data.config as Partial<JoinConfig>;

	const renderContent = () => {
		if (!config?.requiredNodeIds || config.requiredNodeIds.length === 0) {
			return <div style={{ fontSize: 10, color: '#8c8c8c' }}>⚠️ No nodes specified</div>;
		}

		return (
			<div>
				<div style={{ fontSize: 10, color: '#595959', marginBottom: 4 }}>
					Waiting for {config.requiredNodeIds.length} node{config.requiredNodeIds.length > 1 ? 's' : ''}:
				</div>
				<div style={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
					{config.requiredNodeIds.slice(0, 3).map((nodeId) => (
						<Tag key={nodeId} style={{ fontSize: 9, margin: 0, padding: '0 4px' }}>
							{nodeId.length > 10 ? nodeId.substring(0, 10) + '...' : nodeId}
						</Tag>
					))}
					{config.requiredNodeIds.length > 3 && (
						<Tag style={{ fontSize: 9, margin: 0, padding: '0 4px' }}>+{config.requiredNodeIds.length - 3} more</Tag>
					)}
				</div>
			</div>
		);
	};

	return (
		<BaseNode
			data={data}
			title={NODE_TITLES[WorkflowNodeType.SERVICE_JOIN]}
			icon={<MergeCellsOutlined />}
			color={NODE_COLORS[WorkflowNodeType.SERVICE_JOIN]}
			inputs={true}
			outputs={true}
		>
			{renderContent()}
		</BaseNode>
	);
};

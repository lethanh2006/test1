import { AppNode } from '@/components/Nodes/type';
import { BranchesOutlined } from '@ant-design/icons';
import type { NodeProps } from '@xyflow/react';
import { Tag } from 'antd';
import React from 'react';
import { BaseNode } from '../BaseNode';
import { NODE_COLORS, NODE_TITLES, WorkflowNodeType } from '../nodeConstants';
import { ConditionConfig } from './ConditionNodeConfig';

export const ConditionNodeVisual: React.FC<NodeProps<AppNode>> = ({ data }) => {
	const config = data.config as Partial<ConditionConfig>;

	const renderContent = () => {
		if (!config?.conditions || config.conditions.length === 0) {
			return <div style={{ fontSize: 10, color: '#8c8c8c' }}>⚠️ No conditions</div>;
		}

		const logic = config.logic || 'AND';
		const conditionCount = config.conditions.length;

		return (
			<div>
				<div style={{ marginBottom: 4 }}>
					<Tag color={logic === 'AND' ? 'blue' : 'orange'} style={{ fontSize: 9, margin: 0 }}>
						{logic}
					</Tag>
					<span style={{ fontSize: 10, color: '#595959', marginLeft: 4 }}>
						{conditionCount} condition{conditionCount > 1 ? 's' : ''}
					</span>
				</div>
				<div style={{ fontSize: 9, color: '#8c8c8c' }}>
					{config.conditions.slice(0, 2).map((cond, idx) => (
						<div key={idx} style={{ marginBottom: 2 }}>
							• {cond.type}: {cond.operator}
						</div>
					))}
					{conditionCount > 2 && <div>+ {conditionCount - 2} more...</div>}
				</div>
			</div>
		);
	};

	return (
		<BaseNode
			data={data}
			title={NODE_TITLES[WorkflowNodeType.SERVICE_CONDITION]}
			icon={<BranchesOutlined />}
			color={NODE_COLORS[WorkflowNodeType.SERVICE_CONDITION]}
			inputs={true}
			outputs={[
				{ id: 'out-0', label: 'True', color: '#52c41a' },
				{ id: 'out-1', label: 'False', color: '#f5222d' },
			]}
		>
			{renderContent()}
		</BaseNode>
	);
};

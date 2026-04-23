import { AppNode } from '@/components/Nodes/type';
import { UserOutlined } from '@ant-design/icons';
import type { NodeProps } from '@xyflow/react';
import { Col, Row, Tag } from 'antd';
import React from 'react';
import { BaseNode } from '../BaseNode';
import { NODE_COLORS, NODE_TITLES, WorkflowNodeType } from '../nodeConstants';
import { UserActionConfig } from './UserActionNodeConfig';

export const UserActionNodeVisual: React.FC<NodeProps<AppNode>> = ({ data }) => {
	// Use Partial to handle incomplete config during initialization
	const config = data.config as Partial<UserActionConfig>;

	// Render children content - hiển thị số action và deadline
	const renderContent = () => {
		const parts: React.ReactNode[] = [];

		// Show actions count
		if (config?.actions && config.actions.length > 0) {
			parts.push(
				<Row gutter={4} key='actions' style={{ marginBottom: 4 }}>
					{config.actions.map((action) => (
						<Col>
							<Tag key={action.id} style={{ fontSize: 10, marginBottom: 2 }}>
								{action.label}
							</Tag>
						</Col>
					))}
				</Row>,
			);
		}

		// Show deadline if configured
		if (config?.deadline) {
			parts.push(
				<div key='deadline' style={{ fontSize: 10, color: '#8c8c8c' }}>
					⏱ {config.deadline.duration} {config.deadline.unit}
				</div>,
			);
		}

		return parts.length > 0 ? <div>{parts}</div> : null;
	};

	return (
		<BaseNode
			data={data}
			title={NODE_TITLES[WorkflowNodeType.USER_ACTION]}
			icon={<UserOutlined />}
			color={NODE_COLORS[WorkflowNodeType.USER_ACTION]}
			inputs={true}
			showAddOnHandle={true}
			outputs={
				config?.actions?.map((action, index) => ({
					id: `out-${index}`,
					label: action.label,
				})) || true
			}
		>
			{renderContent()}
		</BaseNode>
	);
};

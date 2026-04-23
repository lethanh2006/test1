import { AppNode } from '@/components/Nodes/type';
import { FormOutlined } from '@ant-design/icons';
import type { NodeProps } from '@xyflow/react';
import { Tag } from 'antd';
import React from 'react';
import { BaseNode } from '../BaseNode';
import { NODE_COLORS, NODE_TITLES, WorkflowNodeType } from '../nodeConstants';
import { UserFormConfig } from './UserFormNodeConfig';

export const UserFormNodeVisual: React.FC<NodeProps<AppNode>> = ({ data }) => {
	const config = data.config as Partial<UserFormConfig>;

	const renderContent = () => {
		if (config.externalFormId) {
			return (
				<div style={{ fontSize: 10 }}>
					<Tag color='orange' style={{ marginBottom: 4 }}>External Form</Tag>
					<div style={{ color: '#8c8c8c', overflow: 'hidden', textOverflow: 'ellipsis' }}>
						ID: {config.externalFormId}
					</div>
				</div>
			);
		}

		const fields = config.fields || [];
		return (
			<div style={{ fontSize: 10 }}>
				<div style={{ marginBottom: 4 }}>
					<Tag color='blue'>{fields.length} Fields</Tag>
				</div>
				{fields.slice(0, 2).map((f, i) => (
					<div key={i} style={{ color: '#595959', fontSize: 9 }}>
						• {f.label || f.name} ({f.type})
					</div>
				))}
				{fields.length > 2 && <div style={{ color: '#bfbfbf', fontStyle: 'italic' }}>+ {fields.length - 2} more...</div>}
				{fields.length === 0 && <span style={{ color: '#bfbfbf' }}>No fields configured</span>}
			</div>
		);
	};

	return (
		<BaseNode
			data={data}
			title={NODE_TITLES[WorkflowNodeType.USER_FORM]}
			icon={<FormOutlined />}
			color={NODE_COLORS[WorkflowNodeType.USER_FORM]}
			inputs={true}
			showAddOnHandle={true}
			outputs={true}
		>
			{renderContent()}
		</BaseNode>
	);
};

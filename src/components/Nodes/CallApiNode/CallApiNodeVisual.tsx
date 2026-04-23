import { AppNode } from '@/components/Nodes/type';
import { CloudSyncOutlined } from '@ant-design/icons';
import type { NodeProps } from '@xyflow/react';
import { Tag } from 'antd';
import React from 'react';
import { BaseNode } from '../BaseNode';
import { NODE_COLORS, NODE_TITLES, WorkflowNodeType } from '../nodeConstants';
import { ApiCallConfig } from './CallApiNodeConfig';

export const CallApiNodeVisual: React.FC<NodeProps<AppNode>> = ({ data }) => {
	const config = data.config as Partial<ApiCallConfig>;
	const apiType = config.type || 'http';

	const renderContent = () => {
		return (
			<div style={{ fontSize: 10 }}>
				<div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
					<Tag
						color={apiType === 'http' ? 'processing' : 'warning'}
						style={{ margin: 0, fontSize: 9, lineHeight: '14px' }}
					>
						{apiType.toUpperCase()}
					</Tag>
					{apiType === 'http' && (
						<Tag color='geekblue' style={{ margin: 0, fontSize: 9, lineHeight: '14px' }}>
							{config.method || 'GET'}
						</Tag>
					)}
				</div>
				<div style={{ color: '#595959', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
					{apiType === 'http' ? config.url : config.pattern || 'Not configured'}
				</div>
			</div>
		);
	};

	return (
		<BaseNode
			data={data}
			title={NODE_TITLES[WorkflowNodeType.SERVICE_CALL_API]}
			icon={<CloudSyncOutlined />}
			color={NODE_COLORS[WorkflowNodeType.SERVICE_CALL_API]}
			inputs={true}
			outputs={true}
		>
			{renderContent()}
		</BaseNode>
	);
};

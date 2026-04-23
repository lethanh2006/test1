import { AppNode } from '@/components/Nodes/type';
import { CodeOutlined } from '@ant-design/icons';
import type { NodeProps } from '@xyflow/react';
import React from 'react';
import { BaseNode } from '../BaseNode';
import { NODE_COLORS, NODE_TITLES, WorkflowNodeType } from '../nodeConstants';
import { ScriptConfig } from './ScriptNodeConfig';

export const ScriptNodeVisual: React.FC<NodeProps<AppNode>> = ({ data }) => {
	const config = data.config as Partial<ScriptConfig>;

	// Render script preview - first line or summary
	const renderContent = () => {
		if (!config?.script) return null;

		const lines = config.script.split('\n').filter((line) => {
			const trimmed = line.trim();
			return trimmed && !trimmed.startsWith('//');
		});

		const preview = lines[0] || config.script;
		const truncated = preview.length > 25 ? preview.substring(0, 25) + '...' : preview;

		return (
			<div
				style={{
					fontSize: 10,
					fontFamily: 'monospace',
					color: '#595959',
					backgroundColor: '#f5f5f5',
					padding: '4px 6px',
					borderRadius: 4,
					marginTop: 4,
				}}
			>
				{truncated}
			</div>
		);
	};

	return (
		<BaseNode
			data={data}
			title={NODE_TITLES[WorkflowNodeType.SERVICE_SCRIPT]}
			icon={<CodeOutlined />}
			color={NODE_COLORS[WorkflowNodeType.SERVICE_SCRIPT]}
			inputs={true}
			outputs={true}
		>
			{renderContent()}
		</BaseNode>
	);
};

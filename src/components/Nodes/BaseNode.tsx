import { InfoCircleOutlined } from '@ant-design/icons';
import { Handle, Position } from '@xyflow/react';
import { Card, Tooltip, Typography } from 'antd';
import React from 'react';
import type { NodeData } from './type';

const { Text } = Typography;

export interface OutputHandle {
	id: string;
	label?: string;
	color?: string;
}

interface BaseNodeProps {
	data: NodeData;
	title: string;
	icon?: React.ReactNode;
	color?: string;
	children?: React.ReactNode;
	inputs?: boolean;
	outputs?: boolean | number | OutputHandle[]; // true = 1 output, number = multiple, array = custom with labels
	showAddOnHandle?: boolean;
}

export const BaseNode: React.FC<BaseNodeProps> = ({
	data,
	title,
	icon,
	color = '#1890ff',
	children,
	inputs = true,
	outputs = true,
	showAddOnHandle = false,
}) => {
	return (
		<Card
			size='small'
			style={{
				width: 180,
				borderRadius: 8,
				border: `1px solid #e8e8e8`,
				borderTop: `4px solid ${color}`,
				boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
			}}
			bodyStyle={{ padding: '8px 12px' }}
		>
			{inputs && (
				<Handle type='target' position={Position.Top} style={{ background: color, width: 12, height: 12, top: -6 }} />
			)}

			<div style={{ display: 'flex', alignItems: 'center', marginBottom: children ? 8 : 0 }}>
				{icon && <span style={{ marginRight: 8, color, fontSize: 16 }}>{icon}</span>}
				<div style={{ flex: 1, overflow: 'hidden' }}>
					<Text strong style={{ fontSize: 12, display: 'block' }} ellipsis>
						{data.label || title}
					</Text>
				</div>
				<Tooltip title='Click to configure'>
					<InfoCircleOutlined style={{ color: '#bfbfbf', fontSize: 12 }} />
				</Tooltip>
			</div>

			{children && <div style={{ fontSize: 11, color: '#595959' }}>{children}</div>}

			{outputs === true && (
				<Handle
					type='source'
					position={Position.Bottom}
					style={{ background: color, width: 12, height: 12, bottom: -6 }}
				/>
			)}

			{Array.isArray(outputs) &&
				outputs.map((out, i) => {
					const left = `${(i + 1) * (100 / (outputs.length + 1))}%`;
					return (
						<React.Fragment key={out.id}>
							<Handle
								type='source'
								position={Position.Bottom}
								id={out.id}
								style={{
									background: out.color || color,
									width: 12,
									height: 12,
									bottom: -6,
									left,
								}}
							/>
							{out.label && (
								<div
									style={{
										position: 'absolute',
										bottom: 2,
										left,
										transform: 'translateX(-50%)',
										fontSize: 9,
										color: out.color || '#8c8c8c',
										fontWeight: 500,
										whiteSpace: 'nowrap',
										pointerEvents: 'none',
										textTransform: 'uppercase',
									}}
								>
									{out.label}
								</div>
							)}
						</React.Fragment>
					);
				})}

			{showAddOnHandle && (
				<Handle
					type='source'
					position={Position.Right}
					id='addon'
					style={{ background: '#eb2f96', width: 12, height: 12, right: -6 }}
				/>
			)}
		</Card>
	);
};

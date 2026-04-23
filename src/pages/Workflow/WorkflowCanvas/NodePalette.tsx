import { WorkflowNodeType } from '@/components/Nodes/nodeConstants';
import { NODE_REGISTRY } from '@/components/Nodes/registry';
import { useIntl } from '@umijs/max';
import { Card } from 'antd';

interface NodePaletteProps {
	onNodeDragStart: (event: React.DragEvent, nodeType: WorkflowNodeType) => void;
}

export const NodePalette = ({ onNodeDragStart }: NodePaletteProps) => {
	const intl = useIntl();
	const draggableNodes = Object.entries(NODE_REGISTRY);

	return (
		<Card
			title={intl.formatMessage({ id: 'workflow.design.palette.title' })}
			style={{ height: '100%', overflowY: 'auto' }}
			styles={{ body: { padding: '12px' } }}
			size='small'
		>
			<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
				{draggableNodes.map(([type, config]) => (
					<div
						key={type}
						draggable
						onDragStart={(e) => onNodeDragStart(e, type as WorkflowNodeType)}
						style={{
							padding: '12px',
							border: `2px solid ${config.color}`,
							borderRadius: '4px',
							cursor: 'grab',
							backgroundColor: '#fff',
							transition: 'all 0.2s',
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.backgroundColor = `${config.color}15`;
							e.currentTarget.style.transform = 'translateX(4px)';
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.backgroundColor = '#fff';
							e.currentTarget.style.transform = 'translateX(0)';
						}}
					>
						<div style={{ fontWeight: 600, fontSize: 13, color: '#262626' }}>{config.label}</div>
						<div style={{ fontSize: 11, color: '#8c8c8c', marginTop: 4 }}>
							{intl.formatMessage({ id: 'workflow.design.palette.dragHint' })}
						</div>
					</div>
				))}
			</div>
		</Card>
	);
};

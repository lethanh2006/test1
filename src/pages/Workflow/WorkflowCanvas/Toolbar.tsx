import { SaveOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import { Button, Space, Tag } from 'antd';

interface ToolbarProps {
	onSave: () => void;
	isDirty: boolean;
	workflowName?: string;
}

export const Toolbar = ({ onSave, isDirty, workflowName }: ToolbarProps) => {
	const intl = useIntl();
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				padding: '8px 16px',
				borderBottom: '1px solid #f0f0f0',
				backgroundColor: '#fff',
			}}
		>
			<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
				<h3 style={{ margin: 0 }}>{workflowName || intl.formatMessage({ id: 'workflow.design.canvas.untitled' })}</h3>
				{isDirty && <Tag color='orange'>{intl.formatMessage({ id: 'workflow.design.canvas.unsaved' })}</Tag>}
			</div>

			<Space>
				<Button type='primary' icon={<SaveOutlined />} onClick={onSave} loading={false}>
					{intl.formatMessage({ id: 'workflow.design.canvas.save' })}
				</Button>
			</Space>
		</div>
	);
};

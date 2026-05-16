import { Card, Typography } from 'antd';
import React from 'react';
import { useIntl } from 'umi';

const { Text } = Typography;

interface TaskCardProps {
	task: Instance.IStepTask;
	selected: boolean;
	onClick: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, selected, onClick }) => {
	const intl = useIntl();
	const { node, clickable, depth } = task;

	// Disabled style for non-clickable tasks
	const isDisabled = !clickable;

	const getAssigneeLabel = (taskData: Instance.IStepTask): string => {
		const assignees = taskData?.node?.config?.assignee ?? [];
		if (!assignees.length) return '-';

		return (
			assignees
				.map((item: any) => {
					if (item?.danhSachThanhVienXuLy?.length) {
						return item.danhSachThanhVienXuLy
							.map((m: any) => m.hoTen)
							.filter(Boolean)
							.join(', ');
					}
					return item.tenDonVi ?? item.type ?? '-';
				})
				.filter(Boolean)
				.join(', ') || '-'
		);
	};

	return (
		<Card
			size='small'
			hoverable={clickable}
			onClick={clickable ? onClick : undefined}
			style={{
				marginBottom: 12,
				borderRadius: 8,
				height: 'auto',
				flex: 'none',
				transition: 'all 0.3s ease',
				cursor: clickable ? 'pointer' : 'not-allowed',
				borderColor: selected ? '#1890ff' : isDisabled ? '#d9d9d9' : '#f0f0f0',
				backgroundColor: selected ? '#e6f7ff' : isDisabled ? '#fafafa' : '#fff',
				boxShadow: selected ? '0 4px 12px rgba(24, 144, 255, 0.2)' : 'none',
				borderLeft: selected ? '4px solid #1890ff' : clickable ? '4px solid #52c41a' : '4px solid #d9d9d9',
				opacity: isDisabled ? 0.7 : 1,
			}}
		>
			<div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
					<Text
						strong
						style={{
							fontSize: 14,
							color: selected ? '#1890ff' : isDisabled ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.85)',
						}}
					>
						{intl.formatMessage(
							{ id: 'workflow.instance.taskCard.step' },
							{ depth, name: node.name || node.id || task.nodeId },
						)}
					</Text>
				</div>

				<div
					style={{
						display: 'flex',
						fontSize: 13,
						color: isDisabled ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.65)',
						width: '100%',
					}}
				>
					<span style={{ whiteSpace: 'nowrap', marginRight: 4 }}>Bộ phận xử lý:</span>
					<Text
						style={{ fontWeight: 500, color: 'inherit', flex: 1 }}
						ellipsis={{ tooltip: getAssigneeLabel(task) }}
					>
						{getAssigneeLabel(task)}
					</Text>
				</div>

				<div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
					{/* <Tag color={getNodeTypeColor(node.type)} style={{ margin: 0, fontSize: 11 }}>
						{node.type}
					</Tag>
					<Tag color='default' style={{ margin: 0, fontSize: 11 }}>
						Step {depth}
					</Tag> */}
				</div>
			</div>
		</Card>
	);
};

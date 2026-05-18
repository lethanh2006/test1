import { Card, Typography } from 'antd';
import React from 'react';
import { useIntl } from 'umi';
import { useModel } from '@umijs/max';

const { Text } = Typography;

interface TaskCardProps {
	task: Instance.IStepTask;
	selected: boolean;
	onClick: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, selected, onClick }) => {
	const intl = useIntl();
	const { listTaskMe } = useModel('workflow.instancetask');
	const { node, clickable, depth } = task;

	const meTask = listTaskMe?.find((t: any) => t.nodeId === task.nodeId);

	// Disabled style for non-clickable tasks
	const isDisabled = !clickable;

	const hanXuLyStr = meTask?.hanXuLy || task.instanceTask?.hanXuLy || (task as any).hanXuLy;
	const trangThaiStr = meTask?.trangThai || task.instanceTask?.trangThai || task.trangThai;
	const isOverdue = hanXuLyStr && trangThaiStr !== 'Đã xử lý' && new Date(hanXuLyStr).getTime() < Date.now();

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
				borderColor: selected ? '#1890ff' : isOverdue ? '#ff4d4f' : isDisabled ? '#d9d9d9' : '#f0f0f0',
				backgroundColor: selected ? '#e6f7ff' : isOverdue ? '#fff1f0' : isDisabled ? '#fafafa' : '#fff',
				boxShadow: selected ? '0 4px 12px rgba(24, 144, 255, 0.2)' : isOverdue ? '0 2px 8px rgba(255, 77, 79, 0.15)' : 'none',
				borderLeft: selected ? '4px solid #1890ff' : isOverdue ? '4px solid #ff4d4f' : clickable ? '4px solid #52c41a' : '4px solid #d9d9d9',
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

				{hanXuLyStr && (
					<div
						style={{
							display: 'flex',
							fontSize: 13,
							color: isOverdue ? '#cf1322' : isDisabled ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.65)',
							width: '100%',
						}}
					>
						<span style={{ whiteSpace: 'nowrap', marginRight: 4 }}>Hạn xử lý:</span>
						<Text style={{ fontWeight: 500, color: 'inherit', flex: 1 }}>
							{new Date(hanXuLyStr).toLocaleString('vi-VN', {
								day: '2-digit',
								month: '2-digit',
								year: 'numeric',
								hour: '2-digit',
								minute: '2-digit'
							})}
						</Text>
					</div>
				)}

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

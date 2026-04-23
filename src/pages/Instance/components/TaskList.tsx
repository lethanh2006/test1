import { useIntl } from '@umijs/max';
import { Empty } from 'antd';
import React from 'react';
import { TaskCard } from './TaskCard';

interface TaskListProps {
	tasks: Instance.IStepTask[];
	selectedTaskId?: string;
	onSelectTask: (nodeId: string) => void;
	loading?: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, selectedTaskId, onSelectTask, loading }) => {
	const intl = useIntl();
	const firstNonClickableIndex = tasks.findIndex((task) => !task.clickable);
	const handledMaxIndex = firstNonClickableIndex === -1 ? tasks.length - 1 : firstNonClickableIndex - 2;
	if (!loading && !tasks.length) {
		return (
			<div
				style={{
					width: 280,
					height: 756,
					overflowY: 'auto',
					flex: 'none',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					padding: 16,
					borderRadius: 8,
					backgroundColor: '#fff',
				}}
			>
				<Empty description={intl.formatMessage({ id: 'instances.khongconhiemvunao' })} />
			</div>
		);
	}
	const lastClickableTask = tasks.findLast((task) => task.clickable);
	const listTaskClickable = tasks.filter((task) => task.depth > (lastClickableTask?.depth || 0) || task.clickable);

	return (
		<div
			style={{
				width: 280,
				height: 756,
				overflow: 'hidden',
				flex: 'none',
				order: 1,
				alignSelf: 'stretch',
				flexGrow: 0,
				display: 'flex',
				flexDirection: 'column',
				borderRadius: 8,
				backgroundColor: '#fff',
				boxSizing: 'border-box',
			}}
		>
			<div
				style={{
					padding: '12px 16px',
					fontSize: 14,
					fontWeight: 600,
					color: 'rgba(0, 0, 0, 0.85)',
					borderBottom: '1px solid #f0f0f0',
					flex: 'none',
				}}
			>
				{intl.formatMessage({ id: 'instances.sostepcanthuchien' })} ({listTaskClickable.length})
			</div>

			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'flex-start',
					padding: '16px 16px',
					width: '100%',
					flex: 1,
					overflowY: 'auto',
					gap: 0,
					boxSizing: 'border-box',
				}}
			>
				{listTaskClickable.map((task, index) => (
					<TaskCard
						key={task.nodeId}
						task={task}
						selected={task.nodeId === selectedTaskId}
						onClick={() => onSelectTask(task.nodeId)}
						isLast={index === tasks.length - 1}
						showHandledTag={index <= handledMaxIndex}
					/>
				))}
			</div>
		</div>
	);
};

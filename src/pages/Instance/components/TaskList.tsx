import ButtonExtend from '@/components/Table/ButtonExtend';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Card, Empty } from 'antd';
import React from 'react';
import { useIntl } from 'umi';
import { TaskCard } from './TaskCard';

interface TaskListProps {
	tasks: Instance.IStepTask[];
	selectedTaskId?: string;
	onSelectTask: (nodeId: string) => void;
	loading?: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, selectedTaskId, onSelectTask, loading }) => {
	const intl = useIntl();

	if (!loading && !tasks.length) {
		return (
			<Card style={{ height: '100%', borderRadius: 8 }}>
				<Empty description={intl.formatMessage({ id: 'workflow.instance.taskList.empty' })} />
			</Card>
		);
	}

	// const listTaskClickable = tasks.filter((task) => task.clickable);

	return (
		<Card
			title={
				<div style={{ fontSize: 14 }}>
					<ButtonExtend
						onClick={() => {
							history.back();
						}}
						tooltip={intl.formatMessage({ id: 'workflow.instance.taskList.back' })}
						type='link'
						icon={<ArrowLeftOutlined />}
					/>
					{intl.formatMessage({ id: 'workflow.instance.taskList.title' }, { count: tasks.length })}
				</div>
			}
			style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
		>
			<div
				style={{
					maxHeight: 'calc(100vh - 140px)',
					flex: 1,
					overflowY: 'auto',
					paddingRight: 8,
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				{tasks.map((task) => (
					<TaskCard
						key={task.nodeId}
						task={task}
						selected={task.nodeId === selectedTaskId}
						onClick={() => onSelectTask(task.nodeId)}
					/>
				))}
			</div>
		</Card>
	);
};

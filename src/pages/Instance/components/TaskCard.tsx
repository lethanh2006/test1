import { ETrangThaiInstanceTask, MapTrangThaiInstanceTaskColor } from '@/services/Instance/constance';
import { Tag, Typography } from 'antd';
import React from 'react';

const { Text } = Typography;

interface TaskCardProps {
	task: Instance.IStepTask;
	selected: boolean;
	onClick: () => void;
	isLast?: boolean;
	showHandledTag?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
	task,
	selected,
	onClick,
	isLast = false,
	showHandledTag = false,
}) => {
	const { node, clickable } = task;

	const isDisabled = !clickable;
	const status = showHandledTag ? ETrangThaiInstanceTask.DA_XU_LY : undefined;

	return (
		<div
			onClick={clickable ? onClick : undefined}
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'flex-start',
				padding: 0,
				width: '100%',
				minHeight: 63,
				flex: 'none',
				transition: 'all 0.3s ease',
				cursor: clickable ? 'pointer' : 'not-allowed',
				backgroundColor: selected ? '#E9F6FF' : 'transparent',
				paddingLeft: 4,
				paddingRight: 8,
				paddingTop: 6,
				paddingBottom: 6,
			}}
		>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					padding: 0,
					gap: 12,
					width: '100%',
					alignSelf: 'stretch',
				}}
			>
				<div
					style={{
						width: 20,
						height: 20,
						flexShrink: 0,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<svg width='15' height='15' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
						<circle cx='10' cy='10' r='8.75' stroke='#0E50CF' strokeWidth='1.25' fill='none' />
						{(selected || clickable) && <circle cx='10' cy='10' r='5' fill='#0E50CF' />}
					</svg>
				</div>

				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'flex-start',
						padding: 0,
						gap: 4,
						flex: 1,
						minWidth: 0,
					}}
				>
					<Text
						style={{
							fontSize: 14,
							lineHeight: '22px',
							color: selected ? '#0E50CF' : isDisabled ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.85)',
							overflow: 'hidden',
							display: '-webkit-box',
							WebkitLineClamp: 2,
							WebkitBoxOrient: 'vertical',
							fontWeight: 500,
						}}
					>
						{node.name || node.id || task.nodeId}
					</Text>
				</div>
			</div>

			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'flex-start',
					padding: 0,
					gap: 12,
					width: '100%',
					height: 40,
					flex: 'none',
				}}
			>
				<div
					style={{
						width: 20,
						height: 40,
						flex: 'none',
						display: 'flex',
						justifyContent: 'center',
					}}
				>
					{!isLast && (
						<div
							style={{
								width: 2,
								height: 40,
								backgroundColor: '#F4F4F4',
								borderRadius: 4,
							}}
						/>
					)}
				</div>

				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'flex-start',
						padding: '2px 0px 0px',
						gap: 4,
						width: 'calc(100% - 32px)',
						height: 40,
						flex: 'none',
					}}
				>
					{status && (
						<Tag
							color={MapTrangThaiInstanceTaskColor[status as ETrangThaiInstanceTask]}
							bordered={false}
							style={{
								margin: 0,
								fontSize: 12,
								fontFamily: 'Montserrat',
								fontStyle: 'normal',
								fontWeight: 600,
								lineHeight: '165%',
								letterSpacing: '0.015em',
								display: 'flex',
								alignItems: 'flex-end',
							}}
						>
							{status}
						</Tag>
					)}
				</div>
			</div>
		</div>
	);
};

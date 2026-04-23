import { DeadlineType } from '@/services/ThamQuyen/constant';
import { ThamQuyen } from '@/services/ThamQuyen/typing';
import { useIntl } from '@umijs/max';
import { Checkbox, Col, InputNumber, Row, Select, Space } from 'antd';

const getDayOptions = (intl: any) => [
	{ label: intl.formatMessage({ id: 'workflow.deadline.mon' }), value: 1 },
	{ label: intl.formatMessage({ id: 'workflow.deadline.tue' }), value: 2 },
	{ label: intl.formatMessage({ id: 'workflow.deadline.wed' }), value: 3 },
	{ label: intl.formatMessage({ id: 'workflow.deadline.thu' }), value: 4 },
	{ label: intl.formatMessage({ id: 'workflow.deadline.fri' }), value: 5 },
	{ label: intl.formatMessage({ id: 'workflow.deadline.sat' }), value: 6 },
	{ label: intl.formatMessage({ id: 'workflow.deadline.sun' }), value: 0 },
];

interface DeadlineConfigProps {
	value?: ThamQuyen.DeadlineConfig;
	onChange?: (value: ThamQuyen.DeadlineConfig) => void;
}

export const DeadlineConfig = ({ value, onChange }: DeadlineConfigProps) => {
	const intl = useIntl();
	const DAY_OPTIONS = getDayOptions(intl);
	const handleTypeChange = (type: DeadlineType) => {
		if (type === DeadlineType.DEADLINE_N_NGAY) {
			onChange?.({ type, value: 1 });
		} else {
			onChange?.({ type, value: [] });
		}
	};

	const handleValueChange = (newValue: number | number[]) => {
		if (!value) return;
		onChange?.({ ...value, value: newValue } as ThamQuyen.DeadlineConfig);
	};

	return (
		<Row gutter={[0, 8]}>
			<Col span={24}>
				<Select
					allowClear
					placeholder={intl.formatMessage({ id: 'workflow.deadline.type' })}
					value={value?.type}
					onChange={handleTypeChange}
					style={{ width: '100%' }}
					options={[
						{
							value: DeadlineType.DEADLINE_N_NGAY,
							label: intl.formatMessage({ id: 'workflow.deadline.nDays' }),
						},
						{
							value: DeadlineType.DEADLINE_THU_TRONG_TUAN,
							label: intl.formatMessage({ id: 'workflow.deadline.weekly' }),
						},
					]}
				/>
			</Col>
			<Col span={24}>
				<div
					style={{
						padding: '4px 8px',
						background: '#fafafa',
						borderRadius: 6,
						minHeight: 40,
						display: 'flex',
						alignItems: 'center',
					}}
				>
					{value?.type === DeadlineType.DEADLINE_N_NGAY && (
						<Space>
							<InputNumber
								min={1}
								value={value.value as number}
								onChange={(v) => handleValueChange(v ?? 1)}
								style={{ width: 80 }}
							/>
							<span style={{ fontSize: 13 }}>{intl.formatMessage({ id: 'workflow.deadline.days' })}</span>
						</Space>
					)}
					{value?.type === DeadlineType.DEADLINE_THU_TRONG_TUAN && (
						<Checkbox.Group
							value={value.value as number[]}
							onChange={(v) => handleValueChange(v as number[])}
							style={{ width: '100%' }}
						>
							<Row gutter={[8, 8]}>
								{DAY_OPTIONS.map((option) => (
									<Col span={8} key={option.value}>
										<Checkbox value={option.value} style={{ fontSize: 13 }}>
											{option.label}
										</Checkbox>
									</Col>
								))}
							</Row>
						</Checkbox.Group>
					)}
					{!value?.type && (
						<span style={{ fontSize: 12, color: '#bfbfbf', fontStyle: 'italic' }}>
							{intl.formatMessage({ id: 'nodes.vuilongchonloaihanxuly' })}
						</span>
					)}
				</div>
			</Col>
		</Row>
	);
};

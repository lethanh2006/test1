import { useIntl } from '@umijs/max';
import { Divider, Form } from 'antd';
import { AssigneeTable } from './AssigneeTable';
import { DeadlineConfig } from './DeadlineConfig';

export const ThamQuyenSection = () => {
	const intl = useIntl();
	return (
		<>
			<Divider orientation='left' plain style={{ margin: '12px 0 16px', fontWeight: 600, color: '#1890ff' }}>
				{intl.formatMessage({ id: 'nodes.thamquyenxuly' })}
			</Divider>

			<Form.Item name='deadline' label={intl.formatMessage({ id: 'nodes.hanxuly' })}>
				<DeadlineConfig />
			</Form.Item>

			<Form.Item name='assignee' label={intl.formatMessage({ id: 'nodes.nguoixuly' })}>
				<AssigneeTable />
			</Form.Item>
		</>
	);
};

export { AssigneeFormModal } from './AssigneeFormModal';
export { AssigneeTable } from './AssigneeTable';
export { DeadlineConfig } from './DeadlineConfig';

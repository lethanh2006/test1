import TableInstanceMe from '@/pages/Instance/components/TableInstanceMe';
import { useIntl } from '@umijs/max';

import { Card, Tabs } from 'antd';
import { useState } from 'react';

const InstanceMeListPage = () => {
	const intl = useIntl();
	const [viewType, setViewType] = useState<'creator' | 'specialist'>('creator');

	return (
		<Card title={intl.formatMessage({ id: 'instances.danhsachinstancecuatoi' })}>
			<Tabs
				onChange={(key: any) => {
					setViewType(key);
				}}
				activeKey={viewType}
				defaultActiveKey='creator'
			>
				<Tabs.TabPane tab={intl.formatMessage({ id: 'instances.nguoidung' })} key='creator' />
				<Tabs.TabPane tab={intl.formatMessage({ id: 'instances.chuyenvien' })} key='specialist' />
			</Tabs>

			<TableInstanceMe type={viewType} />
		</Card>
	);
};

export default InstanceMeListPage;

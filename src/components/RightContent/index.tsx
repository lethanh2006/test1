import React from 'react';
import { useIntl, useModel } from 'umi';
import AvatarDropdown from './AvatarDropdown';
import styles from './index.less';
import LocaleSwitch from './LocaleSwitch';
import ModuleSwitch from './ModuleSwitch';
import NoticeIconView from './NoticeIcon';

const GlobalHeaderRight: React.FC = () => {
	const intl = useIntl();
	const { initialState } = useModel('@@initialState');

	if (!initialState || !initialState.currentUser) {
		return null;
	}

	return (
		<>
			<div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center' }}>
				<div className={styles.menu_right}>
					<ModuleSwitch />

					<NoticeIconView />

					{/* <Tooltip
						title={intl.formatMessage({ id: 'app.header.introduce', defaultMessage: 'Giới thiệu chung' })}
						placement='bottom'
					>
						<Button onClick={() => history.push('/gioi-thieu')} icon={<InfoCircleOutlined />} />
					</Tooltip> */}

					<LocaleSwitch />

					<AvatarDropdown />
				</div>
			</div>
		</>
	);
};

export default GlobalHeaderRight;

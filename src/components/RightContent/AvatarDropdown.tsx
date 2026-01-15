import { landingUrl } from '@/services/base/constant';
import { DatabaseOutlined, FileWordOutlined, GlobalOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Spin } from 'antd';
import { ItemType } from 'antd/es/menu/interface';
import { rgba } from 'polished';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import { OIDCBounder } from '../OIDCBounder';
import styles from './index.less';

const AvatarDropdown = () => {
	const intl = useIntl();
	const { initialState } = useModel('@@initialState');
	const { danhSach: dsPhanVung, getPartitionCodeMeModel } = useModel('core.phanvunguser');
	const { getAllModel: getAllPhanVung } = useModel('core.phanvungdulieu');

	const currentPartition = localStorage.getItem('partitionCode');

	//Phân vùng dữ liệu
	useEffect(() => {
		if (initialState?.currentUser?.ssoId) {
			//Get All phân vùng để lấy mã màu
			getAllPhanVung();
			getPartitionCodeMeModel(currentPartition?.toString());
		}
	}, [initialState?.currentUser?.ssoId]);

	const loginOut = () => OIDCBounder?.getActions()?.dangXuat();

	if (!initialState || !initialState.currentUser)
		return (
			<span className={`${styles.action} ${styles.account}`}>
				<Spin size='small' style={{ marginLeft: 8, marginRight: 8 }} />
			</span>
		);

	const fullName = initialState.currentUser?.family_name
		? `${initialState.currentUser.family_name} ${initialState.currentUser?.given_name ?? ''}`
		: (initialState.currentUser?.name ?? (initialState.currentUser?.preferred_username || ''));
	const lastNameChar = fullName.split(' ')?.at(-1)?.[0]?.toUpperCase();

	const currentPartitionInfo = dsPhanVung?.find((item) => item?.dataPartitionCode === currentPartition);
	const currentPartitionColor = currentPartitionInfo?.dataPartition?.maMau;
	const currentPartitionName = currentPartitionInfo?.dataPartition?.name;

	const partitionItems: ItemType[] =
		dsPhanVung?.map((item) => {
			const code = item?.dataPartitionCode;
			const isActive = code === currentPartition;
			const partitionColor = item?.dataPartition?.maMau;

			const activeColor = partitionColor || 'var(--color-primary)';
			const activeBgColor = partitionColor ? rgba(partitionColor, 0.1) : 'var(--color-primary-bg)';

			return {
				key: `partition-${code}`,
				icon: <DatabaseOutlined />,
				label: item?.dataPartition?.name ?? item?.dataPartition?.ma,
				style: isActive
					? {
						backgroundColor: activeBgColor,
						borderLeft: `3px solid ${activeColor}`,
						color: activeColor,
						fontWeight: 'bold',
					}
					: undefined,
				onClick: () => {
					localStorage.setItem('partitionCode', code);
					window.location.reload();
				},
			};
		}) ?? [];

	const items: ItemType[] = [
		...(partitionItems as any),
		...(partitionItems.length > 0 ? [{ type: 'divider', key: 'divider' } as ItemType] : []),
		{
			key: 'name',
			icon: <UserOutlined />,
			label: fullName,
		},
		// {
		// 	key: 'password',
		// 	icon: <SwapOutlined />,
		// 	label: 'Đổi mật khẩu',
		// 	onClick: () => {
		// 		const redirect = window.location.href;
		// 		window.location.href = `${keycloakAuthEndpoint}?client_id=${AppModules[currentRole].clientId}&redirect_uri=${redirect}&response_type=code&scope=openid&kc_action=UPDATE_PASSWORD`;
		// 	},
		// },
		{
			key: 'office',
			icon: <FileWordOutlined />,
			label: 'Office 365',
			onClick: () => window.open('https://mail.ptit.edu.vn/'),
		},
		{
			key: 'portal',
			icon: <GlobalOutlined />,
			label:
				`${intl.formatMessage({ id: `modules.cong-thong-tin` }) ?? intl.formatMessage({ id: 'app.header.portal', defaultMessage: 'Cổng thông tin' })}`,
			onClick: () => window.open(landingUrl),
		},
		{ type: 'divider', key: 'divider' },
		{
			key: 'logout',
			icon: <LogoutOutlined />,
			label: intl.formatMessage({ id: 'app.header.logout', defaultMessage: 'Đăng xuất' }),
			onClick: loginOut,
			danger: true,
		},
	];

	return (
		<>
			<Dropdown menu={{ items }}>
				<span className={`${styles.action} ${styles.account}`}>
					<div className={styles.avatarWrapper}>
						<Avatar
							className={styles.avatar}
							src={initialState.currentUser?.picture ? <img src={initialState.currentUser?.picture} /> : undefined}
							icon={!initialState.currentUser?.picture ? (lastNameChar ?? <UserOutlined />) : undefined}
							alt='avatar'
						/>
						{dsPhanVung?.length >= 2 && (
							<span
								className={styles.partitionBadge}
								style={{
									backgroundColor: currentPartitionColor || 'var(--color-primary)',
									color: '#fff',
								}}
							>
								{currentPartitionName?.[0]?.toUpperCase() ?? ''}
							</span>
						)}
					</div>
					<span className={`${styles.name}`}>{fullName}</span>
				</span>
			</Dropdown>
		</>
	);
};

export default AvatarDropdown;

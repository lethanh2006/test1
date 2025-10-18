import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import '@ant-design/v5-patch-for-react-19';
import { App } from 'antd';
import 'dayjs/locale/vi';
import React from 'react'; // Bổ sung import React
import type { RunTimeLayoutConfig } from 'umi';
import { history } from 'umi';
import defaultSettings from '../config/defaultSettings';
import ErrorBoundary from './components/ErrorBoundary';
import { OIDCBounder } from './components/OIDCBounder';
import { unCheckPermissionPaths } from './components/OIDCBounder/constant';
import OneSignalBounder from './components/OneSignalBounder';
import TechnicalSupportBounder from './components/TechnicalSupportBounder';
import ConfigBounder from './components/TechnicalSupportBounder/ConfigBounder';
import NotAccessible from './pages/exception/403';
import NotFoundContent from './pages/exception/404';
import { AppModules } from './services/base/constant';
import type { IInitialState } from './services/base/typing';
import './styles/global.less';
import { currentRole, replaceRole } from './utils/ip';

export function rootContainer(container: React.ReactNode) {
	return (
		<ConfigBounder>
			<App>{container}</App>
		</ConfigBounder>
	);
}

export async function getInitialState(): Promise<IInitialState> {
	try {
		const raw = sessionStorage.getItem('initialState');
		if (raw) {
			const parsed = JSON.parse(raw) as Partial<IInitialState>;
			delete parsed.currentUser;
			return { settings: defaultSettings, ...parsed };
		}
	} catch (e) {}

	return {
		settings: defaultSettings,
		permissionLoading: true,
	};
}

// ProLayout  https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
	return {
		unAccessible: (
			<OIDCBounder>
				<TechnicalSupportBounder>
					<NotAccessible />
				</TechnicalSupportBounder>
			</OIDCBounder>
		),
		noFound: <NotFoundContent />,
		rightContentRender: () => <RightContent />,
		// headerContentRender: () => <HeaderContentPage />,
		disableContentMargin: true,

		footerRender: () => <Footer />,

		onPageChange: () => {
			if (initialState?.currentUser) {
				const { location } = history;
				const isUncheckPath = unCheckPermissionPaths.some((path) => window.location.pathname.includes(path));

				if (location.pathname === '/') {
					history.replace('/dashboard');
				} else if (
					!isUncheckPath &&
					currentRole &&
					initialState?.authorizedPermissions?.length &&
					!initialState?.authorizedPermissions?.find((item) => item.rsname === currentRole)
				) {
					const hasReplaceRole = initialState.authorizedPermissions.some((item) => item.rsname === replaceRole);
					const linkReplace = !!replaceRole && AppModules[replaceRole]?.url;

					if (!!linkReplace && hasReplaceRole) {
						window.location.replace(linkReplace);
						return;
					}
					history.replace('/403');
				}
			}
		},

		menuItemRender: (item: any, dom: any) => (
			<a
				className='not-underline'
				key={item?.path}
				href={item?.path}
				onClick={(e) => {
					e.preventDefault();
					history.push(item?.path ?? '/');
				}}
				style={{ display: 'block' }}
			>
				{dom}
			</a>
		),

		childrenRender: (dom) => (
			<OIDCBounder>
				<ErrorBoundary>
					<TechnicalSupportBounder>
						<OneSignalBounder>{dom}</OneSignalBounder>
					</TechnicalSupportBounder>
				</ErrorBoundary>
			</OIDCBounder>
		),

		title: AppModules[currentRole].title,
		...initialState?.settings,
	};
};

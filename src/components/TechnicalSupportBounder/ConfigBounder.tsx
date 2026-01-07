import { primaryColor } from '@/services/base/constant';
import { getLocale } from '@umijs/max';
import { ConfigProvider, Spin } from 'antd';
import { useEffect } from 'react';

/** Chú ý các route để layout: false thì phải bọc bởi ConfigBound để nhận styles */
const ConfigBounder = (props: { children?: any }) => {
	useEffect(() => {
		// Đổi màu real time => Hỗ trợ đổi tenant
		ConfigProvider.config({
			theme: {
				token: { borderRadius: 4, colorPrimary: primaryColor, colorLink: primaryColor },
				hashed: false,
				cssVar: { prefix: '' },
			},
		});

		Spin.setDefaultIndicator(<div className='circle-loader' />);
	}, [primaryColor]);

	const locale = getLocale();

	return (
		<ConfigProvider
			locale={locale}
			theme={{
				token: { borderRadius: 4, colorPrimary: primaryColor, colorLink: primaryColor },
				hashed: false,
				cssVar: { prefix: '' },
				components: {
					Carousel: {
						dotHeight: 6,
						dotOffset: 2, // khoảng cách từ bottom
					},
					Spin: {
						dotSize: 45,
						dotSizeSM: 30,
						dotSizeLG: 60,
					},
					Divider: {
						orientationMargin: 0,
					},
					Table: {
						borderColor: '#e8e8e8',
						headerBg: '#f8f8f8',
					},
				},
			}}
		>
			{props.children}
		</ConfigProvider>
	);
};

export default ConfigBounder;

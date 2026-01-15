import { unitName } from '@/services/base/constant';
import { useIntl } from '@umijs/max';
import { Card } from 'antd';
import '../../TrangChu/components/style.less';

const AboutPage = () => {
	const intl = useIntl();
	return (
		<Card styles={{ body: { height: '100%' } }}>
			<div className='home-welcome'>
				<h1 className='title'>
					{intl.formatMessage({ id: 'pages.gioithieu.title' })}{' '}
					{(intl.formatMessage({ id: unitName }) || unitName).toUpperCase()}
				</h1>
				<h2 className='sub-title'>
					{intl.formatMessage({ id: 'pages.gioithieu.subtitle' })} -{' '}
					{(intl.formatMessage({ id: unitName }) || unitName).toUpperCase()}
				</h2>
			</div>
		</Card>
	);
};

export default AboutPage;

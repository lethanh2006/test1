import { unitName } from '@/services/base/constant';
import { Card } from 'antd';
import '../../TrangChu/components/style.less';

const AboutPage = () => {
	return (
		<Card styles={{ body: { height: '100%' } }}>
			<div className='home-welcome'>
				<h1 className='title'>GIỚI THIỆU {unitName.toUpperCase()}</h1>
				<h2 className='sub-title'>HỆ THỐNG CHUYỂN ĐỔI SỐ - {unitName.toUpperCase()}</h2>
			</div>
		</Card>
	);
};

export default AboutPage;

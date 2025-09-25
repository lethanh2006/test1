import { unitName } from '@/services/base/constant';
import { Card } from 'antd';
import './components/style.less';

const TrangChu = () => {
	return (
		<Card styles={{ body: { height: '100%' } }} variant='borderless'>
			<div className='home-welcome'>
				<h1 className='title'>PHÂN HỆ QUẢN LÝ ĐÀO TẠO</h1>
				<h2 className='sub-title'>HỆ THỐNG CHUYỂN ĐỔI SỐ - {unitName.toUpperCase()}</h2>
			</div>
		</Card>
	);
};

export default TrangChu;

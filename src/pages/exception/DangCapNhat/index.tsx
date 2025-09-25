import Footer from '@/components/Footer';
import { landingUrl } from '@/services/base/constant';
import { GlobalOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import { Button, Result } from 'antd';
import { useEffect } from 'react';

const DangCapNhatPage = () => {
	// Nếu Đang cập nhật thì bỏ cái này đi
	useEffect(() => {
		history.replace('/dashboard');
	}, []);

	return (
		<div
			style={{
				minHeight: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				flexDirection: 'column',
			}}
		>
			<Result
				status='404'
				title='Đang cập nhật'
				style={{ background: 'none' }}
				subTitle='Hệ thống đang cập nhật. Vui lòng thử lại sau!'
				extra={
					<Button type='primary' href={landingUrl} icon={<GlobalOutlined />} className='not-underline'>
						Tới trang Cổng thông tin
					</Button>
				}
			/>

			<Footer />
		</div>
	);
};
export default DangCapNhatPage;

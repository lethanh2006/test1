import { HomeOutlined } from '@ant-design/icons';
import { Button, Result } from 'antd';
import { history, useIntl } from 'umi';

const NotFoundContent = () => {
	const intl = useIntl();

	return (
		<Result
			status='404'
			title='404'
			style={{ background: 'none' }}
			subTitle={intl.formatMessage({ id: 'pages.exception.404.subtitle' })}
			extra={
				<Button type='primary' onClick={() => history.push('/')} icon={<HomeOutlined />}>
					{intl.formatMessage({ id: 'pages.exception.404.backhome' })}
				</Button>
			}
		/>
	);
};

export default NotFoundContent;

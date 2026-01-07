import ModalExpandable from '@/components/Table/ModalExpandable';
import ViewThongBao from '@/pages/ThongBao/components/ViewThongBao';
import { Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import NoticeIcon from './NoticeIcon';
import NoticeList from './NoticeList';

const NoticeIconView = () => {
	const intl = useIntl();
	const { record, setRecord, unread, readNotificationModel, page, limit, getThongBaoModel, total, loading } =
		useModel('thongbao.noticeicon');
	const [visibleDetail, setVisibleDetail] = useState<boolean>(false);
	const [visiblePopup, setVisiblePopup] = useState<boolean>(false);

	const getData = () => {
		getThongBaoModel();
	};

	useEffect(() => {
		getData();
	}, [page, limit]);

	const clearReadState = async () => {
		readNotificationModel('ALL');
		setVisiblePopup(false);
	};

	return (
		<>
			<NoticeIcon
				total={total}
				count={unread}
				popupVisible={visiblePopup}
				onPopupVisibleChange={(visible) => setVisiblePopup(visible)}
				allowClear={!!unread}
				onClear={clearReadState}
				getData={getData}
			>
				<Spin spinning={loading}>
					<NoticeList
						onClick={(item) => {
							setRecord(item);
							setVisibleDetail(true);
							setVisiblePopup(false);
						}}
					/>
				</Spin>
			</NoticeIcon>

			<ModalExpandable
				width={800}
				onCancel={() => setVisibleDetail(false)}
				open={visibleDetail}
				okButtonProps={{ hidden: true }}
				cancelText={intl.formatMessage({ id: 'global.button.dong', defaultMessage: 'Đóng' })}
				title={record?.title || 'Thông báo'}
			>
				<ViewThongBao
					record={record}
					afterViewDetail={() => {
						setVisibleDetail(false);
						setVisiblePopup(false);
					}}
					hideCard
				/>
			</ModalExpandable>
		</>
	);
};

export default NoticeIconView;

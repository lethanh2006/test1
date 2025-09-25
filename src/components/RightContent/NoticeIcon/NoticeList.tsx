import { type ThongBao } from '@/services/ThongBao/typing';
import dayjs from '@/utils/dayjs';
import { ArrowDownOutlined } from '@ant-design/icons';
import { Avatar, Divider, List, Skeleton } from 'antd';
import classNames from 'classnames';

import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link, useModel } from 'umi';
import styles from './index.less';

export type NoticeIconTabProps = {
	onClick?: (item: ThongBao.IRecord) => void;
	emptyText?: string;
	viewMoreText?: string;
};

const NoticeList: React.FC<NoticeIconTabProps> = ({
	onClick,
	emptyText = 'Bạn đã xem tất cả thông báo',
	viewMoreText = 'Tải thêm',
}) => {
	const { total, readNotificationModel, danhSach, loading, setPage } = useModel('thongbao.noticeicon');

	if (!danhSach || danhSach.length === 0) {
		return (
			<div className={styles.notFound}>
				<img src='https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg' alt='not found' />
				<div>{emptyText}</div>
			</div>
		);
	}

	const onItemClick = (item: ThongBao.IRecord) => {
		if (!item.read) readNotificationModel('ONE', item?._id);
		onClick?.(item);
	};

	const onViewMore = () => {
		if (loading) return;
		setPage((p) => p + 1);
	};

	return (
		<div>
			<div id='scrollableDiv' style={{ height: 460, overflow: 'auto' }}>
				<InfiniteScroll
					dataLength={danhSach.length}
					next={onViewMore}
					hasMore={danhSach.length < total}
					loader={<Skeleton paragraph={{ rows: 2 }} active style={{ padding: 12 }} />}
					endMessage={<Divider plain>{emptyText}</Divider>}
					scrollableTarget='scrollableDiv'
				>
					<List<ThongBao.IRecord>
						className={styles.list}
						dataSource={danhSach}
						renderItem={(item) => {
							const itemCls = classNames(styles.item, { [styles.read]: !item.read });
							const leftIcon = item.imageUrl ? <Avatar className={styles.avatar} src={item.imageUrl} /> : null;

							return (
								<List.Item className={itemCls} key={item._id} onClick={() => onItemClick(item)}>
									<List.Item.Meta
										className={styles.meta}
										avatar={leftIcon}
										title={<div className={styles.title}>{item.title}</div>}
										description={
											<>
												<div className={styles.description}>{item.description}</div>
												<div className={styles.datetime}>{dayjs(item.createdAt).fromNow()}</div>
											</>
										}
									/>
								</List.Item>
							);
						}}
					/>
				</InfiniteScroll>
			</div>

			{danhSach.length < total ? (
				<div className={styles.bottomBar}>
					<Link
						to='#!'
						onClick={(e) => {
							e.preventDefault();
							onViewMore?.();
						}}
					>
						<ArrowDownOutlined /> {viewMoreText}
					</Link>
				</div>
			) : null}
		</div>
	);
};

export default NoticeList;

import { coQuanChuQuan, unitName } from '@/services/base/constant';
import dayjs from '@/utils/dayjs';
import { Col, Row } from 'antd';
import React from 'react';
import './style.less';
import { useIntl } from '@umijs/max';

/**
 * PRINT TEMPLATE
 * Có 2 class chính: `to-print` & `no-print`
 * Children có thể được hiện luôn trên web, ko cần `to-print`
 */
const PrintTemplate = React.forwardRef(
	(
		props: {
			children: React.ReactNode;
			title?: string;
			subTitle?: React.ReactNode;
			footer?: React.ReactNode;
			hideTieuNgu?: boolean;
			isCompact?: boolean;

			/** Tên Phòng ban hiển thị dưới tên trường */
			tenPhongBan?: string;
		},
		ref: any,
	) => {
		const { children, title, subTitle, footer, hideTieuNgu, isCompact, tenPhongBan } = props;
		const intl = useIntl();
		// const contentRef = useRef(null);

		// 	const handlePrint = useReactToPrint({ contentRef });

		// BUTTON PRINT
		// <Button icon={<PrinterOutlined />} onClick={() => handlePrint()}>
		// 	In biên lai
		// </Button>;

		// PRINT CONTENT
		// <PrintTemplate ref={contentRef}></PrintTemplate>

		return (
			<div className={`print-section ${isCompact ? 'compact' : ''}`} ref={ref}>
				<div className='to-print'>
					{!hideTieuNgu ? (
						<Row gutter={[5, 5]}>
							<Col span={12} style={{ textAlign: 'center' }}>
								{!!tenPhongBan ? (
									<>
										<div>{unitName.toUpperCase()}</div>
										<span className='tieu-ngu'>{tenPhongBan.toUpperCase()}</span>
									</>
								) : (
									<>
										<div>{coQuanChuQuan.toUpperCase()}</div>
										<span className='tieu-ngu'>{intl.formatMessage({ id: unitName }).toUpperCase()}</span>
									</>
								)}
							</Col>
							<Col span={12} style={{ textAlign: 'center' }}>
								<div className='quoc-hieu'>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
								<span className='tieu-ngu'>Độc lập - Tự do - Hạnh phúc</span>
							</Col>

							<Col span={12} style={{ textAlign: 'center' }}>
								Số: ....................
							</Col>
							<Col span={12} className='date'>
								...................., {dayjs().format('ngà\\y DD t\\háng MM nă\\m YYYY')}
							</Col>
						</Row>
					) : null}

					<div className='title'>{title}</div>
					<div className='sub-title'>{subTitle}</div>
				</div>

				{children}

				<div className='to-print' style={{ marginTop: 8 }}>
					{footer ?? (
						<Row gutter={[5, 5]}>
							<Col span={12} push={12} style={{ textAlign: 'center' }}>
								<b>CÁN BỘ LẬP DANH SÁCH</b>
							</Col>
						</Row>
					)}
				</div>
			</div>
		);
	},
);

export default PrintTemplate;

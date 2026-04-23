import ViewRender from '@/pages/DanhMuc/BieuMauKhaiBao/components/ViewRender';
import { EKieuDuLieu } from '@/services/DanhMuc/BieuMau/constant';
import { BieuMau } from '@/services/DanhMuc/BieuMau/typing';
import { useIntl, useModel } from '@umijs/max';
import { Card, Col, Row, Spin, Typography } from 'antd';
import { useEffect, useState } from 'react';

interface IProps {
	data: Instance.IInstanceTask | null;
}

const ResultFormDetail = ({ data }: IProps) => {
	const intl = useIntl();
	const { getByIdModel } = useModel('danhmuc.bieumau');
	const [externalFormConfig, setExternalFormConfig] = useState<BieuMau.IRecord>();
	const [loading, setLoading] = useState(false);

	const isExternalForm = !!data?.config?.externalFormId;
	const ketQua = data?.ketQua || {};

	useEffect(() => {
		if (data?.config?.externalFormId) {
			setLoading(true);
			getByIdModel(data.config.externalFormId)
				.then((res) => {
					setExternalFormConfig(res);
				})
				.finally(() => {
					setLoading(false);
				});
		}
	}, [data?.config?.externalFormId]);

	if (!data || !data.ketQua) return null;

	if (loading) {
		return (
			<Card style={{ marginBottom: 16 }}>
				<Spin tip={intl.formatMessage({ id: 'instances.dangtaithongtinform' })} />
			</Card>
		);
	}

	// Trường hợp external form
	if (isExternalForm && externalFormConfig) {
		return (
			<>
				<Row gutter={[24, 0]}>
					{externalFormConfig.cauHinhLoaiHinh?.map((field) => {
						const colSpan = field.colspan === 24 || field.kieuDuLieu === EKieuDuLieu.TABLE ? 24 : 12;

						return (
							<Col span={colSpan} key={field.ma} sm={24} md={colSpan}>
								<div style={{ marginBottom: 16 }}>
									<Typography.Text type='secondary' style={{ display: 'block', marginBottom: 4 }}>
										{field.ten}
									</Typography.Text>
									<ViewRender cauHinh={field} recordSanPham={ketQua} isCot />
								</div>
							</Col>
						);
					})}
				</Row>
			</>
		);
	}

	// Trường hợp internal form (fields)
	const fields = data.config?.fields as Array<{
		name: string;
		label: string;
		type: string;
	}>;

	if (!fields || fields.length === 0) {
		// Fallback nếu không có config fields nhưng có kết quả
		if (Object.keys(ketQua).length > 0) {
			return (
				<>
					<Row gutter={[24, 0]}>
						{Object.entries(ketQua).map(([key, value]) => (
							<Col span={12} key={key} sm={24} md={12}>
								<div style={{ marginBottom: 16 }}>
									<Typography.Text type='secondary' style={{ display: 'block', marginBottom: 4 }}>
										{key}
									</Typography.Text>
									<Typography.Text strong>
										{typeof value === 'object' ? JSON.stringify(value) : String(value)}
									</Typography.Text>
								</div>
							</Col>
						))}
					</Row>
				</>
			);
		}
		return null;
	}

	return (
		<>
			<Row gutter={[24, 0]}>
				{fields.map((field) => {
					const value = ketQua[field.name];
					return (
						<Col span={12} key={field.name} sm={24} md={12}>
							<div style={{ marginBottom: 16 }}>
								<Typography.Text type='secondary' style={{ display: 'block', marginBottom: 4 }}>
									{field.label}
								</Typography.Text>
								<Typography.Text strong>
									{typeof value === 'object' ? JSON.stringify(value) : String(value)}
								</Typography.Text>
							</div>
						</Col>
					);
				})}
			</Row>
		</>
	);
};

export default ResultFormDetail;

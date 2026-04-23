import FormRender from '@/pages/DanhMuc/BieuMauKhaiBao/components/FormRender';
import { BieuMau } from '@/services/DanhMuc/BieuMau/typing';
import { ELoaiDanhMucChung } from '@/services/Workflow/DanhMucChung/constant';
import { useIntl, useModel } from '@umijs/max';
import { Card, Row } from 'antd';
import { useEffect } from 'react';

interface IProps {
	externalFormId: string;
}

const PreviewExternalForm = ({ externalFormId }: IProps) => {
	const intl = useIntl();
	const { getByIdModel, record } = useModel('danhmuc.bieumau');
	const { getAllModel: getAllDanhMucChung } = useModel('workflow.danhmuc.index');

	useEffect(() => {
		getAllDanhMucChung(false, undefined, { maModule: ELoaiDanhMucChung.QUY_TRINH });
	}, []);

	useEffect(() => {
		if (externalFormId) {
			getByIdModel(externalFormId, true);
		}
	}, [externalFormId]);

	return (
		<Card title={record?.ten ?? intl.formatMessage({ id: 'nodes.xemtruocbieumau' })}>
			<Row gutter={[12, 0]}>
				{record?.cauHinhLoaiHinh?.map((item: BieuMau.TruongThongTin | BieuMau.Cot) => (
					<FormRender isView={true} key={item.ma} cauHinh={item} />
				))}
			</Row>
		</Card>
	);
};

export default PreviewExternalForm;

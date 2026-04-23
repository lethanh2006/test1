import FormRender from '@/pages/DanhMuc/BieuMauKhaiBao/components/FormRender';
import { BieuMau } from '@/services/DanhMuc/BieuMau/typing';
import { ELoaiDanhMucChung } from '@/services/Workflow/DanhMucChung/constant';
import { buildUpLoadMultiFile } from '@/services/uploadFile';
import { resetFieldsForm } from '@/utils/utils';
import { useIntl, useModel } from '@umijs/max';
import { Card, Form, Row } from 'antd';
import { useEffect } from 'react';

interface IProps {
	isView?: boolean;
	getData: any;
	mode: 'quytrinh' | 'loaihinh';
}

const FormGiaoNopSanPham = ({ isView, getData, mode }: IProps) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { recordLoaiHinh } = useModel('danhmuc.bieumau');
	const { visibleForm, edit } = useModel('danhmuc.bieumau');
	const { getAllModel: getAllDanhMucChung } = useModel('workflow.danhmuc.index');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
	}, [visibleForm]);

	useEffect(() => {
		getAllDanhMucChung(false, undefined, { maModule: ELoaiDanhMucChung.QUY_TRINH });
	}, []);

	const handleFinish = async (values: any) => {
		const updatedValues = { ...values };
		for (const item in updatedValues) {
			const value = updatedValues[item];
			if (value?.fileList?.length) {
				updatedValues[item] = await buildUpLoadMultiFile(updatedValues, item);
			}
		}
		return updatedValues;
	};

	return (
		<Card
			title={
				isView
					? recordLoaiHinh?.ten || intl.formatMessage({ id: 'bieumaukhaibao.xemtruocbieumau' })
					: mode === 'loaihinh'
						? `${!edit ? intl.formatMessage({ id: 'bieumaukhaibao.them' }) : intl.formatMessage({ id: 'bieumaukhaibao.chinhsua' })} ${recordLoaiHinh?.ten ?? ''}`
						: recordLoaiHinh?.ten
			}
		>
			<Form
				labelCol={{ span: 24 }}
				form={form}
				onFinish={async (values) => {
					if (!recordLoaiHinh) return;
					const finalValues = await handleFinish(values);
					if (getData) getData(finalValues);
				}}
			>
				<Row gutter={[12, 0]}>
					{recordLoaiHinh?.cauHinhLoaiHinh?.map((item: BieuMau.TruongThongTin | BieuMau.Cot) => (
						<FormRender isView={isView} form={form} key={item.ma} cauHinh={item} />
					))}
				</Row>
			</Form>
		</Card>
	);
};

export default FormGiaoNopSanPham;

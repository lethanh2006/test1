import { EKieuDuLieu, ELoaiPhepToan } from '@/services/DanhMuc/BieuMau/constant';
import { BieuMau } from '@/services/DanhMuc/BieuMau/typing';
import rules from '@/utils/rules';
import { useIntl, useModel } from '@umijs/max';
import { Form, Input, InputNumber, Radio, Select } from 'antd';

interface IProps {
	truongThongTinLienQuan: BieuMau.TruongThongTin | BieuMau.Cot;
	fieldName?: string;
	loaiPhepToan?: ELoaiPhepToan;
}

const FormGiaTriLienQuan = ({ truongThongTinLienQuan, fieldName, loaiPhepToan }: IProps) => {
	let component = null;
	const intl = useIntl();
	const { danhSach } = useModel('workflow.danhmuc.index');
	const rule = [...rules.required];

	switch (truongThongTinLienQuan.kieuDuLieu) {
		case EKieuDuLieu.NUMBER:
			component = (
				<InputNumber style={{ width: '100%' }} placeholder={intl.formatMessage({ id: 'bieumaukhaibao.nhapgiatri' })} />
			);
			break;
		case EKieuDuLieu.DECIMAL:
			component = (
				<InputNumber style={{ width: '100%' }} placeholder={intl.formatMessage({ id: 'bieumaukhaibao.nhapgiatri' })} />
			);
			break;
		case EKieuDuLieu.BOOLEAN:
			component = (
				<Radio.Group
					options={[
						{ value: true, label: intl.formatMessage({ id: 'bieumaukhaibao.co' }) },
						{ value: false, label: intl.formatMessage({ id: 'bieumaukhaibao.khong' }) },
					]}
				/>
			);
			break;
		case EKieuDuLieu.DANHMUC:
			component = (
				<Select
					placeholder={intl.formatMessage({ id: 'bieumaukhaibao.chongiatri' })}
					mode={
						!loaiPhepToan || [ELoaiPhepToan.NAM_TRONG, ELoaiPhepToan.KHONG_NAM_TRONG].includes(loaiPhepToan)
							? 'multiple'
							: undefined
					}
					options={danhSach
						?.find((item) => item.maDanhMuc === truongThongTinLienQuan.maDanhMuc)
						?.danhSachGiaTri?.map((item: { value: string }) => ({ value: item.value, label: item.value }))}
				/>
			);
			break;

		case EKieuDuLieu.TEXT:
			component = <Input placeholder={intl.formatMessage({ id: 'bieumaukhaibao.nhapgiatri' })} />;
			break;
		default:
			break;
	}

	return (
		<>
			{component ? (
				<Form.Item
					name={fieldName ?? 'giaTriLienQuan'}
					label={intl.formatMessage({ id: 'bieumaukhaibao.giatrilienquan' })}
					rules={rule}
				>
					{component}
				</Form.Item>
			) : null}
		</>
	);
};

export default FormGiaTriLienQuan;

import { formatFullName } from '@/services/LichTuan/utils';
import { DownOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import { Empty, Select, Spin } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const SelectAllNhanSu = (props: {
	value?: string;
	onChange?: (val: string) => void;
	multiple?: boolean;
	disabled?: boolean;
	style?: React.CSSProperties;
	allowClear?: boolean;
	placeholder?: string;
	maDonViChinh?: string;
	onClear?: any;
	hienThiHocHamHocVi?: boolean;
}) => {
	const {
		value,
		onChange,
		multiple,
		disabled,
		style,
		allowClear,
		placeholder,
		maDonViChinh,
		onClear,
		hienThiHocHamHocVi = false,
	} = props;
	const intl = useIntl();
	const { danhSachAllNhanSu, setDanhSachAllNhanSu, getAllModel, loading } = useModel('tochucnhansu.thongtinnhansu');

	useEffect(() => {
		if (!danhSachAllNhanSu?.length) {
			getAllModel(
				undefined,
				undefined,
				{
					trangThaiChinhSua: 'Duyệt - đang áp dụng',
					trangThai: 'Đang làm việc',
				},
				undefined,
				'sap-xep-nhan-su',
				false,
			).then((res) => setDanhSachAllNhanSu(res));
		}
	}, []);

	return (
		<Select
			loading={loading}
			mode={multiple ? 'multiple' : undefined}
			value={value}
			allowClear={allowClear}
			onChange={onChange}
			onClear={onClear}
			disabled={disabled}
			notFoundContent={
				loading ? (
					<Spin
						spinning={true}
						tip={intl.formatMessage({ id: 'bieumaukhaibao.dangtimkiem' })}
						style={{ width: '100%', margin: 10 }}
					/>
				) : (
					<Empty
						image={Empty.PRESENTED_IMAGE_SIMPLE}
						description={intl.formatMessage({ id: 'bieumaukhaibao.khongcodulieu' })}
					/>
				)
			}
			options={danhSachAllNhanSu
				?.filter((item) => {
					if (maDonViChinh && item?.donViChinh?.maDonVi !== maDonViChinh) return false;
					return true;
				})
				.map((item) => ({
					key: item._id,
					value: item.ssoId,
					label:
						formatFullName(
							item?.hocHam ?? '',
							item?.trinhDoDaoTao ?? '',
							`${item?.hoDem} ${item?.ten}`,
							hienThiHocHamHocVi,
						) +
						' - ' +
						[item.maCanBo, item.donViChinh?.ten ?? item.maDonViChinh].filter(Boolean).join(' - '),
				}))}
			showSearch
			suffixIcon={<DownOutlined />}
			optionFilterProp='label'
			placeholder={placeholder || intl.formatMessage({ id: 'bieumaukhaibao.chonnhansu' })}
			style={{ width: '100%', ...style }}
		/>
	);
};

export default SelectAllNhanSu;

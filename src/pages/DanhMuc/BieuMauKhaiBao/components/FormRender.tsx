import MyDatePicker from '@/components/MyDatePicker';
import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import TableStaticData from '@/components/Table/TableStaticData';
import { IColumn } from '@/components/Table/typing';
import TinyEditor from '@/components/TinyEditor';
import UploadFile from '@/components/Upload/UploadFile';
import FormTable from '@/pages/DanhMuc/BieuMauKhaiBao/components/FormTable';
import SelectAllNhanSu from '@/pages/DanhMuc/BieuMauKhaiBao/components/select/SelectAllNhanSu';
import SelectSinhVienDebounce from '@/pages/DanhMuc/BieuMauKhaiBao/components/select/SelectSinhVienDebounce';
import ViewRender from '@/pages/DanhMuc/BieuMauKhaiBao/components/ViewRender';
import {
	EKieuDuLieu,
	ELoaiThoiGianThucHien,
	ELoaiTruongThongTinTinh,
	ETextDisplay,
	LoaiDefaultValue,
} from '@/services/DanhMuc/BieuMau/constant';
import { BieuMau } from '@/services/DanhMuc/BieuMau/typing';
import { kiemTraPhanVung } from '@/utils/constants';
import rules from '@/utils/rules';
import { validateBieuThucTuyChinh } from '@/utils/validateDynamicForm';
import { DeleteOutlined, EditOutlined, PaperClipOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useIntl, useModel } from '@umijs/max';
import { Button, Col, Form, FormInstance, Input, InputNumber, Modal, Popconfirm, Radio, Select } from 'antd';
import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';

interface IProps {
	cauHinh: BieuMau.TruongThongTin | BieuMau.Cot;
	form?: FormInstance;
	danhSachCauHinh?: BieuMau.Cot[];
	isView?: boolean;
}

const FormRender = ({ cauHinh, form, isView }: IProps) => {
	const intl = useIntl();
	const { danhSach } = useModel('workflow.danhmuc.index');
	const { recordLoaiHinh, recordQuyTrinhForm, setRecordQuyTrinhForm } = useModel('danhmuc.bieumau');
	const { danhSachAllNhanSu, getModel: getCanBo } = useModel('tochucnhansu.thongtinnhansu');
	const { danhSach: danhSachSinhVien, getModel: getSinhVien } = useModel('tochucnhansu.sinhvien');

	const [visibleFormTable, setVisibleFormTable] = useState<boolean>(false);
	const [editFormTable, setEditFormTable] = useState<boolean>(false);
	const [recordTable, setRecordTable] = useState<any>({});

	const formValuesFinal = form?.getFieldsValue();

	let component = <div />;
	let rule: any[] = [...rules.required];

	const onCancelFormTable = () => {
		setVisibleFormTable(false);
	};

	const cauHinhLoaiHinhRaw = recordLoaiHinh?.cauHinhLoaiHinh;
	const cauHinhLoaiHinh = cauHinhLoaiHinhRaw?.reduce((acc: any[], item) => {
		const danhSachCot = item?.danhSachCot ?? [];
		return acc.concat([item, ...danhSachCot]);
	}, []);

	const listCauHinhPhuThuocDuLieu = cauHinhLoaiHinh?.filter((item) => item.layDuLieuTu === cauHinh.ma);

	const onChangeNhanSu: any = async (val: string, type: 'SV' | 'CB') => {
		if (!val) return;

		let recNhanSu: any =
			type === 'CB'
				? danhSachAllNhanSu.find((item) => item.ssoId === val)
				: danhSachSinhVien.find((item) => item.ssoId === val);

		if (!recNhanSu) {
			const getData: any = type === 'CB' ? getCanBo : getSinhVien;
			const danhSachTemp: any[] = await getData(
				undefined,
				[
					{
						active: true,
						field: 'ssoId',
						values: Array.isArray(val) ? val : [val],
						operator: EOperatorType.INCLUDE,
					},
				],
				undefined,
				1,
				20,
			);
			recNhanSu = danhSachTemp.find((item) => item.ssoId === val);
		}

		if (form && listCauHinhPhuThuocDuLieu?.length) {
			const objDuLieuPhuThuoc: any = {};
			listCauHinhPhuThuocDuLieu.map((item) => {
				if (item.truongLayDuLieu.includes('||')) {
					let value: any;
					const arrKey = item.truongLayDuLieu.split('||');
					arrKey.map((ele: any) => {
						const valueTemp = _.get(recNhanSu, ele, undefined);
						if (!value && valueTemp) {
							value = valueTemp;
						}
					});
					objDuLieuPhuThuoc[item.ma] = value;
				} else if (item.truongLayDuLieu.includes('&&')) {
					let value = '';
					const arrKey = item.truongLayDuLieu.split('&&');
					arrKey.map((ele: any) => {
						const valueTemp = _.get(recNhanSu, ele, undefined);
						value += ` ${valueTemp}`;
					});
					objDuLieuPhuThuoc[item.ma] = value;
				} else {
					objDuLieuPhuThuoc[item.ma] = item.truongLayDuLieu
						? _.get(recNhanSu, item.truongLayDuLieu, undefined)
						: recNhanSu;
				}
			});
			form.setFieldsValue(objDuLieuPhuThuoc);
		}
	};

	useEffect(() => {
		if (cauHinh && cauHinh?.loaiDefaultValue) {
			if (!form) return;
			if (cauHinh?.loaiDefaultValue === LoaiDefaultValue.CUSTOM) {
				form.setFieldsValue({
					...form.getFieldsValue(),
					[cauHinh.kieuDuLieu !== EKieuDuLieu.TABLE ? cauHinh.ma : `table||${cauHinh.ma}`]: cauHinh?.customDefaultValue,
				});
			}
		}
	}, [cauHinh.ma]);

	useEffect(() => {
		if (cauHinh.kieuDuLieu === EKieuDuLieu.TABLE) {
			if (form) {
				form.validateFields([`table||${cauHinh.ma}`]).catch(() => {});
			}
		}
	}, [recordQuyTrinhForm?.thongTinKhaiBao?.[cauHinh.ma]]);

	switch (cauHinh.kieuDuLieu) {
		case EKieuDuLieu.TEXT:
			if (cauHinh.textDisplay === ETextDisplay.TEXT_AREA) {
				component = <Input.TextArea disabled={cauHinh?.readonly} placeholder={cauHinh.ten} />;
			} else if (cauHinh.textDisplay === ETextDisplay.TEXT_EDITOR) {
				component = <TinyEditor height={300} disabled={cauHinh?.readonly} />;
			} else
				component = cauHinh.laDangMang ? (
					<Select disabled={cauHinh?.readonly} placeholder={cauHinh.ten} mode='tags' />
				) : (
					<Input disabled={cauHinh?.readonly} placeholder={cauHinh.ten} />
				);
			rule = [...(cauHinh.laDangMang ? [] : rules.text), ...(cauHinh.batBuoc ? rules.required : [])];
			break;

		case EKieuDuLieu.CAN_BO:
			rule = [...(cauHinh.batBuoc ? rules.required : [])];
			component = <SelectAllNhanSu onChange={(val) => onChangeNhanSu(val, 'CB')} />;
			break;
		case EKieuDuLieu.SINH_VIEN:
			rule = [...(cauHinh.batBuoc ? rules.required : [])];
			component = <SelectSinhVienDebounce onChange={(val) => onChangeNhanSu(val, 'SV')} />;
			break;

		case EKieuDuLieu.BOOLEAN:
			component = (
				<Radio.Group
					disabled={cauHinh?.readonly}
					options={[
						{ value: true, label: intl.formatMessage({ id: 'bieumaukhaibao.co' }) },
						{ value: false, label: intl.formatMessage({ id: 'bieumaukhaibao.khong' }) },
					]}
				/>
			);
			rule = [...(cauHinh.batBuoc ? rules.required : [])];
			break;

		case EKieuDuLieu.DANHMUC:
			component = (
				<Select
					mode={cauHinh.laDangMang ? 'multiple' : undefined}
					allowClear
					placeholder={intl.formatMessage({ id: 'bieumaukhaibao.chongiatri' })}
					options={danhSach
						.find((item) => item.maDanhMuc === cauHinh.maDanhMuc)
						?.danhSachGiaTri.map((item: { value: string }) => ({ value: item.value, label: item.value }))}
				/>
			);
			rule = [...(cauHinh.batBuoc ? rules.required : [])];
			break;
		case EKieuDuLieu.NUMBER:
			component = cauHinh.laDangMang ? (
				<Select disabled={cauHinh?.readonly} mode='tags' placeholder={cauHinh.ten} />
			) : (
				<InputNumber
					disabled={cauHinh?.readonly}
					formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
					style={{ width: '100%' }}
					placeholder={intl.formatMessage({ id: 'bieumaukhaibao.nhapgiatri' })}
				/>
			);
			rule = [
				...(cauHinh.laDangMang ? rules.arrNumber(1000000000, 0) : []),
				...(cauHinh.batBuoc ? rules.required : []),
			];
			break;
		case EKieuDuLieu.DECIMAL:
			component = cauHinh.laDangMang ? (
				<Select disabled={cauHinh?.readonly} mode='tags' placeholder={cauHinh.ten} />
			) : (
				<InputNumber
					disabled={cauHinh?.readonly}
					style={{ width: '100%' }}
					placeholder={intl.formatMessage({ id: 'bieumaukhaibao.nhapgiatri' })}
				/>
			);
			rule = [
				...(cauHinh.laDangMang ? rules.arrNumber(1000000000, 0) : []),
				...(cauHinh.batBuoc ? rules.required : []),
			];
			break;

		case EKieuDuLieu.HOUR:
			component = (
				<MyDatePicker
					disabled={cauHinh?.readonly}
					style={{ width: '100%' }}
					allowClear
					format={'DD/MM/YYYY HH:mm'}
					showTime
				/>
			);
			rule = [...(cauHinh.batBuoc ? rules.required : [])];
			break;
		case EKieuDuLieu.DATE:
			component = (
				<MyDatePicker
					placeholder={cauHinh.ten}
					disabled={cauHinh?.readonly}
					style={{ width: '100%' }}
					allowClear
					format={'DD/MM/YYYY'}
				/>
			);
			rule = [...(cauHinh.batBuoc ? rules.required : [])];
			break;
		case EKieuDuLieu.MONTH:
			component = (
				<MyDatePicker
					placeholder={cauHinh.ten}
					disabled={cauHinh?.readonly}
					style={{ width: '100%' }}
					allowClear
					format={'MM/YYYY'}
					picker='month'
					pickerStyle={'month'}
				/>
			);
			rule = [...(cauHinh.batBuoc ? rules.required : [])];
			break;

		case EKieuDuLieu.FILE:
			rule = [...(cauHinh.batBuoc ? rules.fileRequired : [])];
			component = (
				<>
					{(cauHinh as any)?.danhSachFileDinhKem?.length > 0 && (
						<div style={{ marginBottom: 8 }}>
							<div style={{ marginBottom: 4, fontWeight: 500 }}>File đính kèm:</div>
							<div className='ant-upload-list ant-upload-list-text'>
								{(cauHinh as any).danhSachFileDinhKem.map((url: string, index: number) => {
									const fileName = decodeURIComponent(url?.substring(url.lastIndexOf('/') + 1)) || `File ${index + 1}`;
									return (
										<div key={index} className='ant-upload-list-item-container'>
											<div className='ant-upload-list-item ant-upload-list-item-done' style={{ paddingLeft: 0 }}>
												<div className='ant-upload-icon' style={{ marginTop: 2 }}>
													<PaperClipOutlined />{' '}
													<a
														target='_blank'
														rel='noopener noreferrer'
														className='ant-upload-list-item-name'
														title={fileName}
														href={url}
													>
														{fileName}
													</a>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					)}
					<UploadFile
						maxCount={cauHinh.laDangMang ? 5 : 1}
						accept={'image/*, .xls, .xlsx, .doc, .docx, .pdf'}
						otherProps={{
							showUploadList: { showDownloadIcon: false },
						}}
					/>
				</>
			);
			break;

		case EKieuDuLieu.TABLE:
			const columns: IColumn<any>[] = [];
			cauHinh?.danhSachCot
				?.filter((item) =>
					cauHinh?.danhSachCotHienThi?.length ? cauHinh?.danhSachCotHienThi?.includes(item.ma) : item,
				)
				?.map((item) => {
					columns.push({
						title: item.ten,
						dataIndex: item.ma,
						align: 'center',
						width: 120,
						render: (val, rec) => {
							return <ViewRender cauHinh={item} recordSanPham={rec} isCot />;
						},
						// ...buildFilter(item, danhSach),
					});
				});
			if (!isView) {
				columns.push({
					title: intl.formatMessage({ id: 'bieumaukhaibao.thaotac' }),
					align: 'center',
					width: 100,
					fixed: 'right',
					render: (rec: any) => {
						const isPhanVung = kiemTraPhanVung(rec?.dataPartitionCode ?? null);

						return (
							<>
								<ButtonExtend
									tooltip={intl.formatMessage({ id: 'bieumaukhaibao.chinhsua' })}
									disabled={cauHinh?.readonly || !isPhanVung}
									size='small'
									onClick={() => {
										setVisibleFormTable(true);
										setRecordTable(rec);
										setEditFormTable(true);
									}}
									type='link'
									icon={<EditOutlined />}
								/>

								<Popconfirm
									disabled={cauHinh?.readonly || !isPhanVung}
									onConfirm={() => {
										if (recordQuyTrinhForm) {
											setRecordQuyTrinhForm({
												...recordQuyTrinhForm,
												thongTinKhaiBao: {
													...recordQuyTrinhForm.thongTinKhaiBao,
													[cauHinh.ma]: recordQuyTrinhForm.thongTinKhaiBao?.[cauHinh.ma]
														?.map((item: any, index: number) => ({ ...item, index: index + 1 }))
														?.filter((item: any) => item.index !== rec.index),
												},
											});
										}
									}}
									title={intl.formatMessage({ id: 'bieumaukhaibao.banchacchanmuonxoa' })}
									placement='topRight'
								>
									<ButtonExtend
										tooltip={intl.formatMessage({ id: 'bieumaukhaibao.xoa' })}
										disabled={cauHinh?.readonly || !isPhanVung}
										size='small'
										danger
										type='link'
										icon={<DeleteOutlined />}
									/>
								</Popconfirm>
							</>
						);
					},
				});
			}

			rule = cauHinh?.batBuoc
				? [
						{
							validator: (__: { field: string | number }, value: any, callback: any) => {
								if (!recordQuyTrinhForm?.thongTinKhaiBao?.[cauHinh.ma]?.length) callback('');
								callback();
							},
							message: intl.formatMessage({ id: 'bieumaukhaibao.batbuoc' }),
							required: true,
						},
					]
				: [];

			if (cauHinh?.thamDinh?.length) {
				rule.push({
					validator: async (__: any, _: any) => {
						const tableData = recordQuyTrinhForm?.thongTinKhaiBao?.[cauHinh.ma] || [];
						const error = validateBieuThucTuyChinh(form?.getFieldsValue() || {}, tableData, cauHinh.thamDinh || []);
						if (error) return Promise.reject(new Error(error));
						return Promise.resolve();
					},
				});
			}

			component = (
				<>
					<TableStaticData
						otherButtons={[
							<Button
								disabled={cauHinh?.readonly}
								size='small'
								type='primary'
								icon={<PlusCircleOutlined />}
								onClick={() => {
									setRecordTable(undefined);
									setVisibleFormTable(true);
									setEditFormTable(false);
								}}
							>
								{intl.formatMessage({ id: 'bieumaukhaibao.them' })}
							</Button>,
						]}
						otherProps={{ pagination: false }}
						addStt
						size='small'
						data={recordQuyTrinhForm?.thongTinKhaiBao?.[cauHinh.ma]?.map((item: any, index: number) => ({
							...item,
							index: index + 1,
						}))}
						columns={columns}
					/>
					<Modal
						destroyOnHidden
						width={700}
						footer={null}
						title={`${editFormTable ? intl.formatMessage({ id: 'bieumaukhaibao.chinhsua' }) : intl.formatMessage({ id: 'bieumaukhaibao.them' })} ${cauHinh.ten}`}
						open={visibleFormTable}
						onCancel={onCancelFormTable}
					>
						<FormTable record={recordTable} onCancel={onCancelFormTable} edit={editFormTable} cauHinh={cauHinh} />
					</Modal>
				</>
			);
			break;

		default:
			break;
	}

	if (cauHinh.kieuDuLieu !== EKieuDuLieu.TABLE && cauHinh?.thamDinh?.length) {
		rule.push({
			validator: async (__: any, value: any) => {
				const error = validateBieuThucTuyChinh(form?.getFieldsValue() || {}, value, cauHinh.thamDinh || []);
				if (error) return Promise.reject(new Error(error));
				return Promise.resolve();
			},
		});
	}

	const checkTruongThongTinLienQuan = useMemo(() => {
		let check = false;
		if (!cauHinh?.truongThongTinLienQuan) return true;
		if (formValuesFinal?.[cauHinh?.truongThongTinLienQuan] === cauHinh?.giaTriLienQuan) return true;
		if (cauHinh?.giaTriLienQuan?.includes) {
			if (cauHinh?.giaTriLienQuan?.includes(formValuesFinal?.[cauHinh?.truongThongTinLienQuan])) return true;
			if (formValuesFinal?.[cauHinh?.truongThongTinLienQuan]?.map)
				formValuesFinal?.[cauHinh?.truongThongTinLienQuan]?.map((item: any) => {
					if (cauHinh?.giaTriLienQuan?.includes(item)) {
						check = true;
					}
				});
		}
		return check;
	}, [cauHinh?.truongThongTinLienQuan, cauHinh?.giaTriLienQuan, formValuesFinal?.[cauHinh?.truongThongTinLienQuan]]);

	const truongThongTinTinh = recordLoaiHinh?.danhSachCauHinhTruongThongTinTinh?.find(
		(item: { maTruongThongTinDungSau: string }) => item.maTruongThongTinDungSau === cauHinh.ma,
	);

	return checkTruongThongTinLienQuan ? (
		<>
			<Col xs={24} sm={24} md={cauHinh.kieuDuLieu === EKieuDuLieu.TABLE ? 24 : cauHinh?.colspan}>
				{cauHinh.kieuDuLieu === EKieuDuLieu.DOAN_VAN_BAN ? (
					<>
						{cauHinh.customDefaultValue ? (
							<div dangerouslySetInnerHTML={{ __html: cauHinh.customDefaultValue }} />
						) : (
							<div>{cauHinh.ten}</div>
						)}
					</>
				) : (
					<Form.Item
						labelCol={{ xs: 24 }}
						labelAlign='left'
						extra={cauHinh?.ghiChu ? <div>{cauHinh.ghiChu}</div> : null}
						name={cauHinh.kieuDuLieu !== EKieuDuLieu.TABLE ? cauHinh.ma : `table||${cauHinh.ma}`}
						label={cauHinh.ten}
						rules={cauHinh?.readonly ? [] : rule}
						style={{
							marginBottom: 8,
						}}
					>
						{component}
					</Form.Item>
				)}
			</Col>
			{truongThongTinTinh && truongThongTinTinh.loaiTruongThongTinTinh === ELoaiTruongThongTinTinh.VAI_TRO && (
				<Col xs={24} sm={24} md={truongThongTinTinh?.colspan ? +truongThongTinTinh.colspan : undefined}>
					<Form.Item
						name='vaiTro'
						label={truongThongTinTinh?.label ?? intl.formatMessage({ id: 'bieumaukhaibao.vaitro' })}
						rules={[...rules.required]}
					>
						<Select
							options={recordLoaiHinh?.danhSachVaiTroThanhVienKhaDung?.map((item: any) => ({
								label: item,
								value: item,
							}))}
							mode='multiple'
							placeholder={intl.formatMessage({ id: 'bieumaukhaibao.vaitro' })}
						/>
					</Form.Item>
				</Col>
			)}
			{truongThongTinTinh &&
				[ELoaiTruongThongTinTinh.THOI_GIAN_BAT_DAU, ELoaiTruongThongTinTinh.THOI_GIAN_KET_THUC].includes(
					truongThongTinTinh.loaiTruongThongTinTinh,
				) && (
					<Col xs={24} sm={24} md={truongThongTinTinh?.colspan ? +truongThongTinTinh.colspan : undefined}>
						<Form.Item
							name='thoiGian'
							label={`${recordLoaiHinh?.startLabel} - ${recordLoaiHinh?.endLabel}`}
							rules={[...rules.required]}
						>
							<MyDateRangePicker
								format={
									recordLoaiHinh?.loaiThoiGianThucHien === ELoaiThoiGianThucHien.NAM
										? 'YYYY'
										: recordLoaiHinh?.loaiThoiGianThucHien === ELoaiThoiGianThucHien.THANGNAM
											? 'MM/YYYY'
											: 'DD/MM/YYYY'
								}
								placeholder={[
									intl.formatMessage({ id: 'bieumaukhaibao.tu' }),
									intl.formatMessage({ id: 'bieumaukhaibao.den' }),
								]}
								picker={
									recordLoaiHinh?.loaiThoiGianThucHien === ELoaiThoiGianThucHien.NAM
										? 'year'
										: recordLoaiHinh?.loaiThoiGianThucHien === ELoaiThoiGianThucHien.THANGNAM
											? 'month'
											: 'date'
								}
							/>
						</Form.Item>
					</Col>
				)}
			{truongThongTinTinh &&
				[ELoaiTruongThongTinTinh.MOC_THOI_GIAN].includes(truongThongTinTinh.loaiTruongThongTinTinh) && (
					<Col xs={24} sm={24} md={truongThongTinTinh?.colspan ? +truongThongTinTinh.colspan : undefined}>
						<Form.Item
							name={['thongTinThoiGian', 'timeline']}
							label={recordLoaiHinh?.timelineLabel}
							rules={[...rules.required]}
						>
							<MyDatePicker
								format={
									recordLoaiHinh?.loaiThoiGianThucHien === ELoaiThoiGianThucHien.THOIGIANCUTHE_YYYY
										? 'YYYY'
										: recordLoaiHinh?.loaiThoiGianThucHien === ELoaiThoiGianThucHien.THOIGIANCUTHE_MMYYYY
											? 'MM/YYYY'
											: 'DD/MM/YYYY'
								}
								pickerStyle={
									recordLoaiHinh?.loaiThoiGianThucHien === ELoaiThoiGianThucHien.THOIGIANCUTHE_YYYY
										? 'year'
										: recordLoaiHinh?.loaiThoiGianThucHien === ELoaiThoiGianThucHien.THOIGIANCUTHE_MMYYYY
											? 'month'
											: 'date'
								}
								placeholder={intl.formatMessage({ id: 'bieumaukhaibao.chonthoigian' })}
							/>
						</Form.Item>
					</Col>
				)}
			{truongThongTinTinh &&
				truongThongTinTinh.loaiTruongThongTinTinh === ELoaiTruongThongTinTinh.DANH_SACH_THANH_VIEN && (
					<>
						<Col xs={24} sm={24} md={24}>
							<Form.Item
								name='soLuongThanhVien'
								label={intl.formatMessage({ id: 'bieumaukhaibao.soluongthanhvien' })}
								rules={[...rules.required]}
							>
								<InputNumber
									style={{ width: '100%' }}
									min={1}
									max={100}
									placeholder={intl.formatMessage({ id: 'bieumaukhaibao.soluongthanhvien' })}
								/>
							</Form.Item>
						</Col>

						<Col span={24}>
							<div className='ant-descriptions-title' style={{ marginBottom: 12 }}>
								{truongThongTinTinh?.label ?? intl.formatMessage({ id: 'bieumaukhaibao.danhsachthanhvien' })}
							</div>
						</Col>
					</>
				)}
		</>
	) : null;
};

export default FormRender;

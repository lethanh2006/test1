import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { IColumn } from '@/components/Table/typing';
import TinyEditor from '@/components/TinyEditor';
import UploadFile from '@/components/Upload/UploadFile';
import FormCot from '@/pages/DanhMuc/BieuMauKhaiBao/components/FormCot';
import FormGiaTriLienQuan from '@/pages/DanhMuc/BieuMauKhaiBao/components/FormGiaTriLienQuan';
import FormThamDinh from '@/pages/DanhMuc/BieuMauKhaiBao/components/FormThamDinh';
import {
	EKieuDuLieu,
	ETextDisplay,
	LoaiDefaultValue,
	MapKeyNameTextDisplay,
} from '@/services/DanhMuc/BieuMau/constant';
import { BieuMau } from '@/services/DanhMuc/BieuMau/typing';
import { buildUpLoadMultiFile } from '@/services/uploadFile';
import { ELoaiDanhMucChung } from '@/services/Workflow/DanhMucChung/constant';
import { kiemTraPhanVung } from '@/utils/constants';
import rules from '@/utils/rules';
import { removeVietnameseTones } from '@/utils/utils';
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useIntl, useModel } from '@umijs/max';
import {
	Button,
	Card,
	Checkbox,
	Col,
	Form,
	Input,
	InputNumber,
	message,
	Modal,
	Popconfirm,
	Popover,
	Radio,
	Row,
	Select,
	Space,
} from 'antd';
import _ from 'lodash';
import { lazy, Suspense, useEffect, useState } from 'react';

const JsonEditor = lazy(() => import('@/components/JsonEditor'));

interface IProps {
	onCancel: () => void;
}

const FormCauHinh = ({ onCancel }: IProps) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const {
		recordCot,
		setRecord,
		setRecordCauHinh,
		formSubmiting,
		loading,
		editCauHinh,
		recordCauHinh,
		setEditCot,
		setRecordCot,
		record,
		danhSach: danhSachFormKhaiBao,
	} = useModel('danhmuc.bieumau');

	const {
		getAllModel: getAllDanhMucChung,
		loading: loadingDanhMucChung,
		danhSach,
	} = useModel('workflow.danhmuc.index');

	const [kieuDuLieu, setKieuDuLieu] = useState<EKieuDuLieu>(recordCauHinh?.kieuDuLieu ?? EKieuDuLieu.BOOLEAN);
	const [truongThongTinLienQuan, setTruongThongTinLienQuan] = useState<BieuMau.TruongThongTin | undefined>(
		record?.cauHinhLoaiHinh?.find((item: { ma: any }) => item.ma === recordCauHinh?.truongThongTinLienQuan),
	);

	const [visibleCot, setVisibleCot] = useState<boolean>(false);
	const loaiMacDinh = Form.useWatch('loaiDefaultValue', form);
	const maFormLayDefaultValue = Form.useWatch('maFormLayDefaultValue', form);

	useEffect(() => {
		form.setFieldsValue(
			recordCauHinh?.ma && editCauHinh ? recordCauHinh : { ...form, batBuoc: true, laDangMang: false },
		);
	}, [recordCauHinh?.ma]);

	const onFinish = async (values: BieuMau.TruongThongTin, isContinue: boolean) => {
		if (!record) return;

		const listMaCauHinh = editCauHinh
			? record.cauHinhLoaiHinh.filter((item: { ma: any }) => item.ma !== recordCauHinh?.ma)
			: record.cauHinhLoaiHinh;

		if (listMaCauHinh?.map((item: { ma: any }) => item.ma)?.includes(values?.ma)) {
			message.error(intl.formatMessage({ id: 'bieumaukhaibao.madatontai' }));
			return;
		}

		const danhSachFileDinhKem = (await buildUpLoadMultiFile(values, 'danhSachFileDinhKem')) || [];

		if (editCauHinh && recordCauHinh) {
			const index = record.cauHinhLoaiHinh.map((item: { ma: any }) => item.ma).indexOf(recordCauHinh.ma);
			const cauHinhLoaiHinh = [...record.cauHinhLoaiHinh];
			cauHinhLoaiHinh.splice(index, 1, { ...recordCauHinh, ...values, danhSachFileDinhKem });
			setRecord({ ...record, cauHinhLoaiHinh });
		} else {
			setRecord({
				...record,
				cauHinhLoaiHinh: [...(record?.cauHinhLoaiHinh ?? []), { ...recordCauHinh, ...values, danhSachFileDinhKem }],
			});
		}
		message.success(
			editCauHinh
				? intl.formatMessage({ id: 'bieumaukhaibao.suathanhcong' })
				: intl.formatMessage({ id: 'bieumaukhaibao.themmoithanhcong' }),
		);
		if (isContinue) {
			form.resetFields();
		} else onCancel();
	};

	const onCancelFormCot = () => {
		setVisibleCot(false);
	};

	const columns: IColumn<BieuMau.Cot>[] = [
		{
			title: intl.formatMessage({ id: 'bieumaukhaibao.macot' }),
			dataIndex: 'ma',
			align: 'center',
			width: 100,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'bieumaukhaibao.tencot' }),
			dataIndex: 'ten',
			width: 170,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'bieumaukhaibao.kieudulieu' }),
			align: 'center',
			dataIndex: 'kieuDuLieu',
			width: 60,
		},

		{
			title: intl.formatMessage({ id: 'bieumaukhaibao.thaotac' }),
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (rec: BieuMau.Cot) => {
				const isPhanVung = kiemTraPhanVung(rec?.dataPartitionCode ?? null);

				return (
					<>
						<ButtonExtend
							disabled={!isPhanVung}
							tooltip={intl.formatMessage({ id: 'bieumaukhaibao.chinhsua' })}
							onClick={() => {
								setVisibleCot(true);
								setRecordCot(rec);
								setEditCot(true);
							}}
							type='link'
							icon={<EditOutlined />}
						/>

						<Popconfirm
							onConfirm={() => {
								if (recordCauHinh) {
									setRecordCauHinh({
										...recordCauHinh,
										danhSachCot: recordCauHinh?.danhSachCot?.filter((item: { ma: string }) => item.ma !== rec.ma),
									});
									form.setFieldsValue({
										danhSachCotHienThi: form
											.getFieldValue('danhSachCotHienThi')
											?.filter((item: string) => item !== rec.ma),
									});
								}
							}}
							title={intl.formatMessage({ id: 'bieumaukhaibao.banchacchanmuonxoa' })}
							placement='topRight'
						>
							<ButtonExtend
								disabled={!isPhanVung}
								tooltip={intl.formatMessage({ id: 'bieumaukhaibao.xoa' })}
								danger
								type='link'
								icon={<DeleteOutlined />}
							/>
						</Popconfirm>
					</>
				);
			},
		},
	];

	const onSortEnd = (recordTemp: BieuMau.Cot, newIndex: number): void => {
		if (!recordCauHinh) return;
		const danhSachCot = recordCauHinh?.danhSachCot?.filter((item: { ma: string }) => item.ma !== recordTemp.ma) ?? [];
		danhSachCot?.splice(newIndex, 0, recordTemp);
		setRecordCauHinh({ ...recordCauHinh, danhSachCot });
	};

	const isAvailableDangMang = [
		EKieuDuLieu.DANHMUC,
		EKieuDuLieu.DECIMAL,
		EKieuDuLieu.NUMBER,
		EKieuDuLieu.TEXT,
		EKieuDuLieu.FILE,
	].includes(kieuDuLieu);

	return (
		<Card
			title={`${editCauHinh ? intl.formatMessage({ id: 'bieumaukhaibao.chinhsuacauhinh' }) : intl.formatMessage({ id: 'bieumaukhaibao.themmoicauhinh' })} `}
		>
			<Form onFinish={(values) => onFinish(values, false)} form={form} layout='vertical'>
				<Form.Item
					name='ten'
					label={intl.formatMessage({ id: 'bieumaukhaibao.ten' })}
					rules={[...rules.required, ...rules.text]}
				>
					<Input
						autoFocus
						onChange={(e) => {
							if (!editCauHinh) {
								form.setFieldsValue({ ma: _.camelCase(removeVietnameseTones(e?.target?.value ?? '')) });
							}
						}}
						placeholder={intl.formatMessage({ id: 'bieumaukhaibao.ten' })}
					/>
				</Form.Item>
				<Form.Item
					name='ma'
					label={intl.formatMessage({ id: 'bieumaukhaibao.ma' })}
					rules={[...rules.required, ...rules.text]}
				>
					<Input placeholder={intl.formatMessage({ id: 'bieumaukhaibao.ma' })} />
				</Form.Item>

				<Form.Item name='loaiDefaultValue' label={intl.formatMessage({ id: 'bieumaukhaibao.loaigiatrimacdinh' })}>
					<Select
						showSearch
						allowClear
						placeholder={intl.formatMessage({ id: 'bieumaukhaibao.chonloaigiatri' })}
						options={Object?.values(LoaiDefaultValue)?.map((val) => {
							return {
								value: val,
								label: val,
							};
						})}
					/>
				</Form.Item>

				{loaiMacDinh === LoaiDefaultValue.CUSTOM && (
					<Form.Item
						name='customDefaultValue'
						label={intl.formatMessage({ id: 'bieumaukhaibao.giatrimacdinhtuybien' })}
					>
						<Input placeholder={intl.formatMessage({ id: 'bieumaukhaibao.nhapgiatrimacdinh' })} />
					</Form.Item>
				)}
				{kieuDuLieu === EKieuDuLieu.DOAN_VAN_BAN && (
					<Form.Item
						rules={[...rules.requiredHtml]}
						name='customDefaultValue'
						label={intl.formatMessage({ id: 'bieumaukhaibao.doanvanban' })}
					>
						<TinyEditor height={350} />
					</Form.Item>
				)}
				{loaiMacDinh === LoaiDefaultValue.THONG_KE_DON_QUY_TRINH && (
					<Form.Item label={intl.formatMessage({ id: 'bieumaukhaibao.cauhinhthongke' })}>
						<Suspense fallback={<div>Loading...</div>}>
							<JsonEditor />
						</Suspense>
					</Form.Item>
				)}

				{loaiMacDinh === LoaiDefaultValue.LAY_TU_KHAI_BAO && (
					<Row gutter={[12, 0]}>
						<Col span={12}>
							<Form.Item
								name='maFormLayDefaultValue'
								label={intl.formatMessage({ id: 'bieumaukhaibao.laydulieutubieumauthongtin' })}
								rules={[...rules.required]}
							>
								<Select
									onChange={() => {
										form.setFieldsValue({
											maFieldLayDefaultValue: undefined,
										});
									}}
									placeholder={intl.formatMessage({ id: 'bieumaukhaibao.chonbieumauthongtin' })}
									options={danhSachFormKhaiBao?.map((item) => ({ value: item.ma, label: item.ten }))}
								/>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name='maFieldLayDefaultValue'
								label={intl.formatMessage({ id: 'bieumaukhaibao.laydulieututruongthongtin' })}
								rules={[...rules.required]}
							>
								<Select
									onChange={(val) => {
										const kieuDuLieuTemp = danhSachFormKhaiBao
											?.find((item) => item.ma === maFormLayDefaultValue)
											?.cauHinhLoaiHinh?.find((ele) => ele.ma === val)?.kieuDuLieu;
										form.setFieldsValue({
											kieuDuLieu: kieuDuLieuTemp,
										});
										setKieuDuLieu(kieuDuLieuTemp as EKieuDuLieu);
									}}
									placeholder={intl.formatMessage({ id: 'bieumaukhaibao.chontruongthongtin' })}
									options={danhSachFormKhaiBao
										?.find((item) => item.ma === maFormLayDefaultValue)
										?.cauHinhLoaiHinh?.map((item) => ({ value: item.ma, label: item.ten }))}
								/>
							</Form.Item>
						</Col>
					</Row>
				)}

				<Form.Item name='readonly' valuePropName='checked'>
					<Checkbox>{intl.formatMessage({ id: 'bieumaukhaibao.chidoc' })}</Checkbox>
				</Form.Item>
				<Form.Item name='ghiChu' label={intl.formatMessage({ id: 'bieumaukhaibao.ghichu' })} rules={[...rules.text]}>
					<Input.TextArea placeholder={intl.formatMessage({ id: 'bieumaukhaibao.ghichu' })} />
				</Form.Item>
				<Form.Item
					name='kieuDuLieu'
					label={intl.formatMessage({ id: 'bieumaukhaibao.kieudulieu' })}
					rules={[...rules.required]}
				>
					<Select
						onChange={(val) => setKieuDuLieu(val)}
						options={Object.values(EKieuDuLieu).map((item) => ({ label: item, value: item }))}
						placeholder={intl.formatMessage({ id: 'bieumaukhaibao.kieudulieu' })}
					/>
				</Form.Item>

				<Row gutter={[12, 0]}>
					<Col span={isAvailableDangMang ? 8 : 12}>
						<Form.Item
							name='batBuoc'
							label={intl.formatMessage({ id: 'bieumaukhaibao.batbuoc' })}
							initialValue={true}
							rules={[...rules.required]}
						>
							<Radio.Group
								options={[
									{ value: true, label: intl.formatMessage({ id: 'bieumaukhaibao.co' }) },
									{ value: false, label: intl.formatMessage({ id: 'bieumaukhaibao.khong' }) },
								]}
							/>
						</Form.Item>
					</Col>

					{isAvailableDangMang && (
						<Col span={isAvailableDangMang ? 8 : 12}>
							<Form.Item
								name='laDangMang'
								initialValue={false}
								label={intl.formatMessage({ id: 'bieumaukhaibao.chophepnhapnhieugiatri' })}
								rules={[...rules.required]}
							>
								<Radio.Group
									options={[
										{ value: true, label: intl.formatMessage({ id: 'bieumaukhaibao.co' }) },
										{ value: false, label: intl.formatMessage({ id: 'bieumaukhaibao.khong' }) },
									]}
								/>
							</Form.Item>
						</Col>
					)}
					<Col span={isAvailableDangMang ? 8 : 12}>
						<Form.Item name='colspan' label={intl.formatMessage({ id: 'bieumaukhaibao.chieurongcot' })}>
							<InputNumber
								style={{ width: '100%' }}
								min={0}
								max={24}
								placeholder={intl.formatMessage({ id: 'bieumaukhaibao.nhapgiatri' })}
							/>
						</Form.Item>
					</Col>
				</Row>
				{kieuDuLieu === EKieuDuLieu.FILE && (
					<>
						<Form.Item name='danhSachFileDinhKem' label={intl.formatMessage({ id: 'bieumaukhaibao.filedinhkemneuco' })}>
							<UploadFile maxCount={5} />
						</Form.Item>
						<Form.Item
							name='ghiChuFileDinhKem'
							label={intl.formatMessage({ id: 'bieumaukhaibao.ghichufiledinhkemneuco' })}
						>
							<Input placeholder={intl.formatMessage({ id: 'bieumaukhaibao.nhapghichuneuco' })} />
						</Form.Item>
					</>
				)}
				{kieuDuLieu === EKieuDuLieu.TEXT && (
					<Form.Item name='textDisplay' label={intl.formatMessage({ id: 'bieumaukhaibao.kieuhinhthdacbiet' })}>
						<Select
							placeholder={intl.formatMessage({ id: 'bieumaukhaibao.chonkieuhienthi' })}
							options={Object.values(ETextDisplay).map((item) => ({
								value: item,
								label: MapKeyNameTextDisplay[item],
							}))}
						/>
					</Form.Item>
				)}

				{kieuDuLieu === EKieuDuLieu.DANHMUC && (
					<Form.Item
						name='maDanhMuc'
						label={
							<span>
								{intl.formatMessage({ id: 'bieumaukhaibao.danhmuc' })} (
								<Button
									loading={loadingDanhMucChung}
									onClick={() => {
										getAllDanhMucChung(false, undefined, { maModule: ELoaiDanhMucChung.QUY_TRINH });
									}}
									style={{ padding: 0 }}
									type='link'
								>
									{intl.formatMessage({ id: 'bieumaukhaibao.lammoi' })}
								</Button>
								)
							</span>
						}
						rules={[...rules.required]}
					>
						<Select
							options={danhSach.map((item) => ({
								label: (
									<Popover
										placement='left'
										content={() => {
											return (
												<div>
													{item.danhSachGiaTri.map((giaTri: { value: string }) => (
														<div key={giaTri.value}>- {giaTri.value}</div>
													))}
												</div>
											);
										}}
									>
										{item.maDanhMuc}
									</Popover>
								),
								value: item.maDanhMuc,
							}))}
							placeholder={intl.formatMessage({ id: 'bieumaukhaibao.danhmuc' })}
						/>
					</Form.Item>
				)}

				{kieuDuLieu === EKieuDuLieu.TABLE && (
					<>
						<div className='ant-descriptions-title' style={{ marginTop: 12, marginBottom: 12 }}>
							{intl.formatMessage({ id: 'bieumaukhaibao.danhsachcot' })}
						</div>
						<TableStaticData
							onSortEnd={onSortEnd}
							rowSortable
							size='small'
							columns={columns}
							data={recordCauHinh?.danhSachCot ?? []}
							addStt
							hasTotal
							loading={loading}
						>
							<Space wrap>
								<Button
									size='small'
									type='primary'
									icon={<PlusCircleOutlined />}
									onClick={() => {
										setEditCot(false);
										setVisibleCot(true);
										setRecordCot(undefined);
									}}
								>
									{intl.formatMessage({ id: 'bieumaukhaibao.themmoi' })}
								</Button>
							</Space>
						</TableStaticData>

						<Form.Item
							extra={intl.formatMessage({ id: 'bieumaukhaibao.detrongneumuonhienthitatcacot' })}
							style={{ marginTop: 8 }}
							name='danhSachCotHienThi'
							label={intl.formatMessage({ id: 'bieumaukhaibao.danhsachcothienthithongtin' })}
							// rules={[...rules.required]}
						>
							<Select
								allowClear
								options={recordCauHinh?.danhSachCot?.map((item: { ten: any; ma: any }) => ({
									label: item.ten,
									value: item.ma,
								}))}
								mode='multiple'
								placeholder={intl.formatMessage({ id: 'bieumaukhaibao.danhsachcothienthithongtin' })}
							/>
						</Form.Item>
					</>
				)}

				{/* {kieuDuLieu === EKieuDuLieu.DANHSACH && (
						<Form.Item name='LoaiHinhId' label='Loại hình NCKH'>
							<SelectLoaiHinh />
						</Form.Item>
					)} */}

				<Form.Item
					name='truongThongTinLienQuan'
					label={intl.formatMessage({ id: 'bieumaukhaibao.truongthongtinlienquan' })}
				>
					<Select
						allowClear
						onChange={(val) => {
							form.setFieldsValue({ giaTriLienQuan: undefined });
							setTruongThongTinLienQuan(record?.cauHinhLoaiHinh?.find((item: { ma: any }) => item.ma === val));
						}}
						options={record?.cauHinhLoaiHinh
							?.filter((item: { ma: any }) => item.ma !== recordCauHinh?.ma)
							?.map((item: { ten: any; ma: any }) => ({ label: item.ten, value: item.ma }))}
						placeholder={intl.formatMessage({ id: 'bieumaukhaibao.truongthongtinlienquan' })}
					/>
				</Form.Item>

				{truongThongTinLienQuan?.kieuDuLieu ? (
					<FormGiaTriLienQuan truongThongTinLienQuan={truongThongTinLienQuan} />
				) : null}

				<Form.Item
					name='layDuLieuTu'
					label={intl.formatMessage({ id: 'bieumaukhaibao.laydulieututruongthongtinlienquan' })}
				>
					<Select
						allowClear
						options={record?.cauHinhLoaiHinh
							?.filter((item: { ma: any }) => item.ma !== recordCauHinh?.ma)
							?.map((item: { ten: any; ma: any }) => ({ label: item.ten, value: item.ma }))}
						placeholder={intl.formatMessage({ id: 'bieumaukhaibao.laydulieututruongthongtinlienquan' })}
					/>
				</Form.Item>

				<Form.Item
					name='truongLayDuLieu'
					label={intl.formatMessage({ id: 'bieumaukhaibao.truonglaydulieu' })}
					rules={[...rules.text]}
				>
					<Input placeholder={intl.formatMessage({ id: 'bieumaukhaibao.truonglaydulieu' })} />
				</Form.Item>

				<FormThamDinh />

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!editCauHinh
							? intl.formatMessage({ id: 'bieumaukhaibao.themmoi' })
							: intl.formatMessage({ id: 'bieumaukhaibao.luulai' })}
					</Button>
					{!editCauHinh && (
						<Button
							loading={formSubmiting}
							onClick={() => {
								form.validateFields();
								const values = form.getFieldsValue();
								onFinish(values, true);
							}}
							type='primary'
						>
							{intl.formatMessage({ id: 'bieumaukhaibao.themmoivatieptuc' })}
						</Button>
					)}
					<Button onClick={() => onCancel()}>{intl.formatMessage({ id: 'bieumaukhaibao.huy' })}</Button>
				</div>
			</Form>

			<Modal
				width={700}
				open={visibleCot}
				destroyOnHidden
				footer={null}
				styles={{ body: { padding: 0 } }}
				onCancel={onCancelFormCot}
			>
				<FormCot onCancel={onCancelFormCot} />
			</Modal>
		</Card>
	);
};
export default FormCauHinh;

import FormGiaTriLienQuan from '@/pages/DanhMuc/BieuMauKhaiBao/components/FormGiaTriLienQuan';
import FormThamDinh from '@/pages/DanhMuc/BieuMauKhaiBao/components/FormThamDinh';
import { EKieuDuLieu, ETextDisplay, MapKeyNameTextDisplay } from '@/services/DanhMuc/BieuMau/constant';
import { BieuMau } from '@/services/DanhMuc/BieuMau/typing';
import rules from '@/utils/rules';
import { removeVietnameseTones } from '@/utils/utils';
import { useIntl, useModel } from '@umijs/max';
import { Button, Card, Col, Form, Input, InputNumber, message, Popover, Radio, Row, Select } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';

interface IProps {
	onCancel: () => void;
}

const FormCot = ({ onCancel }: IProps) => {
	const intl = useIntl();
	const [form] = Form.useForm();

	const { formSubmiting, recordCauHinh, setRecordCauHinh, editCot, recordCot } = useModel('danhmuc.bieumau');

	const [truongThongTinLienQuan, setTruongThongTinLienQuan] = useState<BieuMau.Cot | undefined>(
		recordCauHinh?.danhSachCot?.find((item: { ma: any }) => item.ma === recordCot?.truongThongTinLienQuan),
	);

	const {
		getAllModel: getAllDanhMucChung,
		loading: loadingDanhMucChung,
		danhSach,
	} = useModel('workflow.danhmuc.index');
	const [kieuDuLieu, setKieuDuLieu] = useState<EKieuDuLieu>(recordCot?.kieuDuLieu ?? EKieuDuLieu.BOOLEAN);

	useEffect(() => {
		if (recordCot?.ma && editCot) form.setFieldsValue(recordCot);
	}, [recordCot?.ma]);

	const onFinish = async (values: BieuMau.Cot, isContinue: boolean) => {
		if (editCot && recordCauHinh && recordCot) {
			const index = recordCauHinh.danhSachCot.map((item: { ma: any }) => item.ma).indexOf(recordCot.ma);
			const danhSachCot = [...recordCauHinh.danhSachCot];
			danhSachCot.splice(index, 1, { ...recordCot, ...values });
			setRecordCauHinh({ ...recordCauHinh, danhSachCot });
		} else {
			setRecordCauHinh({
				...(recordCauHinh || {}),
				danhSachCot: [...(recordCauHinh?.danhSachCot ?? []), values],
			} as BieuMau.TruongThongTin);
		}
		message.success(
			editCot
				? intl.formatMessage({ id: 'bieumaukhaibao.suathanhcong' })
				: intl.formatMessage({ id: 'bieumaukhaibao.themmoithanhcong' }),
		);
		if (isContinue) {
			form.resetFields();
		} else onCancel();
	};

	const isAvailableDangMang = [EKieuDuLieu.DANHMUC, EKieuDuLieu.DECIMAL, EKieuDuLieu.NUMBER, EKieuDuLieu.TEXT].includes(
		kieuDuLieu,
	);

	return (
		<Card
			title={
				editCot
					? intl.formatMessage({ id: 'bieumaukhaibao.chinhsuacot' })
					: intl.formatMessage({ id: 'bieumaukhaibao.themmoicot' })
			}
		>
			<Form onFinish={(values) => onFinish(values, false)} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col xs={24} sm={24} md={12}>
						<Form.Item
							name='ten'
							label={intl.formatMessage({ id: 'bieumaukhaibao.tencot' })}
							rules={[...rules.required, ...rules.text]}
						>
							<Input
								onChange={(e) => {
									if (!editCot) form.setFieldsValue({ ma: _.camelCase(removeVietnameseTones(e?.target?.value ?? '')) });
								}}
								autoFocus
								placeholder={intl.formatMessage({ id: 'bieumaukhaibao.tencot' })}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} sm={24} md={12}>
						<Form.Item
							name='ma'
							label={intl.formatMessage({ id: 'bieumaukhaibao.macot' })}
							rules={[...rules.required, ...rules.text]}
						>
							<Input placeholder={intl.formatMessage({ id: 'bieumaukhaibao.macot' })} />
						</Form.Item>
					</Col>
				</Row>

				<Form.Item
					name='kieuDuLieu'
					label={intl.formatMessage({ id: 'bieumaukhaibao.kieudulieu' })}
					rules={[...rules.required]}
				>
					<Select
						onChange={(val) => setKieuDuLieu(val)}
						options={Object.values(EKieuDuLieu)
							.filter((item) => item !== EKieuDuLieu.TABLE)
							.map((item) => ({ label: item, value: item }))}
						placeholder={intl.formatMessage({ id: 'bieumaukhaibao.kieudulieu' })}
					/>
				</Form.Item>

				{kieuDuLieu === EKieuDuLieu.DANHMUC && (
					<Form.Item
						name='maDanhMuc'
						label={
							<span>
								{intl.formatMessage({ id: 'bieumaukhaibao.danhmuc' })} (
								<Button
									loading={loadingDanhMucChung}
									onClick={() => {
										getAllDanhMucChung(false);
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
										content={
											<div>
												{item.danhSachGiaTri.map((giaTri: { value: string }) => (
													<div key={giaTri.value}>- {giaTri.value}</div>
												))}
											</div>
										}
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

				{kieuDuLieu === EKieuDuLieu.TEXT && (
					<Form.Item name='textDisplay' label={intl.formatMessage({ id: 'bieumaukhaibao.kieuhinhthdacbiet' })}>
						<Select
							placeholder={intl.formatMessage({ id: 'bieumaukhaibao.chonkieuhienthi' })}
							options={Object.values(ETextDisplay).map((item) => ({ value: item, label: MapKeyNameTextDisplay[item] }))}
						/>
					</Form.Item>
				)}

				<Form.Item
					name='truongThongTinLienQuan'
					label={intl.formatMessage({ id: 'bieumaukhaibao.truongthingtinlienquan' })}
				>
					<Select
						allowClear
						onChange={(val) => {
							form.setFieldsValue({ giaTriLienQuan: undefined });
							setTruongThongTinLienQuan(recordCauHinh?.danhSachCot?.find((item: { ma: any }) => item.ma === val));
						}}
						options={recordCauHinh?.danhSachCot
							?.filter((item: { ma: any }) => item.ma !== recordCot?.ma)
							?.map((item: { ten: any; ma: any }) => ({ label: item.ten, value: item.ma }))}
						placeholder={intl.formatMessage({ id: 'bieumaukhaibao.truongthingtinlienquan' })}
					/>
				</Form.Item>

				{truongThongTinLienQuan?.kieuDuLieu ? (
					<FormGiaTriLienQuan truongThongTinLienQuan={truongThongTinLienQuan} />
				) : null}

				<Form.Item
					name='layDuLieuTu'
					label={intl.formatMessage({ id: 'bieumaukhaibao.laydulieututruongthingtinlienquan' })}
				>
					<Select
						allowClear
						options={recordCauHinh?.danhSachCot
							?.filter((item: { ma: any }) => item.ma !== recordCauHinh?.ma)
							?.map((item: { ten: any; ma: any }) => ({ label: item.ten, value: item.ma }))}
						placeholder={intl.formatMessage({ id: 'bieumaukhaibao.laydulieututruongthingtinlienquan' })}
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
						<Col span={8}>
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

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!editCot
							? intl.formatMessage({ id: 'bieumaukhaibao.them' })
							: intl.formatMessage({ id: 'bieumaukhaibao.luulai' })}
					</Button>
					{!editCot && (
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
		</Card>
	);
};

export default FormCot;

import { EHocHam, EHocVi } from '@/services/ThamQuyen/constant';
import { ThamQuyen } from '@/services/ThamQuyen/typing';
import { ThongTinNhanSu } from '@/services/ToChucNhanSu/ThongTinNhanSu/typing';
import { useIntl, useModel } from '@umijs/max';
import { Col, Form, Input, Modal, Row, Select } from 'antd';
import { useEffect } from 'react';

interface MemberFormModalProps {
	open: boolean;
	onCancel: () => void;
	onSubmit: (values: ThamQuyen.DanhSachThanhVienXuLy) => void;
	initialValues?: ThamQuyen.DanhSachThanhVienXuLy;
	okText?: string;
	cancelText?: string;
	title?: string;
}

export const MemberFormModal = ({
	open,
	onCancel,
	onSubmit,
	initialValues,
	okText,
	cancelText,
	title,
}: MemberFormModalProps) => {
	const intl = useIntl();
	const [form] = Form.useForm();

	const { getModel, danhSach } = useModel('tochucnhansu.thongtinnhansu');

	const fetchCanBo = async (ssoId: string) => {
		const res = await getModel({ ssoId, trangThaiChinhSua: 'Duyệt - đang áp dụng', trangThai: 'Đang làm việc' });
		return res?.[0];
	};
	useEffect(() => {
		const loadData = async () => {
			if (open) {
				if (initialValues?.ssoId) {
					const nv = await fetchCanBo(initialValues?.ssoId);
					const initialValuesWithNv = {
						...initialValues,
						ssoId: nv.ssoId,
						hoTen: nv.hoTen,
						tenDonVi: nv.donViChinh?.ten,
						maDonVi: nv.donViChinh?.maDonVi,
						soDienThoai: nv.sdtCaNhan,
						email: nv.email,
						hocHam: nv.hocHam,
						hocVi: nv.hocVi,
					};
					if (nv) {
						form.setFieldsValue(initialValuesWithNv);
					} else {
						form.setFieldsValue(initialValues);
					}
				} else {
					form.resetFields();
				}
			}
		};
		loadData();
	}, [open, initialValues, form]);

	const handleOk = () => {
		form.validateFields().then((values) => {
			// Return all form values
			const cleanValues: ThamQuyen.DanhSachThanhVienXuLy = {
				...values,
				// donViId could be mapped if needed, keeping simple spread if form fields match interface
				donViId: values.maDonVi,
			};
			onSubmit(cleanValues);
		});
	};

	const handleCanBoSelect = (nv: ThongTinNhanSu.IRecord) => {
		form.setFieldsValue({
			ssoId: nv.ssoId,
			hoTen: nv.hoTen,
			tenDonVi: nv.donViChinh?.ten,
			maDonVi: nv.donViChinh?.maDonVi,
			maCanBo: nv.maCanBo,
			soDienThoai: nv.sdtCaNhan,
			email: nv.email,
			hocHam: nv.hocHam,
			hocVi: nv.hocVi,
		});
	};

	return (
		<Modal
			title={title ?? intl.formatMessage({ id: 'workflow.member.title' })}
			open={open}
			onCancel={onCancel}
			onOk={handleOk}
			okText={okText ?? intl.formatMessage({ id: 'workflow.common.save' })}
			cancelText={cancelText ?? intl.formatMessage({ id: 'workflow.common.cancel' })}
			destroyOnHidden
		>
			<Form form={form} layout='vertical'>
				<Form.Item
					name='hoTen'
					label={intl.formatMessage({ id: 'workflow.member.fullname' })}
					rules={[{ required: true, message: intl.formatMessage({ id: 'workflow.member.fullname.required' }) }]}
				>
					<Select
						onChange={(val: any, option) => {
							const { rawData }: any = option;
							handleCanBoSelect(rawData);
						}}
						options={danhSach.map((item) => ({
							key: item._id,
							value: item.ssoId,
							label: `${item.hoDem ?? ''} ${item.ten ?? ''} - ${item.maCanBo ?? ''} - ${item.donViChinh?.ten ?? ''}`,
							rawData: item,
						}))}
						showSearch
						optionFilterProp='label'
						placeholder={'Chọn thành viên'}
						style={{ width: '100%' }}
					/>
				</Form.Item>
				<Form.Item
					name='tenDonVi'
					label={intl.formatMessage({ id: 'workflow.member.organization' })}
					rules={[{ required: true }]}
				>
					<Input placeholder={intl.formatMessage({ id: 'nodes.nhaptendonvi' })} />
				</Form.Item>
				<Form.Item name='maCanBo' hidden>
					<Input />
				</Form.Item>
				<Form.Item name='maDonVi' hidden>
					<Input />
				</Form.Item>
				<Row gutter={16}>
					<Col span={12}>
						<Form.Item name='soDienThoai' label={intl.formatMessage({ id: 'workflow.member.phone' })}>
							<Input placeholder={intl.formatMessage({ id: 'nodes.nhapsodienthoai' })} />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name='email' label={intl.formatMessage({ id: 'workflow.member.email' })}>
							<Input placeholder={intl.formatMessage({ id: 'nodes.nhapemail' })} />
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={12}>
						<Form.Item name='hocHam' label={intl.formatMessage({ id: 'workflow.member.academicRank' })}>
							<Select
								placeholder={intl.formatMessage({ id: 'workflow.member.academicRank' })}
								allowClear
								options={Object.values(EHocHam).map((val) => ({ value: val, label: val }))}
							/>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name='hocVi' label={intl.formatMessage({ id: 'workflow.member.academicDegree' })}>
							<Select
								placeholder={intl.formatMessage({ id: 'workflow.member.academicDegree' })}
								allowClear
								options={Object.values(EHocVi).map((val) => ({ value: val, label: val }))}
							/>
						</Form.Item>
					</Col>
				</Row>
				<Form.Item name='ssoId' hidden>
					<Input placeholder={intl.formatMessage({ id: 'nodes.nhapssoid' })} />
				</Form.Item>
			</Form>
		</Modal>
	);
};

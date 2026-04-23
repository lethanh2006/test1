import { ECapChucVu, PhuongThucPhanCong } from '@/services/ThamQuyen/constant';
import { ThamQuyen } from '@/services/ThamQuyen/typing';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import { Button, Col, Form, Input, Popconfirm, Row, Select, Space, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import { MemberFormModal } from './MemberFormModal';
import { SelectDonVi } from './SelectDonVi';

interface AssigneeFormModalProps {
	initialValue?: ThamQuyen.AssigneeConfig;
	onSubmit: (config: ThamQuyen.AssigneeConfig) => void;
	onCancel: () => void;
}

export const AssigneeFormModal = ({ initialValue, onSubmit, onCancel }: AssigneeFormModalProps) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const [phuongThuc, setPhuongThuc] = useState<PhuongThucPhanCong | undefined>(initialValue?.type);
	const [danhSachThanhVien, setDanhSachThanhVien] = useState<ThamQuyen.DanhSachThanhVienXuLy[]>(
		initialValue?.danhSachThanhVienXuLy ?? [],
	);

	// Modal thêm/sửa thành viên
	const [memberModalVisible, setMemberModalVisible] = useState(false);
	const [editingMemberIndex, setEditingMemberIndex] = useState<number | null>(null);

	const handleFinish = (values: any) => {
		const config: ThamQuyen.AssigneeConfig = {
			type: values.type,
		};

		switch (values.type) {
			case PhuongThucPhanCong.BIEN_HE_THONG:
				config.value = values.value;
				break;
			case PhuongThucPhanCong.DON_VI_CU_THE:
			case PhuongThucPhanCong.NGUOI_CU_THE:
				config.maDonViXuLy = values.maDonViXuLy;
				config.tenDonVi = values.tenDonVi;
				config.theoDoiToanBo = values.theoDoiToanBo;
				config.tiepNhanDonViCon = values.tiepNhanDonViCon;
				config.danhSachThanhVienXuLy = danhSachThanhVien;
				break;
			case PhuongThucPhanCong.DON_VI_QUAN_LY:
				config.danhSachCapChucVu = values.danhSachCapChucVu;
				break;
			// CO_VAN_HOC_TAP: không cần thêm field
		}

		onSubmit(config);
	};

	const handleDonViSelect = (donVi: { maDonVi: string; ten: string }) => {
		form.setFieldsValue({
			maDonViXuLy: donVi.maDonVi,
			tenDonVi: donVi.ten,
		});
	};

	const handleAddMember = () => {
		setEditingMemberIndex(null);
		setMemberModalVisible(true);
	};

	const handleEditMember = (index: number) => {
		setEditingMemberIndex(index);
		setMemberModalVisible(true);
	};

	const handleDeleteMember = (index: number) => {
		const newList = [...danhSachThanhVien];
		newList.splice(index, 1);
		setDanhSachThanhVien(newList);
	};

	const handleMemberSubmit = (values: ThamQuyen.DanhSachThanhVienXuLy) => {
		const newList = [...danhSachThanhVien];

		if (editingMemberIndex !== null) {
			newList[editingMemberIndex] = values;
		} else {
			newList.push(values);
		}
		setDanhSachThanhVien(newList);
		setMemberModalVisible(false);
	};

	const memberColumns: ColumnsType<ThamQuyen.DanhSachThanhVienXuLy> = [
		{
			title: intl.formatMessage({ id: 'workflow.common.stt' }),
			width: 50,
			align: 'center',
			render: (_, __, idx) => idx + 1,
		},
		{
			title: intl.formatMessage({ id: 'workflow.assignee.unitCode' }),
			width: 120,
			dataIndex: 'maDonVi',
		},
		{
			title: intl.formatMessage({ id: 'nodes.madinhdanh' }),
			dataIndex: 'maCanBo',
			width: 120,
		},
		{ title: intl.formatMessage({ id: 'workflow.member.fullname' }), dataIndex: 'hoTen', width: 150 },
		{ title: intl.formatMessage({ id: 'workflow.assignee.unit' }), dataIndex: 'tenDonVi' },
		{
			title: intl.formatMessage({ id: 'workflow.common.action' }),
			width: 100,
			align: 'center',
			render: (_, __, index) => (
				<>
					<Button type='link' size='small' icon={<EditOutlined />} onClick={() => handleEditMember(index)} />
					<Popconfirm
						title={intl.formatMessage({ id: 'workflow.assignee.deleteMemberConfirm' })}
						onConfirm={() => handleDeleteMember(index)}
					>
						<Button type='link' size='small' danger icon={<DeleteOutlined />} />
					</Popconfirm>
				</>
			),
		},
	];

	return (
		<>
			<Form form={form} layout='vertical' initialValues={initialValue} onFinish={handleFinish}>
				<Row gutter={16}>
					<Col span={12}>
						<Form.Item
							name='type'
							label={intl.formatMessage({ id: 'workflow.assignee.method' })}
							rules={[{ required: true, message: intl.formatMessage({ id: 'workflow.assignee.method.required' }) }]}
						>
							<Select
								placeholder={intl.formatMessage({ id: 'workflow.assignee.method.placeholder' })}
								onChange={(v) => setPhuongThuc(v)}
								options={[
									{
										value: PhuongThucPhanCong.NGUOI_TAO_DON,
										label: intl.formatMessage({ id: 'workflow.method.creator' }),
									},
									{
										value: PhuongThucPhanCong.NGUOI_CU_THE,
										label: intl.formatMessage({ id: 'workflow.method.specificPerson' }),
									},
									{
										value: PhuongThucPhanCong.CO_VAN_HOC_TAP,
										label: intl.formatMessage({ id: 'workflow.method.advisor' }),
									},
									{
										value: PhuongThucPhanCong.DON_VI_CU_THE,
										label: intl.formatMessage({ id: 'workflow.method.specificUnit' }),
									},
									{
										value: PhuongThucPhanCong.DON_VI_QUAN_LY,
										label: intl.formatMessage({ id: 'workflow.method.managementUnit' }),
									},
									{
										value: PhuongThucPhanCong.HOI_DONG,
										label: intl.formatMessage({ id: 'workflow.method.council' }),
									},
									{
										value: PhuongThucPhanCong.QUYET_DINH,
										label: intl.formatMessage({ id: 'workflow.method.decision' }),
									},
									{
										value: PhuongThucPhanCong.BIEN_HE_THONG,
										label: intl.formatMessage({ id: 'workflow.method.systemVariable' }),
									},
								]}
							/>
						</Form.Item>
					</Col>

					{/* DON_VI_CU_THE & NGUOI_CU_THE */}
					{(phuongThuc === PhuongThucPhanCong.DON_VI_CU_THE || phuongThuc === PhuongThucPhanCong.NGUOI_CU_THE) && (
						<>
							{phuongThuc === PhuongThucPhanCong.DON_VI_CU_THE && (
								<Col span={12}>
									<Form.Item
										name='maDonViXuLy'
										label={intl.formatMessage({ id: 'workflow.assignee.unit' })}
										rules={[{ required: true, message: intl.formatMessage({ id: 'workflow.assignee.unit.required' }) }]}
									>
										<SelectDonVi onSelectDonVi={handleDonViSelect} />
									</Form.Item>
								</Col>
							)}
							<Col span={12}>
								<Form.Item name='maDonViXuLy' label={intl.formatMessage({ id: 'workflow.assignee.unitCode' })}>
									<Input placeholder={intl.formatMessage({ id: 'nodes.nhapmadonvi' })} />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item name='tenDonVi' label={intl.formatMessage({ id: 'workflow.assignee.unitName' })}>
									<Input placeholder={intl.formatMessage({ id: 'nodes.nhaptendonvi' })} />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item
									name='theoDoiToanBo'
									label={intl.formatMessage({ id: 'workflow.assignee.followOutside' })}
									rules={[{ required: true }]}
									initialValue={false}
								>
									<Select
										options={[
											{ value: true, label: intl.formatMessage({ id: 'workflow.common.yes' }) },
											{ value: false, label: intl.formatMessage({ id: 'workflow.common.no' }) },
										]}
									/>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item
									name='tiepNhanDonViCon'
									label={intl.formatMessage({ id: 'workflow.assignee.receiveSubUnit' })}
									rules={[{ required: true }]}
									initialValue={false}
								>
									<Select
										options={[
											{ value: true, label: intl.formatMessage({ id: 'workflow.common.yes' }) },
											{ value: false, label: intl.formatMessage({ id: 'workflow.common.no' }) },
										]}
									/>
								</Form.Item>
							</Col>
							<Col span={24}>
								<div style={{ marginBottom: 8, fontWeight: 500 }}>
									{intl.formatMessage({ id: 'workflow.assignee.members' })}
								</div>
								<Button type='primary' icon={<PlusOutlined />} onClick={handleAddMember} style={{ marginBottom: 12 }}>
									{intl.formatMessage({ id: 'workflow.assignee.addMember' })}
								</Button>
								<Table
									dataSource={danhSachThanhVien}
									columns={memberColumns}
									size='small'
									pagination={false}
									rowKey={(_, idx) => String(idx)}
									footer={() => (
										<div style={{ color: '#8c8c8c', fontStyle: 'italic' }}>
											{intl.formatMessage({ id: 'workflow.assignee.memberHint' })}
										</div>
									)}
								/>
							</Col>
						</>
					)}

					{/* DON_VI_QUAN_LY */}
					{phuongThuc === PhuongThucPhanCong.DON_VI_QUAN_LY && (
						<Col span={12}>
							<Form.Item
								name='danhSachCapChucVu'
								label={intl.formatMessage({ id: 'workflow.assignee.role' })}
								rules={[{ required: true, message: intl.formatMessage({ id: 'workflow.assignee.role.required' }) }]}
							>
								<Select
									mode='multiple'
									placeholder={intl.formatMessage({ id: 'workflow.assignee.role.placeholder' })}
									options={[
										{ value: ECapChucVu.TRUONG, label: intl.formatMessage({ id: 'workflow.role.head' }) },
										{ value: ECapChucVu.PHO, label: intl.formatMessage({ id: 'workflow.role.deputy' }) },
										{ value: ECapChucVu.CAN_BO, label: intl.formatMessage({ id: 'workflow.role.officer' }) },
										{ value: ECapChucVu.NHAN_VIEN, label: intl.formatMessage({ id: 'workflow.role.staff' }) },
									]}
								/>
							</Form.Item>
						</Col>
					)}

					{/* CO_VAN_HOC_TAP */}
					{phuongThuc === PhuongThucPhanCong.CO_VAN_HOC_TAP && (
						<Col span={24}>
							<div style={{ padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
								{intl.formatMessage({ id: 'workflow.assignee.advisorHint' })}
							</div>
						</Col>
					)}

					{/* BIEN_HE_THONG */}
					{phuongThuc === PhuongThucPhanCong.BIEN_HE_THONG && (
						<Col span={24}>
							<Form.Item
								name='value'
								label='Biến hệ thống'
								rules={[{ required: true, message: 'Vui lòng nhập biến hệ thống!' }]}
							>
								<Input placeholder='Nhập giá trị biến (vd: ={{...}})' />
							</Form.Item>
						</Col>
					)}
				</Row>

				<Form.Item style={{ marginTop: 16 }}>
					<Space style={{ width: '100%', justifyContent: 'flex-end' }}>
						<Button onClick={onCancel}>{intl.formatMessage({ id: 'workflow.common.cancel' })}</Button>
						<Button type='primary' htmlType='submit'>
							{initialValue
								? intl.formatMessage({ id: 'workflow.common.update' })
								: intl.formatMessage({ id: 'workflow.common.add' })}
						</Button>
					</Space>
				</Form.Item>
			</Form>

			<MemberFormModal
				open={memberModalVisible}
				onCancel={() => setMemberModalVisible(false)}
				onSubmit={handleMemberSubmit}
				initialValues={editingMemberIndex !== null ? danhSachThanhVien[editingMemberIndex] : undefined}
				title={
					editingMemberIndex !== null
						? intl.formatMessage({ id: 'workflow.assignee.editMember' })
						: intl.formatMessage({ id: 'workflow.assignee.addMember' })
				}
				okText={
					editingMemberIndex !== null
						? intl.formatMessage({ id: 'workflow.common.update' })
						: intl.formatMessage({ id: 'workflow.common.add' })
				}
			/>
		</>
	);
};

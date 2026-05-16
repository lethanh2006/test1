import { AssigneeFormModal } from '@/components/Nodes/components/AssigneeFormModal';
import TableStaticData from '@/components/Table/TableStaticData';
import { IColumn } from '@/components/Table/typing';
import { PhuongThucPhanCong } from '@/services/ThamQuyen/constant';
import { ThamQuyen } from '@/services/ThamQuyen/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import { Button, Modal, Popconfirm } from 'antd';
import { useState } from 'react';

interface AssigneeTableProps {
	value?: ThamQuyen.AssigneeConfig[];
	onChange?: (value: ThamQuyen.AssigneeConfig[]) => void;
	isView?: boolean;
}

export const AssigneeTable = ({ value = [], onChange, isView }: AssigneeTableProps) => {
	const intl = useIntl();
	const [modalVisible, setModalVisible] = useState(false);
	const [editingIndex, setEditingIndex] = useState<number | null>(null);
	const [memberList, setMemberList] = useState<ThamQuyen.DanhSachThanhVienXuLy[]>([]);
	const [visibleMemberModal, setVisibleMemberModal] = useState(false);

	const handleAdd = () => {
		setEditingIndex(null);
		setModalVisible(true);
	};

	const handleEdit = (index: number) => {
		setEditingIndex(index);
		setModalVisible(true);
	};

	const handleDelete = (index: number) => {
		const newValue = [...value];
		newValue.splice(index, 1);
		onChange?.(newValue);
	};

	const handleModalOk = (config: ThamQuyen.AssigneeConfig) => {
		const newValue = [...value];
		if (editingIndex !== null) {
			newValue[editingIndex] = config;
		} else {
			newValue.push(config);
		}
		onChange?.(newValue);
		setModalVisible(false);
	};

	const translateMethod = (type?: PhuongThucPhanCong) => {
		if (!type) return '-';
		switch (type) {
			case PhuongThucPhanCong.NGUOI_TAO_DON:
				return intl.formatMessage({ id: 'workflow.method.creator' });
			case PhuongThucPhanCong.NGUOI_CU_THE:
				return intl.formatMessage({ id: 'workflow.method.specificPerson' });
			case PhuongThucPhanCong.CO_VAN_HOC_TAP:
				return intl.formatMessage({ id: 'workflow.method.advisor' });
			case PhuongThucPhanCong.DON_VI_CU_THE:
				return intl.formatMessage({ id: 'workflow.method.specificUnit' });
			case PhuongThucPhanCong.DON_VI_QUAN_LY:
				return intl.formatMessage({ id: 'workflow.method.managementUnit' });
			default:
				return type;
		}
	};

	const renderCanBo = (record: ThamQuyen.AssigneeConfig) => {
		let count = 0;
		let title = 'Người đề xuất';
		if (record.type === PhuongThucPhanCong.DON_VI_CU_THE || record.type === PhuongThucPhanCong.NGUOI_CU_THE) {
			count = record.danhSachThanhVienXuLy?.length ?? 0;
			title =
				record?.tenDonVi ||
				(record.type === PhuongThucPhanCong.NGUOI_CU_THE ? `${translateMethod(record.type)} (${count})` : '');
		} else if (record.type === PhuongThucPhanCong.DON_VI_QUAN_LY) {
			count = record.danhSachCapChucVu?.length ?? 0;
			title = record?.tenDonVi ?? '';
		}

		if (record.type === PhuongThucPhanCong.CO_VAN_HOC_TAP) {
			return <span>{intl.formatMessage({ id: 'workflow.assignee.table.advisor' })}</span>;
		}
		if (record.type === PhuongThucPhanCong.HOI_DONG) {
			return <span>Hội đồng</span>;
		}
		if (record.type === PhuongThucPhanCong.DON_VI_QUAN_LY) {
			return <span>Đơn vị quản lý</span>;
		}

		const isClickable =
			count > 0 &&
			(record.type === PhuongThucPhanCong.DON_VI_CU_THE || record.type === PhuongThucPhanCong.NGUOI_CU_THE) &&
			record.danhSachThanhVienXuLy &&
			record.danhSachThanhVienXuLy.length > 0;

		return (
			<span
				style={{
					fontWeight: 500,
					cursor: isClickable ? 'pointer' : 'default',
					color: isClickable ? '#1890ff' : 'inherit',
				}}
				onClick={() => {
					if (isClickable) {
						setMemberList(record.danhSachThanhVienXuLy || []);
						setVisibleMemberModal(true);
					}
				}}
			>
				{title}
			</span>
		);
	};

	const memberColumns: IColumn<ThamQuyen.DanhSachThanhVienXuLy>[] = [
		{
			title: 'TT',
			dataIndex: 'index',
			width: 40,
			align: 'center',
		},
		{
			title: 'Họ và tên',
			dataIndex: 'hoTen',
			width: 150,
		},
		{
			title: 'Đơn vị',
			dataIndex: 'tenDonVi',
			width: 200,
			ellipsis: true,
		},
		{
			title: 'Email',
			dataIndex: 'email',
			width: 150,
		},
	];

	const columns: IColumn<ThamQuyen.AssigneeConfig>[] = [
		{
			title: 'TT',
			dataIndex: 'index',
			width: 55,
			align: 'center',
		},
		{
			title: 'Phương thức phân công',
			dataIndex: 'type',
			align: 'center',
			width: 220,
		},
		{
			title: intl.formatMessage({ id: 'workflow.assignee.table.unitCode' }),
			dataIndex: 'maDonViXuLy',
			width: 130,
			align: 'center',
			render: (val, rec) => {
				if (rec?.type === PhuongThucPhanCong.DON_VI_CU_THE || rec?.type === PhuongThucPhanCong.NGUOI_CU_THE) {
					return val || '--';
				}
				return '--';
			},
		},
		{
			title: intl.formatMessage({ id: 'workflow.assignee.table.unitName' }),
			dataIndex: 'tenDonVi',
			width: 200,
			align: 'center',
			render: (val, rec) => {
				if (rec?.type === PhuongThucPhanCong.DON_VI_CU_THE || rec?.type === PhuongThucPhanCong.NGUOI_CU_THE) {
					return val || '--';
				}
				return '--';
			},
		},
		{
			title: (
				<p
					style={{
						textAlign: 'center',
					}}
				>
					{intl.formatMessage({ id: 'workflow.assignee.table.handlingAuthority' })}
				</p>
			),
			width: 200,
			align: 'center',
			render: (_: any, record: ThamQuyen.AssigneeConfig) => renderCanBo(record),
		},
		{
			title: intl.formatMessage({ id: 'workflow.common.action' }),
			width: 100,
			align: 'center',
			key: 'action',
			fixed: 'right',
			render: (_: any, __: ThamQuyen.AssigneeConfig, index: number) => (
				<>
					<Button type='link' size='small' icon={<EditOutlined />} onClick={() => handleEdit(index)} />
					<Popconfirm
						title={intl.formatMessage({ id: 'workflow.assignee.table.deleteConfirm' })}
						onConfirm={() => handleDelete(index)}
					>
						<Button type='link' size='small' danger icon={<DeleteOutlined />} />
					</Popconfirm>
				</>
			),
		},
	];

	return (
		<>
			{isView ? (
				<>
					{value?.map((item, index) => (
						<div>
							{index + 1}. {renderCanBo(item)}
						</div>
					))}
				</>
			) : (
				<>
					<TableStaticData
						data={value}
						columns={isView ? columns.filter((col) => col.key !== 'action') : columns}
						size='small'
						hasTotal
						otherProps={{ pagination: false }}
						otherButtons={
							!isView
								? [
										<Button type='primary' size='small' onClick={handleAdd}>
											{intl.formatMessage({ id: 'workflow.assignee.table.add' })}
										</Button>,
									]
								: []
						}
					/>
				</>
			)}
			<Modal
				title={
					editingIndex !== null
						? intl.formatMessage({ id: 'workflow.assignee.table.edit' })
						: intl.formatMessage({ id: 'workflow.assignee.table.add' })
				}
				open={modalVisible}
				onCancel={() => setModalVisible(false)}
				footer={null}
				destroyOnClose
				width={700}
			>
				<AssigneeFormModal
					initialValue={editingIndex !== null ? value[editingIndex] : undefined}
					onSubmit={handleModalOk}
					onCancel={() => setModalVisible(false)}
				/>
			</Modal>

			<Modal
				title='Danh sách chi tiết'
				open={visibleMemberModal}
				onCancel={() => setVisibleMemberModal(false)}
				footer={null}
				destroyOnClose
				width={800}
			>
				<TableStaticData
					data={memberList}
					columns={memberColumns}
					size='small'
					hasTotal
					otherProps={{ pagination: false }}
				/>
			</Modal>
		</>
	);
};

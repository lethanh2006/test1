import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { IColumn } from '@/components/Table/typing';
import FormGiaoNopSanPham from '@/pages/DanhMuc/BieuMauKhaiBao/components/FormGiaoNopSanPham';
import FormThemMoiMauDon from '@/pages/DanhMuc/BieuMauKhaiBao/components/FormThemMoiMauDon';
import { BieuMau } from '@/services/DanhMuc/BieuMau/typing';
import { kiemTraPhanVung } from '@/utils/constants';
import { DeleteOutlined, EditOutlined, EyeOutlined, MenuOutlined } from '@ant-design/icons';
import { useIntl, useModel } from '@umijs/max';
import { Button, Modal, Popconfirm, Popover } from 'antd';

const BieuMauKhaiBaoPage = () => {
	const intl = useIntl();
	const { page, limit, handleEdit, setVisiblePreview, setRecordLoaiHinh, visiblePreview, deleteModel } =
		useModel('danhmuc.bieumau');

	const onCancelPreview = () => {
		setVisiblePreview(false);
	};

	const columns: IColumn<BieuMau.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'bieumaukhaibao.stt' }),
			dataIndex: 'index',
			width: 60,
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'bieumaukhaibao.mabieumau' }),
			dataIndex: 'ma',
			ellipsis: true,
		},
		{
			title: intl.formatMessage({ id: 'bieumaukhaibao.tenbieumau' }),
			dataIndex: 'ten',
			filterType: 'string',
			ellipsis: true,
		},
		{
			title: intl.formatMessage({ id: 'bieumaukhaibao.thaotac' }),
			align: 'center',
			width: 100,
			fixed: 'right',
			render: (recordVal: BieuMau.IRecord) => {
				const recordTemp: any = recordVal;

				const isPhanVung = kiemTraPhanVung(recordVal?.dataPartitionCode ?? null);

				return (
					<div style={{ display: 'flex', justifyContent: 'center' }}>
						<Popover
							placement='left'
							content={
								<>
									<ButtonExtend
										tooltip={intl.formatMessage({ id: 'bieumaukhaibao.xemtruoc' })}
										disabled={!recordVal?.cauHinhLoaiHinh?.length}
										onClick={() => {
											setVisiblePreview(true);
											setRecordLoaiHinh(recordTemp);
										}}
										type='link'
										icon={<EyeOutlined />}
									/>

									<ButtonExtend
										disabled={!isPhanVung}
										tooltip={intl.formatMessage({ id: 'bieumaukhaibao.chinhsuabieumau' })}
										onClick={() => {
											handleEdit(recordVal);
										}}
										type='link'
										icon={<EditOutlined />}
									/>

									<Popconfirm
										onConfirm={() => {
											if (recordVal) {
												deleteModel(recordVal._id!);
											}
										}}
										title={intl.formatMessage({ id: 'bieumaukhaibao.banchacchanmuonxoa' })}
										placement='topLeft'
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
							}
						>
							<ButtonExtend type='link' icon={<MenuOutlined />} />
						</Popover>
					</div>
				);
			},
		},
	];

	return (
		<>
			<TableBase
				title={intl.formatMessage({ id: 'bieumaukhaibao.bieumaukhaibao' })}
				columns={columns}
				dependencies={[page, limit]}
				modelName='danhmuc.bieumau'
				Form={FormThemMoiMauDon}
				widthDrawer={800}
				addStt={false}
				scroll={{ x: '100%' }}
				otherProps={{ tableLayout: 'fixed' }}
			/>

			<Modal
				zIndex={1000}
				styles={{ body: { padding: 0 } }}
				footer={
					<Button type='primary' onClick={onCancelPreview}>
						OK
					</Button>
				}
				width={900}
				open={visiblePreview}
				onCancel={onCancelPreview}
			>
				<FormGiaoNopSanPham mode='quytrinh' isView getData={() => {}} />
			</Modal>
		</>
	);
};

export default BieuMauKhaiBaoPage;

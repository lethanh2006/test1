import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { IColumn } from '@/components/Table/typing';
import FormCauHinh from '@/pages/DanhMuc/BieuMauKhaiBao/components/FormCauHinh';
import { BieuMau } from '@/services/DanhMuc/BieuMau/typing';
import { kiemTraPhanVung } from '@/utils/constants';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useIntl, useModel } from '@umijs/max';
import { Button, FormInstance, Modal, Popconfirm, Space } from 'antd';
import { useEffect, useState } from 'react';

interface IProps {
	form: FormInstance;
}

const TableCauHinh = ({ form }: IProps) => {
	const intl = useIntl();
	const { loading, setEditCauHinh, setRecordCauHinh, setVisiblePreview, setRecordLoaiHinh, record, setRecord } =
		useModel('danhmuc.bieumau');

	const [visibleCauHinh, setVisibleCauHinh] = useState<boolean>(false);

	const onCancelFormCauHinh = () => {
		setVisibleCauHinh(false);
	};

	const onSortEndCauHinh = (recordTemp: BieuMau.TruongThongTin, newIndex: number): void => {
		if (!record) return;
		const cauHinhLoaiHinh: BieuMau.TruongThongTin[] =
			record?.cauHinhLoaiHinh?.filter((item: BieuMau.TruongThongTin) => item.ma !== recordTemp.ma) ?? [];
		cauHinhLoaiHinh?.splice(newIndex, 0, recordTemp);
		setRecord({ ...record, cauHinhLoaiHinh });
	};

	const columns: IColumn<BieuMau.TruongThongTin>[] = [
		{
			title: intl.formatMessage({ id: 'bieumaukhaibao.ma' }),
			dataIndex: 'ma',
			align: 'center',
			width: 100,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'bieumaukhaibao.ten' }),
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'bieumaukhaibao.kieudulieu' }),
			align: 'center',
			dataIndex: 'kieuDuLieu',
			width: 100,
		},

		{
			title: intl.formatMessage({ id: 'bieumaukhaibao.thaotac' }),
			align: 'center',
			width: 80,
			fixed: 'right',
			render: (rec: BieuMau.TruongThongTin) => {
				const isPhanVung = kiemTraPhanVung(rec?.dataPartitionCode ?? null);

				return (
					<>
						<ButtonExtend
							disabled={!isPhanVung}
							tooltip={intl.formatMessage({ id: 'bieumaukhaibao.chinhsua' })}
							onClick={() => {
								setVisibleCauHinh(true);
								setRecordCauHinh(rec);
								setEditCauHinh(true);
							}}
							type='link'
							icon={<EditOutlined />}
						/>

						<Popconfirm
							onConfirm={() => {
								if (record) {
									setRecord({
										...record,
										cauHinhLoaiHinh: record?.cauHinhLoaiHinh?.filter((item: any) => item.ma !== rec.ma),
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

	useEffect(() => {
		if (!record) {
			setRecord({
				cauHinhLoaiHinh: [],
			} as unknown as BieuMau.IRecord);
		}
	}, []);

	return (
		<>
			<TableStaticData
				title={intl.formatMessage({ id: 'bieumaukhaibao.danhsachtruongthingtinlienquan' })}
				otherProps={{ pagination: false }}
				onSortEnd={onSortEndCauHinh}
				rowSortable
				size='small'
				columns={columns}
				data={record?.cauHinhLoaiHinh ?? []}
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
							setRecordCauHinh(undefined);
							setEditCauHinh(false);
							setVisibleCauHinh(true);
						}}
					>
						{intl.formatMessage({ id: 'bieumaukhaibao.them' })}
					</Button>
					<Button
						disabled={!record?.cauHinhLoaiHinh?.length}
						icon={<EyeOutlined />}
						size='small'
						onClick={() => {
							setRecordLoaiHinh(record as any);
							setVisiblePreview(true);
						}}
					>
						{intl.formatMessage({ id: 'bieumaukhaibao.xemtruoc' })}
					</Button>
				</Space>
			</TableStaticData>

			<Modal
				// zIndex={300}
				destroyOnHidden
				width={700}
				footer={null}
				styles={{ body: { padding: 0 } }}
				open={visibleCauHinh}
				onCancel={onCancelFormCauHinh}
			>
				<FormCauHinh onCancel={onCancelFormCauHinh} />
			</Modal>
		</>
	);
};

export default TableCauHinh;

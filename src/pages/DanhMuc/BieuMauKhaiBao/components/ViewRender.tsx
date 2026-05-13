import PreviewFile from '@/components/PreviewFile';
import TableStaticData from '@/components/Table/TableStaticData';
import { IColumn } from '@/components/Table/typing';
import FormTable from '@/pages/DanhMuc/BieuMauKhaiBao/components/FormTable';
import SelectNhanSuDebounce from '@/pages/DanhMuc/BieuMauKhaiBao/components/select/SelectNhanSuDebounce';
import SelectSinhVienDebounce from '@/pages/DanhMuc/BieuMauKhaiBao/components/select/SelectSinhVienDebounce';
import { EKieuDuLieu } from '@/services/DanhMuc/BieuMau/constant';
import { BieuMau } from '@/services/DanhMuc/BieuMau/typing';
import dayjs from '@/utils/dayjs';
import { useIntl } from '@umijs/max';
import { Collapse, Modal } from 'antd';
import { useState } from 'react';

interface IProps {
	cauHinh: BieuMau.TruongThongTin | BieuMau.Cot;
	recordSanPham?: any;
	isCot?: boolean;
}

const ViewRender = ({ cauHinh, recordSanPham, isCot }: IProps) => {
	const intl = useIntl();
	const [visibleFormTable, setVisibleFormTable] = useState<boolean>(false);
	const [editFormTable, setEditFormTable] = useState<boolean>(false);
	const [isView, setIsView] = useState<boolean>(false);
	const [recordTable, setRecordTable] = useState<any>({});

	const onCellTable = (record: any) => ({
		onClick: () => {
			setIsView(true);
			setEditFormTable(true);
			setRecordTable(record);
			setVisibleFormTable(true);
		},
		style: { cursor: 'pointer' },
	});

	let value = <div />;

	const recordSanPhamFinal = isCot ? recordSanPham : recordSanPham?.thongTinKhaiBao;
	const valueFinal = isCot
		? recordSanPhamFinal?.[cauHinh.ma]
		: (recordSanPhamFinal?.[cauHinh.ma]?.value?.value ?? recordSanPhamFinal?.[cauHinh.ma]?.value);

	const getTableRows = () => {
		const rawRows = isCot
			? (recordSanPhamFinal?.[cauHinh.ma] ??
				recordSanPham?.thongTinKhaiBao?.[cauHinh.ma]?.value ??
				recordSanPham?.thongTinKhaiBao?.[cauHinh.ma])
			: (recordSanPham?.thongTinKhaiBao?.[cauHinh.ma]?.value ?? recordSanPham?.thongTinKhaiBao?.[cauHinh.ma] ?? []);

		return Array.isArray(rawRows) ? rawRows : Array.isArray(rawRows?.data) ? rawRows.data : [];
	};

	switch (cauHinh.kieuDuLieu) {
		case EKieuDuLieu.TEXT:
			value = <div dangerouslySetInnerHTML={{ __html: valueFinal ?? '' }}></div>;
			break;

		case EKieuDuLieu.BOOLEAN:
			value = (
				<div>
					{valueFinal
						? intl.formatMessage({ id: 'bieumaukhaibao.co' })
						: intl.formatMessage({ id: 'bieumaukhaibao.khong' })}
				</div>
			);
			break;

		case EKieuDuLieu.DANHMUC:
			value = <div>{(value = cauHinh.laDangMang && valueFinal?.join ? valueFinal?.join(', ') : valueFinal)}</div>;

			break;
		case EKieuDuLieu.NUMBER:
			value = valueFinal ? (
				<div>{(value = cauHinh.laDangMang ? valueFinal?.map((item: number) => item)?.join(', ') : valueFinal)}</div>
			) : (
				<div />
			);

			break;
		case EKieuDuLieu.DECIMAL:
			value = valueFinal ? <div>{(value = cauHinh.laDangMang ? valueFinal?.join(', ') : valueFinal)}</div> : <div />;

			break;
		case EKieuDuLieu.CAN_BO:
			value = <SelectNhanSuDebounce value={valueFinal} isView />;
			break;
		case EKieuDuLieu.SINH_VIEN:
			value = <SelectSinhVienDebounce value={valueFinal} isView />;
			break;
		case EKieuDuLieu.HOUR:
			value = <div>{valueFinal ? dayjs(valueFinal).format('HH:mm DD/MM/YYYY') : ''}</div>;
			break;
		case EKieuDuLieu.DATE:
			value = <div>{valueFinal ? dayjs(valueFinal).format('DD/MM/YYYY') : ''}</div>;
			break;
		case EKieuDuLieu.MONTH:
			value = <div>{valueFinal ? dayjs(valueFinal).format('MM/YYYY') : ''}</div>;
			break;
		case EKieuDuLieu.FILE:
			value = valueFinal && (
				<Collapse
					style={{ marginTop: 8 }}
					items={[
						{
							key: '1',
							label: intl.formatMessage({ id: 'bieumaukhaibao.xemtaptin' }),
							children: (
								<div style={{ height: 600 }}>
									<PreviewFile file={valueFinal ?? []} />
								</div>
							),
						},
					]}
				/>
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
						width: 100,
						onCell: onCellTable,
						render: (val, rec) => {
							return <ViewRender cauHinh={item} recordSanPham={rec} isCot />;
						},
						// ...buildFilter(item, danhSach),
					});
				});

			value = (
				<>
					<TableStaticData
						otherProps={{ pagination: false }}
						addStt
						size='small'
						data={getTableRows()}
						columns={columns}
					/>
					<Modal
						destroyOnHidden
						width={700}
						footer={null}
						title={`${editFormTable ? intl.formatMessage({ id: 'bieumaukhaibao.chinhsua' }) : intl.formatMessage({ id: 'bieumaukhaibao.them' })} ${cauHinh.ten}`}
						open={visibleFormTable}
						onCancel={() => setVisibleFormTable(false)}
					>
						<FormTable
							isView={isView}
							record={recordTable}
							onCancel={() => setVisibleFormTable(false)}
							edit={editFormTable}
							cauHinh={cauHinh}
						/>
					</Modal>
				</>
			);

			break;

		// case EKieuDuLieu.DANHSACH:
		// 	const columnsDs: IColumn<any>[] = [];
		// 	danhSachLoaiHinh
		// 		?.find((value2) => value2?._id === cauHinh?.loaiHinhNckhId)
		// 		?.cauHinhLoaiHinh?.map((item) => {
		// 			columnsDs.push({
		// 				title: item.ten,
		// 				dataIndex: item.ma,
		// 				align: 'center',
		// 				width: 100,
		// 				render: (val, rec) => {
		// 					return <ViewRender cauHinh={item} recordSanPham={rec} isCot />;
		// 				},
		// 				...buildFilter(item, danhSach),
		// 			});
		// 		});
		//
		// 	value = (
		// 		<TableStaticData
		// 			otherProps={{ pagination: false }}
		// 			addStt
		// 			size='small'
		// 			data={recordSanPham?.thongTinKhaiBao?.[cauHinh.ma] ?? []}
		// 			columns={columnsDs}
		// 		/>
		// 	);
		//
		// 	break;

		default:
			break;
	}

	return value;
};

export default ViewRender;

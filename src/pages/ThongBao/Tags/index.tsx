import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import { ThongBao } from '@/services/ThongBao/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useModel } from 'umi';
import { kiemTraPhanVung } from '../../../utils/constants';
import FormTags from './components/Form';

const Tags = () => {
	const { page, limit, handleEdit, deleteModel } = useModel('thongbao.tags');
	const columns: IColumn<ThongBao.Tags>[] = [
		{
			title: 'Tên',
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
		},
		{
			title: 'Mô tả',
			dataIndex: 'moTa',
			width: 280,
			render: (val) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (recordVal: ThongBao.Tags) => {
				const isPhanVung = kiemTraPhanVung(recordVal?.dataPartitionCode ?? null);

				return (
					<>
						<ButtonExtend
							disabled={!isPhanVung}
							tooltip='Chỉnh sửa'
							onClick={() => {
								handleEdit(recordVal);
							}}
							shape='circle'
							type={'link'}
							icon={<EditOutlined />}
						/>

						<Popconfirm
							onConfirm={() => {
								deleteModel(recordVal?._id);
							}}
							title='Bạn có chắc chắn muốn xóa?'
						>
							<ButtonExtend
								disabled={!isPhanVung}
								tooltip='Xóa'
								shape='circle'
								type='link'
								danger
								icon={<DeleteOutlined />}
							/>
						</Popconfirm>
					</>
				);
			},
		},
	];
	return (
		<>
			<TableBase
				title={'Quản lý nhãn dán'}
				modelName={'thongbao.tags'}
				columns={columns}
				dependencies={[page, limit]}
				Form={FormTags}
				destroyModal
			/>
		</>
	);
};
export default Tags;

import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { IColumn } from '@/components/Table/typing';
import { useInstanceStepHelpers } from '@/hooks/useInstanceStepHelpers';
import { ExportInstanceSpecialistMe } from '@/services/Instance';
import dayjs from '@/utils/dayjs';
import { DownloadOutlined } from '@ant-design/icons';
import { history, useIntl, useModel } from '@umijs/max';
import fileDownload from 'js-file-download';
import { useCallback, useEffect } from 'react';

interface IProps {
	type: 'creator' | 'specialist';
}

const TableInstanceMe = (props: IProps) => {
	const { type } = props;
	const intl = useIntl();
	const { initialState } = useModel('@@initialState');
	const instanceMeModel = useModel('workflow.instanceMe');
	const { limit, page, setPage, getInstaceMe, getInstanceSpecialistMe, loading, setLoading } = instanceMeModel;
	const { getCurrentStepLabel, getAssigneesForCurrentStep } = useInstanceStepHelpers(instanceMeModel?.danhSach ?? []);

	useEffect(() => {
		setPage(1);
	}, [type]);

	const getData = useCallback(() => {
		if (type === 'creator') {
			return getInstaceMe({
				page,
				limit,
				otherQuery: { nguoiTaoSsoId: initialState?.currentUser?.ssoId, population: [{ path: 'workflow' }] },
			});
		} else {
			return getInstanceSpecialistMe({
				page,
				limit,
				otherQuery: { population: [{ path: 'workflow' }] },
			});
		}
	}, [page, limit, initialState?.currentUser?.ssoId, type]);

	const onCell = (record: Instance.IRecord) => ({
		onClick: () => history.push(`/instance/${record._id}`),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<Instance.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'instances.tt' }),
			dataIndex: 'index',
			width: 60,
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'instances.hotennguoitao' }),
			dataIndex: 'nguoiTaoHoTen',
			width: 200,
			render(value, record: any) {
				return <>{record?.data?._userInfo?.hoTen ?? '-'}</>;
			},
			onCell,
		},
		{
			title: 'Mô tả',
			dataIndex: 'moTa',
			width: 240,
			ellipsis: true,
			filterType: 'string',
			render(value) {
				return <>{value || '-'}</>;
			},
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'instances.workflowname' }),
			dataIndex: ['workflow', 'ten'],
			width: 200,
			filterType: 'string',
			onCell,
		},
		// {
		// 	title: intl.formatMessage({ id: 'instances.ngaytao' }),
		// 	dataIndex: 'createdAt',
		// 	width: 150,
		// 	render: (val) => val && dayjs(val).format('HH:mm DD/MM/YYYY'),
		// 	onCell,
		// },
		{
			title: intl.formatMessage({ id: 'instances.tenbuochientai' }),
			dataIndex: 'currentStep',
			width: 220,
			align: 'center',
			render(value, record) {
				return (
					<div
						style={{
							whiteSpace: 'normal',
							backgroundColor: '#f6ffed',
							border: '1px solid #b7eb8f',
							color: '#389e0d',
							borderRadius: '4px',
							padding: '2px 8px',
							display: 'inline-block',
							fontSize: '12px',
							textAlign: 'center',
						}}
					>
						{getCurrentStepLabel(record)}
					</div>
				);
			},
			onCell,
		},
		{
			title: 'Bộ phận xử lý',
			width: 220,
			ellipsis: true,
			render(value, record) {
				return <>{getAssigneesForCurrentStep(record)}</>;
			},
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'instances.capnhatgannhat' }),
			dataIndex: 'updatedAt',
			width: 150,
			render: (val) => val && dayjs(val).format('HH:mm DD/MM/YYYY'),
			onCell,
		},
		// {
		// 	title: intl.formatMessage({ id: 'instances.trangthai' }),
		// 	dataIndex: 'trangThai',
		// 	align: 'center',
		// 	width: 120,
		// 	render(value, record) {
		// 		return (
		// 			<Tag
		// 				color={MapTrangThaiInstanceTaskColor[record.trangThai as ETrangThaiInstanceTask] || 'default'}
		// 				bordered={false}
		// 			>
		// 				{intl.formatMessage({
		// 					id:
		// 						MapTrangThaiInstanceTask[record.trangThai as ETrangThaiInstanceTask] ||
		// 						'MapTrangThaiInstanceTask.UNKNOWN',
		// 					defaultMessage: record.trangThai,
		// 				})}
		// 			</Tag>
		// 		);
		// 	},
		// 	onCell,
		// },
	];

	const handleExport = () => {
		setLoading(true);
		ExportInstanceSpecialistMe().then((res) => {
			fileDownload(res.data, `${intl.formatMessage({ id: 'instances.danhsachinstancecuachuyenvien' })}.xlsx`);
			setLoading(false);
		});
	};

	return (
		<>
			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, type]}
				modelName='workflow.instanceMe'
				buttons={{
					create: false,
				}}
				otherButtons={[
					<ButtonExtend
						loading={loading}
						hidden={type !== 'specialist'}
						key='export'
						icon={<DownloadOutlined />}
						onClick={handleExport}
					>
						{intl.formatMessage({ id: 'instances.xuatdulieu' })}
					</ButtonExtend>,
				]}
				addStt={false}
			/>
		</>
	);
};

export default TableInstanceMe;

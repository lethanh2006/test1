import TableBase from '@/components/Table';
import { IColumn } from '@/components/Table/typing';
import { useInstanceStepHelpers } from '@/hooks/useInstanceStepHelpers';
import {
	ETrangThaiInstanceTask,
	MapTrangThaiInstanceTask,
	MapTrangThaiInstanceTaskColor,
} from '@/services/Instance/constance';
import dayjs from '@/utils/dayjs';
import { DeleteOutlined } from '@ant-design/icons';
import { history, useIntl, useModel } from '@umijs/max';
import { Button, Popconfirm, Tag, Tooltip } from 'antd';

const InstanceListPage = () => {
	const intl = useIntl();
	const instanceModel = useModel('workflow.instance');
	const { deleteModel, limit, page, getModel } = instanceModel;
	const { getCurrentStepLabel, getAssigneesForCurrentStep } = useInstanceStepHelpers(
		(instanceModel as any)?.danhSach ?? []
	);

	const getData = () => {
		return getModel(undefined, undefined, undefined, undefined, undefined, undefined, {
			population: [{ path: 'workflow' }],
		});
	};

	const onCell = (record: Instance.IRecord) => ({
		onClick: () => history.push(`/instance/${record._id}`),
		style: { cursor: 'pointer' },
	});

	const handleDelete = (record: Instance.IRecord) => {
		deleteModel(record._id!, getData);
	};

	const columns: IColumn<Instance.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'instances.tt' }),
			dataIndex: 'index',
			width: 60,
			align: 'center',
		},
		// {
		// 	title: intl.formatMessage({ id: 'instances.ngaytao' }),
		// 	dataIndex: 'createdAt',
		// 	width: 180,
		// 	render: (val) => val && dayjs(val).format('HH:mm DD/MM/YYYY'),
		// 	onCell,
		// },
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
			title: intl.formatMessage({ id: 'instances.workflowname' }),
			dataIndex: ['workflow', 'ten'],
			width: 200,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'instances.capnhatgannhat' }),
			dataIndex: 'updatedAt',
			width: 180,
			render: (val) => val && dayjs(val).format('HH:mm DD/MM/YYYY'),
			onCell,
		},
		// {
		// 	title: 'Tên bước hiện tại',
		// 	dataIndex: 'currentStep',
		// 	width: 200,
		// 	ellipsis: true,
		// 	align: 'center',
		// 	render(value, record: any) {
		// 		return <>{record?.currentStep ? record?.currentStep : '-'}</>;
		// 	},
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
			title: intl.formatMessage({ id: 'workflow.common.action' }),
			key: 'action',
			width: 100,
			align: 'center',
			fixed: 'right' as const,
			render: (_: any, record: Instance.IRecord) => (
				<div className='instance-list-action'>
					{/* <Tooltip title={'Xem chi tiết'}>
						<Button onClick={() => onEdit(record)} type='link' icon={<EyeOutlined />} />
					</Tooltip> */}
					<Tooltip title={intl.formatMessage({ id: 'workflow.common.delete' })}>
						<Popconfirm
							onConfirm={() => handleDelete(record)}
							title={intl.formatMessage({ id: 'workflow.list.deleteConfirm' })}
							placement='topLeft'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</div>
			),
		},
	];

	return (
		<>
			<TableBase
				title={intl.formatMessage({ id: 'instances.danhsachinstance' })}
				getData={getData}
				columns={columns}
				dependencies={[page, limit]}
				modelName='workflow.instance'
				buttons={{
					create: false,
				}}
				addStt={false}
			/>
		</>
	);
};

export default InstanceListPage;

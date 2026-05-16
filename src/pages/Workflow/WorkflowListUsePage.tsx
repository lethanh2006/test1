import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { IColumn } from '@/components/Table/typing';
import { Workflow } from '@/services/Workflow/typing';
import { PlusOutlined } from '@ant-design/icons';
import { history, useIntl, useModel } from '@umijs/max';
import { Popconfirm } from 'antd';

const WorkflowListUsePage = () => {
	const intl = useIntl();

	const { initialState } = useModel('@@initialState');
	const { page, limit } = useModel('workflow.workflow');
	const { startInstance } = useModel('workflow.instance');

	const onCreateInstance = async (workflowId: string) => {
		if (!initialState) return;

		const payload = {
			data: {
				_userInfo: {
					ssoId: initialState?.currentUser?.ssoId,
					hoTen: initialState.currentUser?.family_name
						? `${initialState.currentUser.family_name} ${initialState.currentUser?.given_name ?? ''}`
						: (initialState.currentUser?.name ?? (initialState.currentUser?.preferred_username || '')),
					email: initialState?.currentUser?.email,
					// donViId: initialState?.currentUser?.donViId,
					// maDonVi: initialState?.currentUser?.maDonVi,
				},
			},
		};

		const res = await startInstance(workflowId, payload);

		console.log(res);

		setTimeout(() => {
			history.push(`/instance/${res?._id}`);
		}, 800);
	};

	const columns: IColumn<Workflow.IRecordWorkflow>[] = [
		{
			title: 'TT',
			dataIndex: 'index',
			width: 60,
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'workflow.list.column.name' }),
			dataIndex: 'ten',
			ellipsis: true,
		},
		{
			title: intl.formatMessage({ id: 'workflow.list.column.description' }),
			dataIndex: 'moTa',
			ellipsis: true,
		},
		{
			title: intl.formatMessage({ id: 'workflow.common.action' }),
			align: 'center',
			key: 'action',
			width: 100,
			fixed: 'right' as const,
			render: (_: any, record: Workflow.IRecordWorkflow) => (
				<Popconfirm
					onConfirm={() => onCreateInstance(record._id!)}
					title={intl.formatMessage({ id: 'workflow.instance.create' })}
					placement='topRight'
				>
					<ButtonExtend type='link' icon={<PlusOutlined />} />
				</Popconfirm>
			),
		},
	];

	return (
		<>
			<TableBase
				title={intl.formatMessage({ id: 'workflow.table.title' })}
				columns={columns}
				buttons={{ create: false }}
				dependencies={[page, limit]}
				modelName='workflow.workflow'
				addStt={false}
			/>
		</>
	);
};

export default WorkflowListUsePage;

import { useModel } from 'umi';
import { TableBaseContent } from './components/TableBaseContent';
import { TableProvider } from './components/TableContext';
import './style.less';
import type { TableBaseProps, TFilter } from './typing';

const TableBase = (props: TableBaseProps) => {
	const model = useModel(props.modelName) as any;
	const filters: TFilter<any>[] = model?.filters;
	const getData = props.getData ?? model?.getModel;
	const hasFilter = props.columns?.filter((item) => item.filterType)?.length;
	const {
		visibleForm,
		setVisibleForm,
		setEdit,
		setRecord,
		setIsView,
		selectedIds,
		setSelectedIds,
		total,
		loading,
		isView,
		edit,
		deleteManyModel,
	} = model;

	const handleDeleteMany = () => {
		if (deleteManyModel && selectedIds?.length)
			deleteManyModel(selectedIds, () => getData(props.params))
				.then(() => setSelectedIds(undefined))
				.catch((er: any) => console.log(er));
	};

	const onCreate = () => {
		setRecord({});
		setEdit(false);
		setIsView(false);
		setVisibleForm(true);
	};

	const onReload = () => (props.onReload ? props.onReload(props.params) : getData(props.params));

	return (
		<TableProvider
			value={{
				selectedIds,
				setSelectedIds,
				loading,
				total,
				filters,
				hasFilter: !!hasFilter,
				handleDeleteMany,
				onCreate,
				onReload,
				buttons: props.buttons,
				otherButtons: props.otherButtons,
				rowSelection: props.rowSelection,
				deleteMany: props.deleteMany,
				hideTotal: props.hideTotal,
				size: props.otherProps?.size,
				visibleForm,
				setVisibleForm,
				isView,
				edit,
				Form: props.Form,
				title: props.title,
				widthDrawer: props.widthDrawer,
				maskCloseableForm: props.maskCloseableForm,
				destroyModal: props.destroyModal,
				formType: props.formType,
				modalTitle: props.modalTitle,
				showModalTitle: props.showModalTitle,
				formProps: props.formProps,
				modelName: props.modelName,
				modelImportName: props.modelImportName,
				modelExportName: props.modelExportName,
				params: props.params,
				getData,
				setFilters: model?.setFilters,
			}}
		>
			<TableBaseContent {...props} />
		</TableProvider>
	);
};

export default TableBase;

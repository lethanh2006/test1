import { MenuOutlined } from '@ant-design/icons';
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, ConfigProvider, Empty, Space, Table, type PaginationProps } from 'antd';
import type { FilterValue } from 'antd/lib/table/interface';
import _ from 'lodash';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import ModalExport from '../Export';
import ModalFilter from '../Filter/ModalFilter';
import { useTableColumns } from '../hooks/useTableColumns';
import ModalImport from '../Import';
import type { TableBaseProps, TFilter } from '../typing';
import { useTableContext } from './TableContext';
import { TableFormModal } from './TableFormModal';
import { TableHeader } from './TableHeader';

export const TableBaseContent = (props: TableBaseProps) => {
	const intl = useIntl();
	const { modelName, dependencies = [], params, rowSortable, title } = props;
	const model = useModel(modelName) as any;
	const { page, limit, setPage, setLimit, condition, sort, setSort, setFilters, initFilter } = model;
	const { danhSach: dsPhanVung } = useModel('core.phanvungdulieu');
	const filters: TFilter<any>[] = model?.filters;
	const getData = props.getData ?? model?.getModel;
	const {
		visibleImport,
		setVisibleImport,
		visibleExport,
		setVisibleExport,
		finalColumns,
		selectedIds,
		loading,
		total,
		buttons,
		hasFilter,
		setSelectedIds,
	} = useTableContext();

	const { handleFilter, handleSearch } = useTableColumns({
		columns: props.columns,
		sort,
		addStt: props.addStt,
		dsPhanVung,
	});

	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

	const tableData: any[] = model?.[props.dataState || 'danhSach']?.map((item: any, index: number) => ({
		...item,
		index: index + 1 + (page - 1) * limit * (props.pageable === false ? 0 : 1),
		key: item?._id ?? index,
		children:
			!props.hideChildrenRows && item?.children && Array.isArray(item.children) && item.children.length
				? item.children
				: undefined,
	}));

	useEffect(() => {
		setPage(1);
	}, [JSON.stringify(filters ?? [])]);

	useEffect(() => {
		getData(params);
	}, [...dependencies, filters, condition, sort]);

	useEffect(() => {
		return () => {
			if (props.noCleanUp !== true) {
				setFilters(initFilter);
				setSelectedIds(undefined);
			}
		};
	}, []);

	if (rowSortable)
		finalColumns.unshift({
			width: 30,
			align: 'center',
			render: () => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />,
		});

	const handleDragEnd = (event: any) => {
		const { active, over } = event;
		if (active && over && active.id !== over.id) {
			const oldIndex = tableData.findIndex((i) => i.key === active.id);
			const newIndex = tableData.findIndex((i) => i.key === over.id);
			if (props.onSortEnd) props.onSortEnd(tableData[oldIndex], newIndex);
		}
	};

	const SortableRow = (props: any) => {
		const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
			id: props['data-row-key'],
		});
		const style = {
			...props.style,
			transform: CSS.Transform.toString(transform),
			transition,
			cursor: 'grab',
			...(isDragging ? { background: '#fafafa' } : {}),
		};
		return <tr {...props} ref={setNodeRef} style={style} {...attributes} {...listeners} />;
	};

	const onChange = (pagination: PaginationProps, fil: Record<string, FilterValue | null>, sorter: any) => {
		const allColumns = finalColumns
			.map((col) => {
				if (col.children?.length) return [col, ...col.children];
				else return [col];
			})
			.flat();
		Object.entries(fil).map(([field, values]) => {
			// Field từ table => nếu dataIndex là Array => field1.subfield
			const dataIndex = field.includes('.') ? field.split('.') : field;
			const col = allColumns.find((item) => JSON.stringify(item.dataIndex) === JSON.stringify(dataIndex));
			if (col?.handleFilter) {
				col.handleFilter(values?.[0] as any);
				if (col?.filterType === 'string') {
					handleSearch(dataIndex, values?.[0] as any);
				} else if (col?.filterType === 'select') {
					handleFilter(dataIndex, values as any);
				}
			} else if (col?.filterType === 'select') {
				handleFilter(dataIndex, values as any);
			} else if (col?.filterType === 'string') {
				handleSearch(dataIndex, values?.[0] as any);
			} else if (col?.filterType === 'customselect') {
				handleFilter(dataIndex, values as any);
			}
		});

		const { order, field } = sorter;
		const orderValue = order === 'ascend' ? 1 : order === 'descend' ? -1 : undefined;
		if (sorter && setSort) setSort({ [Array.isArray(field) ? field.join('.') : field]: orderValue });

		const { current, pageSize } = pagination;
		setPage(current);
		setLimit(pageSize);
	};

	const renderTable = () => {
		return (
			<Table
				scroll={{ x: _.sum(finalColumns.map((item) => item.width ?? 80)), ...props.scroll }}
				rowSelection={
					props?.rowSelection
						? {
							type: 'checkbox',
							selectedRowKeys: selectedIds ?? [],
							preserveSelectedRowKeys: true,
							onChange: (selectedRowKeys) => setSelectedIds(selectedRowKeys as (string | number)[]),
							columnWidth: 40,
							...props.detailRow,
						}
						: undefined
				}
				loading={loading}
				bordered={props.border || true}
				pagination={{
					current: page,
					pageSize: limit,
					position: ['bottomRight'],
					total,
					showSizeChanger: true,
					pageSizeOptions: ['5', '10', '25', '50', '100'],
					showTotal: (tongSo: number) => (
						<Space>
							{props?.rowSelection ? (
								<>
									<span>
										{intl.formatMessage({ id: 'global.table.index.dachon' })}: {selectedIds?.length ?? 0}
									</span>
									{selectedIds && selectedIds.length > 0 ? (
										<span>
											(
											<a href='#!' onClick={() => setSelectedIds(undefined)}>
												{intl.formatMessage({ id: 'global.table.index.bochon' })}
											</a>
											)
										</span>
									) : null}
								</>
							) : null}
							<span>
								{intl.formatMessage({ id: 'global.table.index.tongso' })}: {tongSo}
							</span>
						</Space>
					),
				}}
				onChange={onChange}
				dataSource={tableData}
				columns={finalColumns as any[]}
				components={rowSortable ? { body: { row: SortableRow } } : undefined}
				{...props?.otherProps}
			/>
		);
	};

	const mainContent = (
		<div className='table-base'>
			{props.children}

			<TableHeader />

			<ConfigProvider
				renderEmpty={() => (
					<Empty
						style={{ marginTop: 32, marginBottom: 32 }}
						description={props.emptyText ?? intl.formatMessage({ id: 'global.table.index.empty' })}
						image={props.otherProps?.size === 'small' ? Empty.PRESENTED_IMAGE_SIMPLE : undefined}
					/>
				)}
			>
				{rowSortable ? (
					<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
						<SortableContext items={tableData.map((item) => item.key)} strategy={verticalListSortingStrategy}>
							{renderTable()}
						</SortableContext>
					</DndContext>
				) : (
					renderTable()
				)}
			</ConfigProvider>
		</div>
	);

	return (
		<>
			{props.hideCard ? (
				mainContent
			) : (
				<Card title={props.title || false} variant={props.border ? 'outlined' : 'borderless'} extra={props.cardExtra}>
					{mainContent}
				</Card>
			)}

			<TableFormModal />

			{buttons?.filter !== false && hasFilter ? <ModalFilter /> : null}

			{buttons?.import ? (
				<ModalImport
					visible={visibleImport}
					modelName={props.modelImportName ?? modelName}
					onCancel={() => setVisibleImport(false)}
					onOk={() => getData(params)}
					titleTemplate={title ? `Biểu mẫu ${title}.xlsx` : undefined}
					extendData={params}
				/>
			) : null}

			{buttons?.export ? (
				<ModalExport
					visible={visibleExport}
					modelName={props.modelExportName ?? modelName}
					onCancel={() => setVisibleExport(false)}
					fileName={`Danh sách ${title ?? 'dữ liệu'}.xlsx`}
					condition={params}
				/>
			) : null}
		</>
	);
};

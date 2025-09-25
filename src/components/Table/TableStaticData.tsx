import { MenuOutlined, PlusCircleOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AutoComplete, ConfigProvider, Drawer, Empty, Input, Table, Tooltip, type InputRef } from 'antd';
import classNames from 'classnames';
import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { useIntl } from 'umi';
import ButtonExtend from './ButtonExtend';
import { updateSearchStorage } from './function';
import ModalExpandable from './ModalExpandable';
import './style.less';
import type { IColumn, TableStaticProps, TDataOption } from './typing';

const TableStaticData = (props: TableStaticProps) => {
	const intl = useIntl();
	const { Form, showEdit, setShowEdit, addStt, data, children, hasCreate, hasTotal, rowSortable } = props;
	const [searchText, setSearchText] = useState<string>('');
	const [searchedColumn, setSearchedColumn] = useState();
	const [total, setTotal] = useState<number>();
	const searchInputRef = useRef<InputRef>(null);
	// dnd-kit: sensors
	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

	// State cho tableData để sortable
	const tableData = (props?.data ?? []).map((item, index) => ({
		...item,
		key: String(index),
		index: index + 1,
		children:
			!props.hideChildrenRows && item?.children && Array.isArray(item.children) && item.children.length
				? item.children
				: undefined,
	}));

	useEffect(() => {
		setTotal(data?.length);
		setSearchText('');
		setSearchedColumn(undefined);
	}, [data?.length]);

	const handleSearch = (confirm: any, dataIndex: any) => {
		confirm();
		setSearchedColumn(dataIndex);
	};

	const getColumnSearchProps = (dataIndex: any, columnTitle: any, render: any): Partial<IColumn<unknown>> => ({
		filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
			const searchOptions = (JSON.parse(localStorage.getItem('dataTimKiem') || '{}')[dataIndex] || []).map(
				(value: string) => ({ value, label: value }),
			);

			return (
				<div className='column-search-box' onKeyDown={(e) => e.stopPropagation()}>
					<AutoComplete
						options={searchOptions}
						onSelect={(value: string) => {
							setSelectedKeys([value]);
							handleSearch(confirm, dataIndex);
						}}
					>
						<Input.Search
							placeholder={`Tìm ${columnTitle}`}
							allowClear
							enterButton
							value={selectedKeys[0]}
							onChange={(e) => {
								if (e.type === 'click') {
									setSelectedKeys([]);
									confirm();
								} else {
									setSelectedKeys(e.target.value ? [e.target.value] : []);
								}
							}}
							onSearch={(value) => {
								if (value) updateSearchStorage(dataIndex, value);
								handleSearch(confirm, dataIndex);
							}}
							ref={searchInputRef}
						/>
					</AutoComplete>
				</div>
			);
		},
		filterIcon: (filtered: boolean) => <SearchOutlined className={filtered ? 'text-primary' : undefined} />,
		onFilter: (value: any, record: any) =>
			typeof dataIndex === 'string'
				? record[dataIndex]?.toString()?.toLowerCase()?.includes(value.toLowerCase())
				: typeof dataIndex === 'object'
					? record[dataIndex[0]][dataIndex?.[1]]?.toString()?.toLowerCase()?.includes(value.toLowerCase())
					: '',
		onFilterDropdownVisibleChange: (vis) => vis && setTimeout(() => searchInputRef?.current?.select(), 100),
		render: (text: any, record: any) =>
			render ? (
				render(text, record)
			) : searchedColumn === dataIndex ? (
				<Highlighter
					highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
					searchWords={[searchText]}
					autoEscape
					textToHighlight={text ? text.toString() : ''}
				/>
			) : (
				text
			),
	});

	const getFilterColumnProps = (dataIndex: any, filterData?: any[]): Partial<IColumn<unknown>> => {
		return {
			filters: filterData?.map((item: string | TDataOption) =>
				typeof item === 'string'
					? { key: item, value: item, text: item }
					: { key: item.value, value: item.value, text: item.label },
			),
			onFilter: (value: any, record: any) => record[dataIndex]?.indexOf(value) === 0,
			filterSearch: true,
		};
	};

	const columns = props.columns
		?.filter((item) => !item.hide)
		?.map((item) => ({
			...item,
			...(item?.filterType === 'string'
				? getColumnSearchProps(item.dataIndex, item.title, item.render)
				: item?.filterType === 'select'
					? getFilterColumnProps(item.dataIndex, item.filterData)
					: undefined),
			...(item?.sortable && {
				sorter: (a: any, b: any) => {
					const aValue = _.get(a, item?.dataIndex ?? '', undefined);
					const bValue = _.get(b, item?.dataIndex ?? '', undefined);
					return item.customSort ? item.customSort(aValue, bValue) : aValue > bValue ? 1 : -1;
				},
			}),
			// Xử lý các cột children tương tự cột chính
			children: item.children?.map((child) => ({
				...child,
				...(child?.filterType === 'string'
					? getColumnSearchProps(child.dataIndex, item.title, item.render)
					: child?.filterType === 'select'
						? getFilterColumnProps(child.dataIndex, child.filterData)
						: undefined),
				...(child?.sortable && {
					sorter: (a: any, b: any) =>
						child.customSort
							? child.customSort(a[child.dataIndex as string], b[child.dataIndex as string])
							: a[child.dataIndex as string] > b[child.dataIndex as string]
								? 1
								: -1,
				}),
			})),
		}));

	if (addStt)
		columns.unshift({
			title: 'TT',
			dataIndex: 'index',
			align: 'center',
			width: 40,
			children: undefined,
		});

	//#region Get Drag Sortable column
	if (rowSortable)
		columns.unshift({
			width: 30,
			align: 'center',
			children: undefined,
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

	// dnd-kit: SortableRow component
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
	//#endregion

	const renderTable = () => {
		return (
			<Table
				columns={columns as any[]}
				dataSource={tableData}
				rowKey='key'
				onChange={(pagination, filters, sorter, extra) => {
					setTotal(extra.currentDataSource.length ?? pagination.total);
				}}
				loading={props?.loading}
				size={props.size}
				scroll={{ x: _.sum(columns.map((item) => item.width ?? 80)) }}
				bordered
				components={rowSortable ? { body: { row: SortableRow } } : undefined}
				{...props?.otherProps}
			/>
		);
	};

	return (
		<div className='table-base'>
			<div className='header'>
				{children}
				<div className='action'>
					{hasCreate && (
						<ButtonExtend
							onClick={() => {
								if (setShowEdit) setShowEdit(true);
							}}
							icon={<PlusCircleOutlined />}
							type='primary'
							size={props?.size ?? 'middle'}
							tooltip={intl.formatMessage({ id: 'global.tablestatic.button.themmoi.tooltip' })}
						>
							{intl.formatMessage({ id: 'global.tablestatic.button.themmoi' })}
						</ButtonExtend>
					)}

					{props.otherButtons}
				</div>

				<div className='extra'>
					{!!props.onReload ? (
						<ButtonExtend
							size={props?.size}
							icon={<ReloadOutlined />}
							onClick={() => (props.onReload ? props.onReload() : null)}
							loading={props.loading}
							tooltip={intl.formatMessage({ id: 'global.tablestatic.button.xoa.tooltip' })}
						>
							{intl.formatMessage({ id: 'global.tablestatic.button.xoa' })}
						</ButtonExtend>
					) : null}

					{hasTotal ? (
						<Tooltip title={intl.formatMessage({ id: 'global.tablestatic.button.tongso.tooltip' })}>
							<div className={classNames({ total: true, small: props?.size === 'small' })}>
								{intl.formatMessage({ id: 'global.tablestatic.button.tongso' })}:
								<span>{total || props.data?.length || 0}</span>
							</div>
						</Tooltip>
					) : null}
				</div>
			</div>

			<ConfigProvider
				renderEmpty={() => (
					<Empty
						style={{ marginTop: 32, marginBottom: 32 }}
						description={props.emptyText ?? intl.formatMessage({ id: 'global.table.index.empty' })}
						image={
							props.otherProps?.size === 'small' || props.size === 'small' ? Empty.PRESENTED_IMAGE_SIMPLE : undefined
						}
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

			{Form && (
				<>
					{props?.formType === 'Drawer' ? (
						<Drawer
							width={props?.widthDrawer}
							onClose={() => {
								if (setShowEdit) setShowEdit(false);
							}}
							destroyOnClose
							footer={false}
							open={showEdit}
						>
							<Form
								onCancel={() => {
									if (setShowEdit) setShowEdit(false);
								}}
								{...props.formProps}
							/>
						</Drawer>
					) : (
						<ModalExpandable
							width={props?.widthDrawer}
							onCancel={() => {
								if (setShowEdit) setShowEdit(false);
							}}
							destroyOnClose
							footer={false}
							styles={{ body: { padding: 0 } }}
							open={showEdit}
						>
							<Form
								onCancel={() => {
									if (setShowEdit) setShowEdit(false);
								}}
								{...props.formProps}
							/>
						</ModalExpandable>
					)}
				</>
			)}
		</div>
	);
};

export default TableStaticData;

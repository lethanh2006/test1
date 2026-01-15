import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { AutoComplete, Button, Input, Space } from 'antd';
import type { SortOrder } from 'antd/lib/table/interface';
import _ from 'lodash';
import React, { JSX, useEffect } from 'react';
import { useIntl } from 'umi';
import { useTableContext } from '../components/TableContext';
import { EOperatorType } from '../constant';
import type { IColumn, TDataOption, TFilter } from '../typing';
import { updateSearchStorage } from '../utils';

interface UseTableColumnsProps {
	columns: IColumn<any>[];
	sort: any;
	addStt?: boolean;
	dsPhanVung?: any[];
}

export const useTableColumns = ({ columns, sort, addStt, dsPhanVung }: UseTableColumnsProps) => {
	const intl = useIntl();
	const { searchInputRef, filters, setFilters, setFinalColumns, buttons, hasFilter, setVisibleFilter, size } =
		useTableContext();

	/**
	 * Lấy quy tắc lọc hiện tại của cột
	 */
	const getFilterColumn = (fieldName: any, operator?: EOperatorType, active?: boolean) =>
		filters?.find(
			(item) =>
				JSON.stringify(item.field) === JSON.stringify(fieldName) &&
				(operator === undefined || item.operator === operator) &&
				(active === undefined || item.active === undefined || item.active === active),
		);

	//#region Lấy các thuộc tính sắp xếp của cột
	const getCondValue = (dataIndex: any) => {
		const type = typeof dataIndex;
		return _.get(sort, type === 'string' ? dataIndex : dataIndex?.join('.'), []);
	};

	const getSortValue = (dataIndex: any): SortOrder => {
		const value = getCondValue(dataIndex);
		return value === 1 ? 'ascend' : value === -1 ? 'descend' : null;
	};

	const getSort = (dataIndex: any): Partial<IColumn<unknown>> => ({
		sorter: true,
		sortDirections: ['ascend', 'descend'],
		sortOrder: getSortValue(dataIndex),
	});
	//#endregion

	//#region Lấy các thuộc tính tìm kiếm của cột
	const handleSearch = (dataIndex: any, value: string, confirm?: () => void) => {
		if (!value) {
			// Xóa bộ lọc của cột này
			const tempFilters = filters?.filter((item) => JSON.stringify(item.field) !== JSON.stringify(dataIndex));
			setFilters(tempFilters);
		} else {
			// Tìm column tương ứng để check có handleFilter không
			const column = columns.find(
				(col) => JSON.stringify(col.dataIndex) === JSON.stringify(dataIndex)
			);
			// Nếu column có handleFilter => đánh dấu readonly
			const readOnly = !!column?.handleFilter;

			const filter = getFilterColumn(dataIndex);
			let tempFilters: TFilter<any>[] = [...(filters ?? [])];
			if (filter)
				// Cập nhật bộ lọc hiện tại
				tempFilters = tempFilters.map((item) =>
					JSON.stringify(item.field) === JSON.stringify(dataIndex)
						? { ...item, active: true, operator: EOperatorType.CONTAIN, values: [value], readOnly }
						: item,
				);
			// Thêm quy tắc lọc mới cho cột này
			else
				tempFilters.push({
					active: true,
					field: dataIndex,
					operator: EOperatorType.CONTAIN,
					values: [value],
					readOnly,
				});
			setFilters(tempFilters);
		}
		if (confirm) confirm();
	};

	const getColumnSearchProps = (dataIndex: any, columnTitle: any): Partial<IColumn<unknown>> => {
		const filterColumn = getFilterColumn(dataIndex, EOperatorType.CONTAIN, true);
		return {
			filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
				const options = (JSON.parse(localStorage.getItem('dataTimKiem') || '{}')[dataIndex] || []).map(
					(value: string) => ({
						value,
						label: value,
					}),
				);

				return (
					<div className='column-search-box' onKeyDown={(e) => e.stopPropagation()}>
						<AutoComplete
							options={options}
							onSelect={(value: string) => {
								setSelectedKeys([value]);
								handleSearch(dataIndex, value, confirm);
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
									handleSearch(dataIndex, value, confirm);
								}}
								ref={searchInputRef}
							/>
						</AutoComplete>
						{buttons?.filter !== false && hasFilter ? (
							<div>
								{intl.formatMessage({ id: 'global.table.filterdropdown.xemthem' })}{' '}
								<a
									onClick={() => {
										setVisibleFilter(true);
										confirm();
									}}
								>
									{intl.formatMessage({ id: 'global.table.filterdropdown.boloc' })}
								</a>
							</div>
						) : null}
					</div>
				);
			},
			filteredValue: filterColumn?.values ?? [],
			filterIcon: () => {
				const values = getFilterColumn(dataIndex, undefined, true)?.values;
				const filtered = values && values[0];
				return <SearchOutlined className={filtered ? 'text-primary' : undefined} />;
			},
			filterDropdownProps: {
				onOpenChange: (vis) => vis && setTimeout(() => searchInputRef?.current?.select(), 100),
			},
		};
	};
	//#endregion

	//#region Lấy các thuộc tính lọc của cột
	const handleFilter = (dataIndex: any, values: string[]) => {
		if (!values || !values.length) {
			// Xóa bộ lọc của cột này
			const tempFilters = filters?.filter((item) => JSON.stringify(item.field) !== JSON.stringify(dataIndex));
			setFilters(tempFilters);
		} else {
			// Tìm column tương ứng để check có handleFilter không
			const column = columns.find(
				(col) => JSON.stringify(col.dataIndex) === JSON.stringify(dataIndex)
			);
			// Nếu column có handleFilter => đánh dấu readonly
			const readOnly = !!column?.handleFilter;

			const filter = getFilterColumn(dataIndex);
			let tempFilters: TFilter<any>[] = [...(filters ?? [])];
			if (filter)
				// Cập nhật bộ lọc hiện tại
				tempFilters = tempFilters.map((item) =>
					JSON.stringify(item.field) === JSON.stringify(dataIndex)
						? { ...item, active: true, operator: EOperatorType.INCLUDE, values, readOnly }
						: item,
				);
			// Thêm quy tắc lọc mới cho cột này
			else
				tempFilters.push({
					active: true,
					field: dataIndex,
					operator: EOperatorType.INCLUDE,
					values,
					readOnly,
				});
			setFilters(tempFilters);
		}
	};

	const getFilterColumnProps = (dataIndex: any, filterData?: any[]): Partial<IColumn<unknown>> => {
		const filterColumn = getFilterColumn(dataIndex, EOperatorType.INCLUDE, true);
		return {
			filters: filterData?.map((item: string | TDataOption) =>
				typeof item === 'string'
					? { key: item, value: item, text: item }
					: { key: item.value, value: item.value, text: item.label },
			),
			filteredValue: filterColumn?.values ?? [],
			filterSearch: true,
		};
	};
	//#endregion

	const getColumnSelectProps = (dataIndex: any, filterCustomSelect?: JSX.Element): Partial<IColumn<unknown>> => {
		if (!filterCustomSelect) return {};
		const filterColumn = getFilterColumn(dataIndex, EOperatorType.INCLUDE, true);
		return {
			filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
				<div className='column-search-box' onKeyDown={(e) => e.stopPropagation()}>
					<Space size={0}>
						<div style={{ width: 300 }}>
							{React.cloneElement(filterCustomSelect, {
								value: selectedKeys,
								onChange: (value: any) => setSelectedKeys(Array.isArray(value) ? value : [value]),
								style: { width: '100%' },
							})}
						</div>
						<Button
							type='primary'
							icon={<FilterOutlined />}
							onClick={() => {
								handleFilter(dataIndex, selectedKeys as string[]);
								confirm();
							}}
						/>
					</Space>
					{buttons?.filter !== false && hasFilter ? (
						<div>
							{intl.formatMessage({ id: 'global.table.filterdropdown.xemthem' })}{' '}
							<a
								onClick={() => {
									setVisibleFilter(true);
									confirm();
								}}
							>
								{intl.formatMessage({ id: 'global.table.filterdropdown.boloc' })}
							</a>
						</div>
					) : null}
				</div>
			),
			filteredValue: filterColumn?.values ?? [],
		};
	};

	//#region Lấy các cột của bảng
	const getColumns = () => {
		let final: IColumn<any>[] = columns.map((item) => ({
			...item,
			...(item.sortable && getSort(item.dataIndex)),
			...(item.filterType === 'string'
				? getColumnSearchProps(item.dataIndex, item.title)
				: item.filterType === 'select'
					? getFilterColumnProps(item.dataIndex, item.filterData)
					: item.filterType === 'customselect'
						? getColumnSelectProps(item.dataIndex, item.filterCustomSelect)
						: undefined),
			children: item.children?.map((child) => ({
				...child,
				...(child.sortable && getSort(child.dataIndex)),
				...(child.filterType === 'string'
					? getColumnSearchProps(child.dataIndex, child.title)
					: child.filterType === 'select'
						? getFilterColumnProps(child.dataIndex, child.filterData)
						: child.filterType === 'customselect'
							? getColumnSelectProps(child.dataIndex, child.filterCustomSelect)
							: undefined),
			})),
		}));

		final = final?.filter((item) => item?.hide !== true);
		if (addStt !== false)
			final.unshift({
				title: intl.formatMessage({ id: 'global.table.column.tt' }),
				dataIndex: 'index',
				// align: 'center',
				width: 60,
				render: (val, rec) => {
					const phanVungHienTai = dsPhanVung?.find((item) => item?.ma === rec?.dataPartitionCode);
					const maMau = phanVungHienTai?.maMau ?? 'var(--color-primary)';

					return (
						<div className='ttCellWrapper'>
							<span>{val}</span>

							{phanVungHienTai?._id && (
								<div
									className='cornerTriangle'
									style={{ backgroundColor: maMau, top: size === 'small' ? -4 : -8 }}
									title={phanVungHienTai?.name}
								/>
							)}
						</div>
					);
				},
			});

		setFinalColumns(final);
	};

	useEffect(() => {
		getColumns();
	}, [JSON.stringify(filters), sort, ...columns]);

	return { getColumns, handleFilter, handleSearch };
};

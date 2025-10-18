import type { IColumn } from './typing';

export const findFiltersInColumns = (columns: IColumn<unknown>[], filters?: any[]): any[] => {
	if (!filters?.length) return [];


	return filters.map((filter): any => {

		if (filter.filtes && Array.isArray(filter.filtes)) {
			return {

				filters: findFiltersInColumns(columns, filter.filtes),

				logicOperator: filter.operator,
				active: true,
			};
		}


		const field = JSON.stringify(filter.field);
		const column = columns.find((col) => JSON.stringify(col.dataIndex) === field);


		if (column) {
			return {
				field: filter.field,
				operator: filter.operator,
				values: filter.values || [],
				active: true,
			};
		}

		return null;
	}).filter(Boolean);
};


export const updateSearchStorage = (dataIndex: string, value: string) => {
	const savedSearchValues = JSON.parse(localStorage.getItem('dataTimKiem') || '{}');
	const currentSearchValues = savedSearchValues[dataIndex] || [];


	const newValues = [value, ...currentSearchValues];
	const uniqueValues = [...new Set(newValues)].slice(0, 10);

	savedSearchValues[dataIndex] = uniqueValues;
	localStorage.setItem('dataTimKiem', JSON.stringify(savedSearchValues));
};

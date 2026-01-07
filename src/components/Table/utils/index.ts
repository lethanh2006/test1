import { type IColumn, type TFilter } from '../typing';

/**
 * Chuẩn hóa dữ liệu bộ lọc từ form trước khi gửi lên table context hoặc backend.
 * Hàm này xử lý đệ quy các nhóm bộ lọc, làm phẳng các nhóm AND và giữ lại các bộ lọc đang hoạt động.
 *
 * @param filters Mảng các bộ lọc hoặc nhóm bộ lọc
 * @returns Mảng các bộ lọc đã được chuẩn hóa
 */
export const normalizeFilters = (filters: any[]): TFilter<any>[] => {
	if (!filters || !Array.isArray(filters)) return [];

	const result: TFilter<any>[] = [];

	filters.forEach((f) => {
		if (!f || f.active === false) return;

		// Nếu là một nhóm (có operator hoặc mảng filters con)
		const logicOp = f.operator;
		if (logicOp === 'and' || logicOp === 'or' || (f.filters && Array.isArray(f.filters))) {
			const normalizedSubFilters = normalizeFilters(f.filters || []);
			if (normalizedSubFilters.length === 0) return;

			// Giữ nguyên cấu trúc nhóm (AND hoặc OR) để bảo toàn giao diện người dùng
			result.push({
				operator: logicOp || 'and',
				filters: normalizedSubFilters,
				active: true,
			});
			return;
		}

		// Nếu là một bộ lọc lá (có trường field)
		if (f.field) {
			result.push({
				field: f.field,
				operator: f.operator,
				values: Array.isArray(f.values) ? f.values : f.values !== undefined ? [f.values] : [],
				active: true,
				readOnly: f.readOnly,
			});
		}
	});

	return result;
};

export const findFiltersInColumns = (columns: IColumn<unknown>[], filters?: any[]): any[] => {
	if (!filters?.length) return [];

	return filters
		.map((filter): any => {
			// Check for group filter - support both 'filters' and 'filtes' (typo) for backward compatibility
			const filterArray = filter.filters || filter.filtes;
			if (filterArray && Array.isArray(filterArray)) {
				return {
					filters: findFiltersInColumns(columns, filterArray),
					logicOperator: filter.operator || filter.logicOperator || 'and',
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
		})
		.filter(Boolean);
};

export const updateSearchStorage = (dataIndex: string, value: string) => {
	const savedSearchValues = JSON.parse(localStorage.getItem('dataTimKiem') || '{}');
	const currentSearchValues = savedSearchValues[dataIndex] || [];

	const newValues = [value, ...currentSearchValues];
	const uniqueValues = [...new Set(newValues)].slice(0, 10);

	savedSearchValues[dataIndex] = uniqueValues;
	localStorage.setItem('dataTimKiem', JSON.stringify(savedSearchValues));
};

import { Form } from 'antd';
import { useMemo } from 'react';
import { type IColumn } from '../typing';

export const useFilterFields = (columns: IColumn<any>[], form: ReturnType<typeof Form.useForm>[0]) => {
	const filters = Form.useWatch('filters', form) || [];

	const fieldsFiltered = useMemo(() => {
		const fields: string[] = [];

		const extractFields = (filterList: any[]) => {
			if (!filterList || !Array.isArray(filterList)) return;
			filterList.forEach((filter) => {
				if (filter?.field) {
					fields.push(JSON.stringify(filter.field));
				}
				if (filter?.filters) {
					extractFields(filter.filters);
				}
			});
		};

		extractFields(filters);
		return fields;
	}, [filters]);

	const fieldsFilterable = useMemo(
		() =>
			columns
				.filter((item) => item.filterType && item.dataIndex && !fieldsFiltered.includes(JSON.stringify(item.dataIndex)))
				.map((item) => JSON.stringify(item.dataIndex)),
		[columns, fieldsFiltered],
	);

	return { fieldsFiltered, fieldsFilterable };
};

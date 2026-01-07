import { Form } from 'antd';
import { type RowFilterProps } from '../typing';
import FilterGroup from './FilterGroup';
import FilterItem from './FilterItem';

const RowFilter = (props: RowFilterProps) => {
	const { name, formOwner, parentPath } = props;

	const namePath = Array.isArray(name) ? name : [name];
	const fullPath = parentPath ? [...parentPath, ...namePath] : ['filters', ...namePath];
	const currentFilter = Form.useWatch(fullPath, formOwner) ?? {};

	const isGroup =
		currentFilter.operator === 'and' ||
		currentFilter.operator === 'or' ||
		currentFilter.logicOperator !== undefined ||
		(Array.isArray(currentFilter.filters) && currentFilter.filters.length > 0);

	if (isGroup) {
		return <FilterGroup {...props} />;
	}

	return <FilterItem {...props} />;
};

export default RowFilter;

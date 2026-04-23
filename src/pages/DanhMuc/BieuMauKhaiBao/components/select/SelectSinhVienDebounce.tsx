import { EOperatorType } from '@/components/Table/constant';

import { useIntl, useModel } from '@umijs/max';
import { Empty, Select, Spin } from 'antd';
import { type BaseOptionType } from 'antd/lib/select';
import _ from 'lodash';
import { useEffect } from 'react';

const SelectSinhVienDebounce = (props: {
	value?: string | string[];
	onChange?: (val: string | string[] | null, option?: BaseOptionType) => void;
	multiple?: boolean;
	disabled?: boolean;
	keyValue?: keyof SinhVien.IRecord;
	hideMaSinhVien?: boolean;
	ignoreOptions?: string[];
	isView?: boolean;
}): any => {
	const intl = useIntl();
	const { value, onChange, multiple, disabled, keyValue = 'ssoId', hideMaSinhVien, ignoreOptions } = props;
	const { danhSach, getModel, setFilters, filters, loading } = useModel('tochucnhansu.sinhvien');

	useEffect(() => {
		getModel(
			undefined,
			(!filters || !filters.length) && value
				? [
						{
							active: true,
							field: 'ssoId',
							values: Array.isArray(value) ? value : [value],
							operator: EOperatorType.INCLUDE,
						},
					]
				: undefined,
			undefined,
			1,
			20,
		);
	}, [filters, value]);

	const searchDebounceSinhVien = _.debounce((val) => {
		setFilters([{ active: true, field: 'ten', values: [val], operator: EOperatorType.CONTAIN }]);
	}, 800);

	const dataView = danhSach.find((item) => item.ssoId === value);

	return props.isView ? (
		`${dataView?.ten ?? ''} - ${dataView?.ma ?? ''}`
	) : (
		<Select
			mode={multiple ? 'multiple' : undefined}
			value={value}
			onChange={onChange}
			disabled={disabled}
			onSearch={(val) => searchDebounceSinhVien(val)}
			notFoundContent={
				loading ? (
					<Spin
						spinning={true}
						tip={intl.formatMessage({ id: 'bieumaukhaibao.dangtimkiem' })}
						style={{ width: '100%', margin: 10 }}
					/>
				) : (
					<Empty
						image={Empty.PRESENTED_IMAGE_SIMPLE}
						description={intl.formatMessage({ id: 'bieumaukhaibao.khongcodulieu' })}
					/>
				)
			}
			options={danhSach.map((item) => ({
				key: item?.[keyValue],
				value: item?.[keyValue],
				label: hideMaSinhVien ? item.ten : `${item.ten} - ${item.ma}`,
				rawData: item,
				disabled: !!ignoreOptions?.find((optionValue) => optionValue === item?.[keyValue]),
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={intl.formatMessage({ id: 'bieumaukhaibao.chonsinhvien' })}
		/>
	);
};

export default SelectSinhVienDebounce;

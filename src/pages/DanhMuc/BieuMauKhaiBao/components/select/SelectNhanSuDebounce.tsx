import { EOperatorType } from '@/components/Table/constant';
import { ThongTinNhanSu } from '@/services/ToChucNhanSu/ThongTinNhanSu/typing';
import { useIntl, useModel } from '@umijs/max';
import { Empty, Select, Spin } from 'antd';
import { type BaseOptionType } from 'antd/lib/select';
import _ from 'lodash';
import { useEffect, useState } from 'react';

const SelectNhanSuDebounce = (props: {
	value?: string | string[];
	onChange?: (val: string | string[] | null, option?: BaseOptionType | BaseOptionType[]) => void;
	multiple?: boolean;
	disabled?: boolean;
	style?: React.CSSProperties;
	placeholder?: string;
	isView?: boolean;
}) => {
	const intl = useIntl();
	const { value, onChange, multiple, disabled, style, placeholder, isView } = props;
	const { getModel, loading } = useModel('tochucnhansu.thongtinnhansu');
	const [options, setOptions] = useState<ThongTinNhanSu.IRecord[]>([]);

	const fetchNhanSu = async (keyword?: string, currentVal?: string | string[]) => {
		const filters: any[] = [];
		if (keyword) {
			filters.push({
				active: true,
				field: 'hoTen',
				values: [keyword],
				operator: EOperatorType.CONTAIN,
			});
		}

		// Initial load with value
		if (!keyword && currentVal) {
			const values = Array.isArray(currentVal) ? currentVal : [currentVal];
			if (values.length > 0) {
				filters.push({
					active: true,
					field: 'maCanBo', // Or ssoId depending on what value is
					values: values,
					operator: EOperatorType.INCLUDE,
				});
			}
		}

		const res = await getModel(
			undefined,
			filters.length > 0 ? filters : undefined,
			undefined,
			1,
			20,
			undefined,
			undefined,
			false,
		);
		setOptions(res);
	};

	useEffect(() => {
		if (value) {
			fetchNhanSu(undefined, value);
		} else {
			fetchNhanSu();
		}
	}, []); // dependencies empty to run once, or depends on value if we want to refetch when value changes externally (but be careful of loops)

	const searchDebounce = _.debounce((val) => {
		fetchNhanSu(val);
	}, 800);

	const dataView = options.find((item) => item.ssoId === value);

	return isView ? (
		<>
			{dataView?.hoDem ?? ''} ${dataView?.ten ?? ''} - ${dataView?.maCanBo ?? ''}
		</>
	) : (
		<Select
			mode={multiple ? 'multiple' : undefined}
			value={value}
			onChange={onChange}
			disabled={disabled}
			style={{ width: '100%', ...style }}
			showSearch
			onSearch={searchDebounce}
			filterOption={false} // Server side search
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
			options={options.map((item) => ({
				key: item.maCanBo,
				value: item.maCanBo,
				label: `${item.hoTen ?? ''} ${item.maCanBo ? `(${item.maCanBo})` : ''}`,
				rawData: item,
			}))}
			placeholder={placeholder || intl.formatMessage({ id: 'bieumaukhaibao.timkiemnhansutheoten' })}
		/>
	);
};

export default SelectNhanSuDebounce;

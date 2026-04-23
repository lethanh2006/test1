import { EOperatorType } from '@/components/Table/constant';
import { BieuMau } from '@/services/DanhMuc/BieuMau/typing';
import { useIntl, useModel } from '@umijs/max';
import { Select, SelectProps, Spin } from 'antd';
import { debounce } from 'lodash';
import { useEffect, useMemo, useState } from 'react';

interface SelectFormDongProps extends SelectProps {}

const LIMIT_SELECT = 20;

const SelectFormDong = (props: SelectFormDongProps) => {
	const intl = useIntl();
	const { getModel } = useModel('danhmuc.bieumau');

	const [options, setOptions] = useState<(BieuMau.IRecord & { label: string; value: string })[]>([]);
	const [hasMore, setHasMore] = useState(true);
	const [searchKey, setSearchKey] = useState('');
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);

	const fetchDanhSachFormDong = async (searchName: string, currentPage: number) => {
		if (loading) return;
		setLoading(true);

		try {
			const filters: any = searchName
				? [{ field: 'ten' as keyof BieuMau.IRecord, operator: EOperatorType.CONTAIN, values: [searchName] }]
				: undefined;

			const res: BieuMau.IRecord[] = await getModel(
				undefined,
				filters,
				undefined,
				currentPage,
				LIMIT_SELECT,
				undefined,
				undefined,
				false,
			);

			const newMapped = res.map((item) => ({
				...item,
				label: `${item.ten ?? ''}`,
				// value: item.ma ?? '',
				value: item._id ?? '',
			}));

			setHasMore(newMapped.length >= LIMIT_SELECT);

			setOptions((prev) => (currentPage === 1 ? newMapped : [...prev, ...newMapped]));
		} catch (error) {
			setHasMore(false);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchDanhSachFormDong('', 1);
	}, []);

	const debounceFetcher = useMemo(() => {
		return debounce((val: string) => {
			setSearchKey(val);
			setPage(1);
			fetchDanhSachFormDong(val, 1);
		}, 1000);
	}, []);

	const handleLoadMore = () => {
		if (loading || !hasMore) return;
		const nextPage = page + 1;
		setPage(nextPage);
		fetchDanhSachFormDong(searchKey, nextPage);
	};

	const handleChange = (val: string | undefined, option: any) => {
		props.onChange?.(val, option);
	};

	const handlePopupScroll = (e: any) => {
		const { target } = e;
		if (target.scrollTop + target.offsetHeight >= target.scrollHeight - 10) {
			handleLoadMore();
		}
	};

	return (
		<Select
			placeholder={intl.formatMessage({ id: 'bieumaukhaibao.chonbieumau' })}
			showSearch
			optionFilterProp='label'
			{...props}
			value={props?.value}
			onChange={handleChange}
			filterOption={false}
			onSearch={debounceFetcher}
			onPopupScroll={handlePopupScroll}
			virtual={false}
			options={options}
			dropdownRender={(menu) => (
				<>
					{menu}
					{loading && (
						<div style={{ textAlign: 'center', padding: '8px', borderTop: '1px solid #f0f0f0' }}>
							<Spin size='small' tip={intl.formatMessage({ id: 'workflow.common.loadingMore' })} />
						</div>
					)}
				</>
			)}
		/>
	);
};

export default SelectFormDong;

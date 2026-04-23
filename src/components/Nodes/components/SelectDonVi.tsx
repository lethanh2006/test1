import { EOperatorType } from '@/components/Table/constant';
import { useIntl, useModel } from '@umijs/max';
import { Select, SelectProps, Spin } from 'antd';
import { debounce } from 'lodash';
import { useEffect, useMemo, useState } from 'react';

interface SelectDonViProps extends SelectProps {
	onSelectDonVi?: (donVi: { maDonVi: string; ten: string; donViId?: string }) => void;
}

const LIMIT_SELECT = 20;

export const SelectDonVi = ({ onSelectDonVi, ...props }: SelectDonViProps) => {
	const intl = useIntl();
	const { getModel } = useModel('tochucnhansu.donvi');

	const [options, setOptions] = useState<{ label: string; value: string; ten: string; maDonVi: string }[]>([]);
	const [hasMore, setHasMore] = useState(true);
	const [searchKey, setSearchKey] = useState('');
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);

	const fetchDanhsachDonvi = async (searchName: string, currentPage: number) => {
		if (loading) return;
		setLoading(true);
		try {
			const filters: any = searchName
				? [{ field: 'ten' as keyof DonVi.IRecord, operator: EOperatorType.CONTAIN, values: [searchName] }]
				: undefined;

			const res: DonVi.IRecord[] = await getModel(
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
				label: `${item.ten} (${item.maDonVi})`,
				value: item.maDonVi,
				ten: item.ten,
				maDonVi: item.maDonVi,
				donViId: item._id,
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
		fetchDanhsachDonvi('', 1);
	}, []);

	const debounceFetcher = useMemo(() => {
		return debounce((val: string) => {
			setSearchKey(val);
			setPage(1);
			fetchDanhsachDonvi(val, 1);
		}, 1000);
	}, []);

	const handleLoadMore = () => {
		if (loading || !hasMore) return;
		const nextPage = page + 1;
		setPage(nextPage);
		fetchDanhsachDonvi(searchKey, nextPage);
	};

	const handleChange = (val: string, option: any) => {
		props.onChange?.(val, option);
		if (onSelectDonVi && option) {
			onSelectDonVi({
				maDonVi: option.maDonVi,
				ten: option.ten,
				donViId: option.donViId,
			});
		}
	};

	const handlePopupScroll = (e: any) => {
		const { target } = e;
		if (target.scrollTop + target.offsetHeight >= target.scrollHeight - 10) {
			handleLoadMore();
		}
	};

	return (
		<Select
			placeholder={intl.formatMessage({ id: 'nodes.chondonvi' })}
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
							<Spin size='small' tip={intl.formatMessage({ id: 'nodes.dangtailthem' })} />
						</div>
					)}
				</>
			)}
		/>
	);
};

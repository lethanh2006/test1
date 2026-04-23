import { EOperatorType } from '@/components/Table/constant';
import { ThongTinNhanSu } from '@/services/ToChucNhanSu/ThongTinNhanSu/typing';
import { useIntl, useModel } from '@umijs/max';
import { Select, SelectProps, Spin } from 'antd';
import { debounce } from 'lodash';
import { useEffect, useMemo, useState } from 'react';

interface SelectCanBoProps extends SelectProps {
	onSelectCanBo?: (nv: ThongTinNhanSu.IRecord) => void;
}

const LIMIT_SELECT = 20;

export const SelectCanBo = ({ onSelectCanBo, ...props }: SelectCanBoProps) => {
	const intl = useIntl();
	const { getModel } = useModel('tochucnhansu.thongtinnhansu');

	const [options, setOptions] = useState<(ThongTinNhanSu.IRecord & { label: string; value: string })[]>([]);
	const [hasMore, setHasMore] = useState(true);
	const [searchKey, setSearchKey] = useState('');
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);

	const fetchDanhsachCanbo = async (searchName: string, currentPage: number) => {
		if (loading) return;
		setLoading(true);
		try {
			const filters: any = searchName
				? [{ field: 'ten' as keyof ThongTinNhanSu.IRecord, operator: EOperatorType.CONTAIN, values: [searchName] }]
				: undefined;

			const res: ThongTinNhanSu.IRecord[] = await getModel(
				undefined,
				// { trangThaiChinhSua: 'Duyệt - đang áp dụng', trangThai: 'Đang làm việc' },
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
				label: `${item.hoTen ?? ''} (${item.maCanBo ?? ''})`,
				value: item.maCanBo ?? '',
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
		fetchDanhsachCanbo('', 1);
	}, []);

	const debounceFetcher = useMemo(() => {
		return debounce((val: string) => {
			setSearchKey(val);
			setPage(1);
			fetchDanhsachCanbo(val, 1);
		}, 1000);
	}, []);

	const handleLoadMore = () => {
		if (loading || !hasMore) return;
		const nextPage = page + 1;
		setPage(nextPage);
		fetchDanhsachCanbo(searchKey, nextPage);
	};

	const handleChange = (val: string, option: any) => {
		props.onChange?.(val, option);
		onSelectCanBo?.(option);
	};

	const handlePopupScroll = (e: any) => {
		const { target } = e;
		if (target.scrollTop + target.offsetHeight >= target.scrollHeight - 10) {
			handleLoadMore();
		}
	};

	return (
		<Select
			placeholder={intl.formatMessage({ id: 'nodes.timkiemthanhvien' })}
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

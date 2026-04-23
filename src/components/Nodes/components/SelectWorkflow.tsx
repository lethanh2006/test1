import { EOperatorType } from '@/components/Table/constant';
import { useIntl, useModel } from '@umijs/max';
import { Select, SelectProps, Spin } from 'antd';
import { debounce } from 'lodash';
import { useEffect, useMemo, useState } from 'react';

interface SelectWorkflowProps extends SelectProps {}

const LIMIT_SELECT = 20;

const SelectWorkflow = (props: SelectWorkflowProps) => {
	const intl = useIntl();
	const { getModel } = useModel('workflow.workflow');

	const [options, setOptions] = useState<any[]>([]);
	const [hasMore, setHasMore] = useState(true);
	const [searchKey, setSearchKey] = useState('');
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);

	const fetchDanhSachWorkflow = async (searchName: string, currentPage: number) => {
		if (loading) return;
		setLoading(true);

		try {
			const filters: any = searchName
				? [{ field: 'ten', operator: EOperatorType.CONTAIN, values: [searchName] }]
				: undefined;

			const res: any[] = await getModel(
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
		fetchDanhSachWorkflow('', 1);
	}, []);

	const debounceFetcher = useMemo(() => {
		return debounce((val: string) => {
			setSearchKey(val);
			setPage(1);
			fetchDanhSachWorkflow(val, 1);
		}, 1000);
	}, []);

	const handleLoadMore = () => {
		if (loading || !hasMore) return;
		const nextPage = page + 1;
		setPage(nextPage);
		fetchDanhSachWorkflow(searchKey, nextPage);
	};



	const handlePopupScroll = (e: any) => {
		const { target } = e;
		if (target.scrollTop + target.offsetHeight >= target.scrollHeight - 10) {
			handleLoadMore();
		}
	};

	return (
		<Select
			placeholder='Chọn Workflow'
			showSearch
			optionFilterProp='label'
			{...props}
			value={props.value}
			onChange={(val, opt) => props.onChange?.(val, opt)}
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

export default SelectWorkflow;

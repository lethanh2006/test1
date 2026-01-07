import {
	type QueryCondition,
	type TExportField,
	type TFilter,
	type TImportHeader,
	type TImportResponse,
} from '@/components/Table/typing';
import { chuanHoaObject } from '@/utils/utils';
import { message } from 'antd';
import { useState } from 'react';
import useInitService from './useInitService';

/**
 *
 * @param url path api
 * @param fieldNameCondtion condition | cond
 * @param initCondition initConditionValue
 * @param upService Ip của dịch vụ bên thứ 3
 * @returns
 */
const useInitModel = <T extends object>(
	url: string,
	fieldNameCondtion?: 'condition' | 'cond',
	initCondition?: QueryCondition<T>,
	ipService?: string,
	initSort?: { [k in keyof T]?: 1 | -1 },
	initFilter?: TFilter<T>[],
) => {
	const [danhSach, setDanhSach] = useState<T[]>([]);
	const [record, setRecord] = useState<T>();
	const [page, setPage] = useState<number>(1);
	const [limit, setLimit] = useState<number>(10);
	const [loading, setLoading] = useState<boolean>(false);
	const [formSubmiting, setFormSubmiting] = useState<boolean>(false);
	const [filters, setFilters] = useState<TFilter<T>[]>(initFilter ?? []);
	const [condition, setCondition] = useState<QueryCondition<T>>(initCondition ?? {});
	const [sort, setSort] = useState<{ [k in keyof T]?: 1 | -1 } | undefined>(initSort);
	const [edit, setEdit] = useState<boolean>(false);
	const [isView, setIsView] = useState<boolean>(true);
	const [visibleForm, setVisibleForm] = useState<boolean>(false);
	const [total, setTotal] = useState<number>(0);
	const [importHeaders, setImportHeaders] = useState<TImportHeader[]>([]); // Import Headers lấy từ API
	const [selectedIds, setSelectedIds] = useState<string[]>();

	const {
		getAllService,
		postService,
		putService,
		putManyService,
		deleteService,
		deleteManyService,
		getService,
		getByIdService,
		getImportHeaders,
		getImportTemplate,
		postExecuteImport,
		postValidateImport,
		getExportFields,
		postExport,
	} = useInitService(url, ipService);

	/**
	 * Get Pageable Model
	 * @date 2023-04-05
	 * @param {any} paramCondition Condition khác
	 * @param {any} filterParams Các filters khác
	 * @param {any} sortParam Sort khác
	 * @param {any} paramPage Page khác
	 * @param {any} paramLimit Limit khác
	 * @param {any} path Đường dẫn (mặc định là `page`)
	 * @param {any} otherQuery Truy vấn thêm vào query
	 * @returns {any} Các IRecord
	 */
	const getModel = async (
		paramCondition?: QueryCondition<T>,
		filterParams?: TFilter<T>[],
		sortParam?: { [k in keyof T]?: 1 | -1 },
		paramPage?: number,
		paramLimit?: number,
		path?: string,
		otherQuery?: Record<string, any>,
		isSetDanhSach?: boolean,
		isAbsolutePath?: boolean,
		selectParams?: string[],
		config?: { dataPartitionCode?: string | null | undefined },
	): Promise<T[]> => {
		setLoading(true);
		const payload = {
			page: paramPage || page,
			limit: paramLimit || limit,
			sort: sortParam || sort,
			[fieldNameCondtion ?? 'condition']: {
				...condition,
				...paramCondition,
			},
			filters: [...(filters ?? []), ...(filterParams || [])]
				.filter((item) => item.active !== false)
				.map(({ active, ...item }) => item),
			select: selectParams?.join(' '),
			...(otherQuery ?? {}),
		};

		try {
			const response = await getService(
				payload,
				path ?? 'page',
				isAbsolutePath ?? false,
				config?.dataPartitionCode ? { 'x-data-partition-code': config.dataPartitionCode } : undefined,
			);
			const tempData: T[] = response?.data?.data?.result ?? [];
			const tempTotal: number = response?.data?.data?.total ?? 0;

			if (tempData.length === 0 && tempTotal) {
				const maxPage = Math.ceil(tempTotal / payload.limit) || 1;
				setPage(maxPage);
				return Promise.reject('Invalid page');
			} else {
				if (isSetDanhSach !== false) setDanhSach(tempData);
				setTotal(tempTotal);

				return tempData;
			}
		} catch (er) {
			if (isSetDanhSach !== false) {
				setDanhSach([]);
				setTotal(0);
				setPage(1);
			}

			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	const getAllModel = async (
		isSetRecord?: boolean,
		sortParam?: { [k in keyof T]?: 1 | -1 },
		conditionParam?: QueryCondition<T>,
		filterParam?: TFilter<T>[],
		pathParam?: string,
		isSetDanhSach?: boolean,
		selectParams?: string[],
		otherQuery?: Record<string, any>,
		config?: { dataPartitionCode?: string | null | string },
	): Promise<T[]> => {
		setLoading(true);
		try {
			const payload = {
				[fieldNameCondtion ?? 'condition']: conditionParam,
				sort: sortParam,
				filters: filterParam,
				select: selectParams?.join(' '),
				...(otherQuery ?? {}),
			};
			const response = await getAllService(
				payload,
				pathParam,
				config?.dataPartitionCode ? { 'x-data-partition-code': config.dataPartitionCode } : undefined,
			);
			const data: T[] = response?.data?.data ?? [];
			// if (sortParam) data.sort(sortParam);
			if (isSetDanhSach !== false) setDanhSach(data);
			if (isSetRecord) setRecord(data?.[0]);

			return data;
		} catch (er) {
			if (isSetDanhSach !== false) {
				setDanhSach([]);
				setTotal(0);
			}

			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	const getByIdModel = async (
		id: string | number,
		isSetRecord?: boolean,
		config?: { dataPartitionCode?: string | null | string },
	): Promise<T> => {
		if (!id) return Promise.reject('Invalid id');
		setLoading(true);
		try {
			const response = await getByIdService(
				id,
				config?.dataPartitionCode ? { 'x-data-partition-code': config.dataPartitionCode } : undefined,
			);
			if (isSetRecord !== false) setRecord(response?.data?.data ?? null);
			return response?.data?.data;
		} catch (er) {
			if (isSetRecord !== false) setRecord(undefined);
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	const getOneModel = async (
		conditionParam: QueryCondition<T>,
		config?: { dataPartitionCode?: string | null | string },
	): Promise<T> => {
		if (!conditionParam) return Promise.reject('condition is required');
		setLoading(true);
		try {
			const response = await getService(
				{ condition: conditionParam },
				'one',
				undefined,
				config?.dataPartitionCode ? { 'x-data-partition-code': config.dataPartitionCode } : undefined,
			);
			setRecord(response?.data?.data ?? null);
			return response?.data?.data;
		} catch (er) {
			setRecord(undefined);
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	const postModel = async (
		payload: Partial<T>,
		getData?: any,
		closeModal?: boolean,
		messageText?: string,
		config?: { dataPartitionCode?: string | null | undefined },
	): Promise<T> => {
		if (formSubmiting) Promise.reject('Form submiting');
		setFormSubmiting(true);
		try {
			const res = await postService(
				chuanHoaObject(payload),
				config?.dataPartitionCode ? { 'x-data-partition-code': config.dataPartitionCode } : undefined,
			);
			message.success(messageText ?? 'Thêm mới thành công');
			setLoading(false);
			if (getData) getData();
			else getModel();
			if (closeModal !== false) setVisibleForm(false);

			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const putModel = async (
		id: string | number,
		payload: Partial<T>,
		getData?: any,
		notGet?: boolean,
		closeModal?: boolean,
		messageText?: string,
		config?: { dataPartitionCode?: string | null | undefined },
	): Promise<T> => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);
		try {
			const res = await putService(
				id,
				chuanHoaObject(payload),
				config?.dataPartitionCode ? { 'x-data-partition-code': config.dataPartitionCode } : undefined,
			);
			message.success(messageText ?? 'Lưu thành công');
			setLoading(false);
			if (getData) getData();
			else if (!notGet) getModel();
			if (closeModal !== false) setVisibleForm(false);

			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const putManyModel = async (
		ids: (string | number)[],
		payload: Partial<T>,
		getData?: any,
		notGet?: boolean,
		closeModal?: boolean,
		messageText?: string,
		config?: { dataPartitionCode?: string | null | string },
	): Promise<T> => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);
		try {
			const res = await putManyService(
				ids,
				chuanHoaObject(payload),
				config?.dataPartitionCode ? { 'x-data-partition-code': config.dataPartitionCode } : undefined,
			);
			message.success(messageText ?? 'Lưu thành công');
			setLoading(false);
			if (getData) getData();
			else if (!notGet) getModel();
			if (closeModal !== false) setVisibleForm(false);

			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const deleteModel = async (
		id: string | number,
		getData?: () => void,
		config?: { dataPartitionCode?: string | null | string },
	): Promise<any> => {
		setLoading(true);
		try {
			const res = await deleteService(
				id,
				undefined,
				config?.dataPartitionCode ? { 'x-data-partition-code': config.dataPartitionCode } : undefined,
			);
			message.success('Xóa thành công');

			const maxPage = Math.ceil((total - 1) / limit) || 1;
			let newPage = page;
			if (newPage > maxPage) {
				newPage = maxPage;
				setPage(newPage);
			} else if (getData) getData();
			else getModel(undefined, undefined, undefined, newPage);

			return res.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoading(false);
		}
	};

	const deleteManyModel = async (
		ids: (string | number)[],
		getData?: () => void,
		config?: { dataPartitionCode?: string | null | undefined },
	): Promise<any> => {
		if (!ids.length) return;
		setLoading(true);
		try {
			const res = await deleteManyService(
				ids,
				undefined,
				config?.dataPartitionCode ? { 'x-data-partition-code': config.dataPartitionCode } : undefined,
			);
			message.success(`Xóa thành công ${ids.length} mục`);

			const maxPage = Math.ceil((total - ids.length) / limit) || 1;
			let newPage = page;
			if (newPage > maxPage) {
				newPage = maxPage;
				setPage(newPage);
			} else if (getData) getData();
			else getModel(undefined, undefined, undefined, newPage);

			return res.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = (rec?: T) => {
		if (rec) setRecord(rec);
		setEdit(true);
		setIsView(false);
		setVisibleForm(true);
	};

	const handleView = (rec?: T) => {
		if (rec) setRecord(rec);
		setEdit(false);
		setIsView(true);
		setVisibleForm(true);
	};

	/** Xóa dữ liệu model: `danhSach, record, page, total` */
	const clearModel = () => {
		setRecord(undefined);
		setDanhSach([]);
		setPage(1);
		setTotal(0);
	};

	//#region BASE IMPORT
	/**
	 * Lấy header cho chức năng import
	 * @returns {any}
	 */
	const getImportHeaderModel = async (
		query?: any,
		config?: {
			dataPartitionCode?: string | null | undefined;
		},
	): Promise<TImportHeader[]> => {
		try {
			const res = await getImportHeaders(
				query,
				config?.dataPartitionCode ? { 'x-data-partition-code': config.dataPartitionCode } : undefined,
			);
			setImportHeaders(res.data?.data ?? []);
			return res.data?.data ?? [];
		} catch (err) {
			setImportHeaders([]);
			return Promise.reject(err);
		}
	};

	/**
	 * Lấy file excel mẫu cho chức năng import
	 * @returns {any}
	 */
	const getImportTemplateModel = async (
		params?: any,
		config?: { dataPartitionCode?: string | null | undefined },
	): Promise<any> => {
		try {
			const res = await getImportTemplate(
				params,
				config?.dataPartitionCode ? { 'x-data-partition-code': config.dataPartitionCode } : undefined,
			);
			return res.data;
		} catch (err) {
			return Promise.reject(err);
		}
	};

	/**
	 * Validate dữ liệu cần import
	 * @returns {any}
	 */
	const postValidateModel = async (
		payload: any[],
		config?: { dataPartitionCode?: string | null | undefined },
	): Promise<TImportResponse> => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);
		try {
			const res = await postValidateImport(
				{ rows: payload },
				config?.dataPartitionCode ? { 'x-data-partition-code': config.dataPartitionCode } : undefined,
			);
			message.success('Đã kiểm tra dữ liệu');
			return res.data?.data ?? [];
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	/**
	 * Thực thi import dữ liệu
	 * @returns {any}
	 */
	const postExecuteImpotModel = async (
		payload: any[],
		config?: { dataPartitionCode?: string | null | undefined },
	): Promise<TImportResponse> => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);
		try {
			const res = await postExecuteImport(
				{ rows: payload },
				config?.dataPartitionCode ? { 'x-data-partition-code': config.dataPartitionCode } : undefined,
			);
			message.success('Đã nhập dữ liệu');
			return res.data?.data ?? [];
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};
	//#endregion

	//#region BASE EXPORT
	/**
	 * Lấy fields cho chức năng export
	 * @returns {any}
	 */
	const getExportFieldsModel = async (config?: {
		dataPartitionCode?: string | null | undefined;
	}): Promise<TExportField[]> => {
		const genIdField = (data?: TExportField[], prefix?: string): TExportField[] | undefined => {
			if (!data?.length) return undefined;
			return data?.map((f, index) => ({
				...f,
				_id: [prefix ?? '0', index].join('-'),
				children: genIdField(f.children, [prefix ?? '0', index].join('-')),
			}));
		};

		try {
			const res = await getExportFields(
				config?.dataPartitionCode ? { 'x-data-partition-code': config.dataPartitionCode } : undefined,
			);
			const fields = genIdField(res.data?.data) ?? [];

			return fields;
		} catch (err) {
			return Promise.reject(err);
		}
	};

	/**
	 * Thực thi export
	 * @returns {any}
	 */
	const postExportModel = async (
		payload: { ids?: string[]; definitions: TExportField[] },
		paramCondition?: QueryCondition<T>,
		paramFilters?: TFilter<T>[],
		otherQuery?: Record<string, any>,
		config?: { dataPartitionCode?: string | null | undefined },
	): Promise<Blob> => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);
		try {
			const queryParams = {
				...(otherQuery ?? {}),
				...(config?.dataPartitionCode ? { 'x-data-partition-code': config.dataPartitionCode } : undefined),
			};

			const res = await postExport(payload, {
				condition: { ...condition, ...paramCondition },
				filters: [
					...(filters?.filter((item) => item.active !== false)?.map(({ active, ...item }) => item) || []),
					...(paramFilters ?? []),
				],
				...queryParams,
			});
			return res.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};
	//#endregion

	return {
		sort,
		setSort,
		getByIdModel,
		getOneModel,
		getModel,
		deleteModel,
		deleteManyModel,
		putModel,
		putManyModel,
		postModel,
		getAllModel,
		page,
		setPage,
		limit,
		setLimit,
		loading,
		setLoading,
		filters,
		setFilters,
		condition,
		setCondition,
		edit,
		setEdit,
		isView,
		setIsView,
		visibleForm,
		setVisibleForm,
		total,
		setTotal,
		formSubmiting,
		setFormSubmiting,
		danhSach,
		setDanhSach,
		record,
		setRecord,
		importHeaders,
		setImportHeaders,
		handleEdit,
		handleView,
		getImportHeaderModel,
		getImportTemplateModel,
		postExecuteImpotModel,
		postValidateModel,
		getByIdService,
		getService,
		getAllService,
		postService,
		putService,
		getExportFieldsModel,
		postExportModel,
		selectedIds,
		setSelectedIds,
		initFilter,
		clearModel,
	};
};

export default useInitModel;

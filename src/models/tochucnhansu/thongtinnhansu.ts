import { EOperatorType } from '@/components/Table/constant';
import { TFilter } from '@/components/Table/typing';
import useInitModel from '@/hooks/useInitModel';
import { ThongTinNhanSu } from '@/services/ToChucNhanSu/ThongTinNhanSu/typing';
import { ipTcns } from '@/utils/ip';
import { AxiosResponse } from '@umijs/max';
import _ from 'lodash';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<ThongTinNhanSu.IRecord>('thong-tin-nhan-su', undefined, undefined, ipTcns);
	const { setLoading, getService, setDanhSach } = objInit;
	const [danhSachAllNhanSu, setDanhSachAllNhanSu] = useState<ThongTinNhanSu.IRecord[]>([]);

	const searchCanBoModel = async (
		keyword: string,
		maDonVi?: string,
		isSetDanhSach?: boolean,
		condition?: Partial<ThongTinNhanSu.IRecord>,
	): Promise<ThongTinNhanSu.IRecord[]> => {
		setLoading(true);
		try {
			const filterStatus: TFilter<ThongTinNhanSu.IRecord> = {
				active: true,
				field: 'maDonViChinh',
				operator: EOperatorType.INCLUDE,
				values: [maDonVi ?? ''],
			};
			const payloads = [
				{
					page: 1,
					limit: 20,
					condition,
					filters: [
						{ active: true, field: 'maCanBo', values: [keyword], operator: EOperatorType.CONTAIN },
						...(maDonVi ? [filterStatus] : []),
					],
				},
				{
					page: 1,
					limit: 20,
					condition,
					filters: [
						{ active: true, field: 'hoTen', values: [keyword], operator: EOperatorType.CONTAIN },
						...(maDonVi ? [filterStatus] : []),
					],
				},
			];
			const responses = await Promise.allSettled(payloads.map((payload) => getService(payload, 'page')));
			const data = (
				responses.filter((item) => item.status === 'fulfilled') as PromiseFulfilledResult<AxiosResponse<any>>[]
			).map((item) => item.value.data?.data?.result);
			const flatData: ThongTinNhanSu.IRecord[] = data.flat();
			const uniqData = _.uniqBy(flatData, (item) => item.ssoId);
			if (isSetDanhSach !== false) setDanhSach(uniqData);

			return uniqData;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	return {
		...objInit,
		danhSachAllNhanSu,
		setDanhSachAllNhanSu,
		searchCanBoModel,
	};
};

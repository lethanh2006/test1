import useInitModel from '@/hooks/useInitModel';
import { ipCore } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<PhanVungDuLieu.IUser>('data-partition/user', undefined, undefined, ipCore);
	const { getAllModel } = objInit;

	const getPartitionCodeMeModel = async (currentPartition?: string) => {
		const res = await getAllModel(undefined, undefined, undefined, undefined, 'many/me');
		if (!res || res.length === 0) {
			localStorage.removeItem('partitionCode');
			return null;
		}

		const exists = res.some((item: any) => item?.dataPartitionCode === currentPartition);
		const newPartition = !currentPartition || !exists ? res?.[0]?.dataPartitionCode : currentPartition;

		localStorage.setItem('partitionCode', newPartition);
		return newPartition;
	};

	return {
		...objInit,
		getPartitionCodeMeModel,
	};
};

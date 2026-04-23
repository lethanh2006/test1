import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function getDefaultValueOfFormDong(idForm: string) {
	return axios.get(`${ip3}/form-dong/${idForm}/default-value`);
}

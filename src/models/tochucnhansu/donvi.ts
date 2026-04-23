import useInitModel from '@/hooks/useInitModel';
import { ipTcns } from '@/utils/ip';

export default () => {
  const objInit = useInitModel<DonVi.IRecord>('don-vi', undefined, undefined, ipTcns);

  return {
    ...objInit,
  };
};
import useInitModel from "@/hooks/useInitModel";
import { GetInstanceMe, GetInstanceSpecialistMe } from "@/services/Instance";

export default () => {
  const { setLoading, ...objInit } = useInitModel<Instance.IRecord>('instance');

  const getInstaceMe = async (payload: { page?: number, limit?: number, otherQuery?: Record<string, any> }): Promise<any> => {
    setLoading(true);
    try {
      const response = await GetInstanceMe(payload);
      const data = response?.data?.data?.result ?? [];
      const total = response?.data?.data?.total ?? 0;
      objInit.setDanhSach(data);
      objInit.setTotal(total);
      return data;
    } catch (er) {
      objInit.setDanhSach([]);
      objInit.setTotal(0);
      return Promise.reject(er);
    } finally {
      setLoading(false);
    }
  };

  const getInstanceSpecialistMe = async (payload: { page?: number, limit?: number, otherQuery?: Record<string, any> }): Promise<any> => {
    setLoading(true);
    try {
      const response = await GetInstanceSpecialistMe(payload);
      const data = response?.data?.data?.result ?? [];
      const total = response?.data?.data?.total ?? 0;
      objInit.setDanhSach(data);
      objInit.setTotal(total);
      return data;
    } catch (er) {
      objInit.setDanhSach([]);
      objInit.setTotal(0);
      return Promise.reject(er);
    } finally {
      setLoading(false);
    }
  };


  return {
    ...objInit,
    setLoading,
    getInstaceMe,
    getInstanceSpecialistMe,
  };
};

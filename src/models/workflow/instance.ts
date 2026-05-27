import useInitModel from '@/hooks/useInitModel';
import { GetContextValue, StartInstance, TriggerInstanceNodeAddon } from '@/services/Instance';
import { ipWorkflow } from '@/utils/ip';

export default () => {
  const { setLoading, getAllService, ...objInit } = useInitModel<Instance.IRecord>(
    'instance',
    undefined,
    undefined,
    ipWorkflow,
  );

  const startInstance = async (workflowId: string, data: Parameters<typeof StartInstance>[1]): Promise<any> => {
    setLoading(true);
    try {
      const response = await StartInstance(workflowId, data);

      return response?.data?.data;
    } catch (er) {
      return Promise.reject(er);
    } finally {
      setLoading(false);
    }
  };

  const getInstaceContextValue = async (instanceId: string, data: { rawValue: string }): Promise<any> => {
    setLoading(true);
    try {
      const response = await GetContextValue(instanceId, data);

      return response?.data?.data;
    } catch (er) {
      return Promise.reject(er);
    } finally {
      setLoading(false);
    }
  };

  const triggerInstanceNodeAddon = async (
    workflowId: string,
    nodeId: string,
    addonId: string,
    payload?: Record<string, any>,
  ): Promise<any> => {
    setLoading(true);
    try {
      const response = await TriggerInstanceNodeAddon(workflowId, nodeId, addonId, payload);
      return response?.data?.data;
    } catch (er) {
      return Promise.reject(er);
    } finally {
      setLoading(false);
    }
  };

  return {
    ...objInit,
    startInstance,
    getInstaceContextValue,
    triggerInstanceNodeAddon,
  };
};

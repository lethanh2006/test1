import { useState } from 'react';
import useInitModel from '@/hooks/useInitModel';
import { allowReoperate, completeInstanceTask, editInstanceTask, getInforTaskNode, getInstanceTaskMeMany, getListTaskByInstanceId } from '@/services/Instance/task';

export default () => {
  const { setLoading, ...objInit } = useInitModel<Instance.IInstanceTask>('instance-tasks');

  const [listTask, setListTask] = useState<Instance.IStepTask[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | undefined>();
  const [listTaskMe, setListTaskMe] = useState<Instance.IInstanceTask[]>([]);

  const autoSelectTask = (tasks: Instance.IStepTask[]) => {
    if (!tasks || !tasks.length) {
      setSelectedTaskId(undefined);
      return;
    }

    const clickableTask = tasks.find((t) => t.clickable);
    if (clickableTask) {
      setSelectedTaskId(clickableTask.nodeId);
      return;
    }

    setSelectedTaskId(tasks[0].nodeId);
  };

  const getListTask = async (instanceId: string, silent?: boolean) => {
    if (!silent) setLoading(true);
    try {
      const response = await getListTaskByInstanceId(instanceId);
      const data: Instance.IStepTask[] = response?.data?.data || [];

      const sortedData = [...data].sort((a, b) => a.depth - b.depth);

      setListTask(sortedData);
    } catch (er) {
      return Promise.reject(er);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const getInforNode = async (instanceId: string, nodeId: string) => {
    setLoading(true);
    try {
      const response = await getInforTaskNode(instanceId, nodeId);
      const data: Instance.IInstanceTask = response?.data?.data || [];

      return data;
    } catch (er) {
      return Promise.reject(er);
    } finally {
      setLoading(false);
    }
  }

  const getInstanceTaskMe = async (instanceId: string, silent?: boolean) => {
    if (!silent) setLoading(true);
    try {
      const response = await getInstanceTaskMeMany(instanceId);
      const data: Instance.IInstanceTask[] = response?.data?.data || [];

      setListTaskMe(data);
    } catch (er) {
      return Promise.reject(er);
    } finally {
      if (!silent) setLoading(false);
    }
  }

  const refreshAction = async (instanceId: string) => {
    setLoading(true);
    try {
      await Promise.all([getListTask(instanceId, true), getInstanceTaskMe(instanceId, true)]);
    } catch (er) {
      return Promise.reject(er);
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (taskId: string, data: { outcome: Record<string, any> }): Promise<any> => {
    setLoading(true);
    try {
      const response = await completeInstanceTask(taskId, data);
      return response?.data?.data;
    } catch (er) {
      return Promise.reject(er);
    } finally {
      setLoading(false);
    }
  };

  const editTask = async (taskId: string, data: { outcome: Record<string, any> }): Promise<any> => {
    setLoading(true);
    try {
      const response = await editInstanceTask(taskId, data);
      return response?.data?.data;
    } catch (er) {
      return Promise.reject(er);
    } finally {
      setLoading(false);
    }
  };

  const checkAllowReoperate = async (taskId: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await allowReoperate(taskId);
      return response?.data?.data;
    } catch (er) {
      return Promise.reject(er);
    } finally {
      setLoading(false);
    }
  };

  return {
    ...objInit,
    completeTask,
    selectedTaskId,
    setSelectedTaskId,
    autoSelectTask,
    getListTask,
    listTask,
    setListTask,
    getInforNode,
    getInstanceTaskMe,
    listTaskMe,
    setListTaskMe,
    refreshAction,
    editTask,
    checkAllowReoperate,
    setLoading
  };
};
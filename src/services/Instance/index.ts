import axios from "@/utils/axios";
import { ip3 } from "@/utils/ip";
import { ipWorkflow } from '@/utils/ip';

export async function StartInstance(workflowId: string, data: Instance.IRecord) {
  return axios.post(`${ip3}/instance/start-instance/${workflowId}`, data);
}

export async function GetContextValue(instanceId: string, data: { rawValue: string }) {
  return axios.post(`${ip3}/instance/${instanceId}/context-value`, data);
}

export async function GetInstanceMe(payload: { page?: number, limit?: number, otherQuery?: Record<string, any>, }) {
  return axios.get(`${ip3}/instance/me/page`, { params: { page: payload.page, limit: payload.limit, ...payload.otherQuery } });
}

export async function GetInstanceSpecialistMe(payload: { page?: number, limit?: number, otherQuery?: Record<string, any>, }) {
  return axios.get(`${ip3}/instance/chuyen-vien/me/page`, { params: { page: payload.page, limit: payload.limit, ...payload.otherQuery } });
}

export async function ExportInstanceSpecialistMe() {
  return axios.get(`${ip3}/instance/chuyen-vien/me/export`, {
    responseType: 'arraybuffer',
  });
}
export async function TriggerInstanceNodeAddon(
  workflowId: string,
  nodeId: string,
  addonId: string,
  payload?: Record<string, any>,
) {
  return axios.post(`${ipWorkflow}/instance/workflow/${workflowId}/nodes/${nodeId}/addon/${addonId}/trigger`, payload ?? {});
}

export async function GetManyInstances(params: { condition?: string; population?: string[]; filters?: string[] }) {
  return axios.get(`${ip3}/instance/many`, { params });
}
import axios from "@/utils/axios";
import { ip3 } from "@/utils/ip";

export async function getListTaskByInstanceId(instanceId: string) {
  return axios.get(`${ip3}/instance/step/${instanceId}`);
}

export async function getInforTaskNode(instanceId: string, nodeId: string) {
  return axios.get(`${ip3}/instance-node/instance/${instanceId}/node/${nodeId}`);
}

export async function getInstanceTaskMeMany(instanceId: string) {
  return axios.get(`${ip3}/instance-tasks/${instanceId}/me/many`);
}

export async function completeInstanceTask(instanceTaskId: string, data: { outcome: Record<string, any> }) {
  return axios.post(`${ip3}/instance-tasks/${instanceTaskId}/complete`, data);
}

export async function saveDraftInstanceTask(instanceTaskId: string, data: { outcome: Record<string, any> }) {
  return axios.post(`${ip3}/instance-tasks/${instanceTaskId}/save-draft`, data);
}

export async function allowReoperate(instanceTaskId: string) {
  return axios.get(`${ip3}/instance-tasks/${instanceTaskId}/check-editable`)
}

export async function editInstanceTask(instanceTaskId: string, data: { outcome: Record<string, any> }) {
  return axios.post(`${ip3}/instance-tasks/${instanceTaskId}/edit`, data);
}
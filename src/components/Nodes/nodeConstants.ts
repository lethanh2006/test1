export enum WorkflowNodeType {
  START = 'start',
  END = 'end',

  //node service
  SERVICE_SCRIPT = 'service.script',
  SERVICE_CONDITION = 'service.condition',
  SERVICE_JOIN = 'service.join',
  SERVICE_CALL_API = 'service.callapi',
  SERVICE_EXPORT_FILE = 'service.exportfile',
  SERVICE_EDIT_FIELD = 'service.editfield',
  SERVICE_GET_INSTANCES = 'service.getinstances',
  SERVICE_EXPORT_EXCEL = 'service.exportexcel',

  //node user
  USER_ACTION = 'user.action',
  USER_FORM = 'user.form',
}


export const NODE_COLORS: Record<WorkflowNodeType, string> = {
  [WorkflowNodeType.START]: '#52c41a',
  [WorkflowNodeType.END]: '#ff4d4f',

  //node action
  [WorkflowNodeType.SERVICE_SCRIPT]: '#1890ff',
  [WorkflowNodeType.SERVICE_CONDITION]: '#faad14',
  [WorkflowNodeType.SERVICE_JOIN]: '#722ed1',
  [WorkflowNodeType.SERVICE_CALL_API]: '#13c2c2',
  [WorkflowNodeType.SERVICE_EXPORT_FILE]: '#722ed1',
  [WorkflowNodeType.SERVICE_EDIT_FIELD]: '#722ed1',
  [WorkflowNodeType.SERVICE_GET_INSTANCES]: '#722ed1',
  [WorkflowNodeType.SERVICE_EXPORT_EXCEL]: '#722ed1',

  //node user
  [WorkflowNodeType.USER_ACTION]: '#eb2f96',
  [WorkflowNodeType.USER_FORM]: '#fa8c16',
};

export const NODE_TITLES: Record<WorkflowNodeType, string> = {
  [WorkflowNodeType.START]: 'Start',
  [WorkflowNodeType.END]: 'End',

  //node action
  [WorkflowNodeType.SERVICE_SCRIPT]: 'Service Script',
  [WorkflowNodeType.SERVICE_CONDITION]: 'Service Condition',
  [WorkflowNodeType.SERVICE_JOIN]: 'Service Join',
  [WorkflowNodeType.SERVICE_CALL_API]: 'Service Call API',
  [WorkflowNodeType.SERVICE_EXPORT_FILE]: 'Service Export File',
  [WorkflowNodeType.SERVICE_EDIT_FIELD]: 'Service Edit Field',
  [WorkflowNodeType.SERVICE_GET_INSTANCES]: 'Service Get Instances',
  [WorkflowNodeType.SERVICE_EXPORT_EXCEL]: 'Service Export Excel',

  //node user
  [WorkflowNodeType.USER_ACTION]: 'User Action',
  [WorkflowNodeType.USER_FORM]: 'User Form',
};

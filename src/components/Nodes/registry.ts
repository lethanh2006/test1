
import { StartNodeVisual } from './StartNode/StartNodeVisual';
import { StartNodeConfig } from './StartNode/StartNodeConfig';
import { EndNodeVisual } from './EndNode/EndNodeVisual';
import { EndNodeConfig } from './EndNode/EndNodeConfig';
import { UserActionNodeVisual } from './UserActionNode/UserActionNodeVisual';
import { UserActionNodeConfig } from './UserActionNode/UserActionNodeConfig';
import { ScriptNodeVisual } from './ScriptNode/ScriptNodeVisual';
import { ScriptNodeConfig } from './ScriptNode/ScriptNodeConfig';
import { JoinNodeVisual } from './JoinNode/JoinNodeVisual';
import { JoinNodeConfig } from './JoinNode/JoinNodeConfig';
import { ConditionNodeVisual } from './ConditionNode/ConditionNodeVisual';
import { ConditionNodeConfig } from './ConditionNode/ConditionNodeConfig';
import { CallApiNodeVisual } from './CallApiNode/CallApiNodeVisual';
import { CallApiNodeConfig } from './CallApiNode/CallApiNodeConfig';
import { UserFormNodeVisual } from './UserFormNode/UserFormNodeVisual';
import { UserFormNodeConfig } from './UserFormNode/UserFormNodeConfig';
import { ExportFileNodeVisual } from './ExportFileNode/ExportFileNodeVisual';
import { ExportFileNodeConfig } from './ExportFileNode/ExportFileNodeConfig';
import { type NodeProps } from '@xyflow/react';
import { NODE_COLORS, NODE_TITLES, WorkflowNodeType } from './nodeConstants';
import { AppNode, NodeRegistryItem } from '@/components/Nodes/type';
import EditFieldNodeVisual from '@/components/Nodes/EditFieldNode/EditFieldNodeVisual';
import EditFieldNodeConfig from '@/components/Nodes/EditFieldNode/EditFieldNodeConfig';
import { GetInstancesNodeVisual } from './GetInstancesNode/GetInstancesNodeVisual';
import { GetInstancesNodeConfig } from './GetInstancesNode/GetInstancesNodeConfig';
import { ExportExcelNodeVisual } from './ExportExcelNode/ExportExcelNodeVisual';
import { ExportExcelNodeConfig } from './ExportExcelNode/ExportExcelNodeConfig';

export const NODE_REGISTRY: Record<WorkflowNodeType, NodeRegistryItem> = {
  // Node Service
  [WorkflowNodeType.START]: {
    type: WorkflowNodeType.START,
    label: NODE_TITLES[WorkflowNodeType.START],
    color: NODE_COLORS[WorkflowNodeType.START],
    visualComponent: StartNodeVisual,
    configComponent: StartNodeConfig,
    initialData: {},
  },
  [WorkflowNodeType.END]: {
    type: WorkflowNodeType.END,
    label: NODE_TITLES[WorkflowNodeType.END],
    color: NODE_COLORS[WorkflowNodeType.END],
    visualComponent: EndNodeVisual,
    configComponent: EndNodeConfig,
    initialData: {},
  },
  [WorkflowNodeType.SERVICE_SCRIPT]: {
    type: WorkflowNodeType.SERVICE_SCRIPT,
    label: NODE_TITLES[WorkflowNodeType.SERVICE_SCRIPT],
    color: NODE_COLORS[WorkflowNodeType.SERVICE_SCRIPT],
    visualComponent: ScriptNodeVisual,
    configComponent: ScriptNodeConfig,
    initialData: {
      script: 'return undefined',
    },
  },
  [WorkflowNodeType.SERVICE_JOIN]: {
    type: WorkflowNodeType.SERVICE_JOIN,
    label: NODE_TITLES[WorkflowNodeType.SERVICE_JOIN],
    color: NODE_COLORS[WorkflowNodeType.SERVICE_JOIN],
    visualComponent: JoinNodeVisual,
    configComponent: JoinNodeConfig,
    initialData: {
      requiredNodeIds: [],
    },
  },
  [WorkflowNodeType.SERVICE_CONDITION]: {
    type: WorkflowNodeType.SERVICE_CONDITION,
    label: NODE_TITLES[WorkflowNodeType.SERVICE_CONDITION],
    color: NODE_COLORS[WorkflowNodeType.SERVICE_CONDITION],
    visualComponent: ConditionNodeVisual,
    configComponent: ConditionNodeConfig,
    initialData: {
      logic: 'AND',
      conditions: [],
    },
  },
  [WorkflowNodeType.SERVICE_CALL_API]: {
    type: WorkflowNodeType.SERVICE_CALL_API,
    label: NODE_TITLES[WorkflowNodeType.SERVICE_CALL_API],
    color: NODE_COLORS[WorkflowNodeType.SERVICE_CALL_API],
    visualComponent: CallApiNodeVisual,
    configComponent: CallApiNodeConfig,
    initialData: {
      type: 'http',
      method: 'POST',
    },
  },
  [WorkflowNodeType.SERVICE_EXPORT_FILE]: {
    type: WorkflowNodeType.SERVICE_EXPORT_FILE,
    label: NODE_TITLES[WorkflowNodeType.SERVICE_EXPORT_FILE],
    color: NODE_COLORS[WorkflowNodeType.SERVICE_EXPORT_FILE],
    visualComponent: ExportFileNodeVisual,
    configComponent: ExportFileNodeConfig,
    initialData: {
      urlFile: '',
      dataType: 'field',
      fields: [],
    },
  },
  [WorkflowNodeType.SERVICE_EDIT_FIELD]: {
    type: WorkflowNodeType.SERVICE_EDIT_FIELD,
    label: NODE_TITLES[WorkflowNodeType.SERVICE_EDIT_FIELD],
    color: NODE_COLORS[WorkflowNodeType.SERVICE_EDIT_FIELD],
    visualComponent: EditFieldNodeVisual,
    configComponent: EditFieldNodeConfig,
    initialData: {
      fields: [],
    },

  },
  [WorkflowNodeType.SERVICE_GET_INSTANCES]: {
    type: WorkflowNodeType.SERVICE_GET_INSTANCES,
    label: NODE_TITLES[WorkflowNodeType.SERVICE_GET_INSTANCES],
    color: NODE_COLORS[WorkflowNodeType.SERVICE_GET_INSTANCES],
    visualComponent: GetInstancesNodeVisual,
    configComponent: GetInstancesNodeConfig,
    initialData: {},
  },
  [WorkflowNodeType.SERVICE_EXPORT_EXCEL]: {
    type: WorkflowNodeType.SERVICE_EXPORT_EXCEL,
    label: NODE_TITLES[WorkflowNodeType.SERVICE_EXPORT_EXCEL],
    color: NODE_COLORS[WorkflowNodeType.SERVICE_EXPORT_EXCEL],
    visualComponent: ExportExcelNodeVisual,
    configComponent: ExportExcelNodeConfig,
    initialData: {
      columns: [],
    },
  },

  // Node User
  [WorkflowNodeType.USER_ACTION]: {
    type: WorkflowNodeType.USER_ACTION,
    label: NODE_TITLES[WorkflowNodeType.USER_ACTION],
    color: NODE_COLORS[WorkflowNodeType.USER_ACTION],
    visualComponent: UserActionNodeVisual,
    configComponent: UserActionNodeConfig,
    initialData: {
      actions: [
        { id: 'approved', label: 'Approve', variant: 'primary' },
        { id: 'rejected', label: 'Reject', variant: 'destructive' },
      ],
    },
    validate: (config) => {
      const assignees = config.assignee as any[];
      if (!assignees || assignees.length === 0) {
        return { isValid: false, message: 'Vui lòng chọn thẩm quyền xử lý' };
      }
      return { isValid: true };
    },
  },
  [WorkflowNodeType.USER_FORM]: {
    type: WorkflowNodeType.USER_FORM,
    label: NODE_TITLES[WorkflowNodeType.USER_FORM],
    color: NODE_COLORS[WorkflowNodeType.USER_FORM],
    visualComponent: UserFormNodeVisual,
    configComponent: UserFormNodeConfig,
    initialData: {
      fields: [],
    },
    validate: (config) => {
      const assignees = config.assignee as any[];
      if (!assignees || assignees.length === 0) {
        return { isValid: false, message: 'Vui lòng chọn thẩm quyền xử lý' };
      }
      return { isValid: true };
    },
  },
};

export const getReactFlowNodeTypes = () => {
  const types: Record<string, React.ComponentType<NodeProps<AppNode>>> = {};
  Object.values(NODE_REGISTRY).forEach((item) => {
    types[item.type] = item.visualComponent;
  });
  return types;
};
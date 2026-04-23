import React from 'react';
import type { Node, NodeProps } from '@xyflow/react';
import type { WorkflowNodeType } from './nodeConstants';

// Dữ liệu nghiệp vụ của 1 node
export type NodeData = {
  label: string;
  config: Record<string, unknown>; // Chứa dữ liệu form
};

export type AppNode = Node<NodeData>;

export interface WorkflowVariable {
  label: string;
  value: string; // format: {{nodeId.field}}
  type: string;
  nodeName: string;
}

export interface ConfigProps<T = Record<string, unknown>> {
  initialValues: T;
  onValuesChange: (changedValues: Partial<T>, allValues: T) => void;
  availableVariables?: WorkflowVariable[];
  nodes?: any[];
  addonVariablesMap?: Record<string, WorkflowVariable[]>;
  form?: any;
}

export interface NodeRegistryItem {
  type: WorkflowNodeType;
  label: string;
  color: string;
  visualComponent: React.ComponentType<NodeProps<AppNode>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  configComponent: React.ComponentType<ConfigProps<any>>;
  initialData: Record<string, unknown>;
  validate?: (config: Record<string, unknown>) => { isValid: boolean; message?: string };
}

export enum AddOnScope {
    GLOBAL = "GLOBAL",
    INSTANCE = "INSTANCE",
}

export interface ResponseConfig {
    key: string;
    value: string | number | boolean | string[] | Record<string, any>;
}

export interface AddOnAction {
    id: string;
    name: string;
    icon?: string;
    description?: string;
    enabled: boolean;
    nextNodeId: string;
    response?: ResponseConfig[];
    scope: AddOnScope;
}

export interface AddOn {
    actions: AddOnAction[];
}

// Base config cho các node liên quan đến user
export interface BaseUserConfig {
  assignee: {
    // TODO: thêm thông tin user được assign
  };
  deadline?: {
    duration: number;
    unit: 'hours' | 'days' | 'weeks';
  };
  addOn?: AddOn;
}

export interface GetInstancesConfig {
    workflowId: string;
    condition: any;
    query?: any;
    population?: string[];
    filters?: string[];
}

export type ColumnMap = {
    key: string;
    title: string;
    width?: number;
};

export interface ExportExcelConfig {
    data: Record<string, unknown>[];
    fileName?: string;
    columns?: ColumnMap[];
    save?: boolean;
}
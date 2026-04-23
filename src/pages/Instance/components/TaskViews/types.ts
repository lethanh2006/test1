import React from 'react';

export interface TaskRendererProps {
  task: Instance.IInstanceTask & { clickable?: boolean; isActOnSelf?: boolean };
  onSubmit: (payload: { outcome: Record<string, any> }) => Promise<void>;
  loading?: boolean;
  instanceId?: string;
  onCheckAllowReoperate: () => Promise<void>;
  allowReoperate?: boolean;
  isNotAllowAction?: boolean;
}

export interface TaskRendererItem {
  type: string;
  component: React.ComponentType<TaskRendererProps>;
  /** Function to build submit payload from form data */
  buildSubmitPayload: (formData: any) => { outcome: Record<string, any> };
}

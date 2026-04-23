import { TaskRendererItem } from './types';
import { UserActionTaskView } from './UserActionTaskView';
import { UserFormTaskView } from './UserFormTaskView';

export const TASK_RENDERER_REGISTRY: Record<string, TaskRendererItem> = {
  'user.action': {
    type: 'user.action',
    component: UserActionTaskView,
    buildSubmitPayload: (actionId: string) => ({
      outcome: { value: actionId },
    }),
  },
  'user.form': {
    type: 'user.form',
    component: UserFormTaskView,
    buildSubmitPayload: (formValues: Record<string, any>) => ({
      outcome: formValues,
    }),
  },

};

export const getTaskRenderer = (taskType: string): TaskRendererItem | null => {
  return TASK_RENDERER_REGISTRY[taskType] || null;
};

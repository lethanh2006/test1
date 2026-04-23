import { removeVietnameseTones } from '@/utils/utils';
import { FormInstance } from 'antd';

/**
 * Convert string to camelCase, removing Vietnamese accents and special characters
 */
export function toCamelCase(str: string): string {
  if (!str) return '';
  const noTones = removeVietnameseTones(str);
  const words = noTones
    .replace(/[^a-zA-Z0-9]/g, ' ')
    .split(' ')
    .filter(Boolean);

  if (words.length === 0) return '';

  return words[0].toLowerCase() +
    words.slice(1)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
}

/**
 * Helper to handle node configuration form values change
 * Synchronizes 'label' to 'id' automatically
 */
export const handleNodeValuesChange = (
  changedValues: any,
  allValues: any,
  form: FormInstance,
  onValuesChange?: (changedValues: any, allValues: any) => void
) => {
  // 1. Handle top-level label -> id
  if (changedValues.label !== undefined) {
    const generatedId = toCamelCase(changedValues.label);
    form.setFieldsValue({ id: generatedId });
    onValuesChange?.(
      { ...changedValues, id: generatedId },
      { ...allValues, id: generatedId }
    );
    return;
  }

  // 2. Handle nested actions label -> id
  if (changedValues.actions && Array.isArray(changedValues.actions)) {
    const newActions = [...(allValues.actions || [])];
    let hasChange = false;
    changedValues.actions.forEach((action: any, index: number) => {
      if (action && action.label !== undefined) {
        newActions[index] = {
          ...newActions[index],
          id: toCamelCase(action.label)
        };
        hasChange = true;
      }
    });
    if (hasChange) {
      form.setFieldsValue({ actions: newActions });
      onValuesChange?.({ actions: newActions }, { ...allValues, actions: newActions });
      return;
    }
  }

  // 3. Handle addOn actions name -> id
  if (changedValues.addOn?.actions && Array.isArray(changedValues.addOn.actions)) {
    const newAddOnActions = [...(allValues.addOn?.actions || [])];
    let hasChange = false;
    changedValues.addOn.actions.forEach((action: any, index: number) => {
      if (action && action.name !== undefined) {
        newAddOnActions[index] = {
          ...newAddOnActions[index],
          id: toCamelCase(action.name)
        };
        hasChange = true;
      }
    });
    if (hasChange) {
      const updatedAddOn = { ...allValues.addOn, actions: newAddOnActions };
      form.setFieldsValue({ addOn: updatedAddOn });
      onValuesChange?.({ addOn: updatedAddOn }, { ...allValues, addOn: updatedAddOn });
      return;
    }
  }

  // 4. Handle nested form fields label -> name
  if (changedValues.fields && Array.isArray(changedValues.fields)) {
    const newFields = [...(allValues.fields || [])];
    let hasChange = false;
    changedValues.fields.forEach((field: any, index: number) => {
      if (field && field.label !== undefined) {
        newFields[index] = {
          ...newFields[index],
          name: toCamelCase(field.label)
        };
        hasChange = true;
      }
    });
    if (hasChange) {
      form.setFieldsValue({ fields: newFields });
      onValuesChange?.({ fields: newFields }, { ...allValues, fields: newFields });
      return;
    }
  }

  onValuesChange?.(changedValues, allValues);
};

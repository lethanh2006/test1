export interface ExportField {
  name: string;
  value?: string;
  isArray?: boolean;
  valueArray?: ExportField[][];
}

export interface ExportFileConfig {
  id?: string;
  urlFile: string;
  fileId?: string;
  fileName?: string;
  dataType: 'field' | 'data-one-object';
  fields: ExportField[];
  data?: string;
  label?: string;
  save?: boolean;
}

export function transformFormToExportConfig(formValues: any): ExportFileConfig {
  const { id, label, urlFile, fileId, fileName, dataType, fields, data, save } = formValues;

  const cleanedFields = (fields || []).map((field: any) => {
    const cleaned: ExportField = {
      name: field.name || '',
      isArray: field.isArray || false,
    };

    if (cleaned.isArray) {
      cleaned.valueArray = field.valueArray || [[{ name: '', value: '', isArray: false }]];
    } else {
      cleaned.value = field.value || '';
    }

    return cleaned;
  });

  return {
    id: id || '',
    label: label || '',
    urlFile: urlFile || '',
    fileId: fileId || '',
    fileName: fileName || '',
    dataType: dataType || 'field',
    fields: cleanedFields,
    data: dataType === 'data-one-object' ? data : {},
    save: !!save,
  };
}

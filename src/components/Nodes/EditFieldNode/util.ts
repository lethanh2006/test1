
export type EditFieldType = "string" | "object"

export interface EditField {
  name: string;
  value?: string;
  type: EditFieldType;
}

export interface EditFieldsConfig {
	id?: string;
	fields: EditField[];
}

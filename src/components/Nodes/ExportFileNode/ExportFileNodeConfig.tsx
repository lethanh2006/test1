import { ConfigProps } from '@/components/Nodes/type';
import UploadFile from '@/components/Upload/UploadFile';
import { EFileScope, uploadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { FileWordOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import { Card, Checkbox, Divider, Form, Input, Radio, Space, Typography } from 'antd';
import { useEffect, useRef } from 'react';
import { FieldMappingConfig } from './components/FieldMappingConfig';
import { ScriptMappingConfig } from './components/ScriptMappingConfig';
import { ExportFileConfig, transformFormToExportConfig } from './utils';

const { Text } = Typography;

import { handleNodeValuesChange } from '../utils';

export const ExportFileNodeConfig = ({
	initialValues,
	onValuesChange,
	availableVariables,
	form: propsForm,
}: ConfigProps<ExportFileConfig>) => {
	const intl = useIntl();
	const [localForm] = Form.useForm();
	const form = propsForm || localForm;
	const initializedRef = useRef(false);

	useEffect(() => {
		if (!initializedRef.current) {
			form.setFieldsValue({
				...initialValues,
				dataType: initialValues.dataType || 'field',
			});
			initializedRef.current = true;
		}
	}, [initialValues, form]);

	const handleValuesChange = async (changedValues: any, allValues: any) => {
		const urlFileDocx = allValues?.urlFile?.fileList?.[0];
		const payload = { ...allValues };

		if (urlFileDocx?.originFileObj && urlFileDocx?.status === 'uploading') {
			const res = await uploadFile({ file: urlFileDocx?.originFileObj, scope: EFileScope.PUBLIC });

			payload.fileId = res?.data?.data?.file?._id;
			payload.urlFile = res?.data?.data?.url;
			payload.fileName = res?.data?.data?.file?.name;
		} else payload.urlFile = urlFileDocx?.url;

		if (changedValues.dataType === 'field') {
			form.setFieldValue('data', undefined);
		} else if (changedValues.dataType === 'data-one-object') {
			form.setFieldValue('fields', []);
		}
		console.log('payload', payload);

		if (onValuesChange) {
			const transformed = transformFormToExportConfig(payload);
			onValuesChange(changedValues, transformed);
		}
	};

	return (
		<Form
			form={form}
			layout='vertical'
			onValuesChange={(changed, all) => handleNodeValuesChange(changed, all, form, handleValuesChange)}
		>
			<Form.Item
				name='id'
				label={intl.formatMessage({ id: 'workflow.node.code' })}
				rules={[{ required: true, message: intl.formatMessage({ id: 'workflow.node.code.required' }) }]}
			>
				<Input placeholder={intl.formatMessage({ id: 'workflow.node.code.placeholder' })} />
			</Form.Item>

			<Form.Item
				name='label'
				label={intl.formatMessage({ id: 'workflow.node.label' })}
				rules={[{ required: true, message: intl.formatMessage({ id: 'workflow.node.label.required' }) }]}
			>
				<Input placeholder={intl.formatMessage({ id: 'workflow.node.label.placeholder' })} />
			</Form.Item>

			<Form.Item name='save' valuePropName='checked'>
				<Checkbox>Lưu file vào hệ thống (Trả về URL)</Checkbox>
			</Form.Item>

			<Card
				size='small'
				title={
					<Space>
						<FileWordOutlined /> <Text strong>FILE MẪU (.DOCX)</Text>
					</Space>
				}
				style={{ marginBottom: 16, borderColor: '#d9d9d9' }}
				headStyle={{ backgroundColor: '#fafafa', borderBottom: '1px solid #f0f0f0' }}
			>
				<Form.Item name='urlFile' rules={[...rules.fileRequired]} style={{ marginBottom: 16 }}>
					<UploadFile accept='.doc, .docx' maxCount={1} />
				</Form.Item>

				<Form.Item
					name='dataType'
					label={
						<Text strong style={{ fontSize: 12, color: '#666' }}>
							LOẠI DỮ LIỆU (DATA MAPPING)
						</Text>
					}
					style={{ marginBottom: 0 }}
				>
					<Radio.Group style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
						<Radio value='field'>
							<Space direction='vertical' size={0}>
								<Text strong>Field Mapping</Text>
							</Space>
						</Radio>
						<Radio value='data-one-object'>
							<Space direction='vertical' size={0}>
								<Text strong>One Object / Script </Text>
							</Space>
						</Radio>
					</Radio.Group>
				</Form.Item>
			</Card>

			<Form.Item noStyle shouldUpdate={(prev, curr) => prev.dataType !== curr.dataType}>
				{({ getFieldValue }) => {
					const dataType = getFieldValue('dataType');

					if (dataType === 'data-one-object') {
						return <ScriptMappingConfig />;
					}

					return (
						<div>
							<Divider orientation='left' style={{ margin: '16px 0' }}>
								<Text type='secondary'>MAPPING FIELDS</Text>
							</Divider>
							<FieldMappingConfig form={form} availableVariables={availableVariables || []} />
						</div>
					);
				}}
			</Form.Item>
		</Form>
	);
};

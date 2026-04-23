import { ConfigProps } from '@/components/Nodes/type';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import { Button, DatePicker, Form, Input, InputNumber, Radio, Select, Space } from 'antd';
import { useEffect, useRef } from 'react';
import { VariableSelector } from '../components/VariableSelector';
import { DataConditionOperator, DataConditionType, getOperatorsForType, needsRightValue } from './conditionTypes';
import { handleNodeValuesChange } from '../utils';

export interface ConditionConfig {
	id?: string;
	logic?: 'AND' | 'OR';
	conditions: Array<{
		leftValue: string;
		operator: DataConditionOperator;
		type: DataConditionType;
		rightValue: any;
	}>;
}

export const ConditionNodeConfig = ({
	initialValues,
	onValuesChange,
	availableVariables,
}: ConfigProps<ConditionConfig>) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const initializedRef = useRef(false);

	useEffect(() => {
		if (!initializedRef.current) {
			form.setFieldsValue(initialValues);
			initializedRef.current = true;
		}
	}, [initialValues, form]);

	return (
		<Form
			form={form}
			layout='vertical'
			onValuesChange={(changed, all) => handleNodeValuesChange(changed, all, form, onValuesChange)}
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

			{/* Logic Operator */}
			<Form.Item name='logic' label={intl.formatMessage({ id: 'workflow.node.condition.logic' })} initialValue='AND'>
				<Radio.Group>
					<Radio.Button value='AND'>AND</Radio.Button>
					<Radio.Button value='OR'>OR</Radio.Button>
				</Radio.Group>
			</Form.Item>

			{/* Conditions List */}
			<Form.List name='conditions'>
				{(fields, { add, remove }) => (
					<>
						<Form.Item label={intl.formatMessage({ id: 'workflow.node.condition.conditions' })}>
							<Button
								type='dashed'
								onClick={() =>
									add({
										type: DataConditionType.STRING,
										leftValue: '',
										operator: DataConditionOperator.EQUAL,
										rightValue: '',
									})
								}
								block
								icon={<PlusOutlined />}
							>
								{intl.formatMessage({ id: 'workflow.node.condition.add' })}
							</Button>
						</Form.Item>
						{fields.map(({ key, name, ...restField }) => (
							<div
								key={key}
								style={{
									padding: 12,
									marginBottom: 8,
									border: '1px solid #d9d9d9',
									borderRadius: 4,
									backgroundColor: '#fafafa',
									position: 'relative',
								}}
							>
								<DeleteOutlined
									onClick={() => remove(name)}
									style={{ position: 'absolute', top: 8, right: 8, color: '#ff4d4f', cursor: 'pointer' }}
								/>

								<Space direction='vertical' style={{ width: '100%' }} size='small'>
									{/* Type Selection */}
									<Form.Item
										{...restField}
										name={[name, 'type']}
										label={intl.formatMessage({ id: 'workflow.node.condition.type' })}
										rules={[
											{ required: true, message: intl.formatMessage({ id: 'workflow.node.condition.type.required' }) },
										]}
										style={{ marginBottom: 8 }}
									>
										<Select placeholder={intl.formatMessage({ id: 'workflow.node.condition.type.placeholder' })}>
											{Object.values(DataConditionType).map((type) => (
												<Select.Option key={type} value={type}>
													{type}
												</Select.Option>
											))}
										</Select>
									</Form.Item>

									{/* Left Value */}
									<Form.Item
										{...restField}
										name={[name, 'leftValue']}
										label={intl.formatMessage({ id: 'workflow.node.condition.leftValue' })}
										rules={[
											{
												required: true,
												message: intl.formatMessage({ id: 'workflow.node.condition.leftValue.required' }),
											},
										]}
										style={{ marginBottom: 8 }}
									>
										<VariableSelector
											availableVariables={availableVariables}
											placeholder='e.g., ={{userForm.amount}}'
										/>
									</Form.Item>

									{/* Operator */}
									<Form.Item
										{...restField}
										name={[name, 'operator']}
										label={intl.formatMessage({ id: 'workflow.node.condition.operator' })}
										rules={[
											{
												required: true,
												message: intl.formatMessage({ id: 'workflow.node.condition.operator.required' }),
											},
										]}
										style={{ marginBottom: 8 }}
										dependencies={[['conditions', name, 'type']]}
									>
										<Select placeholder={intl.formatMessage({ id: 'workflow.node.condition.operator.placeholder' })}>
											{(() => {
												const type = form.getFieldValue(['conditions', name, 'type']);
												const operators = type ? getOperatorsForType(type) : Object.values(DataConditionOperator);
												return operators.map((op) => (
													<Select.Option key={op} value={op}>
														{op}
													</Select.Option>
												));
											})()}
										</Select>
									</Form.Item>

									{/* Right Value - Dynamic based on type and operator */}
									<Form.Item dependencies={[['conditions', name, 'operator']]} style={{ marginBottom: 0 }}>
										{() => {
											const operator = form.getFieldValue(['conditions', name, 'operator']);
											if (!needsRightValue(operator)) {
												return null;
											}

											const type = form.getFieldValue(['conditions', name, 'type']);

											return (
												<Form.Item
													{...restField}
													name={[name, 'rightValue']}
													label={intl.formatMessage({ id: 'workflow.node.condition.rightValue' })}
													rules={[
														{
															required: true,
															message: intl.formatMessage({ id: 'workflow.node.condition.rightValue.required' }),
														},
													]}
												>
													{type === DataConditionType.NUMBER ? (
														<InputNumber placeholder='e.g., 1000' style={{ width: '100%' }} />
													) : type === DataConditionType.DATE ? (
														<DatePicker style={{ width: '100%' }} />
													) : type === DataConditionType.BOOLEAN ? (
														<Select placeholder={intl.formatMessage({ id: 'workflow.common.placeholder.select' })}>
															<Select.Option value={true}>
																{intl.formatMessage({ id: 'workflow.common.yes' })}
															</Select.Option>
															<Select.Option value={false}>
																{intl.formatMessage({ id: 'workflow.common.no' })}
															</Select.Option>
														</Select>
													) : (
														<Input placeholder={intl.formatMessage({ id: 'workflow.common.placeholder.input' })} />
													)}
												</Form.Item>
											);
										}}
									</Form.Item>
								</Space>
							</div>
						))}
						{fields.length === 0 && (
							<div
								style={{
									padding: 16,
									textAlign: 'center',
									color: '#8c8c8c',
									border: '1px dashed #d9d9d9',
									borderRadius: 4,
									fontSize: 12,
								}}
							>
								{intl.formatMessage({ id: 'workflow.node.condition.noConditions' })}
							</div>
						)}
					</>
				)}
			</Form.List>
		</Form>
	);
};

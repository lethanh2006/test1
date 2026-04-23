// import { getAvailableVariables } from '@/components/Nodes/getAvailableVariables';
import { NODE_REGISTRY } from '@/components/Nodes/registry';
import useAvailableVariables from '@/hooks/workflow/useAvailableVariables';
import { DeleteOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import { Button, message, Modal, Popconfirm, Row, Col, Spin, Table, Tag, Radio, Flex } from 'antd';
import { debounce } from 'lodash';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Form } from 'antd';
import { WorkflowNodeType } from '@/components/Nodes/nodeConstants';
import { GetManyInstances } from '@/services/Instance';
// import axios from '@/utils/axios';
// import { ip3 } from '@/utils/ip';

const TESTABLE_NODES = [
	WorkflowNodeType.SERVICE_SCRIPT,
	WorkflowNodeType.SERVICE_CALL_API,
	WorkflowNodeType.SERVICE_GET_INSTANCES,
	WorkflowNodeType.SERVICE_EXPORT_EXCEL,
	WorkflowNodeType.SERVICE_EXPORT_FILE,
];

interface NodeConfigPanelProps {
	open: boolean;
	onClose: () => void;
	selectedNodeId: string | null;
	nodes: any[];
	edges: any[];
	onConfigChange: (nodeId: string, config: Record<string, unknown>) => void;
	onDeleteNode: (nodeId: string) => void;
}

export const NodeConfigPanel = ({
	open,
	onClose,
	selectedNodeId,
	nodes,
	edges,
	onConfigChange,
	onDeleteNode,
}: NodeConfigPanelProps) => {
	const intl = useIntl();

	const { getAvailableVariables } = useAvailableVariables();
	const [availableVariables, setAvailableVariables] = useState<any[]>([]);
	const [addonVariablesMap, setAddonVariablesMap] = useState<Record<string, any[]>>({});
	const [form] = Form.useForm();
	const [showTestResult, setShowTestResult] = useState(false);
	const [testResult, setTestResult] = useState<any>(null);
	const [loadingTest, setLoadingTest] = useState(false);
	const [resultViewType, setResultViewType] = useState<'table' | 'json'>('table');

	const onConfigChangeRef = useRef(onConfigChange);
	onConfigChangeRef.current = onConfigChange;

	const selectedNode = nodes.find((n) => n.id === selectedNodeId);

	useEffect(() => {
		if (!selectedNodeId) {
			setAvailableVariables([]);
			return;
		}
		// 1. Get base ancestors variables for the main node config
		getAvailableVariables(selectedNodeId, nodes, edges, { includeAddons: false }).then((vars) => {
			setAvailableVariables(vars);
		});

		// 2. Get specific variables for each Add-on branch
		const actions = (selectedNode?.data?.config as any)?.addOn?.actions || [];
		if (actions.length > 0) {
			const map: Record<string, any[]> = {};
			Promise.all(
				actions.map(async (action: any) => {
					if (action.nextNodeId) {
						// For this specific action, we want Ancestors + THIS branch only
						const vars = await getAvailableVariables(selectedNodeId, nodes, edges, { 
							includeAddons: false, 
							specificBranchStarts: [action.nextNodeId] 
						});
						map[action.nextNodeId] = vars;
					}
				}),
			).then(() => {
				setAddonVariablesMap(map);
			});
		} else {
			setAddonVariablesMap({});
		}
	}, [selectedNodeId, nodes, edges, selectedNode]);

	const debouncedConfigChange = useMemo(
		() =>
			debounce((nodeId: string, config: Record<string, unknown>) => {
				onConfigChangeRef.current(nodeId, config);
			}, 300),
		[],
	);

	if (!selectedNode) return null;

	const nodeType = selectedNode.type;
	const nodeConfig = NODE_REGISTRY[nodeType as keyof typeof NODE_REGISTRY];
	const isTestable = TESTABLE_NODES.includes(nodeType as WorkflowNodeType);

	const handleRunTest = async () => {
		try {
			setLoadingTest(true);
			setShowTestResult(true);
			const values = form.getFieldsValue();
			console.log('Testing node with config:', values);
			
			// Mocking API call for execution
			// In real scenario: const response = await axios.post(`${ip3}/workflow/test-node`, { type: nodeType, config: values });
			
			// Simulate different results based on type
			if (nodeType === WorkflowNodeType.SERVICE_GET_INSTANCES) {
				const { condition, population, filters, workflowId } = values;
				const params: any = { population, filters };
				
				let conditionObj: any = {};
				if (condition) {
					try {
						conditionObj = typeof condition === 'string' ? JSON.parse(condition) : condition;
					} catch (e) {
						conditionObj = { _raw: condition };
					}
				}

				if (workflowId) {
					conditionObj.workflowId = workflowId;
				}

				params.condition = JSON.stringify(conditionObj);
				
				const res = await GetManyInstances(params);
				setTestResult(res?.data?.data || res?.data || []);
				setLoadingTest(false);
			} else {
				setTimeout(() => {
					if (nodeType === WorkflowNodeType.SERVICE_CALL_API) {
						setTestResult({ status: 200, data: { success: true, message: 'API called successfully' } });
					} else {
						setTestResult({ success: true, timestamp: new Date().toISOString() });
					}
					setLoadingTest(false);
				}, 1000);
			}
		} catch (error: any) {
			message.error('Lỗi khi chạy thử: ' + error.message);
			setLoadingTest(false);
		}
	};

	if (!nodeConfig || !nodeConfig.configComponent) {
		return (
			<Modal
				title={intl.formatMessage({ id: 'workflow.design.config.title' }, { name: selectedNode.data.label })}
				open={open}
				onCancel={onClose}
				footer={[
					<Button key='close' onClick={onClose}>
						{intl.formatMessage({ id: 'workflow.common.close' })}
					</Button>,
				]}
			>
				<div style={{ color: '#8c8c8c' }}>{intl.formatMessage({ id: 'workflow.design.config.noConfig' })}</div>
			</Modal>
		);
	}

	const ConfigComponent = nodeConfig.configComponent;

	const handleValuesChange = (_: any, allValues: any) => {
		debouncedConfigChange(selectedNode.id, allValues);
	};

	return (
		<Modal
			title={intl.formatMessage(
				{ id: 'workflow.design.config.title' },
				{ name: selectedNode.data.label || nodeConfig.label },
			)}
			open={open}
			onCancel={() => {
				setShowTestResult(false);
				setTestResult(null);
				onClose();
			}}
			width={showTestResult ? 1240 : 800}
			centered
			destroyOnClose
			maskClosable={false}
			footer={[
				<Popconfirm
					key='delete'
					title={intl.formatMessage({ id: 'workflow.design.config.deleteConfirm' })}
					description={intl.formatMessage({ id: 'workflow.design.config.deleteDesc' })}
					onConfirm={() => {
						onDeleteNode(selectedNode.id);
						onClose();
					}}
					okText={intl.formatMessage({ id: 'workflow.common.delete' })}
					cancelText={intl.formatMessage({ id: 'workflow.common.cancel' })}
					placement='topLeft'
				>
					<Button danger icon={<DeleteOutlined />} style={{ float: 'left' }}>
						{intl.formatMessage({ id: 'workflow.design.config.deleteBtn' })}
					</Button>
				</Popconfirm>,
				isTestable && (
					<Button key='test' onClick={handleRunTest} loading={loadingTest} style={{ backgroundColor: '#52c41a', color: 'white', border: 'none' }}>
						Chạy thử
					</Button>
				),
				<Button
					key='close'
					type='primary'
					onClick={() => {
						if (nodeConfig.validate) {
							const result = nodeConfig.validate({
								label: selectedNode.data.label,
								...(selectedNode.data.config || {}),
							});
							if (!result.isValid) {
								message.error(result.message);
								return;
							}
						}
						onClose();
					}}
				>
					{intl.formatMessage({ id: 'workflow.design.config.finishBtn' })}
				</Button>,
			]}
			styles={{ body: { maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', paddingRight: 8 } }}
		>
			<Row gutter={24}>
				<Col span={showTestResult ? 12 : 24}>
					<ConfigComponent
						initialValues={{
							id: selectedNode.id,
							label: selectedNode.data.label,
							...(selectedNode.data.config || {}),
						}}
						onValuesChange={handleValuesChange}
						availableVariables={availableVariables}
						nodes={nodes}
						addonVariablesMap={addonVariablesMap}
						form={form}
					/>
				</Col>
				{showTestResult && (
					<Col span={12} style={{ borderLeft: '1px solid #f0f0f0', minHeight: 400 }}>
						<div style={{ padding: '0 12px' }}>
							<Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
								<Tag color="processing">Kết quả chạy thử</Tag>
								<Radio.Group 
									size="small" 
									value={resultViewType} 
									onChange={(e) => setResultViewType(e.target.value)}
								>
									<Radio.Button value="table">Table</Radio.Button>
									<Radio.Button value="json">JSON</Radio.Button>
								</Radio.Group>
							</Flex>
							
							<Spin spinning={loadingTest}>
								{testResult ? (
									resultViewType === 'table' && Array.isArray(testResult) ? (
										<Table
											dataSource={testResult}
											columns={Array.from(new Set(testResult.flatMap(obj => Object.keys(obj)))).map((key) => ({
												title: key,
												dataIndex: key,
												key,
												width: 150,
												ellipsis: true,
											}))}
											size="small"
											pagination={{ pageSize: 5, size: 'small' }}
											scroll={{ x: 'max-content' }}
										/>
									) : (
										<pre style={{ 
											backgroundColor: '#f5f5f5', 
											padding: '12px', 
											borderRadius: 4, 
											overflow: 'auto', 
											maxHeight: 500,
											fontSize: '12px',
											fontFamily: 'monospace',
											border: '1px solid #d9d9d9'
										}}>
											{JSON.stringify(testResult, null, 2)}
										</pre>
									)
								) : (
									<div style={{ color: '#8c8c8c', textAlign: 'center', marginTop: 40 }}>Đang chờ kết quả...</div>
								)}
							</Spin>
						</div>
					</Col>
				)}
			</Row>
		</Modal>
	);
};

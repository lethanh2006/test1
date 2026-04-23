import { BaseNode } from '@/components/Nodes/BaseNode';
import { WorkflowNodeType } from '@/components/Nodes/nodeConstants';
import { NODE_REGISTRY } from '@/components/Nodes/registry';
import { AppNode } from '@/components/Nodes/type';
import { EditOutlined } from '@ant-design/icons';
import { NodeProps } from '@xyflow/react';

const EditFieldNodeVisual: React.FC<NodeProps<AppNode>> = (props) => {
	return (
		<BaseNode
			{...props}
			icon={<EditOutlined style={{ color: '#722ed1' }} />}
			color={NODE_REGISTRY[WorkflowNodeType.SERVICE_EDIT_FIELD].color}
			title={NODE_REGISTRY[WorkflowNodeType.SERVICE_EDIT_FIELD].label}
		/>
	);
};

export default EditFieldNodeVisual;

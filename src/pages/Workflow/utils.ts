import { WorkflowNodeType } from '@/components/Nodes/nodeConstants';
import { Workflow } from '@/services/Workflow/typing';
import { removeVietnameseTones } from '@/utils/utils';

/**
 * Interface cho định dạng Output (Backend)
 */
export interface PayloadWorkflow {
  _id?: string;
  ten: string;
  moTa: string;
  node: Record<string, PayloadNode>;
}

export interface PayloadNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  next?: string[] | Record<string, string | string[]>;
  [key: string]: any;
}

/**
 * Hàm transform dữ liệu Workflow từ React Flow sang cấu trúc Backend
 * @param workflow Dữ liệu gốc từ React Flow
 * @returns Object đã transform để lưu DB
 */
export const transformWorkflowToBackend = (workflow: Workflow.IWorkflow): PayloadWorkflow => {
  const { _id, name, description, nodes, edges } = workflow;

  const transformedNodes: Record<string, PayloadNode> = {};

  nodes.forEach((node) => {
    const configData = node.data.config || {};

    const nodeType = node.type;

    transformedNodes[node.id] = {
      id: node.id,
      name: node.data.label,
      type: nodeType,
      position: node.position,
      config: {
        ...configData,
      }
    };
  });

  const edgesBySource: Record<string, Workflow.IEdge[]> = {};
  edges.forEach((edge) => {
    if (edge.id.startsWith('xy-edge-addon__')) return; // Ignore add-on edges

    if (!edgesBySource[edge.source]) {
      edgesBySource[edge.source] = [];
    }
    edgesBySource[edge.source].push(edge);
  });

  Object.keys(transformedNodes).forEach((nodeId) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;

    const sourceEdges = edgesBySource[nodeId] || [];
    if (sourceEdges.length === 0) return;

    const nodeType = node.type;

    if (nodeType === WorkflowNodeType.SERVICE_CONDITION) {
      const nextObj: Record<string, string[]> = {};

      sourceEdges.forEach((edge) => {
        let outcomeKey: 'true' | 'false' | null = null;
        if (edge.sourceHandle === 'out-0' || edge.sourceHandle === null) {
          outcomeKey = 'true';
        } else if (edge.sourceHandle === 'out-1') {
          outcomeKey = 'false';
        }

        if (outcomeKey) {
          if (!nextObj[outcomeKey]) nextObj[outcomeKey] = [];
          nextObj[outcomeKey].push(edge.target);
        }
      });

      if (Object.keys(nextObj).length > 0) {
        transformedNodes[nodeId].next = nextObj;
      }

    } else if (nodeType === WorkflowNodeType.USER_ACTION) {
      const nextObj: Record<string, string[]> = {};
      const actions = (node.data.config as any)?.actions || [];

      sourceEdges.forEach((edge) => {
        if (edge.sourceHandle && edge.sourceHandle.startsWith('out-')) {
          const index = parseInt(edge.sourceHandle.split('-')[1], 10);
          if (!isNaN(index) && actions[index]) {
            const outcomeId = actions[index].id; // e.g., "approved", "rejected"
            if (!nextObj[outcomeId]) nextObj[outcomeId] = [];
            nextObj[outcomeId].push(edge.target);
          }
        }
      });

      if (Object.keys(nextObj).length > 0) {
        transformedNodes[nodeId].next = nextObj;
      }

    } else {
      const targets = sourceEdges.map((e) => e.target);
      if (targets.length > 0) {
        transformedNodes[nodeId].next = targets;
      }
    }
  });

  return {
    _id: _id || '',
    ten: name,
    moTa: description || '',
    node: transformedNodes,
  };
};

/**
 * Hàm transform dữ liệu từ Backend về lại React Flow structure
 */
export const transformBackendToWorkflow = (payload: PayloadWorkflow): Workflow.IWorkflow => {
  const { _id, ten, moTa, node: backendNodes } = payload; // payload.nodes is Record<string, PayloadNode>

  const nodes: Workflow.INode[] = [];
  const edges: Workflow.IEdge[] = [];

  // Duyệt qua từng node trong object "nodes" của backend
  Object.values(backendNodes).forEach((bNode) => {
    // 1. Phục hồi Nodes
    nodes.push({
      id: bNode.id,
      type: bNode.type as WorkflowNodeType,
      position: bNode.position || { x: 0, y: 0 },
      data: {
        label: bNode.name || bNode.type,
        config: bNode.config || {},
      },
      // Các thuộc tính mặc định
      measured: { width: 180, height: 50 },
      selected: false,
      dragging: false,
    } as Workflow.INode);

    // 2. Phục hồi Edges từ thuộc tính "next"
    if (!bNode.next) return;

    if (Array.isArray(bNode.next)) {
      // Trường hợp next là mảng (Normal nodes)
      bNode.next.forEach((targetId) => {
        edges.push(createEdge(bNode.id, targetId));
      });
    } else if (typeof bNode.next === 'object') {
      // Trường hợp next là object (Condition hoặc Approval)
      const nextObj = bNode.next as Record<string, string | string[]>;

      Object.entries(nextObj).forEach(([key, value]) => {
        let sourceHandle: string | undefined = undefined;

        // Logic phục hồi Handle dựa trên key
        if (key === 'true') sourceHandle = 'out-0';
        else if (key === 'false') sourceHandle = 'out-1';
        else {
          // Đối với USER_ACTION, tìm index của action dựa trên key (id của action)
          // bNode.config.actions là nơi chứa mảng actions
          const actions = (bNode.config as any)?.actions || [];
          const actionIndex = actions.findIndex((a: any) => a.id === key);
          if (actionIndex !== -1) {
            sourceHandle = `out-${actionIndex}`;
          }
        }

        if (Array.isArray(value)) {
          value.forEach((targetId) => {
            edges.push(createEdge(bNode.id, targetId, sourceHandle));
          });
        } else {
          edges.push(createEdge(bNode.id, value, sourceHandle));
        }
      });
    }

    // 3. Phục hồi Edges từ Add-on actions
    const addOnActions = (bNode.config as any)?.addOn?.actions || [];
    addOnActions.forEach((action: any) => {
      if (action.nextNodeId) {
        edges.push({
          id: `xy-edge-addon__${bNode.id}-${action.id}-${action.nextNodeId}`,
          source: bNode.id,
          target: action.nextNodeId,
          sourceHandle: 'addon',
          type: 'smoothstep',
          animated: true,
          style: {
            stroke: '#eb2f96',
            strokeWidth: 2,
            strokeDasharray: '5,5',
          },
        });
      }
    });
  });

  return {
    _id: _id,
    name: ten,
    description: moTa,
    nodes,
    edges,
  };
};

// Hàm helper để tạo Edge object
const createEdge = (source: string, target: string, sourceHandle: string | undefined = undefined): Workflow.IEdge => {
  const edgeId = `xy-edge__${source}${sourceHandle ? '-' + sourceHandle : ''}-${target}`;
  return {
    id: edgeId,
    source,
    target,
    sourceHandle,
    type: 'smoothstep',
    animated: true,
    style: {
      stroke: '#94a3b8',
      strokeWidth: 2,
    },
  };
};

export const convertDotToCamelCase = (str: string): string => {
  if (!str) return '';
  return str.replace(/\.(.)/g, (_, char) => char.toUpperCase());
};

/**
 * Chuyển đổi nhãn (label) tiếng Việt sang ID (camelCase, không dấu)
 */
export const convertToNodeId = (label: string): string => {
  if (!label) return '';
  // 1. Bỏ dấu tiếng Việt và ký tự đặc biệt
  const noTones = removeVietnameseTones(label, true);
  // 2. Chuyển thành camelCase
  return noTones
    .split(/\s+/)
    .map((word, index) => {
      const lower = word.toLowerCase();
      if (index === 0) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join('');
};

/**
 * Hàm parse biến workflow từ định dạng ={{nodeId.property}} 
 * @param str Chuỗi biến (vd: ={{serviceExportfile_1771836347756.value}})
 * @returns Object { key, typeValue }
 */
export const parseWorkflowVariable = (str: string) => {
  if (!str) return null;
  const match = str.match(/^=?{{([^.\s]+)\.([^}\s]+)}}/);
  if (match) {
    return {
      key: match[1],
      typeValue: match[2],
    };
  }
  return null;
};





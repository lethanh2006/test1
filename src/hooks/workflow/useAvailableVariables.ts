import { WorkflowNodeType } from '@/components/Nodes/nodeConstants';
import { NodeData, WorkflowVariable } from '@/components/Nodes/type';
import { EKieuDuLieu } from '@/services/DanhMuc/BieuMau/constant';
import { useModel } from '@umijs/max';
import type { Edge, Node } from '@xyflow/react';

const EXTERNAL_FORM_CACHE: Record<string, any[]> = {};

const useAvailableVariables = () => {
  const { getByIdModel: getFormById } = useModel('danhmuc.bieumau')


  function getAncestorNodes(
    currentNodeId: string,
    nodes: Node<NodeData>[],
    edges: Edge[],
  ): Node<NodeData>[] {
    const visited = new Set<string>();
    const queue: string[] = [currentNodeId];
    const ancestors: Node<NodeData>[] = [];

    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      if (visited.has(nodeId)) continue;
      visited.add(nodeId);

      const incomingEdges = edges.filter((e) => e.target === nodeId);
      for (const edge of incomingEdges) {
        const sourceNode = nodes.find((n) => n.id === edge.source);
        if (sourceNode && !visited.has(sourceNode.id)) {
          ancestors.push(sourceNode);
          queue.push(sourceNode.id);
        }
      }
    }

    return ancestors;
  }

  function getAddonBranchNodes(
    currentNodeId: string,
    nodes: Node<NodeData>[],
    edges: Edge[],
    specificBranchStarts?: string[],
  ): Node<NodeData>[] {
    const currentNode = nodes.find((n) => n.id === currentNodeId);
    if (!currentNode) return [];

    let branchStarts: string[] = [];
    if (specificBranchStarts && specificBranchStarts.length > 0) {
      branchStarts = specificBranchStarts;
    } else {
      const addOnActions = (currentNode.data?.config as any)?.addOn?.actions || [];
      branchStarts = addOnActions.map((a: any) => a.nextNodeId).filter(Boolean);
    }

    if (branchStarts.length === 0) return [];

    const visited = new Set<string>();
    const queue: string[] = [...branchStarts];
    const branchNodes: Node<NodeData>[] = [];

    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      if (visited.has(nodeId)) continue;
      visited.add(nodeId);

      const node = nodes.find((n) => n.id === nodeId);
      if (node) {
        branchNodes.push(node);
        const outgoingEdges = edges.filter((e) => e.source === nodeId);
        for (const edge of outgoingEdges) {
          queue.push(edge.target);
        }
      }
    }

    return branchNodes;
  }

  async function extractVariablesFromNode(node: Node<NodeData>): Promise<WorkflowVariable[]> {
    const nodeType = node.type as WorkflowNodeType;
    const config = node.data?.config || {};
    const nodeName = node.id ?? node.data?.label;
    const externalFormId = config?.externalFormId;
    const variables: WorkflowVariable[] = [];
    const kieuDuLieuDuocThongQua = [
      EKieuDuLieu.DOAN_VAN_BAN,
      EKieuDuLieu.NUMBER,
      EKieuDuLieu.DECIMAL,
      EKieuDuLieu.TEXT,
      EKieuDuLieu.BOOLEAN,
      EKieuDuLieu.HOUR,
      EKieuDuLieu.DATE,
      EKieuDuLieu.MONTH,
    ];

    switch (nodeType) {
      case WorkflowNodeType.USER_FORM: {
        if (externalFormId) {
          let fieldsInternalForm = EXTERNAL_FORM_CACHE[externalFormId as string];
          if (!fieldsInternalForm) {
            try {
              const formDt = await getFormById(externalFormId as string);
              fieldsInternalForm = formDt?.cauHinhLoaiHinh || [];
              EXTERNAL_FORM_CACHE[externalFormId as string] = fieldsInternalForm;
            } catch (error) {
              fieldsInternalForm = [];
            }
          }

          for (const field of fieldsInternalForm) {
            if ((field.ten || field.ma) && kieuDuLieuDuocThongQua.includes(field.kieuDuLieu)) {
              variables.push({
                label: field.ten,
                value: `${nodeName}.${field.ma}`,
                type: field.kieuDuLieu || 'text',
                nodeName,
              });
            }
          }
        } else {
          const fields = (config.fields as any[]) || [];

          for (const field of fields) {
            if (field.name) {
              variables.push({
                label: field.label || field.name,
                value: `${nodeName}.${field.name}`,
                type: field.type || 'text',
                nodeName,
              });
            }
          }
        }
        break;
      }

      case WorkflowNodeType.USER_ACTION: {
        variables.push({
          label: 'Kết quả hành động',
          value: `${nodeName}.value`,
          type: 'string',
          nodeName,
        });
        break;
      }

      case WorkflowNodeType.SERVICE_CALL_API: {
        const responsePaths = (config.response as string[]) || [];
        for (const path of responsePaths) {
          if (path) {
            variables.push({
              label: path,
              value: `${nodeName}.${path}`,
              type: 'any',
              nodeName,
            });
          }
        }
        break;
      }

      case WorkflowNodeType.SERVICE_SCRIPT: {
        variables.push({
          label: 'Kết quả script',
          value: `${nodeName}.value`,
          type: 'any',
          nodeName,
        });
        break;
      }

      case WorkflowNodeType.SERVICE_CONDITION: {
        variables.push({
          label: 'Kết quả điều kiện',
          value: `${nodeName}.value`,
          type: 'boolean',
          nodeName,
        });
        break;
      }

      case WorkflowNodeType.SERVICE_GET_INSTANCES: {
        variables.push({
          label: 'Danh sách instance',
          value: `${nodeName}.value`,
          type: 'array',
          nodeName,
        });
        break;
      }

      case WorkflowNodeType.SERVICE_EXPORT_EXCEL: {
        variables.push({
          label: 'File Excel URL',
          value: `${nodeName}.value`,
          type: 'string',
          nodeName,
        });
        break;
      }

      case WorkflowNodeType.SERVICE_JOIN: {
        variables.push({
          label: 'Kết quả Join',
          value: `${nodeName}.value`,
          type: 'any',
          nodeName,
        });
        break;
      }

      case WorkflowNodeType.SERVICE_EXPORT_FILE: {
        variables.push({
          label: 'File URL',
          value: `${nodeName}.value`,
          type: 'string',
          nodeName,
        });
        break;
      }

      default:
        break;
    }

    return variables;
  }

  /**
   * Tính toán danh sách biến khả dụng cho một node từ tất cả các node thượng nguồn.
   */
  async function getAvailableVariables(
    currentNodeId: string,
    nodes: Node<NodeData>[],
    edges: Edge[],
    options: {
      includeAddons?: boolean;
      specificBranchStarts?: string[];
    } = { includeAddons: true }
  ): Promise<WorkflowVariable[]> {
    const ancestors = getAncestorNodes(currentNodeId, nodes, edges);
    let branchNodes: Node<NodeData>[] = [];
    
    if (options.includeAddons || (options.specificBranchStarts && options.specificBranchStarts.length > 0)) {
       branchNodes = getAddonBranchNodes(currentNodeId, nodes, edges, options.specificBranchStarts);
    }

    const variables: WorkflowVariable[] = [];

    // Global variables
    variables.push(
      { label: 'Người khởi tạo', value: 'context.initiator', type: 'string', nodeName: 'Context' },
      { label: 'ID Quy trình', value: 'context.workflowId', type: 'string', nodeName: 'Context' },
      { label: 'ID Hồ sơ', value: 'context.instanceId', type: 'string', nodeName: 'Context' },
    );

    const currentNode = nodes.find((n) => n.id === currentNodeId);
    const allRelevantNodes = [...ancestors, ...branchNodes];
    if (currentNode) {
      allRelevantNodes.push(currentNode);
    }

    const uniqueNodes = Array.from(new Set(allRelevantNodes.map((n) => n.id)))
      .map((id) => allRelevantNodes.find((n) => n.id === id))
      .filter(Boolean) as Node<NodeData>[];

    for (const node of uniqueNodes) {
      const nodeVars = await extractVariablesFromNode(node);
      variables.push(...nodeVars);
    }

    return variables;
  }

  return {
    getAvailableVariables,
  };
};

export default useAvailableVariables;
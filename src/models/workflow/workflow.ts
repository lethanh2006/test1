import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import useInitModel from '@/hooks/useInitModel';

import { transformBackendToWorkflow, transformWorkflowToBackend } from '@/pages/Workflow/utils';
import { Workflow } from '@/services/Workflow/typing';
import type { Edge } from '@xyflow/react';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const objInit = useInitModel<Workflow.IRecordWorkflow>('workflow');
  // ============ State ============
  const [workflows, setWorkflows] = useState<Workflow.IWorkflow[]>([]);
  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow.IWorkflow | null>(null);
  const [nodes, setNodes] = useState<Workflow.INode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [loading, setLoading] = useState(false);

  // ==== state thẩm quyền =======
  const [visibleDanhSachBoPhan, setVisibleDanhSachBoPhan] = useState(false);
  const [recordBoPhanXuLy, setRecordBoPhanXuLy] = useState<any>(null);
  const [editBoPhan, setEditBoPhan] = useState(false);
  const [visibleDanhSachCanBoXuLy, setVisibleDanhSachCanBoXuLy] = useState<boolean>(false);

  // ============ Actions ============
  /**
   * Load workflow for editing
   */
  const loadWorkflowForEdit = async (id: string) => {
    setLoading(true);
    try {
      const workflow = await objInit.getByIdModel(id);

      if (!workflow) {
        message.error('Không tìm thấy workflow');
        return;
      }

      const transformedWorkflow = transformBackendToWorkflow(workflow);
      setCurrentWorkflow(transformedWorkflow);
      setNodes(transformedWorkflow.nodes as Workflow.INode[]);
      setEdges(transformedWorkflow.edges as Edge[]);
      setIsDirty(false);
      setSelectedNodeId(null);
    } catch (error) {
      message.error('Lỗi khi tải workflow');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Save current workflow
   */
  const saveWorkflow = async () => {
    if (!currentWorkflow || !currentWorkflow._id) {
      message.error('Không có workflow để lưu');
      return false;
    }

    const updatedWorkflow: Workflow.IWorkflow = {
      ...currentWorkflow,
      nodes: nodes as Workflow.INode[],
      edges: edges as Workflow.IEdge[],
    };

    setWorkflows((prev) => prev.map((w) => (w._id === updatedWorkflow._id ? updatedWorkflow : w)));
    setCurrentWorkflow(updatedWorkflow);
    setIsDirty(false);

    const backendData = transformWorkflowToBackend(updatedWorkflow);
    console.log('Backend Transformed JSON:', JSON.stringify(backendData, null, 2));

    try {
      await objInit.putModel(currentWorkflow._id, backendData);
    } catch (error) {
      message.error('Lỗi khi lưu workflow');
      return false;
    }

    return true;
  };

  const updateNodeConfig = (nodeId: string, config: Record<string, unknown>) => {
    const { id: newId, label, ...restConfig } = config;

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            id: (newId as string) || node.id,
            data: {
              ...node.data,
              label: label !== undefined ? (label as string) : node.data.label,
              config: {
                ...(node.data.config || {}),
                ...restConfig,
              },
            },
          };
        }
        return node;
      }),
    );

    // Update edges if ID changed
    if (newId && newId !== nodeId) {
      setEdges((eds) =>
        eds.map((edge) => ({
          ...edge,
          source: edge.source === nodeId ? (newId as string) : edge.source,
          target: edge.target === nodeId ? (newId as string) : edge.target,
        })),
      );
      // Keep selection on the new ID
      if (selectedNodeId === nodeId) {
        setSelectedNodeId(newId as string);
      }
    }

    // Update addon edges for this node
    setEdges((eds) => {
      // Remove old addon edges for this node
      const currentSource = newId ? (newId as string) : nodeId;
      const filteredEds = eds.filter((edge) => !(edge.source === currentSource && edge.id.startsWith('xy-edge-addon__')));
      
      const addOnActions = (restConfig.addOn as any)?.actions || [];
      const newAddonEdges = addOnActions
        .filter((action: any) => action.nextNodeId)
        .map((action: any) => ({
          id: `xy-edge-addon__${currentSource}-${action.id}-${action.nextNodeId}`,
          source: currentSource,
          target: action.nextNodeId,
          sourceHandle: 'addon',
          type: 'smoothstep',
          animated: true,
          style: {
            stroke: '#eb2f96',
            strokeWidth: 2,
            strokeDasharray: '5,5',
          },
        }));

      return [...filteredEds, ...newAddonEdges];
    });

    setIsDirty(true);
  };

  const isReachable = (startNodeId: string, targetNodeId: string, allNodes: Workflow.INode[], allEdges: Edge[]): boolean => {
    const visited = new Set<string>();
    const queue = [startNodeId];

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current === targetNodeId) return true;
      if (visited.has(current)) continue;
      visited.add(current);

      const outgoing = allEdges.filter((e) => e.source === current);
      for (const edge of outgoing) {
        queue.push(edge.target);
      }
    }
    return false;
  };

  const onConnect = (connection: any) => {
    if (connection.sourceHandle === 'addon') {
      const sourceNode = nodes.find((n) => n.id === connection.source);
      const targetNode = nodes.find((n) => n.id === connection.target);

      if (!sourceNode || !targetNode) return;

      // Validate cycle
      if (isReachable(connection.target, connection.source, nodes, edges)) {
        message.error('Không thể nối: Hành động này sẽ tạo ra một chu trình (vòng lặp)!');
        return;
      }

      // Automatically add Add-on action
      const currentAddOns = (sourceNode.data.config.addOn as any)?.actions || [];
      const newActionId = `addon_${Date.now()}`;
      const newAction = {
        id: newActionId,
        name: `Action ${currentAddOns.length + 1}`,
        enabled: true,
        scope: 'INSTANCE',
        nextNodeId: connection.target,
        response: [],
      };

      updateNodeConfig(sourceNode.id, {
        addOn: {
          actions: [...currentAddOns, newAction],
        },
      });

      message.success(`Đã tự động thêm Add-on action nối tới node ${targetNode.data.label}`);
    } else {
      // Normal edge
      setEdges((eds) => {
        const newEdges = (eds as any).concat({
          ...connection,
          id: `edge-${connection.source}-${connection.target}-${Date.now()}`,
          type: 'smoothstep',
          animated: true,
        });
        setIsDirty(true);
        return newEdges;
      });
    }
  };

  const onEdgesDelete = (edgesToDelete: Edge[]) => {
    const deletedAddonEdges = edgesToDelete.filter((edge) => edge.sourceHandle === 'addon');
    
    if (deletedAddonEdges.length > 0) {
      setNodes((nds) => 
        nds.map((node) => {
          // Find edges related to this node
          const edgesForNode = deletedAddonEdges.filter(e => e.source === node.id);
          if (edgesForNode.length > 0) {
            const currentAddOns = (node.data.config.addOn as any)?.actions || [];
            if (currentAddOns.length > 0) {
              const targetNodeIdsToRemove = edgesForNode.map(e => e.target);
              const remainingActions = currentAddOns.filter(
                 (a: any) => !targetNodeIdsToRemove.includes(a.nextNodeId)
              );
              return {
                ...node,
                data: {
                  ...node.data,
                  config: {
                    ...node.data.config,
                    addOn: {
                      ...((node.data.config.addOn as any) || {}),
                      actions: remainingActions,
                    }
                  }
                }
              };
            }
          }
          return node;
        })
      );
      setIsDirty(true);
    }
  };

  const deleteNode = (nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    setSelectedNodeId(null);
    setIsDirty(true);
    message.success('Đã xóa node');
  };

  const duplicateWorkflow = async (id: string) => {
    setLoading(true);
    try {
      await axios.post(`${ip3}/workflow/duplicate/${id}`);
      message.success('Nhân bản quy trình thành công');
      objInit.getModel();
    } catch (error) {
      message.error('Lỗi khi nhân bản quy trình');
    } finally {
      setLoading(false);
    }
  };

  return {
    ...objInit,
    // State
    workflows,
    currentWorkflow,
    nodes,
    edges,
    selectedNodeId,
    isDirty,
    loading,
    visibleDanhSachBoPhan,
    recordBoPhanXuLy,
    editBoPhan,
    visibleDanhSachCanBoXuLy,

    // Setters
    setWorkflows,
    setCurrentWorkflow,
    setNodes,
    setEdges,
    setSelectedNodeId,
    setIsDirty,
    setLoading,
    setVisibleDanhSachBoPhan,
    setRecordBoPhanXuLy,
    setEditBoPhan,
    setVisibleDanhSachCanBoXuLy,

    // Actions
    loadWorkflowForEdit,
    saveWorkflow,
    updateNodeConfig,
    deleteNode,
    onConnect,
    onEdgesDelete,
    duplicateWorkflow,
  };
};

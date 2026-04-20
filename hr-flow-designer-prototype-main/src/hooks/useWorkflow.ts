import { useCallback, useState } from 'react';
import {
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  XYPosition,
  OnConnect,
} from 'reactflow';
import { WorkflowNode, WorkflowEdge, NodeType, WorkflowNodeData } from '../lib/workflow/types';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@blinkdotnew/ui';

const initialNodes: WorkflowNode[] = [
  {
    id: 'start-1',
    type: 'start',
    data: { label: 'Workflow Start', type: 'start', config: {} },
    position: { x: 250, y: 100 },
  },
];

const initialEdges: WorkflowEdge[] = [];

export const useWorkflow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);

  const onNodeClick = useCallback((_: React.MouseEvent, node: WorkflowNode) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const addNode = useCallback((type: NodeType, position: XYPosition) => {
    // Constraint: Only one Start Node allowed
    if (type === 'start') {
      const hasStart = nodes.some((n) => n.data.type === 'start');
      if (hasStart) {
        toast.error('Workflow can only have one Start Node');
        return;
      }
    }

    const newNode: WorkflowNode = {
      id: `${type}-${uuidv4()}`,
      type,
      data: { 
        label: `${type.charAt(0).toUpperCase() + type.slice(1)} Step`, 
        type, 
        config: {} 
      },
      position,
    };

    setNodes((nds) => nds.concat(newNode));
  }, [nodes, setNodes]);

  const onConnect: OnConnect = useCallback(
    (params: Connection) => {
      // Constraint: No incoming edges to Start Node
      const targetNode = nodes.find(n => n.id === params.target);
      if (targetNode?.data.type === 'start') {
        toast.error('Start Node cannot have incoming connections');
        return;
      }

      // Constraint: No outgoing edges from End Node
      const sourceNode = nodes.find(n => n.id === params.source);
      if (sourceNode?.data.type === 'end') {
        toast.error('End Node cannot have outgoing connections');
        return;
      }

      setEdges((eds) => addEdge({ ...params, animated: true },eds));
    },
    [nodes, setEdges]
  );

  const updateNodeData = useCallback((nodeId: string, newData: Partial<WorkflowNodeData>) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          const updatedNode = {
            ...node,
            data: {
              ...node.data,
              ...newData,
            },
          };
          if (selectedNode?.id === nodeId) {
            setSelectedNode(updatedNode);
          }
          return updatedNode;
        }
        return node;
      })
    );
  }, [setNodes, selectedNode]);

  return {
    nodes,
    edges,
    selectedNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeClick,
    onPaneClick,
    addNode,
    updateNodeData,
    setNodes,
    setEdges,
  };
};

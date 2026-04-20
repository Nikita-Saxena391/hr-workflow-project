import { Node, Edge } from 'reactflow';

export type NodeType = 'start' | 'task' | 'approval' | 'automation' | 'end';

export interface WorkflowNodeData {
  label: string;
  type: NodeType;
  config: Record<string, any>;
}

export type WorkflowNode = Node<WorkflowNodeData>;
export type WorkflowEdge = Edge;

export interface AutomationAction {
  id: string;
  label: string;
  params: string[];
}

export interface SimulationStep {
  nodeId: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  timestamp: string;
}

export interface WorkflowSimulationResult {
  steps: SimulationStep[];
  success: boolean;
  error?: string;
}

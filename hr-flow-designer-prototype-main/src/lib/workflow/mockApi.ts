import { AutomationAction, WorkflowSimulationResult, WorkflowNode, WorkflowEdge } from './types';

export const mockAutomations: AutomationAction[] = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject', 'body'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
  { id: 'slack_notify', label: 'Slack Notification', params: ['channel', 'message'] },
  { id: 'update_hris', label: 'Update HRIS System', params: ['employee_id', 'field', 'value'] },
];

export const getAutomations = async (): Promise<AutomationAction[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockAutomations;
};

export const simulateWorkflow = async (
  nodes: WorkflowNode[],
  edges: WorkflowEdge[]
): Promise<WorkflowSimulationResult> => {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const steps: WorkflowSimulationResult['steps'] = [];
  const startNode = nodes.find((n) => n.data.type === 'start');

  if (!startNode) {
    return {
      success: false,
      error: 'Workflow must have a Start Node',
      steps: [],
    };
  }

  // Basic BFS/DFS to simulate steps
  const visited = new Set<string>();
  const queue: string[] = [startNode.id];

  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    if (visited.has(nodeId)) continue;
    visited.add(nodeId);

    const node = nodes.find((n) => n.id === nodeId);
    if (!node) continue;

    steps.push({
      nodeId,
      status: 'success',
      message: `Executed ${node.data.type}: ${node.data.label}`,
      timestamp: new Date().toISOString(),
    });

    const outgoingEdges = edges.filter((e) => e.source === nodeId);
    for (const edge of outgoingEdges) {
      queue.push(edge.target);
    }
  }

  const hasEndNode = nodes.some((n) => n.data.type === 'end' && visited.has(n.id));
  
  const unreachableNodes = nodes.filter(n => !visited.has(n.id));
  if (unreachableNodes.length > 0 && hasEndNode) {
    steps.push({
      nodeId: 'validation',
      status: 'error',
      message: `Warning: ${unreachableNodes.length} nodes are unreachable from Start`,
      timestamp: new Date().toISOString(),
    });
  }

  return {
    success: hasEndNode,
    error: hasEndNode ? undefined : 'Workflow does not reach an End Node',
    steps,
  };
};

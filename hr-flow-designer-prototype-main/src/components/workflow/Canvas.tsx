import React, { useCallback, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  ReactFlowProvider,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Sidebar } from './Sidebar';
import { useWorkflow } from '../../hooks/useWorkflow';
import { StartNode, TaskNode, ApprovalNode, AutomationNode, EndNode } from './nodes/CustomNodes';
import { NodeType } from '../../lib/workflow/types';
import { PropertiesPanel } from './PropertiesPanel';
import { Button, toast } from '@blinkdotnew/ui';
import { Play, Download, Upload } from 'lucide-react';
import { SimulationPanel } from './SimulationPanel';

const nodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automation: AutomationNode,
  end: EndNode,
};

const WorkflowCanvas: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeClick,
    onPaneClick,
    addNode,
    selectedNode,
    updateNodeData,
    setNodes,
    setEdges,
  } = useWorkflow();

  const [isSimulating, setIsSimulating] = React.useState(false);

  const onExport = useCallback(() => {
    const workflow = { nodes, edges };
    const blob = new Blob([JSON.stringify(workflow, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `workflow-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Workflow exported successfully');
  }, [nodes, edges]);

  const onImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const workflow = JSON.parse(ev.target?.result as string);
        if (workflow.nodes && workflow.edges) {
          setNodes(workflow.nodes);
          setEdges(workflow.edges);
          toast.success('Workflow imported successfully');
        } else {
          toast.error('Invalid workflow structure');
        }
      } catch (err) {
        toast.error('Invalid workflow file');
      }
    };
    reader.readAsText(file);
    // Reset input
    event.target.value = '';
  }, [setNodes, setEdges]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow') as NodeType;

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      addNode(type, position);
    },
    [addNode]
  );

  return (
    <div className="flex h-full w-full overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 relative bg-slate-50" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background color="#cbd5e1" gap={20} />
          <Controls />
          
          <Panel position="top-right" className="flex gap-2">
            <input
              type="file"
              id="import-workflow"
              className="hidden"
              accept=".json"
              onChange={onImport}
            />
            <Button 
              variant="outline"
              onClick={() => document.getElementById('import-workflow')?.click()}
              className="gap-2 bg-white"
            >
              <Upload size={16} />
              Import
            </Button>
            <Button 
              variant="outline"
              onClick={onExport}
              className="gap-2 bg-white"
            >
              <Download size={16} />
              Export
            </Button>
            <Button 
              onClick={() => setIsSimulating(true)}
              className="gap-2 shadow-lg"
            >
              <Play size={16} fill="currentColor" />
              Simulate Workflow
            </Button>
          </Panel>
        </ReactFlow>

        {isSimulating && (
          <SimulationPanel 
            nodes={nodes} 
            edges={edges} 
            onClose={() => setIsSimulating(false)} 
          />
        )}
      </div>

      <PropertiesPanel 
        selectedNode={selectedNode} 
        onUpdate={updateNodeData} 
      />
    </div>
  );
};

export const Canvas: React.FC = () => (
  <ReactFlowProvider>
    <WorkflowCanvas />
  </ReactFlowProvider>
);
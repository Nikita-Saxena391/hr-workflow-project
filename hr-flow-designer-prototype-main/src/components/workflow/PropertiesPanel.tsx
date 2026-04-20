import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { WorkflowNode, WorkflowNodeData } from '../../lib/workflow/types';
import { useQuery } from '@tanstack/react-query';
import { getAutomations } from '../../lib/workflow/mockApi';
import { Settings2 } from 'lucide-react';

interface PropertiesPanelProps {
  selectedNode: WorkflowNode | null;
  onUpdate: (nodeId: string, data: Partial<WorkflowNodeData>) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedNode,
  onUpdate,
}) => {
  if (!selectedNode) {
    return (
      <div className="w-80 border-l bg-white p-6 flex flex-col items-center justify-center text-center">
        <div className="p-4 bg-muted rounded-full mb-4">
          <Settings2 size={32} className="text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-sm">No node selected</h3>
        <p className="text-xs text-muted-foreground mt-2 px-4">
          Select a node on the canvas to configure its properties and logic.
        </p>
      </div>
    );
  }

  return (
    <div className="w-80 border-l bg-white overflow-y-auto">
      <div className="sticky top-0 z-10 bg-white border-b p-4 flex items-center justify-between">
        <h3 className="font-bold flex items-center gap-2">
          <Settings2 size={18} />
          Properties
        </h3>
        <span className="px-2 py-0.5 rounded-full font-bold text-xs bg-primary text-primary-foreground">
          {selectedNode.data.type}
        </span>
      </div>

      <div className="p-4 space-y-6">
        <NodeForm 
          node={selectedNode} 
          onUpdate={(data) => onUpdate(selectedNode.id, data)} 
        />
      </div>
    </div>
  );
};

interface NodeFormProps {
  node: WorkflowNode;
  onUpdate: (data: Partial<WorkflowNodeData>) => void;
}

const NodeForm: React.FC<NodeFormProps> = ({ node, onUpdate }) => {
  const { register, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      label: node.data.label,
      ...node.data.config,
    },
  });

  // Reset form when node changes
  useEffect(() => {
    reset({
      label: node.data.label,
      ...node.data.config,
    });
  }, [node.id, reset]);

  const onSubmit = (values: any) => {
    const { label, ...config } = values;
    onUpdate({ label, config });
  };

  const nodeType = node.data.type;
  const { data: automations } = useQuery({
    queryKey: ['automations'],
    queryFn: getAutomations,
  });

  const selectedActionId = watch('actionId');
  const selectedAction = automations?.find(a => a.id === selectedActionId);

  return (
    <form onChange={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Label</label>
        <input {...register('label')} placeholder="Node label" className="w-full h-9 px-3 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring focus:border-transparent" />
      </div>

      {nodeType === 'start' && (
        <div className="space-y-4 pt-2 border-t">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Metadata Key</label>
            <input {...register('metadataKey')} placeholder="e.g. source_id" className="w-full h-9 px-3 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring focus:border-transparent" />
          </div>
        </div>
      )}

      {nodeType === 'task' && (
        <div className="space-y-4 pt-2 border-t">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Assignee</label>
            <input {...register('assignee')} placeholder="Email or Role" className="w-full h-9 px-3 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring focus:border-transparent" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Description</label>
            <textarea {...register('description')} placeholder="Task instructions" rows={3} className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring focus:border-transparent resize-vertical" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Due Date</label>
            <input {...register('dueDate')} type="date" className="w-full h-9 px-3 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring focus:border-transparent" />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Custom Fields (K-V)</label>
            <div className="grid grid-cols-2 gap-2">
              <input {...register('customFields.key1')} placeholder="Key" className="h-7 px-2 text-[10px] border border-input bg-background rounded focus:ring-1" />
              <input {...register('customFields.val1')} placeholder="Value" className="h-7 px-2 text-[10px] border border-input bg-background rounded focus:ring-1" />
            </div>
          </div>
        </div>
      )}

      {nodeType === 'approval' && (
        <div className="space-y-4 pt-2 border-t">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Approver Role</label>
            <input {...register('approverRole')} placeholder="e.g. Manager" className="w-full h-9 px-3 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring focus:border-transparent" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Threshold (%)</label>
            <input {...register('threshold', { valueAsNumber: true })} type="number" min={0} max={100} className="w-full h-9 px-3 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring focus:border-transparent" />
          </div>
        </div>
      )}

      {nodeType === 'automation' && (
        <div className="space-y-4 pt-2 border-t">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action</label>
            <select 
              value={watch('actionId')} 
              onChange={(e) => {
                setValue('actionId', e.target.value);
                handleSubmit(onSubmit)();
              }}
              className="w-full h-9 px-3 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring focus:border-transparent"
            >
              <option value="">Select an action</option>
              {automations?.map(a => (
                <option key={a.id} value={a.id}>{a.label}</option>
              ))}
            </select>
          </div>

          {selectedAction && (
            <div className="space-y-3 bg-muted/50 p-2 rounded-md">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Parameters</p>
              {selectedAction.params.map(param => (
                <div key={param} className="space-y-1">
                  <label className="text-[10px] text-muted-foreground">{param}</label>
                  <input 
                    {...register(`params.${param}`)} 
                    placeholder={param} 
                    className="w-full bg-white h-7 px-2 text-xs border border-input rounded focus:ring-1 focus:border-primary"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {nodeType === 'end' && (
        <div className="space-y-4 pt-2 border-t">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Message</label>
            <input {...register('endMessage')} placeholder="Completion message" className="w-full h-9 px-3 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring focus:border-transparent" />
          </div>
          <div className="flex items-center gap-2 py-2">
             <input type="checkbox" {...register('summaryFlag')} id="summaryFlag" className="w-4 h-4 rounded border-input" />
             <label htmlFor="summaryFlag" className="text-xs font-medium cursor-pointer select-none">Show summary on completion</label>
          </div>
        </div>
      )}
    </form>
  );
};


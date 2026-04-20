import React, { useState, useEffect } from 'react';
import { WorkflowNode, WorkflowEdge, SimulationStep } from '../../lib/workflow/types';
import { simulateWorkflow } from '../../lib/workflow/mockApi';
import { X, CheckCircle2, AlertCircle, Loader2, Play, RefreshCw } from 'lucide-react';

interface SimulationPanelProps {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  onClose: () => void;
}

export const SimulationPanel: React.FC<SimulationPanelProps> = ({
  nodes,
  edges,
  onClose,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<{ steps: SimulationStep[], success: boolean, error?: string } | null>(null);
  const [progress, setProgress] = useState(0);

  const runSimulation = async () => {
    setIsRunning(true);
    setResult(null);
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 90));
    }, 150);

    const simulationResult = await simulateWorkflow(nodes, edges);
    
    clearInterval(interval);
    setProgress(100);
    setResult(simulationResult);
    setIsRunning(false);
  };

  useEffect(() => {
    runSimulation();
  }, []);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
      <div className="w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] bg-white rounded-xl">
        <div className="bg-slate-50 border-b flex flex-row items-center justify-between py-4 px-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Play size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Workflow Simulator</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Test your logic and node connections</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-accent rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isRunning && (
            <div className="space-y-4 py-8 text-center">
              <Loader2 size={40} className="text-primary animate-spin mx-auto" />
              <div className="max-w-xs mx-auto space-y-2">
                <p className="font-medium">Analyzing Workflow Graph...</p>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full transition-all" style={{width: `${progress}%`}} />
                </div>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-6">
              <div className={`
                p-4 rounded-xl border-2 flex items-center gap-4 shadow-sm
                ${result.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}
              `}>
                {result.success ? (
                  <div className="bg-green-500 p-2 rounded-full text-white">
                    <CheckCircle2 size={24} />
                  </div>
                ) : (
                  <div className="bg-red-500 p-2 rounded-full text-white">
                    <AlertCircle size={24} />
                  </div>
                )}
                <div className="flex-1">
                  <h4 className={`
                    font-bold text-lg
                    ${result.success ? "text-green-800" : "text-red-800"}
                  `}>
                    {result.success ? "Simulation Complete" : "Validation Failed"}
                  </h4>
                  <p className={`
                    text-sm
                    ${result.success ? "text-green-600" : "text-red-600"}
                  `}>
                    {result.success ? "All steps reached successfully." : result.error}
                  </p>
                </div>
                {!result.success && (
                  <button onClick={runSimulation} className="px-3 py-1.5 text-xs border border-red-200 hover:bg-red-100 rounded-md bg-white transition-colors">
                    <RefreshCw size={14} className="inline mr-1" /> Retry
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Execution Timeline</h5>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground bg-slate-100 px-2 py-0.5 rounded">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span> Success
                  </div>
                </div>
                
                <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {result.steps.length > 0 ? result.steps.map((step, idx) => (
                    <div 
                      key={idx} 
                      className="relative"
                      style={{ animationDelay: `${idx * 150}ms`, animation: `slide-in-from-left 0.3s ease-out` }}
                    >
                      <div className={`
                        absolute -left-[21px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm flex items-center justify-center
                        ${step.status === 'success' ? "bg-green-500" : "bg-red-500"}
                      `}>
                        {step.status === 'success' ? <CheckCircle2 size={10} className="text-white" /> : <X size={10} className="text-white" />}
                      </div>
                      
                      <div className="bg-white border rounded-lg p-3 shadow-sm hover:border-primary/30 transition-all">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold uppercase text-muted-foreground tracking-tight">
                            {step.nodeId === 'validation' ? 'Validator' : step.nodeId.split('-')[0]}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-sm font-medium">{step.message}</p>
                      </div>
                    </div>
                  )) : (
                     <div className="py-8 text-center text-muted-foreground italic border-2 border-dashed rounded-lg -ml-6 bg-muted/30">
                       No execution steps recorded.
                     </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 h-9 text-sm border border-input bg-background hover:bg-accent rounded-md text-muted-foreground">Close</button>
          {!isRunning && (
            <button onClick={runSimulation} className="px-4 py-2 h-9 text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded-md flex items-center gap-2">
              <RefreshCw size={16} /> Re-run Simulation
            </button>
          )}
        </div>
      </div>
    </div>
  );
};


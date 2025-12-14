import React, { useState, useEffect } from 'react';
import { Translation, FlowNode, FlowEdge } from '../types';
import { Play, Plus, Save, Download, Settings } from 'lucide-react';

interface FlowEditorProps {
  translation: Translation;
}

const FlowEditor: React.FC<FlowEditorProps> = ({ translation }) => {
  const [nodes, setNodes] = useState<FlowNode[]>([
    { id: '1', type: 'trigger', label: 'Start', x: 100, y: 100 },
    { id: '2', type: 'action', label: 'Process Data', x: 400, y: 150 },
    { id: '3', type: 'condition', label: 'Check Status', x: 400, y: 300 },
  ]);

  const [edges, setEdges] = useState<FlowEdge[]>([
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e2-3', source: '2', target: '3' },
  ]);

  const [isAnimating, setIsAnimating] = useState(false);

  const runSimulation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 2000);
  };

  // Helper to draw SVG curve
  const getPath = (source: FlowNode, target: FlowNode) => {
    const deltaX = target.x - source.x;
    const midX = source.x + deltaX / 2;
    return `M${source.x + 150},${source.y + 40} C${midX + 150},${source.y + 40} ${midX - 50},${target.y + 40} ${target.x},${target.y + 40}`;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="h-16 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 bg-white dark:bg-dark-surface">
        <div className="flex items-center gap-4">
            <h2 className="font-bold text-lg">{translation.flowName}</h2>
            <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full">Active</span>
        </div>
        <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
                <Save className="w-4 h-4" />
                <span>Save</span>
            </button>
             <button 
                onClick={runSimulation}
                className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium bg-primary-500 text-white hover:bg-primary-600 rounded-lg shadow-lg shadow-primary-500/20 transition"
            >
                <Play className="w-4 h-4" />
                <span>{translation.execute}</span>
            </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden bg-gray-50 dark:bg-dark-bg cursor-grab active:cursor-grabbing">
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ 
                 backgroundImage: 'radial-gradient(circle, #808080 1px, transparent 1px)', 
                 backgroundSize: '20px 20px' 
             }} 
        />
        
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {edges.map(edge => {
                const source = nodes.find(n => n.id === edge.source);
                const target = nodes.find(n => n.id === edge.target);
                if (!source || !target) return null;
                return (
                    <g key={edge.id}>
                        <path 
                            d={getPath(source, target)} 
                            fill="none" 
                            stroke={isAnimating ? "#0ea5e9" : "#94a3b8"} 
                            strokeWidth="2"
                            className={isAnimating ? "animate-pulse" : ""}
                        />
                        {isAnimating && (
                             <circle r="4" fill="#0ea5e9">
                                <animateMotion dur="1s" repeatCount="1" path={getPath(source, target)} />
                             </circle>
                        )}
                    </g>
                );
            })}
        </svg>

        {nodes.map(node => (
            <div 
                key={node.id}
                style={{ left: node.x, top: node.y }}
                className="absolute w-[150px] bg-white dark:bg-dark-surface border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-3 flex flex-col gap-2 hover:shadow-md transition-shadow cursor-pointer pointer-events-auto"
            >
                <div className="flex items-center justify-between">
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                        node.type === 'trigger' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300' :
                        node.type === 'action' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' :
                        'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300'
                    }`}>
                        {node.type}
                    </span>
                    <Settings className="w-3 h-3 text-gray-400" />
                </div>
                <p className="text-sm font-medium truncate">{node.label}</p>
                {/* Ports */}
                <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full border-2 border-white dark:border-dark-bg" />
                <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full border-2 border-white dark:border-dark-bg" />
            </div>
        ))}
      </div>
    </div>
  );
};

export default FlowEditor;

import React from 'react';
import { 
  Megaphone, ClipboardList, Video, Calendar, Edit3, Trash2, 
  Play, Plus, GitBranch, Network
} from 'lucide-react';
import { NODE_TYPES } from '../../data';
import { EngageNode } from '../../types';
import { CARD_WIDTH, CARD_HEIGHT, BUBBLE_SIZE, START_NODE_WIDTH, START_NODE_HEIGHT } from './constants';

export const CriteriaBubble = ({ node, onClick, onStartConnect, onEndConnect, isConnecting, isValidTarget, layoutDirection = 'HORIZONTAL' }: any) => {
    const isEnabled = node.data.config?.enabled;
    const label = node.data.label;

    // Handle Positions
    const inputClass = layoutDirection === 'HORIZONTAL' 
        ? "top-1/2 -translate-y-1/2 -left-[6px]" 
        : "left-1/2 -translate-x-1/2 -top-[6px]";
    
    const outputClass = layoutDirection === 'HORIZONTAL'
        ? "top-1/2 -translate-y-1/2 -right-[6px]"
        : "left-1/2 -translate-x-1/2 -bottom-[6px]";

    return (
        <div className="node-card absolute flex flex-col items-center justify-center z-20"
             style={{ left: node.x, top: node.y, width: BUBBLE_SIZE, height: BUBBLE_SIZE }}
        >
            <div 
                className={`w-full h-full rounded-full shadow-sm border-2 flex items-center justify-center cursor-pointer transition-all hover:scale-110 hover:shadow-md ${isEnabled ? 'bg-green-500 border-white' : 'bg-white border-slate-300 text-slate-400 hover:border-slate-400'}`}
                onClick={(e) => { e.stopPropagation(); onClick(); }}
                title={isEnabled ? "Edit Criteria" : "Add Automation"}
            >
                {isEnabled ? <GitBranch size={18} className="text-white" /> : <Plus size={20} />}
            </div>
            
            {label && (
                <div className={`absolute whitespace-nowrap bg-white border border-slate-200 px-2 py-0.5 rounded text-[10px] font-bold text-slate-600 shadow-sm ${layoutDirection === 'HORIZONTAL' ? '-top-6' : 'left-full ml-2 top-1/2 -translate-y-1/2'}`}>
                    {label}
                </div>
            )}

            {/* Input Handle */}
            {(!isConnecting || isValidTarget) && (
                <div 
                    className={`absolute w-2.5 h-2.5 rounded-full border-2 cursor-crosshair transition-all duration-300 ${inputClass} ${
                        isConnecting && isValidTarget 
                        ? 'bg-green-500 border-green-200 scale-150 shadow-[0_0_10px_rgba(34,197,94,0.5)] z-50' 
                        : 'bg-slate-400 border-white hover:bg-indigo-600 hover:scale-150'
                    }`}
                    style={{ opacity: isConnecting && !isValidTarget ? 0 : 1, pointerEvents: isConnecting && !isValidTarget ? 'none' : 'auto' }}
                    onClick={(e) => { 
                        e.stopPropagation(); 
                        if (isConnecting && isValidTarget) onEndConnect(node.id); 
                    }}
                    title="Connect Input"
                ></div>
            )}

            {/* Output Handle */}
            {!isConnecting && (
                <div 
                    className={`absolute w-2.5 h-2.5 rounded-full bg-slate-400 border-2 border-white cursor-crosshair hover:bg-indigo-600 hover:scale-150 transition-all ${outputClass}`}
                    onClick={(e) => { e.stopPropagation(); onStartConnect(node.id); }}
                    title="Connect Output"
                ></div>
            )}
        </div>
    );
};

export const StartNode = ({ node, onClick, onStartConnect, isConnecting, layoutDirection = 'HORIZONTAL' }: any) => {
    const outputClass = layoutDirection === 'HORIZONTAL'
        ? "top-1/2 -translate-y-1/2 -right-[5px]"
        : "left-1/2 -translate-x-1/2 -bottom-[5px]";

    return (
        <div 
        className="node-card absolute bg-emerald-50 rounded-full shadow-sm border-2 border-emerald-200 flex items-center justify-center gap-3 z-10 cursor-pointer hover:ring-2 hover:ring-emerald-100 transition-all hover:shadow-md"
        style={{ left: node.x, top: node.y, width: START_NODE_WIDTH, height: START_NODE_HEIGHT }}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        title="Configure Start Trigger"
        >
        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-sm border-2 border-emerald-100">
            <Play size={18} fill="currentColor" className="ml-0.5" />
        </div>
        <div className="flex flex-col justify-center">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Start Workflow</span>
            <span className="text-[10px] text-emerald-600 font-medium">Candidate Applied</span>
        </div>
        
        {/* Output Handle Only */}
        {!isConnecting && (
            <div 
                className={`absolute w-2.5 h-2.5 rounded-full border-2 border-white bg-slate-400 z-20 cursor-crosshair hover:bg-indigo-600 hover:scale-150 transition-all ${outputClass}`}
                onClick={(e) => { e.stopPropagation(); onStartConnect(node.id); }}
            ></div>
        )}
        </div>
    );
};

export const NodeCard = ({ node, onSelect, onEdit, onDelete, onStartConnect, onEndConnect, isSelected, isConnecting, isValidTarget, layoutDirection = 'HORIZONTAL', onShowAnalytics }: any) => {
  if (node.type === 'START') return <StartNode node={node} onClick={() => onEdit(node)} onStartConnect={onStartConnect} isConnecting={isConnecting} layoutDirection={layoutDirection} />;
  if (node.type === 'CRITERIA') return <CriteriaBubble node={node} onClick={() => onEdit(node)} onStartConnect={onStartConnect} onEndConnect={onEndConnect} isConnecting={isConnecting} isValidTarget={isValidTarget} layoutDirection={layoutDirection} />;

  const config: any = NODE_TYPES[node.type] || NODE_TYPES.ANNOUNCEMENT;
  
  const getNodeIcon = () => {
    if (node.type === 'ANNOUNCEMENT') return Megaphone;
    if (node.type === 'SCREENING') return ClipboardList;
    if (node.type === 'INTERVIEW') {
      const meetTypes = node.data.meetType || [];
      if (meetTypes.includes('Video')) return Video;
      return Calendar;
    }
    return config.icon;
  };
  const Icon = getNodeIcon();

  const renderStats = () => {
    const stats = node.data.stats || {};
    return (
        <>
          <div className="flex flex-col border-r border-slate-100 pr-3">
             <span className="text-[10px] text-slate-400 font-medium">Scheduled</span>
             <span className="text-sm font-bold text-slate-700">{stats.scheduled || 0}</span>
          </div>
          <div className="flex flex-col pl-3">
             <span className="text-[10px] text-slate-400 font-medium">{node.type === 'ANNOUNCEMENT' ? 'Viewed' : 'Completed'}</span>
             <span className="text-sm font-bold text-blue-600">{stats.viewed || stats.responded || 0}</span>
          </div>
        </>
    );
  };

  const inputClass = layoutDirection === 'HORIZONTAL'
        ? "top-1/2 -translate-y-1/2 -left-[10px]"
        : "left-1/2 -translate-x-1/2 -top-[10px]";

  const outputClass = layoutDirection === 'HORIZONTAL'
        ? "top-1/2 -translate-y-1/2 -right-[10px]"
        : "left-1/2 -translate-x-1/2 -bottom-[10px]";

  return (
    <div 
      className={`node-card absolute bg-white rounded-lg shadow-md border-2 group hover:shadow-xl flex flex-col z-10 ${isSelected ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-slate-200'}`}
      style={{ left: node.x, top: node.y, width: CARD_WIDTH, height: CARD_HEIGHT }} 
      onClick={() => onSelect(node)}
    >
      <div className={`h-1.5 rounded-t-sm w-full shrink-0 ${config.color.split(' ')[0]}`}></div>
      
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className={`p-1.5 rounded-md ${config.color.replace('border-', '')} bg-opacity-20`}>
            <Icon size={16} />
          </div>
          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"
              onClick={(e) => { e.stopPropagation(); onEdit(node); }}
              title="Edit Configuration"
            >
              <Edit3 size={12}/>
            </button>
            <button 
              className="p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-500"
              onClick={(e) => { e.stopPropagation(); onDelete(node.id); }}
              title="Delete"
            >
              <Trash2 size={12}/>
            </button>
          </div>
        </div>
        <h4 className="font-bold text-slate-800 text-sm mb-1">{node.title}</h4>
        <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{node.data.desc}</p>
        
        <div className="mt-auto pt-3 flex items-center border-t border-slate-50">
           {renderStats()}
           <div className="ml-auto">
              <button 
                onClick={(e) => { e.stopPropagation(); onShowAnalytics && onShowAnalytics(node.type); }}
                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                title="Round Analytics"
              >
                <Network size={16} />
              </button>
           </div>
        </div>
      </div>
      
      {/* Input Handle */}
      {(!isConnecting || isValidTarget) && (
          <div 
            className={`absolute w-5 h-5 rounded-full border-4 shadow-sm transition-all duration-300 cursor-crosshair z-20 ${inputClass} ${
                isConnecting && isValidTarget 
                ? 'bg-green-500 border-green-200 scale-125 shadow-[0_0_15px_rgba(34,197,94,0.6)] animate-pulse' 
                : 'bg-slate-300 border-white hover:bg-indigo-500 hover:scale-125'
            }`} 
            onClick={(e) => { 
                e.stopPropagation(); 
                if (isConnecting && isValidTarget) onEndConnect(node.id); 
            }}
          ></div>
      )}
      
      {/* Output Handle */}
      {!isConnecting && (
          <div 
            className={`absolute w-5 h-5 rounded-full border-4 border-white shadow-sm bg-slate-300 hover:bg-indigo-500 hover:scale-125 transition-all cursor-crosshair z-20 ${outputClass}`} 
            onClick={(e) => { e.stopPropagation(); onStartConnect(node.id); }}
          ></div>
      )}
    </div>
  );
};

export const BezierEdge = ({ start, end, label, direction = 'HORIZONTAL' }: any) => {
  let path = '';
  
  if (direction === 'HORIZONTAL') {
      const distX = Math.abs(end.x - start.x);
      let controlOffset = Math.min(distX * 0.4, 150);
      if (controlOffset < 20 && distX > 20) controlOffset = 20;
      path = `M ${start.x} ${start.y} C ${start.x + controlOffset} ${start.y}, ${end.x - controlOffset} ${end.y}, ${end.x} ${end.y}`;
  } else {
      const distY = Math.abs(end.y - start.y);
      let controlOffset = Math.min(distY * 0.4, 150);
      if (controlOffset < 20 && distY > 20) controlOffset = 20;
      path = `M ${start.x} ${start.y} C ${start.x} ${start.y + controlOffset}, ${end.x} ${end.y - controlOffset}, ${end.x} ${end.y}`;
  }

  const labelX = (start.x + end.x) / 2 - 20;
  const labelY = (start.y + end.y) / 2 - 10;

  return (
    <g>
      <path d={path} fill="none" stroke="#94a3b8" strokeWidth="2.5" />
      {label && (
        <foreignObject x={labelX} y={labelY} width={40} height={20}>
           <div className="bg-white text-[10px] text-slate-500 border border-slate-200 rounded px-1 text-center truncate">{label}</div>
        </foreignObject>
      )}
    </g>
  );
};


import React, { useState, useEffect, useRef } from 'react';
import { X, GitGraph } from 'lucide-react';
import * as d3 from 'd3';
import { sankey as d3Sankey, sankeyLinkHorizontal, sankeyLeft } from 'd3-sankey';

type RoundType = 'Announcement' | 'Screening' | 'Interview' | 'Survey';

// Data definitions based on user request
const RAW_DATA: Record<RoundType, [string, string, number][]> = {
  Announcement: [
    ["Total Profiles","Scheduled",600],
    ["Total Profiles","Not Scheduled",200],
    ["Total Profiles","Automation Failed",100],
    ["Total Profiles","Not Reachable",100],
    ["Scheduled","Delivered",500],
    ["Scheduled","Bounced",50],
    ["Scheduled","Sending",30],
    ["Scheduled","Opted-Out",20],
    ["Delivered","Viewed",300],
    ["Delivered","Not Viewed",200],
    ["Viewed","Reviewed",150],
    ["Viewed","Not Reviewed",150]
  ],
  Screening: [
    ["Total Profiles","Scheduled",600],
    ["Total Profiles","Not Scheduled",200],
    ["Total Profiles","Automation Failed",100],
    ["Total Profiles","Not Reachable",100],
    ["Scheduled","Delivered",500],
    ["Scheduled","Bounced",50],
    ["Scheduled","Sending",30],
    ["Scheduled","Opted-Out",20],
    ["Delivered","Viewed",300],
    ["Delivered","Not Viewed",200],
    ["Viewed","Inbound Called",150],
    ["Viewed","Outbound",150],
    ["Inbound Called","Completed",100],
    ["Inbound Called","In-Progress",40],
    ["Inbound Called","No Response",10],
    ["Outbound","Completed",100],
    ["Outbound","In-Progress",40],
    ["Outbound","No Response",10],
    ["Completed","Reviewed",160],
    ["Completed","Not Reviewed",40]
  ],
  Interview: [
    ["Total Profiles","Scheduled",600],
    ["Total Profiles","Not Scheduled",200],
    ["Total Profiles","Automation Failed",100],
    ["Total Profiles","Not Reachable",100],
    ["Scheduled","Delivered",500],
    ["Scheduled","Bounced",50],
    ["Scheduled","Sending",30],
    ["Scheduled","Opted-Out",20],
    ["Delivered","Viewed",300],
    ["Delivered","Not Viewed",200],
    ["Viewed","Selected Slot",150],
    ["Viewed","Not Selected Slot",100],
    ["Viewed","Candidate Requested",10],
    ["Viewed","Cancelled",40],
    ["Selected Slot","Attended",100],
    ["Selected Slot","Not Attended",50], 
    ["Attended","Interview Completed",100], 
    ["Interview Completed","Reviewed",80], 
    ["Interview Completed","Not Reviewed",20] 
  ],
  Survey: [
    ["Total Profiles","Scheduled",600],
    ["Total Profiles","Not Scheduled",200],
    ["Total Profiles","Automation Failed",100],
    ["Total Profiles","Not Reachable",100],
    ["Scheduled","Delivered",500],
    ["Scheduled","Bounced",50],
    ["Scheduled","Sending",30],
    ["Scheduled","Opted-Out",20],
    ["Delivered","Viewed",300],
    ["Delivered","Not Viewed",200],
    ["Viewed","Completed",200],
    ["Viewed","In-Progress",80],
    ["Viewed","No Response",20],
    ["Completed","Reviewed",160],
    ["Completed","Not Reviewed",40]
  ]
};

const getColor = (name: string) => {
  if (name.includes("Total")) return "#94a3b8"; // Grey (Start)
  
  // Failure / Drop-off
  if (
    name.includes("Not") || 
    name.includes("Failed") || 
    name.includes("Bounced") || 
    name.includes("Cancelled") || 
    name.includes("Reachable") ||
    name.includes("Opted-Out") ||
    name.includes("No Response") ||
    name.includes("Drop-off")
  ) return "#ef4444"; // Red

  // Success / Completion
  if (
    name.includes("Completed") || 
    name.includes("Reviewed") || 
    name.includes("Attended") || 
    name.includes("Selected Slot") || 
    name.includes("Candidate Requested")
  ) return "#22c55e"; // Green

  // Normal Flow
  return "#6366f1"; // Indigo/Blue
};

// Tooltip Component with bounds checking
const Tooltip = ({ data, position }: { data: any, position: { x: number, y: number } | null }) => {
    if (!data || !position) return null;

    const isLink = data.source && data.target;
    
    // Bounds logic
    const TOOLTIP_WIDTH = 220;
    const TOOLTIP_HEIGHT = 120;
    const OFFSET = 15;
    
    let left = position.x + OFFSET;
    let top = position.y + OFFSET;

    // Check right edge
    if (left + TOOLTIP_WIDTH > window.innerWidth) {
        left = position.x - TOOLTIP_WIDTH - OFFSET;
    }
    
    // Check bottom edge
    if (top + TOOLTIP_HEIGHT > window.innerHeight) {
        top = position.y - TOOLTIP_HEIGHT - OFFSET;
    }

    return (
        <div 
            className="fixed z-[110] pointer-events-none bg-white p-3 rounded-lg shadow-xl border border-slate-200 text-xs animate-in fade-in zoom-in-95 duration-150"
            style={{ 
                left: left, 
                top: top,
                minWidth: '200px'
            }}
        >
            {isLink ? (
                <>
                    <p className="font-bold text-slate-800 mb-1 border-b border-slate-100 pb-1">
                        {data.source.name} <span className="text-slate-400">→</span> {data.target.name}
                    </p>
                    <div className="flex justify-between gap-4 mt-2">
                        <span className="text-slate-500">Profiles:</span>
                        <span className="font-mono font-bold text-slate-700">{data.value}</span>
                    </div>
                    <div className="flex justify-between gap-4 mt-1">
                        <span className="text-slate-500">Conversion:</span>
                        <span className="font-mono font-bold text-blue-600">
                            {((data.value / data.source.value) * 100).toFixed(1)}%
                        </span>
                    </div>
                </>
            ) : (
                <>
                    <p className="font-bold text-slate-800 mb-1 border-b border-slate-100 pb-1">{data.name}</p>
                    <div className="space-y-1 mt-2">
                        <div className="flex justify-between gap-4">
                            <span className="text-slate-500">Total Count:</span>
                            <span className="font-mono font-bold text-slate-700">{data.value}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-slate-500">Overall Impact:</span>
                            <span className="font-mono font-bold text-emerald-600">
                                {((data.value / 1000) * 100).toFixed(1)}%
                            </span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

interface NetworkGraphModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialRoundType?: string;
}

export const NetworkGraphModal = ({ isOpen, onClose, initialRoundType = 'Screening' }: NetworkGraphModalProps) => {
  const [roundType, setRoundType] = useState<RoundType>('Screening');
  const [tooltipData, setTooltipData] = useState<{data: any, position: {x: number, y: number}} | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      let type: RoundType = 'Screening';
      if (initialRoundType === 'ANNOUNCEMENT') type = 'Announcement';
      else if (initialRoundType === 'INTERVIEW') type = 'Interview';
      else if (initialRoundType === 'SURVEY') type = 'Survey';
      else if (initialRoundType === 'SCREENING') type = 'Screening';
      else if (['Announcement', 'Screening', 'Interview', 'Survey'].includes(initialRoundType)) type = initialRoundType as RoundType;
      
      setRoundType(type);
  }, [initialRoundType, isOpen]);

  // Process data for D3
  const graphData = React.useMemo(() => {
      const raw = RAW_DATA[roundType];
      const nodesSet = new Set<string>();
      raw.forEach(r => { nodesSet.add(r[0]); nodesSet.add(r[1]); });
      
      const nodes = Array.from(nodesSet).map(name => ({ name }));
      const nodeMap = new Map(nodes.map((n, i) => [n.name, i]));
      
      const links = raw.map(r => ({
          source: nodeMap.get(r[0]),
          target: nodeMap.get(r[1]),
          value: r[2]
      }));

      return { nodes, links };
  }, [roundType]);

  useEffect(() => {
      if (!isOpen || !svgRef.current || !wrapperRef.current) return;

      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove(); // Clear previous render

      const width = wrapperRef.current.clientWidth;
      const height = wrapperRef.current.clientHeight;

      const sankeyGenerator = d3Sankey()
          .nodeWidth(16)
          .nodePadding(20)
          .extent([[1, 1], [width - 1, height - 20]])
          .nodeAlign(sankeyLeft); // KEY: Forces strict left alignment (waterfall)

      // Deep copy to prevent mutation issues with React StrictMode
      const { nodes, links } = sankeyGenerator({
          nodes: graphData.nodes.map(d => ({ ...d })),
          links: graphData.links.map(d => ({ ...d }))
      });

      // --- Interaction Helpers ---
      
      // Highlights flow upstream from a node or link
      const highlightFlow = (startNode: any, extraLink: any = null, extraNode: any = null) => {
          const activeNodes = new Set();
          const activeLinks = new Set();

          if (extraLink) activeLinks.add(extraLink);
          if (extraNode) activeNodes.add(extraNode);

          const traverseUpstream = (node: any) => {
              activeNodes.add(node);
              if (node.targetLinks) {
                  node.targetLinks.forEach((link: any) => {
                      activeLinks.add(link);
                      traverseUpstream(link.source);
                  });
              }
          };

          traverseUpstream(startNode);

          // Apply Styles: Dim all first
          svg.selectAll(".sankey-node").attr("opacity", 0.1);
          svg.selectAll(".sankey-link").attr("stroke-opacity", 0.05);
          svg.selectAll(".sankey-label").attr("opacity", 0.1);

          // Highlight active
          svg.selectAll(".sankey-node").filter((n: any) => activeNodes.has(n)).attr("opacity", 1);
          svg.selectAll(".sankey-link").filter((l: any) => activeLinks.has(l)).attr("stroke-opacity", 0.7);
          svg.selectAll(".sankey-label").filter((n: any) => activeNodes.has(n)).attr("opacity", 1);
      };

      const resetStyles = () => {
          setTooltipData(null);
          svg.selectAll(".sankey-node").attr("opacity", 1);
          svg.selectAll(".sankey-link").attr("stroke-opacity", 0.3); // default opacity
          svg.selectAll(".sankey-label").attr("opacity", 1);
      };

      // --- Draw Elements ---

      // Draw Links
      const link = svg.append("g")
          .attr("fill", "none")
          .selectAll("g")
          .data(links)
          .join("g")
          .style("mix-blend-mode", "multiply");

      // Link Paths
      link.append("path")
          .attr("class", "sankey-link") // Class for highlighting
          .attr("d", sankeyLinkHorizontal())
          .attr("stroke", (d: any) => getColor(d.target.name)) // Link color matches target node
          .attr("stroke-width", (d: any) => Math.max(1, d.width))
          .attr("stroke-opacity", 0.3) // Default opacity
          .style("transition", "stroke-opacity 0.3s")
          .on("mouseover", function(event, d: any) {
              setTooltipData({ data: d, position: { x: event.clientX, y: event.clientY } });
              // Highlight upstream of source + this link + target
              highlightFlow(d.source, d, d.target);
          })
          .on("mousemove", function(event) {
              setTooltipData(prev => prev ? { ...prev, position: { x: event.clientX, y: event.clientY } } : null);
          })
          .on("mouseout", resetStyles);

      // Draw Nodes
      const node = svg.append("g")
          .selectAll("rect")
          .data(nodes)
          .join("rect")
          .attr("class", "sankey-node") // Class for highlighting
          .attr("x", (d: any) => d.x0)
          .attr("y", (d: any) => d.y0)
          .attr("height", (d: any) => d.y1 - d.y0)
          .attr("width", (d: any) => d.x1 - d.x0)
          .attr("fill", (d: any) => getColor(d.name))
          .attr("rx", 4)
          .attr("ry", 4)
          .attr("opacity", 1) // Default opacity
          .style("cursor", "pointer")
          .style("transition", "opacity 0.3s")
          .on("mouseover", function(event, d: any) {
              setTooltipData({ data: d, position: { x: event.clientX, y: event.clientY } });
              // Highlight upstream only
              highlightFlow(d);
          })
          .on("mousemove", function(event) {
              setTooltipData(prev => prev ? { ...prev, position: { x: event.clientX, y: event.clientY } } : null);
          })
          .on("mouseout", resetStyles);

      // Node Labels
      svg.append("g")
          .attr("font-family", "sans-serif")
          .attr("font-size", 11)
          .attr("font-weight", 600)
          .attr("fill", "#334155")
          .style("pointer-events", "none") // Let clicks pass through to rect
          .selectAll("text")
          .data(nodes)
          .join("text")
          .attr("class", "sankey-label") // Class for highlighting
          .attr("x", (d: any) => d.x1 + 6)
          .attr("y", (d: any) => (d.y1 + d.y0) / 2)
          .attr("dy", "0.35em")
          .attr("text-anchor", "start")
          .attr("opacity", 1)
          .style("transition", "opacity 0.3s")
          .text((d: any) => `${d.name} (${d.value})`)
          // Adjust labels for nodes near right edge if needed, though Left Align usually keeps them left.
          .filter((d: any) => d.x1 > width * 0.9)
          .attr("x", (d: any) => d.x0 - 6)
          .attr("text-anchor", "end");

  }, [isOpen, graphData, roundType]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
       <Tooltip data={tooltipData?.data} position={tooltipData?.position || null} />
       
       <div className="bg-white w-full max-w-7xl h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
             <div className="flex items-center gap-4">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                    <GitGraph size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 text-lg">Candidate Flow Analysis</h3>
                    <p className="text-xs text-slate-500">Visualization of candidate distribution across stages</p>
                </div>
             </div>
             <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20}/></button>
          </div>
          
          <div className="flex-1 p-6 overflow-hidden flex flex-col bg-slate-50">
             {/* Stats Bar */}
             <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium border border-indigo-100">
                        Total Profiles: 1,000
                    </div>
                    {roundType === 'Interview' && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium border border-emerald-100">
                            Completed: {RAW_DATA.Interview.find(r => r[1] === 'Interview Completed')?.[2] || 0}
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-indigo-500 rounded-sm"></span> <span>Normal Flow</span></div>
                    <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-red-500 rounded-sm"></span> <span>Drop-off</span></div>
                    <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm"></span> <span>Success</span></div>
                </div>
             </div>

             {/* Graph Area */}
             <div className="flex-1 bg-white rounded-xl border border-slate-200 p-6 shadow-sm relative flex flex-col overflow-hidden">
                <div ref={wrapperRef} className="flex-1 min-h-0 w-full relative">
                    <svg ref={svgRef} width="100%" height="100%" style={{ overflow: 'visible' }}></svg>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

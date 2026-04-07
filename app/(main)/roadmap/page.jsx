"use client";

import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Map, Maximize, Minimize, Youtube, X, PlayCircle } from 'lucide-react';

const initialNodes = [
  { 
    id: '1', 
    position: { x: 250, y: 150 }, 
    data: { label: 'Enter a role above and click generate!' }, 
    // Added cursor: 'pointer' here
    style: { background: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '8px', padding: '20px', textAlign: 'center', color: '#64748b', cursor: 'pointer' } 
  },
];

export default function CareerRoadmapPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  const [targetRole, setTargetRole] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [videos, setVideos] = useState([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleGenerateRoadmap = async () => {
    if (!targetRole.trim()) return;
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetRole }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      // FIX: Inject cursor: 'pointer' into every node returned by the AI
      const interactiveNodes = data.nodes.map(node => ({
        ...node,
        style: { ...node.style, cursor: 'pointer' }
      }));

      setNodes(interactiveNodes);
      setEdges(data.edges);
    } catch (error) {
      alert("Failed to generate the roadmap.");
    } finally {
      setIsGenerating(false);
    }
  };

  const onNodeClick = async (event, node) => {
    if (node.id === '1' && !edges.length) return; 
    
    setSelectedTopic(node.data.label);
    setIsLoadingVideos(true);
    setVideos([]);

    try {
      const response = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: node.data.label }),
      });
      const data = await response.json();
      setVideos(data.videos || []);
    } catch (error) {
      console.error("Video fetch failed", error);
    } finally {
      setIsLoadingVideos(false);
    }
  };

  return (
    // FIX: Replaced hardcoded bg-slate-50 with bg-background text-foreground for dark mode compatibility
    <div className={isFullscreen ? "fixed inset-0 z-50 bg-background text-foreground flex flex-col p-4" : "container mx-auto py-10 flex flex-col h-[85vh] max-w-5xl"}>
      
      <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${isFullscreen ? "mb-4" : "mb-6"}`}>
        <div>
          <h1 className={`${isFullscreen ? "text-2xl" : "text-3xl"} font-bold flex items-center gap-2`}>
            <Map className="h-8 w-8 text-primary" /> Interactive Career Roadmap
          </h1>
          {!isFullscreen && <p className="text-muted-foreground mt-1">Discover the skills you need and click any node to find tutorials.</p>}
        </div>
        
        <div className="flex w-full md:w-auto items-center gap-2">
          <Input 
            placeholder="e.g. AI Engineer..." 
            className="w-full md:w-[200px]"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerateRoadmap()}
          />
          <Button onClick={handleGenerateRoadmap} disabled={isGenerating}>
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate"}
          </Button>
          
          <Button variant="outline" size="icon" onClick={() => setIsFullscreen(!isFullscreen)}>
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="flex-grow border-2 rounded-xl overflow-hidden bg-white shadow-sm relative text-black">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          fitView
          fitViewOptions={{ padding: 0.2 }}
        >
          <Controls />
          <MiniMap zoomable pannable nodeColor={(n) => '#93c5fd'} />
          <Background variant="dots" gap={16} size={1} color="#cbd5e1" />
        </ReactFlow>

        {selectedTopic && (
          <div className="absolute top-4 right-4 w-80 bg-white border shadow-2xl rounded-xl overflow-hidden z-10 flex flex-col max-h-[90%]">
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2">
                <Youtube className="text-red-500 h-5 w-5" /> {selectedTopic}
              </h3>
              <button onClick={() => setSelectedTopic(null)} className="hover:text-red-400">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto flex flex-col gap-4 text-black">
              {isLoadingVideos ? (
                <div className="flex flex-col items-center text-muted-foreground py-8">
                  <Loader2 className="h-8 w-8 animate-spin mb-2" />
                  <p>Finding best tutorials...</p>
                </div>
              ) : videos.length > 0 ? (
                videos.map((vid, idx) => (
                  <a key={idx} href={vid.url} target="_blank" rel="noopener noreferrer" className="group flex flex-col gap-2 border rounded-lg p-2 hover:bg-slate-50 transition-colors">
                    <div className="relative rounded-md overflow-hidden">
                      <img src={vid.thumbnail} alt={vid.title} className="w-full object-cover aspect-video group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors flex items-center justify-center">
                        <PlayCircle className="text-white h-8 w-8 opacity-80" />
                      </div>
                      <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">{vid.duration}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold line-clamp-2">{vid.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{vid.author}</p>
                    </div>
                  </a>
                ))
              ) : (
                <p className="text-sm text-center text-muted-foreground">No videos found.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
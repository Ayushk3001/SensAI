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
import { Loader2, Maximize, Minimize, Youtube, X, PlayCircle, Map, Sparkles, RefreshCw, Zap } from 'lucide-react';

// ── Premium node color palette ──
const PALETTES = [
  { bg: '#1a1133', border: '#8b5cf6', text: '#c4b5fd', glow: '#8b5cf625' },
  { bg: '#0f1a2e', border: '#3b82f6', text: '#93c5fd', glow: '#3b82f625' },
  { bg: '#0c1f17', border: '#10b981', text: '#6ee7b7', glow: '#10b98125' },
  { bg: '#1f1608', border: '#f59e0b', text: '#fcd34d', glow: '#f59e0b25' },
  { bg: '#1f0f1a', border: '#ec4899', text: '#f9a8d4', glow: '#ec489925' },
];

const makeNodeStyle = (idx = 0) => {
  const p = PALETTES[idx % PALETTES.length];
  return {
    background: p.bg,
    border: `2px solid ${p.border}`,
    borderRadius: '14px',
    padding: '14px 20px',
    color: p.text,
    fontSize: '13.5px',
    fontWeight: '600',
    fontFamily: "'DM Sans', system-ui, sans-serif",
    cursor: 'pointer',
    boxShadow: `0 4px 20px ${p.glow}, 0 0 0 1px rgba(255,255,255,0.03)`,
    minWidth: '160px',
    textAlign: 'center',
    letterSpacing: '-0.01em',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  };
};

const initialNodes = [
  {
    id: 'placeholder', // Changed from '1' to prevent ID collisions
    position: { x: 280, y: 220 },
    data: { label: '✦ Enter a role above and click Generate' },
    style: {
      background: '#111111',
      border: '2px dashed #333333',
      borderRadius: '14px',
      padding: '20px 32px',
      color: '#64748b',
      fontSize: '14px',
      fontFamily: "'DM Sans', system-ui, sans-serif",
      cursor: 'default',
      boxShadow: 'none',
    },
  },
];

const QUICK_ROLES = [
  'Software Engineer',
  'Product Manager',
  'Data Scientist',
  'UX Designer',
  'Marketing Manager',
  'Business Analyst',
  'DevOps Engineer',
  'AI Engineer',
  'Sales Manager',
  'Finance Analyst',
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
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            style: { stroke: '#a78bfa', strokeWidth: 2.5, strokeDasharray: '4 2' },
          },
          eds
        )
      ),
    [setEdges]
  );

  const handleGenerateRoadmap = async () => {
    if (!targetRole.trim()) return;
    setIsGenerating(true);
    setSelectedTopic(null);
    setVideos([]);

    try {
      const response = await fetch('/api/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetRole }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const styledNodes = data.nodes.map((node, i) => ({
        ...node,
        style: makeNodeStyle(i),
      }));

      const styledEdges = data.edges.map((edge) => ({
        ...edge,
        animated: true,
        style: { stroke: '#a78bfa', strokeWidth: 2.5, strokeDasharray: '4 2' },
      }));

      setNodes(styledNodes);
      setEdges(styledEdges);
    } catch (err) {
      console.error(err);
      alert("Failed to generate the roadmap. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const resetRoadmap = () => {
    setNodes(initialNodes);
    setEdges([]);
    setSelectedTopic(null);
    setVideos([]);
    setTargetRole("");
  };

  const onNodeClick = async (event, node) => {
    // Only ignore clicks on our specific placeholder node
    if (node.id === 'placeholder') return; 

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
    } catch (err) {
      console.error("Video fetch failed", err);
    } finally {
      setIsLoadingVideos(false);
    }
  };

  // Updated to look for the 'placeholder' ID
  const isEmpty = nodes.length === 1 && nodes[0].id === 'placeholder';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideIn { 
          from { opacity:0; transform:translateX(30px); } 
          to { opacity:1; transform:translateX(0); } 
        }

        .rm * { box-sizing: border-box; }

        /* React Flow overrides */
        .rm .react-flow__background,
        .rm .react-flow__pane,
        .rm .react-flow__renderer { background: #0a0a0a !important; }
        
        .rm .react-flow__controls {
          background: #111111 !important;
          border: 1px solid #222222 !important;
          border-radius: 12px !important;
          overflow: hidden;
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.3) !important;
        }
        .rm .react-flow__controls-button {
          background: #111111 !important;
          border: none !important;
          border-bottom: 1px solid #222222 !important;
          width: 32px !important;
          height: 32px !important;
          transition: all 0.2s ease;
        }
        .rm .react-flow__controls-button:last-child { border-bottom: none !important; }
        .rm .react-flow__controls-button:hover { background: #1f1f1f !important; }

        .rm .react-flow__node {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .rm .react-flow__node:hover {
          filter: brightness(1.15) !important;
        }
        .rm .react-flow__node.selected > div {
          outline: 3px solid #a78bfa !important;
          outline-offset: 4px !important;
          border-radius: 14px !important;
        }

        /* Scrollbar */
        .rm ::-webkit-scrollbar { width: 4px; }
        .rm ::-webkit-scrollbar-track { background: transparent; }
        .rm ::-webkit-scrollbar-thumb { background: #333; border-radius: 20px; }

        /* Input & Buttons */
        .rm-input {
          background: #111111;
          border: 1px solid #222222;
          border-radius: 12px;
          padding: 12px 16px;
          font-size: 15px;
          color: #f1f1f1;
          font-family: 'DM Sans', system-ui, sans-serif;
          transition: all 0.2s ease;
          width: 280px;
        }
        .rm-input:focus {
          outline: none;
          border-color: #a78bfa;
          box-shadow: 0 0 0 4px rgba(167, 139, 250, 0.15);
        }
        .rm-input::placeholder { color: #555; }

        .rm-btn-primary {
          background: linear-gradient(90deg, #a78bfa, #c026d3);
          border: none;
          border-radius: 12px;
          padding: 12px 24px;
          color: white;
          font-size: 15px;
          font-weight: 600;
          font-family: 'DM Sans', system-ui, sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          white-space: nowrap;
          box-shadow: 0 4px 12px -2px rgb(167 139 250);
        }
        .rm-btn-primary:hover:not(:disabled) {
          box-shadow: 0 8px 20px -4px rgb(167 139 250);
        }
        .rm-btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

        .rm-btn-secondary {
          background: #111111;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 10px 16px;
          color: #a3a3a3;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .rm-btn-secondary:hover { background: #1f1f1f; color: #e0e0e0; }

        /* Video panel - optimized animations */
        .video-panel {
          animation: slideIn 0.4s cubic-bezier(0.32, 0.72, 0, 1) forwards;
          opacity: 0;
        }
        .rm-video-card {
          display: flex;
          flex-direction: column;
          gap: 10px;
          border: 1px solid #222;
          border-radius: 12px;
          padding: 8px;
          background: #111;
          text-decoration: none;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          animation: fadeUp 0.4s ease backwards;
        }
        .rm-video-card:hover {
          border-color: #a78bfa;
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 15px 25px -5px rgb(167 139 250 / 0.15);
        }
      `}</style>

      <div
        className="rm"
        style={{
          ...(isFullscreen
            ? {
                position: 'fixed',
                inset: 0,
                zIndex: 50,
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                background: '#0a0a0a',
              }
            : {
                display: 'flex',
                flexDirection: 'column',
                height: '88vh',
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '40px 24px 24px',
                background: '#0a0a0a',
              }),
          fontFamily: "'DM Sans', system-ui, sans-serif",
          color: '#e5e5e5',
        }}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Map size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-white">Career Roadmap</h1>
              <p className="text-sm text-zinc-400 -mt-0.5">Visualize your path • Click nodes for tutorials</p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <input
              className="rm-input"
              placeholder="e.g. AI Product Manager"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerateRoadmap()}
            />

            <button
              className="rm-btn-primary"
              onClick={handleGenerateRoadmap}
              disabled={isGenerating || !targetRole.trim()}
            >
              {isGenerating ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generate Roadmap
                </>
              )}
            </button>

            {nodes.length > 1 && (
              <button
                onClick={resetRoadmap}
                className="rm-btn-secondary flex items-center gap-2 px-5"
              >
                <RefreshCw size={16} />
                Reset
              </button>
            )}

            <button
              className="w-10 h-10 flex items-center justify-center bg-[#111] hover:bg-[#1f1f1f] border border-[#222] rounded-2xl text-zinc-400 hover:text-white transition-colors"
              onClick={() => setIsFullscreen((f) => !f)}
            >
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
          </div>
        </div>

        {/* Quick role suggestions */}
        {isEmpty && (
          <div className="mb-6 flex flex-wrap gap-2">
            <span className="text-xs uppercase tracking-widest text-zinc-500 px-3 py-2">Popular roles:</span>
            {QUICK_ROLES.map((role) => (
              <button
                key={role}
                onClick={() => {
                  setTargetRole(role);
                  setTimeout(() => handleGenerateRoadmap(), 80);
                }}
                className="px-5 py-2 text-sm font-medium bg-[#111] hover:bg-[#1a1a1a] border border-[#222] rounded-3xl text-zinc-300 hover:text-white transition-all flex items-center gap-2"
              >
                <Zap size={14} className="text-amber-400" />
                {role}
              </button>
            ))}
          </div>
        )}

        {/* MAIN CANVAS */}
        <div
          style={{
            flex: 1,
            borderRadius: '20px',
            overflow: 'hidden',
            border: '1px solid #1f1f1f',
            background: '#0a0a0a',
            boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.4)',
            position: 'relative',
            transition: 'padding-right 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            paddingRight: selectedTopic ? '340px' : '0px',
          }}
        >
          {/* ReactFlow */}
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            style={{ background: '#0a0a0a', width: '100%', height: '100%' }}
            defaultEdgeOptions={{
              animated: true,
              style: { stroke: '#a78bfa', strokeWidth: 2.5 },
            }}
          >
            <Controls showInteractive={false} position="bottom-left" />
            <MiniMap zoomable pannable nodeColor={() => '#6b21a8'} maskColor="rgba(10,10,10,0.85)" />
            <Background variant="dots" gap={28} size={1.2} color="#222" />
          </ReactFlow>

          {/* VIDEO PANEL */}
          {selectedTopic && (
            <div
              className="video-panel"
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '320px',
                background: '#111111',
                border: '1px solid #222222',
                borderRadius: '20px',
                overflow: 'hidden',
                zIndex: 40,
                boxShadow: '0 30px 60px -15px rgb(0 0 0 / 0.6)',
                display: 'flex',
                flexDirection: 'column',
                maxHeight: 'calc(100% - 40px)',
              }}
            >
              {/* Panel Header */}
              <div className="px-5 py-4 border-b border-[#222] bg-[#171717] flex items-center gap-3">
                <div className="w-8 h-8 bg-red-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Youtube size={20} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-[15px] leading-tight truncate">{selectedTopic}</p>
                  <p className="text-xs text-zinc-400">Recommended learning videos</p>
                </div>
                <button
                  onClick={() => setSelectedTopic(null)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-[#222] rounded-2xl text-zinc-400 hover:text-red-400 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Videos Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {isLoadingVideos ? (
                  <div className="flex flex-col items-center justify-center h-64 gap-4">
                    <div className="w-9 h-9 border-2 border-zinc-700 border-t-purple-400 rounded-full animate-spin" />
                    <p className="text-sm text-zinc-400">Finding the best tutorials…</p>
                  </div>
                ) : videos.length > 0 ? (
                  videos.map((vid, i) => (
                    <a
                      key={i}
                      href={vid.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rm-video-card"
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <div className="relative rounded-2xl overflow-hidden aspect-video bg-black">
                        <img
                          src={vid.thumbnail}
                          alt={vid.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center pb-3">
                          <PlayCircle size={42} className="text-white/90 drop-shadow-md" />
                        </div>
                        {vid.duration && (
                          <div className="absolute bottom-3 right-3 bg-black/80 text-white text-[10px] font-mono px-2 py-px rounded">
                            {vid.duration}
                          </div>
                        )}
                      </div>
                      <div className="px-1">
                        <p className="font-medium text-sm leading-tight text-white line-clamp-2">
                          {vid.title}
                        </p>
                        <p className="text-xs text-zinc-400 mt-2">{vid.author}</p>
                      </div>
                    </a>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center px-8">
                    <p className="text-zinc-400 text-sm">No videos found for this topic.</p>
                    <p className="text-xs text-zinc-500 mt-1">Try clicking another node</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
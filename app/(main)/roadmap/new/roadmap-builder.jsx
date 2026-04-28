"use client";
import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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
import { ArrowLeft, Loader2, Maximize, Minimize, Youtube, X, PlayCircle, Map, Sparkles, RefreshCw, Zap, CheckCircle2 } from 'lucide-react';
import { getRoadmap, updateRoadmapProgress } from '@/actions/roadmap';

// ── Premium node color palette ──
const PALETTES = [
  { bg: 'hsl(var(--primary) / 0.12)', border: 'hsl(var(--primary))', text: 'hsl(var(--foreground))', glow: 'hsl(var(--primary) / 0.18)' },
  { bg: 'hsl(var(--secondary) / 0.12)', border: 'hsl(var(--secondary))', text: 'hsl(var(--foreground))', glow: 'hsl(var(--secondary) / 0.18)' },
  { bg: 'hsl(160 84% 39% / 0.12)', border: 'hsl(160 84% 39%)', text: 'hsl(var(--foreground))', glow: 'hsl(160 84% 39% / 0.18)' },
  { bg: 'hsl(var(--accent) / 0.14)', border: 'hsl(var(--accent))', text: 'hsl(var(--foreground))', glow: 'hsl(var(--accent) / 0.18)' },
  { bg: 'hsl(var(--destructive) / 0.12)', border: 'hsl(var(--destructive))', text: 'hsl(var(--foreground))', glow: 'hsl(var(--destructive) / 0.16)' },
];

const makeNodeStyle = (idx = 0) => {
  const p = PALETTES[idx % PALETTES.length];
  return {
    background: p.bg,
    border: `2px solid ${p.border}`,
    borderRadius: '8px',
    padding: '14px 20px',
    color: p.text,
    fontSize: '13.5px',
    fontWeight: '600',
    fontFamily: "'DM Sans', system-ui, sans-serif",
    cursor: 'pointer',
    boxShadow: `0 8px 24px ${p.glow}`,
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
      background: 'hsl(var(--card))',
      border: '2px dashed hsl(var(--border))',
      borderRadius: '8px',
      padding: '20px 32px',
      color: 'hsl(var(--muted-foreground))',
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
  const searchParams = useSearchParams();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [targetRole, setTargetRole] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [videos, setVideos] = useState([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  const [activeRoadmapId, setActiveRoadmapId] = useState(null);
  const [completedNodeIds, setCompletedNodeIds] = useState([]);

  React.useEffect(() => {
    const roadmapId = searchParams.get("roadmap");
    if (!roadmapId) return;

    getRoadmap(roadmapId)
      .then((roadmap) => {
        if (!roadmap) return;

        const styledNodes = (roadmap.nodes || []).map((node, i) => ({
          ...node,
          style: makeNodeStyle(i),
        }));
        const styledEdges = (roadmap.edges || []).map((edge) => ({
          ...edge,
          animated: true,
          style: { stroke: 'hsl(var(--primary))', strokeWidth: 2.5, strokeDasharray: '4 2' },
        }));

        setTargetRole(roadmap.targetRole);
        setNodes(styledNodes);
        setEdges(styledEdges);
        setActiveRoadmapId(roadmap.id);
        setCompletedNodeIds(roadmap.completedNodeIds || []);
      })
      .catch(() => {});
  }, [searchParams, setEdges, setNodes]);

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            style: { stroke: 'hsl(var(--primary))', strokeWidth: 2.5, strokeDasharray: '4 2' },
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
        style: { stroke: 'hsl(var(--primary))', strokeWidth: 2.5, strokeDasharray: '4 2' },
      }));

      setNodes(styledNodes);
      setEdges(styledEdges);
      setActiveRoadmapId(data.id);
      setCompletedNodeIds([]);
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
    setActiveRoadmapId(null);
    setCompletedNodeIds([]);
  };

  const toggleSelectedTopicComplete = async () => {
    if (!activeRoadmapId || !selectedTopic) return;

    const selectedNode = nodes.find((node) => node.data?.label === selectedTopic);
    if (!selectedNode) return;

    const nextCompleted = completedNodeIds.includes(selectedNode.id)
      ? completedNodeIds.filter((id) => id !== selectedNode.id)
      : [...completedNodeIds, selectedNode.id];

    setCompletedNodeIds(nextCompleted);

    await updateRoadmapProgress(activeRoadmapId, nextCompleted);
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
        .rm .react-flow__renderer { background: hsl(var(--muted)) !important; }
        
        .rm .react-flow__controls {
          background: hsl(var(--card)) !important;
          border: 1px solid hsl(var(--border)) !important;
          border-radius: 8px !important;
          overflow: hidden;
          box-shadow: 0 10px 20px -12px hsl(var(--foreground) / 0.35) !important;
        }
        .rm .react-flow__controls-button {
          background: hsl(var(--card)) !important;
          border: none !important;
          border-bottom: 1px solid hsl(var(--border)) !important;
          width: 32px !important;
          height: 32px !important;
          transition: all 0.2s ease;
        }
        .rm .react-flow__controls-button:last-child { border-bottom: none !important; }
        .rm .react-flow__controls-button:hover { background: hsl(var(--primary) / 0.10) !important; }

        .rm .react-flow__node {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .rm .react-flow__node:hover {
          filter: brightness(1.15) !important;
        }
        .rm .react-flow__node.selected > div {
          outline: 3px solid hsl(var(--primary)) !important;
          outline-offset: 4px !important;
          border-radius: 14px !important;
        }

        /* Scrollbar */
        .rm ::-webkit-scrollbar { width: 4px; }
        .rm ::-webkit-scrollbar-track { background: transparent; }
        .rm ::-webkit-scrollbar-thumb { background: hsl(var(--border)); border-radius: 20px; }

        /* Input & Buttons */
        .rm-input {
          background: hsl(var(--card));
          border: 1px solid hsl(var(--border));
          border-radius: 8px;
          padding: 12px 16px;
          font-size: 15px;
          color: hsl(var(--foreground));
          font-family: 'DM Sans', system-ui, sans-serif;
          transition: all 0.2s ease;
          width: 280px;
        }
        .rm-input:focus {
          outline: none;
          border-color: hsl(var(--primary));
          box-shadow: 0 0 0 4px hsl(var(--primary) / 0.15);
        }
        .rm-input::placeholder { color: hsl(var(--muted-foreground)); }

        .rm-btn-primary {
          background: hsl(var(--primary));
          border: none;
          border-radius: 8px;
          padding: 12px 24px;
          color: hsl(var(--primary-foreground));
          font-size: 15px;
          font-weight: 600;
          font-family: 'DM Sans', system-ui, sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          white-space: nowrap;
          box-shadow: 0 4px 12px -2px hsl(var(--primary) / 0.35);
        }
        .rm-btn-primary:hover:not(:disabled) {
          box-shadow: 0 8px 20px -4px hsl(var(--primary) / 0.35);
        }
        .rm-btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

        .rm-btn-secondary {
          background: hsl(var(--card));
          border: 1px solid hsl(var(--border));
          border-radius: 8px;
          padding: 10px 16px;
          color: hsl(var(--muted-foreground));
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .rm-btn-secondary:hover { background: hsl(var(--primary) / 0.10); color: hsl(var(--primary)); }

        /* Video panel - optimized animations */
        .video-panel {
          animation: slideIn 0.4s cubic-bezier(0.32, 0.72, 0, 1) forwards;
          opacity: 0;
        }
        .rm-video-card {
          display: flex;
          flex-direction: column;
          gap: 10px;
          border: 1px solid hsl(var(--border));
          border-radius: 8px;
          padding: 8px;
          background: hsl(var(--card));
          text-decoration: none;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          animation: fadeUp 0.4s ease backwards;
        }
        .rm-video-card:hover {
          border-color: hsl(var(--primary));
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 15px 25px -5px hsl(var(--primary) / 0.15);
        }
      `}</style>

      <div
        className="rm"
        style={{
          ...(isFullscreen
            ? {
                position: 'fixed',
                inset: 0,
                zIndex: 99999,
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                background: 'hsl(var(--background))',
                height: '100vh',
                width: '100vw',
              }
            : {
                display: 'flex',
                flexDirection: 'column',
                height: '88vh',
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '40px 24px 24px',
                background: 'hsl(var(--background))',
              }),
          fontFamily: "'DM Sans', system-ui, sans-serif",
          color: 'hsl(var(--foreground))',
        }}
      >
        <div className="mb-6">
          <Link
            href="/roadmap"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={16} />
            Back to Roadmap Dashboard
          </Link>
        </div>

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <Map size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">Career Roadmap</h1>
              <p className="text-sm text-muted-foreground -mt-0.5">Visualize your path • Click nodes for tutorials</p>
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
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              onClick={() => setIsFullscreen((f) => !f)}
            >
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
          </div>
        </div>

        {/* Quick role suggestions */}
        {isEmpty && (
          <div className="mb-6 flex flex-wrap gap-2">
            <span className="px-3 py-2 text-xs uppercase tracking-widest text-muted-foreground">Popular roles:</span>
            {QUICK_ROLES.map((role) => (
              <button
                key={role}
                onClick={() => {
                  setTargetRole(role);
                  setTimeout(() => handleGenerateRoadmap(), 80);
                }}
                className="flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2 text-sm font-medium text-foreground transition-all hover:bg-muted"
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
            border: '1px solid hsl(var(--border))',
            background: 'hsl(var(--background))',
            boxShadow: '0 25px 50px -24px hsl(var(--foreground) / 0.35)',
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
            style={{ background: 'hsl(var(--background))', width: '100%', height: '100%' }}
            defaultEdgeOptions={{
              animated: true,
              style: { stroke: 'hsl(var(--primary))', strokeWidth: 2.5 },
            }}
          >
            <Controls showInteractive={false} position="bottom-left" />
            <MiniMap zoomable pannable nodeColor={() => 'hsl(var(--primary))'} maskColor="hsl(var(--background) / 0.78)" />
            <Background variant="dots" gap={28} size={1.2} color="hsl(var(--border))" />
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
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                overflow: 'hidden',
                zIndex: 40,
                boxShadow: '0 30px 60px -30px hsl(var(--foreground) / 0.5)',
                display: 'flex',
                flexDirection: 'column',
                maxHeight: 'calc(100% - 40px)',
              }}
            >
              {/* Panel Header */}
              <div className="flex items-center gap-3 border-b border-border bg-muted px-5 py-4">
                <div className="w-8 h-8 bg-red-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Youtube size={20} className="text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-[15px] font-semibold leading-tight text-foreground">{selectedTopic}</p>
                  <p className="text-xs text-muted-foreground">Recommended learning videos</p>
                </div>
                <button
                  onClick={toggleSelectedTopicComplete}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-card hover:text-primary"
                  title="Toggle complete"
                >
                  <CheckCircle2
                    size={20}
                    className={
                      completedNodeIds.includes(nodes.find((n) => n.data?.label === selectedTopic)?.id)
                        ? 'text-emerald-400'
                        : ''
                    }
                  />
                </button>
                <button
                  onClick={() => setSelectedTopic(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-card hover:text-destructive"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Videos Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {isLoadingVideos ? (
                  <div className="flex flex-col items-center justify-center h-64 gap-4">
                    <div className="w-9 h-9 border-2 border-border border-t-primary rounded-full animate-spin" />
                    <p className="text-sm text-muted-foreground">Finding the best tutorials…</p>
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
                      <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                        <img
                          src={vid.thumbnail}
                          alt={vid.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-foreground/70 to-transparent pb-3">
                          <PlayCircle size={42} className="text-primary-foreground/90 drop-shadow-md" />
                        </div>
                        {vid.duration && (
                          <div className="absolute bottom-3 right-3 rounded bg-foreground/80 px-2 py-px font-mono text-[10px] text-background">
                            {vid.duration}
                          </div>
                        )}
                      </div>
                      <div className="px-1">
                        <p className="line-clamp-2 text-sm font-medium leading-tight text-foreground">
                          {vid.title}
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground">{vid.author}</p>
                      </div>
                    </a>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center px-8">
                    <p className="text-sm text-muted-foreground">No videos found for this topic.</p>
                    <p className="mt-1 text-xs text-muted-foreground">Try clicking another node</p>
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

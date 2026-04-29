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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
    id: 'placeholder',
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

  const isEmpty = nodes.length === 1 && nodes[0].id === 'placeholder';
  const completion = nodes.length > 1
    ? Math.round((completedNodeIds.length / nodes.length) * 100)
    : 0;

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

        /* ── MINIMAP FIXES ── */
        .rm .react-flow__minimap {
          background: hsl(var(--card)) !important;
          border: 1px solid hsl(var(--border)) !important;
          border-radius: 8px !important;
          box-shadow: 0 10px 20px -12px hsl(var(--foreground) / 0.35) !important;
          overflow: hidden;
        }
        .rm .react-flow__minimap-mask {
          fill: hsl(var(--background)) !important;
          opacity: 0.7 !important;
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

        /* Video panel - optimized animations */
        .video-panel {
          animation: slideIn 0.4s cubic-bezier(0.32, 0.72, 0, 1) forwards;
          opacity: 0;
        }
        .rm-video-card {
          display: grid;
          grid-template-columns: 112px minmax(0, 1fr);
          align-items: center;
          gap: 12px;
          border: 1px solid hsl(var(--border));
          border-radius: 8px;
          padding: 10px;
          background: hsl(var(--card) / 0.72);
          text-decoration: none;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          animation: fadeUp 0.4s ease backwards;
        }
        .rm-video-card:hover {
          border-color: hsl(var(--primary));
          transform: translateY(-2px);
          box-shadow: 0 15px 25px -5px hsl(var(--primary) / 0.15);
        }
        .rm-video-thumb {
          position: relative;
          aspect-ratio: 1 / 1;
          height: 112px;
          width: 112px;
          overflow: hidden;
          border-radius: 8px;
          background: hsl(var(--muted));
          flex-shrink: 0;
        }
        .rm-video-thumb img {
          display: block;
          height: 100%;
          width: 100%;
          object-fit: cover;
        }
        @media (max-width: 720px) {
          .rm-video-card {
            grid-template-columns: 92px minmax(0, 1fr);
          }
          .rm-video-thumb {
            height: 92px;
            width: 92px;
          }
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
        <Card className="mb-6 p-5">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <Map size={22} />
              </div>
              <div>
                <Badge variant="outline" className="mb-2 border-primary/25 bg-primary/10 text-primary">
                  Roadmap builder
                </Badge>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">Career Roadmap</h1>
                <p className="text-sm text-muted-foreground -mt-0.5">Visualize your path and click nodes for tutorials</p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Input
                className="w-full bg-card/70 sm:w-[280px]"
                placeholder="e.g. AI Product Manager"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerateRoadmap()}
              />

              <Button
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
              </Button>

              {nodes.length > 1 && (
                <Button
                  onClick={resetRoadmap}
                  variant="outline"
                >
                  <RefreshCw size={16} />
                  Reset
                </Button>
              )}

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setIsFullscreen((f) => !f)}
                    >
                      {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{isFullscreen ? "Exit fullscreen" : "Fullscreen canvas"}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          {nodes.length > 1 && (
            <div className="mt-5 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-center">
              <Progress value={completion} />
              <Badge variant="secondary">{completion}% complete</Badge>
            </div>
          )}
        </Card>

        {/* Quick role suggestions */}
        {isEmpty && (
          <div className="mb-6 flex flex-wrap gap-2">
            <span className="px-3 py-2 text-xs uppercase tracking-widest text-muted-foreground">Popular roles:</span>
            {QUICK_ROLES.map((role) => (
              <Button
                key={role}
                onClick={() => {
                  setTargetRole(role);
                  setTimeout(() => handleGenerateRoadmap(), 80);
                }}
                variant="outline"
                className="rounded-full bg-card/60"
              >
                <Zap size={14} className="text-amber-400" />
                {role}
              </Button>
            ))}
          </div>
        )}

        {/* ── FIX: MAIN CANVAS AREA (Using Flex Siblings instead of Position Hack) ── */}
        <div style={{ display: 'flex', flex: 1, gap: '20px', minHeight: 0 }}>
          
          {/* ReactFlow Canvas Container */}
          <div
            style={{
              flex: 1,
              borderRadius: '20px',
              overflow: 'hidden',
              border: '1px solid hsl(var(--border))',
              background: 'hsl(var(--card) / 0.58)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 25px 50px -24px hsl(var(--foreground) / 0.35)',
              position: 'relative',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              fitView
              fitViewOptions={{ padding: 0.2 }}
              style={{ background: 'transparent', width: '100%', height: '100%' }}
              defaultEdgeOptions={{
                animated: true,
                style: { stroke: 'hsl(var(--primary))', strokeWidth: 2.5 },
              }}
            >
              <Controls showInteractive={false} position="bottom-left" />
              {/* Note: maskColor removed here as it is now properly handled by the injected CSS classes above */}
              <MiniMap zoomable pannable nodeColor={() => 'hsl(var(--primary))'} />
              <Background variant="dots" gap={28} size={1.2} color="hsl(var(--border))" />
            </ReactFlow>
          </div>

          {/* Video Panel Container */}
          {selectedTopic && (
            <div
              className="video-panel"
              style={{
                width: 'min(460px, 100%)',
                flexShrink: 0,
                background: 'hsl(var(--card) / 0.96)',
                border: '1px solid hsl(var(--border))',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 30px 60px -30px hsl(var(--foreground) / 0.5)',
                display: 'flex',
                flexDirection: 'column',
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
              <ScrollArea className="min-h-0 flex-1" viewportClassName="space-y-3 p-4 pr-3">
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
                      <div className="rm-video-thumb">
                        <img
                          src={vid.thumbnail}
                          alt={vid.title}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-foreground/10 opacity-90 transition-opacity hover:opacity-100">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600/95 text-primary-foreground shadow-lg">
                            <PlayCircle size={22} />
                          </span>
                        </div>
                        {vid.duration && (
                          <div className="absolute bottom-1.5 right-1.5 rounded bg-foreground/85 px-1.5 py-px font-mono text-[10px] text-background">
                            {vid.duration}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 py-1">
                        <p className="line-clamp-2 text-sm font-medium leading-tight text-foreground">
                          {vid.title}
                        </p>
                        <p className="mt-2 truncate text-xs text-muted-foreground">{vid.author}</p>
                        <p className="mt-3 text-xs font-medium text-primary">Watch on YouTube</p>
                      </div>
                    </a>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center px-8">
                    <p className="text-sm text-muted-foreground">No videos found for this topic.</p>
                    <p className="mt-1 text-xs text-muted-foreground">Try clicking another node</p>
                  </div>
                )}
              </ScrollArea>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
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
import {
  ArrowLeft, Loader2, Maximize, Minimize, Youtube, X,
  PlayCircle, Map, Sparkles, RefreshCw, Zap, CheckCircle2,
} from 'lucide-react';
import { getRoadmap, updateRoadmapProgress } from '@/actions/roadmap';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// ── Node color palette ──
const PALETTES = [
  { bg: 'hsl(var(--primary) / 0.12)',     border: 'hsl(var(--primary))',     glow: 'hsl(var(--primary) / 0.22)' },
  { bg: 'hsl(var(--secondary) / 0.12)',   border: 'hsl(var(--secondary))',   glow: 'hsl(var(--secondary) / 0.22)' },
  { bg: 'hsl(160 84% 39% / 0.12)',        border: 'hsl(160 84% 39%)',        glow: 'hsl(160 84% 39% / 0.22)' },
  { bg: 'hsl(var(--accent) / 0.14)',      border: 'hsl(var(--accent))',      glow: 'hsl(var(--accent) / 0.22)' },
  { bg: 'hsl(var(--destructive) / 0.12)', border: 'hsl(var(--destructive))', glow: 'hsl(var(--destructive) / 0.20)' },
];

const makeNodeStyle = (idx = 0) => {
  const p = PALETTES[idx % PALETTES.length];
  return {
    background: p.bg,
    border: `2px solid ${p.border}`,
    borderRadius: '10px',
    padding: '12px 20px',
    color: 'hsl(var(--foreground))',
    fontSize: '13px',
    fontWeight: '600',
    fontFamily: "'DM Sans', system-ui, sans-serif",
    cursor: 'pointer',
    boxShadow: `0 6px 20px ${p.glow}`,
    minWidth: '150px',
    textAlign: 'center',
    letterSpacing: '-0.01em',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  };
};

const initialNodes = [
  {
    id: 'placeholder',
    position: { x: 280, y: 200 },
    data: { label: '✦ Enter a role above and click Generate' },
    style: {
      background: 'hsl(var(--card))',
      border: '2px dashed hsl(var(--border))',
      borderRadius: '10px',
      padding: '20px 32px',
      color: 'hsl(var(--muted-foreground))',
      fontSize: '14px',
      fontFamily: "'DM Sans', system-ui, sans-serif",
      cursor: 'default',
    },
  },
];

const QUICK_ROLES = [
  'Software Engineer', 'Product Manager', 'Data Scientist', 'UX Designer',
  'Marketing Manager', 'Business Analyst', 'DevOps Engineer', 'AI Engineer',
];

export default function CareerRoadmapPage() {
  const searchParams = useSearchParams();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [targetRole, setTargetRole] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [videos, setVideos] = useState([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  const [activeRoadmapId, setActiveRoadmapId] = useState(null);
  const [completedNodeIds, setCompletedNodeIds] = useState([]);

  React.useEffect(() => {
    const roadmapId = searchParams.get('roadmap');
    if (!roadmapId) return;
    getRoadmap(roadmapId).then((roadmap) => {
      if (!roadmap) return;
      setTargetRole(roadmap.targetRole);
      setNodes((roadmap.nodes || []).map((n, i) => ({ ...n, style: makeNodeStyle(i) })));
      setEdges((roadmap.edges || []).map((e) => ({
        ...e, animated: true,
        style: { stroke: 'hsl(var(--primary))', strokeWidth: 2.5, strokeDasharray: '4 2' },
      })));
      setActiveRoadmapId(roadmap.id);
      setCompletedNodeIds(roadmap.completedNodeIds || []);
    }).catch(() => {});
  }, [searchParams, setEdges, setNodes]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({
      ...params, animated: true,
      style: { stroke: 'hsl(var(--primary))', strokeWidth: 2.5, strokeDasharray: '4 2' },
    }, eds)),
    [setEdges],
  );

  const handleGenerateRoadmap = async () => {
    if (!targetRole.trim()) return;
    setIsGenerating(true);
    setSelectedTopic(null);
    setVideos([]);
    try {
      const res = await fetch('/api/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetRole }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setNodes(data.nodes.map((n, i) => ({ ...n, style: makeNodeStyle(i) })));
      setEdges(data.edges.map((e) => ({
        ...e, animated: true,
        style: { stroke: 'hsl(var(--primary))', strokeWidth: 2.5, strokeDasharray: '4 2' },
      })));
      setActiveRoadmapId(data.id);
      setCompletedNodeIds([]);
    } catch (err) {
      console.error(err);
      alert('Failed to generate the roadmap. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const resetRoadmap = () => {
    setNodes(initialNodes);
    setEdges([]);
    setSelectedTopic(null);
    setVideos([]);
    setTargetRole('');
    setActiveRoadmapId(null);
    setCompletedNodeIds([]);
  };

  const toggleSelectedTopicComplete = async () => {
    if (!activeRoadmapId || !selectedTopic) return;
    const node = nodes.find((n) => n.data?.label === selectedTopic);
    if (!node) return;
    const next = completedNodeIds.includes(node.id)
      ? completedNodeIds.filter((id) => id !== node.id)
      : [...completedNodeIds, node.id];
    setCompletedNodeIds(next);
    await updateRoadmapProgress(activeRoadmapId, next);
  };

  const onNodeClick = async (_, node) => {
    if (node.id === 'placeholder') return;
    setSelectedTopic(node.data.label);
    setIsLoadingVideos(true);
    setVideos([]);
    try {
      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: node.data.label }),
      });
      const data = await res.json();
      setVideos(data.videos || []);
    } catch (err) {
      console.error('Video fetch failed', err);
    } finally {
      setIsLoadingVideos(false);
    }
  };

  const isEmpty = nodes.length === 1 && nodes[0].id === 'placeholder';
  const completion = nodes.length > 1 ? Math.round((completedNodeIds.length / nodes.length) * 100) : 0;
  const selectedNodeId = nodes.find((n) => n.data?.label === selectedTopic)?.id;
  const isTopicComplete = selectedNodeId ? completedNodeIds.includes(selectedNodeId) : false;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

        @keyframes fadeUp   { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideUp  { from { opacity:0; transform:translateY(100%); } to { opacity:1; transform:translateY(0); } }
        @keyframes scaleIn  { from { opacity:0; transform:scale(0.96); } to { opacity:1; transform:scale(1); } }

        .rm * { box-sizing: border-box; }

        /* ── ReactFlow overrides ── */
        .rm .react-flow__background,
        .rm .react-flow__pane,
        .rm .react-flow__renderer { background: transparent !important; }

        .rm .react-flow__controls {
          background: hsl(var(--card)) !important;
          border: 1px solid hsl(var(--border)) !important;
          border-radius: 10px !important;
          overflow: hidden;
          box-shadow: 0 8px 20px -8px hsl(var(--foreground)/0.3) !important;
        }
        .rm .react-flow__controls-button {
          background: hsl(var(--card)) !important;
          border: none !important;
          border-bottom: 1px solid hsl(var(--border)) !important;
          width: 32px !important; height: 32px !important;
          transition: background 0.15s;
        }
        .rm .react-flow__controls-button:last-child { border-bottom: none !important; }
        .rm .react-flow__controls-button:hover { background: hsl(var(--primary)/0.12) !important; }

        .rm .react-flow__node { transition: all 0.2s cubic-bezier(0.4,0,0.2,1) !important; }
        .rm .react-flow__node:hover { filter: brightness(1.18) !important; }
        .rm .react-flow__node.selected > div {
          outline: 3px solid hsl(var(--primary)) !important;
          outline-offset: 3px !important;
          border-radius: 14px !important;
        }

        .rm .react-flow__minimap {
          background: hsl(var(--card)) !important;
          border: 1px solid hsl(var(--border)) !important;
          border-radius: 10px !important;
          overflow: hidden;
        }
        .rm .react-flow__minimap-mask {
          fill: hsl(var(--background)) !important;
          opacity: 0.65 !important;
        }

        /* ── Scrollbar ── */
        .rm ::-webkit-scrollbar { width: 4px; }
        .rm ::-webkit-scrollbar-track { background: transparent; }
        .rm ::-webkit-scrollbar-thumb { background: hsl(var(--border)); border-radius: 20px; }

        /* ── Video panel (bottom drawer on canvas) ── */
        .video-drawer {
          animation: slideUp 0.38s cubic-bezier(0.32, 0.72, 0, 1) forwards;
        }

        /* ── Video card: square thumbnail layout ── */
        .rm-video-card {
          display: flex;
          align-items: center;
          gap: 14px;
          border: 1px solid hsl(var(--border));
          border-radius: 12px;
          padding: 12px;
          background: hsl(var(--background)/0.6);
          text-decoration: none;
          transition: all 0.22s cubic-bezier(0.4,0,0.2,1);
          animation: fadeUp 0.35s ease backwards;
        }
        .rm-video-card:hover {
          border-color: hsl(var(--primary)/0.6);
          background: hsl(var(--primary)/0.05);
          transform: translateY(-1px);
          box-shadow: 0 12px 24px -6px hsl(var(--primary)/0.18);
        }

        /* SQUARE thumbnail — 80×80 fixed */
        .rm-thumb {
          position: relative;
          width: 80px;
          height: 80px;
          flex-shrink: 0;
          border-radius: 10px;
          overflow: hidden;
          background: hsl(var(--muted));
        }
        .rm-thumb img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }
        .rm-thumb-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: hsl(var(--foreground)/0.08);
          transition: background 0.2s;
        }
        .rm-video-card:hover .rm-thumb-overlay {
          background: hsl(var(--foreground)/0.18);
        }
        .rm-play-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px; height: 30px;
          border-radius: 50%;
          background: hsl(0 72% 51%);
          color: #fff;
          box-shadow: 0 4px 12px hsl(0 72% 51%/0.45);
        }
        .rm-duration {
          position: absolute;
          bottom: 4px; right: 4px;
          border-radius: 4px;
          background: hsl(var(--foreground)/0.82);
          padding: 1px 5px;
          font-family: ui-monospace, monospace;
          font-size: 10px;
          color: hsl(var(--background));
          line-height: 1.4;
        }

        /* Quick role pill */
        .role-pill {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 14px;
          border-radius: 100px;
          border: 1px solid hsl(var(--border));
          background: hsl(var(--card)/0.7);
          font-size: 13px; font-weight: 500;
          color: hsl(var(--foreground));
          cursor: pointer;
          transition: all 0.18s ease;
          font-family: 'DM Sans', system-ui, sans-serif;
          white-space: nowrap;
        }
        .role-pill:hover {
          border-color: hsl(var(--primary)/0.5);
          background: hsl(var(--primary)/0.08);
          color: hsl(var(--primary));
        }
      `}</style>

      <div
        className="rm"
        style={{
          fontFamily: "'DM Sans', system-ui, sans-serif",
          color: 'hsl(var(--foreground))',
          background: 'hsl(var(--background))',
          ...(isFullscreen
            ? { position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', flexDirection: 'column', padding: '20px' }
            : { display: 'flex', flexDirection: 'column', height: '90vh', maxWidth: '1280px', margin: '0 auto', padding: '32px 24px 20px' }
          ),
        }}
      >
        {/* Back link */}
        <div className="mb-5">
          <Link href="/roadmap" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={15} /> Back to Roadmap Dashboard
          </Link>
        </div>

        {/* ── HEADER CARD ── */}
        <Card className="mb-4 p-4" style={{ flexShrink: 0 }}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Title */}
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md shadow-primary/25">
                <Map size={20} />
              </div>
              <div>
                <Badge variant="outline" className="mb-1 text-xs border-primary/25 bg-primary/8 text-primary">
                  Roadmap builder
                </Badge>
                <h1 className="text-xl font-semibold tracking-tight leading-tight">Career Roadmap</h1>
                <p className="text-xs text-muted-foreground">Visualize your path · click nodes for tutorials</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              <Input
                className="w-[220px] h-9 text-sm bg-card/70"
                placeholder="e.g. AI Product Manager"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerateRoadmap()}
              />
              <Button size="sm" onClick={handleGenerateRoadmap} disabled={isGenerating || !targetRole.trim()}>
                {isGenerating ? <><Loader2 size={15} className="animate-spin" /> Generating…</> : <><Sparkles size={15} /> Generate</>}
              </Button>
              {nodes.length > 1 && (
                <Button size="sm" variant="outline" onClick={resetRoadmap}>
                  <RefreshCw size={14} /> Reset
                </Button>
              )}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="outline" className="h-9 w-9" onClick={() => setIsFullscreen((f) => !f)}>
                      {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Progress bar */}
          {nodes.length > 1 && (
            <div className="mt-4 flex items-center gap-3">
              <Progress value={completion} className="flex-1 h-2" />
              <Badge variant="secondary" className="text-xs tabular-nums">{completion}% complete</Badge>
            </div>
          )}
        </Card>

        {/* Quick roles */}
        {isEmpty && (
          <div className="mb-4 flex flex-wrap items-center gap-2" style={{ flexShrink: 0 }}>
            <span className="text-xs uppercase tracking-widest text-muted-foreground px-1">Try:</span>
            {QUICK_ROLES.map((role) => (
              <button
                key={role}
                className="role-pill"
                onClick={() => { setTargetRole(role); setTimeout(handleGenerateRoadmap, 80); }}
              >
                <Zap size={12} style={{ color: '#f59e0b' }} />
                {role}
              </button>
            ))}
          </div>
        )}

        {/* ══════════════════════════════════════════════
            MAIN AREA — Canvas fills all remaining space.
            Video panel is a floating overlay INSIDE the
            canvas container, so the canvas never shrinks.
        ══════════════════════════════════════════════ */}
        <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>

          {/* ── ReactFlow Canvas (always full width/height) ── */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid hsl(var(--border))',
              background: 'hsl(var(--card)/0.55)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 20px 48px -20px hsl(var(--foreground)/0.3)',
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
              fitViewOptions={{ padding: 0.22 }}
              style={{ background: 'transparent', width: '100%', height: '100%' }}
              defaultEdgeOptions={{
                animated: true,
                style: { stroke: 'hsl(var(--primary))', strokeWidth: 2.5 },
              }}
            >
              <Controls showInteractive={false} position="bottom-left" />
              <MiniMap zoomable pannable nodeColor={() => 'hsl(var(--primary))'} position="bottom-right" />
              <Background variant="dots" gap={26} size={1.1} color="hsl(var(--border))" />
            </ReactFlow>
          </div>

          {/* ── Video Panel: floating drawer anchored to right side ──
              It overlays the canvas — canvas keeps full size.       */}
          {selectedTopic && (
            <div
              className="video-drawer"
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                bottom: 12,
                width: 'min(360px, calc(100% - 24px))',
                display: 'flex',
                flexDirection: 'column',
                background: 'hsl(var(--card)/0.97)',
                backdropFilter: 'blur(24px)',
                border: '1px solid hsl(var(--border))',
                borderRadius: '14px',
                overflow: 'hidden',
                boxShadow: '0 24px 48px -12px hsl(var(--foreground)/0.45)',
                zIndex: 20,
              }}
            >
              {/* Panel header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '14px 14px 14px 16px',
                  borderBottom: '1px solid hsl(var(--border))',
                  background: 'hsl(var(--muted)/0.7)',
                  flexShrink: 0,
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: 8, background: '#dc2626',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Youtube size={18} color="#fff" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'hsl(var(--foreground))' }}>
                    {selectedTopic}
                  </p>
                  <p style={{ fontSize: 11, margin: 0, color: 'hsl(var(--muted-foreground))' }}>Recommended tutorials</p>
                </div>
                {/* Mark complete */}
                <button
                  onClick={toggleSelectedTopicComplete}
                  title={isTopicComplete ? 'Mark incomplete' : 'Mark complete'}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer',
                    background: isTopicComplete ? 'hsl(160 84% 39%/0.12)' : 'transparent',
                    color: isTopicComplete ? 'hsl(160 84% 39%)' : 'hsl(var(--muted-foreground))',
                    transition: 'all 0.2s',
                  }}
                >
                  <CheckCircle2 size={19} />
                </button>
                {/* Close */}
                <button
                  onClick={() => setSelectedTopic(null)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer',
                    background: 'transparent', color: 'hsl(var(--muted-foreground))',
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.background = 'hsl(var(--destructive)/0.1)'; e.currentTarget.style.color = 'hsl(var(--destructive))'; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'hsl(var(--muted-foreground))'; }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Videos list */}
              <ScrollArea style={{ flex: 1, minHeight: 0 }}>
                <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {isLoadingVideos ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 220, gap: 12 }}>
                      <div style={{
                        width: 32, height: 32,
                        border: '2.5px solid hsl(var(--border))',
                        borderTopColor: 'hsl(var(--primary))',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                      }} />
                      <p style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))', margin: 0 }}>Finding best tutorials…</p>
                    </div>
                  ) : videos.length > 0 ? (
                    videos.map((vid, i) => (
                      <a
                        key={i}
                        href={vid.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rm-video-card"
                        style={{ animationDelay: `${i * 70}ms` }}
                      >
                        {/* ── Square thumbnail 80×80 ── */}
                        <div className="rm-thumb">
                          <img src={vid.thumbnail} alt={vid.title} />
                          <div className="rm-thumb-overlay">
                            <div className="rm-play-btn">
                              <PlayCircle size={16} />
                            </div>
                          </div>
                          {vid.duration && <div className="rm-duration">{vid.duration}</div>}
                        </div>

                        {/* Meta */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{
                            margin: '0 0 4px 0', fontSize: 13, fontWeight: 600, lineHeight: 1.35,
                            color: 'hsl(var(--foreground))',
                            display: '-webkit-box', WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical', overflow: 'hidden',
                          }}>
                            {vid.title}
                          </p>
                          <p style={{ margin: '0 0 6px 0', fontSize: 11, color: 'hsl(var(--muted-foreground))', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {vid.author}
                          </p>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            fontSize: 11, fontWeight: 600, color: 'hsl(var(--primary))',
                          }}>
                            <Youtube size={11} /> Watch on YouTube
                          </span>
                        </div>
                      </a>
                    ))
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 200, textAlign: 'center', padding: '0 24px' }}>
                      <Youtube size={32} style={{ color: 'hsl(var(--muted-foreground))', marginBottom: 10, opacity: 0.5 }} />
                      <p style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))', margin: 0 }}>No videos found for this topic.</p>
                      <p style={{ fontSize: 11, color: 'hsl(var(--muted-foreground))', margin: '4px 0 0 0', opacity: 0.7 }}>Try clicking another node</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
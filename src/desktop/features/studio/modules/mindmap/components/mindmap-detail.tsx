import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/common/components/ui/button";
import { ScrollArea } from "@/common/components/ui/scroll-area";
import { ArrowLeft, Download, FileDown, ImageDown, MoreVertical } from "lucide-react";
import { StudioContentItem } from "@/core/stores/studio.store";
import { MindmapData, MindmapEdge, MindmapNode } from "../types";
import { select } from "d3-selection";
import { zoom, zoomIdentity, D3ZoomEvent } from "d3-zoom";
import { drag, type D3DragEvent } from "d3-drag";
import { forceSimulation, forceLink, forceManyBody, forceCollide, forceCenter, SimulationNodeDatum, SimulationLinkDatum } from "d3-force";
import { ZoomIn, ZoomOut, Maximize2, Minimize2, RefreshCw, Focus } from "lucide-react";
import type { MindmapTreeNode } from "../types";
import { useStudioStore } from "@/core/stores/studio.store";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/common/components/ui/dropdown-menu";
import { generateMindmap } from "../services/mindmap.service";

function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const cr = entry.contentRect;
      setSize({ width: Math.floor(cr.width), height: Math.floor(cr.height) });
    });
    ro.observe(el);
    // initialize
    const rect = el.getBoundingClientRect();
    setSize({ width: Math.floor(rect.width), height: Math.floor(rect.height) });
    return () => ro.disconnect();
  }, []);

  return { ref, size } as const;
}

function computeDegree(nodes: MindmapNode[], edges: MindmapEdge[]): Map<string, number> {
  const degree = new Map<string, number>();
  for (const n of nodes) degree.set(n.id, 0);
  for (const e of edges) {
    degree.set(e.source, (degree.get(e.source) || 0) + 1);
    degree.set(e.target, (degree.get(e.target) || 0) + 1);
  }
  return degree;
}

type PositionedNode = MindmapNode & { x: number; y: number; r: number };

function downloadAsJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function MindmapGraph({ data, onPersist }: { data: MindmapData; onPersist: (nodes: MindmapNode[]) => void }) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const gRef = useRef<SVGGElement | null>(null);
  const { ref, size } = useElementSize<HTMLDivElement>();
  const [hoverId, setHoverId] = useState<string | null>(null);

  // Local state for positioned nodes
  const [nodes, setNodes] = useState<PositionedNode[]>([]);
  const [edges, setEdges] = useState<MindmapEdge[]>([]);

  // Initialize positions (use existing x/y or compute by force)
  useEffect(() => {
    setEdges(data.edges);

    const W = Math.max(200, size.width);
    const H = Math.max(200, size.height);

    // If nodes contain x/y, reuse directly
    const hasPositions = data.nodes.every((n) => typeof n.x === "number" && typeof n.y === "number");
    if (hasPositions) {
      const positioned: PositionedNode[] = data.nodes.map((n) => ({
        ...n,
        x: n.x as number,
        y: n.y as number,
        r: 6 + Math.min(10, (n.importance || 0)),
      }));
      setNodes(positioned);
      return;
    }

    // Offline force layout
    // Create shallow copies to avoid mutating source data
    type ForceNode = MindmapNode & SimulationNodeDatum;
    const simNodes: ForceNode[] = data.nodes.map((n) => ({ ...n }));
    const simLinks: SimulationLinkDatum<ForceNode>[] = data.edges.map((e) => ({ source: e.source, target: e.target, weight: e.weight }));

    const degree = computeDegree(data.nodes, data.edges);

    const simulation = forceSimulation<ForceNode>(simNodes)
      .force(
        "link",
        forceLink<ForceNode, SimulationLinkDatum<ForceNode>>(simLinks)
          .id((d: ForceNode) => d.id)
          .distance((l) => {
            const sid = typeof l.source === "object" ? (l.source as ForceNode).id : (l.source as string);
            return 40 + Math.min(100, 12 * Math.max(1, degree.get(sid) || 1));
          })
          .strength(0.12)
      )
      .force("charge", forceManyBody().strength(-120))
      .force("collide", forceCollide<ForceNode>().radius((d) => 18 + Math.min(12, degree.get(d.id) || 0)))
      .force("center", forceCenter(W / 2, H / 2))
      .stop();

    // Run N ticks synchronously for stable initial positions
    for (let i = 0; i < 200; i++) simulation.tick();

    const positioned: PositionedNode[] = simNodes.map((n) => ({
      ...(n as MindmapNode),
      x: (n.x as number | undefined) ?? W / 2,
      y: (n.y as number | undefined) ?? H / 2,
      r: 6 + Math.min(10, (degree.get((n as MindmapNode).id) || 0) * 0.6 + ((n as MindmapNode).importance || 0)),
    }));
    setNodes(positioned);

    // Persist after first layout for better UX next time
    onPersist(positioned.map(({ r, ...rest }) => rest));
  }, [data.nodes, data.edges, size.width, size.height, onPersist]);

  // Setup zoom behavior
  useEffect(() => {
    if (!svgRef.current || !gRef.current) return;
    const svg = select(svgRef.current);
    const g = select(gRef.current);

    const zoomed = (event: D3ZoomEvent<SVGSVGElement, unknown>) => {
      g.attr("transform", event.transform.toString());
    };

    const zoomBehavior = zoom<SVGSVGElement, unknown>().scaleExtent([0.25, 3]).on("zoom", zoomed);
    svg.call(zoomBehavior);
    // Fit to view initially
    zoomBehavior.transform(svg, zoomIdentity.translate(0, 0).scale(1));

    return () => {
      svg.on("wheel.zoom", null);
      svg.on("mousedown.zoom", null);
      svg.on("touchstart.zoom", null);
    };
  }, [size.width, size.height]);

  // Drag behavior for nodes
  const onDragBehavior = useMemo(() => {
    const dragBehavior = drag<SVGGElement, PositionedNode>()
      .on("start", (event: D3DragEvent<SVGGElement, PositionedNode, unknown>) => {
        event.sourceEvent?.stopPropagation?.();
      })
      .on("drag", (event: D3DragEvent<SVGGElement, PositionedNode, unknown>, d: PositionedNode) => {
        const nx = event.x;
        const ny = event.y;
        d.x = nx;
        d.y = ny;
        setNodes((prev) => prev.map((n) => (n.id === d.id ? { ...n, x: nx, y: ny } : n)));
      })
      .on("end", () => {
        onPersist(nodes.map(({ r, ...rest }) => rest));
      });
    return dragBehavior;
  }, [nodes, onPersist]);

  // Re-apply drag behavior whenever nodes change
  useEffect(() => {
    if (!gRef.current) return;
    const g = select(gRef.current);
    g.selectAll<SVGGElement, PositionedNode>("g.node").call(onDragBehavior);
  }, [nodes, onDragBehavior]);

  const nodeMap = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  const highlightEdge = useCallback(
    (e: MindmapEdge) => hoverId && (e.source === hoverId || e.target === hoverId),
    [hoverId]
  );

  const edgePath = useCallback((a: PositionedNode, b: PositionedNode) => {
    // Quadratic Bezier curve: control point at midpoint offset by a perpendicular vector
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len; // normalized perpendicular
    const ny = dx / len;
    const curvature = 0.16; // tweak for aesthetics
    const cx = mx + nx * len * curvature;
    const cy = my + ny * len * curvature;
    return `M ${a.x},${a.y} Q ${cx},${cy} ${b.x},${b.y}`;
  }, []);

  return (
    <div ref={(el) => { ref.current = el; wrapperRef.current = el; }} className="w-full h-full">
      <svg ref={svgRef} id="mindmap-svg" width={size.width} height={size.height} className="block">
        <defs>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g ref={gRef}>
          {/* Edges */}
          <g>
            {edges.map((e, idx) => {
              const a = nodeMap.get(e.source);
              const b = nodeMap.get(e.target);
              if (!a || !b) return null;
              const w = e.weight ?? 1;
              const active = highlightEdge(e);
              const stroke = active ? "hsl(var(--primary))" : "hsl(var(--border))";
              const opacity = active ? 0.9 : 0.6; // default higher opacity to ensure visibility
              return (
                <path
                  key={idx}
                  d={edgePath(a, b)}
                  stroke={stroke}
                  strokeOpacity={opacity}
                  strokeWidth={1 + Math.min(2.5, Math.max(0, (w - 0.5) * 1.2))}
                  fill="none"
                  strokeLinecap="round"
                  pointerEvents="none"
                />
              );
            })}
          </g>
          {/* Nodes */}
          <g>
            {nodes.map((n) => {
              const active = hoverId === n.id;
              const connected = edges.some((e) => e.source === n.id || e.target === n.id);
              return (
                <g
                  key={n.id}
                  className="node"
                  transform={`translate(${n.x}, ${n.y})`}
                  onMouseEnter={() => setHoverId(n.id)}
                  onMouseLeave={() => setHoverId(null)}
                  style={{ cursor: "grab" }}
                >
                  <circle
                    r={n.r}
                    fill={active ? "hsl(var(--primary))" : connected ? "hsl(var(--accent))" : "hsl(var(--muted))"}
                    fillOpacity={active ? 0.95 : 0.9}
                    stroke={active ? "hsl(var(--primary-foreground))" : "hsl(var(--border))"}
                    strokeWidth={active ? 1.5 : 1}
                    filter={active ? "url(#softGlow)" : undefined}
                  />
                  <text
                    x={n.r + 6}
                    y={4}
                    className="select-none"
                    fontSize={12}
                    fill={active ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))"}
                  >
                    {n.label}
                  </text>
                </g>
              );
            })}
          </g>
        </g>
      </svg>
    </div>
  );
}

// XMind-like radial mindmap layout (hierarchical)

// Left-to-right XMind-like layout (compact, elbow curves, collapse, pan/zoom, fullscreen)
const NODE_WIDTH = 160;
const NODE_HEIGHT = 44;
const H_SPACING = 30;
const V_SPACING = 4;
const ZOOM_SENS = 0.005;
const ZOOM_BTN_FACTOR = 1.25;

type LRPositionedNode = Omit<MindmapTreeNode, "children"> & {
  x: number;
  y: number;
  width: number;
  height: number;
  children: LRPositionedNode[];
  originalChildren?: MindmapTreeNode[];
  subtreeHeight: number;
};

function lrCalculateInitial(node: MindmapTreeNode, collapsed: Set<string>, depth = 0): LRPositionedNode {
  const isCollapsed = collapsed.has(node.id);
  const children = node.children && !isCollapsed ? node.children : [];
  const positionedChildren = children.map((c) => lrCalculateInitial(c, collapsed, depth + 1));
  const totalChildH = positionedChildren.length
    ? positionedChildren.reduce((a, c) => a + c.subtreeHeight, 0) + (positionedChildren.length - 1) * V_SPACING
    : 0;
  const subtreeHeight = Math.max(NODE_HEIGHT, totalChildH);
  let currentRelY = -subtreeHeight / 2;
  for (const child of positionedChildren) {
    child.y = currentRelY + child.subtreeHeight / 2;
    currentRelY += child.subtreeHeight + V_SPACING;
  }
  const positioned: LRPositionedNode = {
    ...node,
    width: NODE_WIDTH,
    height: NODE_HEIGHT,
    x: depth * (NODE_WIDTH + H_SPACING),
    y: 0,
    children: positionedChildren,
    originalChildren: node.children,
    subtreeHeight,
  };
  if (positionedChildren.length > 0) {
    const firstY = positionedChildren[0].y;
    const lastY = positionedChildren[positionedChildren.length - 1].y;
    positioned.y = (firstY + lastY) / 2;
  }
  return positioned;
}

function lrApplyAbsoluteY(node: LRPositionedNode, parentY = 0) {
  node.y += parentY;
  node.children.forEach((c) => lrApplyAbsoluteY(c, node.y));
}

function lrEdgePath(source: { x: number; y: number }, target: { x: number; y: number }): string {
  const [sx, sy] = [source.x, source.y];
  const [tx, ty] = [target.x, target.y];
  const hx = sx + (tx - sx) / 2;
  return `M ${sx},${sy} C ${hx},${sy} ${hx},${ty} ${tx},${ty}`;
}

function LRNode({
  node,
  onToggle,
  collapsed,
  onNodeClick,
  active,
}: {
  node: LRPositionedNode;
  onToggle: (id: string) => void;
  collapsed: boolean;
  onNodeClick?: (id: string) => void;
  active: boolean;
}) {
  const hasChildren = (node.originalChildren?.length || 0) > 0;
  return (
    <g
      className="mindmap-node-group"
      transform={`translate(${node.x}, ${node.y - node.height / 2})`}
      onClick={() => onNodeClick?.(node.id)}
      style={{ cursor: onNodeClick ? "pointer" : "default" }}
    >
      <foreignObject width={node.width} height={node.height}>
        <div className="w-full h-full flex items-center justify-center p-1">
          <div
            className={
              "w-full h-full bg-slate-200/50 dark:bg-slate-800/50 border rounded-xl shadow-sm flex items-center justify-center transition-colors " +
              (active ? "border-indigo-500" : "border-slate-300 dark:border-slate-700")
            }
          >
            <p className={"truncate px-2 " + (active ? "text-indigo-700 dark:text-indigo-200 font-medium" : "text-slate-800 dark:text-slate-100")}>{node.label}</p>
          </div>
        </div>
      </foreignObject>
      {hasChildren && (
        <g
          transform={`translate(${node.width}, ${node.height / 2})`}
          onClick={(e) => {
            e.stopPropagation();
            onToggle(node.id);
          }}
        >
          <circle r={16} fill="transparent" />
          <circle r={10} className="fill-slate-50 dark:fill-slate-900" />
          {/* plus/minus */}
          <path
            d={collapsed ? "M -4 0 L 4 0 M 0 -4 L 0 4" : "M -4 0 L 4 0"}
            stroke="currentColor"
            className="stroke-slate-600 dark:stroke-slate-300"
            strokeWidth={2}
            strokeLinecap="round"
          />
        </g>
      )}
    </g>
  );
}

function renderLR(
  node: LRPositionedNode,
  onToggle: (id: string) => void,
  collapsed: Set<string>,
  onNodeClick?: (id: string) => void,
  activePath?: Set<string>
): React.ReactNode[] {
  const isCollapsed = collapsed.has(node.id);
  const isActive = activePath?.has(node.id) ?? false;
  let els: React.ReactNode[] = [
    <LRNode key={node.id} node={node} onToggle={onToggle} collapsed={isCollapsed} onNodeClick={onNodeClick} active={isActive} />,
  ];
  if (!isCollapsed) {
    node.children.forEach((child) => {
      const pathActive = isActive && (activePath?.has(child.id) ?? false);
      els.push(
        <path
          key={`${node.id}-${child.id}`}
          d={lrEdgePath({ x: node.x + node.width, y: node.y }, { x: child.x, y: child.y })}
          stroke="currentColor"
          className={"transition-colors " + (pathActive ? "text-indigo-400 dark:text-indigo-500" : "text-slate-300 dark:text-slate-600")}
          fill="none"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      );
      els = els.concat(renderLR(child, onToggle, collapsed, onNodeClick, activePath));
    });
  }
  return els;
}

function MindmapLR({
  data,
  onRegenerate,
  isLoading,
  onNodeClick,
  activeNodePath,
}: {
  data: MindmapTreeNode;
  onRegenerate: () => void;
  isLoading: boolean;
  onNodeClick?: (id: string) => void;
  activeNodePath?: Set<string>;
}) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, width: 1200, height: 800 });
  const isPanning = useRef(false);
  const lastPt = useRef({ x: 0, y: 0 });
  const [isFull, setIsFull] = useState(false);

  const layout = useMemo(() => {
    const root = lrCalculateInitial(data, collapsed);
    lrApplyAbsoluteY(root);
    return root;
  }, [data, collapsed]);

  const zoom = useCallback((factor: number, cx: number, cy: number) => {
    setViewBox((prev) => {
      const nw = prev.width * factor;
      const nh = prev.height * factor;
      const nx = cx - (cx - prev.x) * factor;
      const ny = cy - (cy - prev.y) * factor;
      return { x: nx, y: ny, width: nw, height: nh };
    });
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = (e: WheelEvent) => {
      const { clientX, clientY, deltaY, deltaX, ctrlKey } = e;
      if (ctrlKey) {
        e.preventDefault();
        const pt = new DOMPoint(clientX, clientY);
        const ctm = svg.getScreenCTM();
        if (!ctm) return;
        const sp = pt.matrixTransform(ctm.inverse());
        const factor = 1 + deltaY * ZOOM_SENS;
        zoom(factor, sp.x, sp.y);
      } else if (isFull) {
        e.preventDefault();
        const scale = viewBox.width / (svg.clientWidth || 1);
        setViewBox((prev) => ({ ...prev, x: prev.x + deltaX * scale * 0.5, y: prev.y + deltaY * scale * 0.5 }));
      }
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, [isFull, zoom, viewBox.width]);

  useEffect(() => {
    const onFull = () => setIsFull(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFull);
    return () => document.removeEventListener("fullscreenchange", onFull);
  }, []);

  const fitToView = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    const walk = (n: LRPositionedNode) => {
      minX = Math.min(minX, n.x);
      minY = Math.min(minY, n.y - n.height / 2);
      maxX = Math.max(maxX, n.x + n.width);
      maxY = Math.max(maxY, n.y + n.height / 2);
      if (!collapsed.has(n.id)) n.children.forEach(walk);
    };
    walk(layout);
    const pad = 80;
    const cw = maxX - minX;
    const ch = maxY - minY;
    if (cw > 0 && ch > 0) setViewBox({ x: minX - pad, y: minY - pad, width: cw + pad * 2, height: ch + pad * 2 });
  }, [layout, collapsed]);

  const onMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    isPanning.current = true;
    lastPt.current = { x: e.clientX, y: e.clientY };
  };
  const onMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isPanning.current || !svgRef.current) return;
    const scale = viewBox.width / (svgRef.current.clientWidth || 1);
    const dx = (e.clientX - lastPt.current.x) * scale;
    const dy = (e.clientY - lastPt.current.y) * scale;
    setViewBox((prev) => ({ ...prev, x: prev.x - dx, y: prev.y - dy }));
    lastPt.current = { x: e.clientX, y: e.clientY };
  };
  const onMouseUp = () => {
    isPanning.current = false;
  };

  // collapse toggle
  const onToggle = useCallback((id: string) => {
    setCollapsed((prev) => {
      const ns = new Set(prev);
      ns.has(id) ? ns.delete(id) : ns.add(id);
      return ns;
    });
  }, []);

  // fit on mount and on data change
  const fitRef = useRef(fitToView);
  useEffect(() => {
    fitRef.current = fitToView;
  });
  useEffect(() => {
    setTimeout(() => fitRef.current(), 50);
  }, [data, isFull]);

  const els = useMemo(() => renderLR(layout, onToggle, collapsed, onNodeClick, activeNodePath), [layout, onToggle, collapsed, onNodeClick, activeNodePath]);
  const containerCls = isFull
    ? "fixed inset-0 z-50 w-screen h-screen bg-slate-100 dark:bg-slate-900"
    : "relative w-full h-full";

  const onFullToggle = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen().catch(() => {});
    else document.exitFullscreen();
  }, []);

  const onZoomBtn = (dir: "in" | "out") => {
    if (!svgRef.current) return;
    const cx = viewBox.x + viewBox.width / 2;
    const cy = viewBox.y + viewBox.height / 2;
    zoom(dir === "in" ? 1 / ZOOM_BTN_FACTOR : ZOOM_BTN_FACTOR, cx, cy);
  };

  return (
    <div ref={containerRef} className={containerCls}>
      <svg
        ref={svgRef}
        className="w-full h-full"
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <g>{els}</g>
      </svg>
      <div className="absolute bottom-3 right-3 flex flex-col gap-2">
        <div className="bg-white/90 dark:bg-slate-800/90 rounded-lg shadow border border-border/60 overflow-hidden flex flex-col">
          <button onClick={() => onZoomBtn("in")} title="Zoom In" className="p-2 hover:bg-muted/60 transition-colors">
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="h-px bg-border/60" />
          <button onClick={() => onZoomBtn("out")} title="Zoom Out" className="p-2 hover:bg-muted/60 transition-colors">
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="h-px bg-border/60" />
          <button onClick={fitToView} title="Fit to View" className="p-2 hover:bg-muted/60 transition-colors">
            <Focus className="w-4 h-4" />
          </button>
          <div className="h-px bg-border/60" />
          <button onClick={onFullToggle} title={isFull ? "Exit Fullscreen" : "Enter Fullscreen"} className="p-2 hover:bg-muted/60 transition-colors">
            {isFull ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
        <button
          onClick={onRegenerate}
          disabled={isLoading}
          title="Regenerate"
          className="p-2 bg-white/90 dark:bg-slate-800/90 rounded-lg shadow border border-border/60 text-foreground hover:bg-muted/60 transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-muted-foreground/60 border-t-transparent rounded-full animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}

interface MindmapDetailProps {
  item: StudioContentItem;
  onClose: () => void;
}

export const MindmapDetail = memo(function MindmapDetail({ item, onClose }: MindmapDetailProps) {
  const data = (item.data as MindmapData | undefined) || {
    title: item.title,
    nodes: [],
    edges: [],
    generatedAt: Date.now(),
    contextChannelIds: [],
  };
  const { updateContentItem } = useStudioStore();
  const [viewMode, setViewMode] = useState<"mindmap" | "graph">(data.tree ? "mindmap" : "graph");
  const [regenerating, setRegenerating] = useState(false);

  // Ensure view resets when switching to a different item or when tree becomes available
  useEffect(() => {
    setViewMode(data.tree ? "mindmap" : "graph");
  }, [item.id, !!data.tree]);

  const persistPositions = useCallback(
    (nodes: MindmapNode[]) => {
      // Persist only x/y back into the item data
      const next: MindmapData = {
        ...data,
        nodes: data.nodes.map((orig) => {
          const updated = nodes.find((n) => n.id === orig.id);
          return updated ? { ...orig, x: updated.x, y: updated.y } : orig;
        }),
      };
      updateContentItem(item.id, { data: next, updatedAt: Date.now() });
    },
    [data, item.id, updateContentItem]
  );

  const resetLayout = useCallback(() => {
    // Clear persisted positions and let graph recompute
    const clearedNodes: MindmapNode[] = data.nodes.map(({ x, y, ...rest }): MindmapNode => ({ ...rest }));
    const cleared: MindmapData = {
      ...data,
      nodes: clearedNodes,
    };
    updateContentItem(item.id, { data: cleared, updatedAt: Date.now() });
  }, [data, item.id, updateContentItem]);

  const handleDownload = useCallback(() => {
    const safeTitle = (data.title || "mindmap").toLowerCase().replace(/[^a-z0-9-_]+/gi, "-");
    downloadAsJson(`${safeTitle || "mindmap"}.json`, data);
  }, [data]);

  const downloadSVG = useCallback(() => {
    const svgEl = document.querySelector("#mindmap-svg") as SVGSVGElement | null;
    if (!svgEl) return;
    const clone = svgEl.cloneNode(true) as SVGSVGElement;
    // Inline style width/height for export stability
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(clone);
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(data.title || "mindmap").replace(/\s+/g, "-")}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [data.title]);

  const downloadPNG = useCallback(async () => {
    const svgEl = document.querySelector("#mindmap-svg") as SVGSVGElement | null;
    if (!svgEl) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgEl);
    const svgBlob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    const loadImage = () =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
      });
    try {
      const image = await loadImage();
      const rect = svgEl.getBoundingClientRect();
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.floor(rect.width));
      canvas.height = Math.max(1, Math.floor(rect.height));
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--background") || "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0);
      const pngUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = pngUrl;
      a.download = `${(data.title || "mindmap").replace(/\s+/g, "-")}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      URL.revokeObjectURL(url);
    }
  }, [data.title]);

  const handleRegenerate = useCallback(async () => {
    if (!Array.isArray(data.contextChannelIds) || data.contextChannelIds.length === 0) return;
    try {
      setRegenerating(true);
      const fresh = await generateMindmap(data.contextChannelIds);
      updateContentItem(item.id, {
        data: fresh,
        title: fresh.title,
        updatedAt: Date.now(),
        status: "completed",
      });
      if (fresh.tree) setViewMode("mindmap");
    } catch (e) {
      console.error("Regenerate mindmap failed", e);
    } finally {
      setRegenerating(false);
    }
  }, [data.contextChannelIds, item.id, updateContentItem]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border/40 flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onClose}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="text-sm font-medium flex-1 truncate">{item.title}</div>
        <div className="flex items-center gap-1.5">
          <Button
            variant={viewMode === "mindmap" ? "secondary" : "ghost"}
            size="sm"
            className="h-7 px-2"
            onClick={() => setViewMode("mindmap")}
            disabled={!data.tree}
            title={data.tree ? "Mindmap view" : "Mindmap tree not available for this item"}
          >
            Mindmap
          </Button>
          <Button
            variant={viewMode === "graph" ? "secondary" : "ghost"}
            size="sm"
            className="h-7 px-2"
            onClick={() => setViewMode("graph")}
          >
            Graph
          </Button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7" title="More options">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44 p-1.5">
            <DropdownMenuItem className="cursor-pointer" onClick={resetLayout}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset Layout
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={handleDownload}>
              <FileDown className="w-4 h-4 mr-2" />
              Download JSON
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={downloadSVG}>
              <Download className="w-4 h-4 mr-2" />
              Download SVG
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={downloadPNG}>
              <ImageDown className="w-4 h-4 mr-2" />
              Download PNG
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          <div className="text-sm text-muted-foreground">
            Mindmap Visualization{data.nodes.length > 0 ? ` · ${data.nodes.length} nodes, ${data.edges.length} links` : ""}
          </div>
          <div className="w-full h-96 border border-border/40 rounded-lg bg-background/60">
            {viewMode === "mindmap" && data.tree ? (
              <div className="w-full h-full">
                {/* Prefer left-to-right XMind-like layout */}
                <MindmapLR
                  data={data.tree}
                  onRegenerate={handleRegenerate}
                  isLoading={regenerating}
                />
              </div>
            ) : viewMode === "mindmap" && !data.tree ? (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No mindmap tree available. Try regenerating.
              </div>
            ) : data.nodes.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No mindmap generated yet
              </div>
            ) : (
              <div className="w-full h-full">
                <MindmapGraph data={data} onPersist={persistPositions} />
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
});

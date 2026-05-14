/* eslint-disable react/prop-types */
import { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  BackgroundVariant,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";


// ─── NODE DATA ────────────────────────────────────────────────────────────────
const nodeData = {
  internet: {
    label: "Internet",
    category: "foundation",
    description:
      "The Internet is a global network of computers that communicate using standardized protocols. It's the backbone of modern web development and understanding how it works is fundamental.",
    resources: [
      { name: "How the Internet Works – MDN", url: "https://developer.mozilla.org/en-US/docs/Learn/Common_questions/How_does_the_Internet_work" },
      { name: "The Internet Explained – Vox", url: "https://www.vox.com/2014/6/16/18076282/the-internet" },
      { name: "DNS in One Picture", url: "https://roadmap.sh/guides/dns-in-one-picture" },
    ],
  },
  html: {
    label: "HTML",
    category: "core",
    description:
      "HTML (HyperText Markup Language) is the standard markup language for creating web pages. It provides the structure and semantic meaning of web content.",
    resources: [
      { name: "MDN HTML Docs", url: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
      { name: "HTML Full Course – freeCodeCamp", url: "https://www.youtube.com/watch?v=pQN-pnXPaVg" },
      { name: "Learn HTML – web.dev", url: "https://web.dev/learn/html" },
    ],
  },
  css: {
    label: "CSS",
    category: "core",
    description:
      "CSS (Cascading Style Sheets) controls the visual presentation of HTML elements — layout, color, typography, animation, and responsiveness.",
    resources: [
      { name: "MDN CSS Reference", url: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
      { name: "CSS Tricks", url: "https://css-tricks.com" },
      { name: "Flexbox Froggy (Game)", url: "https://flexboxfroggy.com" },
    ],
  },
  js: {
    label: "JavaScript",
    category: "core",
    description:
      "JavaScript is the programming language of the web. It enables interactivity, dynamic content, and complex application logic in the browser and server (Node.js).",
    resources: [
      { name: "The Modern JS Tutorial", url: "https://javascript.info" },
      { name: "Eloquent JavaScript (Free Book)", url: "https://eloquentjavascript.net" },
      { name: "JS on MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
    ],
  },
  vcs: {
    label: "Version Control",
    category: "tools",
    description:
      "Version control systems track changes to code over time. Git is the industry standard, allowing collaboration, branching, and history of changes.",
    resources: [
      { name: "Git – Official Docs", url: "https://git-scm.com/doc" },
      { name: "GitHub Skills", url: "https://skills.github.com" },
      { name: "Learn Git Branching (Interactive)", url: "https://learngitbranching.js.org" },
    ],
  },
  npm: {
    label: "Package Managers",
    category: "tools",
    description:
      "Package managers like npm and yarn help you manage project dependencies, share reusable code, and automate common tasks in your workflow.",
    resources: [
      { name: "npm Docs", url: "https://docs.npmjs.com" },
      { name: "pnpm Docs", url: "https://pnpm.io" },
      { name: "Yarn Docs", url: "https://yarnpkg.com/getting-started" },
    ],
  },
  frameworks: {
    label: "JS Frameworks",
    category: "advanced",
    description:
      "JavaScript frameworks like React, Vue, and Angular provide structured ways to build complex UIs with components, state management, and routing.",
    resources: [
      { name: "React Docs", url: "https://react.dev" },
      { name: "Vue.js Docs", url: "https://vuejs.org" },
      { name: "Angular Docs", url: "https://angular.io" },
    ],
  },
  react: {
    label: "React",
    category: "advanced",
    description:
      "React is a declarative, component-based library for building user interfaces. Created by Meta, it's the most popular frontend framework in 2024.",
    resources: [
      { name: "React Official Docs", url: "https://react.dev" },
      { name: "React – Full Tutorial", url: "https://www.youtube.com/watch?v=u6gSSpfsoOQ" },
      { name: "Scrimba React Course", url: "https://scrimba.com/learn/learnreact" },
    ],
  },
  typescript: {
    label: "TypeScript",
    category: "advanced",
    description:
      "TypeScript adds static typing to JavaScript, catching errors at compile time and providing better IDE support and code documentation.",
    resources: [
      { name: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/intro.html" },
      { name: "Total TypeScript", url: "https://www.totaltypescript.com" },
      { name: "TypeScript Deep Dive", url: "https://basarat.gitbook.io/typescript" },
    ],
  },
  testing: {
    label: "Testing",
    category: "advanced",
    description:
      "Testing ensures your code works as expected. Unit tests, integration tests, and E2E tests each cover different layers of your application.",
    resources: [
      { name: "Vitest Docs", url: "https://vitest.dev" },
      { name: "Testing Library", url: "https://testing-library.com" },
      { name: "Playwright E2E Testing", url: "https://playwright.dev" },
    ],
  },
  build: {
    label: "Build Tools",
    category: "tools",
    description:
      "Build tools like Vite, Webpack, and esbuild bundle and optimize your code for production, handling transpilation, minification, and asset management.",
    resources: [
      { name: "Vite Docs", url: "https://vitejs.dev" },
      { name: "Webpack Docs", url: "https://webpack.js.org" },
      { name: "esbuild Docs", url: "https://esbuild.github.io" },
    ],
  },
  pwa: {
    label: "PWA",
    category: "advanced",
    description:
      "Progressive Web Apps combine the best of web and native apps. They work offline, can be installed on devices, and deliver app-like experiences.",
    resources: [
      { name: "PWA on web.dev", url: "https://web.dev/progressive-web-apps" },
      { name: "MDN PWA Guide", url: "https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps" },
    ],
  },
};

const ROADMAP_STORAGE_KEY_PREFIX = "student-roadmap-progress";
const defaultRoadmapActivity = {
  viewedNodeIds: [],
  resourceClicks: {},
  lastSelectedNodeId: null,
  lastInteractedAt: null,
};

const isValidRoadmapNodeId = (id) =>
  typeof id === "string" && Object.prototype.hasOwnProperty.call(nodeData, id);

const createRoadmapStorageKey = (userId) =>
  `${ROADMAP_STORAGE_KEY_PREFIX}:${userId || "guest"}`;

const readRoadmapProgress = (userId) => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(createRoadmapStorageKey(userId));
    return rawValue ? JSON.parse(rawValue) : null;
  } catch (error) {
    console.error("Unable to read roadmap progress from localStorage", error);
    return null;
  }
};

const writeRoadmapProgress = (userId, value) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      createRoadmapStorageKey(userId),
      JSON.stringify(value)
    );
  } catch (error) {
    console.error("Unable to write roadmap progress to localStorage", error);
  }
};

const treeTheme = {
  canvas: "#080c18",
  panel: "rgba(10, 14, 26, 0.85)",
  panelSoft: "rgba(22, 28, 45, 0.75)",
  panelBorder: "rgba(255, 255, 255, 0.07)",
  textPrimary: "#f8fafc",
  textMuted: "#94a3b8",
  textDim: "#64748b",
  accent: "#ef4444",
  accentStrong: "#dc2626",
  edge: "rgba(255, 255, 255, 0.15)",
  overlay: "rgba(0, 0, 0, 0.6)",
};

const categoryConfig = {
  foundation: { bg: "rgba(15, 23, 42, 0.7)", border: "rgba(239, 68, 68, 0.5)", badge: "#ef4444", badgeText: "Foundation" },
  core: { bg: "rgba(15, 23, 42, 0.7)", border: "rgba(59, 130, 246, 0.5)", badge: "#3b82f6", badgeText: "Core" },
  tools: { bg: "rgba(15, 23, 42, 0.7)", border: "rgba(16, 185, 129, 0.5)", badge: "#10b981", badgeText: "Tools" },
  advanced: { bg: "rgba(15, 23, 42, 0.7)", border: "rgba(139, 92, 246, 0.5)", badge: "#8b5cf6", badgeText: "Advanced" },
};

// ─── INITIAL NODES ────────────────────────────────────────────────────────────
const initialNodes = [
  { id: "internet", position: { x: 520, y: 0 }, data: { id: "internet" }, type: "custom" },
  { id: "html", position: { x: 220, y: 150 }, data: { id: "html" }, type: "custom" },
  { id: "css", position: { x: 220, y: 320 }, data: { id: "css" }, type: "custom" },
  { id: "js", position: { x: 520, y: 500 }, data: { id: "js" }, type: "custom" },
  { id: "vcs", position: { x: 820, y: 150 }, data: { id: "vcs" }, type: "custom" },
  { id: "npm", position: { x: 820, y: 320 }, data: { id: "npm" }, type: "custom" },
  { id: "frameworks", position: { x: 300, y: 690 }, data: { id: "frameworks" }, type: "custom" },
  { id: "react", position: { x: 120, y: 890 }, data: { id: "react" }, type: "custom" },
  { id: "typescript", position: { x: 460, y: 890 }, data: { id: "typescript" }, type: "custom" },
  { id: "testing", position: { x: 760, y: 690 }, data: { id: "testing" }, type: "custom" },
  { id: "build", position: { x: 860, y: 890 }, data: { id: "build" }, type: "custom" },
  { id: "pwa", position: { x: 500, y: 1080 }, data: { id: "pwa" }, type: "custom" },
];

// ─── INITIAL EDGES ────────────────────────────────────────────────────────────
const mkEdge = (id, source, target, animated = false) => ({
  id, source, target, animated,
  type: "smoothstep",
  style: { stroke: treeTheme.edge, strokeWidth: 2.2 },
  markerEnd: { type: MarkerType.ArrowClosed, color: treeTheme.edge },
});

const initialEdges = [
  mkEdge("e1",  "internet",   "html",       true),
  mkEdge("e2",  "internet",   "vcs",        true),
  mkEdge("e3",  "html",       "css"),
  mkEdge("e4",  "css",        "js"),
  mkEdge("e5",  "vcs",        "npm"),
  mkEdge("e6",  "npm",        "js"),
  mkEdge("e7",  "js",         "frameworks"),
  mkEdge("e8",  "js",         "testing"),
  mkEdge("e9",  "frameworks", "react"),
  mkEdge("e10", "frameworks", "typescript"),
  mkEdge("e11", "testing",    "build"),
  mkEdge("e12", "react",      "pwa"),
  mkEdge("e13", "typescript", "pwa"),
];

// ─── CUSTOM NODE ──────────────────────────────────────────────────────────────
function CustomNode({ data }) {
  const { id } = data;
  const info = nodeData[id];
  const cat = categoryConfig[info?.category] || categoryConfig.core;
  const isSelected = data.selected;
  const isCompleted = data.completed;

  return (
    <div
      style={{
        background: isSelected ? treeTheme.panelSoft : cat.bg,
        border: `2.5px solid ${isSelected ? treeTheme.accent : cat.border}`,
        borderRadius: 14,
        padding: "12px 20px",
        minWidth: 180,
        maxWidth: 220,
        boxShadow: isSelected
          ? "0 0 0 3px rgba(239, 68, 68, 0.3), 0 18px 32px rgba(0, 0, 0, 0.5)"
          : "0 4px 24px rgba(0, 0, 0, 0.4)",
        cursor: "pointer",
        transition: "all 0.18s ease",
        position: "relative",
        userSelect: "none",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: cat.border, width: 8, height: 8 }} />

      {isCompleted && (
        <span style={{
          position: "absolute", top: -8, right: -8,
          background: treeTheme.accentStrong, borderRadius: "50%",
          width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, color: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.5)",
        }}>✓</span>
      )}

      <div style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.07em",
        textTransform: "uppercase",
        color: isSelected ? cat.badge : cat.badge,
        marginBottom: 3,
        fontFamily: "'DM Mono', monospace",
      }}>
        {info?.category}
      </div>

      <div style={{
        fontWeight: 800,
        fontSize: 16,
        color: isSelected ? "#ffffff" : "#f1f5f9",
        fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif",
        lineHeight: 1.2,
      }}>
        {info?.label}
      </div>

      <Handle type="source" position={Position.Bottom} style={{ background: cat.border, width: 8, height: 8 }} />
    </div>
  );
}

const nodeTypes = { custom: CustomNode };

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({ node, onClose, completed, toggleCompleted, onResourceClick }) {
  const info = node ? nodeData[node.id] : null;
  const cat = info ? categoryConfig[info.category] : null;
  const isComplete = node ? completed.includes(node.id) : false;

  return (
    <div style={{
      position: "fixed",
      top: 0, right: 0,
      width: "min(380px, 100vw)",
      height: "100vh",
      background: treeTheme.panel,
      boxShadow: "-4px 0 32px #0008",
      transform: node ? "translateX(0)" : "translateX(105%)",
      transition: "transform 0.32s cubic-bezier(0.22,1,0.36,1)",
      zIndex: 100,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        background: treeTheme.panelSoft,
        borderBottom: `1px solid ${treeTheme.panelBorder}`,
        padding: "20px 24px",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 12,
      }}>
        <div style={{ flex: 1 }}>
          {cat && (
            <span style={{
              display: "inline-block",
              background: cat.badge + "22",
              color: cat.badge,
              border: `1px solid ${cat.badge}55`,
              borderRadius: 6,
              padding: "2px 10px",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 8,
              fontFamily: "'DM Mono', monospace",
            }}>
              {info?.category}
            </span>
          )}
          <h2 style={{
            margin: 0,
            fontSize: 22,
            fontWeight: 800,
            color: treeTheme.textPrimary,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            lineHeight: 1.2,
          }}>
            {info?.label}
          </h2>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            color: "#94a3b8",
            width: 32, height: 32,
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 18,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.15s",
            flexShrink: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"; }}
        >×</button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
        {info && (
          <>
            {/* Complete button */}
            <button
              onClick={() => toggleCompleted(node.id)}
              style={{
                width: "100%",
                padding: "10px 0",
                marginBottom: 24,
                borderRadius: 10,
                border: isComplete ? "none" : `2px solid ${treeTheme.panelBorder}`,
                background: isComplete ? treeTheme.accentStrong : "transparent",
                color: isComplete ? "#fff" : treeTheme.textMuted,
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                transition: "all 0.2s",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              <span>{isComplete ? "✓" : "○"}</span>
              {isComplete ? "Completed!" : "Mark as Complete"}
            </button>

            {/* Description */}
            <div style={{ marginBottom: 28 }}>
              <h3 style={{
                fontSize: 12, fontWeight: 700, letterSpacing: "0.1em",
                textTransform: "uppercase", color: treeTheme.textDim, marginBottom: 10,
                fontFamily: "'DM Mono', monospace",
              }}>Overview</h3>
              <p style={{
                color: "#cbd5e1", lineHeight: 1.7, fontSize: 14, margin: 0,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}>
                {info.description}
              </p>
            </div>

            {/* Resources */}
            <div>
              <h3 style={{
                fontSize: 12, fontWeight: 700, letterSpacing: "0.1em",
                textTransform: "uppercase", color: treeTheme.textDim, marginBottom: 12,
                fontFamily: "'DM Mono', monospace",
              }}>Resources</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {info.resources.map((r, i) => (
                  <a
                    key={i}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => onResourceClick(node.id, r.url)}
                    style={{
                      display: "flex", alignItems: "center", gap: 12,
                      background: "rgba(255, 255, 255, 0.03)",
                      border: `1px solid ${treeTheme.panelBorder}`,
                      borderRadius: 10,
                      padding: "12px 16px",
                      color: "#f8fafc",
                      textDecoration: "none",
                      fontSize: 14,
                      fontWeight: 500,
                      transition: "all 0.15s",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = cat?.badge || treeTheme.accentStrong;
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = treeTheme.panelBorder;
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                    }}
                  >
                    <span style={{
                      width: 28, height: 28, borderRadius: 7,
                      background: (cat?.badge || treeTheme.accentStrong) + "22",
                      color: cat?.badge || treeTheme.accentStrong,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 800, flexShrink: 0,
                    }}>{i + 1}</span>
                    <span style={{ flex: 1 }}>{r.name}</span>
                    <span style={{ color: "#64748b", fontSize: 12 }}>↗</span>
                  </a>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── LEGEND ───────────────────────────────────────────────────────────────────
function Legend() {
  return (
    <div style={{
      position: "absolute", bottom: 90, left: 16, zIndex: 10,
      background: "rgba(10, 14, 26, 0.8)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      border: `1px solid ${treeTheme.panelBorder}`,
      borderRadius: 12, padding: "12px 16px",
      display: "flex", flexDirection: "column", gap: 8,
    }}>
      {Object.entries(categoryConfig).map(([key, val]) => (
        <div key={key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            width: 14, height: 14, borderRadius: 4,
            background: val.bg, border: `2px solid ${val.border}`,
            display: "inline-block", flexShrink: 0,
          }} />
          <span style={{
            fontSize: 12, color: treeTheme.textMuted, fontWeight: 600,
            fontFamily: "'DM Mono', monospace", textTransform: "capitalize",
          }}>{key}</span>
        </div>
      ))}
    </div>
  );
}

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────
function ProgressBar({ completed }) {
  const total = Object.keys(nodeData).length;
  const pct = Math.round((completed.length / total) * 100);
  return (
    <div style={{
      position: "absolute", top: 70, left: "50%", transform: "translateX(-50%)",
      zIndex: 10, background: "rgba(10, 14, 26, 0.8)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      border: `1px solid ${treeTheme.panelBorder}`, borderRadius: 999,
      padding: "6px 16px",
      display: "flex", alignItems: "center", gap: 10,
      fontFamily: "'DM Mono', monospace",
    }}>
      <span style={{ fontSize: 12, color: treeTheme.textDim }}>Progress</span>
      <div style={{
        width: 110, height: 6, background: "rgba(255, 255, 255, 0.1)", borderRadius: 999, overflow: "hidden",
      }}>
        <div style={{
          width: `${pct}%`, height: "100%",
          background: "linear-gradient(90deg, #ef4444, #dc2626)",
          borderRadius: 999, transition: "width 0.4s ease",
        }} />
      </div>
      <span style={{ fontSize: 12, color: treeTheme.textMuted, fontWeight: 700 }}>{pct}%</span>
    </div>
  );
}

function SideRail({ side, title, subtitle, points }) {
  return (
    <div className={`canopy-rail ${side}`}>
      <div style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.11em",
        textTransform: "uppercase",
        color: treeTheme.textDim,
        marginBottom: 8,
        fontFamily: "'DM Mono', monospace",
      }}>
        {subtitle}
      </div>
      <h3 style={{
        margin: "0 0 12px",
        color: treeTheme.textPrimary,
        fontSize: 18,
        fontWeight: 800,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        lineHeight: 1.2,
      }}>
        {title}
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {points.map((point, idx) => (
          <div key={idx} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <span style={{
              width: 7,
              height: 7,
              borderRadius: 999,
              background: treeTheme.accent,
              marginTop: 6,
              flexShrink: 0,
            }} />
            <span style={{
              color: treeTheme.textMuted,
              fontSize: 13,
              lineHeight: 1.45,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              {point}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function Roadmap() {
  const { user } = useSelector((store) => store.auth);
  const userId = user?._id || "guest";
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [roadmapActivity, setRoadmapActivity] = useState(defaultRoadmapActivity);
  const [hydratedUserId, setHydratedUserId] = useState(null);

  useEffect(() => {
    const savedProgress = readRoadmapProgress(userId);
    const completedNodeIds = Array.isArray(savedProgress?.completedNodeIds)
      ? savedProgress.completedNodeIds.filter(isValidRoadmapNodeId)
      : [];
    const viewedNodeIds = Array.isArray(savedProgress?.viewedNodeIds)
      ? savedProgress.viewedNodeIds.filter(isValidRoadmapNodeId)
      : [];
    const resourceClicks =
      savedProgress?.resourceClicks && typeof savedProgress.resourceClicks === "object"
        ? Object.fromEntries(
            Object.entries(savedProgress.resourceClicks).filter(([nodeId]) =>
              isValidRoadmapNodeId(nodeId)
            )
          )
        : {};

    setCompleted(completedNodeIds);
    setRoadmapActivity({
      viewedNodeIds,
      resourceClicks,
      lastSelectedNodeId: isValidRoadmapNodeId(savedProgress?.lastSelectedNodeId)
        ? savedProgress.lastSelectedNodeId
        : null,
      lastInteractedAt:
        typeof savedProgress?.lastInteractedAt === "string"
          ? savedProgress.lastInteractedAt
          : null,
    });
    setSelectedNode(null);
    setSidebarOpen(false);
    setHydratedUserId(userId);
  }, [userId]);

  useEffect(() => {
    if (hydratedUserId !== userId) {
      return;
    }

    writeRoadmapProgress(userId, {
      completedNodeIds: completed,
      viewedNodeIds: roadmapActivity.viewedNodeIds,
      resourceClicks: roadmapActivity.resourceClicks,
      lastSelectedNodeId: roadmapActivity.lastSelectedNodeId,
      lastInteractedAt: roadmapActivity.lastInteractedAt,
      updatedAt: new Date().toISOString(),
    });
  }, [userId, completed, roadmapActivity, hydratedUserId]);

  // Inject selected + completed into node data prop
  useEffect(() => {
    setNodes(ns => ns.map(n => ({
      ...n,
      data: { ...n.data, selected: selectedNode?.id === n.id, completed: completed.includes(n.id) },
    })));
  }, [selectedNode, completed, setNodes]);

  const trackRoadmapInteraction = useCallback((nodeId, updater) => {
    setRoadmapActivity((prev) => {
      const nextViewedNodeIds = prev.viewedNodeIds.includes(nodeId)
        ? prev.viewedNodeIds
        : [...prev.viewedNodeIds, nodeId];
      const baseState = {
        ...prev,
        viewedNodeIds: nextViewedNodeIds,
        lastSelectedNodeId: nodeId,
        lastInteractedAt: new Date().toISOString(),
      };

      return typeof updater === "function" ? updater(baseState) : baseState;
    });
  }, []);

  const onNodeClick = useCallback((_, node) => {
    setSelectedNode(node);
    setSidebarOpen(true);
    trackRoadmapInteraction(node.id);
  }, [trackRoadmapInteraction]);

  const toggleCompleted = useCallback((id) => {
    setCompleted(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    trackRoadmapInteraction(id);
  }, [trackRoadmapInteraction]);

  const handleResourceClick = useCallback((nodeId, resourceUrl) => {
    trackRoadmapInteraction(nodeId, (baseState) => {
      const nodeResourceClicks =
        baseState.resourceClicks?.[nodeId] &&
        typeof baseState.resourceClicks[nodeId] === "object"
          ? baseState.resourceClicks[nodeId]
          : {};

      return {
        ...baseState,
        resourceClicks: {
          ...baseState.resourceClicks,
          [nodeId]: {
            ...nodeResourceClicks,
            [resourceUrl]: (nodeResourceClicks[resourceUrl] || 0) + 1,
          },
        },
      };
    });
  }, [trackRoadmapInteraction]);

  const closePanel = useCallback(() => {
    setSidebarOpen(false);
    setTimeout(() => setSelectedNode(null), 350);
  }, []);

  const remaining = Object.keys(nodeData).length - completed.length;

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      background: "radial-gradient(circle at 15% 20%, rgba(220, 38, 38, 0.12) 0%, transparent 22%), radial-gradient(circle at 86% 18%, rgba(220, 38, 38, 0.07) 0%, transparent 18%), radial-gradient(circle at 55% 102%, rgba(99, 102, 241, 0.06) 0%, transparent 26%), #080c18",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500;700&display=swap');
        .react-flow__node:hover > div { transform: translateY(-2px) scale(1.03); box-shadow: 0 18px 34px rgba(0, 0, 0, 0.5) !important; }
        .react-flow__controls { background: rgba(10, 14, 26, 0.85) !important; border: 1px solid rgba(255, 255, 255, 0.07) !important; border-radius: 10px !important; overflow: hidden; backdrop-filter: blur(12px); }
        .react-flow__controls-button { background: transparent !important; border-color: rgba(255, 255, 255, 0.07) !important; color: #94a3b8 !important; }
        .react-flow__controls-button:hover { background: rgba(255, 255, 255, 0.05) !important; }
        .react-flow__minimap { background: rgba(10, 14, 26, 0.85) !important; border: 1px solid rgba(255, 255, 255, 0.07) !important; border-radius: 10px !important; backdrop-filter: blur(12px); }
        .canopy-rail {
          position: absolute;
          z-index: 9;
          width: min(280px, 20vw);
          background: rgba(10, 14, 26, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .canopy-rail.left { top: 145px; left: 20px; }
        .canopy-rail.right { top: 145px; right: 20px; }
        @media (max-width: 1300px) {
          .canopy-rail { display: none; }
        }
        .react-flow__attribution { display: none; }
      `}</style>

      {/* Header */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 20,
        background: "linear-gradient(180deg, rgba(8, 12, 24, 0.9) 30%, rgba(8, 12, 24, 0))",
        padding: "18px 28px 40px",
        display: "flex", alignItems: "center", gap: 16,
        pointerEvents: "none",
      }}>
        <div style={{
          background: "rgba(239, 68, 68, 0.2)", color: "#fca5a5", fontWeight: 900,
          border: "1px solid rgba(239, 68, 68, 0.3)",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase",
          padding: "4px 10px", borderRadius: 6,
        }}>Frontend</div>
        <h1 style={{
          margin: 0, fontSize: 22, fontWeight: 800, color: treeTheme.textPrimary,
          fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.02em",
        }}>
          Developer Roadmap
        </h1>
        <div style={{
          marginLeft: "auto", fontSize: 12, color: treeTheme.textDim,
          fontFamily: "'DM Mono', monospace",
        }}>
          {Object.keys(nodeData).length} topics
        </div>
      </div>

      <SideRail
        side="left"
        subtitle="Canopy Guide"
        title="Grow Through The Branches"
        points={[
          "Start from Internet and move down the branches.",
          "Each node opens curated learning resources.",
          "Follow arrows to keep your sequence consistent.",
        ]}
      />

      <SideRail
        side="right"
        subtitle="Growth Stats"
        title="Your Learning Tree"
        points={[
          `${completed.length} topics completed`,
          `${remaining} topics remaining`,
          "Complete one branch per day for steady progress.",
        ]}
      />

      {/* Progress */}
      <ProgressBar completed={completed} />

      {/* Flow */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.08 }}
        minZoom={0.45}
        maxZoom={2.3}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={28} size={1.2} color="rgba(255, 255, 255, 0.15)" />
        <Controls position="bottom-right" />
        <MiniMap
          position="bottom-right"
          style={{ right: 60, bottom: 16 }}
          nodeColor={n => {
            const info = nodeData[n.id];
            const cat = categoryConfig[info?.category];
            return cat?.badge || treeTheme.accentStrong;
          }}
        />
      </ReactFlow>

      {/* Legend */}
      <Legend />

      {/* Overlay */}
      {sidebarOpen && (
        <div
          onClick={closePanel}
          style={{
            position: "fixed", inset: 0, background: treeTheme.overlay,
            zIndex: 50, backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)",
          }}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        node={selectedNode}
        onClose={closePanel}
        completed={completed}
        toggleCompleted={toggleCompleted}
        onResourceClick={handleResourceClick}
      />
    </div>
  );
}



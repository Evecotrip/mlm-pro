'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  Panel,
  BackgroundVariant,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  TrendingUp, LogOut, ArrowLeft, Users, DollarSign,
  Activity, Crown, Phone, Mail, Target, Zap, Wallet,
  Search, X, ChevronRight
} from 'lucide-react';
import { User, getDirectReferrals, getUserStats, getAllDownline, getUserWalletBalance } from '@/lib/mockData';
import Navbar from '@/components/Navbar';

// Custom Node Component
function UserNode({ data }: { data: any }) {
  const stats = getUserStats(data.user.id);
  const directReferrals = getDirectReferrals(data.user.id);
  const isRoot = data.isRoot;

  return (
    <div
      className={`relative group transition-all duration-300 ${isRoot ? 'scale-110' : 'hover:scale-105'
        }`}
      onClick={() => data.onUserClick(data.user)}
    >
      {/* Glow Effect */}
      <div className={`absolute -inset-0.5 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-500 ${isRoot ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gradient-to-r from-slate-600 to-slate-400'
        }`}></div>

      <div className={`relative bg-slate-900 rounded-2xl p-4 w-64 border ${isRoot ? 'border-blue-500/50' : 'border-slate-700 hover:border-slate-500'
        }`}>
        {/* Handles */}
        <Handle
          type="target"
          position={Position.Top}
          className="!bg-slate-500 !w-3 !h-3 !border-2 !border-slate-900"
        />
        <Handle
          type="source"
          position={Position.Bottom}
          className="!bg-slate-500 !w-3 !h-3 !border-2 !border-slate-900"
        />

        {isRoot && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-0.5 rounded-full text-[10px] font-bold shadow-lg flex items-center gap-1 z-10 border border-white/10">
            <Crown className="w-3 h-3" />
            YOU
          </div>
        )}

        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-inner ${isRoot ? 'bg-gradient-to-br from-blue-600 to-purple-600' : 'bg-slate-800 border border-slate-700'
            }`}>
            {data.user.name.charAt(0)}
            {stats.investmentCount > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-slate-900">
                <Zap className="w-2 h-2 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-white truncate">{data.user.name}</h3>
            <p className="text-[10px] text-slate-400 truncate">{data.user.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="bg-slate-950/50 rounded-lg p-2 border border-slate-800">
            <div className="flex items-center gap-1 mb-0.5">
              <DollarSign className="w-3 h-3 text-emerald-500" />
              <span className="text-[10px] font-medium text-slate-400">Invested</span>
            </div>
            <p className="text-xs font-bold text-emerald-400">₹{(stats.totalInvested / 1000).toFixed(1)}K</p>
          </div>

          <div className="bg-slate-950/50 rounded-lg p-2 border border-slate-800">
            <div className="flex items-center gap-1 mb-0.5">
              <Users className="w-3 h-3 text-blue-500" />
              <span className="text-[10px] font-medium text-slate-400">Team</span>
            </div>
            <p className="text-xs font-bold text-blue-400">{directReferrals.length}</p>
          </div>
        </div>

        {/* Code */}
        <div className="bg-slate-800/50 rounded-lg py-1 px-2 flex justify-between items-center">
          <span className="text-[10px] text-slate-500">Code</span>
          <span className="font-mono text-[10px] text-slate-300">{data.user.referralCode}</span>
        </div>
      </div>
    </div>
  );
}

const nodeTypes = {
  userNode: UserNode,
};

export default function HierarchyFlowPage() {
  const router = useRouter();
  const { currentUser, isAuthenticated, logout } = useAuth();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (currentUser && !currentUser.isApproved) {
      router.push('/queue');
    }
  }, [isAuthenticated, currentUser, router]);

  const handleUserClick = useCallback((user: User) => {
    setSelectedUser(user);
    setShowSidebar(true);
  }, []);

  // Build the flow graph
  useEffect(() => {
    if (currentUser) {
      const { nodes: flowNodes, edges: flowEdges } = buildFlowGraph(currentUser, handleUserClick);
      setNodes(flowNodes);
      setEdges(flowEdges);
    }
  }, [currentUser, handleUserClick, setNodes, setEdges]);

  if (!currentUser) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const walletBalance = getUserWalletBalance(currentUser.id);
  const directReferrals = getDirectReferrals(currentUser.id);
  const pendingReferrals = directReferrals.filter(user => !user.isApproved);

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-50">
      <Navbar
        onLogout={handleLogout}
      />

      {/* React Flow Container */}
      <div className="flex-1 relative bg-slate-950">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{
            padding: 0.2,
            includeHiddenNodes: false,
            minZoom: 0.3,
            maxZoom: 1.5,
          }}
          attributionPosition="bottom-left"
          minZoom={0.1}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
          nodesDraggable={true}
          nodesConnectable={false}
          elementsSelectable={true}
          className="bg-slate-950"
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={24}
            size={1}
            color="#334155" // slate-700
            className="bg-slate-950"
          />
          <Controls
            showZoom={true}
            showFitView={true}
            showInteractive={true}
            position="bottom-left"
            className="!bg-slate-900 !border-slate-800 !shadow-xl [&>button]:!bg-slate-800 [&>button]:!border-slate-700 [&>button]:!text-slate-400 [&>button:hover]:!bg-slate-700 [&>button:hover]:!text-white"
          />
          <MiniMap
            nodeColor={(node) => {
              if (node.data.isRoot) return '#3b82f6';
              return '#475569';
            }}
            maskColor="rgba(2, 6, 23, 0.7)" // slate-950 with opacity
            className="!bg-slate-900 !border-slate-800 !shadow-xl"
            position="bottom-right"
          />

          <Panel position="top-right" className="bg-slate-900/80 backdrop-blur-md rounded-xl shadow-xl p-4 border border-slate-800">
            <div className="text-xs space-y-2">
              <p className="font-bold text-white flex items-center gap-2">
                <Activity className="w-3 h-3 text-blue-500" /> Network Overview
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-400">
                <span>Total Nodes:</span>
                <span className="text-white text-right">{nodes.length}</span>
                <span>Connections:</span>
                <span className="text-white text-right">{edges.length}</span>
              </div>
            </div>
          </Panel>
        </ReactFlow>

        {/* Sidebar Panel */}
        {showSidebar && selectedUser && (
          <div className="absolute top-4 right-4 w-80 bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-800 overflow-hidden z-[1000] animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="relative p-6 pb-8 bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-b border-slate-800">
              <button
                onClick={() => setShowSidebar(false)}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white leading-tight">{selectedUser.name}</h3>
                  <p className="text-blue-400 text-xs">{selectedUser.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950/50 py-1.5 px-3 rounded-lg w-fit">
                <Phone className="w-3 h-3" />
                <span>{selectedUser.phone}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Referral Code */}
              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Referral Code</span>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-lg font-mono font-bold text-white">{selectedUser.referralCode}</p>
                  <button className="text-xs text-blue-400 hover:text-blue-300">Copy</button>
                </div>
              </div>

              {/* Stats */}
              <div>
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-500" />
                  Performance
                </h4>

                {(() => {
                  const stats = getUserStats(selectedUser.id);
                  const directRefs = getDirectReferrals(selectedUser.id);
                  return (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-800">
                        <span className="text-sm text-slate-400">Total Invested</span>
                        <span className="font-bold text-emerald-400">₹{stats.totalInvested.toLocaleString()}</span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-800">
                        <span className="text-sm text-slate-400">Total Returns</span>
                        <span className="font-bold text-blue-400">₹{stats.totalReturns.toLocaleString()}</span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-800">
                        <span className="text-sm text-slate-400">Direct Referrals</span>
                        <span className="font-bold text-purple-400">{directRefs.length}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS for edges */}
      <style jsx global>{`
        .react-flow__edge path {
          stroke: #475569 !important; /* slate-600 */
          stroke-width: 2px !important;
        }
        
        .react-flow__edge.animated path {
          stroke: #3b82f6 !important; /* blue-500 */
          stroke-dasharray: 5;
          animation: dashdraw 0.5s linear infinite;
        }
        
        @keyframes dashdraw {
          to {
            stroke-dashoffset: -10;
          }
        }
      `}</style>
    </div>
  );
}

// Helper function to build the flow graph
function buildFlowGraph(rootUser: User, onUserClick: (user: User) => void) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const levelGap = 200;
  const nodeWidth = 280; // Width of each node card + spacing

  // First pass: calculate subtree widths
  function calculateSubtreeWidth(user: User): number {
    const children = getDirectReferrals(user.id);
    if (children.length === 0) {
      return 1; // Leaf node takes 1 unit of width
    }
    // Sum of all children's widths
    return children.reduce((sum, child) => sum + calculateSubtreeWidth(child), 0);
  }

  // Second pass: position nodes
  function addUserNode(
    user: User,
    level: number,
    parentId: string | null,
    startX: number
  ): number {
    const nodeId = user.id;
    const children = getDirectReferrals(user.id);

    let currentX = startX;
    const childPositions: number[] = [];

    // Position all children first and collect their X positions
    if (children.length > 0) {
      children.forEach((child) => {
        const childWidth = calculateSubtreeWidth(child);
        const childCenterX = addUserNode(child, level + 1, nodeId, currentX);
        childPositions.push(childCenterX);
        currentX += childWidth * nodeWidth;
      });

      // Position parent at the center of its children
      const leftmostChild = childPositions[0];
      const rightmostChild = childPositions[childPositions.length - 1];
      const parentX = (leftmostChild + rightmostChild) / 2;

      nodes.push({
        id: nodeId,
        type: 'userNode',
        position: { x: parentX, y: level * levelGap },
        data: {
          user,
          isRoot: parentId === null,
          onUserClick
        },
      });

      // Create edges to children
      children.forEach((child) => {
        edges.push({
          id: `e${nodeId}-${child.id}`,
          source: nodeId,
          target: child.id,
          type: 'smoothstep',
          animated: true,
        });
      });

      return parentX;
    } else {
      // Leaf node - position at current X
      const x = startX + nodeWidth / 2;
      nodes.push({
        id: nodeId,
        type: 'userNode',
        position: { x, y: level * levelGap },
        data: {
          user,
          isRoot: parentId === null,
          onUserClick
        },
      });
      return x;
    }
  }

  // Start positioning from x = 0
  addUserNode(rootUser, 0, null, 0);

  return { nodes, edges };
}
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
  Activity, Crown, Phone, Mail, Target, Zap
} from 'lucide-react';
import { User, getDirectReferrals, getUserStats, getAllDownline } from '@/lib/mockData';

// Custom Node Component
function UserNode({ data }: { data: any }) {
  const stats = getUserStats(data.user.id);
  const directReferrals = getDirectReferrals(data.user.id);
  const isRoot = data.isRoot;

  return (
    <div 
      className={`relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border-2 p-4 w-64 transition-all hover:shadow-2xl cursor-pointer ${
        isRoot ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-blue-400'
      }`}
      onClick={() => data.onUserClick(data.user)}
    >
      {/* Handles for edge connections */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#8b5cf6', width: 12, height: 12, border: '2px solid white' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#8b5cf6', width: 12, height: 12, border: '2px solid white' }}
      />
      
      {isRoot && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 z-10">
          <Crown className="w-3 h-3" />
          YOU
        </div>
      )}

      {/* Header with Avatar */}
      <div className="flex items-start gap-3 mb-3">
        <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-md ${
          isRoot ? 'bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600' : 'bg-gradient-to-br from-purple-600 via-pink-600 to-red-600'
        }`}>
          {data.user.name.charAt(0)}
          {stats.investmentCount > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-md">
              <Zap className="w-3 h-3" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-gray-900 leading-tight truncate">{data.user.name}</h3>
          <p className="text-xs text-gray-600 truncate flex items-center gap-1">
            <Mail className="w-3 h-3 shrink-0" />
            <span className="truncate">{data.user.email}</span>
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-2 border border-green-200">
          <div className="flex items-center gap-1 mb-0.5">
            <DollarSign className="w-3 h-3 text-green-600" />
            <span className="text-xs font-medium text-green-700">Invested</span>
          </div>
          <p className="text-sm font-bold text-green-800">₹{(stats.totalInvested / 1000).toFixed(1)}K</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-2 border border-purple-200">
          <div className="flex items-center gap-1 mb-0.5">
            <Users className="w-3 h-3 text-purple-600" />
            <span className="text-xs font-medium text-purple-700">Referrals</span>
          </div>
          <p className="text-sm font-bold text-purple-800">{directReferrals.length}</p>
        </div>
      </div>

      {/* Referral Code */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-2 text-white">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium opacity-90">Code</span>
          <span className="font-mono font-bold text-xs tracking-wider">
            {data.user.referralCode}
          </span>
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

  const allDownline = getAllDownline(currentUser.id);
  const networkStats = getNetworkStats(currentUser);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-lg shadow-sm z-30">
        <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-medium text-sm sm:text-base hidden sm:inline">Dashboard</span>
              </button>
              <div className="h-6 sm:h-8 w-px bg-gray-300 hidden sm:block" />
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="hidden md:block">
                  <h1 className="text-base sm:text-lg font-bold text-gray-900">Interactive Network Flow</h1>
                  <p className="text-xs text-gray-500">Drag, zoom, and explore your network</p>
                </div>
                <div className="md:hidden">
                  <h1 className="text-sm font-bold text-gray-900">Network</h1>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-3">
              {/* Stats - Hidden on mobile */}
              <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-center">
                  <p className="text-xs text-blue-600">Members</p>
                  <p className="text-lg font-bold text-blue-700">{allDownline.length + 1}</p>
                </div>
                <div className="w-px h-8 bg-blue-300"></div>
                <div className="text-center">
                  <p className="text-xs text-green-600">Investment</p>
                  <p className="text-lg font-bold text-green-700">₹{(networkStats.totalInvestment / 1000).toFixed(0)}K</p>
                </div>
              </div>

              <div className="text-right hidden md:block">
                <p className="text-xs text-gray-500">Logged in as</p>
                <p className="font-semibold text-gray-900 flex items-center gap-2">
                  <Crown className="w-4 h-4 text-yellow-500" />
                  {currentUser.name}
                </p>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium text-sm sm:text-base hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* React Flow Container */}
      <div className="flex-1 relative">
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
        >
          <Background 
            variant={BackgroundVariant.Dots} 
            gap={16} 
            size={2}
            color="#cbd5e1"
          />
          <Controls 
            showZoom={true}
            showFitView={true}
            showInteractive={true}
            position="bottom-left"
          />
          <MiniMap 
            nodeColor={(node) => {
              if (node.data.isRoot) return '#3b82f6';
              return '#a855f7';
            }}
            maskColor="rgba(0, 0, 0, 0.1)"
            style={{ 
              backgroundColor: 'white',
              border: '2px solid #e5e7eb'
            }}
            position="bottom-right"
          />
          
          <Panel position="top-right" className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-2 sm:p-3 m-2 sm:m-4 border border-gray-200">
            <div className="text-xs sm:text-sm space-y-1">
              <p className="font-bold text-gray-900">Controls:</p>
              <p className="text-gray-600 hidden sm:block">🖱️ Drag to pan</p>
              <p className="text-gray-600 hidden sm:block">🔍 Scroll to zoom</p>
              <p className="text-gray-600">👆 Click node</p>
              <p className="text-xs text-purple-600 mt-2">Edges: {edges.length}</p>
            </div>
          </Panel>
        </ReactFlow>

        {/* Sidebar Panel */}
        {showSidebar && selectedUser && (
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-[calc(100vw-1rem)] sm:w-80 max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-[1000]">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl font-bold border-2 border-white/30">
                    {selectedUser.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{selectedUser.name}</h3>
                    <p className="text-blue-100 text-sm">{selectedUser.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="text-white/80 hover:text-white transition-colors text-xl"
                >
                  ✕
                </button>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4" />
                <span>{selectedUser.phone}</span>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* Referral Code */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-200">
                <span className="text-xs font-medium text-gray-600">Referral Code</span>
                <p className="text-xl font-bold font-mono text-blue-600">{selectedUser.referralCode}</p>
              </div>

              {/* Stats */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  Performance Stats
                </h4>
                
                {(() => {
                  const stats = getUserStats(selectedUser.id);
                  const directRefs = getDirectReferrals(selectedUser.id);
                  return (
                    <>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Total Invested</span>
                        <span className="font-bold text-gray-900">₹{stats.totalInvested.toLocaleString()}</span>
                      </div>

                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Total Returns</span>
                        <span className="font-bold text-green-600">₹{stats.totalReturns.toLocaleString()}</span>
                      </div>

                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Direct Referrals</span>
                        <span className="font-bold text-purple-600">{directRefs.length}</span>
                      </div>

                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Investments</span>
                        <span className="font-bold text-orange-600">{stats.investmentCount}</span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS for edges - SIMPLIFIED */}
      <style jsx global>{`
        .react-flow__edge path {
          stroke: #8b5cf6 !important;
          stroke-width: 4px !important;
        }
        
        .react-flow__edge.animated path {
          stroke-dasharray: 5;
          animation: dashdraw 0.5s linear infinite;
        }
        
        .react-flow__edge.selected path {
          stroke: #7c3aed !important;
          stroke-width: 5px !important;
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
  const levelGap = 280;
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

// Helper function to get network stats
function getNetworkStats(user: User): {
  totalUsers: number;
  totalInvestment: number;
  activeUsers: number;
  totalReturns: number;
} {
  let totalUsers = 1;
  let totalInvestment = 0;
  let activeUsers = 0;
  let totalReturns = 0;

  const stats = getUserStats(user.id);
  totalInvestment += stats.totalInvested;
  totalReturns += stats.totalReturns;
  if (stats.investmentCount > 0) activeUsers++;

  const referrals = getDirectReferrals(user.id);
  referrals.forEach(ref => {
    const childStats = getNetworkStats(ref);
    totalUsers += childStats.totalUsers;
    totalInvestment += childStats.totalInvestment;
    activeUsers += childStats.activeUsers;
    totalReturns += childStats.totalReturns;
  });

  return { totalUsers, totalInvestment, activeUsers, totalReturns };
}
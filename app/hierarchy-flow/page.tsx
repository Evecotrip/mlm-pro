'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
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
  Search, X, ChevronRight, Loader2, AlertCircle, ChevronDown, ChevronUp
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import {
  getHierarchyTree,
  searchHierarchy,
  getMembersAtLevel,
  getHierarchyStats,
  HierarchyNode,
  HierarchyTree,
  getFullName,
  getLevelColor,
  getProfileColor,
  getHierarchyStatusColor
} from '@/api/hierarchy-api';

// Custom Node Component
function UserNode({ data }: { data: any }) {
  const user: HierarchyNode = data.user;
  const isRoot = data.isRoot;
  const isExpanded = data.isExpanded;
  const hasChildren = data.hasChildren;

  const handleNodeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    data.onUserClick(data.user);
  };

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    data.onExpandToggle(data.user.id);
  };

  return (
    <div
      className={`relative group transition-all duration-300 ${isRoot ? 'scale-110' : 'hover:scale-105'
        }`}
      onClick={handleNodeClick}
    >
      {/* Glow Effect */}
      <div className={`absolute -inset-0.5 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-500 ${isRoot ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gradient-to-r from-slate-300 to-slate-200 dark:from-slate-600 dark:to-slate-400'
        }`}></div>

      <div className={`relative bg-white dark:bg-slate-900 rounded-2xl p-4 w-64 border ${isRoot ? 'border-blue-500/50' : 'border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500'
        }`}>
        {/* Handles */}
        <Handle
          type="target"
          position={Position.Top}
          className="!bg-slate-400 dark:!bg-slate-500 !w-3 !h-3 !border-2 !border-white dark:!border-slate-900"
        />
        <Handle
          type="source"
          position={Position.Bottom}
          className="!bg-slate-400 dark:!bg-slate-500 !w-3 !h-3 !border-2 !border-white dark:!border-slate-900"
        />

        {isRoot && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-0.5 rounded-full text-[10px] font-bold shadow-lg flex items-center gap-1 z-10 border border-white/10">
            <Crown className="w-3 h-3" />
            YOU
          </div>
        )}

        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-inner ${isRoot ? 'bg-gradient-to-br from-blue-600 to-purple-600' : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white'
            }`}>
            {user.firstName.charAt(0)}
            {user.activeInvestments > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                <Zap className="w-2 h-2 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">{getFullName(user.firstName, user.lastName)}</h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="bg-slate-50 dark:bg-slate-950/50 rounded-lg p-2 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1 mb-0.5">
              <DollarSign className="w-3 h-3 text-emerald-600 dark:text-emerald-500" />
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Invested</span>
            </div>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{parseFloat(user.totalInvestment || '0').toLocaleString('en-IN')}</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/50 rounded-lg p-2 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1 mb-0.5">
              <Users className="w-3 h-3 text-blue-600 dark:text-blue-500" />
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Team</span>
            </div>
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400">{user.directReferrals}</p>
          </div>
        </div>

        {/* Code */}
        <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg py-1 px-2 flex justify-between items-center">
          <span className="text-[10px] text-slate-500 dark:text-slate-500">Code</span>
          <span className="font-mono text-[10px] text-slate-700 dark:text-slate-300">{user.referralCode}</span>
        </div>

        {/* Expand/Collapse Button */}
        {hasChildren && (
          <button
            onClick={handleExpandClick}
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all z-20 border-2 border-white dark:border-slate-900"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

const nodeTypes = {
  userNode: UserNode,
};

export default function HierarchyFlowPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedUser, setSelectedUser] = useState<HierarchyNode | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [hierarchyData, setHierarchyData] = useState<HierarchyTree | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const hasFetchedData = useRef(false);

  // Check authentication
  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.push('/login');
    }
  }, [isLoaded, user, router]);

  // Fetch hierarchy data
  useEffect(() => {
    if (!user?.id || hasFetchedData.current) return;
    
    hasFetchedData.current = true;
    fetchHierarchyData();
    
    return () => {
      hasFetchedData.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const fetchHierarchyData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getHierarchyTree(5);
      if (response.success && response.data) {
        setHierarchyData(response.data);
        // Initialize root node as expanded
        if (response.data.root?.id) {
          setExpandedNodes(new Set([response.data.root.id]));
        }
      } else {
        setError(response.message || 'Failed to load hierarchy');
      }
    } catch (error) {
      console.error('Error fetching hierarchy:', error);
      setError('Network error while loading hierarchy');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserClick = useCallback((node: HierarchyNode) => {
    setSelectedUser(node);
    setShowSidebar(true);
  }, []);

  const handleExpandToggle = useCallback((nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      const response = await searchHierarchy(searchQuery.trim());
      if (response.success && response.data?.found && response.data.node) {
        setSelectedUser(response.data.node);
        setShowSidebar(true);
      } else {
        alert('Member not found in your hierarchy');
      }
    } catch (error) {
      console.error('Error searching:', error);
      alert('Error searching for member');
    }
  };

  // Build the flow graph
  useEffect(() => {
    if (hierarchyData?.root) {
      const { nodes: flowNodes, edges: flowEdges } = buildFlowGraph(
        hierarchyData.root, 
        handleUserClick, 
        handleExpandToggle,
        expandedNodes
      );
      setNodes(flowNodes);
      setEdges(flowEdges);
    }
  }, [hierarchyData, handleUserClick, handleExpandToggle, expandedNodes, setNodes, setEdges]);

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading hierarchy...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-slate-900 dark:text-white font-semibold mb-2">Failed to Load Hierarchy</p>
          <p className="text-slate-600 dark:text-slate-400 mb-4">{error}</p>
          <button
            onClick={fetchHierarchyData}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user || !hierarchyData) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
      <Navbar
        onLogout={handleLogout}
      />

      {/* React Flow Container */}
      <div className="flex-1 relative bg-slate-50 dark:bg-slate-950">
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
          className="bg-slate-50 dark:bg-slate-950"
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={24}
            size={1}
            color="var(--bg-dots)" // We'll set this via CSS variable or just use a conditional if possible, but color prop doesn't support CSS vars well. Let's try a neutral color or handle it via class.
            // Actually, let's use a color that works for both or update it dynamically.
            // For now, let's use a slate-400/slate-700 mix.
            // Or better, we can't easily switch color prop with tailwind classes.
            // Let's assume the component handles it or we need a state.
            // For simplicity, let's use a color that is visible on both.
            className="bg-slate-50 dark:bg-slate-950 [&>circle]:fill-slate-300 dark:[&>circle]:fill-slate-700"
          />
          <Controls
            showZoom={true}
            showFitView={true}
            showInteractive={true}
            position="bottom-left"
            className="!bg-white dark:!bg-slate-900 !border-slate-200 dark:!border-slate-800 !shadow-xl [&>button]:!bg-slate-100 dark:[&>button]:!bg-slate-800 [&>button]:!border-slate-200 dark:[&>button]:!border-slate-700 [&>button]:!text-slate-600 dark:[&>button]:!text-slate-400 [&>button:hover]:!bg-slate-200 dark:[&>button:hover]:!bg-slate-700 [&>button:hover]:!text-slate-900 dark:[&>button:hover]:!text-white"
          />
          <MiniMap
            nodeColor={(node) => {
              if (node.data.isRoot) return '#3b82f6';
              return '#64748b'; // slate-500
            }}
            maskColor="rgba(0, 0, 0, 0.1)" // lighter mask for light mode? No, we can't easily switch. Let's use a generic one.
            className="!bg-white dark:!bg-slate-900 !border-slate-200 dark:!border-slate-800 !shadow-xl"
            position="bottom-right"
          />

          <Panel position="top-left" className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-xl shadow-xl p-4 border border-slate-200 dark:border-slate-800">
            <div className="space-y-3">
              <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                <Search className="w-4 h-4 text-blue-600 dark:text-blue-500" /> Search Member
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Referral code..."
                  className="px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white w-32"
                />
                <button
                  onClick={handleSearch}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  Go
                </button>
              </div>
            </div>
          </Panel>

          <Panel position="top-right" className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-xl shadow-xl p-4 border border-slate-200 dark:border-slate-800">
            <div className="text-xs space-y-2">
              <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-3 h-3 text-blue-600 dark:text-blue-500" /> Network Overview
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-600 dark:text-slate-400">
                <span>Total Members:</span>
                <span className="text-slate-900 dark:text-white text-right">{hierarchyData.totalMembers}</span>
                <span>Max Level:</span>
                <span className="text-slate-900 dark:text-white text-right">{hierarchyData.displayedLevels}</span>
                <span>Direct:</span>
                <span className="text-slate-900 dark:text-white text-right">{hierarchyData.root.directReferrals}</span>
              </div>
            </div>
          </Panel>
        </ReactFlow>

        {/* Sidebar Panel */}
        {showSidebar && selectedUser && (
          <div className="absolute top-4 right-4 w-80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-[1000] animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="relative p-6 pb-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/50 dark:to-purple-900/50 border-b border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setShowSidebar(false)}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-2xl font-bold text-slate-900 dark:text-white shadow-lg">
                  {selectedUser.firstName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{getFullName(selectedUser.firstName, selectedUser.lastName)}</h3>
                  <p className="text-blue-600 dark:text-blue-400 text-xs">{selectedUser.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full border ${getHierarchyStatusColor(selectedUser.status)}`}>
                  {selectedUser.status}
                </span>
                {selectedUser.currentProfile && (
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getProfileColor(selectedUser.currentProfile)}`}>
                    {selectedUser.currentProfile}
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Referral Code */}
              <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-500 uppercase tracking-wider">Referral Code</span>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-lg font-mono font-bold text-slate-900 dark:text-white">{selectedUser.referralCode}</p>
                  <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">Copy</button>
                </div>
              </div>

              {/* Stats */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600 dark:text-blue-500" />
                  Performance
                </h4>

                <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Total Invested</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{parseFloat(selectedUser.totalInvestment || '0').toLocaleString('en-IN')}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Total Earnings</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{parseFloat(selectedUser.totalEarnings || '0').toLocaleString('en-IN')}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Direct Referrals</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">{selectedUser.directReferrals}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Total Downline</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">{selectedUser.totalDownline}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Active Investments</span>
                  <span className="font-bold text-cyan-600 dark:text-cyan-400">{selectedUser.activeInvestments}</span>
                </div>
              </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS for edges */}
      <style jsx global>{`
        .react-flow__edge path {
          stroke: #94a3b8 !important; /* slate-400 for light mode */
          stroke-width: 2px !important;
        }
        
        .dark .react-flow__edge path {
          stroke: #475569 !important; /* slate-600 for dark mode */
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
function buildFlowGraph(
  rootNode: HierarchyNode, 
  onUserClick: (node: HierarchyNode) => void,
  onExpandToggle: (nodeId: string) => void,
  expandedNodes: Set<string>
) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const levelGap = 200;
  const nodeWidth = 280; // Width of each node card + spacing

  // First pass: calculate subtree widths
  function calculateSubtreeWidth(node: HierarchyNode): number {
    if (!node.children || node.children.length === 0) {
      return 1; // Leaf node takes 1 unit of width
    }
    // Sum of all children's widths
    return node.children.reduce((sum, child) => sum + calculateSubtreeWidth(child), 0);
  }

  // Second pass: position nodes
  function addUserNode(
    node: HierarchyNode,
    level: number,
    parentId: string | null,
    startX: number
  ): number {
    const nodeId = node.id;
    const children = node.children || [];
    const hasChildren = children.length > 0;
    const isExpanded = expandedNodes.has(nodeId) || parentId === null; // Root is always expanded

    let currentX = startX;
    const childPositions: number[] = [];

    // Position all children first and collect their X positions (only if expanded)
    if (hasChildren && isExpanded) {
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
          user: node,
          isRoot: parentId === null,
          hasChildren,
          isExpanded,
          onUserClick,
          onExpandToggle
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
      // Leaf node or collapsed node - position at current X
      const x = startX + nodeWidth / 2;
      nodes.push({
        id: nodeId,
        type: 'userNode',
        position: { x, y: level * levelGap },
        data: {
          user: node,
          isRoot: parentId === null,
          hasChildren,
          isExpanded,
          onUserClick,
          onExpandToggle
        },
      });
      return x;
    }
  }

  // Start positioning from x = 0
  addUserNode(rootNode, 0, null, 0);

  return { nodes, edges };
}
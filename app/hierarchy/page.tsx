'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  TrendingUp, LogOut, ArrowLeft, User as UserIcon,
  Phone, DollarSign, TrendingDown, Users, ZoomIn, ZoomOut, RotateCcw,
  Maximize2, Minimize2, Search, Filter, Download, Eye, EyeOff, Share2,
  Award, Activity, Crown, Target, Zap, BarChart3, PieChart, Calendar,
  Mail, MapPin, ChevronDown, ChevronRight, Copy, CheckCircle, Info
} from 'lucide-react';
import { User, getDirectReferrals, getUserStats } from '@/lib/mockData';

type ViewMode = 'compact' | 'detailed' | 'card';
type LayoutMode = 'tree' | 'grid' | 'list';

export default function HierarchyPage() {
  const router = useRouter();
  const { currentUser, isAuthenticated, logout } = useAuth();
  const [zoomLevel, setZoomLevel] = useState(100);
  const [viewMode, setViewMode] = useState<ViewMode>('detailed');
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('tree');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedUserId, setHighlightedUserId] = useState<string | null>(null);
  const [showInvestmentsOnly, setShowInvestmentsOnly] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (currentUser && !currentUser.isApproved) {
      router.push('/queue');
    }
  }, [isAuthenticated, currentUser, router]);

  // Initialize all nodes as expanded
  useEffect(() => {
    if (currentUser) {
      const allUserIds = getAllUserIds(currentUser);
      setExpandedNodes(new Set(allUserIds));
    }
  }, [currentUser]);

  if (!currentUser) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 10, 50));
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term) {
      const foundUser = findUserByNameOrCode(currentUser, term.toLowerCase());
      if (foundUser) {
        setHighlightedUserId(foundUser.id);
        // Expand path to highlighted user
        const path = getPathToUser(currentUser, foundUser.id);
        setExpandedNodes(new Set([...expandedNodes, ...path]));
      } else {
        setHighlightedUserId(null);
      }
    } else {
      setHighlightedUserId(null);
    }
  };

  const toggleNodeExpansion = (userId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
    }
    setExpandedNodes(newExpanded);
  };

  const expandAll = () => {
    const allUserIds = getAllUserIds(currentUser);
    setExpandedNodes(new Set(allUserIds));
  };

  const collapseAll = () => {
    setExpandedNodes(new Set([currentUser.id]));
  };

  const networkStats = getNetworkStats(currentUser);

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setShowSidebar(true);
  };

  const copyReferralCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const exportNetworkData = () => {
    const data = getAllNetworkData(currentUser);
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'network-data.json';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-sm sticky top-0 z-20 border-gray-200 dark:border-slate-800 transition-colors">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Dashboard</span>
              </button>
              <div className="h-8 w-px bg-gray-300" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Network Hierarchy</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Manage your downline network</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right mr-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">Logged in as</p>
                <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Crown className="w-4 h-4 text-yellow-500" />
                  {currentUser.name}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>

          {/* Enhanced Stats Bar with Cards */}
          <div className="grid grid-cols-5 gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-5 h-5 opacity-80" />
                <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">Total</span>
              </div>
              <p className="text-2xl font-bold mb-1">{networkStats.totalUsers}</p>
              <p className="text-xs opacity-90">Network Members</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-5 h-5 opacity-80" />
                <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">Value</span>
              </div>
              <p className="text-2xl font-bold mb-1">₹{(networkStats.totalInvestment / 1000).toFixed(0)}K</p>
              <p className="text-xs opacity-90">Total Investment</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <Activity className="w-5 h-5 opacity-80" />
                <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">Active</span>
              </div>
              <p className="text-2xl font-bold mb-1">{networkStats.activeUsers}</p>
              <p className="text-xs opacity-90">Active Members</p>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-5 h-5 opacity-80" />
                <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">Returns</span>
              </div>
              <p className="text-2xl font-bold mb-1">₹{(networkStats.totalReturns / 1000).toFixed(0)}K</p>
              <p className="text-xs opacity-90">Total Returns</p>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <Award className="w-5 h-5 opacity-80" />
                <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">Level</span>
              </div>
              <p className="text-2xl font-bold mb-1">{getMaxDepth(currentUser)}</p>
              <p className="text-xs opacity-90">Max Depth</p>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Toolbar */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b shadow-sm sticky top-[197px] z-10 border-gray-200 dark:border-slate-800 transition-colors">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or referral code..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-950 text-gray-900 dark:text-white shadow-sm placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>

              {/* Layout Mode */}
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 rounded-lg p-1 transition-colors">
                <button
                  onClick={() => setLayoutMode('tree')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${layoutMode === 'tree'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  title="Tree View"
                >
                  <Activity className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setLayoutMode('grid')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${layoutMode === 'grid'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  title="Grid View"
                >
                  <PieChart className="w-4 h-4" />
                </button>
              </div>

              {/* View Mode */}
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 rounded-lg p-1 transition-colors">
                <button
                  onClick={() => setViewMode('card')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'card'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                  Card
                </button>
                <button
                  onClick={() => setViewMode('detailed')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'detailed'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                  Detailed
                </button>
                <button
                  onClick={() => setViewMode('compact')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'compact'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                  Compact
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Filter */}
              <button
                onClick={() => setShowInvestmentsOnly(!showInvestmentsOnly)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all shadow-sm ${showInvestmentsOnly
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-400'
                  : 'bg-white dark:bg-slate-950 border-gray-300 dark:border-slate-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-slate-600'
                  }`}
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Active Only</span>
              </button>

              {/* Expand/Collapse */}
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 rounded-lg p-1 transition-colors">
                <button
                  onClick={expandAll}
                  className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 rounded-md transition-all"
                  title="Expand All"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={collapseAll}
                  className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 rounded-md transition-all"
                  title="Collapse All"
                >
                  <EyeOff className="w-4 h-4" />
                </button>
              </div>

              {/* Export */}
              <button
                onClick={exportNetworkData}
                className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-slate-600 rounded-lg transition-all shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Export</span>
              </button>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-slate-600 rounded-lg transition-all shadow-sm"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative">
        <div className="flex gap-6">
          {/* Main Content Area */}
          <div className={`flex-1 transition-all ${showSidebar ? 'mr-0' : 'mr-0'}`}>
            {layoutMode === 'tree' ? (
              <div className="flex justify-center overflow-auto pb-20">
                <div
                  className="w-full max-w-7xl transition-transform duration-300 ease-in-out"
                  style={{
                    transform: `scale(${zoomLevel / 100})`,
                    transformOrigin: 'top center'
                  }}
                >
                  <NetworkTree
                    user={currentUser}
                    isRoot={true}
                    viewMode={viewMode}
                    highlightedUserId={highlightedUserId}
                    showInvestmentsOnly={showInvestmentsOnly}
                    expandedNodes={expandedNodes}
                    onToggleExpand={toggleNodeExpansion}
                    onUserClick={handleUserClick}
                  />
                </div>
              </div>
            ) : (
              <GridView
                user={currentUser}
                viewMode={viewMode}
                highlightedUserId={highlightedUserId}
                showInvestmentsOnly={showInvestmentsOnly}
                onUserClick={handleUserClick}
              />
            )}
          </div>

          {/* Sidebar Panel */}
          {showSidebar && selectedUser && (
            <div className="w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 overflow-hidden sticky top-[260px] h-fit transition-colors">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold border-2 border-white/30">
                      {selectedUser.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                      <p className="text-blue-100 text-sm">{selectedUser.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowSidebar(false)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4" />
                  <span>{selectedUser.phone}</span>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Referral Code */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/50 rounded-xl p-4 border border-blue-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Referral Code</span>
                    <button
                      onClick={() => copyReferralCode(selectedUser.referralCode)}
                      className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-slate-900 rounded-md hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors text-xs font-medium text-blue-600 dark:text-blue-400"
                    >
                      {copiedCode ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copiedCode ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400">{selectedUser.referralCode}</p>
                </div>

                {/* Stats */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    Performance Stats
                  </h4>

                  {(() => {
                    const stats = getUserStats(selectedUser.id);
                    const directRefs = getDirectReferrals(selectedUser.id);
                    return (
                      <>
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium">Total Invested</span>
                          </div>
                          <span className="font-bold text-gray-900 dark:text-white">₹{stats.totalInvested.toLocaleString()}</span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium">Total Returns</span>
                          </div>
                          <span className="font-bold text-green-600">₹{stats.totalReturns.toLocaleString()}</span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Users className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-medium">Direct Referrals</span>
                          </div>
                          <span className="font-bold text-purple-600">{directRefs.length}</span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Target className="w-4 h-4 text-orange-600" />
                            <span className="text-sm font-medium">Investments</span>
                          </div>
                          <span className="font-bold text-orange-600">{stats.investmentCount}</span>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Network Info */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-600" />
                    Network Information
                  </h4>

                  {(() => {
                    const networkStats = getNetworkStats(selectedUser);
                    return (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <p className="text-xs text-blue-600 font-medium mb-1">Total Network</p>
                          <p className="text-xl font-bold text-blue-700">{networkStats.totalUsers}</p>
                        </div>
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                          <p className="text-xs text-green-600 font-medium mb-1">Active</p>
                          <p className="text-xl font-bold text-green-700">{networkStats.activeUsers}</p>
                        </div>
                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 col-span-2">
                          <p className="text-xs text-purple-600 font-medium mb-1">Network Value</p>
                          <p className="text-xl font-bold text-purple-700">₹{networkStats.totalInvestment.toLocaleString()}</p>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-gray-200 dark:border-slate-800 space-y-2">
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-medium">
                    <Mail className="w-4 h-4" />
                    Send Message
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border-2 border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-all font-medium">
                    <Share2 className="w-4 h-4" />
                    Share Profile
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Zoom Controls */}
        {layoutMode === 'tree' && (
          <div className="fixed bottom-8 left-8 z-20 flex flex-col gap-2">
            <button
              onClick={handleZoomIn}
              disabled={zoomLevel >= 200}
              className="bg-white dark:bg-slate-900 border-2 border-gray-300 dark:border-slate-700 rounded-xl p-3 hover:bg-blue-50 dark:hover:bg-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group"
              title="Zoom In"
            >
              <ZoomIn className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
            </button>

            <div className="bg-white dark:bg-slate-900 border-2 border-gray-300 dark:border-slate-700 rounded-xl px-3 py-2 shadow-lg text-center">
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{zoomLevel}%</span>
            </div>

            <button
              onClick={handleZoomOut}
              disabled={zoomLevel <= 50}
              className="bg-white dark:bg-slate-900 border-2 border-gray-300 dark:border-slate-700 rounded-xl p-3 hover:bg-blue-50 dark:hover:bg-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group"
              title="Zoom Out"
            >
              <ZoomOut className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
            </button>

            <button
              onClick={handleResetZoom}
              className="bg-white dark:bg-slate-900 border-2 border-gray-300 dark:border-slate-700 rounded-xl p-3 hover:bg-green-50 dark:hover:bg-slate-800 hover:border-green-500 dark:hover:border-green-500 transition-all shadow-lg group"
              title="Reset Zoom"
            >
              <RotateCcw className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

// Network Tree Component
function NetworkTree({
  user,
  isRoot = false,
  viewMode,
  highlightedUserId,
  showInvestmentsOnly,
  expandedNodes,
  onToggleExpand,
  onUserClick
}: {
  user: User;
  isRoot?: boolean;
  viewMode: ViewMode;
  highlightedUserId: string | null;
  showInvestmentsOnly: boolean;
  expandedNodes: Set<string>;
  onToggleExpand: (userId: string) => void;
  onUserClick: (user: User) => void;
}) {
  const directReferrals = getDirectReferrals(user.id);
  const stats = getUserStats(user.id);

  // Filter referrals based on investment status
  const filteredReferrals = showInvestmentsOnly
    ? directReferrals.filter(ref => getUserStats(ref.id).investmentCount > 0)
    : directReferrals;

  const hasChildren = filteredReferrals.length > 0;
  const isExpanded = expandedNodes.has(user.id);
  const isHighlighted = highlightedUserId === user.id;

  return (
    <div className="flex flex-col items-center">
      {/* Current User Card */}
      <UserCard
        user={user}
        isRoot={isRoot}
        viewMode={viewMode}
        isHighlighted={isHighlighted}
        hasChildren={hasChildren}
        isExpanded={isExpanded}
        onToggleExpand={() => onToggleExpand(user.id)}
        onClick={() => onUserClick(user)}
      />

      {/* Connection Line */}
      {hasChildren && isExpanded && (
        <div className="w-0.5 h-12 bg-gradient-to-b from-blue-400 to-blue-300"></div>
      )}

      {/* Children Container */}
      {hasChildren && isExpanded && (
        <div className="relative">
          {/* Horizontal Line */}
          {filteredReferrals.length > 1 && (
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-300"
              style={{
                width: `calc(100% - ${100 / filteredReferrals.length}%)`,
                left: `${50 / filteredReferrals.length}%`,
              }}
            />
          )}

          {/* Children Cards */}
          <div className={`flex gap-8 pt-0 ${filteredReferrals.length > 1 ? 'mt-0' : ''}`}>
            {filteredReferrals.map((referral) => (
              <div key={referral.id} className="flex flex-col items-center">
                {/* Vertical Line to Child */}
                <div className="w-0.5 h-12 bg-gradient-to-b from-blue-300 to-blue-200"></div>

                {/* Child Tree */}
                <NetworkTree
                  user={referral}
                  viewMode={viewMode}
                  highlightedUserId={highlightedUserId}
                  showInvestmentsOnly={showInvestmentsOnly}
                  expandedNodes={expandedNodes}
                  onToggleExpand={onToggleExpand}
                  onUserClick={onUserClick}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// User Card Component
function UserCard({
  user,
  isRoot = false,
  viewMode,
  isHighlighted,
  hasChildren,
  isExpanded,
  onToggleExpand,
  onClick
}: {
  user: User;
  isRoot?: boolean;
  viewMode: ViewMode;
  isHighlighted: boolean;
  hasChildren: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onClick: () => void;
}) {
  const stats = getUserStats(user.id);
  const directReferrals = getDirectReferrals(user.id);

  // Card View Mode
  if (viewMode === 'card') {
    return (
      <div
        onClick={onClick}
        className={`relative bg-gradient-to-br from-white to-gray-50 dark:from-slate-900 dark:to-slate-800 rounded-2xl shadow-lg border-2 p-6 w-80 transition-all hover:shadow-2xl hover:scale-[1.02] cursor-pointer ${hasChildren ? 'mb-6' : 'mb-5'
          } ${isRoot ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900' :
            isHighlighted ? 'border-yellow-400 ring-2 ring-yellow-200 dark:ring-yellow-900 animate-pulse' :
              'border-gray-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600'
          }`}
      >
        {isRoot && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-5 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 z-10">
            <Crown className="w-3 h-3" />
            YOU
          </div>
        )}

        {/* Header with Avatar */}
        <div className="flex items-start gap-4 mb-4">
          <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg ${isRoot ? 'bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600' : 'bg-gradient-to-br from-purple-600 via-pink-600 to-red-600'
            }`}>
            {user.name.charAt(0)}
            {stats.investmentCount > 0 && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-md">
                <Zap className="w-3 h-3" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 leading-tight">{user.name}</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate flex items-center gap-1">
              <Mail className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{user.email}</span>
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-1">
              <Phone className="w-3 h-3 flex-shrink-0" />
              {user.phone}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-2.5 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-1.5 mb-1">
              <DollarSign className="w-3.5 h-3.5 text-green-600" />
              <span className="text-xs font-medium text-green-700 dark:text-green-400">Invested</span>
            </div>
            <p className="text-base font-bold text-green-800 dark:text-green-300">₹{(stats.totalInvested / 1000).toFixed(1)}K</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-2.5 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-xs font-medium text-blue-700 dark:text-blue-400">Returns</span>
            </div>
            <p className="text-base font-bold text-blue-800 dark:text-blue-300">₹{(stats.totalReturns / 1000).toFixed(1)}K</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-2.5 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-1.5 mb-1">
              <Users className="w-3.5 h-3.5 text-purple-600" />
              <span className="text-xs font-medium text-purple-700 dark:text-purple-400">Referrals</span>
            </div>
            <p className="text-base font-bold text-purple-800 dark:text-purple-300">{directReferrals.length}</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg p-2.5 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-1.5 mb-1">
              <Target className="w-3.5 h-3.5 text-orange-600" />
              <span className="text-xs font-medium text-orange-700 dark:text-orange-400">Active</span>
            </div>
            <p className="text-base font-bold text-orange-800 dark:text-orange-300">{stats.investmentCount}</p>
          </div>
        </div>

        {/* Referral Code */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-2.5 text-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium opacity-90">Code</span>
            <span className="font-mono font-bold text-sm tracking-wider">
              {user.referralCode}
            </span>
          </div>
        </div>

        {/* Expand Button */}
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand();
            }}
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1.5 rounded-full text-xs font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-1.5 z-10"
          >
            {isExpanded ? (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span>Collapse</span>
              </>
            ) : (
              <>
                <ChevronRight className="w-3.5 h-3.5" />
                <span>Expand</span>
              </>
            )}
          </button>
        )}

        {/* Status Badge */}
        {!hasChildren && (
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${stats.investmentCount > 0
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
              : 'bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-400'
              }`}>
              {stats.investmentCount > 0 ? '✓ Active' : 'No Activity'}
            </span>
          </div>
        )}
      </div>
    );
  }

  if (viewMode === 'compact') {
    return (
      <div
        onClick={onClick}
        className={`relative bg-white dark:bg-slate-900 rounded-lg shadow-md border-2 p-4 w-64 transition-all hover:shadow-lg cursor-pointer ${hasChildren ? 'mb-5' : 'mb-3'
          } ${isRoot ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900' :
            isHighlighted ? 'border-yellow-400 ring-2 ring-yellow-200 dark:ring-yellow-900' :
              'border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600'
          }`}
      >
        {isRoot && (
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-0.5 rounded-full text-xs font-bold z-10">
            YOU
          </div>
        )}

        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-md ${isRoot ? 'bg-gradient-to-br from-blue-500 to-blue-700' : 'bg-gradient-to-br from-purple-500 to-purple-700'
            }`}>
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-slate-700">
          <div className="text-center flex-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">Invested</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">₹{(stats.totalInvested / 1000).toFixed(1)}K</p>
          </div>
          <div className="w-px h-8 bg-gray-200 dark:bg-slate-700"></div>
          <div className="text-center flex-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">Referrals</p>
            <p className="text-sm font-bold text-purple-600 dark:text-purple-400">{directReferrals.length}</p>
          </div>
        </div>

        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand();
            }}
            className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold hover:bg-blue-700 transition-colors shadow-md z-10"
          >
            {isExpanded ? '−' : '+'}
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`relative bg-white dark:bg-slate-900 rounded-xl shadow-lg border-2 p-6 w-80 transition-all hover:shadow-xl cursor-pointer mb-6 ${isRoot ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900' :
        isHighlighted ? 'border-yellow-400 ring-2 ring-yellow-200 dark:ring-yellow-900 animate-pulse' :
          'border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600'
        }`}
    >
      {isRoot && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-1 rounded-full text-xs font-bold shadow-md z-10">
          YOU
        </div>
      )}

      <div className="flex items-start gap-4 mb-4">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md ${isRoot ? 'bg-gradient-to-br from-blue-500 to-blue-700' : 'bg-gradient-to-br from-purple-500 to-purple-700'
          }`}>
          {user.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{user.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mt-1">
            <Phone className="w-3 h-3" />
            <span>{user.phone}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-slate-700 my-4"></div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <DollarSign className="w-4 h-4" />
            <span className="text-sm font-medium">Total Invested</span>
          </div>
          <span className="font-bold text-gray-900 dark:text-white">
            ₹{stats.totalInvested.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium">Total Returns</span>
          </div>
          <span className="font-bold text-green-600 dark:text-green-400">
            ₹{stats.totalReturns.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Users className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium">Direct Referrals</span>
          </div>
          <span className="font-bold text-purple-600 dark:text-purple-400">
            {directReferrals.length}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700 mb-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">Referral Code</span>
          <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-sm">
            {user.referralCode}
          </span>
        </div>
      </div>

      {hasChildren && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand();
          }}
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-1.5 rounded-full text-xs font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md z-10"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      )}

      {!hasChildren && (
        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${stats.investmentCount > 0
            ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
            : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400'
            }`}>
            {stats.investmentCount > 0
              ? `${stats.investmentCount} Investment${stats.investmentCount > 1 ? 's' : ''}`
              : 'No Investments'
            }
          </span>
        </div>
      )}
    </div>
  );
}

// Grid View Component
function GridView({
  user,
  viewMode,
  highlightedUserId,
  showInvestmentsOnly,
  onUserClick
}: {
  user: User;
  viewMode: ViewMode;
  highlightedUserId: string | null;
  showInvestmentsOnly: boolean;
  onUserClick: (user: User) => void;
}) {
  const allUsers = getAllUsersFlat(user);
  const filteredUsers = showInvestmentsOnly
    ? allUsers.filter(u => getUserStats(u.id).investmentCount > 0)
    : allUsers;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
      {filteredUsers.map((u) => (
        <div
          key={u.id}
          onClick={() => onUserClick(u)}
          className={`bg-white dark:bg-slate-900 rounded-2xl shadow-lg border-2 p-6 transition-all hover:shadow-xl hover:scale-105 cursor-pointer ${u.id === user.id ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900' :
            highlightedUserId === u.id ? 'border-yellow-400 ring-2 ring-yellow-200 dark:ring-yellow-900' :
              'border-gray-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600'
            }`}
        >
          {u.id === user.id && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
              <Crown className="w-3 h-3" />
              YOU
            </div>
          )}

          <div className="flex items-start gap-4 mb-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg ${u.id === user.id ? 'bg-gradient-to-br from-blue-600 to-indigo-600' : 'bg-gradient-to-br from-purple-600 to-pink-600'
              }`}>
              {u.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{u.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{u.email}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {u.phone}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
            {(() => {
              const stats = getUserStats(u.id);
              const refs = getDirectReferrals(u.id);
              return (
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Invested</p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">₹{(stats.totalInvested / 1000).toFixed(0)}K</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Referrals</p>
                    <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{refs.length}</p>
                  </div>
                </div>
              );
            })()}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">Code</span>
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-sm">
                {u.referralCode}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Helper Functions
function getAllUsersFlat(user: User): User[] {
  const users = [user];
  const referrals = getDirectReferrals(user.id);
  referrals.forEach(ref => {
    users.push(...getAllUsersFlat(ref));
  });
  return users;
}

// Helper Functions
function getAllUserIds(user: User): string[] {
  const ids = [user.id];
  const referrals = getDirectReferrals(user.id);
  referrals.forEach(ref => {
    ids.push(...getAllUserIds(ref));
  });
  return ids;
}

function findUserByNameOrCode(user: User, search: string): User | null {
  if (user.name.toLowerCase().includes(search) || user.referralCode.toLowerCase().includes(search)) {
    return user;
  }
  const referrals = getDirectReferrals(user.id);
  for (const ref of referrals) {
    const found = findUserByNameOrCode(ref, search);
    if (found) return found;
  }
  return null;
}

function getPathToUser(user: User, targetId: string, path: string[] = []): string[] {
  path.push(user.id);
  if (user.id === targetId) {
    return path;
  }
  const referrals = getDirectReferrals(user.id);
  for (const ref of referrals) {
    const foundPath = getPathToUser(ref, targetId, [...path]);
    if (foundPath[foundPath.length - 1] === targetId) {
      return foundPath;
    }
  }
  return [];
}

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

function getMaxDepth(user: User, currentDepth = 0): number {
  const referrals = getDirectReferrals(user.id);
  if (referrals.length === 0) return currentDepth;

  const depths = referrals.map(ref => getMaxDepth(ref, currentDepth + 1));
  return Math.max(...depths);
}

function getAllNetworkData(user: User): any {
  const stats = getUserStats(user.id);
  const referrals = getDirectReferrals(user.id);

  return {
    user: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      referralCode: user.referralCode,
    },
    stats,
    directReferrals: referrals.map(ref => getAllNetworkData(ref))
  };
}
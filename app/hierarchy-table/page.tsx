'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import {
  Users, DollarSign, ArrowLeft, Search, Loader2, AlertCircle,
  ChevronRight, Crown, Zap, TrendingUp, Activity, ArrowUpRight
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import {
  getHierarchyTree,
  searchHierarchy,
  HierarchyNode,
  HierarchyTree,
  getFullName,
  getProfileColor,
  getHierarchyStatusColor,
  findNodeById
} from '@/api/hierarchy-api';

export default function HierarchyTablePage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [hierarchyData, setHierarchyData] = useState<HierarchyTree | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentNode, setCurrentNode] = useState<HierarchyNode | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<HierarchyNode[]>([]);
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
      const response = await getHierarchyTree(10);
      if (response.success && response.data) {
        setHierarchyData(response.data);
        setCurrentNode(response.data.root);
        setBreadcrumbs([response.data.root]);
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

  const handleUserClick = (node: HierarchyNode) => {
    if (node.children && node.children.length > 0) {
      setCurrentNode(node);
      setBreadcrumbs(prev => {
        const existingIndex = prev.findIndex(b => b.id === node.id);
        if (existingIndex !== -1) {
          return prev.slice(0, existingIndex + 1);
        }
        return [...prev, node];
      });
    }
  };

  const handleBreadcrumbClick = (node: HierarchyNode, index: number) => {
    setCurrentNode(node);
    setBreadcrumbs(prev => prev.slice(0, index + 1));
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await searchHierarchy(searchQuery.trim());
      if (response.success && response.data?.found && response.data.node) {
        // Find the node in our hierarchy and navigate to it
        if (hierarchyData?.root) {
          const foundNode = findNodeById(hierarchyData.root, response.data.node.id);
          if (foundNode) {
            // Build breadcrumb path
            const path = response.data.path || [];
            const newBreadcrumbs: HierarchyNode[] = [hierarchyData.root];
            
            for (const pathNode of path) {
              if (pathNode.id !== hierarchyData.root.id) {
                const node = findNodeById(hierarchyData.root, pathNode.id);
                if (node) newBreadcrumbs.push(node);
              }
            }
            
            if (!newBreadcrumbs.find(b => b.id === foundNode.id)) {
              newBreadcrumbs.push(foundNode);
            }
            
            setBreadcrumbs(newBreadcrumbs);
            setCurrentNode(foundNode);
          }
        }
      } else {
        alert('Member not found in your hierarchy');
      }
    } catch (error) {
      console.error('Error searching:', error);
      alert('Error searching for member');
    }
  };

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

  if (!user || !hierarchyData || !currentNode) {
    return null;
  }

  const isRoot = currentNode.id === hierarchyData.root.id;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
      <Navbar onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => router.push('/dashboard')}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                Network Hierarchy
              </h1>
            </div>
            <p className="text-slate-600 dark:text-slate-400 ml-11">
              View and explore your network structure in table format
            </p>
          </div>

          {/* Search */}
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search by referral code..."
                className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white w-64"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
            >
              Search
            </button>
            <button
              onClick={() => router.push('/hierarchy-flow')}
              className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-semibold transition-colors flex items-center gap-2"
            >
              <Activity className="w-4 h-4" />
              Flow View
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Total Members</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{hierarchyData.totalMembers}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Total Levels</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{hierarchyData.totalLevels}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Direct Referrals</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{hierarchyData.root.directReferrals}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Network Investment</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  {parseFloat(hierarchyData.root.totalInvestment || '0').toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {breadcrumbs.map((node, index) => (
            <div key={node.id} className="flex items-center gap-2 flex-shrink-0">
              {index > 0 && <ChevronRight className="w-4 h-4 text-slate-400" />}
              <button
                onClick={() => handleBreadcrumbClick(node, index)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  index === breadcrumbs.length - 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {index === 0 && node.id === hierarchyData.root.id ? 'You' : getFullName(node.firstName, node.lastName)}
              </button>
            </div>
          ))}
        </div>

        {/* Current User Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold">
                {currentNode.firstName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">{getFullName(currentNode.firstName, currentNode.lastName)}</h2>
                  {isRoot && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-white/20 rounded-full text-xs font-semibold">
                      <Crown className="w-3 h-3" /> YOU
                    </span>
                  )}
                </div>
                <p className="text-blue-100 text-sm">{currentNode.email}</p>
                <p className="text-blue-200 text-xs mt-1">Code: {currentNode.referralCode}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-blue-200 text-xs">Investment</p>
                  <p className="text-lg font-bold">{parseFloat(currentNode.totalInvestment || '0').toLocaleString('en-IN')} USDT</p>
                </div>
                <div>
                  <p className="text-blue-200 text-xs">Team Size</p>
                  <p className="text-lg font-bold">{currentNode.totalDownline}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Direct Referrals of {isRoot ? 'You' : getFullName(currentNode.firstName, currentNode.lastName)}
              <span className="text-slate-500 dark:text-slate-400 font-normal">
                ({currentNode.children?.length || 0} members)
              </span>
            </h3>
          </div>

          {currentNode.children && currentNode.children.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Member</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Referral Code</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Profile</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Investment</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Earnings</th>
                    <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Direct</th>
                    <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Downline</th>
                    <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {currentNode.children.map((child) => (
                    <tr
                      key={child.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                      onClick={() => handleUserClick(child)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-white">
                            {child.firstName.charAt(0)}
                            {child.activeInvestments > 0 && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                                <Zap className="w-2 h-2 text-white" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">{getFullName(child.firstName, child.lastName)}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{child.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono text-slate-700 dark:text-slate-300">
                          {child.referralCode}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        {child.currentProfile ? (
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getProfileColor(child.currentProfile)}`}>
                            {child.currentProfile}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {parseFloat(child.totalInvestment || '0').toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          {parseFloat(child.totalEarnings || '0').toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-semibold text-slate-900 dark:text-white">{child.directReferrals}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-semibold text-slate-900 dark:text-white">{child.totalDownline}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getHierarchyStatusColor(child.status)}`}>
                          {child.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {child.children && child.children.length > 0 ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUserClick(child);
                            }}
                            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            title="View team"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-slate-400 text-xs">No team</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-16 text-center">
              <Users className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400">No direct referrals found</p>
              <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
                Share your referral code to grow your network
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

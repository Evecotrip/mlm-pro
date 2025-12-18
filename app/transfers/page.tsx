'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import {
  ArrowLeft, Send, Download, CheckCircle2, Clock, XCircle, Ban,
  Loader2, User, Calendar, MessageSquare, ArrowUpRight, ArrowDownLeft,
  Filter, Search, RefreshCw
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import {
  getTransfers,
  acceptTransfer,
  rejectTransfer,
  Transfer,
  TransferStatus,
  getTransferStatusColor,
  getTransferUserName,
  getOtherParty,
  getTransferDirection,
  formatTransferDate,
  getTimeAgo,
  canAcceptTransfer,
  canRejectTransfer,
} from '@/api/transfer-api';

type TabType = 'sent' | 'received';

export default function TransfersPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  
  const [activeTab, setActiveTab] = useState<TabType>('sent');
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | TransferStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  const hasFetchedData = useRef(false);

  // Check authentication
  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.push('/login');
    }
  }, [isLoaded, user, router]);

  // Fetch transfers on mount and when tab changes
  useEffect(() => {
    if (!user?.id) return;
    
    fetchTransfers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, activeTab]);

  const fetchTransfers = async () => {
    setIsLoading(true);
    try {
      const response = await getTransfers({
        type: activeTab,
        page: 1,
        limit: 50,
      });
      
      if (response.success && response.data) {
        setTransfers(response.data);
      }
    } catch (error) {
      console.error('Error fetching transfers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (transferId: string) => {
    if (!confirm('Accept this transfer request?')) return;
    
    setProcessingId(transferId);
    try {
      const response = await acceptTransfer(transferId);
      if (response.success) {
        // Refresh the list
        await fetchTransfers();
      } else {
        alert(response.message || 'Failed to accept transfer');
      }
    } catch (error) {
      console.error('Error accepting transfer:', error);
      alert('Error accepting transfer');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (transferId: string) => {
    if (!confirm('Reject this transfer request?')) return;
    
    setProcessingId(transferId);
    try {
      const response = await rejectTransfer(transferId);
      if (response.success) {
        // Refresh the list
        await fetchTransfers();
      } else {
        alert(response.message || 'Failed to reject transfer');
      }
    } catch (error) {
      console.error('Error rejecting transfer:', error);
      alert('Error rejecting transfer');
    } finally {
      setProcessingId(null);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  // Filter transfers
  const filteredTransfers = transfers.filter(transfer => {
    // Status filter
    if (statusFilter !== 'all' && transfer.status !== statusFilter) {
      return false;
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const otherParty = getOtherParty(transfer, user?.id || '');
      return (
        otherParty.firstName.toLowerCase().includes(query) ||
        otherParty.lastName.toLowerCase().includes(query) ||
        otherParty.email.toLowerCase().includes(query) ||
        otherParty.referralCode.toLowerCase().includes(query) ||
        transfer.amount.includes(query) ||
        (transfer.note && transfer.note.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  // Calculate stats
  const stats = {
    total: transfers.length,
    pending: transfers.filter(t => t.status === 'PENDING').length,
    completed: transfers.filter(t => t.status === 'COMPLETED').length,
    rejected: transfers.filter(t => t.status === 'REJECTED').length,
  };

  const getStatusIcon = (status: TransferStatus) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4" />;
      case 'COMPLETED':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'REJECTED':
        return <XCircle className="w-4 h-4" />;
      case 'CANCELLED':
        return <Ban className="w-4 h-4" />;
    }
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading transfers...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar onLogout={handleLogout} />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Transfers
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Manage your sent and received transfer requests
              </p>
            </div>
            
            <button
              onClick={fetchTransfers}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 w-fit">
          <button
            onClick={() => setActiveTab('sent')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'sent'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-lg border border-slate-200 dark:border-slate-700'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            Sent Requests
            {activeTab === 'sent' && stats.total > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold">
                {stats.total}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('received')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'received'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-lg border border-slate-200 dark:border-slate-700'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ArrowDownLeft className="w-4 h-4" />
            Received Requests
            {activeTab === 'received' && stats.total > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-bold">
                {stats.total}
              </span>
            )}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
          </div>
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
            <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
          </div>
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
            <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-1">Completed</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.completed}</p>
          </div>
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
            <p className="text-sm text-red-600 dark:text-red-400 mb-1">Rejected</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.rejected}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, email, code, amount..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | TransferStatus)}
                className="px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
                <option value="REJECTED">Rejected</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transfers List */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
          {filteredTransfers.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                {activeTab === 'sent' ? (
                  <Send className="w-8 h-8 text-slate-400" />
                ) : (
                  <Download className="w-8 h-8 text-slate-400" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                No {activeTab} transfers
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {activeTab === 'sent' 
                  ? "You haven't sent any transfer requests yet"
                  : "You haven't received any transfer requests yet"
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {activeTab === 'sent' ? 'Receiver' : 'Sender'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Note
                    </th>
                    {activeTab === 'received' && (
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredTransfers.map((transfer) => {
                    const otherParty = getOtherParty(transfer, user.id);
                    const isProcessing = processingId === transfer.id;
                    
                    return (
                      <tr 
                        key={transfer.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors"
                      >
                        {/* User Info */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                              {otherParty.firstName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-white">
                                {getTransferUserName(otherParty)}
                              </p>
                              <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">
                                {otherParty.referralCode}
                              </p>
                            </div>
                          </div>
                        </td>
                        
                        {/* Amount */}
                        <td className="px-6 py-4">
                          <p className="font-bold text-lg text-slate-900 dark:text-white">
                            {parseFloat(transfer.amount).toLocaleString('en-IN', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })} INR
                          </p>
                        </td>
                        
                        {/* Status */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getTransferStatusColor(transfer.status)}`}>
                            {getStatusIcon(transfer.status)}
                            {transfer.status}
                          </span>
                        </td>
                        
                        {/* Date */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <Calendar className="w-4 h-4" />
                            <div>
                              <p>{getTimeAgo(transfer.createdAt)}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-500">
                                {formatTransferDate(transfer.createdAt)}
                              </p>
                            </div>
                          </div>
                        </td>
                        
                        {/* Note */}
                        <td className="px-6 py-4">
                          {transfer.note ? (
                            <div className="flex items-start gap-2 max-w-xs">
                              <MessageSquare className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                                {transfer.note}
                              </p>
                            </div>
                          ) : (
                            <span className="text-sm text-slate-400 dark:text-slate-600">—</span>
                          )}
                        </td>
                        
                        {/* Actions (for received tab only) */}
                        {activeTab === 'received' && (
                          <td className="px-6 py-4">
                            {canAcceptTransfer(transfer, user.id) && (
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleAccept(transfer.id)}
                                  disabled={isProcessing}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                >
                                  {isProcessing ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <CheckCircle2 className="w-4 h-4" />
                                  )}
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleReject(transfer.id)}
                                  disabled={isProcessing}
                                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                >
                                  {isProcessing ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <XCircle className="w-4 h-4" />
                                  )}
                                  Reject
                                </button>
                              </div>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

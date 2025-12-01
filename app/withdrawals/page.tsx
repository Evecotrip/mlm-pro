'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import {
  ArrowLeft,
  Plus,
  Filter,
  Search,
  Calendar,
  Building2,
  Smartphone,
  Banknote,
  CheckCircle2,
  Clock,
  XCircle,
  Ban,
  Loader2,
  X,
  CreditCard,
  User,
  Phone,
  MapPin,
  AlertCircle
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import {
  getWithdrawalRequests,
  createWithdrawalRequest,
  cancelWithdrawalRequest,
  getWithdrawalStatusColor,
  getWithdrawalMethodName,
  formatWithdrawalDetails,
  WithdrawalRequest,
  WithdrawalStatus,
  WithdrawalMethod,
  CreateWithdrawalPayload
} from '@/api/withdrawal-api';
import { getInvestments, Investment } from '@/api/investment-api';

export default function WithdrawalsPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  
  // State
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingInvestments, setIsLoadingInvestments] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | WithdrawalStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Create withdrawal form state
  const [selectedInvestment, setSelectedInvestment] = useState<string>('');
  const [withdrawalMethod, setWithdrawalMethod] = useState<WithdrawalMethod>('BANK_TRANSFER');
  const [userNotes, setUserNotes] = useState('');
  
  // Bank details
  const [accountName, setAccountName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  
  // UPI details
  const [upiId, setUpiId] = useState('');
  
  // Cash details
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  
  const hasFetchedData = useRef(false);

  // Check authentication
  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.push('/login');
    }
  }, [isLoaded, user, router]);

  // Fetch withdrawals
  useEffect(() => {
    if (!user?.id || hasFetchedData.current) return;
    
    hasFetchedData.current = true;
    fetchWithdrawals();
    
    return () => {
      hasFetchedData.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const fetchWithdrawals = async () => {
    setIsLoading(true);
    try {
      const response = await getWithdrawalRequests({ page: 1, limit: 100 });
      if (response.success && response.data) {
        setWithdrawals(response.data);
      }
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInvestments = async () => {
    setIsLoadingInvestments(true);
    try {
      const response = await getInvestments({ 
        page: 1, 
        limit: 100,
        status: 'ACTIVE'
      });
      if (response.success && response.data) {
        setInvestments(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching investments:', error);
    } finally {
      setIsLoadingInvestments(false);
    }
  };

  const handleCreateWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let payload: CreateWithdrawalPayload;

      if (withdrawalMethod === 'BANK_TRANSFER') {
        payload = {
          investmentId: selectedInvestment,
          method: 'BANK_TRANSFER',
          bankDetails: {
            accountName,
            bankName,
            accountNumber,
            ifscCode
          },
          userNotes: userNotes || undefined
        };
      } else if (withdrawalMethod === 'UPI') {
        payload = {
          investmentId: selectedInvestment,
          method: 'UPI',
          upiDetails: {
            upiId
          },
          userNotes: userNotes || undefined
        };
      } else {
        payload = {
          investmentId: selectedInvestment,
          method: 'CASH',
          cashDetails: {
            address,
            phone,
            preferredTime: preferredTime || undefined
          },
          userNotes: userNotes || undefined
        };
      }

      const response = await createWithdrawalRequest(payload);

      if (response.success) {
        // Reset form
        resetForm();
        setShowCreateModal(false);
        // Refresh withdrawals
        fetchWithdrawals();
      } else {
        alert(response.message || 'Failed to create withdrawal request');
      }
    } catch (error) {
      console.error('Error creating withdrawal:', error);
      alert('An error occurred while creating the withdrawal request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelWithdrawal = async (withdrawalId: string) => {
    if (!confirm('Are you sure you want to cancel this withdrawal request?')) {
      return;
    }

    try {
      const response = await cancelWithdrawalRequest(withdrawalId);
      if (response.success) {
        fetchWithdrawals();
      } else {
        alert(response.message || 'Failed to cancel withdrawal request');
      }
    } catch (error) {
      console.error('Error cancelling withdrawal:', error);
      alert('An error occurred while cancelling the withdrawal request');
    }
  };

  const resetForm = () => {
    setSelectedInvestment('');
    setWithdrawalMethod('BANK_TRANSFER');
    setUserNotes('');
    setAccountName('');
    setBankName('');
    setAccountNumber('');
    setIfscCode('');
    setUpiId('');
    setAddress('');
    setPhone('');
    setPreferredTime('');
  };

  const handleOpenCreateModal = () => {
    setShowCreateModal(true);
    fetchInvestments();
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  // Filter withdrawals
  const filteredWithdrawals = withdrawals.filter(w => {
    const matchesStatus = statusFilter === 'all' || w.status === statusFilter;
    const matchesSearch = searchQuery === '' || 
      w.amount.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      formatWithdrawalDetails(w).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate stats
  const stats = {
    total: withdrawals.length,
    pending: withdrawals.filter(w => w.status === 'PENDING').length,
    completed: withdrawals.filter(w => w.status === 'COMPLETED').length,
    rejected: withdrawals.filter(w => w.status === 'REJECTED').length,
    totalAmount: withdrawals
      .filter(w => w.status === 'COMPLETED')
      .reduce((sum, w) => sum + parseFloat(w.amount), 0)
  };

  const getStatusIcon = (status: WithdrawalStatus) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4" />;
      case 'APPROVED':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'COMPLETED':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'REJECTED':
        return <XCircle className="w-4 h-4" />;
      case 'CANCELLED':
        return <Ban className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getMethodIcon = (method: WithdrawalMethod) => {
    switch (method) {
      case 'BANK_TRANSFER':
        return <Building2 className="w-4 h-4" />;
      case 'UPI':
        return <Smartphone className="w-4 h-4" />;
      case 'CASH':
        return <Banknote className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading withdrawals...</p>
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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/wallet')}
              className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Withdrawal Requests
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Manage your withdrawal requests
              </p>
            </div>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            New Withdrawal
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">Total Requests</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">Completed</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.completed}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">Rejected</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.rejected}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">Total Withdrawn</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.totalAmount.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by amount, ID, or details..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 flex-wrap">
              {(['all', 'PENDING', 'APPROVED', 'COMPLETED', 'REJECTED', 'CANCELLED'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    statusFilter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {status === 'all' ? 'All' : status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Withdrawals List */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
          {filteredWithdrawals.length === 0 ? (
            <div className="text-center py-12">
              <Banknote className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                {searchQuery || statusFilter !== 'all' 
                  ? 'No withdrawals found matching your filters'
                  : 'No withdrawal requests yet'}
              </p>
              <button
                onClick={handleOpenCreateModal}
                className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
              >
                Create your first withdrawal request
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredWithdrawals.map((withdrawal) => (
                    <tr key={withdrawal.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <Calendar className="w-4 h-4" />
                          {new Date(withdrawal.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-lg font-bold text-slate-900 dark:text-white">
                          ₹{parseFloat(withdrawal.amount).toLocaleString('en-IN')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getMethodIcon(withdrawal.method)}
                          <span className="text-sm font-medium text-slate-900 dark:text-white">
                            {getWithdrawalMethodName(withdrawal.method)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-600 dark:text-slate-400 max-w-xs truncate">
                          {formatWithdrawalDetails(withdrawal)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getWithdrawalStatusColor(withdrawal.status)}`}>
                          {getStatusIcon(withdrawal.status)}
                          {withdrawal.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {withdrawal.status === 'PENDING' && (
                          <button
                            onClick={() => handleCancelWithdrawal(withdrawal.id)}
                            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Create Withdrawal Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Create Withdrawal Request
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreateWithdrawal} className="p-6 space-y-6">
              {/* Investment Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Select Investment *
                </label>
                {isLoadingInvestments ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                  </div>
                ) : (
                  <select
                    value={selectedInvestment}
                    onChange={(e) => setSelectedInvestment(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  >
                    <option value="">Choose an investment...</option>
                    {investments.map((inv) => (
                      <option key={inv.id} value={inv.id}>
                        {inv.profile} - ₹{parseFloat(inv.amount).toLocaleString('en-IN')} ({inv.status})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Withdrawal Method */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Withdrawal Method *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['BANK_TRANSFER', 'UPI', 'CASH'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setWithdrawalMethod(method)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        withdrawalMethod === method
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        {getMethodIcon(method)}
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {getWithdrawalMethodName(method)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bank Transfer Details */}
              {withdrawalMethod === 'BANK_TRANSFER' && (
                <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Bank Account Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Account Holder Name *
                      </label>
                      <input
                        type="text"
                        value={accountName}
                        onChange={(e) => setAccountName(e.target.value)}
                        required
                        className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Bank Name *
                      </label>
                      <input
                        type="text"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        required
                        className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                        placeholder="HDFC Bank"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Account Number *
                      </label>
                      <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        required
                        className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                        placeholder="12345678901234"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        IFSC Code *
                      </label>
                      <input
                        type="text"
                        value={ifscCode}
                        onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                        required
                        className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                        placeholder="HDFC0001234"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* UPI Details */}
              {withdrawalMethod === 'UPI' && (
                <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Smartphone className="w-5 h-5" />
                    UPI Details
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      UPI ID *
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      required
                      className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                      placeholder="yourname@paytm"
                    />
                  </div>
                </div>
              )}

              {/* Cash Details */}
              {withdrawalMethod === 'CASH' && (
                <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Banknote className="w-5 h-5" />
                    Cash Pickup Details
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Pickup Address *
                    </label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      rows={3}
                      className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                      placeholder="123 Main Street, Apartment 4B, Mumbai, 400001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                      placeholder="+919876543210"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Preferred Time (Optional)
                    </label>
                    <input
                      type="text"
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                      placeholder="Weekdays 10 AM - 5 PM"
                    />
                  </div>
                </div>
              )}

              {/* User Notes */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  placeholder="Any special instructions or notes..."
                />
              </div>

              {/* Info Alert */}
              <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900 dark:text-blue-100">
                  <p className="font-semibold mb-1">Important Information</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200">
                    <li>Your withdrawal request will be reviewed by our admin team</li>
                    <li>Processing time may vary based on the withdrawal method</li>
                    <li>You can cancel the request while it's in PENDING status</li>
                  </ul>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Withdrawal Request'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

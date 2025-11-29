'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Navbar from '@/components/Navbar';
import {
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  ArrowLeft,
  HandCoins,
  User,
  Upload,
  CreditCard,
  Loader2,
  MapPin
} from 'lucide-react';
import {
  createBorrowRequest,
  getBorrowRequestById,
  cancelBorrowRequest,
  uploadConfirmationProof,
  BorrowRequest,
  CreateBorrowRequestPayload,
  ContactDetails
} from '@/api/borrow-add-money-api';

type Step = 'method' | 'amount' | 'details' | 'review' | 'created';

function BorrowAddMoneyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoaded, user } = useUser();
  const requestId = searchParams.get('requestId');

  // Form states
  const [step, setStep] = useState<Step>('method');
  const [paymentMethod, setPaymentMethod] = useState<'ONLINE_TRANSFER' | 'PHYSICAL_CASH'>('ONLINE_TRANSFER');
  const [amount, setAmount] = useState('');
  const [lenderReferralCode, setLenderReferralCode] = useState('');
  const [borrowerNotes, setBorrowerNotes] = useState('');
  const [contactDetails, setContactDetails] = useState<ContactDetails>({
    address: '',
    city: '',
    state: '',
    country: 'India',
    pinCode: '',
    phoneNumber1: '',
    phoneNumber2: ''
  });

  // Request states
  const [request, setRequest] = useState<BorrowRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.push('/login');
      return;
    }

    if (requestId) {
      fetchRequest();
    }
  }, [isLoaded, user, router, requestId]);

  const fetchRequest = async () => {
    if (!requestId) return;

    setLoading(true);
    try {
      const response = await getBorrowRequestById(requestId);
      if (response.success && response.data) {
        setRequest(response.data);
      }
    } catch (error) {
      console.error('Error fetching request:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async () => {
    setCreating(true);
    try {
      let payload: CreateBorrowRequestPayload;

      if (paymentMethod === 'ONLINE_TRANSFER') {
        payload = {
          amount: parseFloat(amount),
          paymentMethod: 'ONLINE_TRANSFER',
          lenderReferralCode,
          borrowerNotes: borrowerNotes || undefined
        };
      } else {
        payload = {
          amount: parseFloat(amount),
          paymentMethod: 'PHYSICAL_CASH',
          contactDetails,
          borrowerNotes: borrowerNotes || undefined
        };
      }

      const response = await createBorrowRequest(payload);

      if (response.success && response.data) {
        setRequest(response.data);
        setStep('created');
        router.push(`/borrow-add-money?requestId=${response.data.id}`);
      } else {
        alert(response.error || 'Failed to create borrow request');
      }
    } catch (error) {
      console.error('Error creating request:', error);
      alert('An error occurred while creating the request');
    } finally {
      setCreating(false);
    }
  };

  const handleCancelRequest = async () => {
    if (!request || !confirm('Are you sure you want to cancel this request?')) return;

    try {
      const response = await cancelBorrowRequest(request.id);
      if (response.success) {
        fetchRequest();
      }
    } catch (error) {
      console.error('Error cancelling request:', error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/jpg'].includes(file.type)) {
        alert('Only JPG/JPEG files are allowed');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUploadProof = async () => {
    if (!request || !selectedFile) return;

    setUploading(true);
    try {
      const response = await uploadConfirmationProof(request.id, selectedFile);
      if (response.success) {
        alert('Confirmation proof uploaded successfully!');
        setSelectedFile(null);
        fetchRequest();
      } else {
        alert(response.error || 'Failed to upload proof');
      }
    } catch (error) {
      console.error('Error uploading proof:', error);
      alert('An error occurred while uploading');
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    router.push('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'PROCESSING': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'PENDING': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'REJECTED': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'CANCELLED': return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="w-5 h-5" />;
      case 'PROCESSING': return <Clock className="w-5 h-5" />;
      case 'PENDING': return <Clock className="w-5 h-5" />;
      case 'REJECTED':
      case 'CANCELLED': return <XCircle className="w-5 h-5" />;
      default: return <AlertCircle className="w-5 h-5" />;
    }
  };

  // If viewing existing request
  if (requestId && request) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-blue-500/30">
        <Navbar onLogout={handleLogout} />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <button
              onClick={() => router.push('/add-money')}
              className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Add Money
            </button>

            <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-800 p-8 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl border ${getStatusColor(request.status)}`}>
                    {getStatusIcon(request.status)}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">Borrow Request</h1>
                    <p className="text-sm text-slate-400 font-mono">ID: {request.id.slice(0, 8)}...</p>
                  </div>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold border uppercase tracking-wide ${getStatusColor(request.status)}`}>
                  {request.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-800">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Lender</p>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <p className="text-base font-bold text-white">
                      {request.lender.firstName} {request.lender.lastName}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Amount</p>
                  <p className="text-xl font-bold text-white">{request.amount} USDT</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Payment Method</p>
                  <p className="text-base font-medium text-slate-300">
                    {request.paymentMethod === 'ONLINE_TRANSFER' ? 'Online Transfer' : 'Physical Cash'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Created</p>
                  <p className="text-base font-medium text-slate-300">
                    {new Date(request.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>

              {request.borrowerNotes && (
                <div className="mt-6 pt-6 border-t border-slate-800">
                  <p className="text-sm text-slate-500 mb-2">Your Notes:</p>
                  <p className="text-sm text-slate-300 italic p-3 bg-slate-950 rounded-xl border border-slate-800">
                    "{request.borrowerNotes}"
                  </p>
                </div>
              )}
            </div>

            {/* Lender Details for PROCESSING status */}
            {request.status === 'PROCESSING' && request.paymentMethod === 'PHYSICAL_CASH' && request.borrowerDetails.contactDetails && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-3xl p-8 mb-6">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-6 h-6 text-blue-400" />
                  <h2 className="text-xl font-bold text-white">Your Contact Details</h2>
                </div>
                <p className="text-sm text-blue-200 mb-6">
                  The lender will use these details to deliver cash:
                </p>

                <div className="bg-slate-950/50 rounded-xl p-6 space-y-4 border border-blue-500/20">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Address</p>
                    <p className="font-medium text-white">{request.borrowerDetails.contactDetails.address}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">City</p>
                      <p className="font-medium text-white">{request.borrowerDetails.contactDetails.city}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">State</p>
                      <p className="font-medium text-white">{request.borrowerDetails.contactDetails.state}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">PIN Code</p>
                      <p className="font-medium text-white">{request.borrowerDetails.contactDetails.pinCode}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Phone</p>
                      <p className="font-medium text-white">{request.borrowerDetails.contactDetails.phoneNumber1}</p>
                    </div>
                  </div>
                </div>

                {request.lenderNotes && (
                  <div className="mt-6 p-4 bg-blue-500/20 rounded-xl border border-blue-500/30">
                    <p className="text-xs text-blue-300 mb-1 font-bold uppercase">Lender's Notes:</p>
                    <p className="text-sm text-blue-100 italic">"{request.lenderNotes}"</p>
                  </div>
                )}
              </div>
            )}

            {/* Upload Confirmation Proof */}
            {request.status === 'PROCESSING' && !request.confirmationProof && (
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-800 p-8 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Upload className="w-6 h-6 text-purple-500" />
                  <h2 className="text-xl font-bold text-white">Upload Confirmation Proof</h2>
                </div>
                <p className="text-sm text-slate-400 mb-6">
                  Once you receive the money, please upload a confirmation proof (screenshot/photo). Only JPG/JPEG files accepted.
                </p>

                <div className="space-y-4">
                  <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:border-purple-500/50 transition-colors bg-slate-950/30">
                    <input
                      type="file"
                      id="proof-upload"
                      accept="image/jpeg,image/jpg"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <label htmlFor="proof-upload" className="cursor-pointer flex flex-col items-center">
                      <Upload className="w-10 h-10 text-slate-500 mb-3" />
                      <span className="text-slate-300 font-medium mb-1">Click to select file</span>
                      <span className="text-xs text-slate-500">JPG/JPEG up to 5MB</span>
                    </label>
                    {selectedFile && (
                      <p className="text-sm text-emerald-400 mt-4 font-medium">✓ {selectedFile.name}</p>
                    )}
                  </div>

                  <button
                    onClick={handleUploadProof}
                    disabled={!selectedFile || uploading}
                    className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? 'Uploading...' : 'Upload Confirmation Proof'}
                  </button>
                </div>
              </div>
            )}

            {/* Status Messages */}
            {request.status === 'PENDING' && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 mb-6">
                <p className="text-sm text-yellow-200">
                  <strong className="text-yellow-400 block mb-1">⏳ Pending Approval</strong>
                  Your request is waiting for the lender's approval. You'll be notified once they respond.
                </p>
                <button
                  onClick={handleCancelRequest}
                  className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg text-sm font-bold transition-colors"
                >
                  Cancel Request
                </button>
              </div>
            )}

            {request.status === 'PROCESSING' && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 mb-6">
                <p className="text-sm text-blue-200">
                  <strong className="text-blue-400 block mb-1">✓ Request Approved</strong>
                  The lender has approved your request and will transfer the money soon. Please upload confirmation proof once received.
                </p>
              </div>
            )}

            {request.status === 'COMPLETED' && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 mb-6">
                <p className="text-sm text-emerald-200">
                  <strong className="text-emerald-400 block mb-1">✓ Transaction Completed</strong>
                  The transaction has been completed and {request.amount} USDT has been credited to your wallet.
                </p>
              </div>
            )}

            {request.status === 'REJECTED' && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 mb-6">
                <p className="text-sm text-red-200">
                  <strong className="text-red-400 block mb-1">✗ Request Rejected</strong>
                  The lender has rejected your request. {request.lenderNotes || 'Please try with a different lender.'}
                </p>
              </div>
            )}

            {request.status === 'CANCELLED' && (
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-6">
                <p className="text-sm text-slate-400">
                  <strong className="text-slate-300 block mb-1">✗ Request Cancelled</strong>
                  This request has been cancelled.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  // Create new borrow request flow
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-blue-500/30">
      <Navbar onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => router.push('/add-money')}
            className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Add Money
          </button>

          <div className="mb-8 text-center">
            <div className="inline-flex p-4 bg-purple-500/10 rounded-2xl mb-4 border border-purple-500/20">
              <HandCoins className="w-10 h-10 text-purple-500" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Borrow Money</h1>
            <p className="text-slate-400">Get funds from another platform user</p>
          </div>

          {/* Step 1: Payment Method */}
          {step === 'method' && (
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-800 p-8">
              <h2 className="text-xl font-bold text-white mb-6">Select Payment Method</h2>

              <div className="space-y-4">
                <button
                  onClick={() => setPaymentMethod('ONLINE_TRANSFER')}
                  className={`w-full p-6 rounded-2xl border transition-all text-left group ${paymentMethod === 'ONLINE_TRANSFER'
                    ? 'bg-purple-500/10 border-purple-500/50 shadow-lg shadow-purple-500/10'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${paymentMethod === 'ONLINE_TRANSFER' ? 'bg-purple-500 text-white' : 'bg-slate-900 text-slate-500 group-hover:text-slate-300'}`}>
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <p className={`font-bold mb-1 ${paymentMethod === 'ONLINE_TRANSFER' ? 'text-white' : 'text-slate-300'}`}>Online Transfer (Soft Cash)</p>
                      <p className="text-sm text-slate-500">Request from a specific user by referral code</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod('PHYSICAL_CASH')}
                  className={`w-full p-6 rounded-2xl border transition-all text-left group ${paymentMethod === 'PHYSICAL_CASH'
                    ? 'bg-purple-500/10 border-purple-500/50 shadow-lg shadow-purple-500/10'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${paymentMethod === 'PHYSICAL_CASH' ? 'bg-purple-500 text-white' : 'bg-slate-900 text-slate-500 group-hover:text-slate-300'}`}>
                      <HandCoins className="w-6 h-6" />
                    </div>
                    <div>
                      <p className={`font-bold mb-1 ${paymentMethod === 'PHYSICAL_CASH' ? 'text-white' : 'text-slate-300'}`}>Physical Cash (Hard Cash)</p>
                      <p className="text-sm text-slate-500">Provide your address for cash delivery</p>
                    </div>
                  </div>
                </button>
              </div>

              <button
                onClick={() => setStep('amount')}
                className="w-full mt-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-600/20"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Amount */}
          {step === 'amount' && (
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-800 p-8">
              <h2 className="text-xl font-bold text-white mb-6">Enter Amount</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Amount (USDT)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    min="1"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={borrowerNotes}
                    onChange={(e) => setBorrowerNotes(e.target.value)}
                    placeholder="Add any notes for the lender..."
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setStep('method')}
                  className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep('details')}
                  disabled={!amount || parseFloat(amount) <= 0}
                  className="flex-1 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Details */}
          {step === 'details' && (
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-800 p-8">
              <h2 className="text-xl font-bold text-white mb-6">
                {paymentMethod === 'ONLINE_TRANSFER' ? 'Lender Details' : 'Your Contact Details'}
              </h2>

              {paymentMethod === 'ONLINE_TRANSFER' ? (
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Lender's Referral Code *
                  </label>
                  <input
                    type="text"
                    value={lenderReferralCode}
                    onChange={(e) => setLenderReferralCode(e.target.value.toUpperCase())}
                    placeholder="Enter referral code (e.g., REFCODE)"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    Enter the referral code of the user you want to borrow from
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      value={contactDetails.address}
                      onChange={(e) => setContactDetails({ ...contactDetails, address: e.target.value })}
                      placeholder="Street address"
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={contactDetails.city}
                        onChange={(e) => setContactDetails({ ...contactDetails, city: e.target.value })}
                        placeholder="City"
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        value={contactDetails.state}
                        onChange={(e) => setContactDetails({ ...contactDetails, state: e.target.value })}
                        placeholder="State"
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        value={contactDetails.pinCode}
                        onChange={(e) => setContactDetails({ ...contactDetails, pinCode: e.target.value })}
                        placeholder="PIN Code"
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">
                        Country *
                      </label>
                      <input
                        type="text"
                        value={contactDetails.country}
                        onChange={(e) => setContactDetails({ ...contactDetails, country: e.target.value })}
                        placeholder="Country"
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                      Phone Number 1 *
                    </label>
                    <input
                      type="tel"
                      value={contactDetails.phoneNumber1}
                      onChange={(e) => setContactDetails({ ...contactDetails, phoneNumber1: e.target.value })}
                      placeholder="+91 9876543210"
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                      Phone Number 2 (Optional)
                    </label>
                    <input
                      type="tel"
                      value={contactDetails.phoneNumber2}
                      onChange={(e) => setContactDetails({ ...contactDetails, phoneNumber2: e.target.value })}
                      placeholder="+91 9876543211"
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setStep('amount')}
                  className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep('review')}
                  disabled={
                    paymentMethod === 'ONLINE_TRANSFER'
                      ? !lenderReferralCode
                      : !contactDetails.address || !contactDetails.city || !contactDetails.state || !contactDetails.pinCode || !contactDetails.phoneNumber1
                  }
                  className="flex-1 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Review
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 'review' && (
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-800 p-8">
              <h2 className="text-xl font-bold text-white mb-6">Review Request</h2>

              <div className="space-y-4 mb-8">
                <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
                  <p className="text-sm text-slate-500 mb-1">Amount</p>
                  <p className="text-2xl font-bold text-white">{amount} USDT</p>
                </div>

                <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
                  <p className="text-sm text-slate-500 mb-1">Payment Method</p>
                  <p className="font-bold text-white">
                    {paymentMethod === 'ONLINE_TRANSFER' ? 'Online Transfer' : 'Physical Cash'}
                  </p>
                </div>

                {paymentMethod === 'ONLINE_TRANSFER' ? (
                  <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
                    <p className="text-sm text-slate-500 mb-1">Lender Referral Code</p>
                    <p className="font-bold text-white font-mono">{lenderReferralCode}</p>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
                    <p className="text-sm text-slate-500 mb-2">Contact Details</p>
                    <div className="space-y-1 text-sm text-slate-300">
                      <p>{contactDetails.address}</p>
                      <p>{contactDetails.city}, {contactDetails.state}</p>
                      <p>{contactDetails.country} - {contactDetails.pinCode}</p>
                      <p>📞 {contactDetails.phoneNumber1}</p>
                      {contactDetails.phoneNumber2 && (
                        <p>📞 {contactDetails.phoneNumber2}</p>
                      )}
                    </div>
                  </div>
                )}

                {borrowerNotes && (
                  <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
                    <p className="text-sm text-slate-500 mb-1">Notes</p>
                    <p className="text-sm text-slate-300 italic">"{borrowerNotes}"</p>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep('details')}
                  disabled={creating}
                  className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-colors disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={handleCreateRequest}
                  disabled={creating}
                  className="flex-1 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-600/20 disabled:opacity-50"
                >
                  {creating ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating...
                    </span>
                  ) : 'Create Request'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function BorrowAddMoneyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
      </div>
    }>
      <BorrowAddMoneyContent />
    </Suspense>
  );
}

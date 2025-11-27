'use client';

import { useEffect, useState } from 'react';
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
  Copy,
  Check,
  MapPin,
  Phone,
  CreditCard
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

export default function BorrowAddMoneyPage() {
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
  const [copied, setCopied] = useState(false);

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
        // Update URL with request ID
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
      // Validate file type
      if (!['image/jpeg', 'image/jpg'].includes(file.type)) {
        alert('Only JPG/JPEG files are allowed');
        return;
      }
      // Validate file size (max 5MB)
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = async () => {
    router.push('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'PROCESSING':
        return <Clock className="w-6 h-6 text-blue-600" />;
      case 'PENDING':
        return <Clock className="w-6 h-6 text-yellow-600" />;
      case 'REJECTED':
      case 'CANCELLED':
        return <XCircle className="w-6 h-6 text-red-600" />;
      default:
        return <AlertCircle className="w-6 h-6 text-gray-600" />;
    }
  };

  // If viewing existing request
  if (requestId && request) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
        <Navbar onLogout={handleLogout} />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            {/* Back Button */}
            <button
              onClick={() => router.push('/add-money')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Add Money
            </button>

            {/* Status Header */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon(request.status)}
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Borrow Money Request</h1>
                    <p className="text-sm text-gray-600">Request ID: {request.id.slice(0, 8)}...</p>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(request.status)}`}>
                  {request.status}
                </span>
              </div>

              {/* Request Details */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-600">Lender</p>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="w-4 h-4 text-gray-400" />
                    <p className="text-base font-semibold text-gray-900">
                      {request.lender.firstName} {request.lender.lastName}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="text-xl font-bold text-purple-600">{request.amount} USDT</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="text-base font-semibold text-gray-900">
                    {request.paymentMethod === 'ONLINE_TRANSFER' ? 'Online Transfer' : 'Physical Cash'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Created</p>
                  <p className="text-base font-semibold text-gray-900">
                    {new Date(request.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>

              {request.borrowerNotes && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Your Notes:</p>
                  <p className="text-sm text-gray-900 italic">"{request.borrowerNotes}"</p>
                </div>
              )}
            </div>

            {/* Lender Details for PROCESSING status */}
            {request.status === 'PROCESSING' && request.paymentMethod === 'PHYSICAL_CASH' && request.borrowerDetails.contactDetails && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">Your Contact Details</h2>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  The lender will use these details to deliver cash:
                </p>

                <div className="bg-white rounded-xl p-4 space-y-3">
                  <div>
                    <p className="text-xs text-gray-600">Address</p>
                    <p className="font-semibold text-gray-900">{request.borrowerDetails.contactDetails.address}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600">City</p>
                      <p className="font-semibold text-gray-900">{request.borrowerDetails.contactDetails.city}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">State</p>
                      <p className="font-semibold text-gray-900">{request.borrowerDetails.contactDetails.state}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600">PIN Code</p>
                      <p className="font-semibold text-gray-900">{request.borrowerDetails.contactDetails.pinCode}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Phone</p>
                      <p className="font-semibold text-gray-900">{request.borrowerDetails.contactDetails.phoneNumber1}</p>
                    </div>
                  </div>
                </div>

                {request.lenderNotes && (
                  <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                    <p className="text-xs text-blue-600 mb-1">Lender's Notes:</p>
                    <p className="text-sm text-blue-900 italic">"{request.lenderNotes}"</p>
                  </div>
                )}
              </div>
            )}

            {/* Upload Confirmation Proof */}
            {request.status === 'PROCESSING' && !request.confirmationProof && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Upload className="w-6 h-6 text-purple-600" />
                  <h2 className="text-xl font-bold text-gray-900">Upload Confirmation Proof</h2>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Once you receive the money, please upload a confirmation proof (screenshot/photo). Only JPG/JPEG files accepted.
                </p>

                <div className="space-y-4">
                  <div>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg"
                      onChange={handleFileSelect}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                    />
                    {selectedFile && (
                      <p className="text-sm text-green-600 mt-2">✓ {selectedFile.name} selected</p>
                    )}
                  </div>

                  <button
                    onClick={handleUploadProof}
                    disabled={!selectedFile || uploading}
                    className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? 'Uploading...' : 'Upload Confirmation Proof'}
                  </button>
                </div>
              </div>
            )}

            {/* Status Messages */}
            {request.status === 'PENDING' && (
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  <strong>⏳ Pending:</strong> Your request is waiting for the lender's approval. You'll be notified once they respond.
                </p>
                <button
                  onClick={handleCancelRequest}
                  className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  Cancel Request
                </button>
              </div>
            )}

            {request.status === 'PROCESSING' && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>✓ Approved:</strong> The lender has approved your request and will transfer the money soon. Please upload confirmation proof once received.
                </p>
              </div>
            )}

            {request.status === 'COMPLETED' && (
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-green-800">
                  <strong>✓ Completed:</strong> The transaction has been completed and {request.amount} USDT has been credited to your wallet.
                </p>
              </div>
            )}

            {request.status === 'REJECTED' && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-red-800">
                  <strong>✗ Rejected:</strong> The lender has rejected your request. {request.lenderNotes || 'Please try with a different lender.'}
                </p>
              </div>
            )}

            {request.status === 'CANCELLED' && (
              <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-800">
                  <strong>✗ Cancelled:</strong> This request has been cancelled.
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <Navbar onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.push('/add-money')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Add Money
          </button>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1"></div>
              <div className="text-center flex-1">
                <div className="inline-block p-4 bg-purple-100 rounded-2xl mb-4">
                  <HandCoins className="w-12 h-12 text-purple-600" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text mb-2">
                  Borrow Money
                </h1>
                <p className="text-gray-600">Get funds from another platform user</p>
              </div>
              <div className="flex-1 flex justify-end">
                <button
                  onClick={() => router.push('/my-borrow-requests')}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  My Requests
                </button>
              </div>
            </div>
          </div>

          {/* Step 1: Payment Method */}
          {step === 'method' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Select Payment Method</h2>
              
              <div className="space-y-4">
                <button
                  onClick={() => setPaymentMethod('ONLINE_TRANSFER')}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    paymentMethod === 'ONLINE_TRANSFER'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-6 h-6 text-purple-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Online Transfer (Soft Cash)</p>
                      <p className="text-sm text-gray-600">Request from a specific user by referral code</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod('PHYSICAL_CASH')}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    paymentMethod === 'PHYSICAL_CASH'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <HandCoins className="w-6 h-6 text-purple-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Physical Cash (Hard Cash)</p>
                      <p className="text-sm text-gray-600">Provide your address for cash delivery</p>
                    </div>
                  </div>
                </button>
              </div>

              <button
                onClick={() => setStep('amount')}
                className="w-full mt-6 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-colors"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Amount */}
          {step === 'amount' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Enter Amount</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (USDT)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    min="1"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={borrowerNotes}
                    onChange={(e) => setBorrowerNotes(e.target.value)}
                    placeholder="Add any notes for the lender..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep('method')}
                  className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep('details')}
                  disabled={!amount || parseFloat(amount) <= 0}
                  className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Details */}
          {step === 'details' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {paymentMethod === 'ONLINE_TRANSFER' ? 'Lender Details' : 'Your Contact Details'}
              </h2>
              
              {paymentMethod === 'ONLINE_TRANSFER' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lender's Referral Code *
                  </label>
                  <input
                    type="text"
                    value={lenderReferralCode}
                    onChange={(e) => setLenderReferralCode(e.target.value.toUpperCase())}
                    placeholder="Enter referral code (e.g., REF00001AA)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the referral code of the user you want to borrow from
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      value={contactDetails.address}
                      onChange={(e) => setContactDetails({...contactDetails, address: e.target.value})}
                      placeholder="Street address"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={contactDetails.city}
                        onChange={(e) => setContactDetails({...contactDetails, city: e.target.value})}
                        placeholder="City"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        value={contactDetails.state}
                        onChange={(e) => setContactDetails({...contactDetails, state: e.target.value})}
                        placeholder="State"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        value={contactDetails.pinCode}
                        onChange={(e) => setContactDetails({...contactDetails, pinCode: e.target.value})}
                        placeholder="PIN Code"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country *
                      </label>
                      <input
                        type="text"
                        value={contactDetails.country}
                        onChange={(e) => setContactDetails({...contactDetails, country: e.target.value})}
                        placeholder="Country"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number 1 *
                    </label>
                    <input
                      type="tel"
                      value={contactDetails.phoneNumber1}
                      onChange={(e) => setContactDetails({...contactDetails, phoneNumber1: e.target.value})}
                      placeholder="+91 9876543210"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number 2 (Optional)
                    </label>
                    <input
                      type="tel"
                      value={contactDetails.phoneNumber2}
                      onChange={(e) => setContactDetails({...contactDetails, phoneNumber2: e.target.value})}
                      placeholder="+91 9876543211"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep('amount')}
                  className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-colors"
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
                  className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Review
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 'review' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Review Request</h2>
              
              <div className="space-y-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="text-2xl font-bold text-purple-600">{amount} USDT</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-semibold text-gray-900">
                    {paymentMethod === 'ONLINE_TRANSFER' ? 'Online Transfer' : 'Physical Cash'}
                  </p>
                </div>

                {paymentMethod === 'ONLINE_TRANSFER' ? (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600">Lender Referral Code</p>
                    <p className="font-semibold text-gray-900">{lenderReferralCode}</p>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-2">Contact Details</p>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-900">{contactDetails.address}</p>
                      <p className="text-gray-900">{contactDetails.city}, {contactDetails.state}</p>
                      <p className="text-gray-900">{contactDetails.country} - {contactDetails.pinCode}</p>
                      <p className="text-gray-900">📞 {contactDetails.phoneNumber1}</p>
                      {contactDetails.phoneNumber2 && (
                        <p className="text-gray-900">📞 {contactDetails.phoneNumber2}</p>
                      )}
                    </div>
                  </div>
                )}

                {borrowerNotes && (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600">Notes</p>
                    <p className="text-sm text-gray-900 italic">"{borrowerNotes}"</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('details')}
                  disabled={creating}
                  className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-colors disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={handleCreateRequest}
                  disabled={creating}
                  className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Request'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

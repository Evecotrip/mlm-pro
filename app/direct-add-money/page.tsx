'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Navbar from '@/components/Navbar';
import { 
  getAddMoneyRequestById, 
  uploadPaymentProof,
  calculateConversion,
  createAddMoneyRequest,
  getBankDetailsForCurrency,
  AddMoneyRequest,
  ConversionCalculation
} from '@/api/direct-add-money-api';
import DirectAddInitial from '@/components/direct-add/DirectAddInitial';
import PaymentMethodSelection, { DirectPaymentMethod } from '@/components/direct-add/PaymentMethodSelection';
import DigitalPaymentOptions, { DigitalOption } from '@/components/direct-add/DigitalPaymentOptions';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  Upload, 
  FileText,
  AlertCircle,
  Copy,
  Check,
  ArrowLeft
} from 'lucide-react';

export default function DirectAddMoneyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoaded, user } = useUser();
  const requestId = searchParams.get('requestId');

  const [request, setRequest] = useState<AddMoneyRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [copiedField, setCopiedField] = useState<string>('');
  const [bankDetails, setBankDetails] = useState<any>(null);
  const [transactionRef, setTransactionRef] = useState('');
  const [userNotes, setUserNotes] = useState('');
  
  // Form flow state
  const [directStep, setDirectStep] = useState<'initial' | 'payment-method' | 'digital-options'>('initial');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [totalCredit, setTotalCredit] = useState(0);
  const [directPaymentMethod, setDirectPaymentMethod] = useState<DirectPaymentMethod>(null);
  const [digitalOption, setDigitalOption] = useState<DigitalOption>(null);
  const [conversionData, setConversionData] = useState<ConversionCalculation | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.push('/login');
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    if (requestId) {
      fetchRequest();
      // Removed polling - fetch once on load
    } else {
      // If no requestId, show the form
      setLoading(false);
    }
  }, [requestId]);

  const fetchRequest = async () => {
    if (!requestId) return;
    
    setLoading(true);
    try {
      const response = await getAddMoneyRequestById(requestId);
      if (response.success && response.data) {
        setRequest(response.data);
        
        // Fetch bank details for the currency
        const bankResponse = await getBankDetailsForCurrency(response.data.currency);
        if (bankResponse.success && bankResponse.data) {
          setBankDetails(bankResponse.data);
        }
      }
    } catch (error) {
      console.error('Error fetching request:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type - only JPG/JPEG accepted
      const validTypes = ['image/jpeg', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        setUploadError('Please upload a JPG or JPEG image only');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('File size must be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
      setUploadError('');
    }
  };

  const handleUploadProof = async () => {
    if (!selectedFile || !requestId) return;

    setUploading(true);
    setUploadError('');

    try {
      const response = await uploadPaymentProof(requestId, selectedFile);
      
      if (response.success) {
        setUploadSuccess(true);
        setSelectedFile(null);
        // Refresh request data
        await fetchRequest();
        
        setTimeout(() => {
          setUploadSuccess(false);
        }, 3000);
      } else {
        setUploadError(response.error || 'Failed to upload payment proof');
      }
    } catch (error) {
      console.error('Error uploading proof:', error);
      setUploadError('An error occurred while uploading');
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const handleDirectInitialContinue = async (directAmount: string, selectedCurrency: string) => {
    setAmount(directAmount);
    setCurrency(selectedCurrency);
    setLoading(true);
    
    try {
      const response = await calculateConversion(selectedCurrency, parseFloat(directAmount));
      
      if (response.success && response.data) {
        setConversionData(response.data);
        setTotalCredit(parseFloat(response.data.usdtAmount));
        setDirectStep('payment-method');
      } else {
        alert(response.message || 'Failed to calculate conversion');
      }
    } catch (error) {
      console.error('Error calculating conversion:', error);
      alert('Failed to calculate conversion. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDirectPaymentMethodContinue = async (method: DirectPaymentMethod) => {
    setDirectPaymentMethod(method);
    
    if (method === 'digital') {
      setDirectStep('digital-options');
    } else if (method === 'cash') {
      // Create request directly for cash
      await createDirectAddRequest('BANK_TRANSFER');
    }
  };

  const handleDigitalOptionContinue = async (option: DigitalOption) => {
    setDigitalOption(option);
    // Both options create the same request
    await createDirectAddRequest('UPI');
  };

  const createDirectAddRequest = async (method: 'UPI' | 'BANK_TRANSFER') => {
    setLoading(true);
    
    try {
      const requestResponse = await createAddMoneyRequest({
        currency: currency,
        currencyAmount: parseFloat(amount),
        method: method,
        paymentDetails: {
          upiId: method === 'UPI' ? 'user@paytm' : undefined,
        },
        userNotes: 'Direct add money request'
      });
      
      if (requestResponse.success && requestResponse.data) {
        // Reload the page with the requestId
        router.push(`/direct-add-money?requestId=${requestResponse.data.id}`);
      } else {
        alert(requestResponse.message || 'Failed to create add money request');
      }
    } catch (error) {
      console.error('Error creating add money request:', error);
      alert('Failed to create request. Please try again.');
    } finally {
      setLoading(false);
    }
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
        return <Clock className="w-6 h-6 text-blue-600 animate-spin" />;
      case 'PENDING':
        return <Clock className="w-6 h-6 text-yellow-600" />;
      case 'REJECTED':
      case 'CANCELLED':
        return <XCircle className="w-6 h-6 text-red-600" />;
      default:
        return <AlertCircle className="w-6 h-6 text-gray-600" />;
    }
  };

  if (loading && !request) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
        <Navbar onLogout={handleLogout} />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading request details...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show form if no requestId
  if (!requestId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
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

            {/* Form Container */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                <h2 className="text-2xl font-bold mb-1">💰 Direct Add Money</h2>
                <p className="text-sm opacity-90">
                  {directStep === 'initial' && 'Enter amount to add'}
                  {directStep === 'payment-method' && 'Select payment method'}
                  {directStep === 'digital-options' && 'Choose digital payment option'}
                </p>
              </div>

              {/* Content */}
              <div className="p-6">
                {directStep === 'initial' && (
                  <DirectAddInitial
                    onContinue={handleDirectInitialContinue}
                    onBack={() => router.push('/add-money')}
                  />
                )}

                {directStep === 'payment-method' && (
                  <PaymentMethodSelection
                    amount={amount}
                    bonus={0}
                    totalCredit={totalCredit}
                    currency={currency}
                    onContinue={handleDirectPaymentMethodContinue}
                    onBack={() => setDirectStep('initial')}
                  />
                )}

                {directStep === 'digital-options' && (
                  <DigitalPaymentOptions
                    amount={amount}
                    bonus={0}
                    totalCredit={totalCredit}
                    currency={currency}
                    onContinue={handleDigitalOptionContinue}
                    onBack={() => setDirectStep('payment-method')}
                  />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
        <Navbar onLogout={handleLogout} />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center py-12">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Not Found</h2>
            <p className="text-gray-600 mb-6">The add money request could not be found.</p>
            <button
              onClick={() => router.push('/add-money')}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors"
            >
              Back to Add Money
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Show bank details immediately if available
  const showBankDetails = bankDetails && request.status !== 'COMPLETED' && request.status !== 'REJECTED';
  const canUploadProof = request.status !== 'COMPLETED' && request.status !== 'REJECTED' && !request.paymentProof;
  const proofUploaded = !!request.paymentProof;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
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
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {getStatusIcon(request.status)}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Add Money Request</h1>
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
                <p className="text-sm text-gray-600">Amount ({request.currency})</p>
                <p className="text-xl font-bold text-gray-900">{request.currencyAmount.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Credit (USDT)</p>
                <p className="text-xl font-bold text-green-600">{request.usdtAmount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Method</p>
                <p className="text-base font-semibold text-gray-900">{request.method.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Created</p>
                <p className="text-base font-semibold text-gray-900">
                  {new Date(request.createdAt).toLocaleDateString('en-IN')}
                </p>
              </div>
            </div>
          </div>

          {/* Bank Details Section */}
          {showBankDetails && bankDetails && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Bank Details</h2>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Please transfer {request.currencyAmount} {request.currency} to the following bank account:
              </p>

              {/* QR Code if available */}
              {bankDetails.qrCodeUrl && (
                <div className="bg-white rounded-xl p-4 mb-4 text-center">
                  <img 
                    src={bankDetails.qrCodeUrl} 
                    alt="Payment QR Code" 
                    className="w-48 h-48 mx-auto mb-2"
                  />
                  <p className="text-sm text-gray-600">Scan with {bankDetails.qrCodeProvider}</p>
                </div>
              )}

              <div className="bg-white rounded-xl p-4 space-y-3">
                {bankDetails.bankAccounts && bankDetails.bankAccounts.length > 0 && (
                  <>
                    {bankDetails.bankAccounts[0].accountName && (
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs text-gray-600">Account Holder</p>
                          <p className="font-semibold text-gray-900">{bankDetails.bankAccounts[0].accountName}</p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(bankDetails.bankAccounts[0].accountName, 'holder')}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          {copiedField === 'holder' ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                      </div>
                    )}

                    {bankDetails.bankAccounts[0].accountNumber && (
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs text-gray-600">Account Number</p>
                          <p className="font-semibold text-gray-900 font-mono">{bankDetails.bankAccounts[0].accountNumber}</p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(bankDetails.bankAccounts[0].accountNumber, 'account')}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          {copiedField === 'account' ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                      </div>
                    )}

                    {bankDetails.bankAccounts[0].bankName && (
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs text-gray-600">Bank Name</p>
                          <p className="font-semibold text-gray-900">{bankDetails.bankAccounts[0].bankName}</p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(bankDetails.bankAccounts[0].bankName, 'bank')}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          {copiedField === 'bank' ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                      </div>
                    )}

                    {bankDetails.bankAccounts[0].ifscCode && (
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs text-gray-600">IFSC Code</p>
                          <p className="font-semibold text-gray-900 font-mono">{bankDetails.bankAccounts[0].ifscCode}</p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(bankDetails.bankAccounts[0].ifscCode, 'ifsc')}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          {copiedField === 'ifsc' ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                      </div>
                    )}

                    {bankDetails.bankAccounts[0].upiId && (
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs text-gray-600">UPI ID</p>
                          <p className="font-semibold text-gray-900 font-mono">{bankDetails.bankAccounts[0].upiId}</p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(bankDetails.bankAccounts[0].upiId, 'upi')}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          {copiedField === 'upi' ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                      </div>
                    )}

                    {bankDetails.bankAccounts[0].branch && (
                      <div>
                        <p className="text-xs text-gray-600">Branch</p>
                        <p className="font-semibold text-gray-900">{bankDetails.bankAccounts[0].branch}</p>
                      </div>
                    )}
                  </>
                )}

                {bankDetails.instructions && (
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">Instructions:</p>
                    <p className="text-sm text-gray-700">{bankDetails.instructions}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Upload Payment Proof Section */}
          {canUploadProof && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Upload className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-bold text-gray-900">Upload Payment Proof</h2>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                After making the payment, please upload a screenshot or receipt as proof.
              </p>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                <input
                  type="file"
                  id="payment-proof"
                  accept="image/jpeg,image/jpg,.jpg,.jpeg"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label
                  htmlFor="payment-proof"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Click to upload payment proof
                  </p>
                  <p className="text-xs text-gray-500">
                    JPG or JPEG only (max 5MB)
                  </p>
                </label>

                {selectedFile && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-semibold text-green-800">{selectedFile.name}</p>
                    <p className="text-xs text-green-600">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                )}
              </div>

              {uploadError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{uploadError}</p>
                </div>
              )}

              {uploadSuccess && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-700">Payment proof uploaded successfully!</p>
                </div>
              )}

              <button
                onClick={handleUploadProof}
                disabled={!selectedFile || uploading}
                className="w-full mt-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Upload Proof
                  </>
                )}
              </button>
            </div>
          )}

          {/* Payment Proof Uploaded */}
          {proofUploaded && (
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-bold text-gray-900">Payment Proof Submitted</h2>
              </div>
              <p className="text-sm text-gray-600">
                Your payment proof has been submitted and is being verified. You'll be notified once the verification is complete.
              </p>
            </div>
          )}

          {/* Status Messages */}
          {request.status === 'PENDING' && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
              <p className="text-sm text-yellow-800">
                <strong>⏳ Pending:</strong> Your request is waiting for admin approval. Bank details will be provided once approved.
              </p>
            </div>
          )}

          {request.status === 'COMPLETED' && (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
              <p className="text-sm text-green-800">
                <strong>✓ Completed:</strong> Your payment has been verified and {request.usdtAmount} USDT has been credited to your wallet.
              </p>
            </div>
          )}

          {request.status === 'REJECTED' && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <p className="text-sm text-red-800">
                <strong>✗ Rejected:</strong> Your request has been rejected. {request.rejectionReason || 'Please contact support for more information.'}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

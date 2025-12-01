'use client';

import { useEffect, useState, Suspense } from 'react';
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
  ArrowLeft,
  Loader2
} from 'lucide-react';

function DirectAddMoneyContent() {
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
    } else {
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
      const validTypes = ['image/jpeg', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        setUploadError('Please upload a JPG or JPEG image only');
        return;
      }

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
      await createDirectAddRequest('BANK_TRANSFER');
    }
  };

  const handleDigitalOptionContinue = async (option: DigitalOption) => {
    setDigitalOption(option);
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
      case 'COMPLETED': return 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-400/10 border-emerald-200 dark:border-emerald-400/20';
      case 'PROCESSING': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-400/10 border-blue-200 dark:border-blue-400/20';
      case 'PENDING': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-400/10 border-yellow-200 dark:border-yellow-400/20';
      case 'REJECTED': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-400/10 border-red-200 dark:border-red-400/20';
      case 'CANCELLED': return 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-400/10 border-slate-200 dark:border-slate-400/20';
      default: return 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-400/10 border-slate-200 dark:border-slate-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="w-5 h-5" />;
      case 'PROCESSING': return <Loader2 className="w-5 h-5 animate-spin" />;
      case 'PENDING': return <Clock className="w-5 h-5" />;
      case 'REJECTED':
      case 'CANCELLED': return <XCircle className="w-5 h-5" />;
      default: return <AlertCircle className="w-5 h-5" />;
    }
  };

  if (loading && !request) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-600 dark:text-emerald-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading request details...</p>
        </div>
      </div>
    );
  }

  // Show form if no requestId
  if (!requestId) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 selection:bg-emerald-500/30 transition-colors duration-300">
        <Navbar onLogout={handleLogout} />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <button
              onClick={() => router.push('/add-money')}
              className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Add Money
            </button>

            <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm dark:shadow-none">
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Direct Add Money</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {directStep === 'initial' && 'Enter amount to add'}
                  {directStep === 'payment-method' && 'Select payment method'}
                  {directStep === 'digital-options' && 'Choose digital payment option'}
                </p>
              </div>

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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
        <Navbar onLogout={handleLogout} />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center py-12">
            <AlertCircle className="w-16 h-16 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Request Not Found</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">The add money request could not be found.</p>
            <button
              onClick={() => router.push('/add-money')}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors"
            >
              Back to Add Money
            </button>
          </div>
        </main>
      </div>
    );
  }

  const showBankDetails = bankDetails && request.status !== 'COMPLETED' && request.status !== 'REJECTED';
  const canUploadProof = request.status !== 'COMPLETED' && request.status !== 'REJECTED' && !request.paymentProof;
  const proofUploaded = !!request.paymentProof;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 selection:bg-emerald-500/30 transition-colors duration-300">
      <Navbar onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => router.push('/add-money')}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Add Money
          </button>

          {/* Status Header */}
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-800 p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl border ${getStatusColor(request.status)}`}>
                  {getStatusIcon(request.status)}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Add Money Request</h1>
                  <p className="text-sm text-slate-400 font-mono">ID: {request.id.slice(0, 8)}...</p>
                </div>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-sm font-bold border uppercase tracking-wide ${getStatusColor(request.status)}`}>
                {request.status}
              </span>
            </div>

            <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800 p-8 mb-6 shadow-sm dark:shadow-none">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl border ${getStatusColor(request.status)}`}>
                    {getStatusIcon(request.status)}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Add Money Request</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">ID: {request.id.slice(0, 8)}...</p>
                  </div>
                </div>
              </div>

              {/* Bank Details Section */}
              {showBankDetails && bankDetails && (
                <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-3xl p-8 mb-6">
                  <div className="flex items-center gap-3 mb-6">
                    <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Bank Details</h2>
                  </div>
                  <p className="text-sm text-blue-800 dark:text-blue-200 mb-6">
                    Please transfer {request.currencyAmount} {request.currency} to the following bank account:
                  </p>

                  {/* QR Code if available */}
                  {bankDetails.qrCodeUrl && (
                    <div className="bg-white p-6 rounded-2xl mb-6 text-center w-fit mx-auto">
                      <img
                        src={bankDetails.qrCodeUrl}
                        alt="Payment QR Code"
                        className="w-48 h-48 mx-auto mb-2"
                      />
                      <p className="text-sm text-slate-900 font-bold">Scan with {bankDetails.qrCodeProvider}</p>
                    </div>
                  )}

                  <div className="bg-white/50 dark:bg-slate-950/50 rounded-xl p-6 space-y-4 border border-blue-200 dark:border-blue-500/20">
                    {bankDetails.bankAccounts && bankDetails.bankAccounts.length > 0 && (
                      <>
                        {bankDetails.bankAccounts[0].accountName && (
                          <div className="flex justify-between items-center group">
                            <div>
                              <p className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-1">Account Holder</p>
                              <p className="font-medium text-slate-900 dark:text-white">{bankDetails.bankAccounts[0].accountName}</p>
                            </div>
                            <button
                              onClick={() => copyToClipboard(bankDetails.bankAccounts[0].accountName, 'holder')}
                              className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            >
                              {copiedField === 'holder' ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        )}

                        {bankDetails.bankAccounts[0].accountNumber && (
                          <div className="flex justify-between items-center group">
                            <div>
                              <p className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-1">Account Number</p>
                              <p className="font-medium text-slate-900 dark:text-white font-mono">{bankDetails.bankAccounts[0].accountNumber}</p>
                            </div>
                            <button
                              onClick={() => copyToClipboard(bankDetails.bankAccounts[0].accountNumber, 'account')}
                              className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            >
                              {copiedField === 'account' ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        )}

                        {bankDetails.bankAccounts[0].bankName && (
                          <div className="flex justify-between items-center group">
                            <div>
                              <p className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-1">Bank Name</p>
                              <p className="font-medium text-slate-900 dark:text-white">{bankDetails.bankAccounts[0].bankName}</p>
                            </div>
                            <button
                              onClick={() => copyToClipboard(bankDetails.bankAccounts[0].bankName, 'bank')}
                              className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            >
                              {copiedField === 'bank' ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        )}

                        {bankDetails.bankAccounts[0].ifscCode && (
                          <div className="flex justify-between items-center group">
                            <div>
                              <p className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-1">IFSC Code</p>
                              <p className="font-medium text-slate-900 dark:text-white font-mono">{bankDetails.bankAccounts[0].ifscCode}</p>
                            </div>
                            <button
                              onClick={() => copyToClipboard(bankDetails.bankAccounts[0].ifscCode, 'ifsc')}
                              className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            >
                              {copiedField === 'ifsc' ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        )}

                        {bankDetails.bankAccounts[0].upiId && (
                          <div className="flex justify-between items-center group">
                            <div>
                              <p className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-1">UPI ID</p>
                              <p className="font-medium text-slate-900 dark:text-white font-mono">{bankDetails.bankAccounts[0].upiId}</p>
                            </div>
                            <button
                              onClick={() => copyToClipboard(bankDetails.bankAccounts[0].upiId, 'upi')}
                              className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            >
                              {copiedField === 'upi' ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        )}
                      </>
                    )}

                    {bankDetails.instructions && (
                      <div className="pt-4 border-t border-blue-200 dark:border-slate-800">
                        <p className="text-xs text-slate-500 dark:text-slate-500 mb-2 uppercase tracking-wider">Instructions</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{bankDetails.instructions}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Upload Payment Proof Section */}
              {canUploadProof && (
                <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800 p-8 mb-6 shadow-sm dark:shadow-none">
                  <div className="flex items-center gap-3 mb-4">
                    <Upload className="w-6 h-6 text-emerald-600 dark:text-emerald-500" />
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Upload Payment Proof</h2>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                    After making the payment, please upload a screenshot or receipt as proof.
                  </p>

                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center hover:border-emerald-500/50 transition-colors bg-slate-50/50 dark:bg-slate-950/30">
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
                      <Upload className="w-12 h-12 text-slate-400 dark:text-slate-500 mb-3" />
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Click to upload payment proof
                      </p>
                      <p className="text-xs text-slate-500">
                        JPG or JPEG only (max 5MB)
                      </p>
                    </label>

                    {selectedFile && (
                      <div className="mt-4 p-3 bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-lg inline-block">
                        <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">{selectedFile.name}</p>
                        <p className="text-xs text-emerald-600/70 dark:text-emerald-600/70">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    )}
                  </div>

                  {uploadError && (
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-400">{uploadError}</p>
                    </div>
                  )}

                  {uploadSuccess && (
                    <div className="mt-4 p-3 bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-lg flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-emerald-700 dark:text-emerald-400">Payment proof uploaded successfully!</p>
                    </div>
                  )}

                  <button
                    onClick={handleUploadProof}
                    disabled={!selectedFile || uploading}
                    className="w-full mt-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
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
                <div className="bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl p-6 mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Payment Proof Submitted</h2>
                  </div>
                  <p className="text-sm text-emerald-800 dark:text-emerald-200">
                    Your payment proof has been submitted and is being verified. You'll be notified once the verification is complete.
                  </p>
                </div>
              )}

              {/* Status Messages */}
              {request.status === 'PENDING' && (
                <div className="bg-yellow-100 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 rounded-2xl p-6">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong className="text-yellow-700 dark:text-yellow-400 block mb-1">⏳ Pending Approval</strong>
                    Your request is waiting for admin approval. Bank details will be provided once approved.
                  </p>
                </div>
              )}

              {request.status === 'COMPLETED' && (
                <div className="bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl p-6">
                  <p className="text-sm text-emerald-800 dark:text-emerald-200">
                    <strong className="text-emerald-700 dark:text-emerald-400 block mb-1">✓ Transaction Completed</strong>
                    Your payment has been verified and {request.usdtAmount} USDT has been credited to your wallet.
                  </p>
                </div>
              )}

              {request.status === 'REJECTED' && (
                <div className="bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl p-6">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    <strong className="text-red-700 dark:text-red-400 block mb-1">✗ Request Rejected</strong>
                    Your request has been rejected. {request.rejectionReason || 'Please contact support for more information.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>

  );
}

export default function DirectAddMoneyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors duration-300">
        <Loader2 className="w-12 h-12 text-emerald-600 dark:text-emerald-500 animate-spin" />
      </div>
    }>
      <DirectAddMoneyContent />
    </Suspense>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import { ArrowLeft, Wallet, HandCoins, X, Loader2 } from 'lucide-react';
import { getUserWalletBalance, getDirectReferrals } from '@/lib/mockData';
import Navbar from '@/components/Navbar';
import BorrowLenderDetails from '@/components/borrow/BorrowLenderDetails';
import BorrowPaymentMethod, { PaymentMethod } from '@/components/borrow/BorrowPaymentMethod';
import BankDetailsForm, { BankDetails } from '@/components/borrow/BankDetailsForm';
import AddressDetailsForm, { AddressDetails } from '@/components/borrow/AddressDetailsForm';
import BorrowConfirmation from '@/components/borrow/BorrowConfirmation';
import DirectAddInitial from '@/components/direct-add/DirectAddInitial';
import PaymentMethodSelection, { DirectPaymentMethod } from '@/components/direct-add/PaymentMethodSelection';
import DigitalPaymentOptions, { DigitalOption } from '@/components/direct-add/DigitalPaymentOptions';
import DirectAddConfirmation from '@/components/direct-add/DirectAddConfirmation';
import { 
  calculateConversion, 
  createAddMoneyRequest,
  getBankDetailsForCurrency,
  type ConversionCalculation,
  type CurrencyBankDetails
} from '@/api/direct-add-money-api';
import { useUserStore } from '@/store/useUserStore';
import { useWalletStore } from '@/store/useWalletStore';

type AddMoneyMethod = 'borrow' | 'direct' | null;
type BorrowStep = 'lender-details' | 'payment-method' | 'payment-details' | 'confirmation';
type DirectStep = 'initial' | 'payment-method' | 'digital-options' | 'details' | 'confirmation';

export default function AddMoneyPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  
  // Mock data for now
  const currentUser = { id: user?.id || '', name: user?.fullName || 'User', isApproved: true };
  
  // Main state
  const [selectedMethod, setSelectedMethod] = useState<AddMoneyMethod>(null);
  
  // Borrow flow state
  const [borrowStep, setBorrowStep] = useState<BorrowStep>('lender-details');
  const [lenderUser, setLenderUser] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [loading, setLoading] = useState(false);
  const [requestId, setRequestId] = useState('');
  
  // Direct Add flow state
  const [directStep, setDirectStep] = useState<DirectStep>('initial');
  const [directPaymentMethod, setDirectPaymentMethod] = useState<DirectPaymentMethod>(null);
  const [digitalOption, setDigitalOption] = useState<DigitalOption>(null);
  const [bonus, setBonus] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [currency, setCurrency] = useState('INR');
  const [conversionData, setConversionData] = useState<ConversionCalculation | null>(null);
  const [bankDetails, setBankDetails] = useState<CurrencyBankDetails | null>(null);
  const [createdRequestId, setCreatedRequestId] = useState<string>('');

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.push('/login');
    }
  }, [isLoaded, user, router]);

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    const { clearUserData } = await import('@/store/useUserStore').then(m => m.useUserStore.getState());
    const { clearWallet } = await import('@/store/useWalletStore').then(m => m.useWalletStore.getState());
    clearUserData();
    clearWallet();
    await signOut();
    router.push('/');
  };

  const walletBalance = getUserWalletBalance(currentUser.id);
  const directReferrals = getDirectReferrals(currentUser.id);
  const pendingReferrals = directReferrals.filter(user => !user.isApproved);

  const handleLenderDetailsContinue = (lender: any, borrowAmount: string) => {
    setLenderUser(lender);
    setAmount(borrowAmount);
    setBorrowStep('payment-method');
  };

  const handlePaymentMethodContinue = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setBorrowStep('payment-details');
  };

  const handleBankDetailsSubmit = (details: BankDetails) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const reqId = 'BR' + Date.now();
      setRequestId(reqId);
      setLoading(false);
      setBorrowStep('confirmation');
    }, 1500);
  };

  const handleAddressDetailsSubmit = (details: AddressDetails) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const reqId = 'BR' + Date.now();
      setRequestId(reqId);
      setLoading(false);
      setBorrowStep('confirmation');
    }, 1500);
  };

  // Direct Add handlers
  const handleDirectInitialContinue = async (directAmount: string, selectedCurrency: string) => {
    setAmount(directAmount);
    setCurrency(selectedCurrency);
    setLoading(true);
    
    try {
      // Calculate conversion with backend
      const response = await calculateConversion(selectedCurrency, parseFloat(directAmount));
      
      if (response.success && response.data) {
        setConversionData(response.data);
        // Use only USDT amount without bonus
        setBonus(0);
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
    } else {
      // For cash, create request directly
      await createDirectAddRequest('BANK_TRANSFER');
    }
  };

  const handleDigitalOptionContinue = async (option: DigitalOption) => {
    setDigitalOption(option);
    // Both QR code and bank details use UPI method
    await createDirectAddRequest('UPI');
  };
  
  const createDirectAddRequest = async (method: 'UPI' | 'BANK_TRANSFER') => {
    setLoading(true);
    
    try {
      // Create add money request
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
        // Redirect to direct add money page with request ID
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

  const resetForm = () => {
    setSelectedMethod(null);
    setBorrowStep('lender-details');
    setDirectStep('initial');
    setLenderUser(null);
    setAmount('');
    setPaymentMethod(null);
    setDirectPaymentMethod(null);
    setDigitalOption(null);
    setRequestId('');
    setCreatedRequestId('');
    setBonus(0);
    setTotalCredit(0);
    setCurrency('INR');
    setConversionData(null);
    setBankDetails(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
      <Navbar
        onLogout={handleLogout}
      />

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.push('/wallet')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Wallet</span>
            </button>
            <button
              onClick={() => router.push('/my-add-money-requests')}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="hidden sm:inline">My Requests</span>
            </button>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 text-transparent bg-clip-text mb-2">
            💵 Add Money to Wallet
          </h1>
          <p className="text-gray-600">Select Method</p>
        </div>

        {!selectedMethod ? (
          /* Method Selection */
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Borrow Money */}
            <button
              onClick={() => router.push('/borrow-add-money')}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-gray-200 hover:border-purple-400 p-6 sm:p-8 transition-all hover:shadow-2xl hover:scale-105 text-left"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-4 bg-purple-100 rounded-2xl group-hover:bg-purple-200 transition-colors">
                  <HandCoins className="w-10 h-10 text-purple-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">○ Borrow Money from User</h2>
              <p className="text-gray-600">
                Get funds from another platform user
              </p>
            </button>

            {/* Direct Add */}
            <button
              onClick={() => router.push('/direct-add-money')}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-gray-200 hover:border-green-400 p-6 sm:p-8 transition-all hover:shadow-2xl hover:scale-105 text-left"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-4 bg-green-100 rounded-2xl group-hover:bg-green-200 transition-colors">
                  <Wallet className="w-10 h-10 text-green-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">○ Direct Add Money</h2>
              <p className="text-gray-600">
                Add money directly to wallet
              </p>
            </button>
          </div>
        ) : selectedMethod === 'borrow' ? (
          /* Borrow Money Flow */
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">Borrow Money Request</h2>
                    <p className="text-sm opacity-90">
                      {borrowStep === 'lender-details' && 'Enter lender details and amount'}
                      {borrowStep === 'payment-method' && 'Select payment method'}
                      {borrowStep === 'payment-details' && 'Provide payment details'}
                      {borrowStep === 'confirmation' && 'Request submitted successfully'}
                    </p>
                  </div>
                  <button
                    onClick={resetForm}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {borrowStep === 'lender-details' && (
                  <BorrowLenderDetails
                    currentUserId={currentUser.id}
                    onContinue={handleLenderDetailsContinue}
                    onBack={resetForm}
                  />
                )}

                {borrowStep === 'payment-method' && lenderUser && (
                  <BorrowPaymentMethod
                    lenderName={lenderUser.name}
                    amount={amount}
                    onContinue={handlePaymentMethodContinue}
                    onBack={() => setBorrowStep('lender-details')}
                  />
                )}

                {borrowStep === 'payment-details' && paymentMethod === 'soft-cash' && (
                  <BankDetailsForm
                    onSubmit={handleBankDetailsSubmit}
                    onBack={() => setBorrowStep('payment-method')}
                    loading={loading}
                  />
                )}

                {borrowStep === 'payment-details' && paymentMethod === 'hard-cash' && (
                  <AddressDetailsForm
                    onSubmit={handleAddressDetailsSubmit}
                    onBack={() => setBorrowStep('payment-method')}
                    loading={loading}
                  />
                )}

                {borrowStep === 'confirmation' && lenderUser && paymentMethod && (
                  <BorrowConfirmation
                    requestId={requestId}
                    lenderName={lenderUser.name}
                    amount={amount}
                    paymentMethod={paymentMethod}
                  />
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Direct Add Money Flow */
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">💰 Direct Add Money</h2>
                    <p className="text-sm opacity-90">
                      {directStep === 'initial' && 'Enter amount to add'}
                      {directStep === 'payment-method' && 'Select payment method'}
                      {directStep === 'digital-options' && 'Choose digital payment option'}
                      {directStep === 'confirmation' && 'Request submitted successfully'}
                    </p>
                  </div>
                  <button
                    onClick={resetForm}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {directStep === 'initial' && (
                  <DirectAddInitial
                    onContinue={handleDirectInitialContinue}
                    onBack={resetForm}
                  />
                )}

                {directStep === 'payment-method' && (
                  <PaymentMethodSelection
                    amount={amount}
                    bonus={bonus}
                    totalCredit={totalCredit}
                    currency={currency}
                    onContinue={handleDirectPaymentMethodContinue}
                    onBack={() => setDirectStep('initial')}
                  />
                )}

                {directStep === 'digital-options' && (
                  <DigitalPaymentOptions
                    amount={amount}
                    bonus={bonus}
                    totalCredit={totalCredit}
                    currency={currency}
                    onContinue={handleDigitalOptionContinue}
                    onBack={() => setDirectStep('payment-method')}
                  />
                )}

                {directStep === 'confirmation' && (
                  <DirectAddConfirmation
                    requestId={requestId}
                    amount={amount}
                    bonus={bonus}
                    totalCredit={totalCredit}
                    currency={currency}
                    paymentType={
                      directPaymentMethod === 'cash' 
                        ? 'cash' 
                        : digitalOption === 'qr-code' 
                        ? 'qr-code' 
                        : 'bank-details'
                    }
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

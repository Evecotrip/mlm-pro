'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import { ArrowLeft, Wallet, HandCoins, X, Loader2, CreditCard, ArrowRight, Clock } from 'lucide-react';
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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
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
    setCurrency('INR'); // Always use INR
    setDirectStep('payment-method');
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
      // Create add money request with new API
      const requestResponse = await createAddMoneyRequest({
        amount: parseFloat(amount),
        method: method,
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 selection:bg-blue-500/30 transition-colors duration-300">
      <Navbar onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8 relative">
        {/* Background Effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[100px]"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
              <button
                onClick={() => router.push('/wallet')}
                className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Wallet</span>
              </button>
             
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
              Add Money to Wallet
            </h1>
            <p className="text-slate-600 dark:text-slate-400">Choose your preferred method to add funds securely</p>
          </div>

          {!selectedMethod ? (
            /* Method Selection */
            <div className="grid md:grid-cols-2 gap-6">
              {/* Borrow Money */}
              <button
                onClick={() => router.push('/borrow-add-money')}
                className="group relative bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-left transition-all hover:scale-[1.02] hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 overflow-hidden shadow-sm dark:shadow-none"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 border border-purple-200 dark:border-purple-500/20 group-hover:border-purple-500/50 transition-colors">
                    <HandCoins className="w-8 h-8 text-purple-600 dark:text-purple-500" />
                  </div>

                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Borrow from User</h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Request funds directly from another platform user. Perfect for peer-to-peer transfers.
                  </p>

                  <div className="flex items-center gap-2 text-sm font-bold text-purple-600 dark:text-purple-500">
                    Select Method <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>

              {/* Direct Add */}
              <button
                onClick={() => router.push('/direct-add-money')}
                className="group relative bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-left transition-all hover:scale-[1.02] hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10 overflow-hidden shadow-sm dark:shadow-none"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 to-teal-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-200 dark:border-emerald-500/20 group-hover:border-emerald-500/50 transition-colors">
                    <Wallet className="w-8 h-8 text-emerald-600 dark:text-emerald-500" />
                  </div>

                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Direct Deposit</h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Add funds directly using bank transfer, UPI, or other digital payment methods.
                  </p>

                  <div className="flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-500">
                    Select Method <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            </div>
          ) : selectedMethod === 'borrow' ? (
            /* Borrow Money Flow */
            <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm dark:shadow-none">
              {/* Header */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Borrow Money Request</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {borrowStep === 'lender-details' && 'Enter lender details and amount'}
                    {borrowStep === 'payment-method' && 'Select payment method'}
                    {borrowStep === 'payment-details' && 'Provide payment details'}
                    {borrowStep === 'confirmation' && 'Request submitted successfully'}
                  </p>
                </div>
                <button
                  onClick={resetForm}
                  className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
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
          ) : (
            /* Direct Add Money Flow */
            <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm dark:shadow-none">
              {/* Header */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Direct Add Money</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {directStep === 'initial' && 'Enter amount to add'}
                    {directStep === 'payment-method' && 'Select payment method'}
                    {directStep === 'digital-options' && 'Choose digital payment option'}
                    {directStep === 'confirmation' && 'Request submitted successfully'}
                  </p>
                </div>
                <button
                  onClick={resetForm}
                  className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
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
          )}
        </div>
      </main>
    </div>
  );
}

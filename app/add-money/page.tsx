'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Wallet, HandCoins, X } from 'lucide-react';
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

type AddMoneyMethod = 'borrow' | 'direct' | null;
type BorrowStep = 'lender-details' | 'payment-method' | 'payment-details' | 'confirmation';
type DirectStep = 'initial' | 'payment-method' | 'digital-options' | 'details' | 'confirmation';

export default function AddMoneyPage() {
  const router = useRouter();
  const { isAuthenticated, currentUser, logout } = useAuth();
  
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

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (currentUser && !currentUser.isApproved) {
      router.push('/queue');
    }
  }, [isAuthenticated, currentUser, router]);

  if (!currentUser) {
    return null;
  }

  const handleLogout = () => {
    logout();
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
  const handleDirectInitialContinue = (directAmount: string) => {
    setAmount(directAmount);
    const amountValue = parseFloat(directAmount);
    // No bonus calculation - totalCredit equals amount
    setBonus(0);
    setTotalCredit(amountValue);
    setDirectStep('payment-method');
  };

  const handleDirectPaymentMethodContinue = (method: DirectPaymentMethod) => {
    setDirectPaymentMethod(method);
    if (method === 'digital') {
      setDirectStep('digital-options');
    } else {
      // For cash, submit directly
      setLoading(true);
      setTimeout(() => {
        const reqId = 'CR' + Date.now();
        setRequestId(reqId);
        setLoading(false);
        setDirectStep('confirmation');
      }, 1500);
    }
  };

  const handleDigitalOptionContinue = (option: DigitalOption) => {
    setDigitalOption(option);
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const reqId = option === 'qr-code' ? 'QR' + Date.now() : 'BD' + Date.now();
      setRequestId(reqId);
      setLoading(false);
      setDirectStep('confirmation');
    }, 1500);
  };

  const resetForm = () => {
    setSelectedMethod(null);
    setBorrowStep('lender-details');
    setLenderUser(null);
    setAmount('');
    setPaymentMethod(null);
    setRequestId('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
      <Navbar
        currentUser={currentUser}
        walletBalance={walletBalance}
        pendingRequestsCount={pendingReferrals.length}
        onLogout={handleLogout}
      />

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => router.push('/wallet')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Wallet</span>
          </button>
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
              onClick={() => setSelectedMethod('borrow')}
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
              onClick={() => setSelectedMethod('direct')}
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
                    onContinue={handleDirectPaymentMethodContinue}
                    onBack={() => setDirectStep('initial')}
                  />
                )}

                {directStep === 'digital-options' && (
                  <DigitalPaymentOptions
                    amount={amount}
                    bonus={bonus}
                    totalCredit={totalCredit}
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

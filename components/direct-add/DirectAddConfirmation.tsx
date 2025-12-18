'use client';

import { CheckCircle, Download, MessageCircle, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DirectAddConfirmationProps {
  requestId: string;
  amount: string;
  bonus: number;
  totalCredit: number;
  currency: string;
  paymentType: 'cash' | 'qr-code' | 'bank-details';
}

export default function DirectAddConfirmation({
  requestId,
  amount,
  bonus,
  totalCredit,
  currency,
  paymentType
}: DirectAddConfirmationProps) {
  const router = useRouter();

  const getPaymentMethodText = () => {
    switch (paymentType) {
      case 'cash':
        return 'Cash Payment';
      case 'qr-code':
        return 'QR Code Payment';
      case 'bank-details':
        return 'Bank Transfer';
      default:
        return 'Digital Payment';
    }
  };

  const getStatusText = () => {
    switch (paymentType) {
      case 'cash':
        return 'Pending Contact';
      case 'qr-code':
        return 'Pending Approval';
      case 'bank-details':
        return 'Pending Approval';
      default:
        return 'Pending';
    }
  };

  const getNextStepsText = () => {
    switch (paymentType) {
      case 'cash':
        return 'Our team will contact you within 24 hours to arrange cash collection. Please keep the cash ready.';
      case 'qr-code':
        return 'You will receive the QR code once approved by the platform owner. You can then make the payment via UPI.';
      case 'bank-details':
        return 'You will receive bank account details once approved by the platform owner. You can then transfer the amount.';
      default:
        return 'You will be notified about the next steps.';
    }
  };

  return (
    <div className="text-center py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Success Icon */}
      <div className="relative w-24 h-24 mx-auto mb-6">
        <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="relative w-full h-full bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/10">
          <CheckCircle className="w-12 h-12 text-emerald-500" />
        </div>
      </div>

      {/* Success Message */}
      <div>
        <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Request Submitted</h3>
        <p className="text-slate-600 dark:text-slate-400">
          {paymentType === 'cash' ? 'We will contact you within 24 hours' : 'Your request has been sent to the platform owner'}
        </p>
      </div>

      {/* Request Details */}
      <div className="bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-left max-w-md mx-auto relative overflow-hidden shadow-sm">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 text-sm">Request ID</span>
            <span className="font-bold text-slate-700 dark:text-slate-300 font-mono text-sm">{requestId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 text-sm">Amount ({currency})</span>
            <span className="font-bold text-slate-900 dark:text-white">{parseFloat(amount).toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 text-sm">Total Credit</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xl">{totalCredit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} INR</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 text-sm">Payment Method</span>
            <span className="font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-sm">
              {getPaymentMethodText()}
            </span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-slate-500 text-sm">Status</span>
            <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-500 border border-yellow-200 dark:border-yellow-500/20 rounded-full text-xs font-bold uppercase tracking-wide">
              {getStatusText()}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">Submitted</span>
            <span className="text-slate-600 dark:text-slate-400">{new Date().toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Next Steps Info */}
      <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-5 max-w-md mx-auto text-left">
        <p className="text-sm text-blue-700 dark:text-blue-300/90 leading-relaxed">
          <strong className="text-blue-800 dark:text-blue-400 block mb-1">What's Next?</strong>
          {getNextStepsText()}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto pt-4">
        <button
          onClick={() => router.push('/my-add-money-requests')}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/40"
        >
          <MessageCircle className="w-5 h-5" />
          Track Request
        </button>
        <button
          onClick={() => router.push('/dashboard')}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl font-bold transition-colors"
        >
          Dashboard
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Download Receipt Option */}
      <button className="text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium text-sm flex items-center gap-2 mx-auto transition-colors group">
        <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
        Download Receipt
      </button>
    </div>
  );
}

'use client';

import { CheckCircle, Download, MessageCircle, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BorrowConfirmationProps {
  requestId: string;
  lenderName: string;
  amount: string;
  paymentMethod: 'soft-cash' | 'hard-cash';
}

export default function BorrowConfirmation({ requestId, lenderName, amount, paymentMethod }: BorrowConfirmationProps) {
  const router = useRouter();

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
        <p className="text-slate-600 dark:text-slate-400">Your borrow request has been sent to the lender.</p>
      </div>

      {/* Request Details */}
      <div className="bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-left max-w-md mx-auto relative overflow-hidden shadow-sm">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-emerald-500"></div>
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 text-sm">Request ID</span>
            <span className="font-bold text-slate-700 dark:text-slate-300 font-mono text-sm">{requestId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 text-sm">Lender</span>
            <span className="font-bold text-slate-900 dark:text-white">{lenderName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 text-sm">Amount</span>
            <span className="font-bold text-purple-600 dark:text-purple-400 text-xl">₹{parseFloat(amount).toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 text-sm">Method</span>
            <span className="font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-sm">
              {paymentMethod === 'soft-cash' ? 'Soft Cash (Digital)' : 'Hard Cash (Physical)'}
            </span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-slate-500 text-sm">Status</span>
            <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-500 border border-yellow-200 dark:border-yellow-500/20 rounded-full text-xs font-bold uppercase tracking-wide">
              Awaiting Approval
            </span>
          </div>
        </div>
      </div>

      {/* Info Message */}
      <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-5 max-w-md mx-auto text-left">
        <p className="text-sm text-blue-700 dark:text-blue-300/90 leading-relaxed">
          <strong className="text-blue-800 dark:text-blue-400 block mb-1">What's Next?</strong>
          You will be notified once the lender responds to your request.
          {paymentMethod === 'soft-cash'
            ? ' If approved, the lender will transfer money to your bank account.'
            : ' If approved, you will receive the lender\'s contact details to coordinate cash collection.'
          }
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto pt-4">
        <button
          onClick={() => router.push('/my-borrow-requests')}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-600/20 hover:shadow-purple-600/40"
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

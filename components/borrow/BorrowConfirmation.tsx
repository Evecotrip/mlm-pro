'use client';

import { CheckCircle, Download, MessageCircle } from 'lucide-react';
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
    <div className="text-center py-8 space-y-6">
      {/* Success Icon */}
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-12 h-12 text-green-600" />
      </div>

      {/* Success Message */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">✓ Borrow Request Submitted</h3>
        <p className="text-gray-600">Your request has been sent to the lender.</p>
      </div>

      {/* Request Details */}
      <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 text-left max-w-md mx-auto">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Request ID:</span>
            <span className="font-bold text-gray-900 font-mono">{requestId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Lender:</span>
            <span className="font-bold text-gray-900">{lenderName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Amount:</span>
            <span className="font-bold text-purple-600 text-lg">₹{parseFloat(amount).toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Method:</span>
            <span className="font-semibold text-gray-900">
              {paymentMethod === 'soft-cash' ? 'Soft Cash (Digital)' : 'Hard Cash (Physical)'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
              Awaiting Approval
            </span>
          </div>
        </div>
      </div>

      {/* Info Message */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 max-w-md mx-auto">
        <p className="text-sm text-blue-800">
          <strong>What's Next?</strong><br />
          You will be notified once the lender responds to your request.
          {paymentMethod === 'soft-cash' 
            ? ' If approved, the lender will transfer money to your bank account.'
            : ' If approved, you will receive the lender\'s contact details to coordinate cash collection.'
          }
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <button
          onClick={() => router.push('/money-requests')}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          Track Request
        </button>
        <button
          onClick={() => router.push('/dashboard')}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-colors"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Download Receipt Option */}
      <button className="text-purple-600 hover:text-purple-700 font-semibold text-sm flex items-center gap-2 mx-auto">
        <Download className="w-4 h-4" />
        Download Receipt
      </button>
    </div>
  );
}

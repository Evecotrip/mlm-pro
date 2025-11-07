'use client';

import { CheckCircle, Download, MessageCircle, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DirectAddConfirmationProps {
  requestId: string;
  amount: string;
  bonus: number;
  totalCredit: number;
  paymentType: 'cash' | 'qr-code' | 'bank-details';
}

export default function DirectAddConfirmation({ 
  requestId, 
  amount, 
  bonus, 
  totalCredit, 
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
    <div className="text-center py-8 space-y-6">
      {/* Success Icon */}
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-12 h-12 text-green-600" />
      </div>

      {/* Success Message */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">✓ Request Submitted Successfully</h3>
        <p className="text-gray-600">
          {paymentType === 'cash' ? 'We will contact you within 24 hours' : 'Your request has been sent to the platform owner'}
        </p>
      </div>

      {/* Request Details */}
      <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 text-left max-w-md mx-auto">
        <p className="text-sm font-semibold text-gray-600 mb-4">Request Details:</p>
        <div className="space-y-3 border-t-2 border-gray-300 pt-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Request ID:</span>
            <span className="font-bold text-gray-900 font-mono">{requestId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Amount:</span>
            <span className="font-bold text-gray-900">₹{parseFloat(amount).toLocaleString('en-IN')}</span>
          </div>
          {/*
          {bonus > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Bonus:</span>
              <span className="font-semibold text-green-600">+₹{bonus.toLocaleString('en-IN')}</span>
            </div>
          )}
            */}
          <div className="flex justify-between">
            <span className="text-gray-600">Total Credit:</span>
            <span className="font-bold text-green-600 text-lg">₹{totalCredit.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Method:</span>
            <span className="font-semibold text-gray-900">{getPaymentMethodText()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
              {getStatusText()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Submitted:</span>
            <span className="text-gray-900">{new Date().toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Next Steps Info */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 max-w-md mx-auto">
        <p className="text-sm text-blue-800">
          <strong>What's Next?</strong><br />
          {getNextStepsText()}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <button
          onClick={() => router.push('/money-requests')}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors"
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
      <button className="text-green-600 hover:text-green-700 font-semibold text-sm flex items-center gap-2 mx-auto">
        <Download className="w-4 h-4" />
        Download Receipt
      </button>
    </div>
  );
}

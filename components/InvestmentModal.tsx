'use client';

import { X } from 'lucide-react';
import { User } from '@/lib/mockData';
import InvestmentForm from './InvestmentForm';

interface InvestmentModalProps {
  onClose: () => void;
  currentUser: User;
  onSuccess: () => void;
}

export default function InvestmentModal({ onClose, currentUser, onSuccess }: InvestmentModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">New Investment</h2>
              <p className="text-blue-100 text-sm mt-1">Create a new investment request</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <InvestmentForm 
            currentUser={currentUser} 
            onSuccess={() => {
              onSuccess();
              setTimeout(() => onClose(), 2000);
            }} 
          />
        </div>
      </div>
    </div>
  );
}

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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 relative">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        {/* Header */}
        <div className="sticky top-0 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 p-6 z-10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">New Investment</h2>
            <p className="text-slate-400 text-sm mt-1">Create a new investment request</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors border border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 relative z-0">
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

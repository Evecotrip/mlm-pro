'use client';

import { useState } from 'react';
import { AlertCircle, MapPin, Phone, Loader2 } from 'lucide-react';

export interface AddressDetails {
  fullAddress: string;
  city: string;
  state: string;
  pinCode: string;
  primaryPhone: string;
  secondaryPhone: string;
  bestTime: string;
  remarks: string;
}

interface AddressDetailsFormProps {
  onSubmit: (details: AddressDetails) => void;
  onBack: () => void;
  loading?: boolean;
}

export default function AddressDetailsForm({ onSubmit, onBack, loading = false }: AddressDetailsFormProps) {
  const [addressDetails, setAddressDetails] = useState<AddressDetails>({
    fullAddress: '',
    city: '',
    state: '',
    pinCode: '',
    primaryPhone: '',
    secondaryPhone: '',
    bestTime: '',
    remarks: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');

    if (!addressDetails.fullAddress || !addressDetails.city ||
      !addressDetails.state || !addressDetails.pinCode || !addressDetails.primaryPhone) {
      setError('Please fill all required fields');
      return;
    }

    if (addressDetails.pinCode.length !== 6) {
      setError('PIN code must be 6 digits');
      return;
    }

    if (addressDetails.primaryPhone.length !== 10) {
      setError('Primary phone must be 10 digits');
      return;
    }

    onSubmit(addressDetails);
  };

  return (
    <div className="space-y-8">
      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-4">
        <p className="text-sm text-blue-600 dark:text-blue-400">
          <strong className="text-blue-700 dark:text-blue-300">Note:</strong> Provide your contact details for cash collection. The lender will coordinate with you.
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Full Address *
          </label>
          <textarea
            value={addressDetails.fullAddress}
            onChange={(e) => setAddressDetails({ ...addressDetails, fullAddress: e.target.value })}
            placeholder="Enter your complete address"
            rows={3}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
            disabled={loading}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
              City *
            </label>
            <input
              type="text"
              value={addressDetails.city}
              onChange={(e) => setAddressDetails({ ...addressDetails, city: e.target.value })}
              placeholder="e.g., Bangalore"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
              State *
            </label>
            <input
              type="text"
              value={addressDetails.state}
              onChange={(e) => setAddressDetails({ ...addressDetails, state: e.target.value })}
              placeholder="e.g., Karnataka"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
              PIN Code *
            </label>
            <input
              type="text"
              value={addressDetails.pinCode}
              onChange={(e) => setAddressDetails({ ...addressDetails, pinCode: e.target.value })}
              placeholder="6-digit PIN"
              maxLength={6}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-mono placeholder:font-sans placeholder:text-slate-400 dark:placeholder:text-slate-600"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Primary Phone Number *
            </label>
            <div className="flex gap-3">
              <span className="px-3 py-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 dark:text-slate-400 font-medium">
                +91
              </span>
              <input
                type="text"
                value={addressDetails.primaryPhone}
                onChange={(e) => setAddressDetails({ ...addressDetails, primaryPhone: e.target.value })}
                placeholder="10-digit number"
                maxLength={10}
                className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-mono placeholder:font-sans placeholder:text-slate-400 dark:placeholder:text-slate-600"
                disabled={loading}
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
              Secondary Phone Number (Optional)
            </label>
            <div className="flex gap-3">
              <span className="px-3 py-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 dark:text-slate-400 font-medium">
                +91
              </span>
              <input
                type="text"
                value={addressDetails.secondaryPhone}
                onChange={(e) => setAddressDetails({ ...addressDetails, secondaryPhone: e.target.value })}
                placeholder="10-digit number"
                maxLength={10}
                className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-mono placeholder:font-sans placeholder:text-slate-400 dark:placeholder:text-slate-600"
                disabled={loading}
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
              Best Time to Contact
            </label>
            <input
              type="text"
              value={addressDetails.bestTime}
              onChange={(e) => setAddressDetails({ ...addressDetails, bestTime: e.target.value })}
              placeholder="e.g., 6 PM - 8 PM, Weekends"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
              disabled={loading}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
              Remarks (Optional)
            </label>
            <textarea
              value={addressDetails.remarks}
              onChange={(e) => setAddressDetails({ ...addressDetails, remarks: e.target.value })}
              placeholder="Any additional information..."
              rows={2}
              maxLength={200}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
              disabled={loading}
            />
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 text-right">{addressDetails.remarks.length}/200 characters</p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          onClick={onBack}
          disabled={loading}
          className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl font-bold transition-colors disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-600/20 hover:shadow-purple-600/40 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting...
            </span>
          ) : (
            'Submit Request'
          )}
        </button>
      </div>
    </div>
  );
}

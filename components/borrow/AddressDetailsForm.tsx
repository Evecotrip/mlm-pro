'use client';

import { useState } from 'react';
import { AlertCircle, MapPin, Phone } from 'lucide-react';

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
    <div className="space-y-6">
      {/* Info Box */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Provide your contact details for cash collection. The lender will coordinate with you.
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Full Address *
          </label>
          <textarea
            value={addressDetails.fullAddress}
            onChange={(e) => setAddressDetails({...addressDetails, fullAddress: e.target.value})}
            placeholder="Enter your complete address"
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-gray-900 resize-none"
            disabled={loading}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              City *
            </label>
            <input
              type="text"
              value={addressDetails.city}
              onChange={(e) => setAddressDetails({...addressDetails, city: e.target.value})}
              placeholder="e.g., Bangalore"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-gray-900"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              State *
            </label>
            <input
              type="text"
              value={addressDetails.state}
              onChange={(e) => setAddressDetails({...addressDetails, state: e.target.value})}
              placeholder="e.g., Karnataka"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-gray-900"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              PIN Code *
            </label>
            <input
              type="text"
              value={addressDetails.pinCode}
              onChange={(e) => setAddressDetails({...addressDetails, pinCode: e.target.value})}
              placeholder="6-digit PIN"
              maxLength={6}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-gray-900 font-mono"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Primary Phone Number *
            </label>
            <div className="flex gap-2">
              <span className="px-3 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl text-gray-700 font-semibold">
                +91
              </span>
              <input
                type="text"
                value={addressDetails.primaryPhone}
                onChange={(e) => setAddressDetails({...addressDetails, primaryPhone: e.target.value})}
                placeholder="10-digit number"
                maxLength={10}
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-gray-900 font-mono"
                disabled={loading}
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Secondary Phone Number (Optional)
            </label>
            <div className="flex gap-2">
              <span className="px-3 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl text-gray-700 font-semibold">
                +91
              </span>
              <input
                type="text"
                value={addressDetails.secondaryPhone}
                onChange={(e) => setAddressDetails({...addressDetails, secondaryPhone: e.target.value})}
                placeholder="10-digit number"
                maxLength={10}
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-gray-900 font-mono"
                disabled={loading}
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Best Time to Contact
            </label>
            <input
              type="text"
              value={addressDetails.bestTime}
              onChange={(e) => setAddressDetails({...addressDetails, bestTime: e.target.value})}
              placeholder="e.g., 6 PM - 8 PM, Weekends"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-gray-900"
              disabled={loading}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Remarks (Optional)
            </label>
            <textarea
              value={addressDetails.remarks}
              onChange={(e) => setAddressDetails({...addressDetails, remarks: e.target.value})}
              placeholder="Any additional information..."
              rows={2}
              maxLength={200}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-gray-900 resize-none"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">{addressDetails.remarks.length}/200 characters</p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          disabled={loading}
          className="flex-1 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-bold transition-colors disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold transition-all shadow-lg disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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

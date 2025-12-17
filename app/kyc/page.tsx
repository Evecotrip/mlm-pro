'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import {
  ArrowLeft, Upload, CheckCircle2, XCircle, Camera,
  CreditCard, Loader2, AlertCircle, Shield,
  Eye, Trash2
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import {
  getKYCStatus,
  uploadDocument,
  submitKYC,
  deleteDocument,
  KYCStatus,
  DocumentType,
  KYCResponse,
  getKYCStatusColor,
  getDocumentTypeName,
  validateAadhaarNumber,
  validateIFSCCode,
  validateAccountNumber,
  validateFile,
  getKYCCompletionPercentage,
  formatKYCDate,
} from '@/api/kyc-api';

export default function KYCPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  
  const [kycData, setKycData] = useState<KYCResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState<DocumentType | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form data
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  
  const hasFetchedData = useRef(false);

  // Check authentication
  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.push('/login');
    }
  }, [isLoaded, user, router]);

  // Fetch KYC status on mount
  useEffect(() => {
    if (!user?.id || hasFetchedData.current) return;
    
    hasFetchedData.current = true;
    fetchKYCStatus();
  }, [user?.id]);

  const fetchKYCStatus = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await getKYCStatus();
      
      if (response.success && response.data) {
        setKycData(response.data);
        
        // Pre-fill form if data exists
        if (response.data.documents.aadhaar?.number) {
          setAadhaarNumber(response.data.documents.aadhaar.number);
        }
        if (response.data.documents.bankDetails) {
          setAccountNumber(response.data.documents.bankDetails.accountNumber);
          setIfscCode(response.data.documents.bankDetails.ifscCode);
          setAccountHolderName(response.data.documents.bankDetails.accountHolderName);
        }
      }
    } catch (error) {
      console.error('Error fetching KYC status:', error);
      setError('Failed to load KYC status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file: File, documentType: DocumentType) => {
    setError('');
    setSuccess('');
    
    // Validate file
    const validation = validateFile(file);
    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return;
    }
    
    setUploading(documentType);
    
    try {
      const response = await uploadDocument(file, documentType);
      
      if (response.success) {
        setSuccess(`${getDocumentTypeName(documentType)} uploaded successfully!`);
        // Refresh KYC status
        await fetchKYCStatus();
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.message || response.error || 'Failed to upload document');
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      setError('Network error while uploading document');
    } finally {
      setUploading(null);
    }
  };

  const handleDeleteDocument = async (documentType: DocumentType) => {
    if (!confirm(`Delete ${getDocumentTypeName(documentType)}?`)) return;
    
    setError('');
    
    try {
      const response = await deleteDocument(documentType);
      
      if (response.success) {
        setSuccess('Document deleted successfully');
        await fetchKYCStatus();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.message || 'Failed to delete document');
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      setError('Failed to delete document');
    }
  };

  const handleSubmitKYC = async () => {
    setError('');
    setSuccess('');
    
    // Validate all fields
    const aadhaarValidation = validateAadhaarNumber(aadhaarNumber);
    if (!aadhaarValidation.isValid) {
      setError(aadhaarValidation.errors.join(', '));
      return;
    }
    
    const accountValidation = validateAccountNumber(accountNumber);
    if (!accountValidation.isValid) {
      setError(accountValidation.errors.join(', '));
      return;
    }
    
    const ifscValidation = validateIFSCCode(ifscCode);
    if (!ifscValidation.isValid) {
      setError(ifscValidation.errors.join(', '));
      return;
    }
    
    if (!accountHolderName.trim()) {
      setError('Account holder name is required');
      return;
    }
    
    // Check if required documents are uploaded (Aadhaar front, back, and selfie)
    if (!kycData?.documents.aadhaar?.frontImage || !kycData?.documents.aadhaar?.backImage || !kycData?.documents.selfie) {
      setError('Please upload Aadhaar (front & back) and Selfie before submitting');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const response = await submitKYC({
        aadhaarNumber: aadhaarNumber.replace(/[\s-]/g, ''),
        accountNumber: accountNumber.replace(/\s/g, ''),
        ifscCode: ifscCode.toUpperCase().trim(),
        accountHolderName: accountHolderName.trim(),
      });
      
      if (response.success) {
        setSuccess('KYC submitted successfully! Your documents are under review.');
        await fetchKYCStatus();
      } else {
        setError(response.message || 'Failed to submit KYC');
      }
    } catch (error) {
      console.error('Error submitting KYC:', error);
      setError('Network error while submitting KYC');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading KYC status...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isKYCApproved = kycData?.status === KYCStatus.APPROVED;
  const isKYCPending = kycData?.status === KYCStatus.PENDING;
  const isKYCRejected = kycData?.status === KYCStatus.REJECTED;
  const canEdit = !isKYCApproved && !isKYCPending;
  const completionPercentage = kycData ? getKYCCompletionPercentage(kycData.documents) : 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar onLogout={handleLogout} />
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                <Shield className="w-8 h-8 text-blue-500" />
                KYC Verification
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Complete your KYC to start investing
              </p>
            </div>
            
            {kycData && (
              <div className="text-right">
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${getKYCStatusColor(kycData.status)}`}>
                  {kycData.status === KYCStatus.APPROVED && <CheckCircle2 className="w-4 h-4" />}
                  {kycData.status === KYCStatus.PENDING && <Loader2 className="w-4 h-4 animate-spin" />}
                  {kycData.status === KYCStatus.REJECTED && <XCircle className="w-4 h-4" />}
                  {kycData.status}
                </span>
                {kycData.verifiedAt && (
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                    Verified: {formatKYCDate(kycData.verifiedAt)}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* KYC Approved Message */}
        {isKYCApproved && (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-1">
                  KYC Verified Successfully!
                </h3>
                <p className="text-emerald-700 dark:text-emerald-300 text-sm">
                  Your KYC has been approved. You can now make investments and perform all transactions.
                </p>
                <button
                  onClick={() => router.push('/new-investment')}
                  className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Start Investing
                </button>
              </div>
            </div>
          </div>
        )}

        {/* KYC Pending Message */}
        {isKYCPending && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center shrink-0">
                <Loader2 className="w-6 h-6 text-yellow-600 dark:text-yellow-400 animate-spin" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                  KYC Under Review
                </h3>
                <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                  Your KYC documents are being reviewed by our team. This usually takes 24-48 hours.
                  We'll notify you once the verification is complete.
                </p>
                {kycData.submittedAt && (
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                    Submitted: {formatKYCDate(kycData.submittedAt)}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* KYC Rejected Message */}
        {isKYCRejected && kycData.rejectionReason && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center shrink-0">
                <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-1">
                  KYC Rejected
                </h3>
                <p className="text-red-700 dark:text-red-300 text-sm mb-2">
                  {kycData.rejectionReason}
                </p>
                <p className="text-red-600 dark:text-red-400 text-sm">
                  Please update your documents and resubmit for verification.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {!isKYCApproved && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Completion Progress
              </span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                {completionPercentage}%
              </span>
            </div>
            <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 mb-6 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">{success}</p>
          </div>
        )}

        {/* Document Upload Section */}
        {!isKYCApproved && (
          <div className="space-y-6">
            {/* Aadhaar Card */}
            <DocumentUploadCard
              title="Aadhaar Card"
              description="Upload both front and back side of your Aadhaar card"
              icon={<CreditCard className="w-6 h-6" />}
              documents={[
                {
                  type: DocumentType.AADHAAR_FRONT,
                  label: 'Front Side',
                  uploaded: kycData?.documents.aadhaar?.frontImage,
                },
                {
                  type: DocumentType.AADHAAR_BACK,
                  label: 'Back Side',
                  uploaded: kycData?.documents.aadhaar?.backImage,
                },
              ]}
              onUpload={handleFileUpload}
              onDelete={handleDeleteDocument}
              uploading={uploading}
              canEdit={canEdit}
            />

            {/* Selfie */}
            <DocumentUploadCard
              title="Selfie"
              description="Upload a clear selfie holding your Aadhaar card"
              icon={<Camera className="w-6 h-6" />}
              documents={[
                {
                  type: DocumentType.SELFIE,
                  label: 'Selfie with Aadhaar',
                  uploaded: kycData?.documents.selfie,
                },
              ]}
              onUpload={handleFileUpload}
              onDelete={handleDeleteDocument}
              uploading={uploading}
              canEdit={canEdit}
            />

            {/* Form Details */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Personal & Bank Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Aadhaar Number */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                    Aadhaar Number
                  </label>
                  <input
                    type="text"
                    value={aadhaarNumber}
                    onChange={(e) => setAadhaarNumber(e.target.value)}
                    placeholder="1234 5678 9012"
                    maxLength={14}
                    disabled={!canEdit}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Account Holder Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    value={accountHolderName}
                    onChange={(e) => setAccountHolderName(e.target.value)}
                    placeholder="John Doe"
                    disabled={!canEdit}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Account Number */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="123456789012"
                    disabled={!canEdit}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* IFSC Code */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                    placeholder="SBIN0001234"
                    maxLength={11}
                    disabled={!canEdit}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                </div>
            </div>

            {/* Submit Button */}
            {canEdit && (
              <button
                onClick={handleSubmitKYC}
                disabled={submitting || completionPercentage < 100}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting KYC...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Submit KYC for Verification
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// Document Upload Card Component
interface DocumentUploadCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  documents: {
    type: DocumentType;
    label: string;
    uploaded?: any;
  }[];
  onUpload: (file: File, type: DocumentType) => void;
  onDelete: (type: DocumentType) => void;
  uploading: DocumentType | null;
  canEdit: boolean;
}

function DocumentUploadCard({
  title,
  description,
  icon,
  documents,
  onUpload,
  onDelete,
  uploading,
  canEdit,
}: DocumentUploadCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center shrink-0 text-blue-600 dark:text-blue-400">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
            {title}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {description}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {documents.map((doc) => (
          <div key={doc.type} className="flex items-center gap-3">
            <div className="flex-1">
              {doc.uploaded ? (
                <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                        {doc.label}
                      </p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400">
                        Uploaded successfully
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={doc.uploaded.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                      title="View document"
                    >
                      <Eye className="w-4 h-4" />
                    </a>
                    {canEdit && (
                      <button
                        onClick={() => onDelete(doc.type)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Delete document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <label className={`flex items-center justify-center gap-2 p-3 border-2 border-dashed rounded-lg transition-all ${
                  canEdit
                    ? 'border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 cursor-pointer bg-slate-50 dark:bg-slate-950 hover:bg-blue-50 dark:hover:bg-blue-900/10'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 cursor-not-allowed opacity-50'
                }`}>
                  {uploading === doc.type ? (
                    <>
                      <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        Uploading...
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 text-slate-400" />
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Upload {doc.label}
                      </span>
                    </>
                  )}
                  {canEdit && (
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          onUpload(file, doc.type);
                        }
                        e.target.value = '';
                      }}
                      className="hidden"
                      disabled={uploading === doc.type}
                    />
                  )}
                </label>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

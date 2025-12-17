/**
 * KYC API
 * Handles KYC document uploads, submission, and verification
 * MLM Investment Platform
 */

import { getTokenFromCookies } from "./register-user-api";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// ============================================
// TYPE DEFINITIONS
// ============================================

/**
 * KYC status enum
 */
export enum KYCStatus {
  NOT_SUBMITTED = 'NOT_SUBMITTED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

/**
 * Document types for KYC
 */
export enum DocumentType {
  AADHAAR_FRONT = 'AADHAAR_FRONT',
  AADHAAR_BACK = 'AADHAAR_BACK',
  PAN_CARD = 'PAN_CARD',
  SELFIE = 'SELFIE',
  BANK_PROOF = 'BANK_PROOF',
  ADDRESS_PROOF = 'ADDRESS_PROOF',
}

/**
 * Address proof types
 */
export enum AddressProofType {
  ELECTRICITY_BILL = 'ELECTRICITY_BILL',
  WATER_BILL = 'WATER_BILL',
  TELEPHONE_BILL = 'TELEPHONE_BILL',
  BANK_STATEMENT = 'BANK_STATEMENT',
  RENTAL_AGREEMENT = 'RENTAL_AGREEMENT',
}

/**
 * Single document structure
 */
export interface KYCDocument {
  type: DocumentType;
  url: string;
  publicId: string; // Cloudinary public ID for deletion
  uploadedAt: string;
  verified?: boolean;
  rejectionReason?: string;
}

/**
 * Complete KYC documents structure (stored in JSON)
 */
export interface KYCDocuments {
  aadhaar?: {
    number: string; // Masked: XXXX-XXXX-1234
    frontImage: KYCDocument;
    backImage: KYCDocument;
  };
  pan?: {
    number: string; // Format: ABCDE1234F
    image: KYCDocument;
  };
  selfie?: KYCDocument;
  bankDetails?: {
    accountNumber: string; // Masked: XXXX1234
    ifscCode: string;
    accountHolderName: string;
    proofImage: KYCDocument;
  };
  addressProof?: {
    type: AddressProofType;
    image: KYCDocument;
  };
}

/**
 * KYC submission request
 */
export interface SubmitKYCRequest {
  aadhaarNumber: string;
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  panNumber?: string;
  addressProofType?: AddressProofType;
}

/**
 * Upload document request
 */
export interface UploadDocumentRequest {
  documentType: DocumentType;
  file: File;
}

/**
 * KYC response
 */
export interface KYCResponse {
  userId: string;
  status: KYCStatus;
  documents: KYCDocuments;
  verifiedAt?: string | null;
  rejectionReason?: string | null;
  submittedAt?: string;
  canResubmit: boolean;
}

/**
 * Admin KYC review request
 */
export interface ReviewKYCRequest {
  userId: string;
  action: 'APPROVE' | 'REJECT';
  rejectionReason?: string;
  documentIssues?: {
    documentType: DocumentType;
    issue: string;
  }[];
}

/**
 * Pending KYC list item
 */
export interface PendingKYCItem {
  userId: string;
  userName: string;
  email: string;
  phone: string;
  referralCode: string;
  submittedAt: string;
  documentsCount: number;
  allDocumentsUploaded: boolean;
}

/**
 * Paginated KYC list
 */
export interface PaginatedKYCList {
  kycs: PendingKYCItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * KYC statistics
 */
export interface KYCStats {
  total: number;
  notSubmitted: number;
  pending: number;
  approved: number;
  rejected: number;
  expired: number;
  approvalRate: number; // percentage
  averageApprovalTime: number; // in hours
}

/**
 * Document validation result
 */
export interface DocumentValidation {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

/**
 * KYC activity log
 */
export interface KYCActivityLog {
  userId: string;
  action: string;
  performedBy: string;
  timestamp: string;
  details: any;
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * 1. Upload Aadhaar Front
 */
export async function uploadAadhaarFront(file: File): Promise<ApiResponse<KYCDocument>> {
  try {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', DocumentType.AADHAAR_FRONT);

    const response = await fetch(`${BASE_URL}/api/v1/kyc/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getTokenFromCookies()}`,
      },
      body: formData,
    });

    return await response.json();
  } catch (error) {
    console.error('Error uploading Aadhaar front');
    return {
      success: false,
      error: 'Failed to upload Aadhaar front image',
    };
  }
}

/**
 * 2. Upload Aadhaar Back
 */
export async function uploadAadhaarBack(file: File): Promise<ApiResponse<KYCDocument>> {
  try {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', DocumentType.AADHAAR_BACK);

    const response = await fetch(`${BASE_URL}/api/v1/kyc/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getTokenFromCookies()}`,
      },
      body: formData,
    });

    return await response.json();
  } catch (error) {
    console.error('Error uploading Aadhaar back');
    return {
      success: false,
      error: 'Failed to upload Aadhaar back image',
    };
  }
}

/**
 * 3. Upload PAN Card
 */
export async function uploadPanCard(file: File): Promise<ApiResponse<KYCDocument>> {
  try {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', DocumentType.PAN_CARD);

    const response = await fetch(`${BASE_URL}/api/v1/kyc/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getTokenFromCookies()}`,
      },
      body: formData,
    });

    return await response.json();
  } catch (error) {
    console.error('Error uploading PAN card');
    return {
      success: false,
      error: 'Failed to upload PAN card image',
    };
  }
}

/**
 * 4. Upload Selfie
 */
export async function uploadSelfie(file: File): Promise<ApiResponse<KYCDocument>> {
  try {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', DocumentType.SELFIE);

    const response = await fetch(`${BASE_URL}/api/v1/kyc/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getTokenFromCookies()}`,
      },
      body: formData,
    });

    return await response.json();
  } catch (error) {
    console.error('Error uploading selfie');
    return {
      success: false,
      error: 'Failed to upload selfie',
    };
  }
}

/**
 * 5. Upload Bank Proof
 */
export async function uploadBankProof(file: File): Promise<ApiResponse<KYCDocument>> {
  try {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', DocumentType.BANK_PROOF);

    const response = await fetch(`${BASE_URL}/api/v1/kyc/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getTokenFromCookies()}`,
      },
      body: formData,
    });

    return await response.json();
  } catch (error) {
    console.error('Error uploading bank proof');
    return {
      success: false,
      error: 'Failed to upload bank proof',
    };
  }
}

/**
 * 6. Upload Address Proof
 */
export async function uploadAddressProof(file: File): Promise<ApiResponse<KYCDocument>> {
  try {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', DocumentType.ADDRESS_PROOF);

    const response = await fetch(`${BASE_URL}/api/v1/kyc/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getTokenFromCookies()}`,
      },
      body: formData,
    });

    return await response.json();
  } catch (error) {
    console.error('Error uploading address proof');
    return {
      success: false,
      error: 'Failed to upload address proof',
    };
  }
}

/**
 * Generic upload function for any document type
 */
export async function uploadDocument(
  file: File,
  documentType: DocumentType
): Promise<ApiResponse<KYCDocument>> {
  try {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', documentType);

    const response = await fetch(`${BASE_URL}/api/v1/kyc/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getTokenFromCookies()}`,
      },
      body: formData,
    });

    return await response.json();
  } catch (error) {
    console.error(`Error uploading ${documentType}`);
    return {
      success: false,
      error: `Failed to upload ${documentType}`,
    };
  }
}

/**
 * 7. Submit KYC for Review
 */
export async function submitKYC(data: SubmitKYCRequest): Promise<ApiResponse<KYCResponse>> {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/kyc/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getTokenFromCookies()}`,
      },
      body: JSON.stringify(data),
    });

    return await response.json();
  } catch (error) {
    console.error('Error submitting KYC');
    return {
      success: false,
      error: 'Failed to submit KYC for review',
    };
  }
}

/**
 * 8. Get KYC Status
 */
export async function getKYCStatus(): Promise<ApiResponse<KYCResponse>> {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/kyc/status`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getTokenFromCookies()}`,
      },
    });

    return await response.json();
  } catch (error) {
    console.error('Error fetching KYC status');
    return {
      success: false,
      error: 'Failed to fetch KYC status',
    };
  }
}

/**
 * 9. Delete Document
 */
export async function deleteDocument(documentType: DocumentType): Promise<ApiResponse> {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/kyc/document/${documentType}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getTokenFromCookies()}`,
      },
    });

    return await response.json();
  } catch (error) {
    console.error(`Error deleting ${documentType}`);
    return {
      success: false,
      error: `Failed to delete ${documentType}`,
    };
  }
}

/**
 * 10. Get KYC submissions from your referrals (pending)
 */
export async function getMyReferralsPendingKYC(
  page: number = 1,
  limit: number = 20
): Promise<ApiResponse<PaginatedKYCList>> {
  try {
    const response = await fetch(
      `${BASE_URL}/api/v1/kyc/my-referrals-pending?page=${page}&limit=${limit}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getTokenFromCookies()}`,
        },
      }
    );

    return await response.json();
  } catch (error) {
    console.error('Error fetching referrals pending KYC');
    return {
      success: false,
      error: 'Failed to fetch pending KYC submissions from referrals',
    };
  }
}

/**
 * 11. Review KYC (Approve/Reject) - For sponsors reviewing their referrals' KYC
 */
export async function reviewKYC(
  userId: string,
  action: 'APPROVE' | 'REJECT',
  rejectionReason?: string
): Promise<ApiResponse<KYCResponse>> {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/kyc/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getTokenFromCookies()}`,
      },
      body: JSON.stringify({
        userId,
        action,
        ...(rejectionReason && { rejectionReason }),
      }),
    });

    return await response.json();
  } catch (error) {
    console.error('Error reviewing KYC');
    return {
      success: false,
      error: 'Failed to review KYC submission',
    };
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get KYC status color for UI
 */
export function getKYCStatusColor(status: KYCStatus): string {
  switch (status) {
    case KYCStatus.NOT_SUBMITTED:
      return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    case KYCStatus.PENDING:
      return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
    case KYCStatus.APPROVED:
      return 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
    case KYCStatus.REJECTED:
      return 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
    case KYCStatus.EXPIRED:
      return 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800';
    default:
      return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';
  }
}

/**
 * Get document type display name
 */
export function getDocumentTypeName(type: DocumentType): string {
  switch (type) {
    case DocumentType.AADHAAR_FRONT:
      return 'Aadhaar Front';
    case DocumentType.AADHAAR_BACK:
      return 'Aadhaar Back';
    case DocumentType.PAN_CARD:
      return 'PAN Card';
    case DocumentType.SELFIE:
      return 'Selfie';
    case DocumentType.BANK_PROOF:
      return 'Bank Proof';
    case DocumentType.ADDRESS_PROOF:
      return 'Address Proof';
    default:
      return type;
  }
}

/**
 * Get address proof type display name
 */
export function getAddressProofTypeName(type: AddressProofType): string {
  switch (type) {
    case AddressProofType.ELECTRICITY_BILL:
      return 'Electricity Bill';
    case AddressProofType.WATER_BILL:
      return 'Water Bill';
    case AddressProofType.TELEPHONE_BILL:
      return 'Telephone Bill';
    case AddressProofType.BANK_STATEMENT:
      return 'Bank Statement';
    case AddressProofType.RENTAL_AGREEMENT:
      return 'Rental Agreement';
    default:
      return type;
  }
}

/**
 * Validate Aadhaar number format
 */
export function validateAadhaarNumber(aadhaar: string): DocumentValidation {
  const errors: string[] = [];
  
  // Remove spaces and dashes
  const cleanAadhaar = aadhaar.replace(/[\s-]/g, '');
  
  if (!cleanAadhaar) {
    errors.push('Aadhaar number is required');
  } else if (!/^\d{12}$/.test(cleanAadhaar)) {
    errors.push('Aadhaar number must be 12 digits');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate PAN number format
 */
export function validatePANNumber(pan: string): DocumentValidation {
  const errors: string[] = [];
  
  const cleanPAN = pan.toUpperCase().trim();
  
  if (!cleanPAN) {
    errors.push('PAN number is required');
  } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(cleanPAN)) {
    errors.push('Invalid PAN format. Format: ABCDE1234F');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate IFSC code format
 */
export function validateIFSCCode(ifsc: string): DocumentValidation {
  const errors: string[] = [];
  
  const cleanIFSC = ifsc.toUpperCase().trim();
  
  if (!cleanIFSC) {
    errors.push('IFSC code is required');
  } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(cleanIFSC)) {
    errors.push('Invalid IFSC format. Format: SBIN0001234');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate account number
 */
export function validateAccountNumber(accountNumber: string): DocumentValidation {
  const errors: string[] = [];
  
  const cleanAccount = accountNumber.replace(/\s/g, '');
  
  if (!cleanAccount) {
    errors.push('Account number is required');
  } else if (!/^\d{9,18}$/.test(cleanAccount)) {
    errors.push('Account number must be 9-18 digits');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate file size (max 5MB)
 */
export function validateFileSize(file: File, maxSizeMB: number = 5): DocumentValidation {
  const errors: string[] = [];
  const maxBytes = maxSizeMB * 1024 * 1024;
  
  if (file.size > maxBytes) {
    errors.push(`File size must be less than ${maxSizeMB}MB`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate file type (images only)
 */
export function validateFileType(file: File): DocumentValidation {
  const errors: string[] = [];
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (!allowedTypes.includes(file.type)) {
    errors.push('Only JPG, PNG, and WEBP images are allowed');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate complete file upload
 */
export function validateFile(file: File): DocumentValidation {
  const errors: string[] = [];
  
  const sizeValidation = validateFileSize(file);
  const typeValidation = validateFileType(file);
  
  errors.push(...sizeValidation.errors);
  errors.push(...typeValidation.errors);
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Check if all required documents are uploaded (Aadhaar front, back, and Selfie)
 */
export function areAllDocumentsUploaded(documents: KYCDocuments): boolean {
  return !!(
    documents.aadhaar?.frontImage &&
    documents.aadhaar?.backImage &&
    documents.selfie
  );
}

/**
 * Get uploaded documents count (only required: Aadhaar front, back, Selfie)
 */
export function getUploadedDocumentsCount(documents: KYCDocuments): number {
  let count = 0;
  
  if (documents.aadhaar?.frontImage) count++;
  if (documents.aadhaar?.backImage) count++;
  if (documents.selfie) count++;
  
  return count;
}

/**
 * Get missing documents list (only required: Aadhaar front, back, Selfie)
 */
export function getMissingDocuments(documents: KYCDocuments): DocumentType[] {
  const missing: DocumentType[] = [];
  
  if (!documents.aadhaar?.frontImage) missing.push(DocumentType.AADHAAR_FRONT);
  if (!documents.aadhaar?.backImage) missing.push(DocumentType.AADHAAR_BACK);
  if (!documents.selfie) missing.push(DocumentType.SELFIE);
  
  return missing;
}

/**
 * Format date for display
 */
export function formatKYCDate(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Mask Aadhaar number
 */
export function maskAadhaarNumber(aadhaar: string): string {
  const clean = aadhaar.replace(/[\s-]/g, '');
  if (clean.length !== 12) return aadhaar;
  
  return `XXXX-XXXX-${clean.slice(-4)}`;
}

/**
 * Mask account number
 */
export function maskAccountNumber(accountNumber: string): string {
  const clean = accountNumber.replace(/\s/g, '');
  if (clean.length < 4) return accountNumber;
  
  return `XXXX${clean.slice(-4)}`;
}

/**
 * Can user submit KYC?
 */
export function canSubmitKYC(kycData: KYCResponse): boolean {
  return (
    kycData.status === KYCStatus.NOT_SUBMITTED ||
    (kycData.status === KYCStatus.REJECTED && kycData.canResubmit)
  ) && areAllDocumentsUploaded(kycData.documents);
}

/**
 * Get KYC completion percentage
 */
export function getKYCCompletionPercentage(documents: KYCDocuments): number {
  const total = 3; // Total required documents (Aadhaar front, back, Selfie)
  const uploaded = getUploadedDocumentsCount(documents);
  
  return Math.round((uploaded / total) * 100);
}

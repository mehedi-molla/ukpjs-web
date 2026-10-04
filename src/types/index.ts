export type Language = 'bn' | 'en';

export type UserRole = 'super_admin' | 'admin' | 'member';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  memberId?: string;
  avatarUrl?: string;
  createdAt: string;
}

export type IslamicFundType = 
  | 'general_hadiya'     // সাধারণ হাদিয়া
  | 'monthly_donation'   // মাসিক অনুদান
  | 'project_donation'   // প্রকল্প অনুদান
  | 'zakat'              // যাকাত তহবিল
  | 'sadaqah'            // সদকাহ
  | 'special_campaign'   // বিশেষ ক্যাম্পেইন
  | 'emergency_fund';    // জরুরি তহবিল

export type TransactionType = 'income' | 'expense';

export type PaymentMethod = 'cash' | 'bkash' | 'nagad' | 'rocket' | 'bank' | 'other';

export type TransactionStatus = 'completed' | 'pending' | 'cancelled';

export interface Transaction {
  id: string;
  voucherNo: string;           // e.g. UKPJS-2026-000001
  type: TransactionType;
  fundType: IslamicFundType;
  categoryId: string;
  categoryName: string;
  amount: number;
  date: string;
  projectId?: string;
  projectName?: string;
  memberId?: string;
  memberName?: string;
  donorName?: string;          // If non-member or anonymous
  isAnonymous?: boolean;
  paymentMethod: PaymentMethod;
  referenceNo?: string;        // TrxID / Check no / Voucher
  description: string;
  paidTo?: string;             // For expense
  enteredBy: string;
  receiptUrl?: string;
  status: TransactionStatus;
  createdAt: string;
}

export type ProjectStatus = 'upcoming' | 'running' | 'completed' | 'paused';

export interface Project {
  id: string;
  code: string;                // e.g. PRJ-01
  slug: string;
  titleBn: string;
  titleEn: string;
  category: string;
  shortDescBn: string;
  shortDescEn: string;
  fullDescBn: string;
  fullDescEn: string;
  featuredImage: string;
  galleryImages: string[];
  videoUrl?: string;
  startDate: string;
  expectedEndDate?: string;
  actualEndDate?: string;
  estimatedBudget: number;
  collectedAmount?: number;
  expenseAmount?: number;
  status: ProjectStatus;
  location: string;
  responsibleMembers: string[];
  beneficiariesCount?: number;
  beneficiaryInfoBn?: string;
  beneficiaryInfoEn?: string;
  isPublished: boolean;
  isFeatured: boolean;
  completionOutcomeBn?: string;
  completionOutcomeEn?: string;
  createdAt: string;
}

export interface Member {
  id: string;
  memberId: string;            // e.g. MEM-001
  nameBn: string;
  nameEn: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  addressBn: string;
  addressEn: string;
  village: string;
  country: string;
  city?: string;
  designationBn?: string;
  designationEn?: string;
  role?: string;
  photoUrl?: string;
  occupationBn?: string;
  occupationEn?: string;
  memberType: 'general' | 'executive' | 'probashi' | 'advisor' | 'lifetime';
  monthlyPledgeAmount: number; // প্রতি মাসে প্রতিশ্রুত চাঁদা/হাদিয়া
  joiningDate: string;
  isActive: boolean;
  avatarUrl?: string;
  isPublicProfile: boolean;
  notes?: string;
  createdAt: string;
}

export type MonthlyDonationStatus = 'paid' | 'partial' | 'pending';

export interface MonthlyDonation {
  id: string;
  memberId: string;
  memberName: string;
  month: number;               // 1 - 12
  year: number;
  expectedAmount: number;
  paidAmount: number;
  paymentDate?: string;
  paymentMethod?: PaymentMethod;
  transactionId?: string;
  voucherNo?: string;
  status: MonthlyDonationStatus;
  notes?: string;
  updatedAt: string;
}

export type ContactCategory = 
  | 'chairman'
  | 'ward_member'
  | 'women_member'
  | 'police'
  | 'ambulance'
  | 'microbus'
  | 'driver'
  | 'auto_driver'
  | 'auto_cng'
  | 'autorickshaw'
  | 'doctor'
  | 'hospital'
  | 'pharmacy'
  | 'fire_service'
  | 'electrician'
  | 'plumber'
  | 'mechanic'
  | 'blood_donor'
  | 'imam'
  | 'muezzin'
  | 'teacher'
  | 'emergency_service'
  | 'chairman_member'
  | 'other'
  | string;

export interface ContactCategoryItem {
  id: string;
  slug: string;
  nameBn: string;
  nameEn: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
  isCore?: boolean;
  descriptionBn?: string;
}

export interface ImportantContact {
  id: string;
  categoryId?: string;
  category: ContactCategory;
  categoryNameBn: string;
  categoryNameEn?: string;
  nameBn: string;
  nameEn: string;
  designationBn?: string;
  designationEn?: string;
  phone: string;
  altPhone?: string;
  whatsapp?: string;
  addressBn?: string;
  addressEn?: string;
  area?: string;
  ward?: string;
  unionName?: string;
  institutionName?: string;
  vehicleDetails?: string;
  vehicleType?: string;
  vehicleModel?: string;
  vehicleNumber?: string;
  seatingCapacity?: string;
  isAc?: boolean;
  serviceAreaBn?: string;
  serviceAreaEn?: string;
  isEmergency: boolean;
  availabilityBn?: string;
  availabilityEn?: string;
  mapUrl?: string;
  descriptionBn?: string;
  descriptionEn?: string;
  photoUrl?: string;
  vehiclePhotoUrl?: string;
  driverName?: string;
  driverPhotoUrl?: string;
  isFeatured?: boolean;
  isVerified?: boolean;
  lastVerifiedAt?: string;
  isPublished?: boolean;
  isDemoPlaceholder?: boolean;
  sortOrder?: number;
  notes?: string;
}

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';

export interface BloodDonor {
  id: string;
  name?: string;
  nameBn: string;
  nameEn: string;
  bloodGroup: BloodGroup;
  area?: string;
  areaBn?: string;
  areaEn?: string;
  phone: string;
  lastDonationDate?: string;
  isAvailable: boolean;
  isPublic?: boolean;
}

export interface CommitteeMember {
  id: string;
  memberId?: string;
  nameBn: string;
  nameEn: string;
  designationBn: string;
  designationEn: string;
  termYear: string;           // e.g. 2025-2027
  committeeType: 'executive' | 'advisory' | 'probashi_council';
  sortOrder: number;
  photoUrl?: string;
  phone?: string;
  locationBn?: string;
  locationEn?: string;
  isActive: boolean;
}

export interface Notice {
  id: string;
  titleBn: string;
  titleEn: string;
  contentBn: string;
  contentEn: string;
  publishDate?: string;
  date?: string;
  category?: string;
  publishedBy?: string;
  expiryDate?: string;
  isPinned: boolean;
  isActive: boolean;
  attachmentUrl?: string;
  createdAt?: string;
}

export type WelfareStatus = 'submitted' | 'under_review' | 'verified' | 'approved' | 'rejected' | 'disbursed' | 'pending';
export type WelfareCategory = 'medical' | 'food' | 'education' | 'shelter_repair' | 'debt_relief' | 'marriage_help' | 'emergency_repair' | 'other';

export interface WelfareRequest {
  id: string;
  trackingNo?: string;
  applicantName: string;
  guardianName?: string;
  phone: string;
  village: string;
  assistanceType?: string;
  category?: string;
  description: string;
  requestedAmount: number;
  approvedAmount?: number;
  status: WelfareStatus;
  verificationNotes?: string;
  adminNotes?: string;
  reviewedBy?: string;
  disbursedDate?: string;
  createdAt: string;
}

export interface WebsiteSettings {
  orgNameBn: string;
  orgNameEn: string;
  sloganBn: string;
  sloganEn: string;
  establishedYear: number;
  logoUrl?: string;
  address?: string;
  addressBn: string;
  addressEn: string;
  contactPhone: string;
  contactEmail: string;
  whatsappNumber: string;
  facebookUrl: string;
  youtubeUrl: string;
  missionBn: string;
  missionEn: string;
  visionBn: string;
  visionEn: string;
  aboutHistoryBn: string;
  aboutHistoryEn: string;
  donationInstructionsBn: string;
  donationInstructionsEn: string;
  bkashNumber: string;
  nagadNumber: string;
  rocketNumber: string;
  bankAccountDetails: string;
  currencySymbol: string;
  isPublicTransparencyEnabled: boolean;
}

export interface AuditLog {
  id: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
  action: string;
  module?: string;
  entityType?: string;
  entityId?: string;
  recordId?: string;
  details?: string;
  timestamp: string;
  ip?: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  currentBalance: number;
  totalGeneralHadiya: number;
  totalMonthlyDonation: number;
  totalProjectDonation: number;
  totalZakat: number;
  totalSadaqah: number;
  thisMonthIncome: number;
  thisMonthExpense: number;
  lastMonthIncome: number;
  lastMonthExpense: number;
}

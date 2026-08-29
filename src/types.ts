export type TabType = 
  | 'home' 
  | 'genealogy' 
  | 'news'
  | 'forum'
  | 'profile'
  | 'diwan' 
  | 'fund' 
  | 'council' 
  | 'heritage' 
  | 'directory'
  | 'admin';

export interface FamilyBranch {
  id: string;
  name: string;
  lineage: string;
  origin: string;
  rootFather: string;
  geographicalSpread: string[];
  description: string;
  historicalEra: string;
  notableFigures: string[];
  subBranchesCount: number;
  badgeColor?: string;
}

export interface LineagePerson {
  id: string;
  name: string;
  title?: string;
  generation: number;
  fatherId?: string;
  branch: string;
  birthYearHijri?: string;
  location?: string;
  bio?: string;
  children?: string[];
  isFamous?: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  category: 'أخبار التجمع' | 'قرارات المجلس' | 'إنجازات وتكريم' | 'ملتقيات وفعاليات' | 'مبادرات مجتمعية';
  date: string;
  summary: string;
  content: string;
  author: string;
  readTime: string;
  likes: number;
  userLiked?: boolean;
  isPinned?: boolean;
  image?: string;
  tags?: string[];
  commentsCount?: number;
}

export interface EventItem {
  id: string;
  title: string;
  category: 'لقاء عائلي عام' | 'ملتقى شبابي' | 'ندوة تاريخية وتراثية' | 'تكريم المتفوقين' | 'مجلس ديوان دوري' | 'ورشة عمل وتدريب';
  dateGregorian: string;
  dateHijri: string;
  time: string;
  city: string;
  locationName: string;
  addressDetails: string;
  mapCoordinates?: string;
  description: string;
  agenda?: string[];
  organizer: string;
  organizerRole: string;
  maxAttendees?: number;
  confirmedAttendeesCount: number;
  isUserAttending?: boolean;
  image?: string;
  status: 'قادمة ومتاحة للتسجيل' | 'مكتملة الأعداد' | 'جارية الآن' | 'انتهت بنجاح';
}

export interface UserAchievement {
  id: string;
  title: string;
  category: 'تفوق أكاديمي' | 'إنجاز مهني' | 'خدمة مجتمعية وتطوع' | 'حفظ وتلاوة القرآن' | 'براءة اختراع وابتكار' | 'تكريم وجائزة رسمية';
  yearHijri: string;
  yearGregorian?: string;
  issuer: string;
  description: string;
  badgeIcon?: string;
  verified?: boolean;
}

export interface PersonalTreeNode {
  id: string;
  name: string;
  relation: 'صاحب الملف' | 'الأب' | 'الجد الأول' | 'الجد الثاني' | 'الجد الثالث' | 'الابن' | 'الابنة' | 'الحفيد' | 'الزوجة / الزوج';
  birthYear?: string;
  occupation?: string;
  location?: string;
  notes?: string;
}

export interface UserProfile {
  id: string;
  membershipNumber: string;
  fullName: string;
  kunyaOrTitle: string; // e.g. "أبو هاشم" / "المهندس الشريف"
  avatarUrl?: string;
  branch: string;
  subClan: string;
  generation: number;
  bio: string;
  occupation: string;
  organization?: string;
  city: string;
  country: string;
  
  // Optional contact info & privacy
  phone?: string;
  email?: string;
  showPhonePublicly: boolean;
  showEmailPublicly: boolean;
  whatsapp?: string;
  linkedin?: string;
  xTwitter?: string;
  
  joinDateHijri: string;
  isVerifiedLineage: boolean;
  lineageChainSummary: string; // سلسلة النسب حتى الإمام الحسن/الحسين/هاشم
  
  // Custom Family Tree Nodes
  personalTree: PersonalTreeNode[];
  
  // Achievements & Contributions
  achievements: UserAchievement[];
  
  // Community stats
  contributionsCount: number;
  forumPostsCount: number;
  eventsAttendedCount: number;
}

export type ForumCategoryType = 
  | 'التاريخ والتوثيق العائلي'
  | 'الأنشطة الاجتماعية والتكافل'
  | 'استشارات وتوجيه'
  | 'المبادرات الشبابية وريادة الأعمال'
  | 'ملتقى الأدب والتراث والشعر';

export interface ForumReply {
  id: string;
  topicId: string;
  authorId: string;
  authorName: string;
  authorTitle: string;
  authorBranch: string;
  authorAvatar?: string;
  authorVerified: boolean;
  content: string;
  createdAt: string;
  likes: number;
  userLiked?: boolean;
  isModeratorReply?: boolean;
}

export interface ForumTopic {
  id: string;
  title: string;
  category: ForumCategoryType;
  authorId: string;
  authorName: string;
  authorTitle: string;
  authorBranch: string;
  authorAvatar?: string;
  authorVerified: boolean;
  content: string;
  tags: string[];
  createdAt: string;
  viewsCount: number;
  likesCount: number;
  userLiked?: boolean;
  repliesCount: number;
  isPinned: boolean;
  isLocked: boolean;
  isOfficial: boolean; // وسم موثق من المشرفين
  lastActivity: string;
  replies?: ForumReply[];
}

export interface ForumNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'reply' | 'like' | 'mention' | 'moderation' | 'system';
  topicId?: string;
}

export type NoticeCategory = 'أفراح وزواج' | 'مولود جديد' | 'تخرج وتفوق' | 'ترقية وتكريم' | 'تعزية ومواساة' | 'مجلس وديوان';

export interface DiwanNotice {
  id: string;
  category: NoticeCategory;
  title: string;
  personName: string;
  familyBranch: string;
  city: string;
  content: string;
  date: string;
  blessingsCount: number;
  userBlessed?: boolean;
  comments?: Array<{
    id: string;
    author: string;
    text: string;
    date: string;
  }>;
}

export interface FundProject {
  id: string;
  title: string;
  category: 'صندوق الطالب الهاشمي' | 'تيسير الزواج' | 'إعانة الأسر المتعففة' | 'وقف بني هاشم' | 'الرعاية الصحية';
  targetAmount: number;
  raisedAmount: number;
  beneficiariesCount: number;
  description: string;
  status: 'نشط ومستمر' | 'مكتمل' | 'مرحلة ثانية';
  urgency: 'عالي' | 'متوسط' | 'اعتيادي';
}

export interface HeritageItem {
  id: string;
  title: string;
  type: 'مخطوطة تاريخية' | 'مشجر نسب' | 'كتاب توثيقي' | 'وثيقة وقفية' | 'ديوان شعري';
  author: string;
  century: string;
  description: string;
  extract: string;
  archivedAt: string;
  pagesCount: number;
  verifiedBy: string;
}

export interface CouncilMember {
  id: string;
  name: string;
  role: string;
  committee: 'مجلس الأعيان' | 'لجنة الأنساب والتوثيق' | 'لجنة التكافل الاجتماعي' | 'لجنة الشباب والتعليم' | 'الأمانة العامة';
  branch: string;
  location: string;
  bio: string;
  avatarIcon: string;
  contactAvailable?: boolean;
}

export interface RegisteredMember {
  id: string;
  membershipNumber: string;
  fullName: string;
  branch: string;
  subClan?: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  joinDate: string;
  isVerified: boolean;
  generation?: number;
  avatarUrl?: string;
  nationalId?: string;
  title?: string;
  lineageChainSummary?: string;
  isNonMember?: boolean;
}

export interface IssuedDocument {
  id: string;
  recipientName: string;
  recipientTitle?: string;
  documentType: 'certificate' | 'card' | 'both';
  documentNumber: string;
  branch: string;
  subClan?: string;
  city: string;
  country: string;
  issueDateHijri: string;
  issueDateGregorian: string;
  lineageChainSummary?: string;
  phone?: string;
  nationalId?: string;
  avatarUrl?: string;
  isMember: boolean;
  notes?: string;
  createdAt: string;
}

export interface LineageVerificationRequest {
  id: string;
  applicantName: string;
  nationalId: string;
  phone: string;
  governorate: string;
  claimedBranch: string;
  subClan: string;
  lineageChainText: string;
  ancestorTreeSummary?: string;
  attachedDocuments: string[];
  submissionDate: string;
  status: 'قيد المراجعة والتدقيق' | 'معتمد وموثق' | 'مرفوض لنقص الأدلة' | 'مطلوب وثائق إضافية' | 'approved' | 'rejected' | 'needs_documents';
  reviewerNotes?: string;
  adminNotes?: string;
  assignedGenealogist?: string;
  assignedMembershipNo?: string;
  assignedMembershipNumber?: string;
  reviewedAt?: string;
  reviewerName?: string;
}

export interface AidApplication {
  id: string;
  applicantName: string;
  membershipNo: string;
  branch: string;
  category: string;
  amountRequested: number;
  governorate: string;
  reason: string;
  status: 'تمت الموافقة والصرف' | 'قيد الدراسة' | 'مرفوض' | 'approved' | 'rejected' | string;
  date: string;
  urgency: 'عاجل جداً' | 'عاجل' | 'متوسط' | 'عادي' | string;
  notes?: string;
  requestedAmount?: number;
  approvedAmount?: number;
  reviewedAt?: string;
  reviewerNotes?: string;
}

export interface ShrineItem {
  id: string;
  name: string;
  honoredPerson: string;
  lineage: string;
  governorate: string;
  district: string;
  era: string;
  description: string;
  architecturalFeatures: string;
  visitingTraditions: string;
  coordinates?: string;
  imageUrl?: string;
  category: 'مراقد آل البيت' | 'أقطاب السادة الأشراف' | 'أعلام ومشايخ مصر';
}

export interface GovernorateDistribution {
  id: string;
  name: string;
  region: 'الصعيد ومصر العليا' | 'الوجه البحري والدلتا' | 'القاهرة الكبرى والجيزة' | 'مدن القناة وسيناء' | 'البحر الأحمر والواحات';
  registeredFamiliesCount: number;
  prominentBranches: string[];
  historicalShrines: string[];
  description: string;
  representativeName?: string;
}

export interface GenealogyReference {
  id: string;
  title: string;
  author: string;
  century: string;
  importance: string;
  keyTopics: string[];
  excerpt: string;
}

export interface OfficialDecree {
  id: string;
  decreeNumber: string; // e.g. "قرار رقم (١٢) لسنة ١٤٤٧ هـ"
  decreeType: 'appointment' | 'administrative' | 'honorary' | 'general' | 'committee';
  title: string;
  issueDateHijri: string;
  issueDateGregorian: string;
  signatoryTitle: string;
  signatoryName: string;
  
  // Appointment specific fields
  isAppointment: boolean;
  appointeeName?: string;
  appointeeTitle?: string;
  appointeePhotoUrl?: string;
  appointeePosition?: string;
  appointeeBranch?: string;
  appointeeMembershipNo?: string;
  appointeeCity?: string;

  preamble: string;
  articles: string[];
  notes?: string;
  officialStamp?: boolean;
  createdAt: string;
}


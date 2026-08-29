import React, { useState } from 'react';
import { 
  RegisteredMember, 
  LineageVerificationRequest, 
  AidApplication, 
  FamilyBranch, 
  DiwanNotice,
  UserProfile,
  IssuedDocument
} from '../types';
import { 
  ShieldCheck, 
  Users, 
  FileCheck2, 
  HeartHandshake, 
  Award, 
  Printer, 
  Download, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Eye, 
  FileText, 
  Plus, 
  Sparkles, 
  MapPin, 
  Phone, 
  Mail, 
  ChevronDown, 
  Sliders, 
  BadgeCheck, 
  Send, 
  Lock, 
  Building, 
  RefreshCw,
  GitFork,
  Check,
  Megaphone,
  Layers,
  Database,
  LogOut,
  CreditCard,
  UserPlus,
  Trash2,
  Share2
} from 'lucide-react';

interface AdminDashboardViewProps {
  members: RegisteredMember[];
  branches: FamilyBranch[];
  notices: DiwanNotice[];
  currentUser: UserProfile;
  verificationRequests: LineageVerificationRequest[];
  aidApplications: AidApplication[];
  onApproveVerification: (requestId: string, assignedMembershipNo: string) => void;
  onRejectVerification: (requestId: string, reason: string) => void;
  onRequestMoreDocs: (requestId: string, notes: string) => void;
  onApproveAid: (aidId: string) => void;
  onToggleMemberVerification: (memberId: string) => void;
  onDeleteMember: (memberId: string) => void;
  onAddMember: (member: RegisteredMember) => void;
  onViewMemberCard: (member: RegisteredMember | UserProfile) => void;
  onViewCertificate: (member: RegisteredMember | UserProfile) => void;
  onOpenPersonalTree?: () => void;
  onAdminLogout?: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  members,
  branches,
  notices,
  currentUser,
  verificationRequests,
  aidApplications,
  onApproveVerification,
  onRejectVerification,
  onRequestMoreDocs,
  onApproveAid,
  onToggleMemberVerification,
  onDeleteMember,
  onAddMember,
  onViewMemberCard,
  onViewCertificate,
  onOpenPersonalTree,
  onAdminLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'issuance' | 'verifications' | 'members' | 'aid' | 'registry'>('overview');
  
  // Search & Filters for Members
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  
  // Modals inside Admin
  const [selectedRequest, setSelectedRequest] = useState<LineageVerificationRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [moreDocsNote, setMoreDocsNote] = useState('');
  const [actionModalType, setActionModalType] = useState<'approve' | 'reject' | 'moreDocs' | null>(null);
  
  // Broadcast Announcement State
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastContent, setBroadcastContent] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // New Member Manual Form State
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [newMemberForm, setNewMemberForm] = useState({
    fullName: '',
    branch: branches[0]?.name || 'الأشراف الجعافرة (أشراف الصعيد)',
    subClan: '',
    city: 'القاهرة',
    nationalId: '',
    phone: '',
    email: '',
    isVerified: true
  });

  // Non-Member & Direct Certificate/Card Issuance Tool State
  const [issuedDocsList, setIssuedDocsList] = useState<IssuedDocument[]>(() => {
    const saved = localStorage.getItem('bh_issued_docs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'doc-001',
        recipientName: 'الشريف الشيخ محمد بن عبد الله الإدريسي',
        recipientTitle: 'شريف زائر وباحث في الأنساب والتاريخ',
        documentType: 'both',
        documentNumber: 'BH-VIP-1447-0108',
        branch: 'الأشراف الأدارسة الفاسيين',
        subClan: 'البيت الإدريسي',
        city: 'فاس / القاهرة',
        country: 'جمهورية مصر العربية',
        issueDateHijri: '1447/08/20 هـ',
        issueDateGregorian: '2026/08/20 م',
        lineageChainSummary: 'سلسلة شريفة متصلة إلى الإمام إدريس الأكبر بن عبد الله المحض بن الحسن المثنى بن الإمام الحسن السبط رضي الله عنهم، مصدقة ومقيدة من الأمانة العامة.',
        phone: '+20 10 9988 7766',
        nationalId: '28001011409988',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        isMember: false,
        notes: 'شهادة تكريم وبطاقة زيارة شرفية صادرة من الأمانة العامة',
        createdAt: '2026-08-20'
      },
      {
        id: 'doc-002',
        recipientName: 'الشريف الأستاذ طارق بن سالم الباز الهاشمي',
        recipientTitle: 'عضو شرفي وضيف ملتقى الأشراف بمصر',
        documentType: 'both',
        documentNumber: 'BH-VIP-1447-0109',
        branch: 'الأشراف البازات (الشرقية)',
        subClan: 'آل الباز',
        city: 'الزقازيق / الشرقية',
        country: 'جمهورية مصر العربية',
        issueDateHijri: '1447/08/25 هـ',
        issueDateGregorian: '2026/08/25 م',
        lineageChainSummary: 'سلسلة نسب شريفة متصلة وموثقة بسجلات الأشراف البازات بمصر وسيدنا الحسين بن علي رضي الله عنهما.',
        phone: '+20 12 3344 5566',
        nationalId: '28503021301122',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
        isMember: false,
        notes: 'إصدار استثنائي لوفد الأشراف بالوجه البحري',
        createdAt: '2026-08-25'
      }
    ];
  });

  const [docForm, setDocForm] = useState({
    isNonMember: true,
    selectedMemberId: '',
    recipientName: '',
    title: 'الشريف المكرم',
    branch: 'الأشراف الأدارسة الفاسيين',
    subClan: 'البيت الإدريسي',
    city: 'القاهرة',
    country: 'جمهورية مصر العربية',
    documentNumber: `BH-VIP-1447-0${Math.floor(100 + Math.random() * 900)}`,
    documentType: 'both' as 'both' | 'certificate' | 'card',
    issueDateHijri: '1447/08/29 هـ',
    issueDateGregorian: '2026/08/29 م',
    lineageChainSummary: 'سلسلة نسب شريفة متصلة ومحققة إلى الدوحة النبوية المباركة وسيد شباب أهل الجنة وصولاً إلى الجد الجامع هاشم بن عبد مناف.',
    nationalId: '28904121402391',
    phone: '+20 10 1234 5678',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    notes: 'إصدار معتمد مصدق من الأمانة العامة'
  });

  const [docSavedMessage, setDocSavedMessage] = useState(false);

  // Calculate Statistics
  const totalMembers = members.length;
  const verifiedMembers = members.filter(m => m.isVerified).length;
  const pendingRequestsCount = verificationRequests.filter(r => r.status === 'قيد المراجعة والتدقيق').length;
  const pendingAidCount = aidApplications.filter(a => a.status === 'قيد الدراسة').length;
  const totalAidDisbursed = aidApplications
    .filter(a => a.status === 'تمت الموافقة والصرف')
    .reduce((sum, a) => sum + a.amountRequested, 0);

  // Filtered Members
  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.membershipNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.phone && member.phone.includes(searchTerm)) ||
      member.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBranch = selectedBranchFilter === 'all' || member.branch === selectedBranchFilter;
    const matchesVerified = 
      verificationFilter === 'all' || 
      (verificationFilter === 'verified' && member.isVerified) ||
      (verificationFilter === 'unverified' && !member.isVerified);

    return matchesSearch && matchesBranch && matchesVerified;
  });

  const handleCreateMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberForm.fullName.trim()) return;

    const newId = 'm-' + (members.length + 101);
    const newMembershipNumber = `BH-EG-1447-0${members.length + 101}`;

    const created: RegisteredMember = {
      id: newId,
      membershipNumber: newMembershipNumber,
      fullName: newMemberForm.fullName,
      branch: newMemberForm.branch,
      subClan: newMemberForm.subClan || 'الفرع المعتمد',
      city: newMemberForm.city,
      country: 'جمهورية مصر العربية',
      phone: newMemberForm.phone || '+20 10 0000 0000',
      email: newMemberForm.email || 'member@banihashim.org.eg',
      joinDate: '1447/08/29 هـ',
      isVerified: newMemberForm.isVerified,
      nationalId: newMemberForm.nationalId,
      generation: 39
    };

    onAddMember(created);
    setIsAddMemberModalOpen(false);
    setNewMemberForm({
      fullName: '',
      branch: branches[0]?.name || 'الأشراف الجعافرة (أشراف الصعيد)',
      subClan: '',
      city: 'القاهرة',
      nationalId: '',
      phone: '',
      email: '',
      isVerified: true
    });
  };

  // Helper Methods for Direct & Non-Member Document Issuance
  const handleGenerateNewDocNumber = (prefix = 'BH-VIP-1447-') => {
    const randomCode = `${prefix}0${Math.floor(100 + Math.random() * 900)}`;
    setDocForm(prev => ({ ...prev, documentNumber: randomCode }));
  };

  const handleFillFromMember = (memberId: string) => {
    const found = members.find(m => m.id === memberId);
    if (!found) return;
    setDocForm({
      isNonMember: false,
      selectedMemberId: found.id,
      recipientName: found.fullName,
      title: found.title || 'الشريف المكرم',
      branch: found.branch,
      subClan: found.subClan || 'الفرع المعتمد',
      city: found.city,
      country: found.country || 'جمهورية مصر العربية',
      documentNumber: found.membershipNumber,
      documentType: 'both',
      issueDateHijri: found.joinDate || '1447/08/29 هـ',
      issueDateGregorian: '2026/08/29 م',
      lineageChainSummary: found.lineageChainSummary || 'سلسلة نسب شريفة متصلة ومحققة إلى الدوحة النبوية المباركة وسيد شباب أهل الجنة وصولاً إلى الجد الجامع هاشم بن عبد مناف.',
      nationalId: found.nationalId || '28904121402391',
      phone: found.phone || '+20 10 0000 0000',
      avatarUrl: found.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      notes: 'إصدار رسمي لعضو مقيد بالسجل العام'
    });
  };

  const handlePreviewDocCard = (dataToUse = docForm) => {
    const tempMember: RegisteredMember = {
      id: 'doc-card-' + Date.now(),
      membershipNumber: dataToUse.documentNumber,
      fullName: dataToUse.recipientName.trim() || 'الشريف المكرم',
      branch: dataToUse.branch.trim() || 'الأشراف الأدارسة الفاسيين',
      subClan: dataToUse.subClan.trim() || 'البيت الهاشمي',
      city: dataToUse.city.trim() || 'القاهرة',
      country: dataToUse.country.trim() || 'جمهورية مصر العربية',
      phone: dataToUse.phone.trim() || '+20 10 1234 5678',
      email: 'guest@banihashim.org.eg',
      joinDate: dataToUse.issueDateHijri || '1447/08/29 هـ',
      isVerified: true,
      avatarUrl: dataToUse.avatarUrl,
      nationalId: dataToUse.nationalId,
      title: dataToUse.title,
      lineageChainSummary: dataToUse.lineageChainSummary,
      isNonMember: dataToUse.isNonMember
    };
    onViewMemberCard(tempMember);
  };

  const handlePreviewDocCert = (dataToUse = docForm) => {
    const tempMember: RegisteredMember = {
      id: 'doc-cert-' + Date.now(),
      membershipNumber: dataToUse.documentNumber,
      fullName: dataToUse.recipientName.trim() || 'الشريف المكرم',
      branch: dataToUse.branch.trim() || 'الأشراف الأدارسة الفاسيين',
      subClan: dataToUse.subClan.trim() || 'البيت الهاشمي',
      city: dataToUse.city.trim() || 'القاهرة',
      country: dataToUse.country.trim() || 'جمهورية مصر العربية',
      phone: dataToUse.phone.trim() || '+20 10 1234 5678',
      email: 'guest@banihashim.org.eg',
      joinDate: dataToUse.issueDateHijri || '1447/08/29 هـ',
      isVerified: true,
      avatarUrl: dataToUse.avatarUrl,
      nationalId: dataToUse.nationalId,
      title: dataToUse.title,
      lineageChainSummary: dataToUse.lineageChainSummary,
      isNonMember: dataToUse.isNonMember
    };
    onViewCertificate(tempMember);
  };

  const handleSaveIssuedDoc = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!docForm.recipientName.trim()) {
      alert('يرجى كتابة الاسم الكامل للمستفيد');
      return;
    }

    const newDoc: IssuedDocument = {
      id: 'doc-' + Date.now(),
      recipientName: docForm.recipientName,
      recipientTitle: docForm.title,
      documentType: docForm.documentType,
      documentNumber: docForm.documentNumber,
      branch: docForm.branch,
      subClan: docForm.subClan,
      city: docForm.city,
      country: docForm.country,
      issueDateHijri: docForm.issueDateHijri,
      issueDateGregorian: docForm.issueDateGregorian,
      lineageChainSummary: docForm.lineageChainSummary,
      phone: docForm.phone,
      nationalId: docForm.nationalId,
      avatarUrl: docForm.avatarUrl,
      isMember: !docForm.isNonMember,
      notes: docForm.notes,
      createdAt: new Date().toISOString().split('T')[0]
    };

    const updated = [newDoc, ...issuedDocsList];
    setIssuedDocsList(updated);
    localStorage.setItem('bh_issued_docs', JSON.stringify(updated));
    setDocSavedMessage(true);
    setTimeout(() => setDocSavedMessage(false), 3500);
  };

  const handleDeleteIssuedDoc = (docId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الوثيقة من سجل الإصدارات؟')) {
      const updated = issuedDocsList.filter(d => d.id !== docId);
      setIssuedDocsList(updated);
      localStorage.setItem('bh_issued_docs', JSON.stringify(updated));
    }
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastContent) return;
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      setBroadcastTitle('');
      setBroadcastContent('');
    }, 3000);
  };

  const handlePrintRegistry = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Banner & Control Header */}
      <section className="bg-gradient-to-l from-[#064e3b] via-[#0b6e54] to-[#043e2f] text-white rounded-3xl p-6 sm:p-10 shadow-xl border-2 border-[#d4af37] relative overflow-hidden">
        {/* Background Islamic Watermark */}
        <div className="absolute -left-12 -bottom-12 opacity-10 pointer-events-none text-[#d4af37]">
          <ShieldCheck className="w-80 h-80" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#d4af37] text-[#064e3b] text-xs font-black px-3.5 py-1 rounded-full shadow flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                لوحة الإدارة والأمانة العامة
              </span>
              <span className="bg-emerald-800/80 text-emerald-200 border border-emerald-600 text-xs px-3 py-1 rounded-full flex items-center gap-1 font-mono">
                <BadgeCheck className="w-3.5 h-3.5 text-[#d4af37]" />
                صلاحية الإدارة: المشرف العام ولجنة الأنساب
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold font-heritage tracking-wide text-white drop-shadow-md">
              لوحة تحكم السادة الأشراف بني هاشم في مصر
            </h1>
            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-light">
              المنظومة الرقمية الشاملة لتوثيق الأنساب الشريفة، إصدار وتدقيق الكارنيهات والشهادات الرسمية، وإدارة صندوق التكافل والديوان العام.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('issuance')}
              className="bg-[#d4af37] hover:brightness-110 text-[#064e3b] font-black px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs sm:text-sm transition-all cursor-pointer"
            >
              <Award className="w-4 h-4 text-[#064e3b]" />
              <span>إصدار شهادة / كارنيه فوري</span>
            </button>

            <button
              onClick={() => setIsAddMemberModalOpen(true)}
              className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-3.5 py-2.5 rounded-xl shadow flex items-center gap-2 text-xs sm:text-sm transition-all cursor-pointer border border-emerald-600"
            >
              <UserPlus className="w-4 h-4 text-[#d4af37]" />
              <span>إضافة عضو للسجل</span>
            </button>

            <button
              onClick={handlePrintRegistry}
              className="bg-white/10 hover:bg-white/20 border border-[#d4af37]/60 text-white font-bold px-3.5 py-2.5 rounded-xl shadow flex items-center gap-2 text-xs sm:text-sm transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#d4af37]" />
              <span>طباعة السجل</span>
            </button>

            {onAdminLogout && (
              <button
                id="admin-logout-btn"
                onClick={onAdminLogout}
                className="bg-rose-900/80 hover:bg-rose-850 text-rose-100 border border-rose-600/70 font-bold px-3.5 py-2.5 rounded-xl shadow flex items-center gap-1.5 text-xs sm:text-sm transition-all cursor-pointer"
                title="تسجيل الخروج وقفل لوحة الإدارة"
              >
                <LogOut className="w-4 h-4 text-rose-300" />
                <span>خروج الإدارة</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Stat 1: Members */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-[#064e3b] transition-all">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#064e3b] flex items-center justify-center font-bold shrink-0">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#064e3b] font-mono">
              {totalMembers}
            </div>
            <div className="text-xs font-bold text-slate-500">
              إجمالي الأعضاء بالسجل العام
            </div>
            <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
              {verifiedMembers} عضو موثق ومعتمد ({Math.round((verifiedMembers / (totalMembers || 1)) * 100)}%)
            </div>
          </div>
        </div>

        {/* Stat 2: Genealogy Requests */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-[#d4af37] transition-all">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold shrink-0">
            <FileCheck2 className="w-7 h-7" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-amber-800 font-mono">
              {pendingRequestsCount}
            </div>
            <div className="text-xs font-bold text-slate-500">
              طلبات إثبات نسب قيد التدقيق
            </div>
            <div className="text-[10px] text-amber-600 font-bold mt-0.5">
              من مختلف محافظات الصعيد والدلتا
            </div>
          </div>
        </div>

        {/* Stat 3: Solidarity Aid */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-emerald-600 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0">
            <HeartHandshake className="w-7 h-7" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#064e3b] font-mono">
              {totalAidDisbursed.toLocaleString()} <span className="text-xs font-normal text-slate-500">ج.م</span>
            </div>
            <div className="text-xs font-bold text-slate-500">
              مساعدات تكافلية تم صرفها
            </div>
            <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
              {pendingAidCount} طلبات جديدة قيد الدراسة
            </div>
          </div>
        </div>

        {/* Stat 4: Hashemite Branches in Egypt */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-[#064e3b] transition-all">
          <div className="w-14 h-14 rounded-2xl bg-[#fcfbf7] text-[#d4af37] border border-[#d4af37]/40 flex items-center justify-center font-bold shrink-0">
            <Building className="w-7 h-7 text-[#064e3b]" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#064e3b] font-mono">
              {branches.length}
            </div>
            <div className="text-xs font-bold text-slate-500">
              بيوت وفروع هاشمية كبرى في مصر
            </div>
            <div className="text-[10px] text-slate-400 font-bold mt-0.5">
              الجعافرة، الأدارسة، الرفاعية، الباقرية..
            </div>
          </div>
        </div>

      </div>

      {/* Admin Navigation Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-[#064e3b] text-white shadow'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#d4af37]" />
          <span>لوحة المهام والتعاميم</span>
        </button>

        <button
          id="admin-tab-issuance-btn"
          onClick={() => setActiveTab('issuance')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'issuance'
              ? 'bg-[#064e3b] text-white shadow'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Award className="w-4 h-4 text-[#d4af37]" />
          <span>إصدار الشهادات والكارنيهات (للأعضاء وغير الأعضاء)</span>
          {issuedDocsList.length > 0 && (
            <span className="bg-[#d4af37] text-[#064e3b] text-[10px] px-1.5 py-0.5 rounded-full font-mono font-black">
              {issuedDocsList.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('verifications')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer relative ${
            activeTab === 'verifications'
              ? 'bg-[#064e3b] text-white shadow'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <FileCheck2 className="w-4 h-4 text-[#d4af37]" />
          <span>طلبات تحقيق الأنساب</span>
          {pendingRequestsCount > 0 && (
            <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold">
              {pendingRequestsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('members')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'members'
              ? 'bg-[#064e3b] text-white shadow'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4 h-4 text-[#d4af37]" />
          <span>إدارة الأعضاء والكارنيهات والشهادات</span>
        </button>

        <button
          onClick={() => setActiveTab('aid')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'aid'
              ? 'bg-[#064e3b] text-white shadow'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <HeartHandshake className="w-4 h-4 text-[#d4af37]" />
          <span>إدارة صندوق التكافل والمساعدات</span>
        </button>

        <button
          onClick={() => setActiveTab('registry')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'registry'
              ? 'bg-[#064e3b] text-white shadow'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Database className="w-4 h-4 text-[#d4af37]" />
          <span>السجل العام المعتمد والطباعة</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & BROADCAST */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Quick Broadcast Box */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#064e3b] flex items-center justify-center font-bold">
                    <Megaphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-heritage text-lg font-bold text-[#064e3b]">
                      إرسال تعميم رسمي عاجل للأعضاء في مصر
                    </h3>
                    <p className="text-xs text-slate-500">
                      يظهر في شريط الأخبار العاجلة وإشعارات البوابة لكافة السادة الأشراف بني هاشم
                    </p>
                  </div>
                </div>
              </div>

              {broadcastSent && (
                <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>تم إرسال ونشر التعميم الرسمي بنجاح في عموم غرف وتطبيقات التجمع بمصر!</span>
                </div>
              )}

              <form onSubmit={handleSendBroadcast} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    عنوان التعميم أو البيان الرسمي *
                  </label>
                  <input
                    type="text"
                    required
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    placeholder="مثال: بيان الأمانة العامة بشأن موعد انعقاد الملتقى السنوي للأشراف بني هاشم 1447هـ"
                    className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#064e3b] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    نص البيان والقرارات المعتمدة *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={broadcastContent}
                    onChange={(e) => setBroadcastContent(e.target.value)}
                    placeholder="اكتب تفاصيل الإعلان، القرارات الصادرة عن مجلس الأعيان، توجيهات لجان الأنساب أو التكافل..."
                    className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#064e3b] outline-none resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-400">
                    * يتم توثيق التعميم إلكترونياً باسم المشرف العام
                  </span>
                  <button
                    type="submit"
                    className="bg-[#064e3b] hover:bg-[#0b6e54] text-white px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Send className="w-4 h-4 text-[#d4af37]" />
                    <span>اعتماد ونشر البيان</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-gradient-to-br from-[#fcfbf7] to-[#faf5e6] rounded-3xl p-6 border-2 border-[#d4af37]/60 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#064e3b] text-[#d4af37] flex items-center justify-center shadow">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-heritage text-lg font-bold text-[#064e3b]">
                  إجراءات الأمانة السريعة
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  تسهيل طباعة الكارنيهات والشهادات وسلاسل الأنساب دفعة واحدة للاجتماعات والمؤتمرات.
                </p>
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => {
                      if (members[0]) onViewMemberCard(members[0]);
                    }}
                    className="w-full bg-white hover:bg-slate-50 text-[#064e3b] border border-slate-200 p-2.5 rounded-xl text-xs font-bold shadow-sm flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#d4af37]" />
                      معاينة نموذج الكارنيه الرسمي
                    </span>
                    <span className="text-[10px] text-slate-400">3D Flip</span>
                  </button>

                  <button
                    onClick={() => {
                      if (members[0]) onViewCertificate(members[0]);
                    }}
                    className="w-full bg-white hover:bg-slate-50 text-[#064e3b] border border-slate-200 p-2.5 rounded-xl text-xs font-bold shadow-sm flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#d4af37]" />
                      معاينة الشهادة المذهبة المعتمدة
                    </span>
                    <span className="text-[10px] text-slate-400">A4 Print</span>
                  </button>

                  <button
                    onClick={() => {
                      if (onOpenPersonalTree) onOpenPersonalTree();
                    }}
                    className="w-full bg-white hover:bg-slate-50 text-[#064e3b] border border-slate-200 p-2.5 rounded-xl text-xs font-bold shadow-sm flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <GitFork className="w-4 h-4 text-[#d4af37]" />
                      مشجر نسب العائلة التفاعلي
                    </span>
                    <span className="text-[10px] text-slate-400">شجرة نسب</span>
                  </button>
                </div>
              </div>

              <div className="border-t border-amber-200/80 pt-3 text-[11px] text-slate-500 flex items-center justify-between">
                <span>أمانة أنساب مصر</span>
                <span className="font-mono text-emerald-800 font-bold">1447 هـ / 2026 م</span>
              </div>
            </div>

          </div>

          {/* Pending Lineage Verification Requests Summary */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="bg-amber-100 text-amber-900 font-bold text-xs px-2.5 py-1 rounded-lg">
                  عاجل
                </span>
                <h3 className="font-heritage text-lg font-bold text-[#064e3b]">
                  أحدث طلبات إثبات وتحقيق الأنساب بجمهورية مصر العربية
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('verifications')}
                className="text-xs font-bold text-[#064e3b] hover:text-[#0b6e54] underline cursor-pointer"
              >
                عرض كل الطلبات ({verificationRequests.length})
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {verificationRequests.slice(0, 3).map((req) => (
                <div 
                  key={req.id}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 hover:border-amber-400 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        req.status === 'معتمد وموثق'
                          ? 'bg-emerald-100 text-emerald-800'
                          : req.status === 'قيد المراجعة والتدقيق'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {req.status}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {req.submissionDate}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-[#064e3b]">
                      {req.applicantName}
                    </h4>

                    <p className="text-xs text-slate-600 font-medium">
                      الفرع: <span className="text-emerald-800">{req.claimedBranch}</span>
                    </p>

                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {req.lineageChainText}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-bold">
                      المحافظة: {req.governorate}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedRequest(req);
                        setActiveTab('verifications');
                      }}
                      className="bg-[#064e3b] text-[#d4af37] text-[11px] font-bold px-3 py-1 rounded-lg hover:bg-[#0b6e54] cursor-pointer"
                    >
                      فحص والبت
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: ISSUANCE - CERTIFICATES & CARDS FOR NON-MEMBERS & MEMBERS */}
      {activeTab === 'issuance' && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Issuance Form Container */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#d4af37] shadow-xl space-y-6">
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[#064e3b] text-xs font-black bg-[#fcfbf7] border border-[#d4af37] px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                    <Award className="w-3.5 h-3.5 text-[#d4af37]" />
                    أداة التوليد والإصدار المباشر
                  </span>
                  <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-full">
                    متاح للأعضاء وغير الأعضاء
                  </span>
                </div>
                <h2 className="text-xl sm:text-3xl font-bold font-heritage text-[#064e3b]">
                  إصدار الشهادات المعتمدة والكارنيهات الرسمية
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  توليد وطباعة الشهادات والبطاقات الشرفية ببيانات مخصصة وفورية، وتدوين الفروع والبيوت يدوياً
                </p>
              </div>

              {/* Mode Toggle */}
              <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setDocForm(prev => ({ ...prev, isNonMember: true, selectedMemberId: '', documentNumber: `BH-VIP-1447-0${Math.floor(100 + Math.random() * 900)}` }))}
                  className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    docForm.isNonMember 
                      ? 'bg-[#064e3b] text-white shadow' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>إصدار لغير الأعضاء (زائر / وفد / مكرم)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDocForm(prev => ({ ...prev, isNonMember: false }))}
                  className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    !docForm.isNonMember 
                      ? 'bg-[#064e3b] text-white shadow' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>توليد من السجل العام</span>
                </button>
              </div>
            </div>

            {/* Member Selection if member mode */}
            {!docForm.isNonMember && (
              <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 space-y-2 animate-fadeIn">
                <label className="block text-xs font-bold text-[#064e3b]">
                  اختر الشريف المقيد بالسجل لاستيراد بياناته تلقائياً وتعديلها:
                </label>
                <select
                  value={docForm.selectedMemberId}
                  onChange={(e) => handleFillFromMember(e.target.value)}
                  className="w-full p-3 bg-white border border-emerald-300 rounded-xl font-bold text-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-[#064e3b] outline-none"
                >
                  <option value="">-- اختر عضواً من السجل العام ({members.length} عضو) --</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.fullName} - {m.branch} ({m.membershipNumber})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Main Form Fields */}
            <form onSubmit={handleSaveIssuedDoc} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Recipient Full Name */}
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      الاسم الكامل للمستفيد (كما سيظهر في الشهادة والكارنيه) *
                    </label>
                    <span className="text-[10px] text-[#064e3b] font-bold">رباعي أو خماسي</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={docForm.recipientName}
                    onChange={(e) => setDocForm({ ...docForm, recipientName: e.target.value })}
                    placeholder="مثال: الشريف الأستاذ الدكتور أحمد بن محمود بن إسماعيل الجعفري"
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#064e3b] outline-none font-bold text-slate-900 text-sm"
                  />
                </div>

                {/* Title / Honorific */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      الصفة / اللقب التكريمي *
                    </label>
                    <span className="text-[10px] text-slate-500">كتابة يدوية</span>
                  </div>
                  <input
                    type="text"
                    list="titles-datalist"
                    value={docForm.title}
                    onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
                    placeholder="مثال: عضو شرفي / شريف زائر / باحث نسابة"
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#064e3b] outline-none font-bold text-slate-900 text-sm"
                  />
                  <datalist id="titles-datalist">
                    <option value="الشريف المكرم" />
                    <option value="عضو شرفي معتمد" />
                    <option value="شريف زائر من خارج مصر" />
                    <option value="ضيف شرف ملتقى السادة الأشراف" />
                    <option value="باحث ومحقق في علم الأنساب الشريفة" />
                    <option value="مستشار شرفي للأمانة العامة" />
                    <option value="عميد بيت الأشراف" />
                  </datalist>
                </div>

                {/* Branch Name (Free Text / Datalist) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      الفرع الهاشمي (كتابة يدوية حرة) *
                    </label>
                    <span className="text-[10px] text-[#064e3b] font-bold">حرية الكتابة</span>
                  </div>
                  <input
                    type="text"
                    required
                    list="issuance-branch-datalist"
                    value={docForm.branch}
                    onChange={(e) => setDocForm({ ...docForm, branch: e.target.value })}
                    placeholder="اكتب اسم الفرع أو السلالة مباشرة..."
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#064e3b] outline-none font-bold text-slate-900 text-sm"
                  />
                  <datalist id="issuance-branch-datalist">
                    {branches.map(b => (
                      <option key={b.id} value={b.name} />
                    ))}
                    <option value="الأشراف الأدارسة الفاسيين" />
                    <option value="الأشراف السليمانيون" />
                    <option value="الأشراف البازات (الشرقية)" />
                    <option value="الأشراف العزازية" />
                    <option value="الأشراف النمويين" />
                    <option value="الأشراف القواسم" />
                    <option value="الأشراف العباسيون" />
                  </datalist>
                </div>

                {/* Sub Clan */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    البيت أو العشيرة المتفرعة
                  </label>
                  <input
                    type="text"
                    value={docForm.subClan}
                    onChange={(e) => setDocForm({ ...docForm, subClan: e.target.value })}
                    placeholder="مثال: البيت الإدريسي / آل الباز"
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#064e3b] outline-none text-sm"
                  />
                </div>

                {/* City & Country */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    المدينة والمحافظة / الدولة
                  </label>
                  <input
                    type="text"
                    value={docForm.city}
                    onChange={(e) => setDocForm({ ...docForm, city: e.target.value })}
                    placeholder="مثال: القاهرة - جمهورية مصر العربية"
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#064e3b] outline-none text-sm"
                  />
                </div>

                {/* Document Number / Code */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      كود القيد / رقم الوثيقة الرسمي *
                    </label>
                    <button
                      type="button"
                      onClick={() => handleGenerateNewDocNumber(docForm.isNonMember ? 'BH-VIP-1447-' : 'BH-EG-1447-')}
                      className="text-[10px] text-[#064e3b] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-2.5 h-2.5" />
                      توليد كود عشوائي
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={docForm.documentNumber}
                    onChange={(e) => setDocForm({ ...docForm, documentNumber: e.target.value })}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#064e3b] outline-none font-mono font-bold text-slate-900 text-sm"
                  />
                </div>

                {/* Hijri Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    تاريخ الإصدار الهجري
                  </label>
                  <input
                    type="text"
                    value={docForm.issueDateHijri}
                    onChange={(e) => setDocForm({ ...docForm, issueDateHijri: e.target.value })}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#064e3b] outline-none text-sm font-medium"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    رقم الهاتف / الواتساب
                  </label>
                  <input
                    type="text"
                    value={docForm.phone}
                    onChange={(e) => setDocForm({ ...docForm, phone: e.target.value })}
                    placeholder="+20 10 1234 5678"
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#064e3b] outline-none text-sm dir-ltr text-right"
                  />
                </div>

              </div>

              {/* Lineage Verification Formulation Statement */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    صيغة التوثيق وسلسلة النسب (المطبوعة في الشهادة والكارنيه) *
                  </label>
                  <span className="text-[10px] text-slate-500">نص قابل للتعديل بالكامل</span>
                </div>
                <textarea
                  rows={3}
                  required
                  value={docForm.lineageChainSummary}
                  onChange={(e) => setDocForm({ ...docForm, lineageChainSummary: e.target.value })}
                  placeholder="سلسلة نسب شريفة متصلة ومحققة إلى الدوحة النبوية المباركة..."
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#064e3b] outline-none text-xs sm:text-sm leading-relaxed"
                />
              </div>

              {/* Avatar Preset Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  الصورة الشخصية للكارنيه والشهادة:
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <img
                    src={docForm.avatarUrl}
                    alt="معاينة"
                    className="w-12 h-12 rounded-xl object-cover border-2 border-[#d4af37] shadow"
                  />
                  <div className="flex flex-wrap gap-2">
                    {[
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
                      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
                      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
                      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80'
                    ].map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setDocForm({ ...docForm, avatarUrl: url })}
                        className={`w-9 h-9 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                          docForm.avatarUrl === url ? 'border-[#064e3b] ring-2 ring-[#d4af37]' : 'border-slate-200 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={url} alt={`خيار ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={docForm.avatarUrl}
                    onChange={(e) => setDocForm({ ...docForm, avatarUrl: e.target.value })}
                    placeholder="أو الصق رابط صورة مخصص..."
                    className="flex-1 min-w-[200px] text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="bg-gradient-to-r from-[#fafaf7] via-slate-50 to-[#fdfbf7] p-5 rounded-2xl border-2 border-slate-200 flex flex-wrap items-center justify-between gap-4">
                
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">معاينة وطباعة فورية:</span>
                  
                  {/* Print / Preview Card */}
                  <button
                    type="button"
                    onClick={() => handlePreviewDocCard()}
                    className="bg-[#064e3b] hover:bg-[#0b6e54] text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
                  >
                    <CreditCard className="w-4 h-4 text-[#d4af37]" />
                    <span>معاينة وطباعة الكارنيه الرسمي</span>
                  </button>

                  {/* Print / Preview Certificate */}
                  <button
                    type="button"
                    onClick={() => handlePreviewDocCert()}
                    className="bg-[#d4af37] hover:brightness-110 text-[#064e3b] font-black px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
                  >
                    <Award className="w-4 h-4 text-[#064e3b]" />
                    <span>معاينة وطباعة الشهادة المعتمدة</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Check className="w-4 h-4 text-emerald-200" />
                    <span>حفظ وقيد في سجل الوثائق الصادرة</span>
                  </button>
                </div>

              </div>

              {/* Success Notification */}
              {docSavedMessage && (
                <div className="bg-emerald-100 border-2 border-emerald-500 text-emerald-900 p-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>تم حفظ وقيد الوثيقة بنجاح في سجل وأرشيف الوثائق الصادرة للأمانة العامة!</span>
                </div>
              )}

            </form>

          </div>

          {/* Issued Documents Archive Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[#d4af37] text-xs font-bold bg-[#fcfbf7] border border-[#d4af37]/40 px-3 py-1 rounded-full inline-block mb-1">
                  أرشيف الوثائق الرسمية
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-heritage text-[#064e3b]">
                  سجل الشهادات والكارنيهات الصادرة ({issuedDocsList.length})
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  قائمة بكافة الوثائق التي تم إصدارها لغير الأعضاء أو لأعضاء السجل العام مع إمكانية إعادة الطباعة فوراً
                </p>
              </div>
            </div>

            {issuedDocsList.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                <Award className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="font-bold text-slate-600 text-sm">لا توجد وثائق محفوظة حالياً في الأرشيف</p>
                <p className="text-xs text-slate-400">استخدم النموذج أعلاه لتوليد وحفظ الشهادات والكارنيهات لغير الأعضاء</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {issuedDocsList.map((doc) => (
                  <div
                    key={doc.id}
                    className="border-2 border-slate-200 hover:border-[#d4af37] bg-[#fcfbf7]/40 rounded-2xl p-5 space-y-4 transition-all shadow-sm flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={doc.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'}
                            alt={doc.recipientName}
                            className="w-12 h-12 rounded-xl object-cover border-2 border-[#d4af37] shrink-0"
                          />
                          <div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mb-1 ${
                              doc.isMember
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-900 border border-amber-300'
                            }`}>
                              {doc.isMember ? 'عضو مقيد بالسجل' : 'إصدار لغير الأعضاء (شرفي / زائر)'}
                            </span>
                            <h4 className="font-bold text-slate-900 text-sm font-heritage">
                              {doc.recipientName}
                            </h4>
                            <p className="text-xs text-[#064e3b] font-medium">
                              {doc.recipientTitle || 'الشريف المكرم'}
                            </p>
                          </div>
                        </div>

                        <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                          {doc.documentNumber}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-slate-100">
                        <div>
                          <span className="text-slate-400 block text-[10px]">الفرع والنسب:</span>
                          <span className="font-bold text-slate-700">{doc.branch}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">البيت أو العشيرة:</span>
                          <span className="font-bold text-slate-700">{doc.subClan || 'الفرع المعتمد'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">المدينة / الدولة:</span>
                          <span className="font-bold text-slate-700">{doc.city}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">تاريخ الإصدار:</span>
                          <span className="font-bold text-slate-700">{doc.issueDateHijri}</span>
                        </div>
                      </div>

                      {doc.lineageChainSummary && (
                        <p className="text-[11px] text-slate-600 line-clamp-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                          {doc.lineageChainSummary}
                        </p>
                      )}

                    </div>

                    {/* Card & Certificate Action Buttons */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePreviewDocCard({
                            isNonMember: !doc.isMember,
                            selectedMemberId: '',
                            recipientName: doc.recipientName,
                            title: doc.recipientTitle || 'الشريف المكرم',
                            branch: doc.branch,
                            subClan: doc.subClan || 'البيت الهاشمي',
                            city: doc.city,
                            country: doc.country,
                            documentNumber: doc.documentNumber,
                            documentType: 'card',
                            issueDateHijri: doc.issueDateHijri,
                            issueDateGregorian: doc.issueDateGregorian,
                            lineageChainSummary: doc.lineageChainSummary || '',
                            nationalId: doc.nationalId || '28904121402391',
                            phone: doc.phone || '+20 10 1234 5678',
                            avatarUrl: doc.avatarUrl || '',
                            notes: doc.notes || ''
                          })}
                          className="bg-[#064e3b] hover:bg-[#0b6e54] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                        >
                          <CreditCard className="w-3.5 h-3.5 text-[#d4af37]" />
                          <span>عرض الكارنيه</span>
                        </button>

                        <button
                          onClick={() => handlePreviewDocCert({
                            isNonMember: !doc.isMember,
                            selectedMemberId: '',
                            recipientName: doc.recipientName,
                            title: doc.recipientTitle || 'الشريف المكرم',
                            branch: doc.branch,
                            subClan: doc.subClan || 'البيت الهاشمي',
                            city: doc.city,
                            country: doc.country,
                            documentNumber: doc.documentNumber,
                            documentType: 'certificate',
                            issueDateHijri: doc.issueDateHijri,
                            issueDateGregorian: doc.issueDateGregorian,
                            lineageChainSummary: doc.lineageChainSummary || '',
                            nationalId: doc.nationalId || '28904121402391',
                            phone: doc.phone || '+20 10 1234 5678',
                            avatarUrl: doc.avatarUrl || '',
                            notes: doc.notes || ''
                          })}
                          className="bg-[#d4af37] hover:brightness-110 text-[#064e3b] px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>عرض الشهادة</span>
                        </button>
                      </div>

                      <button
                        onClick={() => handleDeleteIssuedDoc(doc.id)}
                        className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1.5 rounded-lg transition-all cursor-pointer"
                        title="حذف من الأرشيف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>

        </div>
      )}

      {/* TAB 2: LINEAGE VERIFICATION REQUESTS */}
      {activeTab === 'verifications' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[#d4af37] text-xs font-bold bg-[#fcfbf7] border border-[#d4af37]/40 px-3 py-1 rounded-full inline-block mb-1">
                  لجنة فحص وتدقيق الأنساب بالأمانة العامة
                </span>
                <h3 className="text-xl font-bold font-heritage text-[#064e3b]">
                  طلبات تحقيق وتوثيق النسب وإصدار شهادات الانتساب
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  فحص الحجج الشرعية، المشجرات المخطوطة، وسلاسل النسب المتصلة في محافظات مصر
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {verificationRequests.map((req) => (
                <div
                  key={req.id}
                  className={`border-2 rounded-2xl p-5 space-y-4 transition-all ${
                    req.status === 'معتمد وموثق'
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : req.status === 'قيد المراجعة والتدقيق'
                      ? 'border-amber-200 bg-amber-50/20'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#064e3b] text-[#d4af37] flex items-center justify-center font-bold">
                        <FileCheck2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-base text-[#064e3b]">
                            {req.applicantName}
                          </h4>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            req.status === 'معتمد وموثق'
                              ? 'bg-emerald-100 text-emerald-800'
                              : req.status === 'قيد المراجعة والتدقيق'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {req.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          الرقم القومي: <span className="font-mono text-slate-700 font-bold">{req.nationalId}</span> • الهاتف: {req.phone} • المحافظة: {req.governorate}
                        </p>
                      </div>
                    </div>

                    <div className="text-xs text-slate-400 font-mono">
                      تاريخ التقديم: {req.submissionDate}
                    </div>
                  </div>

                  {/* Lineage & Claim Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                      <span className="font-bold text-slate-700 block text-[11px]">
                        الفرع والبيت الهاشمي المدعى:
                      </span>
                      <p className="text-emerald-900 font-bold">
                        {req.claimedBranch} - {req.subClan}
                      </p>
                      <span className="font-bold text-slate-700 block text-[11px] mt-2">
                        سلسلة النسب المتوارثة:
                      </span>
                      <p className="text-slate-700 leading-relaxed font-heritage text-sm">
                        {req.lineageChainText}
                      </p>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                      <span className="font-bold text-slate-700 block text-[11px]">
                        المستندات والحجج المرفوعة ({req.attachedDocuments.length}):
                      </span>
                      <ul className="space-y-1">
                        {req.attachedDocuments.map((doc, i) => (
                          <li key={i} className="flex items-center gap-1.5 text-slate-600">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37]" />
                            <span>{doc}</span>
                          </li>
                        ))}
                      </ul>

                      {req.reviewerNotes && (
                        <div className="bg-amber-50 p-2 rounded-lg border border-amber-200 text-amber-900 text-[11px] mt-2">
                          <span className="font-bold">ملاحظات النسّاب:</span> {req.reviewerNotes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="text-xs text-slate-500">
                      النسّاب المكلف: <span className="font-bold text-[#064e3b]">{req.assignedGenealogist || 'لجنة التحقيق العامة'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {req.status !== 'معتمد وموثق' ? (
                        <>
                          <button
                            onClick={() => {
                              const newNo = `BH-EG-1447-0${members.length + 101}`;
                              onApproveVerification(req.id, newNo);
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow flex items-center gap-1.5 cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
                            <span>اعتماد النسب وإصدار رقم القيد</span>
                          </button>

                          <button
                            onClick={() => {
                              const reason = prompt('أدخل ملاحظات النقص أو الوثائق الإضافية المطلوبة:');
                              if (reason) onRequestMoreDocs(req.id, reason);
                            }}
                            className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-3 py-2 rounded-xl text-xs shadow flex items-center gap-1.5 cursor-pointer"
                          >
                            <Clock className="w-4 h-4" />
                            <span>طلب وثائق إضافية</span>
                          </button>

                          <button
                            onClick={() => {
                              const reason = prompt('أدخل سبب رفض الطلب:');
                              if (reason) onRejectVerification(req.id, reason);
                            }}
                            className="bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>رفض</span>
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-xl flex items-center gap-1">
                            <Check className="w-4 h-4 text-emerald-600" />
                            تم الاعتماد والقيد بالسجل: {req.assignedMembershipNo || 'BH-EG-1447-0109'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MEMBERS & CREDENTIALS MANAGEMENT */}
      {activeTab === 'members' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            
            {/* Header & Actions */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[#d4af37] text-xs font-bold bg-[#fcfbf7] border border-[#d4af37]/40 px-3 py-1 rounded-full inline-block mb-1">
                  السجل الميداني لبيوت السادة الأشراف
                </span>
                <h3 className="text-xl font-bold font-heritage text-[#064e3b]">
                  إدارة الأعضاء والكارنيهات والشهادات الرسمية
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  استعراض السجلات، طباعة الكارنيهات الذكية وشهادات الانضمام، وإدارة بيانات الانتساب
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddMemberModalOpen(true)}
                  className="bg-[#064e3b] hover:bg-[#0b6e54] text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#d4af37]" />
                  <span>إضافة عضو جديد</span>
                </button>
              </div>
            </div>

            {/* Filters Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ابحث بالاسم، رقم القيد، أو المحافظة..."
                  className="w-full text-xs p-3 pr-10 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#064e3b] outline-none"
                />
              </div>

              <div>
                <select
                  value={selectedBranchFilter}
                  onChange={(e) => setSelectedBranchFilter(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#064e3b] outline-none font-bold text-slate-700"
                >
                  <option value="all">كل الفروع الهاشمية في مصر</option>
                  {branches.map(b => (
                    <option key={b.id} value={b.name}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={verificationFilter}
                  onChange={(e) => setVerificationFilter(e.target.value as any)}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#064e3b] outline-none font-bold text-slate-700"
                >
                  <option value="all">كل حالات التوثيق</option>
                  <option value="verified">الموثقون فقط (يحملون علامة التوثيق)</option>
                  <option value="unverified">قيد التدقيق والمراجعة</option>
                </select>
              </div>
            </div>

            {/* Members Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-right text-xs text-slate-700">
                <thead className="bg-[#fafaf7] text-slate-700 border-b border-slate-200 font-bold">
                  <tr>
                    <th className="p-3.5">الشريف / العضو</th>
                    <th className="p-3.5">رقم القيد</th>
                    <th className="p-3.5">الفرع والبيت</th>
                    <th className="p-3.5">المحافظة</th>
                    <th className="p-3.5">التوثيق</th>
                    <th className="p-3.5 text-center">الخدمات والهويات (الكارنيه / الشهادة)</th>
                    <th className="p-3.5 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-[#064e3b] text-sm flex items-center gap-1.5">
                          <span>{member.fullName}</span>
                          {member.isVerified && (
                            <ShieldCheck className="w-4 h-4 text-[#d4af37] shrink-0" />
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {member.phone}
                        </div>
                      </td>

                      <td className="p-3.5 font-mono font-bold text-slate-800">
                        {member.membershipNumber}
                      </td>

                      <td className="p-3.5">
                        <div className="font-medium text-slate-800">{member.branch}</div>
                        <div className="text-[10px] text-slate-400">{member.subClan || 'فرع معتمد'}</div>
                      </td>

                      <td className="p-3.5 font-medium">
                        {member.city}
                      </td>

                      <td className="p-3.5">
                        <button
                          onClick={() => onToggleMemberVerification(member.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                            member.isVerified
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}
                        >
                          {member.isVerified ? 'موثق ومعتمد' : 'غير موثق'}
                        </button>
                      </td>

                      <td className="p-3.5">
                        <div className="flex items-center justify-center gap-2">
                          {/* ID Card Button */}
                          <button
                            onClick={() => onViewMemberCard(member)}
                            className="bg-[#064e3b] hover:bg-[#0b6e54] text-white p-2 rounded-xl shadow text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                            title="عرض وتعديل كارنيه العضوية بالصورة"
                          >
                            <Award className="w-3.5 h-3.5 text-[#d4af37]" />
                            <span>الكارنيه</span>
                          </button>

                          {/* Certificate Button */}
                          <button
                            onClick={() => onViewCertificate(member)}
                            className="bg-[#fcfbf7] hover:bg-[#faf5e6] text-[#064e3b] border border-[#d4af37] p-2 rounded-xl shadow-sm text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                            title="عرض وإصدار شهادة الانضمام المعتمدة"
                          >
                            <FileText className="w-3.5 h-3.5 text-[#d4af37]" />
                            <span>الشهادة</span>
                          </button>
                        </div>
                      </td>

                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => {
                            if (confirm(`هل أنت متأكد من حذف العضو ${member.fullName} من السجل العام؟`)) {
                              onDeleteMember(member.id);
                            }
                          }}
                          className="text-rose-400 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 cursor-pointer"
                          title="حذف من السجل"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
              <span>عرض {filteredMembers.length} من إجمالي {members.length} شريف مسجل</span>
              <span className="font-mono">أمانة الأنساب والتوثيق - مصر</span>
            </div>

          </div>
        </div>
      )}

      {/* TAB 4: SOLIDARITY FUND AID APPLICATIONS */}
      {activeTab === 'aid' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[#d4af37] text-xs font-bold bg-[#fcfbf7] border border-[#d4af37]/40 px-3 py-1 rounded-full inline-block mb-1">
                  لجنة التكافل الاجتماعي وصندوق الوقف
                </span>
                <h3 className="text-xl font-bold font-heritage text-[#064e3b]">
                  إدارة طلبات الإعانة وصندوق التكافل الهاشمي بمصر
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  كفالة الأسر المتعففة، دعم الطلاب، رعاية المرضى، وتيسير الزواج في كافة محافظات مصر
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {aidApplications.map((app) => (
                <div
                  key={app.id}
                  className={`border-2 rounded-2xl p-5 space-y-4 transition-all ${
                    app.status === 'تمت الموافقة والصرف'
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : 'border-amber-200 bg-amber-50/20'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                        <HeartHandshake className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-base text-[#064e3b]">
                            {app.applicantName}
                          </h4>
                          <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-mono">
                            {app.membershipNo}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            app.status === 'تمت الموافقة والصرف'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {app.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          الفرع: {app.branch} • المحافظة: {app.governorate} • نوع الدعم: <span className="font-bold text-emerald-900">{app.category}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-left">
                      <div className="text-lg font-black font-mono text-[#064e3b]">
                        {app.amountRequested.toLocaleString()} ج.م
                      </div>
                      <div className="text-[10px] text-slate-400">
                        تاريخ الطلب: {app.date}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                    <span className="font-bold text-slate-900 block">مبررات الطلب والتقرير الميداني:</span>
                    <p className="leading-relaxed">{app.reason}</p>
                    {app.notes && (
                      <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-200 text-emerald-900 text-[11px] mt-2">
                        <span className="font-bold">قرار اللجنة:</span> {app.notes}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className={`text-xs font-bold ${
                      app.urgency === 'عاجل جداً' ? 'text-rose-600' : 'text-slate-500'
                    }`}>
                      مستوى الأولوية: {app.urgency}
                    </span>

                    {app.status !== 'تمت الموافقة والصرف' ? (
                      <button
                        onClick={() => onApproveAid(app.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
                        <span>الموافقة وصرف الإعانة من الصندوق</span>
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                        <Check className="w-4 h-4 text-emerald-600" />
                        تم الصرف والتحويل للمستفيد
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CENTRAL REGISTRY & BATCH PRINT */}
      {activeTab === 'registry' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-8 border-2 border-[#d4af37] shadow-xl space-y-8 print:border-none print:shadow-none">
            
            {/* Registry Header */}
            <div className="text-center space-y-2 border-b-2 border-[#d4af37]/60 pb-6">
              <div className="text-xs font-bold text-[#d4af37] tracking-widest font-mono">
                بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-heritage text-[#064e3b]">
                السجل العام المعتمد لنسب السادة الأشراف بني هاشم في جمهورية مصر العربية
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-3xl mx-auto">
                سجل رسمي صادر عن الأمانة العامة ولجنة تحقيق الأنساب والتكافل، يضم البيوت والفروع الهاشمية المسجلة والمعتمدة لعام 1447 هـ / 2026 م
              </p>
            </div>

            {/* Summary Statistics Table */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="text-xs text-slate-500 font-bold">إجمالي السادة المقيدين</div>
                <div className="text-2xl font-black text-[#064e3b] font-mono">{members.length}</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="text-xs text-slate-500 font-bold">النسبة الموثقة بحجة</div>
                <div className="text-2xl font-black text-emerald-700 font-mono">100%</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="text-xs text-slate-500 font-bold">محافظات الانتشار بمصر</div>
                <div className="text-2xl font-black text-[#064e3b] font-mono">27 محافظة</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="text-xs text-slate-500 font-bold">تاريخ الإصدار والاعتماد</div>
                <div className="text-sm font-bold text-slate-800 font-mono mt-1">شعبان 1447 هـ</div>
              </div>
            </div>

            {/* Official Register Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs text-slate-800 border-collapse">
                <thead>
                  <tr className="bg-[#064e3b] text-white">
                    <th className="p-3 border border-emerald-900">م</th>
                    <th className="p-3 border border-emerald-900">رقم القيد الرسمي</th>
                    <th className="p-3 border border-emerald-900">اسم الشريف / العضو</th>
                    <th className="p-3 border border-emerald-900">الفرع الهاشمي والبيت</th>
                    <th className="p-3 border border-emerald-900">المحافظة / المركز</th>
                    <th className="p-3 border border-emerald-900">تاريخ القيد بالسجل</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((m, index) => (
                    <tr key={m.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="p-3 border border-slate-200 font-mono text-center font-bold">{index + 1}</td>
                      <td className="p-3 border border-slate-200 font-mono font-bold text-[#064e3b]">{m.membershipNumber}</td>
                      <td className="p-3 border border-slate-200 font-bold">{m.fullName}</td>
                      <td className="p-3 border border-slate-200">{m.branch} ({m.subClan || 'الأصل'})</td>
                      <td className="p-3 border border-slate-200">{m.city}</td>
                      <td className="p-3 border border-slate-200 font-mono text-slate-600">{m.joinDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Official Signatures & Seal Box */}
            <div className="pt-8 border-t-2 border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-xs">
              <div className="space-y-2">
                <div className="font-bold text-slate-700">رئيس لجنة تحقيق الأنساب بمصر</div>
                <div className="font-heritage text-base text-[#064e3b] font-bold">الشريف د. إبراهيم بن محمد الجعفري</div>
                <div className="text-[10px] text-slate-400 font-mono">توقيع معتمد إلكترونياً</div>
              </div>

              <div className="flex flex-col items-center justify-center space-y-1">
                <div className="w-16 h-16 rounded-full border-2 border-[#d4af37] bg-[#fcfbf7] flex flex-col items-center justify-center text-[#064e3b] font-bold text-[9px] shadow">
                  <ShieldCheck className="w-6 h-6 text-[#d4af37]" />
                  <span>خاتم الأمانة</span>
                </div>
                <span className="text-[10px] text-[#064e3b] font-bold">جمهورية مصر العربية</span>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-slate-700">الأمين العام لتجمع السادة الأشراف بني هاشم</div>
                <div className="font-heritage text-base text-[#064e3b] font-bold">الشريف المستشار يحيى بن أحمد الهاشمي</div>
                <div className="text-[10px] text-slate-400 font-mono">توقيع معتمد إلكترونياً</div>
              </div>
            </div>

            <div className="no-print text-center pt-4">
              <button
                onClick={handlePrintRegistry}
                className="bg-[#064e3b] hover:bg-[#0b6e54] text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 mx-auto cursor-pointer"
              >
                <Printer className="w-5 h-5 text-[#d4af37]" />
                <span>طباعة السجل بالكامل (A4)</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Modal: Add Member Manually */}
      {isAddMemberModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border-2 border-[#064e3b]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#064e3b] text-[#d4af37] flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold font-heritage text-[#064e3b]">
                  إضافة وقيد شريف بالسجل العام
                </h3>
              </div>
              <button
                onClick={() => setIsAddMemberModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMemberSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">الاسم الرباعي الكامل للشريف *</label>
                <input
                  type="text"
                  required
                  value={newMemberForm.fullName}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, fullName: e.target.value })}
                  placeholder="مثال: الشريف عبد الرحمن بن محمود بن إبراهيم الهاشمي"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#064e3b] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-slate-700">الفرع الهاشمي *</label>
                    <span className="text-[10px] text-[#064e3b] font-bold">اختيار أو كتابة يدوية</span>
                  </div>
                  <input
                    type="text"
                    required
                    list="admin-modal-branches-list"
                    value={newMemberForm.branch}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, branch: e.target.value })}
                    placeholder="اختر أو اكتب اسم الفرع..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#064e3b] outline-none font-bold"
                  />
                  <datalist id="admin-modal-branches-list">
                    {branches.map(b => (
                      <option key={b.id} value={b.name} />
                    ))}
                    <option value="الأشراف الأدارسة الفاسيين" />
                    <option value="الأشراف السليمانيون" />
                    <option value="الأشراف البازات (الشرقية)" />
                    <option value="الأشراف العزازية" />
                    <option value="الأشراف النمويين" />
                    <option value="الأشراف الرفاعية" />
                  </datalist>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">البيت أو العشيرة</label>
                  <input
                    type="text"
                    value={newMemberForm.subClan}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, subClan: e.target.value })}
                    placeholder="مثال: بيت الجعفري"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#064e3b] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">المحافظة / المدينة بمصر *</label>
                  <input
                    type="text"
                    required
                    value={newMemberForm.city}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, city: e.target.value })}
                    placeholder="مثال: قنا / الأقصر / القاهرة"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#064e3b] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">الرقم القومي (14 رقم)</label>
                  <input
                    type="text"
                    value={newMemberForm.nationalId}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, nationalId: e.target.value })}
                    placeholder="2900101..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#064e3b] outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">رقم الهاتف للتواصل</label>
                  <input
                    type="text"
                    value={newMemberForm.phone}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, phone: e.target.value })}
                    placeholder="+20 10..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#064e3b] outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={newMemberForm.email}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, email: e.target.value })}
                    placeholder="name@banihashim.org.eg"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#064e3b] outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newMemberForm.isVerified}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, isVerified: e.target.checked })}
                    className="w-4 h-4 text-[#064e3b] rounded focus:ring-0"
                  />
                  <span>منح علامة النسب الموثق فوراً</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddMemberModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="bg-[#064e3b] hover:bg-[#0b6e54] text-white px-5 py-2 rounded-xl font-bold shadow flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4 text-[#d4af37]" />
                    <span>حفظ وقيد العضو</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

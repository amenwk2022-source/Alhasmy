import React, { useState } from 'react';
import { 
  UserProfile, 
  UserAchievement, 
  PersonalTreeNode, 
  FamilyBranch 
} from '../types';
import { 
  User, 
  ShieldCheck, 
  Award, 
  GitFork, 
  Plus, 
  Edit3, 
  Trash2, 
  MapPin, 
  Briefcase, 
  Mail, 
  Phone, 
  Globe, 
  CheckCircle2, 
  Sparkles, 
  Calendar, 
  Share2, 
  Download, 
  QrCode, 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  EyeOff, 
  HeartHandshake, 
  GraduationCap, 
  BookOpen, 
  MessageSquare, 
  ExternalLink,
  Users,
  Camera,
  CreditCard,
  Printer,
  FileText
} from 'lucide-react';

import { MemberCardModal } from './MemberCardModal';
import { CertificateModal } from './CertificateModal';
import { PersonalFamilyTreeModal } from './PersonalFamilyTreeModal';
import { PhotoUploadModal } from './PhotoUploadModal';
import { copyTextToClipboard } from '../utils/clipboard';

interface UserProfileViewProps {
  user: UserProfile;
  branches: FamilyBranch[];
  onUpdateUser: (updated: UserProfile) => void;
  onOpenGenealogyVerify: () => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  user,
  branches,
  onUpdateUser,
  onOpenGenealogyVerify
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tree' | 'achievements' | 'lineage'>('overview');
  
  // Modals for the 3 requested features
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [isTreeModalOpen, setIsTreeModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  // Edit Profile Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<UserProfile>(user);

  // Add Achievement Modal State
  const [isAddAchModalOpen, setIsAddAchModalOpen] = useState(false);
  const [achForm, setAchForm] = useState<Omit<UserAchievement, 'id'>>({
    title: '',
    category: 'إنجاز مهني',
    yearHijri: '1447 هـ',
    yearGregorian: '2026 م',
    issuer: '',
    description: '',
    badgeIcon: 'award',
    verified: true
  });

  // Add Tree Node Modal State
  const [isAddNodeModalOpen, setIsAddNodeModalOpen] = useState(false);
  const [nodeForm, setNodeForm] = useState<Omit<PersonalTreeNode, 'id'>>({
    name: '',
    relation: 'الابن',
    birthYear: '',
    occupation: '',
    location: user.city || 'القاهرة',
    notes: ''
  });

  const [selectedNode, setSelectedNode] = useState<PersonalTreeNode | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser(editForm);
    setIsEditModalOpen(false);
  };

  const handleAddAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!achForm.title.trim()) return;

    const newAch: UserAchievement = {
      id: 'ach-' + Date.now(),
      ...achForm
    };

    onUpdateUser({
      ...user,
      achievements: [...(user.achievements || []), newAch]
    });

    setIsAddAchModalOpen(false);
    setAchForm({
      title: '',
      category: 'إنجاز مهني',
      yearHijri: '1447 هـ',
      yearGregorian: '2026 م',
      issuer: '',
      description: '',
      badgeIcon: 'award',
      verified: true
    });
  };

  const handleDeleteAchievement = (id: string) => {
    onUpdateUser({
      ...user,
      achievements: user.achievements?.filter(a => a.id !== id) || []
    });
  };

  const handleAddTreeNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nodeForm.name.trim()) return;

    const newNode: PersonalTreeNode = {
      id: 'node-' + Date.now(),
      ...nodeForm
    };

    onUpdateUser({
      ...user,
      personalTree: [...(user.personalTree || []), newNode]
    });

    setIsAddNodeModalOpen(false);
    setNodeForm({
      name: '',
      relation: 'الابن',
      birthYear: '',
      occupation: '',
      location: user.city || 'القاهرة',
      notes: ''
    });
  };

  const handleDeleteTreeNode = (id: string) => {
    onUpdateUser({
      ...user,
      personalTree: user.personalTree?.filter(n => n.id !== id) || []
    });
    if (selectedNode?.id === id) setSelectedNode(null);
  };

  const handleShareProfile = async () => {
    await copyTextToClipboard(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleUpdatePhoto = (photoUrl: string) => {
    onUpdateUser({
      ...user,
      avatarUrl: photoUrl
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* 1. TOP HERO PROFILE HEADER */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg overflow-hidden relative">
        
        {/* Cover Background Banner */}
        <div className="h-44 sm:h-56 bg-gradient-to-r from-[#064e3b] via-[#0b6e54] to-[#043e2f] relative p-6 flex items-start justify-between">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>
          
          <div className="z-10 flex items-center gap-2">
            <span className="text-[10px] sm:text-xs font-bold bg-black/40 backdrop-blur-md text-[#d4af37] border border-[#d4af37]/40 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-inner">
              <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
              عضوية موثقة ومعتمدة
            </span>
            <span className="text-[10px] sm:text-xs font-mono text-emerald-200/80 bg-black/30 px-3 py-1 rounded-full">
              {user.membershipNumber}
            </span>
          </div>

          <div className="z-10 flex items-center gap-2">
            <button
              onClick={handleShareProfile}
              className="bg-white/10 hover:bg-white/25 text-white p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-semibold backdrop-blur-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-[#d4af37]" />
              <span className="hidden sm:inline">{copiedLink ? 'تم نسخ الرابط!' : 'مشاركة الملف'}</span>
            </button>
            <button
              onClick={() => {
                setEditForm(user);
                setIsEditModalOpen(true);
              }}
              className="bg-[#d4af37] hover:brightness-110 text-[#064e3b] px-3.5 py-1.5 rounded-xl text-xs font-bold shadow transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>تعديل الملف</span>
            </button>
          </div>
        </div>

        {/* Profile Avatar & Main Info */}
        <div className="px-6 sm:px-10 pb-6 pt-0 relative">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 -mt-16 sm:-mt-20 mb-6">
            
            {/* Avatar and Identity */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              <div className="relative group">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl border-4 border-white shadow-xl overflow-hidden bg-emerald-50 relative">
                  {user.avatarUrl ? (
                    <img 
                      src={user.avatarUrl} 
                      alt={user.fullName} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#064e3b] text-[#d4af37] text-3xl font-bold font-heritage">
                      {user.fullName.charAt(0)}
                    </div>
                  )}
                </div>
                
                {/* Photo Change Quick Button */}
                <button
                  onClick={() => setIsPhotoModalOpen(true)}
                  className="absolute bottom-1 right-1 bg-[#064e3b] text-[#d4af37] p-2 rounded-2xl border-2 border-white shadow hover:scale-105 transition-all cursor-pointer"
                  title="رفع وتكييف الصورة الشخصية الرسمية"
                >
                  <Camera className="w-4 h-4" />
                </button>

                {user.isVerifiedLineage && (
                  <div 
                    title="نسب موثق رسمياً من لجنة الأنساب"
                    className="absolute -bottom-1 -left-1 bg-[#064e3b] text-[#d4af37] p-1.5 rounded-full border-2 border-white shadow-md"
                  >
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                )}
              </div>

              <div className="space-y-1.5 sm:pb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold font-heritage text-[#064e3b]">
                    {user.fullName}
                  </h1>
                  {user.isVerifiedLineage && (
                    <span className="bg-emerald-100 text-[#064e3b] text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#064e3b]" />
                      نسب موثق
                    </span>
                  )}
                </div>
                
                <p className="text-xs sm:text-sm font-medium text-[#d4af37] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {user.kunyaOrTitle}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1">
                  <span className="flex items-center gap-1 font-semibold text-emerald-900 bg-emerald-50/80 px-2.5 py-1 rounded-lg">
                    <Users className="w-3.5 h-3.5 text-[#064e3b]" />
                    {user.branch} • {user.subClan}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {user.city}، {user.country}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    {user.occupation}
                  </span>
                </div>
              </div>
            </div>

            {/* 3 HIGHLIGHTED ACTION BUTTONS (Карне، الشهادة، المشجر) */}
            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto pt-2 lg:pt-0">
              
              {/* 1. ID Card Modal Trigger */}
              <button
                onClick={() => setIsCardModalOpen(true)}
                className="flex-1 sm:flex-none bg-[#064e3b] hover:bg-[#0b6e54] text-white px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
              >
                <CreditCard className="w-4 h-4 text-[#d4af37]" />
                <span>كارنيه العضوية (مع صورتك)</span>
              </button>

              {/* 2. Certificate Modal Trigger */}
              <button
                onClick={() => setIsCertModalOpen(true)}
                className="flex-1 sm:flex-none bg-[#fafaf7] hover:bg-[#f6f2e8] text-[#064e3b] border-2 border-[#d4af37] px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
              >
                <Award className="w-4 h-4 text-[#d4af37]" />
                <span>شهادة الانضمام الرسمية</span>
              </button>

              {/* 3. Family Tree Modal Trigger */}
              <button
                onClick={() => setIsTreeModalOpen(true)}
                className="flex-1 sm:flex-none bg-[#d4af37] hover:brightness-110 text-[#064e3b] px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
              >
                <GitFork className="w-4 h-4 text-[#064e3b]" />
                <span>مشجر العائلة التفاعلي</span>
              </button>

            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 pt-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-[#064e3b] text-[#064e3b]'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4" />
              <span>نبذة ومعلومات الاتصال</span>
            </button>

            <button
              onClick={() => setActiveTab('tree')}
              className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'tree'
                  ? 'border-[#064e3b] text-[#064e3b]'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <GitFork className="w-4 h-4" />
              <span>شجرة العائلة الخاصة ({user.personalTree?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('achievements')}
              className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'achievements'
                  ? 'border-[#064e3b] text-[#064e3b]'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>الأوسمة والإنجازات ({user.achievements?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('lineage')}
              className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'lineage'
                  ? 'border-[#064e3b] text-[#064e3b]'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>سلسلة النسب وتوثيق الأمانة</span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. TAB CONTENT */}

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (2 Cols): Bio & Quick Links */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Bio Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base sm:text-lg font-bold font-heritage text-[#064e3b] flex items-center gap-2">
                  <User className="w-5 h-5 text-[#d4af37]" />
                  <span>النبذة والتعريف الشخصي</span>
                </h3>
                <button
                  onClick={() => {
                    setEditForm(user);
                    setIsEditModalOpen(true);
                  }}
                  className="text-xs text-[#064e3b] hover:text-[#0b6e54] font-bold flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>تعديل</span>
                </button>
              </div>

              <p className="text-slate-700 leading-relaxed text-xs sm:text-sm whitespace-pre-line">
                {user.bio || 'لم يتم إضافة نبذة شخصية بعد. يمكنك تعديل ملفك لإضافة نبذة تعريفية.'}
              </p>
            </div>

            {/* Quick Cards Banner for Family Tree, ID Card and Certificate */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Card 1 */}
              <div 
                onClick={() => setIsCardModalOpen(true)}
                className="bg-gradient-to-br from-[#064e3b] to-[#0b6e54] text-white p-5 rounded-3xl border-2 border-[#d4af37] shadow-md hover:shadow-xl transition-all cursor-pointer space-y-2 group"
              >
                <div className="w-10 h-10 rounded-2xl bg-[#d4af37] text-[#064e3b] flex items-center justify-center font-bold">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h4 className="font-heritage text-base font-bold text-white group-hover:text-[#d4af37] transition-colors">
                  كارنيه العضوية بالصورة
                </h4>
                <p className="text-[11px] text-emerald-200">
                  عرض وتحديث صورتك الشخصية على الكارنيه الرقمي الرسمي مع ميزة التقليب ثلاثي الأبعاد.
                </p>
              </div>

              {/* Card 2 */}
              <div 
                onClick={() => setIsCertModalOpen(true)}
                className="bg-[#fafaf7] p-5 rounded-3xl border-2 border-[#d4af37] shadow-md hover:shadow-xl transition-all cursor-pointer space-y-2 group"
              >
                <div className="w-10 h-10 rounded-2xl bg-[#064e3b] text-[#d4af37] flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="font-heritage text-base font-bold text-[#064e3b] group-hover:text-[#d4af37] transition-colors">
                  شهادة الانضمام الرسمية
                </h4>
                <p className="text-[11px] text-slate-600">
                  شهادة معتمدة بخاتم الأمانة الذهبي وسلسلة النسب الشريف جاهزة للطباعة والتأطير A4.
                </p>
              </div>

              {/* Card 3 */}
              <div 
                onClick={() => setIsTreeModalOpen(true)}
                className="bg-gradient-to-br from-[#d4af37] to-[#b59226] text-[#064e3b] p-5 rounded-3xl shadow-md hover:shadow-xl transition-all cursor-pointer space-y-2 group"
              >
                <div className="w-10 h-10 rounded-2xl bg-[#064e3b] text-[#d4af37] flex items-center justify-center font-bold">
                  <GitFork className="w-5 h-5" />
                </div>
                <h4 className="font-heritage text-base font-bold text-[#064e3b]">
                  مشجر العائلة التفاعلي
                </h4>
                <p className="text-[11px] text-emerald-950 font-medium">
                  بناء شجرة نسبك الشخصية وتتبع الأجداد والأبناء وتصديرها كشجرة نسب ورقية أو رقمية.
                </p>
              </div>

            </div>

          </div>

          {/* Right Column (1 Col): Verified Contact & Info */}
          <div className="space-y-6">
            
            {/* Contact Details Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-base font-bold font-heritage text-[#064e3b] flex items-center gap-2 border-b border-slate-100 pb-3">
                <Phone className="w-4 h-4 text-[#d4af37]" />
                <span>بيانات التواصل والصلة</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-2.5 bg-[#fafaf7] rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#064e3b]" />
                    <span className="font-mono text-slate-800">{user.phone}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {user.showPhonePublicly ? 'ظاهر للجميع' : 'خاص وموثق'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-[#fafaf7] rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#064e3b]" />
                    <span className="text-slate-800 truncate max-w-[180px]">{user.email}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {user.showEmailPublicly ? 'ظاهر' : 'مخفي'}
                  </span>
                </div>

                {user.whatsapp && (
                  <div className="flex items-center justify-between p-2.5 bg-[#fafaf7] rounded-xl border border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 text-emerald-600 font-bold">WA</span>
                      <span className="font-mono text-slate-800">{user.whatsapp}</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold">واتساب متاح</span>
                  </div>
                )}
              </div>
            </div>

            {/* Official Assembly Registry Badge */}
            <div className="bg-[#fcfbf7] rounded-3xl p-6 border-2 border-[#d4af37]/60 shadow-sm space-y-3 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#064e3b] text-[#d4af37] flex items-center justify-center mx-auto shadow">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-heritage text-base font-bold text-[#064e3b]">
                سجل القيد بالأمانة العامة بمصر
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                مسجل بسجلات النسب الشريف تحت رقم <strong className="font-mono text-[#064e3b]">{user.membershipNumber}</strong> بتاريخ {user.joinDateHijri}.
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => setIsCertModalOpen(true)}
                  className="w-full bg-[#064e3b] hover:bg-[#0b6e54] text-white py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>عرض شهادة الانضمام الرسمية</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Tab 2: Personal Family Lineage Tree */}
      {activeTab === 'tree' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[#d4af37] text-xs font-bold bg-[#fcfbf7] border border-[#d4af37]/40 px-3 py-1 rounded-full inline-block mb-1">
                  شجرة العائلة الخاصة بالمنتسب
                </span>
                <h3 className="text-xl font-bold font-heritage text-[#064e3b]">
                  سجل الأصول والفروع والذرية المباركة
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  يتيح لك هذا القسم بناء وتوثيق شجرتك الخاصة بإضافة الآباء، الأجداد، والأبناء والأحفاد مع عرض تفاعلي كامل.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsTreeModalOpen(true)}
                  className="bg-[#d4af37] hover:brightness-110 text-[#064e3b] px-4 py-2.5 rounded-xl text-xs font-bold shadow transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <GitFork className="w-4 h-4 text-[#064e3b]" />
                  <span>فتح المشجر التفاعلي الموسع</span>
                </button>

                <button
                  onClick={() => setIsAddNodeModalOpen(true)}
                  className="bg-[#064e3b] hover:bg-[#0b6e54] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#d4af37]" />
                  <span>إضافة فرد للشجرة</span>
                </button>
              </div>
            </div>

            {/* Tree Nodes Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {user.personalTree?.map((node) => {
                const isRoot = node.relation === 'صاحب الملف';
                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer relative group ${
                      isRoot
                        ? 'bg-[#fcfbf7] border-[#064e3b] shadow-md ring-2 ring-[#064e3b]/10'
                        : 'bg-white border-slate-200 hover:border-[#064e3b]/40 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        isRoot
                          ? 'bg-[#064e3b] text-[#d4af37]'
                          : 'bg-emerald-100 text-[#064e3b]'
                      }`}>
                        {node.relation}
                      </span>

                      {!isRoot && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTreeNode(node.id);
                          }}
                          title="حذف من الشجرة"
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-600 transition-opacity p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <h4 className="text-base font-bold font-heritage text-[#064e3b] group-hover:text-[#0b6e54] transition-colors">
                      {node.name}
                    </h4>

                    <div className="mt-3 space-y-1 text-xs text-slate-600">
                      {node.birthYear && (
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>سنة الولادة / الحقبة: {node.birthYear}</span>
                        </div>
                      )}
                      {node.occupation && (
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <Briefcase className="w-3 h-3 text-slate-400" />
                          <span>{node.occupation}</span>
                        </div>
                      )}
                      {node.location && (
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{node.location}</span>
                        </div>
                      )}
                    </div>

                    {node.notes && (
                      <p className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] text-slate-500 line-clamp-2">
                        {node.notes}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}

      {/* Tab 3: Achievements */}
      {activeTab === 'achievements' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[#d4af37] text-xs font-bold bg-[#fcfbf7] border border-[#d4af37]/40 px-3 py-1 rounded-full inline-block mb-1">
                  سجل التميز والخدمات
                </span>
                <h3 className="text-xl font-bold font-heritage text-[#064e3b]">
                  الأوسمة والجوائز والإنجازات الموثقة
                </h3>
              </div>

              <button
                onClick={() => setIsAddAchModalOpen(true)}
                className="bg-[#064e3b] hover:bg-[#0b6e54] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#d4af37]" />
                <span>إضافة إنجاز جديد</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.achievements?.map((ach) => (
                <div
                  key={ach.id}
                  className="bg-[#fafaf7] p-5 rounded-2xl border border-slate-200 hover:border-[#064e3b]/30 shadow-xs transition-all space-y-2 relative group"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300">
                      {ach.category}
                    </span>
                    <button
                      onClick={() => handleDeleteAchievement(ach.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-600 transition-opacity p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="font-heritage text-base font-bold text-[#064e3b]">
                    {ach.title}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {ach.description}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-200/60">
                    <span>الجهة: {ach.issuer}</span>
                    <span>{ach.yearHijri} ({ach.yearGregorian})</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* Tab 4: Lineage Chain */}
      {activeTab === 'lineage' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[#d4af37] text-xs font-bold bg-[#fcfbf7] border border-[#d4af37]/40 px-3 py-1 rounded-full inline-block mb-1">
                سلسلة النسب المتصلة المعتمدة
              </span>
              <h3 className="text-xl font-bold font-heritage text-[#064e3b]">
                التوثيق التاريخي للنسب الهاشمي الشريف
              </h3>
            </div>

            <button
              onClick={onOpenGenealogyVerify}
              className="bg-[#064e3b] hover:bg-[#0b6e54] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
              <span>طلب فحص وتوثيق وثيقة نسب</span>
            </button>
          </div>

          <div className="bg-[#fcfbf7] p-6 rounded-2xl border-2 border-[#d4af37]/50 space-y-4">
            <h4 className="text-sm font-bold text-[#064e3b] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
              <span>سلسلة النسب الشريف المسجلة:</span>
            </h4>
            <p className="font-heritage text-sm sm:text-base leading-relaxed text-[#064e3b] bg-white p-5 rounded-xl border border-slate-200 shadow-inner">
              « {user.lineageChainSummary} »
            </p>
          </div>
        </div>
      )}

      {/* 3. MODAL POPUPS */}

      {/* Modal 1: ID Card Modal with Photo Upload */}
      {isCardModalOpen && (
        <MemberCardModal
          member={user}
          onClose={() => setIsCardModalOpen(false)}
          onUpdateMemberPhoto={handleUpdatePhoto}
        />
      )}

      {/* Modal 2: Official Admission Certificate Modal */}
      {isCertModalOpen && (
        <CertificateModal
          member={user}
          onClose={() => setIsCertModalOpen(false)}
          onUpdateMemberPhoto={handleUpdatePhoto}
        />
      )}

      {/* Modal 3: Personal Family Tree Modal */}
      {isTreeModalOpen && (
        <PersonalFamilyTreeModal
          user={user}
          onClose={() => setIsTreeModalOpen(false)}
          onUpdateUser={onUpdateUser}
        />
      )}

      {/* Modal 4: Official Photo Upload & Adaptive Cropping */}
      <PhotoUploadModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        currentPhotoUrl={user.avatarUrl}
        onSavePhoto={handleUpdatePhoto}
        title="تكييف وضبط الصورة الشخصية الرسمية"
        subtitle="يقوم المعالج الذكي بقص الصورة وتوسيطها بنسبة الأبعاد المناسبة لبطاقات العضوية والشهادات"
      />

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 border-2 border-[#d4af37] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold font-heritage text-[#064e3b]">
                تعديل بيانات الملف الشخصي
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">الاسم الكامل:</label>
                <input
                  type="text"
                  required
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">الكنية أو اللقب والمهنة:</label>
                <input
                  type="text"
                  value={editForm.kunyaOrTitle}
                  onChange={(e) => setEditForm({ ...editForm, kunyaOrTitle: e.target.value })}
                  className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">الفرع أو السلالة الهاشمية:</label>
                  <input
                    type="text"
                    list="profile-branches-datalist"
                    value={editForm.branch}
                    onChange={(e) => setEditForm({ ...editForm, branch: e.target.value })}
                    placeholder="اكتب اسم الفرع أو اختر..."
                    className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                  />
                  <datalist id="profile-branches-datalist">
                    <option value="الأشراف الجعافرة (أشراف الصعيد)" />
                    <option value="الأشراف الأدارسة الفاسيين" />
                    <option value="الأشراف الرفاعية" />
                    <option value="الأشراف الباقرية والزينبية" />
                    <option value="الأشراف القواسم والمهادية" />
                    <option value="الأشراف السليمانيون" />
                    <option value="الأشراف البازات" />
                    <option value="الأشراف العزازية" />
                    <option value="الأشراف النمويين" />
                  </datalist>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">البيت / العشيرة المتفرعة:</label>
                  <input
                    type="text"
                    value={editForm.subClan}
                    onChange={(e) => setEditForm({ ...editForm, subClan: e.target.value })}
                    placeholder="مثال: بيت الجعفري"
                    className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">المهنة:</label>
                  <input
                    type="text"
                    value={editForm.occupation}
                    onChange={(e) => setEditForm({ ...editForm, occupation: e.target.value })}
                    className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">المحافظة / المدينة بمصر:</label>
                  <input
                    type="text"
                    value={editForm.city}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">النبذة الشخصية:</label>
                <textarea
                  rows={3}
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">رقم الهاتف:</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">البريد الإلكتروني:</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-[#064e3b] hover:bg-[#0b6e54] text-white px-5 py-2 rounded-xl font-bold shadow"
                >
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Tree Node Modal */}
      {isAddNodeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border-2 border-[#d4af37] shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-base font-bold font-heritage text-[#064e3b] flex items-center gap-2">
                <GitFork className="w-4 h-4 text-[#d4af37]" />
                <span>إضافة فرد جديد لشجرة العائلة</span>
              </h4>
              <button
                onClick={() => setIsAddNodeModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTreeNode} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">الاسم الكريم:</label>
                <input
                  type="text"
                  required
                  value={nodeForm.name}
                  onChange={(e) => setNodeForm({ ...nodeForm, name: e.target.value })}
                  placeholder="مثال: الشريف عبد الله بن أحمد..."
                  className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">صلة القرابة:</label>
                  <select
                    value={nodeForm.relation}
                    onChange={(e) => setNodeForm({ ...nodeForm, relation: e.target.value as any })}
                    className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                  >
                    <option value="الأب">الأب</option>
                    <option value="الجد الأول">الجد الأول</option>
                    <option value="الجد الثاني">الجد الثاني</option>
                    <option value="الجد الثالث">الجد الثالث</option>
                    <option value="الابن">الابن</option>
                    <option value="الابنة">الابنة</option>
                    <option value="الحفيد">الحفيد / الحفيدة</option>
                    <option value="الزوجة / الزوج">الزوجة / الزوج</option>
                    <option value="الأخ / الأخت">الأخ / الأخت</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">سنة الولادة / الحقبة:</label>
                  <input
                    type="text"
                    value={nodeForm.birthYear}
                    onChange={(e) => setNodeForm({ ...nodeForm, birthYear: e.target.value })}
                    placeholder="مثال: 1445 هـ"
                    className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">المهنة / الصفة:</label>
                  <input
                    type="text"
                    value={nodeForm.occupation}
                    onChange={(e) => setNodeForm({ ...nodeForm, occupation: e.target.value })}
                    placeholder="مثال: مهندس / طالب"
                    className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">المحافظة / المدينة بمصر:</label>
                  <input
                    type="text"
                    value={nodeForm.location}
                    onChange={(e) => setNodeForm({ ...nodeForm, location: e.target.value })}
                    placeholder="مثال: القاهرة / قنا"
                    className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddNodeModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-[#064e3b] hover:bg-[#0b6e54] text-white px-5 py-2 rounded-xl font-bold shadow"
                >
                  إضافة للشجرة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Achievement Modal */}
      {isAddAchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border-2 border-[#d4af37] shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-base font-bold font-heritage text-[#064e3b] flex items-center gap-2">
                <Award className="w-4 h-4 text-[#d4af37]" />
                <span>إضافة إنجاز أو وسام جديد</span>
              </h4>
              <button
                onClick={() => setIsAddAchModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddAchievement} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">عنوان الإنجاز أو الجائزة:</label>
                <input
                  type="text"
                  required
                  value={achForm.title}
                  onChange={(e) => setAchForm({ ...achForm, title: e.target.value })}
                  className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">الفئة:</label>
                  <select
                    value={achForm.category}
                    onChange={(e) => setAchForm({ ...achForm, category: e.target.value as any })}
                    className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                  >
                    <option value="إنجاز مهني">إنجاز مهني</option>
                    <option value="تفوق أكاديمي">تفوق أكاديمي</option>
                    <option value="خدمة مجتمعية">خدمة مجتمعية</option>
                    <option value="حفظ وتراث">حفظ وتراث</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">الجهة المانحة:</label>
                  <input
                    type="text"
                    value={achForm.issuer}
                    onChange={(e) => setAchForm({ ...achForm, issuer: e.target.value })}
                    className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">تفاصيل الإنجاز:</label>
                <textarea
                  rows={2}
                  value={achForm.description}
                  onChange={(e) => setAchForm({ ...achForm, description: e.target.value })}
                  className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddAchModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-[#064e3b] hover:bg-[#0b6e54] text-white px-5 py-2 rounded-xl font-bold shadow"
                >
                  حفظ الإنجاز
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

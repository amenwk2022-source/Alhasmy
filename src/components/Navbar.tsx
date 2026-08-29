import React, { useState } from 'react';
import { TabType, UserProfile } from '../types';
import { 
  Home, 
  GitFork, 
  Sparkles, 
  HeartHandshake, 
  Users, 
  BookOpen, 
  ContactRound, 
  PlusCircle, 
  Menu, 
  X,
  Search,
  CheckCircle2,
  ShieldAlert,
  Newspaper,
  MessageSquare,
  UserCircle,
  Calendar,
  ShieldCheck,
  Lock
} from 'lucide-react';

interface NavbarProps {
  currentTab: TabType;
  currentUser?: UserProfile;
  onSelectTab: (tab: TabType) => void;
  onOpenRegisterModal: () => void;
  onOpenAddNoticeModal: () => void;
  onOpenDonateModal: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  currentUser,
  onSelectTab,
  onOpenRegisterModal,
  onOpenAddNoticeModal,
  onOpenDonateModal,
  searchQuery,
  onSearchChange
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'الرئيسية', icon: <Home className="w-4 h-4" /> },
    { id: 'genealogy', label: 'شجرة النسب والفروع', icon: <GitFork className="w-4 h-4" /> },
    { id: 'admin', label: 'لوحة تحكم الإدارة', icon: <ShieldCheck className="w-4 h-4 text-[#d4af37]" /> },
    { id: 'news', label: 'الأخبار والفعاليات', icon: <Newspaper className="w-4 h-4" /> },
    { id: 'forum', label: 'منتدى النقاش', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'profile', label: 'ملفي الشخصي', icon: <UserCircle className="w-4 h-4" /> },
    { id: 'diwan', label: 'ديوان المناسبات والتهاني', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'fund', label: 'صندوق التكافل والوقف', icon: <HeartHandshake className="w-4 h-4" /> },
    { id: 'council', label: 'المجلس واللجان', icon: <Users className="w-4 h-4" /> },
    { id: 'heritage', label: 'مكتبة التراث والمخطوطات', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'directory', label: 'دليل الأعضاء', icon: <ContactRound className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#064e3b] text-white shadow-xl border-b-4 border-[#d4af37]">
      {/* Top Announcement Bar */}
      <div className="bg-[#043e2f] text-[#d4af37] text-xs py-2 px-4 border-b border-[#0b6e54]/50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-[#d4af37] text-[#064e3b] px-2.5 py-0.5 rounded-full text-[11px] font-extrabold tracking-wide shadow-sm">
              بوابة رسمية
            </span>
            <span className="font-medium text-emerald-50">
              قال رسول الله ﷺ: «مَن أَحَبَّ أَن يُبسَطَ له في رِزقِه، ويُنسَأَ له في أَثَرِه، فَلْيَصِلْ رَحِمَه»
            </span>
          </div>
          <div className="flex items-center gap-4 text-emerald-100/90 text-[11px]">
            <span className="flex items-center gap-1 text-[#d4af37] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> الأمانة العامة - جمهورية مصر العربية
            </span>
            <span className="hidden sm:inline text-emerald-200/70">
              التاريخ الهجري: 29 شعبان 1447 هـ
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Calligraphy Crest */}
          <div 
            id="brand-logo-btn"
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-3.5 cursor-pointer group select-none"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d4af37] via-[#f5d77f] to-[#b59226] p-0.5 shadow-lg flex items-center justify-center transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-[#064e3b] rounded-[14px] flex flex-col items-center justify-center border border-[#d4af37]/40 p-1">
                <span className="text-[#d4af37] text-[10px] font-heritage font-bold leading-none">أشراف</span>
                <span className="text-white text-base font-heritage font-extrabold leading-none tracking-tight">هاشم</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-2xl font-bold font-heritage tracking-wide text-white group-hover:text-[#d4af37] transition-colors">
                  تجمع السادة الأشراف بني هاشم في مصر
                </h1>
                <span className="hidden md:inline-block bg-[#0b6e54] text-[#d4af37] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#d4af37]/30">
                  الأمانة العامة
                </span>
              </div>
              <p className="text-xs text-emerald-100/80 font-light hidden sm:block">
                صلة الرحم • التكاتف الاجتماعي • توثيق الأنساب والتراث في الديار المصرية
              </p>
            </div>
          </div>

          {/* Quick Actions and Search in Header */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Search input */}
            <div className="relative">
              <input
                id="global-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="ابحث عن شخص، عائلة، مشجر، خبر..."
                className="w-64 bg-[#043e2f] text-sm text-white placeholder-emerald-200/50 rounded-xl pl-3 pr-9 py-2 border border-[#0b6e54] focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-[#d4af37] absolute right-3 top-2.5" />
            </div>

            {/* Action buttons */}
            <button
              id="header-profile-btn"
              onClick={() => onSelectTab('profile')}
              className={`text-xs sm:text-sm font-bold px-3 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer border ${
                currentTab === 'profile'
                  ? 'bg-[#d4af37] text-[#064e3b] border-[#d4af37]'
                  : 'bg-white/10 hover:bg-white/20 text-emerald-100 border-white/20'
              }`}
            >
              {currentUser?.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt="" className="w-5 h-5 rounded-full object-cover border border-white/40" referrerPolicy="no-referrer" />
              ) : (
                <UserCircle className="w-4 h-4 text-[#d4af37]" />
              )}
              <span className="hidden xl:inline max-w-[120px] truncate">{currentUser?.fullName.split(' ')[0] || 'ملفي'}</span>
            </button>

            <button
              id="header-register-btn"
              onClick={onOpenRegisterModal}
              className="bg-[#d4af37] hover:brightness-110 text-[#064e3b] text-xs sm:text-sm font-bold px-3.5 py-2.5 rounded-xl shadow-md transition-all duration-200 flex items-center gap-1.5 hover:scale-[1.02] cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden xl:inline">تسجيل انتساب</span>
            </button>

            <button
              id="header-notice-btn"
              onClick={onOpenAddNoticeModal}
              className="bg-[#0b6e54] hover:bg-[#0d9488] text-white text-xs sm:text-sm font-medium px-3 py-2.5 rounded-xl border border-white/10 shadow-sm transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
              <span className="hidden xl:inline">نشر بالديوان</span>
            </button>

            <button
              id="header-donate-btn"
              onClick={onOpenDonateModal}
              className="bg-white/10 hover:bg-white/20 text-[#d4af37] text-xs sm:text-sm font-medium px-3 py-2.5 rounded-xl border border-[#d4af37]/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <HeartHandshake className="w-4 h-4 text-[#d4af37]" />
              <span className="hidden xl:inline">التكافل</span>
            </button>
          </div>

          {/* Mobile buttons */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              id="mobile-search-toggle"
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-xl bg-[#043e2f] text-emerald-100 hover:text-[#d4af37] border border-[#0b6e54]"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#043e2f] text-emerald-100 hover:text-[#d4af37] border border-[#0b6e54]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Search Bar Expandable */}
        {searchOpen && (
          <div className="lg:hidden pb-3">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="ابحث عن شخص، عائلة، مشجر، خبر..."
                className="w-full bg-[#043e2f] text-sm text-white placeholder-emerald-200/50 rounded-xl pl-3 pr-9 py-2 border border-[#0b6e54] focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
              />
              <Search className="w-4 h-4 text-[#d4af37] absolute right-3 top-2.5" />
            </div>
          </div>
        )}

        {/* Desktop Navigation Tabs */}
        <nav className="hidden lg:flex items-center space-x-reverse space-x-1 border-t border-[#0b6e54]/50 py-2.5">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#d4af37] text-[#064e3b] font-bold shadow-md'
                    : 'text-emerald-100/90 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#043e2f] border-t border-[#0b6e54] px-4 pt-3 pb-6 space-y-2 animate-fadeIn">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-tab-${item.id}`}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#d4af37] text-[#064e3b] font-bold shadow-md'
                    : 'text-emerald-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-3 border-t border-[#0b6e54] flex flex-col gap-2">
            <button
              id="mobile-register-btn"
              onClick={() => {
                onOpenRegisterModal();
                setMobileMenuOpen(false);
              }}
              className="w-full bg-[#d4af37] text-[#064e3b] py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow"
            >
              <PlusCircle className="w-4 h-4" />
              <span>تسجيل انتساب جديد</span>
            </button>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                id="mobile-notice-btn"
                onClick={() => {
                  onOpenAddNoticeModal();
                  setMobileMenuOpen(false);
                }}
                className="bg-[#0b6e54] text-white py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 border border-white/10"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>نشر بالديوان</span>
              </button>

              <button
                id="mobile-fund-btn"
                onClick={() => {
                  onOpenDonateModal();
                  setMobileMenuOpen(false);
                }}
                className="bg-white/10 text-[#d4af37] py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 border border-[#d4af37]/30"
              >
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>صندوق التكافل</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

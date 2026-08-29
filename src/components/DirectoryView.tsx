import React, { useState } from 'react';
import { RegisteredMember, FamilyBranch } from '../types';
import { 
  ContactRound, 
  Search, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  UserCheck, 
  PlusCircle, 
  CreditCard, 
  Award,
  QrCode,
  CheckCircle,
  Filter
} from 'lucide-react';

interface DirectoryViewProps {
  members: RegisteredMember[];
  branches: FamilyBranch[];
  onOpenRegisterModal: () => void;
  onViewMemberCard: (member: RegisteredMember) => void;
  onViewCertificate?: (member: RegisteredMember) => void;
}

export const DirectoryView: React.FC<DirectoryViewProps> = ({
  members,
  branches,
  onOpenRegisterModal,
  onViewMemberCard,
  onViewCertificate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');

  const cities = Array.from(new Set(members.map(m => m.city)));

  const filteredMembers = members.filter((m) => {
    const matchesBranch = selectedBranch === 'all' || m.branch.includes(selectedBranch);
    const matchesCity = selectedCity === 'all' || m.city === selectedCity;
    const matchesSearch = 
      m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.subClan && m.subClan.toLowerCase().includes(searchTerm.toLowerCase())) ||
      m.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.membershipNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesBranch && matchesCity && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-l from-[#064e3b] via-[#0b6e54] to-[#0d9488] text-white p-6 sm:p-10 rounded-3xl shadow-xl border-b-4 border-[#d4af37] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-black/20 backdrop-blur-md text-[#d4af37] text-xs font-bold px-3.5 py-1 rounded-full border border-[#d4af37]/40 shadow-inner">
            <ContactRound className="w-3.5 h-3.5" />
            <span>السجل الرقمي للأعضاء والبيوت الموثقة</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold font-heritage text-white">
            دليل أعضاء تجمع بني هاشم
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            دليل يوثق أسماء المنتسبين وفروعهم ومقار إقامتهم لتسهيل التواصل والصلة والتعاون المشترك، مع إمكانية استعراض بطاقة الانتساب الرقمية الموثقة وشهادة الانضمام الرسمية.
          </p>
        </div>

        <button
          onClick={onOpenRegisterModal}
          className="bg-[#d4af37] hover:brightness-110 text-[#064e3b] font-bold text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-lg transition-all duration-200 flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-5 h-5" />
          <span>تسجيل عضوية جديدة</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-4 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        {/* Branch Filter Select */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="bg-[#fafaf7] text-xs text-slate-800 rounded-2xl px-3.5 py-2.5 border border-slate-300 focus:ring-2 focus:ring-[#064e3b] focus:bg-white"
          >
            <option value="all">جميع الفروع والبيوت الهاشمية</option>
            {branches.map((b) => (
              <option key={b.id} value={b.name}>{b.name}</option>
            ))}
          </select>

          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="bg-[#fafaf7] text-xs text-slate-800 rounded-2xl px-3.5 py-2.5 border border-slate-300 focus:ring-2 focus:ring-[#064e3b] focus:bg-white"
          >
            <option value="all">جميع المدن والمحافظات</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="relative min-w-[280px]">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث بالاسم، رقم العضوية، أو الفرع..."
            className="w-full bg-[#fafaf7] text-xs sm:text-sm text-slate-900 placeholder-slate-400 rounded-2xl pl-3 pr-9 py-2.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#064e3b] focus:bg-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
        </div>

      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className="bg-white border border-slate-200/90 hover:border-[#064e3b]/50 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold bg-[#fafaf7] text-slate-700 px-2.5 py-0.5 rounded-lg border border-slate-200">
                  {member.membershipNumber}
                </span>

                {member.isVerified && (
                  <span className="bg-emerald-50 text-[#064e3b] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#d4af37]" /> موثق ومعتمد
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-bold text-base text-[#064e3b] leading-snug">
                  {member.fullName}
                </h3>
                <p className="text-xs text-[#d4af37] font-bold mt-0.5">
                  {member.branch}
                </p>
                {member.subClan && (
                  <p className="text-[11px] text-slate-500 font-medium">
                    البيت / العشيرة: {member.subClan}
                  </p>
                )}
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#064e3b]" />
                  <span>{member.city} - {member.country}</span>
                </div>
                {member.generation && (
                  <div className="text-[11px] text-slate-400">
                    الجيل النسبي: الجيل رقم {member.generation}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-2">
              <button
                onClick={() => onViewMemberCard(member)}
                className="flex-1 w-full bg-[#064e3b] hover:bg-[#0b6e54] text-white py-2.5 px-3 rounded-xl text-xs font-bold transition-all shadow flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>الكارنيه الرقمي</span>
              </button>

              {onViewCertificate && (
                <button
                  onClick={() => onViewCertificate(member)}
                  className="flex-1 w-full bg-[#fafaf7] hover:bg-[#f6f2e8] text-[#064e3b] border border-[#d4af37]/50 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>شهادة الانضمام</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { CouncilMember } from '../types';
import { 
  Users, 
  ShieldCheck, 
  MapPin, 
  Mail, 
  Phone, 
  Award, 
  BookOpen, 
  Calendar, 
  CheckCircle, 
  FileText, 
  ChevronDown, 
  ChevronUp,
  MessageCircle
} from 'lucide-react';

interface CouncilViewProps {
  councilMembers: CouncilMember[];
}

export const CouncilView: React.FC<CouncilViewProps> = ({ councilMembers }) => {
  const [selectedCommittee, setSelectedCommittee] = useState<string>('all');
  const [contactMember, setContactMember] = useState<CouncilMember | null>(null);
  const [contactMessage, setContactMessage] = useState('');
  const [contactSender, setContactSender] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  const committees = [
    { id: 'all', label: 'جميع أعضاء المجلس واللجان' },
    { id: 'مجلس الأعيان', label: 'مجلس الأعيان والحكماء' },
    { id: 'الأمانة العامة', label: 'الأمانة العامة' },
    { id: 'لجنة الأنساب والتوثيق', label: 'لجنة الأنساب والتوثيق' },
    { id: 'لجنة التكافل الاجتماعي', label: 'لجنة التكافل والوقف' },
    { id: 'لجنة الشباب والتعليم', label: 'لجنة الشباب والتعليم' },
  ];

  const filteredMembers = councilMembers.filter((m) => {
    if (selectedCommittee === 'all') return true;
    return m.committee === selectedCommittee;
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactSender.trim() || !contactMessage.trim()) return;
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setContactMember(null);
      setContactMessage('');
      setContactSender('');
    }, 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-l from-[#064e3b] via-[#0b6e54] to-[#0d9488] text-white p-6 sm:p-10 rounded-3xl shadow-xl border-b-4 border-[#d4af37] space-y-4">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-black/20 backdrop-blur-md text-[#d4af37] text-xs font-bold px-3.5 py-1 rounded-full border border-[#d4af37]/40 shadow-inner">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>الحوكمة المؤسسية والقيادة العائلية</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold font-heritage text-white">
            مجلس الأعيان واللجان التنفيذية
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            يضم المجلس نخبة من وجهاء وأعيان وعلماء ومؤرخي بني هاشم، يعملون تطوعاً واحتساباً على رعاية شؤون الأسرة، وحفظ أنسابها وتراثها، وإدارة مشروعات التكافل الاجتماعي بكفاءة وأمانة.
          </p>
        </div>
      </div>

      {/* Organizational Charter & Core Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-2.5">
          <div className="flex items-center gap-2.5 text-[#064e3b]">
            <Award className="w-5 h-5 text-[#d4af37]" />
            <h3 className="font-bold text-sm">الرؤية والرسالة</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            أن يكون تجمع بني هاشم نموذجاً رائداً في الترابط الأسري وصلة الأرحام والعمل التكافلي المؤسسي، وصون الهوية والتراث التاريخي لآل البيت النبوي.
          </p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-2.5">
          <div className="flex items-center gap-2.5 text-[#064e3b]">
            <Users className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-sm">أهداف المجلس العامة</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            توطيد أواصر المودة والتعارف بين أجيال الأسرة في مختلف الأقطار، فض النزاعات وإصلاح ذات البين، ودعم ورعاية المتفوقين والمحتاجين.
          </p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-2.5">
          <div className="flex items-center gap-2.5 text-[#064e3b]">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-sm">أمانة النسب والتوثيق</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            تحري الدقة العلمية الصارمة في فحص وتوثيق المشجرات وصون الأنساب من الدخائل وفق المنهج التوثيقي المحقق المعترف به لدى نسّابة الحجاز والأمة.
          </p>
        </div>
      </div>

      {/* Committee Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200/80 scrollbar-none">
        {committees.map((com) => {
          const isActive = selectedCommittee === com.id;
          return (
            <button
              key={com.id}
              onClick={() => setSelectedCommittee(com.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#064e3b] text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {com.label}
            </button>
          );
        })}
      </div>

      {/* Council Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className="bg-white border border-slate-200/90 hover:border-[#064e3b]/50 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#064e3b] via-[#0b6e54] to-[#043e2f] flex items-center justify-center text-[#d4af37] font-heritage font-bold text-xl shadow-md border border-[#d4af37]/30">
                  {member.name.split(' ')[1]?.[0] || 'هـ'}
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#064e3b] leading-tight">
                    {member.name}
                  </h3>
                  <p className="text-xs text-[#d4af37] font-bold mt-0.5">
                    {member.role}
                  </p>
                  <span className="text-[11px] text-slate-400">
                    {member.branch}
                  </span>
                </div>
              </div>

              <div className="bg-[#fcfbf7] p-3.5 rounded-2xl border border-slate-200/70 text-xs text-slate-600 leading-relaxed">
                {member.bio}
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#064e3b]" /> {member.location}
                </span>
                <span className="bg-emerald-50 text-[#064e3b] font-semibold px-2.5 py-0.5 rounded-full text-[10px] border border-emerald-200">
                  {member.committee}
                </span>
              </div>

              <button
                onClick={() => setContactMember(member)}
                className="w-full bg-[#fafaf7] hover:bg-emerald-50 text-[#064e3b] hover:text-[#0b6e54] border border-slate-200 hover:border-[#064e3b] py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>طلب استشارة أو تواصل رسمي</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Contact Member Modal */}
      {contactMember && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold bg-emerald-50 text-[#064e3b] border border-emerald-200 px-3 py-0.5 rounded-full">
                  استمارة تواصل رسمية
                </span>
                <h3 className="text-lg font-bold font-heritage text-[#064e3b] mt-1">
                  مراسلة: {contactMember.name}
                </h3>
                <p className="text-xs text-slate-500">{contactMember.role}</p>
              </div>
              <button
                onClick={() => setContactMember(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {messageSent ? (
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-6 text-center space-y-2">
                <CheckCircle className="w-10 h-10 text-[#064e3b] mx-auto" />
                <h4 className="font-bold text-sm text-[#064e3b]">تم إرسال رسالتكم بنجاح</h4>
                <p className="text-xs text-emerald-800">
                  تم توجيه رسالتكم إلى مكتب {contactMember.name} وسيتم الرد عليكم عبر الهاتف أو البريد.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">اسم المرسل والصفة *</label>
                  <input
                    type="text"
                    required
                    value={contactSender}
                    onChange={(e) => setContactSender(e.target.value)}
                    placeholder="مثال: الشريف عبد الرحمن (من أبناء الفرع الإدريسي)"
                    className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">رقم الهاتف أو البريد الإلكتروني *</label>
                  <input
                    type="text"
                    required
                    placeholder="للتواصل والرد..."
                    className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">موضوع الرسالة / الاستشارة *</label>
                  <textarea
                    rows={4}
                    required
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="اكتب استشارتك أو رسالتك باختصار ووضوح..."
                    className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#064e3b] hover:bg-[#0b6e54] text-white py-3 rounded-2xl font-bold text-xs shadow transition-all cursor-pointer"
                >
                  إرسال الرسالة إلى مكتب العضو
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

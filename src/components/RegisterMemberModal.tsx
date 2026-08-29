import React, { useState } from 'react';
import { FamilyBranch, RegisteredMember } from '../types';
import { ShieldCheck, PlusCircle, User, Phone, Mail, MapPin, CheckCircle2, FileText } from 'lucide-react';

interface RegisterMemberModalProps {
  branches: FamilyBranch[];
  isOpen: boolean;
  onClose: () => void;
  onRegisterSuccess: (member: RegisteredMember) => void;
}

export const RegisterMemberModal: React.FC<RegisterMemberModalProps> = ({
  branches,
  isOpen,
  onClose,
  onRegisterSuccess
}) => {
  const [fullName, setFullName] = useState('');
  const [branch, setBranch] = useState(branches[0]?.name || 'الأشراف الجعافرة (أشراف الصعيد)');
  const [subClan, setSubClan] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('جمهورية مصر العربية');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [lineageNote, setLineageNote] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [newMember, setNewMember] = useState<RegisteredMember | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !city.trim()) return;

    const member: RegisteredMember = {
      id: 'm-' + Date.now(),
      membershipNumber: `BH-EG-1447-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: fullName.trim(),
      branch,
      subClan: subClan.trim() || undefined,
      city: city.trim(),
      country: country.trim(),
      phone: phone.trim(),
      email: email.trim() || 'member@banihashim.org.eg',
      joinDate: '1447/08/28 هـ',
      isVerified: true,
      generation: 39
    };

    setNewMember(member);
    setSubmitted(true);
    onRegisterSuccess(member);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFullName('');
    setSubClan('');
    setCity('');
    setPhone('');
    setEmail('');
    setLineageNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-fadeIn">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="bg-[#fcfbf7] text-[#d4af37] border border-[#d4af37]/40 text-[11px] font-bold px-3 py-1 rounded-full">
              عضوية تجمع بني هاشم
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-heritage text-[#064e3b] mt-1">
              تسجيل انتساب فرد / عائلة جديدة
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {submitted && newMember ? (
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-3xl p-6 sm:p-8 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 bg-[#064e3b] text-[#d4af37] rounded-full flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold font-heritage text-[#064e3b]">
              مبارك، تم تسجيل عضويتكم بنجاح!
            </h3>
            <p className="text-xs sm:text-sm text-emerald-900 max-w-md mx-auto leading-relaxed">
              أهلاً وسهلاً بكم في رحاب تجمع بني هاشم. تم إصدار رقم عضويتكم الرسمي واعتماد بياناتكم في السجل الإلكتروني.
            </p>

            <div className="bg-white p-4 rounded-2xl border border-emerald-200 inline-block text-right space-y-1 text-xs">
              <div><span className="text-slate-500">الاسم:</span> <strong className="text-slate-900">{newMember.fullName}</strong></div>
              <div><span className="text-slate-500">رقم العضوية:</span> <strong className="font-mono text-[#064e3b] font-bold">{newMember.membershipNumber}</strong></div>
              <div><span className="text-slate-500">الفرع:</span> <strong className="text-[#064e3b]">{newMember.branch}</strong></div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleReset}
                className="bg-[#064e3b] hover:bg-[#0b6e54] text-white px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow transition-all cursor-pointer"
              >
                إغلاق والعودة للدليل
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">الاسم الرباعي الكامل مع اللقب *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="مثال: الشريف أحمد بن محمود الجعفري"
                  className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700">الفرع أو السلالة الهاشمية *</label>
                  <span className="text-[10px] text-[#064e3b] font-bold">يمكنك الاختيار أو الكتابة يدوياً</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    list="branches-datalist"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    placeholder="اختر من القائمة أو اكتب الفرع/العائلة هنا مباشرة..."
                    className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b] font-medium"
                  />
                  <datalist id="branches-datalist">
                    {branches.map((b) => (
                      <option key={b.id} value={b.name} />
                    ))}
                    <option value="الأشراف الأدارسة الفاسيين" />
                    <option value="الأشراف السليمانيون" />
                    <option value="الأشراف البازات" />
                    <option value="الأشراف العزازية" />
                    <option value="الأشراف النمويين" />
                    <option value="الأشراف القواسم" />
                    <option value="الأشراف الكيلانية" />
                  </datalist>
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  <span className="text-[10px] text-slate-400">فروع مقترحة سريعة:</span>
                  {branches.slice(0, 4).map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setBranch(b.name)}
                      className={`text-[10px] px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                        branch === b.name
                          ? 'bg-[#064e3b] text-white border-[#064e3b]'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                      }`}
                    >
                      {b.name.split(' ')[1] || b.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">البيت / العشيرة المتفرعة (اختياري)</label>
                <input
                  type="text"
                  value={subClan}
                  onChange={(e) => setSubClan(e.target.value)}
                  placeholder="مثال: آل الجعفري / بيت الإدريسي"
                  className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">الدولة ومقر الإقامة *</label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">المدينة / المحافظة *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="مثال: القاهرة / الإسكندرية / قنا / أسوان / طنطا"
                  className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">رقم الهاتف المصري *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+20 10 0000 0000"
                  className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-bold text-slate-700">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">سلسلة النسب حتى الجد الأقرب / ملاحظات التوثيق</label>
              <textarea
                rows={3}
                value={lineageNote}
                onChange={(e) => setLineageNote(e.target.value)}
                placeholder="مثال: فلان بن فلان بن فلان المنتهي نسبه إلى الشريف..."
                className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
              ></textarea>
            </div>

            <div className="bg-[#fcfbf7] p-3.5 rounded-2xl border border-[#d4af37]/30 text-[11px] text-slate-700 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#d4af37] shrink-0" />
              <span>إقرار: أقر بصحة بيانات الانتساب المدخلة ورغبتي في الانضمام لأنشطة تجمع بني هاشم المباركة.</span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="bg-[#064e3b] hover:bg-[#0b6e54] text-white px-6 py-2.5 rounded-xl font-bold shadow transition-all cursor-pointer"
              >
                اعتماد وتأكيد التسجيل
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

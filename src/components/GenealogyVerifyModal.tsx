import React, { useState } from 'react';
import { FamilyBranch } from '../types';
import { ShieldCheck, CheckCircle2, FileText, Upload, Award } from 'lucide-react';

interface GenealogyVerifyModalProps {
  branches: FamilyBranch[];
  isOpen: boolean;
  onClose: () => void;
}

export const GenealogyVerifyModal: React.FC<GenealogyVerifyModalProps> = ({
  branches,
  isOpen,
  onClose
}) => {
  const [applicantName, setApplicantName] = useState('');
  const [branch, setBranch] = useState(branches[0]?.name || 'الأشراف الأدارسة');
  const [ancestorChain, setAncestorChain] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [documentType, setDocumentType] = useState('مشجر عائلي قديم أو حجة شرعية');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim() || !ancestorChain.trim() || !phone.trim()) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="bg-[#fcfbf7] text-[#d4af37] border border-[#d4af37]/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
              لجنة الأنساب والتوثيق
            </span>
            <h2 className="text-xl font-bold font-heritage text-[#064e3b] mt-1">
              طلب فحص وتوثيق نسب وإصدار مشجر مصدق
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 sm:p-8 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 bg-[#064e3b] text-[#d4af37] rounded-full flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold font-heritage text-[#064e3b]">
              تم تسجيل طلب التحقيق والتوثيق
            </h3>
            <p className="text-xs sm:text-sm text-emerald-900 max-w-md mx-auto leading-relaxed">
              رقم طلب الفحص: <strong className="font-mono text-[#064e3b]">VER-1447-{Math.floor(1000 + Math.random() * 9000)}</strong>. ستقوم الأمانة العلمية للجنة الأنساب بمراجعة السلسلة ومطابقتها مع خزانة المشجرات المعتمدة والتواصل معكم.
            </p>
            <div className="pt-2">
              <button
                onClick={handleReset}
                className="bg-[#064e3b] hover:bg-[#0b6e54] text-white px-6 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="bg-[#fcfbf7] p-4 rounded-2xl border border-[#d4af37]/30 text-slate-700 leading-relaxed space-y-1">
              <span className="font-bold text-[#064e3b] block">ضوابط التوثيق العلمي لدى تجمع بني هاشم:</span>
              <p className="text-[11px] text-slate-600">
                تخضع جميع طلبات التوثيق لمراجعة نسّابين معتمدين بالمقارنة مع أمهات كتب الأنساب والحجج الشرعية المؤرخة وصكوك الأوقاف القديمة.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">الاسم الرباعي لمقدم الطلب *</label>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder="مثال: الشريف إبراهيم بن محمد..."
                  className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700">الفرع المراد التوثيق عليه *</label>
                  <span className="text-[10px] text-[#064e3b] font-bold">اختيار أو كتابة يدوية</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    list="verify-branches-datalist"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    placeholder="اختر أو اكتب الفرع المطلوب التوثيق عليه..."
                    className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b] font-medium"
                  />
                  <datalist id="verify-branches-datalist">
                    {branches.map((b) => (
                      <option key={b.id} value={b.name} />
                    ))}
                    <option value="الأشراف الأدارسة الفاسيين" />
                    <option value="الأشراف السليمانيون" />
                    <option value="الأشراف البازات" />
                    <option value="الأشراف العزازية" />
                    <option value="الأشراف النمويين" />
                    <option value="الأشراف الجعافرة" />
                  </datalist>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">رقم الهاتف للتواصل بمصر *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+20 10 0000 0000"
                  className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">المدينة / المحافظة بمصر *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="مثال: القاهرة / قنا / أسوان / الإسكندرية"
                  className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">سلسلة النسب المتوارثة وصولاً إلى الجد المعروف *</label>
              <textarea
                rows={3}
                required
                value={ancestorChain}
                onChange={(e) => setAncestorChain(e.target.value)}
                placeholder="يرجى ذكر الأسماء بالتسلسل (فلان بن فلان بن فلان...) مع ذكر أي ألقاب أو مراجع محفوظة..."
                className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
              ></textarea>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">المستندات والوثائق المتوفرة للإثبات</label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
              >
                <option>مشجر عائلي قديم أو حجة شرعية تاريخية</option>
                <option>صك وقف أو وصية موثقة</option>
                <option>شهادة نسّابين معتمدين أو إفادة أعيان الفرع</option>
                <option>ذكر في أحد مراجع الأنساب المطبوعة</option>
                <option>طلب بحث وتقصي واستدلال من الصفر</option>
              </select>
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
                className="bg-[#064e3b] hover:bg-[#0b6e54] text-white px-6 py-2.5 rounded-xl font-bold shadow transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Award className="w-4 h-4 text-[#d4af37]" />
                <span>إرسال الطلب إلى لجنة الأنساب</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

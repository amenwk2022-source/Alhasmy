import React, { useState } from 'react';
import { DiwanNotice, NoticeCategory, FamilyBranch } from '../types';
import { Sparkles, CheckCircle2, ShieldCheck, Send } from 'lucide-react';

interface AddNoticeModalProps {
  branches: FamilyBranch[];
  isOpen: boolean;
  onClose: () => void;
  onAddNotice: (notice: DiwanNotice) => void;
}

export const AddNoticeModal: React.FC<AddNoticeModalProps> = ({
  branches,
  isOpen,
  onClose,
  onAddNotice
}) => {
  const [category, setCategory] = useState<NoticeCategory>('أفراح وزواج');
  const [title, setTitle] = useState('');
  const [personName, setPersonName] = useState('');
  const [familyBranch, setFamilyBranch] = useState(branches[0]?.name || 'الأشراف الأدارسة');
  const [city, setCity] = useState('');
  const [content, setContent] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !personName.trim() || !content.trim()) return;

    const notice: DiwanNotice = {
      id: 'notice-' + Date.now(),
      category,
      title: title.trim(),
      personName: personName.trim(),
      familyBranch,
      city: city.trim() || 'القاهرة - مصر',
      content: content.trim(),
      date: 'الآن',
      blessingsCount: 1,
      userBlessed: true,
      comments: []
    };

    onAddNotice(notice);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setTitle('');
      setPersonName('');
      setContent('');
      setCity('');
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="bg-[#fcfbf7] text-[#d4af37] border border-[#d4af37]/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
              ديوان بني هاشم
            </span>
            <h2 className="text-xl font-bold font-heritage text-[#064e3b] mt-1">
              نشر مناسبة أو تهنئة أو تعزية
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
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3 animate-fadeIn">
            <CheckCircle2 className="w-12 h-12 text-[#064e3b] mx-auto" />
            <h3 className="text-xl font-bold font-heritage text-[#064e3b]">
              تم نشر مناسبتكم في الديوان بنجاح!
            </h3>
            <p className="text-xs text-emerald-800">
              ألف مبارك، وأدام الله أفراحكم ومسراتكم وجعل دياركم عامرة بالخير والبركة.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">نوع المناسبة *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as NoticeCategory)}
                className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
              >
                <option value="أفراح وزواج">أفراح وزواج (عقد قران / زفاف)</option>
                <option value="تخرج وتفوق">تخرج وتفوق أكاديمي / درجات علمية</option>
                <option value="مولود جديد">بشارة قدوم مولود جديد</option>
                <option value="ترقية وتكريم">ترقية وظيفية / وسام وتكريم</option>
                <option value="تعزية ومواساة">تعزية ومواساة</option>
                <option value="مجلس وديوان">مجلس وديوان عائلي</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">عنوان المنشور *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: عقد قران الشريف المهندس..."
                className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">صاحب المناسبة / الاسم المعني *</label>
                <input
                  type="text"
                  required
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                  placeholder="مثال: الشريف فيصل بن أحمد"
                  className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700">الفرع أو البيت الهاشمي *</label>
                  <span className="text-[10px] text-[#064e3b] font-bold">اختيار أو كتابة</span>
                </div>
                <input
                  type="text"
                  required
                  list="notice-branches-datalist"
                  value={familyBranch}
                  onChange={(e) => setFamilyBranch(e.target.value)}
                  placeholder="اختر أو اكتب اسم الفرع..."
                  className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                />
                <datalist id="notice-branches-datalist">
                  {branches.map((b) => (
                    <option key={b.id} value={b.name} />
                  ))}
                  <option value="عموم بني هاشم" />
                  <option value="الأشراف الأدارسة الفاسيين" />
                  <option value="الأشراف السليمانيون" />
                  <option value="الأشراف البازات" />
                  <option value="الأشراف العزازية" />
                </datalist>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">المدينة / مكان المناسبة في مصر *</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="مثال: القاهرة / قنا / الإسكندرية - ديوان العائلة"
                className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">نص التهنئة / تفاصيل الخبر *</label>
              <textarea
                rows={4}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="اكتب تفاصيل التهنئة أو المناسبة والدعاء الطيب..."
                className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
              ></textarea>
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
                <Send className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>نشر فوري في الديوان</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

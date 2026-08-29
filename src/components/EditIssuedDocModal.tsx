import React, { useState, useEffect } from 'react';
import { IssuedDocument } from '../types';
import { 
  X, 
  Save, 
  Award, 
  CreditCard, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw, 
  Camera, 
  FileText,
  UserCheck,
  Building,
  Calendar,
  Phone,
  Hash
} from 'lucide-react';
import { PhotoUploadModal } from './PhotoUploadModal';

interface EditIssuedDocModalProps {
  doc: IssuedDocument | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedDoc: IssuedDocument) => void;
  onPreviewCard?: (doc: IssuedDocument) => void;
  onPreviewCert?: (doc: IssuedDocument) => void;
}

export const EditIssuedDocModal: React.FC<EditIssuedDocModalProps> = ({
  doc,
  isOpen,
  onClose,
  onSave,
  onPreviewCard,
  onPreviewCert
}) => {
  const [formData, setFormData] = useState<IssuedDocument | null>(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  useEffect(() => {
    if (doc) {
      setFormData({ ...doc });
    }
  }, [doc]);

  if (!isOpen || !formData) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.recipientName.trim()) {
      alert('يرجى كتابة الاسم الكامل للمستفيد');
      return;
    }
    onSave(formData);
    setSaveSuccessMsg(true);
    setTimeout(() => {
      setSaveSuccessMsg(false);
      onClose();
    }, 900);
  };

  const handleGenerateNewCode = () => {
    const prefix = formData.isMember ? 'BH-EG-1447-' : 'BH-VIP-1447-';
    const newCode = `${prefix}0${Math.floor(100 + Math.random() * 900)}`;
    setFormData(prev => prev ? ({ ...prev, documentNumber: newCode }) : null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border-2 border-[#d4af37] overflow-hidden my-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-l from-[#064e3b] via-[#0b6e54] to-[#043e2f] p-5 sm:p-6 text-white flex items-center justify-between border-b-2 border-[#d4af37]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center text-[#d4af37] shrink-0 shadow">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  formData.isMember 
                    ? 'bg-emerald-800 text-emerald-200 border border-emerald-600' 
                    : 'bg-[#d4af37] text-[#064e3b] font-black'
                }`}>
                  {formData.isMember ? 'عضو بالسجل العام' : 'إصدار لغير الأعضاء (شرفي / زائر)'}
                </span>
                <span className="text-xs font-mono text-emerald-200 bg-emerald-950/60 px-2 py-0.5 rounded">
                  {formData.documentNumber}
                </span>
              </div>
              <h3 className="text-lg sm:text-2xl font-bold font-heritage text-white mt-1">
                تعديل بيانات الشهادة والوثيقة الصادرة
              </h3>
              <p className="text-xs text-emerald-100/90">
                تحديث بيانات المستفيد، سلسلة النسب، الفرع والصورة الشخصية وتطبيق التعديل فوراً على الشهادة والكارنيه
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-xl transition-all cursor-pointer"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert */}
        {saveSuccessMsg && (
          <div className="bg-emerald-100 border-b border-emerald-400 text-emerald-900 px-6 py-3 font-bold text-xs sm:text-sm flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>تم حفظ وتحديث بيانات الوثيقة والشهادة بنجاح!</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Main Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Full Name */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                الاسم الكامل للمستفيد (المطبوع في الشهادة والكارنيه) *
              </label>
              <input
                type="text"
                required
                value={formData.recipientName}
                onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                placeholder="مثال: الشريف الأستاذ الدكتور أحمد بن محمود الجعفري"
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#064e3b] outline-none font-bold text-slate-900 text-sm"
              />
            </div>

            {/* Title / Honorific */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                الصفة / اللقب التكريمي
              </label>
              <input
                type="text"
                list="edit-titles-datalist"
                value={formData.recipientTitle || ''}
                onChange={(e) => setFormData({ ...formData, recipientTitle: e.target.value })}
                placeholder="مثال: الشريف المكرم / عضو شرفي"
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#064e3b] outline-none text-sm font-medium"
              />
              <datalist id="edit-titles-datalist">
                <option value="الشريف المكرم" />
                <option value="عضو شرفي معتمد" />
                <option value="شريف زائر من خارج مصر" />
                <option value="ضيف شرف ملتقى السادة الأشراف" />
                <option value="باحث ومحقق في علم الأنساب الشريفة" />
                <option value="عميد بيت الأشراف" />
              </datalist>
            </div>

            {/* Branch */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                الفرع الهاشمي *
              </label>
              <input
                type="text"
                required
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                placeholder="الفرع الهاشمي..."
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#064e3b] outline-none font-bold text-slate-900 text-sm"
              />
            </div>

            {/* SubClan */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                البيت أو العشيرة المتفرعة
              </label>
              <input
                type="text"
                value={formData.subClan || ''}
                onChange={(e) => setFormData({ ...formData, subClan: e.target.value })}
                placeholder="مثال: البيت الإدريسي / آل الباز"
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#064e3b] outline-none text-sm"
              />
            </div>

            {/* Document Number */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  كود القيد / رقم الوثيقة الرسمي *
                </label>
                <button
                  type="button"
                  onClick={handleGenerateNewCode}
                  className="text-[10px] text-[#064e3b] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-2.5 h-2.5" />
                  توليد كود
                </button>
              </div>
              <input
                type="text"
                required
                value={formData.documentNumber}
                onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#064e3b] outline-none font-mono font-bold text-slate-900 text-sm"
              />
            </div>

            {/* City & Country */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                المدينة والمحافظة / الدولة
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="مثال: القاهرة / جمهورية مصر العربية"
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#064e3b] outline-none text-sm"
              />
            </div>

            {/* Hijri Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                تاريخ الإصدار الهجري
              </label>
              <input
                type="text"
                value={formData.issueDateHijri}
                onChange={(e) => setFormData({ ...formData, issueDateHijri: e.target.value })}
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#064e3b] outline-none text-sm"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                رقم الهاتف / الواتساب
              </label>
              <input
                type="text"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+20 10 1234 5678"
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#064e3b] outline-none text-sm dir-ltr text-right"
              />
            </div>

          </div>

          {/* Lineage Text */}
          <div className="bg-[#fcfbf7] p-4 rounded-2xl border border-[#d4af37]/60 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[#064e3b] flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#d4af37]" />
                صيغة التوثيق وسلسلة النسب الشريف (المطبوعة بقلب الشهادة والكارنيه) *
              </label>
              <span className="text-[10px] text-slate-500 font-medium">قابلة للتعديل والتحرير الكامل</span>
            </div>
            <textarea
              rows={3}
              required
              value={formData.lineageChainSummary || ''}
              onChange={(e) => setFormData({ ...formData, lineageChainSummary: e.target.value })}
              placeholder="سلسلة نسب شريفة متصلة ومحققة إلى الدوحة النبوية المباركة..."
              className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#064e3b] outline-none text-xs sm:text-sm font-heritage leading-relaxed text-slate-800"
            />
          </div>

          {/* Avatar / Photo Setting */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              الصورة الشخصية المعتمدة للكارنيه والشهادة:
            </label>
            <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <img
                src={formData.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'}
                alt="معاينة الصورة"
                className="w-14 h-14 rounded-2xl object-cover border-2 border-[#d4af37] shadow-sm shrink-0"
              />
              
              <button
                type="button"
                onClick={() => setIsPhotoModalOpen(true)}
                className="bg-[#064e3b] hover:bg-[#0b6e54] text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow transition-all"
              >
                <Camera className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>تغيير / رفع وضبط صورة جديدة</span>
              </button>

              <input
                type="text"
                value={formData.avatarUrl || ''}
                onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                placeholder="أو ضع رابط صورة مباشر..."
                className="flex-1 min-w-[220px] text-xs p-2.5 bg-white border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ملاحظات الأمانة العامة والأرشيف
            </label>
            <input
              type="text"
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="مثال: إصدار شرفي معتمد بموجب موافقة لجنة الأنساب"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#064e3b] outline-none text-xs"
            />
          </div>

          {/* Footer Actions */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 pt-4">
            
            <div className="flex flex-wrap items-center gap-2">
              {onPreviewCert && (
                <button
                  type="button"
                  onClick={() => onPreviewCert(formData)}
                  className="bg-[#d4af37] hover:brightness-110 text-[#064e3b] font-black px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Award className="w-4 h-4 text-[#064e3b]" />
                  <span>معاينة الشهادة المحدثة</span>
                </button>
              )}

              {onPreviewCard && (
                <button
                  type="button"
                  onClick={() => onPreviewCard(formData)}
                  className="bg-[#064e3b] hover:bg-[#0b6e54] text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <CreditCard className="w-4 h-4 text-[#d4af37]" />
                  <span>معاينة الكارنيه المحدث</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-all cursor-pointer"
              >
                إلغاء
              </button>

              <button
                type="submit"
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow flex items-center gap-2 cursor-pointer transition-all"
              >
                <Save className="w-4 h-4 text-emerald-200" />
                <span>حفظ التعديلات في السجل</span>
              </button>
            </div>

          </div>

        </form>

      </div>

      {/* Photo Upload & Crop Modal */}
      <PhotoUploadModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        onPhotoSave={(newPhotoUrl) => {
          setFormData(prev => prev ? ({ ...prev, avatarUrl: newPhotoUrl }) : null);
          setIsPhotoModalOpen(false);
        }}
        currentPhotoUrl={formData.avatarUrl}
        title="تكييف وضبط صورة الوثيقة والشهادة"
        subtitle="قص وتكييف الصورة لتظهر متناسقة تماماً في الكارنيه والشهادة الرسمية"
      />
    </div>
  );
};

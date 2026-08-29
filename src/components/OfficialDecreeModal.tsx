import React, { useState, useRef } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Share2, 
  Copy, 
  MessageCircle, 
  Facebook, 
  Loader2, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Sliders, 
  Edit3, 
  Save, 
  UserCheck, 
  FileText,
  BadgeCheck
} from 'lucide-react';
import { toPng, toBlob } from 'html-to-image';
import { OfficialDecree } from '../types';

interface OfficialDecreeModalProps {
  decree: OfficialDecree | null;
  onClose: () => void;
  onUpdateDecree?: (updatedDecree: OfficialDecree) => void;
}

export const OfficialDecreeModal: React.FC<OfficialDecreeModalProps> = ({
  decree,
  onClose,
  onUpdateDecree
}) => {
  const [downloaded, setDownloaded] = useState(false);
  const [theme, setTheme] = useState<'emerald' | 'parchment' | 'royal' | 'gold'>('emerald');
  const [isExportingImage, setIsExportingImage] = useState(false);
  const [shareSuccessMsg, setShareSuccessMsg] = useState<string | null>(null);
  const [isEditingData, setIsEditingData] = useState(false);

  // Editable fields state
  const [title, setTitle] = useState(decree?.title || 'قرار تعيين وتكليف إداري');
  const [decreeNumber, setDecreeNumber] = useState(decree?.decreeNumber || 'قرار رقم (١٤) لسنة ١٤٤٧ هـ');
  const [preamble, setPreamble] = useState(decree?.preamble || '');
  const [articles, setArticles] = useState<string[]>(decree?.articles || []);
  const [appointeeName, setAppointeeName] = useState(decree?.appointeeName || '');
  const [appointeePosition, setAppointeePosition] = useState(decree?.appointeePosition || '');
  const [appointeeBranch, setAppointeeBranch] = useState(decree?.appointeeBranch || '');
  const [signatoryName, setSignatoryName] = useState(decree?.signatoryName || 'الشريف / د. أحمد بن منصور الهاشمي');
  const [signatoryTitle, setSignatoryTitle] = useState(decree?.signatoryTitle || 'الأمين العام لتجمع السادة الأشراف بني هاشم');
  const [issueDateHijri, setIssueDateHijri] = useState(decree?.issueDateHijri || '1447/08/29 هـ');
  const [issueDateGregorian, setIssueDateGregorian] = useState(decree?.issueDateGregorian || '2026/08/29 م');

  const decreeRef = useRef<HTMLDivElement>(null);

  if (!decree) return null;

  const handleSaveDataChanges = () => {
    if (onUpdateDecree) {
      const updated: OfficialDecree = {
        ...decree,
        title,
        decreeNumber,
        preamble,
        articles,
        appointeeName,
        appointeePosition,
        appointeeBranch,
        signatoryName,
        signatoryTitle,
        issueDateHijri,
        issueDateGregorian
      };
      onUpdateDecree(updated);
    }
    setShareSuccessMsg('تم حفظ وتحديث نص القرار بنجاح');
    setIsEditingData(false);
    setTimeout(() => setShareSuccessMsg(null), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadImage = async () => {
    if (!decreeRef.current) return;
    setIsExportingImage(true);

    try {
      // Small timeout to guarantee DOM styles are settled
      await new Promise(resolve => setTimeout(resolve, 200));

      const dataUrl = await toPng(decreeRef.current, {
        cacheBust: true,
        pixelRatio: 2.5,
        quality: 1,
        backgroundColor: '#ffffff'
      });

      const link = document.createElement('a');
      const safeNumber = decreeNumber.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_');
      link.download = `قرار_رسمي_${safeNumber}.png`;
      link.href = dataUrl;
      link.click();

      setDownloaded(true);
      setShareSuccessMsg('تم تنزيل صورة القرار بجودة عالية 300 DPI');
      setTimeout(() => {
        setDownloaded(false);
        setShareSuccessMsg(null);
      }, 4000);
    } catch (err) {
      console.error('Failed to export decree image:', err);
      // Fallback print
      window.print();
    } finally {
      setIsExportingImage(false);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!decreeRef.current) return;
    setIsExportingImage(true);

    try {
      const blob = await toBlob(decreeRef.current, {
        pixelRatio: 2,
        backgroundColor: '#ffffff'
      });

      if (blob && navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setShareSuccessMsg('تم نسخ صورة القرار للحافظة بنجاح!');
        setTimeout(() => setShareSuccessMsg(null), 3500);
      } else {
        throw new Error('Clipboard API not fully supported');
      }
    } catch (err) {
      console.warn('Clipboard write failed, downloading image instead', err);
      handleDownloadImage();
    } finally {
      setIsExportingImage(false);
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `📜 *تجمع السادة الأشراف بني هاشم - جمهورية مصر العربية*\n\n` +
      `📌 *${decreeNumber}*\n` +
      `🔖 *بشأن:* ${title}\n` +
      (decree.isAppointment && appointeeName ? `👤 *الصادر بحقه:* ${appointeeName}\n🎖️ *المنصب:* ${appointeePosition}\n` : '') +
      `📅 *التاريخ:* ${issueDateHijri} (${issueDateGregorian})\n\n` +
      `✍️ *الاعتماد:* ${signatoryName} (${signatoryTitle})\n` +
      `✅ صادر رسميًا ومقيد بالأرشيف العام لتجمع السادة الأشراف بمصر.`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleShareFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  // Theme Styles
  const getThemeContainerClass = () => {
    switch (theme) {
      case 'parchment':
        return 'bg-[#fcf9f2] text-amber-950 border-[#854d0e]';
      case 'royal':
        return 'bg-[#0f172a] text-slate-100 border-[#d4af37]';
      case 'gold':
        return 'bg-[#fbf8ee] text-[#422006] border-[#b45309]';
      case 'emerald':
      default:
        return 'bg-[#fcfdfa] text-slate-900 border-[#064e3b]';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      
      {/* Container Box */}
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-4 sm:p-6 space-y-4 my-auto animate-fadeIn relative">
        
        {/* Floating Notification */}
        {shareSuccessMsg && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#064e3b] text-white px-5 py-2.5 rounded-2xl shadow-2xl border-2 border-[#d4af37] text-xs sm:text-sm font-bold flex items-center gap-2 animate-bounce">
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
            <span>{shareSuccessMsg}</span>
          </div>
        )}

        {/* Modal Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 no-print">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#064e3b] border border-emerald-200 flex items-center justify-center shadow-xs">
              <Award className="w-5 h-5 text-[#d4af37]" />
            </div>
            <div>
              <h3 className="font-heritage font-bold text-base sm:text-lg text-[#064e3b] flex items-center gap-1.5">
                <span>القرار الإداري والرسمي</span>
                <span className="text-xs bg-[#d4af37]/20 text-[#064e3b] border border-[#d4af37]/40 px-2 py-0.5 rounded-full font-mono">
                  {decreeNumber}
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                تجمع السادة الأشراف بني هاشم - جمهورية مصر العربية
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsEditingData(!isEditingData);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                isEditingData ? 'bg-[#064e3b] text-white shadow' : 'bg-emerald-50 hover:bg-emerald-100 text-[#064e3b] border border-emerald-300'
              }`}
              title="تعديل نصوص وبنود القرار مباشرة"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>تعديل نصوص القرار</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Text & Articles Editor Panel */}
        {isEditingData && (
          <div className="bg-[#fcfbf7] p-4 rounded-2xl border-2 border-[#d4af37] text-xs space-y-3 no-print animate-fadeIn shadow-sm">
            <div className="flex items-center justify-between border-b border-[#d4af37]/30 pb-2">
              <span className="font-heritage font-bold text-sm text-[#064e3b] flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-[#d4af37]" />
                محرر نصوص وبنود القرار الإداري:
              </span>
              <span className="text-[10px] text-slate-500">ينعكس التعديل لحظياً على صورة القرار الرسمية</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">رقم القرار</label>
                <input
                  type="text"
                  value={decreeNumber}
                  onChange={(e) => setDecreeNumber(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:ring-1 focus:ring-[#064e3b] outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">عنوان وموضوع القرار</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:ring-1 focus:ring-[#064e3b] outline-none"
                />
              </div>
            </div>

            {decree.isAppointment && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-amber-50/70 p-3 rounded-xl border border-amber-200">
                <div>
                  <label className="block text-[11px] font-bold text-amber-900 mb-1">اسم المعيَّن / المكلَّف</label>
                  <input
                    type="text"
                    value={appointeeName}
                    onChange={(e) => setAppointeeName(e.target.value)}
                    className="w-full p-2 bg-white border border-amber-300 rounded-lg text-xs font-bold text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-amber-900 mb-1">المنصب الإداري</label>
                  <input
                    type="text"
                    value={appointeePosition}
                    onChange={(e) => setAppointeePosition(e.target.value)}
                    className="w-full p-2 bg-white border border-amber-300 rounded-lg text-xs font-bold text-[#064e3b] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-amber-900 mb-1">الفرع الهاشمي</label>
                  <input
                    type="text"
                    value={appointeeBranch}
                    onChange={(e) => setAppointeeBranch(e.target.value)}
                    className="w-full p-2 bg-white border border-amber-300 rounded-lg text-xs font-medium text-slate-900 outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">الديباجة الرسمية (بناءً على...)</label>
              <textarea
                rows={2}
                value={preamble}
                onChange={(e) => setPreamble(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs leading-relaxed text-slate-800 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">مواد وبنود القرار (مادة تلو الأخرى)</label>
              <div className="space-y-2">
                {articles.map((art, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-emerald-800 shrink-0 w-14">مادة ({idx + 1}):</span>
                    <input
                      type="text"
                      value={art}
                      onChange={(e) => {
                        const newArts = [...articles];
                        newArts[idx] = e.target.value;
                        setArticles(newArts);
                      }}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newArts = articles.filter((_, i) => i !== idx);
                        setArticles(newArts);
                      }}
                      className="text-rose-500 hover:text-rose-700 p-1.5 rounded text-xs font-bold"
                      title="حذف المادة"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setArticles([...articles, ''])}
                  className="text-xs font-bold text-[#064e3b] bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-lg transition-all"
                >
                  + إضافة مادة جديدة
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">اسم المعتمد / الموقع</label>
                <input
                  type="text"
                  value={signatoryName}
                  onChange={(e) => setSignatoryName(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">صفة المعتمد</label>
                <input
                  type="text"
                  value={signatoryTitle}
                  onChange={(e) => setSignatoryTitle(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-700 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditingData(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 cursor-pointer"
              >
                إغلاق
              </button>
              <button
                type="button"
                onClick={handleSaveDataChanges}
                className="bg-[#064e3b] hover:bg-[#0b6e54] text-white font-bold px-4 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow cursor-pointer transition-all"
              >
                <Save className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>اعتماد وحفظ التعديلات</span>
              </button>
            </div>
          </div>
        )}

        {/* Action Controls & Theme Selector Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs no-print bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
          {/* Themes */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-bold flex items-center gap-1 text-[11px]">
              <Sliders className="w-3.5 h-3.5 text-[#d4af37]" />
              النمط:
            </span>
            <button
              onClick={() => setTheme('emerald')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                theme === 'emerald' ? 'bg-[#064e3b] text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700'
              }`}
            >
              الزمردي الهاشمي
            </button>
            <button
              onClick={() => setTheme('parchment')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                theme === 'parchment' ? 'bg-[#854d0e] text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700'
              }`}
            >
              المخطوطة الملكية
            </button>
            <button
              onClick={() => setTheme('gold')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                theme === 'gold' ? 'bg-[#b45309] text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700'
              }`}
            >
              الذهبي المعتمد
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              onClick={handleCopyToClipboard}
              disabled={isExportingImage}
              className="bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 px-2.5 py-1.5 rounded-xl font-bold flex items-center gap-1 cursor-pointer transition-all shadow-xs"
              title="نسخ الصورة للحافظة"
            >
              <Copy className="w-3.5 h-3.5 text-[#064e3b]" />
              <span className="hidden sm:inline">نسخ الصورة</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-xl font-bold flex items-center gap-1 cursor-pointer transition-all shadow-xs"
              title="مشاركة عبر واتساب"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>واتساب</span>
            </button>

            <button
              onClick={handleShareFacebook}
              className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1.5 rounded-xl font-bold flex items-center gap-1 cursor-pointer transition-all shadow-xs"
              title="مشاركة عبر فيسبوك"
            >
              <Facebook className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">فيسبوك</span>
            </button>

            <button
              onClick={handlePrint}
              className="bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 px-2.5 py-1.5 rounded-xl font-bold flex items-center gap-1 cursor-pointer transition-all shadow-xs"
              title="طباعة القرار"
            >
              <Printer className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>طباعة</span>
            </button>

            <button
              onClick={handleDownloadImage}
              disabled={isExportingImage}
              className="bg-gradient-to-r from-[#064e3b] to-[#0b6e54] hover:brightness-110 text-white px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-all border border-[#d4af37]"
              title="تحميل صورة القرار بجودة 300 DPI"
            >
              {isExportingImage ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#d4af37]" />
                  <span>جاري التصدير...</span>
                </>
              ) : downloaded ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>تم التنزيل</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>تنزيل القرار (PNG)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* THE OFFICIAL DECREE CANVAS (EXPORTABLE / PRINTABLE) */}
        <div className="overflow-x-auto flex justify-center py-2">
          <div
            ref={decreeRef}
            id="official-decree-canvas"
            dir="rtl"
            className={`w-[780px] min-h-[1060px] p-8 sm:p-10 border-[10px] rounded-2xl relative shadow-2xl overflow-hidden flex flex-col justify-between select-text ${getThemeContainerClass()}`}
            style={{
              fontFamily: "'Amiri', 'Traditional Arabic', serif",
              boxSizing: 'border-box'
            }}
          >
            {/* Islamic Geometric Background Watermark */}
            <div className="absolute inset-0 opacity-[0.035] pointer-events-none flex items-center justify-center">
              <ShieldCheck className="w-[580px] h-[580px] text-[#064e3b]" />
            </div>

            {/* Inner Double Gold Border Accent */}
            <div className="absolute inset-3 border-2 border-[#d4af37]/60 rounded-xl pointer-events-none" />
            <div className="absolute inset-4 border border-[#d4af37]/30 rounded-lg pointer-events-none" />

            {/* Top Ornamental Corners */}
            <div className="absolute top-4 right-4 w-10 h-10 border-t-4 border-r-4 border-[#d4af37] rounded-tr-lg pointer-events-none" />
            <div className="absolute top-4 left-4 w-10 h-10 border-t-4 border-l-4 border-[#d4af37] rounded-tl-lg pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-10 h-10 border-b-4 border-r-4 border-[#d4af37] rounded-br-lg pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-10 h-10 border-b-4 border-l-4 border-[#d4af37] rounded-bl-lg pointer-events-none" />

            {/* Content Wrapper */}
            <div className="relative z-10 flex flex-col justify-between h-full space-y-6">

              {/* 1. Official Header */}
              <div className="text-center space-y-2 border-b-2 border-[#d4af37]/40 pb-4">
                {/* Basmala Calligraphy */}
                <div className="font-heritage text-lg sm:text-xl font-black text-[#064e3b] tracking-wider mb-1">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </div>

                <div className="flex items-center justify-between px-4">
                  {/* Right Header Text */}
                  <div className="text-right space-y-0.5">
                    <div className="text-xs font-bold text-slate-600">جمهورية مصر العربية</div>
                    <div className="text-sm font-heritage font-bold text-[#064e3b]">
                      تجمع السادة الأشراف بني هاشم
                    </div>
                    <div className="text-[11px] font-medium text-slate-500">
                      الأمانة العامة - الهيئة العليا
                    </div>
                  </div>

                  {/* Center Official Golden Emblem */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#064e3b] via-[#0b6e54] to-[#043e2f] border-2 border-[#d4af37] p-1 shadow-md flex items-center justify-center text-center">
                      <div className="w-full h-full rounded-full border border-[#d4af37]/70 flex flex-col items-center justify-center text-[#d4af37]">
                        <span className="text-[9px] font-bold">الأشراف</span>
                        <ShieldCheck className="w-5 h-5 text-[#d4af37]" />
                        <span className="text-[7px] tracking-tighter font-mono">1447 H</span>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-[#064e3b] mt-1 font-mono">
                      ختم الأمانة العامة
                    </span>
                  </div>

                  {/* Left Header Text */}
                  <div className="text-left space-y-0.5">
                    <div className="text-[11px] font-bold text-slate-600 font-mono">
                      التاريخ: {issueDateHijri}
                    </div>
                    <div className="text-[11px] font-medium text-slate-500 font-mono">
                      الموافق: {issueDateGregorian}
                    </div>
                    <div className="text-[10px] text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-mono">
                      سجل القرارات العامة
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Decree Title & Number Banner */}
              <div className="text-center space-y-2">
                <div className="inline-block bg-gradient-to-r from-[#064e3b] via-[#0b6e54] to-[#064e3b] text-white px-8 py-2 rounded-2xl border-2 border-[#d4af37] shadow-md">
                  <h2 className="font-heritage font-bold text-lg sm:text-xl text-[#d4af37] tracking-wide">
                    {decreeNumber}
                  </h2>
                </div>

                <h3 className="font-heritage font-bold text-base sm:text-lg text-slate-900 mt-2">
                  بشأن: <span className="underline decoration-[#d4af37] decoration-2 underline-offset-4">{title}</span>
                </h3>
              </div>

              {/* 3. Appointment Profile Showcase Card (IF isAppointment) */}
              {decree.isAppointment && appointeeName && (
                <div className="bg-gradient-to-r from-emerald-50/80 via-[#fcfbf7] to-amber-50/80 rounded-2xl p-4 border-2 border-[#d4af37] shadow-sm flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {/* Appointee Portrait Photo with Gold Frame */}
                    <div className="relative">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-[#d4af37] shadow-md bg-white p-0.5">
                        <img
                          src={decree.appointeePhotoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'}
                          alt={appointeeName}
                          className="w-full h-full object-cover rounded-xl"
                          crossOrigin="anonymous"
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-[#064e3b] text-[#d4af37] p-1 rounded-full border border-[#d4af37] shadow">
                        <BadgeCheck className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Appointee Details */}
                    <div className="space-y-1 text-right">
                      <div className="text-xs text-slate-500 font-bold">الصادر بحقه قرار التكليف:</div>
                      <h4 className="font-heritage font-black text-lg sm:text-xl text-[#064e3b]">
                        {appointeeName}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 pt-0.5">
                        <span className="bg-[#064e3b] text-[#d4af37] font-bold text-xs px-3 py-1 rounded-lg shadow-xs flex items-center gap-1">
                          <Award className="w-3.5 h-3.5" />
                          <span>المنصب: {appointeePosition}</span>
                        </span>
                        {appointeeBranch && (
                          <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs px-2.5 py-0.5 rounded-lg font-bold">
                            {appointeeBranch}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="hidden sm:flex flex-col items-center justify-center p-3 bg-white/80 rounded-xl border border-[#d4af37]/40 text-center">
                    <UserCheck className="w-6 h-6 text-[#064e3b] mb-1" />
                    <span className="text-[10px] font-bold text-[#064e3b]">معتمد وموثق</span>
                    <span className="text-[9px] text-slate-400 font-mono">قرار ساري</span>
                  </div>
                </div>
              )}

              {/* 4. Legal Preamble */}
              <div className="space-y-2 text-right">
                <div className="text-xs font-bold text-[#064e3b] flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#d4af37]" />
                  <span>ديباجة القرار:</span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-800 font-medium text-justify px-2 bg-slate-50/50 p-2 rounded-xl border border-slate-200/60">
                  {preamble || 'بعد الاطلاع على النظام الأساسي واللائحة التنظيمية لتجمع السادة الأشراف بني هاشم بجمهورية مصر العربية، وحرصاً على تفعيل دور الكفاءات الهاشمية في خدمة أبناء العمومة والمجتمع، وبناءً على ما عرضه مكتب الأمانة العامة، ولما تقتضيه المصلحة العامة، قررنا ما هو آت:'}
                </p>
              </div>

              {/* 5. Articles (المواد التنفيذية) */}
              <div className="space-y-3 text-right">
                <div className="text-xs font-bold text-[#064e3b]">نص مواد القرار:</div>
                <div className="space-y-2.5">
                  {articles.map((art, idx) => (
                    <div
                      key={idx}
                      className="bg-white/80 p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm leading-relaxed text-slate-900 shadow-xs flex items-start gap-2"
                    >
                      <span className="bg-[#064e3b] text-[#d4af37] text-xs font-bold px-2 py-0.5 rounded-md shrink-0 mt-0.5">
                        مادة ({idx + 1})
                      </span>
                      <span className="font-medium text-justify">{art}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. Footer & Signatures & Official Seals */}
              <div className="border-t-2 border-[#d4af37]/40 pt-4 mt-4">
                <div className="flex items-end justify-between px-2">
                  
                  {/* Right Side: Security Seal & QR Code */}
                  <div className="flex items-center gap-3">
                    {/* Golden Circular Seal */}
                    <div className="w-20 h-20 rounded-full border-4 border-dashed border-[#d4af37] p-1 flex items-center justify-center bg-gradient-to-br from-amber-50 to-emerald-50 text-center shadow-inner">
                      <div className="w-full h-full rounded-full border border-[#d4af37] flex flex-col items-center justify-center text-[#064e3b] p-1">
                        <span className="text-[7px] font-bold text-amber-800">الأمانة العامة</span>
                        <ShieldCheck className="w-5 h-5 text-[#d4af37]" />
                        <span className="text-[6px] font-bold font-heritage">تجمع السادة الأشراف</span>
                        <span className="text-[6px] text-slate-500 font-mono">مصر ١٤٤٧هـ</span>
                      </div>
                    </div>

                    <div className="text-right text-[10px] space-y-0.5">
                      <div className="font-bold text-[#064e3b]">الختم الرسمي للأمانة العامة</div>
                      <div className="text-slate-500 font-mono">كود القيد: {decree.id}</div>
                      <div className="text-emerald-700 font-bold">وثيقة نافذة وملزمة</div>
                    </div>
                  </div>

                  {/* Left Side: Signatory & Endorsement */}
                  <div className="text-center space-y-1.5 min-w-[200px]">
                    <div className="text-xs font-bold text-slate-700">يعتمد ويُعمل به،</div>
                    <div className="text-xs font-bold text-[#064e3b]">
                      {signatoryTitle}
                    </div>
                    
                    {/* Signature Calligraphy Graphic */}
                    <div className="h-10 flex items-center justify-center">
                      <div className="font-heritage text-lg text-[#064e3b] font-black italic tracking-wider border-b border-slate-300 pb-0.5 px-4">
                        {signatoryName}
                      </div>
                    </div>
                    
                    <div className="text-[10px] text-slate-400 font-mono">
                      صدر في: {issueDateHijri}
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

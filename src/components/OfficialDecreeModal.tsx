import React, { useState, useRef, useEffect } from 'react';
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
  BadgeCheck,
  HeartHandshake,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Camera,
  Heart,
  QrCode
} from 'lucide-react';
import { toPng, toBlob } from 'html-to-image';
import { OfficialDecree } from '../types';
import { PhotoUploadModal } from './PhotoUploadModal';
import { copyImageBlobToClipboard } from '../utils/clipboard';

interface OfficialDecreeModalProps {
  decree: OfficialDecree | null;
  onClose: () => void;
  onSaveAndRefresh?: (updatedDecree: OfficialDecree) => void;
  onUpdateDecree?: (updatedDecree: OfficialDecree) => void;
}

export const OfficialDecreeModal: React.FC<OfficialDecreeModalProps> = ({
  decree,
  onClose,
  onSaveAndRefresh,
  onUpdateDecree
}) => {
  const [downloaded, setDownloaded] = useState(false);
  const [theme, setTheme] = useState<'emerald' | 'parchment' | 'royal' | 'gold'>('emerald');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isExportingImage, setIsExportingImage] = useState(false);
  const [shareSuccessMsg, setShareSuccessMsg] = useState<string | null>(null);
  const [isEditingData, setIsEditingData] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  // Editable fields state initialized from decree
  const [title, setTitle] = useState(decree?.title || 'قرار تعيين وتكليف إداري');
  const [decreeNumber, setDecreeNumber] = useState(decree?.decreeNumber || 'قرار رقم (٠١) لسنة ١٤٤٧ هـ');
  const [decreeType, setDecreeType] = useState<OfficialDecree['decreeType']>(decree?.decreeType || 'appointment');
  const [isAppointment, setIsAppointment] = useState(decree?.isAppointment ?? true);
  const [isThanksMode, setIsThanksMode] = useState(decree?.decreeType === 'thanks' || decree?.decreeType === 'honorary');
  
  // Photo toggle: true = with photo, false = name only
  const [includePhoto, setIncludePhoto] = useState<boolean>(decree?.includePhoto ?? (!!decree?.appointeePhotoUrl));
  const [appointeePhotoUrl, setAppointeePhotoUrl] = useState(decree?.appointeePhotoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80');

  const [appointeeName, setAppointeeName] = useState(decree?.appointeeName || '');
  const [appointeeTitle, setAppointeeTitle] = useState(decree?.appointeeTitle || 'السيد الشريف');
  const [appointeePosition, setAppointeePosition] = useState(decree?.appointeePosition || 'أمين عام التجمع بمحافظة الجيزة');
  const [appointeeBranch, setAppointeeBranch] = useState(decree?.appointeeBranch || 'الأشراف الجعافرة (أشراف الصعيد)');
  const [appointeeCity, setAppointeeCity] = useState(decree?.appointeeCity || 'القاهرة / الجيزة');
  
  const [preamble, setPreamble] = useState(decree?.preamble || '');
  const [articles, setArticles] = useState<string[]>(decree?.articles || []);
  const [signatoryName, setSignatoryName] = useState(decree?.signatoryName || 'الشريف / د. أحمد بن منصور الهاشمي');
  const [signatoryTitle, setSignatoryTitle] = useState(decree?.signatoryTitle || 'الأمين العام لتجمع السادة الأشراف بني هاشم بمصر');
  const [issueDateHijri, setIssueDateHijri] = useState(decree?.issueDateHijri || '1447/08/29 هـ');
  const [issueDateGregorian, setIssueDateGregorian] = useState(decree?.issueDateGregorian || '2026/08/29 م');

  const decreeRef = useRef<HTMLDivElement>(null);

  // Sync state when decree prop changes
  useEffect(() => {
    if (decree) {
      setTitle(decree.title || 'قرار تعيين وتكليف إداري');
      setDecreeNumber(decree.decreeNumber || 'قرار رقم (٠١) لسنة ١٤٤٧ هـ');
      setDecreeType(decree.decreeType || 'appointment');
      setIsAppointment(decree.isAppointment ?? true);
      setIsThanksMode(decree.decreeType === 'thanks' || decree.decreeType === 'honorary');
      setIncludePhoto(decree.includePhoto ?? (!!decree.appointeePhotoUrl));
      setAppointeePhotoUrl(decree.appointeePhotoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80');
      setAppointeeName(decree.appointeeName || '');
      setAppointeeTitle(decree.appointeeTitle || 'السيد الشريف');
      setAppointeePosition(decree.appointeePosition || 'أمين عام التجمع بمحافظة الجيزة');
      setAppointeeBranch(decree.appointeeBranch || 'الأشراف الجعافرة (أشراف الصعيد)');
      setAppointeeCity(decree.appointeeCity || 'القاهرة / الجيزة');
      setPreamble(decree.preamble || '');
      setArticles(decree.articles || []);
      setSignatoryName(decree.signatoryName || 'الشريف / د. أحمد بن منصور الهاشمي');
      setSignatoryTitle(decree.signatoryTitle || 'الأمين العام لتجمع السادة الأشراف بني هاشم بمصر');
      setIssueDateHijri(decree.issueDateHijri || '1447/08/29 هـ');
      setIssueDateGregorian(decree.issueDateGregorian || '2026/08/29 م');
    }
  }, [decree]);

  if (!decree) return null;

  const handleSaveDataChanges = () => {
    const updated: OfficialDecree = {
      ...decree,
      title,
      decreeNumber,
      decreeType,
      isAppointment,
      includePhoto,
      appointeeName,
      appointeeTitle,
      appointeePosition,
      appointeeBranch,
      appointeeCity,
      appointeePhotoUrl: includePhoto ? appointeePhotoUrl : undefined,
      preamble,
      articles,
      signatoryName,
      signatoryTitle,
      issueDateHijri,
      issueDateGregorian
    };

    if (onSaveAndRefresh) {
      onSaveAndRefresh(updated);
    } else if (onUpdateDecree) {
      onUpdateDecree(updated);
    }

    setShareSuccessMsg('تم حفظ وتحديث نص القرار وتنسيقه بنجاح');
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
      await new Promise(resolve => setTimeout(resolve, 250));

      const dataUrl = await toPng(decreeRef.current, {
        cacheBust: true,
        pixelRatio: 2.5,
        quality: 1,
        backgroundColor: theme === 'parchment' ? '#fcf8ec' : theme === 'gold' ? '#fdfcf7' : '#ffffff'
      });

      const link = document.createElement('a');
      const safeNumber = decreeNumber.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_');
      link.download = `قرار_رسمي_${safeNumber}.png`;
      link.href = dataUrl;
      link.click();

      setDownloaded(true);
      setShareSuccessMsg('تم تنزيل صورة القرار المنسقة بجودة 300 DPI عالية الدقة');
      setTimeout(() => {
        setDownloaded(false);
        setShareSuccessMsg(null);
      }, 4000);
    } catch (err) {
      console.error('Failed to export decree image:', err);
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
        pixelRatio: 2.2,
        backgroundColor: '#ffffff'
      });

      if (blob) {
        const copied = await copyImageBlobToClipboard(blob);
        if (copied) {
          setShareSuccessMsg('تم نسخ صورة القرار للحافظة بنجاح!');
        } else {
          await handleDownloadImage();
        }
      }
    } catch (err) {
      console.warn('Clipboard write failed, downloading image instead', err);
      handleDownloadImage();
    } finally {
      setIsExportingImage(false);
      setTimeout(() => setShareSuccessMsg(null), 3500);
    }
  };

  const handleShareWhatsApp = () => {
    const isThanks = decreeType === 'thanks' || decreeType === 'honorary';
    const text = encodeURIComponent(
      `📜 *تجمع السادة الأشراف بني هاشم - جمهورية مصر العربية*\n\n` +
      `📌 *${decreeNumber}*\n` +
      `🔖 *الموضوع:* ${title}\n` +
      ((isAppointment || isThanks) && appointeeName ? `👤 *المعني بالقرار:* ${appointeeTitle} / ${appointeeName}\n🎖️ *الصفة:* ${appointeePosition}\n` : '') +
      `📅 *التاريخ:* ${issueDateHijri} (${issueDateGregorian})\n\n` +
      `✍️ *الاعتماد:* ${signatoryName} (${signatoryTitle})\n` +
      `✅ صادر رسمياً ومقيد بالأرشيف العام لتجمع السادة الأشراف بمصر.`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleShareFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  // Quick preset text generator for thanks vs appointment
  const handleApplyPreset = (type: 'thanks' | 'appointment' | 'committee') => {
    if (type === 'thanks') {
      setDecreeType('thanks');
      setIsThanksMode(true);
      setIsAppointment(false);
      setTitle('شكر وتقدير وعرفان ووسام شرف هاشمي');
      setPreamble('تقديراً للجهود المباركة، وعرفاناً بالعطاء المخلص في خدمة أبناء العمومة من السادة الأشراف بني هاشم، وبناءً على ما قدمه من مساهمات جليلة في تعزيز روابط المودة وصلة الرحم، قررنا ما هو آت:');
      setArticles([
        `منح ${appointeeTitle} / ${appointeeName || '[الاسم]'} وسام الشكر والتقدير وشهادة العرفان الهاشمية تقديراً لجهوده المشهودة.`,
        'يُسجل هذا التكريم في سجل الشرف للأمانة العامة بتجمع السادة الأشراف بني هاشم بجمهورية مصر العربية.',
        'يُعمل بهذا القرار من تاريخ صدوره، ويُسلّم للمكرم ويُنشر باللوحة الرسمية.'
      ]);
    } else if (type === 'appointment') {
      setDecreeType('appointment');
      setIsThanksMode(false);
      setIsAppointment(true);
      setTitle('تعيين وتكليف في منصب إداري وتنفيذي');
      setPreamble('بناءً على النظام الأساسي واللائحة التنظيمية لتجمع السادة الأشراف بني هاشم بجمهورية مصر العربية، وحرصاً على تفعيل دور الكفاءات وتطوير العمل الإداري والتواصلي، وبناءً على ما عرضه مكتب الأمانة العامة، قررنا ما هو آت:');
      setArticles([
        `تعيين ${appointeeTitle} / ${appointeeName || '[الاسم]'} في منصب [${appointeePosition || 'المنصب الإداري'}] بتجمع السادة الأشراف بني هاشم.`,
        'يُكلف المذكور بمباشرة مهام المنصب والتنسيق المستمر مع الأمانة العامة بالقاهرة ومتابعة شؤون أبناء العمومة.',
        'يُعمل بهذا القرار من تاريخ صدوره، ويُخطر به أصحاب الشأن واللجان المختصة للعمل بموجبه ونشره باللوحة الرسمية.'
      ]);
    }
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
        return 'bg-[#ffffff] text-slate-900 border-[#064e3b]';
    }
  };

  const isPersonDecree = isAppointment || decreeType === 'appointment' || decreeType === 'thanks' || decreeType === 'honorary' || isThanksMode || !!appointeeName;

  return (
    <div 
      id="official-decree-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      {/* Container Box */}
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full p-4 sm:p-6 space-y-4 my-auto animate-fadeIn relative max-h-[96vh] overflow-y-auto border-2 border-[#d4af37]">
        
        {/* Floating Notification */}
        {shareSuccessMsg && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#064e3b] text-white px-5 py-2.5 rounded-2xl shadow-2xl border-2 border-[#d4af37] text-xs sm:text-sm font-bold flex items-center gap-2 animate-bounce">
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
            <span>{shareSuccessMsg}</span>
          </div>
        )}

        {/* Modal Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 no-print">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#064e3b] text-[#d4af37] border border-[#d4af37] flex items-center justify-center shadow-sm">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heritage font-bold text-base sm:text-lg text-[#064e3b]">
                  {decreeType === 'thanks' || decreeType === 'honorary' ? 'قرار شكر وتقدير وعرفان رسمي' : 'القرار الإداري والرسمي المعتمد'}
                </h3>
                <span className="text-xs bg-[#d4af37]/20 text-[#064e3b] border border-[#d4af37]/50 px-2 py-0.5 rounded-full font-mono font-bold">
                  {decreeNumber}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                تجمع السادة الأشراف بني هاشم - جمهورية مصر العربية
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditingData(!isEditingData)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                isEditingData ? 'bg-[#064e3b] text-white shadow' : 'bg-emerald-50 hover:bg-emerald-100 text-[#064e3b] border border-emerald-300'
              }`}
              title="تعديل نصوص وتنسيق وبنود القرار مباشرة"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{isEditingData ? 'إخفاء محرر النصوص' : 'تعديل نصوص وتنسيق القرار'}</span>
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

        {/* Live Text, Options & Articles Editor Panel */}
        {isEditingData && (
          <div className="bg-[#fcfbf7] p-4 sm:p-5 rounded-2xl border-2 border-[#d4af37] text-xs space-y-4 no-print animate-fadeIn shadow-md">
            <div className="flex flex-wrap items-center justify-between border-b border-[#d4af37]/30 pb-3 gap-2">
              <span className="font-heritage font-bold text-sm sm:text-base text-[#064e3b] flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#d4af37]" />
                <span>محرر وضابط نصوص وبنود القرار الإداري والشكر والتقدير:</span>
              </span>
              
              {/* Presets */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-500">صياغة سريعة:</span>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('thanks')}
                  className="bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold px-2.5 py-1 rounded-lg border border-amber-300 cursor-pointer"
                >
                  ❤️ شكر وتقدير
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('appointment')}
                  className="bg-emerald-100 hover:bg-emerald-200 text-emerald-950 font-bold px-2.5 py-1 rounded-lg border border-emerald-300 cursor-pointer"
                >
                  🎖️ تعيين وتكليف
                </button>
              </div>
            </div>

            {/* Decree Header Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">رقم القرار</label>
                <input
                  type="text"
                  value={decreeNumber}
                  onChange={(e) => setDecreeNumber(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-[#064e3b] focus:ring-1 focus:ring-[#064e3b] outline-none"
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

            {/* Photo / Name-Only Toggle Section */}
            <div className="bg-gradient-to-r from-amber-50/90 to-emerald-50/90 p-4 rounded-xl border border-amber-300 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-[#064e3b] flex items-center gap-1">
                    <UserCheck className="w-4 h-4 text-[#d4af37]" />
                    خيارات عرض الشخص المعني (في التعيين أو الشكر والتقدير):
                  </span>
                </div>

                {/* THE CORE OPTION REQUESTED BY USER: Photo + Name VS Name Only */}
                <div className="bg-white p-1 rounded-xl border border-amber-300 flex items-center gap-1 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setIncludePhoto(true)}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                      includePhoto 
                        ? 'bg-[#064e3b] text-[#d4af37] shadow' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>إضافة اسم الشخص وصورته الشخصية</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIncludePhoto(false)}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                      !includePhoto 
                        ? 'bg-[#064e3b] text-[#d4af37] shadow' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>إضافة اسم الشخص فقط (بدون صورة)</span>
                  </button>
                </div>
              </div>

              {/* Person Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                {includePhoto && (
                  <div className="sm:col-span-3 flex flex-col items-center justify-center p-2 bg-white rounded-xl border border-amber-200 text-center">
                    <img
                      src={appointeePhotoUrl}
                      alt="Portrait"
                      className="w-16 h-20 object-cover rounded-lg border border-[#d4af37] mb-1.5 shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setIsPhotoModalOpen(true)}
                      className="bg-[#064e3b] text-[#d4af37] hover:text-white px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Camera className="w-3 h-3" />
                      <span>تغيير الصورة</span>
                    </button>
                  </div>
                )}

                <div className={`${includePhoto ? 'sm:col-span-9' : 'sm:col-span-12'} grid grid-cols-1 sm:grid-cols-3 gap-2.5`}>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">اللقب الشرفي</label>
                    <input
                      type="text"
                      value={appointeeTitle}
                      onChange={(e) => setAppointeeTitle(e.target.value)}
                      placeholder="السيد الشريف / فضيلة الشيخ"
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">الاسم الكامل للمكرم / المعيَّن *</label>
                    <input
                      type="text"
                      value={appointeeName}
                      onChange={(e) => setAppointeeName(e.target.value)}
                      placeholder="مثال: الشريف الأستاذ الدكتور محمود بن إسماعيل الجعفري"
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-[#064e3b] outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">المنصب أو حيثية الشكر والتقدير *</label>
                    <input
                      type="text"
                      value={appointeePosition}
                      onChange={(e) => setAppointeePosition(e.target.value)}
                      placeholder="مثال: أمين عام التجمع / تقديراً لجهوده في خدمة الأنساب والتكافل"
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">الفرع الهاشمي</label>
                    <input
                      type="text"
                      value={appointeeBranch}
                      onChange={(e) => setAppointeeBranch(e.target.value)}
                      placeholder="الأشراف الجعافرة / الأدارسة..."
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Preamble */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">الديباجة الرسمية (بناءً على الصلاحيات واللوائح...)</label>
              <textarea
                rows={2}
                value={preamble}
                onChange={(e) => setPreamble(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs leading-relaxed text-slate-800 outline-none"
              />
            </div>

            {/* Articles */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold text-slate-700">مواد وبنود القرار التنفيذية:</label>
                <button
                  type="button"
                  onClick={() => setArticles([...articles, ''])}
                  className="text-xs font-bold text-[#064e3b] bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-lg transition-all cursor-pointer flex items-center gap-1"
                >
                  <span>+ إضافة مادة جديدة</span>
                </button>
              </div>

              <div className="space-y-2">
                {articles.map((art, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-emerald-800 shrink-0 w-16">مادة ({idx + 1}):</span>
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
                    {articles.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newArts = articles.filter((_, i) => i !== idx);
                          setArticles(newArts);
                        }}
                        className="text-rose-500 hover:text-rose-700 p-1 rounded text-xs font-bold cursor-pointer"
                        title="حذف المادة"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Signatory & Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-200">
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
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">التاريخ الهجري</label>
                <input
                  type="text"
                  value={issueDateHijri}
                  onChange={(e) => setIssueDateHijri(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-700 outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">التاريخ الميلادي</label>
                <input
                  type="text"
                  value={issueDateGregorian}
                  onChange={(e) => setIssueDateGregorian(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-700 outline-none font-mono"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditingData(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 cursor-pointer"
              >
                إغلاق المحرر
              </button>
              <button
                type="button"
                onClick={handleSaveDataChanges}
                className="bg-[#064e3b] hover:bg-[#0b6e54] text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow cursor-pointer transition-all"
              >
                <Save className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>اعتماد وحفظ التعديلات والتنسيق</span>
              </button>
            </div>
          </div>
        )}

        {/* Action Controls & Theme Selector & Zoom Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs no-print bg-slate-50 p-3 rounded-2xl border border-slate-200">
          
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
              المخطوطة التراثية
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

          {/* Zoom Controller */}
          <div className="hidden sm:flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setZoomLevel(prev => Math.max(60, prev - 10))}
              className="p-1 text-slate-600 hover:text-[#064e3b] rounded"
              title="تصغير المعاينة"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-bold font-mono px-1.5 text-slate-700">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(120, prev + 10))}
              className="p-1 text-slate-600 hover:text-[#064e3b] rounded"
              title="تكبير المعاينة"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(100)}
              className="p-1 text-[10px] font-bold text-[#064e3b] hover:bg-slate-100 rounded"
              title="إعادة للوضع الافتراضي"
            >
              100%
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              onClick={handleCopyToClipboard}
              disabled={isExportingImage}
              className="bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 cursor-pointer transition-all shadow-xs"
              title="نسخ الصورة للحافظة"
            >
              <Copy className="w-3.5 h-3.5 text-[#064e3b]" />
              <span className="hidden sm:inline">نسخ الصورة</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 cursor-pointer transition-all shadow-xs"
              title="مشاركة عبر واتساب"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>واتساب</span>
            </button>

            <button
              onClick={handleShareFacebook}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 cursor-pointer transition-all shadow-xs"
              title="مشاركة عبر فيسبوك"
            >
              <Facebook className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">فيسبوك</span>
            </button>

            <button
              onClick={handlePrint}
              className="bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 cursor-pointer transition-all shadow-xs"
              title="طباعة القرار بصيغة رسمية"
            >
              <Printer className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>طباعة</span>
            </button>

            <button
              onClick={handleDownloadImage}
              disabled={isExportingImage}
              className="bg-gradient-to-r from-[#064e3b] to-[#0b6e54] hover:brightness-110 text-white px-4 py-1.5 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-all border border-[#d4af37]"
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

        {/* ======================================================== */}
        {/* THE OFFICIAL HIGHLY-FORMATTED ROYAL DECREE CANVAS */}
        {/* ======================================================== */}
        <div className="overflow-x-auto flex justify-center py-2 bg-slate-100/60 p-2 sm:p-4 rounded-2xl border border-slate-200">
          <div
            style={{
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'top center',
              transition: 'transform 0.2s ease-in-out'
            }}
          >
            <div
              ref={decreeRef}
              id="official-decree-canvas"
              dir="rtl"
              className={`w-[800px] min-h-[1100px] p-8 sm:p-10 border-[10px] rounded-3xl relative shadow-2xl overflow-hidden flex flex-col justify-between select-text ${getThemeContainerClass()}`}
              style={{
                fontFamily: "'Amiri', 'Traditional Arabic', serif",
                boxSizing: 'border-box'
              }}
            >
              {/* Islamic Geometric Background Watermark */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
                <div className="w-[600px] h-[600px] rounded-full border-[12px] border-[#064e3b] flex items-center justify-center">
                  <span className="font-heritage text-[120px] font-black text-[#064e3b]">هاشم</span>
                </div>
              </div>

              {/* Inner Double Gold Border Accent & Corner Ornaments */}
              <div className="absolute inset-3 border-2 border-[#d4af37]/70 rounded-2xl pointer-events-none" />
              <div className="absolute inset-4 border border-[#d4af37]/40 rounded-xl pointer-events-none" />

              {/* Top Ornamental Corners */}
              <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-[#d4af37] rounded-tr-xl pointer-events-none flex items-start justify-end p-1">
                <span className="text-[#d4af37] text-xs font-bold">❖</span>
              </div>
              <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-[#d4af37] rounded-tl-xl pointer-events-none flex items-start justify-start p-1">
                <span className="text-[#d4af37] text-xs font-bold">❖</span>
              </div>
              <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-[#d4af37] rounded-br-xl pointer-events-none flex items-end justify-end p-1">
                <span className="text-[#d4af37] text-xs font-bold">❖</span>
              </div>
              <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-[#d4af37] rounded-bl-xl pointer-events-none flex items-end justify-start p-1">
                <span className="text-[#d4af37] text-xs font-bold">❖</span>
              </div>

              {/* Content Main Wrapper */}
              <div className="relative z-10 flex flex-col justify-between h-full space-y-5">

                {/* 1. Official Header */}
                <div className="text-center space-y-2 border-b-2 border-[#d4af37]/60 pb-4">
                  {/* Basmala Calligraphy */}
                  <div className="font-heritage text-xl sm:text-2xl font-black text-[#064e3b] tracking-wider mb-1">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </div>

                  <div className="flex items-center justify-between px-3">
                    {/* Right Header Text */}
                    <div className="text-right space-y-0.5 w-1/3">
                      <div className="text-xs font-bold text-slate-700">جمهورية مصر العربية</div>
                      <div className="text-sm font-heritage font-bold text-[#064e3b]">
                        تجمع السادة الأشراف بني هاشم
                      </div>
                      <div className="text-[11px] font-medium text-slate-600">
                        الأمانة العامة - الهيئة العليا
                      </div>
                    </div>

                    {/* Center Official Golden Emblem */}
                    <div className="flex flex-col items-center w-1/3">
                      <div className="w-18 h-18 rounded-full bg-gradient-to-tr from-[#064e3b] via-[#0b6e54] to-[#043e2f] border-2 border-[#d4af37] p-1 shadow-md flex items-center justify-center text-center">
                        <div className="w-full h-full rounded-full border border-[#d4af37]/80 flex flex-col items-center justify-center text-[#d4af37]">
                          <span className="text-[9px] font-bold">الأشراف</span>
                          <ShieldCheck className="w-6 h-6 text-[#d4af37]" />
                          <span className="text-[8px] tracking-tighter font-mono font-bold">1447 H</span>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold text-[#064e3b] mt-1 font-mono">
                        ختم الأمانة العامة
                      </span>
                    </div>

                    {/* Left Header Text */}
                    <div className="text-left space-y-0.5 w-1/3">
                      <div className="text-[11px] font-bold text-slate-700 font-mono">
                        التاريخ: {issueDateHijri}
                      </div>
                      <div className="text-[11px] font-medium text-slate-600 font-mono">
                        الموافق: {issueDateGregorian}
                      </div>
                      <div className="text-[10px] text-amber-900 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-mono inline-block">
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

                  <h3 className="font-heritage font-bold text-base sm:text-lg text-slate-900 mt-1">
                    بشأن: <span className="underline decoration-[#d4af37] decoration-2 underline-offset-4 font-black">{title}</span>
                  </h3>
                </div>

                {/* 3. PERSON SHOWCASE (APPOINTMENT OR APPRECIATION/THANKS) */}
                {isPersonDecree && appointeeName && (
                  <div>
                    {includePhoto ? (
                      /* OPTION A: NAME + PHOTO (اسم المكرم/المعين مع الصورة الشخصية) */
                      <div className="bg-gradient-to-r from-emerald-50/90 via-[#fcfbf7] to-amber-50/90 rounded-2xl p-4 border-2 border-[#d4af37] shadow-sm flex items-center justify-between gap-5">
                        <div className="flex items-center gap-4">
                          {/* Portrait with Golden Arabesque Trim */}
                          <div 
                            onClick={() => setIsPhotoModalOpen(true)}
                            className="relative shrink-0 cursor-pointer group"
                            title="اضغط لتغيير الصورة"
                          >
                            <div className="w-22 h-26 rounded-2xl overflow-hidden border-2 border-[#d4af37] shadow-md bg-white p-0.5 relative group-hover:border-[#064e3b] transition-all">
                              <img
                                src={appointeePhotoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'}
                                alt={appointeeName}
                                className="w-full h-full object-cover rounded-xl"
                                crossOrigin="anonymous"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[9px] font-bold rounded-xl transition-opacity">
                                <Camera className="w-3.5 h-3.5 mb-0.5 text-[#d4af37]" />
                                <span>تغيير</span>
                              </div>
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-[#064e3b] text-[#d4af37] p-1 rounded-full border border-[#d4af37] shadow">
                              <BadgeCheck className="w-4 h-4" />
                            </div>
                          </div>

                          {/* Person Details */}
                          <div className="space-y-1 text-right">
                            <div className="text-xs text-slate-600 font-bold">
                              {decreeType === 'thanks' || decreeType === 'honorary' ? 'المكرم المشهود له بالعطاء:' : 'الصادر بحقه قرار التكليف والتعيين:'}
                            </div>
                            <h4 className="font-heritage font-black text-xl sm:text-2xl text-[#064e3b]">
                              {appointeeTitle} / {appointeeName}
                            </h4>
                            <div className="flex flex-wrap items-center gap-2 pt-0.5">
                              <span className="bg-[#064e3b] text-[#d4af37] font-bold text-xs px-3 py-1 rounded-lg shadow-xs flex items-center gap-1">
                                <Award className="w-3.5 h-3.5" />
                                <span>{appointeePosition}</span>
                              </span>
                              {appointeeBranch && (
                                <span className="bg-amber-100 text-amber-950 border border-amber-300 text-xs px-2.5 py-0.5 rounded-lg font-bold">
                                  {appointeeBranch}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="hidden sm:flex flex-col items-center justify-center p-3 bg-white/90 rounded-xl border border-[#d4af37]/60 text-center shrink-0">
                          {decreeType === 'thanks' || decreeType === 'honorary' ? (
                            <>
                              <HeartHandshake className="w-7 h-7 text-[#064e3b] mb-1" />
                              <span className="text-[10px] font-bold text-[#064e3b]">شكر وعرفان</span>
                              <span className="text-[9px] text-amber-800 font-mono">وسام شرف</span>
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-7 h-7 text-[#064e3b] mb-1" />
                              <span className="text-[10px] font-bold text-[#064e3b]">معتمد وموثق</span>
                              <span className="text-[9px] text-slate-500 font-mono">قرار ساري</span>
                            </>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* OPTION B: NAME ONLY (اسم المكرم/المعين فقط بدون صورة - تنسيق فخم وعريض) */
                      <div className="bg-gradient-to-r from-[#fcfbf7] via-amber-50/70 to-[#fcfbf7] rounded-2xl p-4 border-2 border-[#d4af37] shadow-sm text-center space-y-1.5 relative overflow-hidden">
                        <div className="text-xs text-slate-600 font-bold flex items-center justify-center gap-1.5">
                          <span className="text-[#d4af37]">❖</span>
                          <span>{decreeType === 'thanks' || decreeType === 'honorary' ? 'المكرم المشهود له بالعطاء والتقدير الهاشمي' : 'الصادر بحقه القرار الرسمي'}</span>
                          <span className="text-[#d4af37]">❖</span>
                        </div>
                        
                        <h4 className="font-heritage font-black text-2xl sm:text-3xl text-[#064e3b] py-0.5">
                          {appointeeTitle} / {appointeeName}
                        </h4>

                        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                          <span className="bg-[#064e3b] text-[#d4af37] font-bold text-xs sm:text-sm px-4 py-1 rounded-xl shadow-xs flex items-center gap-1.5 border border-[#d4af37]/60">
                            <Award className="w-4 h-4 text-[#d4af37]" />
                            <span>{appointeePosition}</span>
                          </span>
                          {appointeeBranch && (
                            <span className="bg-amber-100 text-amber-950 border border-amber-300 text-xs px-3 py-1 rounded-xl font-bold">
                              الفرع: {appointeeBranch}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. Legal Preamble (الديباجة) */}
                <div className="space-y-1.5 text-right">
                  <div className="text-xs font-bold text-[#064e3b] flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#d4af37]" />
                    <span>ديباجة وسند القرار:</span>
                  </div>
                  <div className="text-xs sm:text-sm leading-relaxed text-slate-800 font-medium text-justify p-3 bg-slate-50/70 rounded-xl border border-slate-200">
                    {preamble || 'بعد الاطلاع على النظام الأساسي واللائحة التنظيمية لتجمع السادة الأشراف بني هاشم بجمهورية مصر العربية، وحرصاً على تفعيل دور الكفاءات الهاشمية في خدمة أبناء العمومة والمجتمع، وبناءً على ما عرضه مكتب الأمانة العامة، ولما تقتضيه المصلحة العامة، قررنا ما هو آت:'}
                  </div>
                </div>

                {/* 5. Articles (مواد وبنود القرار) */}
                <div className="space-y-2 text-right">
                  <div className="text-xs font-bold text-[#064e3b] flex items-center gap-1">
                    <span>❖</span>
                    <span>نص مواد القرار والتكليف:</span>
                  </div>
                  <div className="space-y-2">
                    {articles.map((art, idx) => (
                      <div
                        key={idx}
                        className="bg-white/90 p-3 rounded-xl border border-slate-200 text-xs sm:text-sm leading-relaxed text-slate-900 shadow-xs flex items-start gap-2.5"
                      >
                        <span className="bg-[#064e3b] text-[#d4af37] text-xs font-bold px-2.5 py-1 rounded-lg shrink-0 mt-0.5 border border-[#d4af37]/50">
                          مادة ({idx + 1})
                        </span>
                        <span className="font-medium text-justify flex-1 pt-0.5">{art}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 6. Footer & Signatures & Official Seals */}
                <div className="border-t-2 border-[#d4af37]/60 pt-4 mt-2">
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
                        <div className="text-emerald-700 font-bold">وثيقة نافذة ومصدقة</div>
                      </div>
                    </div>

                    {/* Left Side: Signatory & Endorsement */}
                    <div className="text-center space-y-1 min-w-[220px]">
                      <div className="text-xs font-bold text-slate-700">يعتمد ويُعمل به رسمياً،</div>
                      <div className="text-xs font-bold text-[#064e3b]">
                        {signatoryTitle}
                      </div>
                      
                      {/* Signature Calligraphy Graphic */}
                      <div className="h-10 flex items-center justify-center">
                        <div className="font-heritage text-lg text-[#064e3b] font-black italic tracking-wider border-b border-slate-300 pb-0.5 px-4">
                          {signatoryName}
                        </div>
                      </div>
                      
                      <div className="text-[10px] text-slate-500 font-mono">
                        القاهرة في: {issueDateHijri}
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Photo Upload & Crop Modal for Appointee/Honoree Photo */}
      <PhotoUploadModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        onSavePhoto={(newUrl) => {
          setAppointeePhotoUrl(newUrl);
          setIncludePhoto(true);
          setIsPhotoModalOpen(false);
          setShareSuccessMsg('تم تحديث صورة المكرم / المعيَّن بنجاح');
          setTimeout(() => setShareSuccessMsg(null), 3000);
        }}
        onPhotoSelected={(newUrl) => {
          setAppointeePhotoUrl(newUrl);
          setIncludePhoto(true);
          setIsPhotoModalOpen(false);
          setShareSuccessMsg('تم تحديث صورة المكرم / المعيَّن بنجاح');
          setTimeout(() => setShareSuccessMsg(null), 3000);
        }}
        currentPhotoUrl={appointeePhotoUrl}
        title="رفع وتعديل صورة المكرم / المعيَّن بالقرار"
        subtitle="قص وتكييف الصورة لتظهر متناسقة تماماً في وثيقة القرار الرسمية"
      />

    </div>
  );
};

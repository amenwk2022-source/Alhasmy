import React, { useState, useRef } from 'react';
import { UserProfile, RegisteredMember } from '../types';
import { 
  ShieldCheck, 
  Award, 
  QrCode, 
  Download, 
  Printer, 
  Check, 
  Sparkles, 
  Sliders, 
  CheckCircle2,
  Share2,
  Copy,
  MessageCircle,
  Loader2,
  Camera,
  Facebook,
  FileCheck2
} from 'lucide-react';
import { toPng, toBlob } from 'html-to-image';
import { PhotoUploadModal } from './PhotoUploadModal';
import { copyImageBlobToClipboard } from '../utils/clipboard';

interface CertificateModalProps {
  member: UserProfile | RegisteredMember | null;
  onClose: () => void;
  onUpdateMemberPhoto?: (photoUrl: string) => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ 
  member, 
  onClose,
  onUpdateMemberPhoto
}) => {
  const [downloaded, setDownloaded] = useState(false);
  const [theme, setTheme] = useState<'emerald' | 'parchment' | 'royal'>('emerald');
  const [showPhoto, setShowPhoto] = useState(true);
  const [customDedication, setCustomDedication] = useState('');
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [isExportingImage, setIsExportingImage] = useState(false);
  const [shareSuccessMsg, setShareSuccessMsg] = useState<string | null>(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string>(() => {
    if (!member) return '';
    return 'avatarUrl' in member && member.avatarUrl ? member.avatarUrl : '';
  });

  const certRef = useRef<HTMLDivElement>(null);

  if (!member) return null;

  const memberName = 'fullName' in member ? member.fullName : ((member as any).name || (member as any).recipientName || 'الشريف المكرم');
  const membershipNo = member.membershipNumber || (member as any).documentNumber || 'BH-EG-1447-0786';
  const branchName = member.branch || 'الأشراف الجعافرة (أشراف الصعيد)';
  const joinDate = 'joinDateHijri' in member ? member.joinDateHijri : ((member as any).joinDate || (member as any).issueDateHijri || '1447/08/29 هـ');
  const lineageChain = ('lineageChainSummary' in member && member.lineageChainSummary)
    ? member.lineageChainSummary 
    : ((member as any).lineageChainText || 'سلسلة شريفة متصلة إلى الدوحة النبوية المباركة وسيد شباب أهل الجنة والجد الجامع هاشم بن عبد مناف، مصدقة ومقيدة بسجلات أمانة الأنساب بجمهورية مصر العربية.');

  const handlePrint = () => {
    window.print();
  };

  const handlePhotoUpdated = (newPhotoUrl: string) => {
    setCurrentAvatarUrl(newPhotoUrl);
    setShowPhoto(true);
    if (onUpdateMemberPhoto) {
      onUpdateMemberPhoto(newPhotoUrl);
    }
    setShareSuccessMsg('تم تكييف وحفظ الصورة الشخصية بنجاح في الشهادة والكارنيه');
    setTimeout(() => setShareSuccessMsg(null), 3500);
  };

  // Standard A4 Portrait dimensions at 300 DPI (2480 x 3508 pixels)
  const A4_WIDTH_300DPI = 2480;
  const A4_HEIGHT_300DPI = 3508;

  // Generate Image Data URL with exact 2480 x 3508 px at 300 DPI
  const generateCertificateImage = async () => {
    if (!certRef.current) return null;
    return await toPng(certRef.current, {
      canvasWidth: A4_WIDTH_300DPI,
      canvasHeight: A4_HEIGHT_300DPI,
      pixelRatio: 3,
      quality: 1,
      cacheBust: true,
      skipFonts: true,
      fontEmbedCSS: '',
      backgroundColor: theme === 'emerald' ? '#fdfcf7' : theme === 'parchment' ? '#fcf8ec' : '#fafaf7'
    });
  };

  // Generate Image Blob with exact 2480 x 3508 px at 300 DPI
  const generateCertificateBlob = async () => {
    if (!certRef.current) return null;
    return await toBlob(certRef.current, {
      canvasWidth: A4_WIDTH_300DPI,
      canvasHeight: A4_HEIGHT_300DPI,
      pixelRatio: 3,
      quality: 1,
      cacheBust: true,
      skipFonts: true,
      fontEmbedCSS: '',
      backgroundColor: theme === 'emerald' ? '#fdfcf7' : theme === 'parchment' ? '#fcf8ec' : '#fafaf7'
    });
  };

  const handleShareAsImage = async () => {
    if (!certRef.current) return;
    setIsExportingImage(true);
    try {
      const blob = await generateCertificateBlob();
      if (!blob) throw new Error('Failed to create image blob');

      const fileName = `شهادة-انتساب-A4-الشريف-${memberName.replace(/\s+/g, '_')}-${membershipNo}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      // Check if native Web Share with files is supported
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `شهادة انتساب الشريف ${memberName}`,
          text: `شهادة انضمام وانتساب السادة الأشراف بني هاشم في مصر (A4 عمودي - 300 DPI) - الشريف ${memberName} (كود القيد: ${membershipNo})`,
          files: [file]
        });
        setShareSuccessMsg('تمت مشاركة صورة الشهادة العمودية A4 بنجاح!');
      } else {
        // Fallback: Download PNG directly
        const dataUrl = await generateCertificateImage();
        if (dataUrl) {
          const link = document.createElement('a');
          link.download = fileName;
          link.href = dataUrl;
          link.click();
        }
        setShareSuccessMsg('تم تحميل شهادة الانتساب كصورة A4 عمودية عالية الدقة (2480×3508 - 300 DPI)');
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Error sharing image:', err);
        try {
          const dataUrl = await generateCertificateImage();
          if (dataUrl) {
            const link = document.createElement('a');
            link.download = `شهادة-الشريف-${memberName.replace(/\s+/g, '_')}-A4.png`;
            link.href = dataUrl;
            link.click();
            setShareSuccessMsg('تم حفظ الشهادة كصورة PNG بجهازك');
          }
        } catch (e) {
          console.error(e);
        }
      }
    } finally {
      setIsExportingImage(false);
      setTimeout(() => setShareSuccessMsg(null), 4000);
    }
  };

  const handleDownloadImageOnly = async () => {
    if (!certRef.current) return;
    setIsExportingImage(true);
    try {
      const dataUrl = await generateCertificateImage();
      if (dataUrl) {
        const link = document.createElement('a');
        link.download = `شهادة-انتساب-A4-الشريف-${memberName.replace(/\s+/g, '_')}-${membershipNo}.png`;
        link.href = dataUrl;
        link.click();
        setShareSuccessMsg('تم تحميل شهادة الانتساب بمقاس A4 عمودي بدقة فائقة (2480×3508 - 300 DPI) جاهزة للطباعة');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsExportingImage(false);
      setTimeout(() => setShareSuccessMsg(null), 4000);
    }
  };

  const handleCopyImageToClipboard = async () => {
    if (!certRef.current) return;
    setIsExportingImage(true);
    try {
      const blob = await generateCertificateBlob();
      if (blob) {
        const copied = await copyImageBlobToClipboard(blob);
        if (copied) {
          setShareSuccessMsg('تم نسخ صورة الشهادة للحافظة بدقة 300 DPI (يمكنك لصقها في أي تطبيق)');
        } else {
          await handleDownloadImageOnly();
          setShareSuccessMsg('تم تحميل صورة الشهادة بجهازك لتعذر النسخ المباشر للحافظة');
        }
      } else {
        await handleDownloadImageOnly();
      }
    } catch (e) {
      console.error(e);
      await handleDownloadImageOnly();
    } finally {
      setIsExportingImage(false);
      setTimeout(() => setShareSuccessMsg(null), 4000);
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `*شهادة انضمام وانتساب السادة الأشراف بني هاشم في مصر (A4 - 300 DPI)*\n` +
      `👤 الاسم: الشريف ${memberName}\n` +
      `📜 الفرع: ${branchName}\n` +
      `🔢 كود القيد: ${membershipNo}\n` +
      `🏛️ أمانة الأنساب والتوثيق - جمهورية مصر العربية\n` +
      `🔗 رابط بوابة السادة الأشراف: https://banihashim.org.eg`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleFacebookShare = async () => {
    if (!certRef.current) return;
    setIsExportingImage(true);
    const fileName = `شهادة-انتساب-A4-الشريف-${memberName.replace(/\s+/g, '_')}-${membershipNo}.png`;

    try {
      const blob = await generateCertificateBlob();
      if (!blob) throw new Error('Failed to generate image blob');

      const file = new File([blob], fileName, { type: 'image/png' });
      const quote = `شهادة انضمام وانتساب السادة الأشراف بني هاشم في مصر - الشريف ${memberName} (كود القيد: ${membershipNo})`;

      // If browser supports sharing image files directly to Facebook / mobile apps
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `شهادة انتساب السادة الأشراف - ${memberName}`,
          text: quote
        });
        setShareSuccessMsg('تم فتح نافذة مشاركة صورة الشهادة A4 بنجاح');
      } else {
        // Fallback for desktop browsers: Download the image file + copy image + open Facebook post creator
        const dataUrl = await generateCertificateImage();
        if (dataUrl) {
          const link = document.createElement('a');
          link.download = fileName;
          link.href = dataUrl;
          link.click();
        }
        await copyImageBlobToClipboard(blob);
        setShareSuccessMsg('تم تحميل صورة الشهادة العمودية A4 بدقة 300 DPI 📸 وجاري فتح فيسبوك لإرفاق الصورة في المنشور');
        
        setTimeout(() => {
          window.open('https://www.facebook.com/', '_blank');
        }, 600);
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Facebook share error:', err);
        await handleDownloadImageOnly();
        window.open('https://www.facebook.com/', '_blank');
      }
    } finally {
      setIsExportingImage(false);
      setTimeout(() => setShareSuccessMsg(null), 5000);
    }
  };

  const handleDownload = () => {
    handleDownloadImageOnly();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <div 
      id="official-certificate-modal-container"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn"
    >
      <div 
        id="official-certificate-modal-body"
        className="bg-white rounded-3xl max-w-4xl w-full p-4 sm:p-7 space-y-5 shadow-2xl border-2 border-[#d4af37] max-h-[96vh] overflow-y-auto"
      >
        
        {/* Modal Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 no-print">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold bg-[#fcfbf7] text-[#d4af37] border border-[#d4af37]/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Award className="w-3 h-3 text-[#d4af37]" />
                وثيقة رسمية معتمدة (A4 عمودي - 300 DPI)
              </span>
              <span className="text-[10px] text-slate-500 font-mono font-bold">
                كود القيد: {membershipNo}
              </span>
            </div>
            <h3 className="text-lg sm:text-2xl font-bold font-heritage text-[#064e3b] mt-1">
              شهادة انضمام وانتساب السادة الأشراف بني هاشم في مصر
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Upload / Adapt Photo Button */}
            <button
              onClick={() => setIsPhotoModalOpen(true)}
              className="bg-emerald-50 hover:bg-emerald-100 text-[#064e3b] border border-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="تعديل وتكييف أبعاد الصورة الشخصية"
            >
              <Camera className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>تكييف الصورة</span>
            </button>

            <button
              onClick={() => setIsCustomizing(!isCustomizing)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-[#064e3b]" />
              <span>{isCustomizing ? 'إخفاء التخصيص' : 'تخصيص الشهادة'}</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 text-base font-bold p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Certificate Customization Toolbar */}
        {isCustomizing && (
          <div className="bg-[#fafaf7] p-4 rounded-2xl border border-amber-200 text-xs space-y-3 no-print animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">طراز الشهادة الملكية:</span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setTheme('emerald')}
                    className={`px-3 py-1 rounded-lg font-bold border transition-all cursor-pointer ${
                      theme === 'emerald' ? 'bg-[#064e3b] text-[#d4af37] border-[#d4af37]' : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    الزمردي الملكي
                  </button>
                  <button
                    onClick={() => setTheme('parchment')}
                    className={`px-3 py-1 rounded-lg font-bold border transition-all cursor-pointer ${
                      theme === 'parchment' ? 'bg-[#fcfbf7] text-[#854d0e] border-[#d4af37]' : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    المخطوطة التراثية
                  </button>
                  <button
                    onClick={() => setTheme('royal')}
                    className={`px-3 py-1 rounded-lg font-bold border transition-all cursor-pointer ${
                      theme === 'royal' ? 'bg-[#0f172a] text-[#d4af37] border-[#d4af37]' : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    الكحلي الإمبراطوري
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showPhoto}
                    onChange={(e) => setShowPhoto(e.target.checked)}
                    className="w-4 h-4 text-[#064e3b] rounded focus:ring-0"
                  />
                  <span>إظهار الصورة الشخصية بالشهادة</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                إضافة إهداء أو تصدير خاص (اختياري):
              </label>
              <input
                type="text"
                value={customDedication}
                onChange={(e) => setCustomDedication(e.target.value)}
                placeholder="مثال: إهداء إلى عميد الأسرة الكريمة تقديراً لجهوده في صلة الرحم وخدمة المجتمع..."
                className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#064e3b] outline-none"
              />
            </div>
          </div>
        )}

        {/* Success / Notification Banner */}
        {shareSuccessMsg && (
          <div className="bg-emerald-50 border-2 border-emerald-500 text-emerald-900 p-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-between gap-2 shadow-lg animate-fadeIn no-print">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{shareSuccessMsg}</span>
            </div>
            <button 
              onClick={() => setShareSuccessMsg(null)}
              className="text-emerald-700 hover:text-emerald-950 font-bold px-2 py-0.5 rounded cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* A4 Format & High Resolution Info Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-[#fcfbf7] border border-[#d4af37]/50 px-4 py-2.5 rounded-2xl text-xs text-[#064e3b] no-print">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-[#d4af37] shrink-0" />
            <span className="font-semibold">
              مقاس الوثيقة: <strong>A4 عمودي أصيل (2480 × 3508 بكسل)</strong> بدقة طباعة <strong>300 DPI</strong> ومطابقة للمواصفات الرسمية.
            </span>
          </div>
          <button
            onClick={() => setIsPhotoModalOpen(true)}
            className="text-[#064e3b] hover:text-[#d4af37] font-bold underline cursor-pointer shrink-0 text-xs flex items-center gap-1"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>تكييف الصورة الشخصية</span>
          </button>
        </div>

        {/* PRINTABLE OFFICIAL A4 VERTICAL CERTIFICATE DOCUMENT CONTAINER */}
        <div 
          ref={certRef}
          id="official-certificate-print" 
          className={`relative rounded-3xl transition-all border-6 sm:border-8 shadow-2xl mx-auto w-full max-w-[720px] aspect-[1/1.414] min-h-[960px] flex flex-col justify-between p-6 sm:p-9 ${
            theme === 'emerald'
              ? 'bg-[#fdfcf7] border-[#064e3b]'
              : theme === 'parchment'
              ? 'bg-[#fcf8ec] border-[#854d0e]'
              : 'bg-[#fafaf7] border-[#0f172a]'
          }`}
        >
          {/* Inner Golden Ornate Border Frame */}
          <div className="border-3 sm:border-4 border-[#d4af37] border-double rounded-2xl p-5 sm:p-8 flex flex-col justify-between h-full relative overflow-hidden space-y-4 sm:space-y-6">
            
            {/* Background Islamic Arabesque Seal & Watermark */}
            <div className="absolute inset-0 opacity-5 flex items-center justify-center pointer-events-none">
              <div className="w-80 h-80 sm:w-[420px] sm:h-[420px] rounded-full border-8 border-[#064e3b] flex items-center justify-center">
                <span className="font-heritage text-8xl sm:text-[140px] font-bold text-[#064e3b]">هاشم</span>
              </div>
            </div>

            {/* Certificate Top Header: State, Secretariat, Basmala & Ayah */}
            <div className="text-center space-y-3 relative z-10">
              
              {/* Header Details */}
              <div className="flex items-center justify-between border-b-2 border-[#d4af37]/40 pb-3">
                <div className="text-right space-y-0.5">
                  <span className="text-[10px] sm:text-xs text-slate-500 font-bold block">جمهورية مصر العربية</span>
                  <span className="text-xs sm:text-sm font-heritage font-bold text-[#064e3b] block">أمانة الأنساب والتوثيق</span>
                </div>

                <div className="text-center px-2">
                  <div className="font-heritage text-lg sm:text-2xl font-bold text-[#d4af37] tracking-widest">
                    بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ
                  </div>
                  <div className="text-xs sm:text-sm font-heritage text-[#064e3b] font-bold italic bg-[#fcfbf7] inline-block px-3 sm:px-4 py-0.5 rounded-full border border-[#d4af37]/40 mt-1 shadow-xs">
                    ﴿ قُل لَّا أَسْأَلُكُمْ عَلَيْهِ أَجْرًا إِلَّا الْمَوَدَّةَ فِي الْقُرْبَىٰ ﴾
                  </div>
                </div>

                <div className="text-left space-y-0.5">
                  <span className="text-[10px] sm:text-xs text-slate-500 font-bold block">رقم القيد والتسجيل</span>
                  <span className="text-xs sm:text-sm font-mono font-bold text-[#064e3b] block">{membershipNo}</span>
                </div>
              </div>

              {/* Certificate Title Banner */}
              <div className="pt-2 space-y-1">
                <div className="inline-flex items-center gap-2">
                  <div className="w-6 sm:w-12 h-0.5 bg-gradient-to-l from-[#d4af37] to-transparent"></div>
                  <h1 className="text-2xl sm:text-4xl font-bold font-heritage text-[#064e3b] tracking-wide">
                    شـهـادة انـضـمـام وانـتـسـاب
                  </h1>
                  <div className="w-6 sm:w-12 h-0.5 bg-gradient-to-r from-[#d4af37] to-transparent"></div>
                </div>
                <p className="text-xs sm:text-sm font-heritage text-[#d4af37] font-bold tracking-wider">
                  سجل السادة الأشراف بني هاشم في جمهورية مصر العربية
                </p>
              </div>

            </div>

            {/* Certificate Body Text - Vertical Rhythm */}
            <div className="space-y-4 sm:space-y-5 text-center relative z-10 py-1 flex-1 flex flex-col justify-center">
              
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-heritage font-medium">
                تـشـهـد الأمانـة العـامـة ولجـنـة تحـقـيـق الأنـسـاب بـأن السـيـد الشـريـف /
              </p>

              {/* Member Full Name and Photo Centerpiece */}
              <div className="flex flex-row items-center justify-center gap-4 sm:gap-6 bg-gradient-to-r from-transparent via-[#f5f3e9] to-transparent py-3 sm:py-4 px-4 sm:px-8 rounded-2xl border-y-2 border-[#d4af37]/60 shadow-xs">
                {showPhoto && currentAvatarUrl && (
                  <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl border-2 border-[#d4af37] overflow-hidden shadow-md shrink-0 bg-white">
                    <img 
                      src={currentAvatarUrl} 
                      alt={memberName} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer" 
                    />
                  </div>
                )}
                <div className="space-y-1 text-right">
                  <h2 className="text-xl sm:text-3xl font-bold font-heritage text-[#064e3b]">
                    {memberName}
                  </h2>
                  <div className="text-xs sm:text-sm text-slate-600 font-bold flex items-center gap-1.5">
                    <span>المنتمي إلى:</span>
                    <span className="text-[#854d0e] font-heritage font-bold text-sm sm:text-base">{branchName}</span>
                  </div>
                </div>
              </div>

              {/* Proclamation Statement */}
              <div className="max-w-2xl mx-auto space-y-3">
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-heritage">
                  قـد ثـبـت صـحـة انـتـسـابـه وانـضـمـامـه الشـريـف إلـى بـيـوت السـادة الأشـراف بـنـي هـاشـم، 
                  بـمـوجـب سـجـلات الأنـسـاب والوثـائـق الشـرعـيـة المـودعـة لـدى الأمـانـة:
                </p>

                {/* Lineage Box */}
                <div className="bg-white/95 p-3.5 sm:p-4 rounded-xl border-2 border-[#d4af37] text-xs sm:text-sm font-heritage font-bold text-[#064e3b] leading-relaxed shadow-sm">
                  « {lineageChain} »
                </div>
              </div>

              {customDedication && (
                <div className="bg-[#fcfbf7] p-3 rounded-xl border border-amber-300 text-xs sm:text-sm font-heritage text-slate-800 italic max-w-xl mx-auto shadow-xs">
                  "{customDedication}"
                </div>
              )}

            </div>

            {/* Certificate Footer: Date, Seals, Signatures, and Official Accreditation */}
            <div className="pt-4 border-t-2 border-[#d4af37]/60 relative z-10 space-y-3">
              
              <div className="grid grid-cols-3 gap-2 sm:gap-6 items-center text-center text-xs">
                {/* Right Signature: Head of Genealogy */}
                <div className="space-y-1">
                  <span className="text-[10px] sm:text-xs text-slate-500 font-bold block">رئيس لجنة الأنساب بمصر</span>
                  <div className="font-heritage text-xs sm:text-base font-bold text-[#064e3b]">
                    الشريف د. إبراهيم بن محمد الجعفري
                  </div>
                  <div className="w-20 sm:w-28 h-0.5 bg-[#d4af37] mx-auto opacity-60"></div>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 block font-mono">توقيع معتمد</span>
                </div>

                {/* Center Stamp: Golden Embossed Seal & QR Code */}
                <div className="flex flex-col items-center justify-center space-y-1.5">
                  <div className="relative">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-3 border-[#d4af37] bg-[#fcfbf7] flex flex-col items-center justify-center text-[#064e3b] font-bold shadow-lg">
                      <ShieldCheck className="w-7 h-7 sm:w-9 sm:h-9 text-[#d4af37]" />
                      <span className="text-[8px] sm:text-[9px] font-heritage font-bold mt-0.5">خاتم الأمانة</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-lg p-1 border border-[#d4af37] shadow-sm">
                      <QrCode className="w-4 h-4 sm:w-5 sm:h-5 text-[#064e3b]" />
                    </div>
                  </div>
                  <span className="text-[10px] sm:text-xs text-slate-600 font-mono font-bold">
                    {joinDate}
                  </span>
                </div>

                {/* Left Signature: Grand Syndicate / Secretary General */}
                <div className="space-y-1">
                  <span className="text-[10px] sm:text-xs text-slate-500 font-bold block">الأمين العام للسادة الأشراف</span>
                  <div className="font-heritage text-xs sm:text-base font-bold text-[#064e3b]">
                    الشريف المستشار يحيى الهاشمي
                  </div>
                  <div className="w-20 sm:w-28 h-0.5 bg-[#d4af37] mx-auto opacity-60"></div>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 block font-mono">اعتماد رسمي</span>
                </div>
              </div>

              {/* Bottom Micro Security Seal */}
              <div className="text-center pt-2 border-t border-[#d4af37]/30 text-[9px] sm:text-[10px] text-slate-500 font-medium">
                وثيقة نسب رسمية صادرة ومصدقة وفق السجلات العامة لأنساب السادة الأشراف بني هاشم بجمهورية مصر العربية
              </div>

            </div>

          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-2 no-print">
          <div className="text-slate-500 text-xs flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>الشهادة بدقة 300 DPI ومقاس A4 عمودي متناسق</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Facebook Share Button (shares full vertical A4 image) */}
            <button
              id="share-facebook-btn"
              onClick={handleFacebookShare}
              disabled={isExportingImage}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer hover:scale-[1.02] disabled:opacity-50"
              title="مشاركة وتصدير صورة الشهادة العمودية مباشرة إلى منشور فيسبوك"
            >
              {isExportingImage ? (
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              ) : (
                <Facebook className="w-4 h-4 text-white" />
              )}
              <span>مشاركة صورة الشهادة على فيسبوك</span>
            </button>

            {/* Native Share as Image Button */}
            <button
              id="share-certificate-image-btn"
              onClick={handleShareAsImage}
              disabled={isExportingImage}
              className="bg-gradient-to-r from-[#064e3b] to-emerald-700 hover:from-emerald-800 hover:to-[#064e3b] text-white px-4 sm:px-5 py-2.5 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer hover:scale-[1.02] border border-[#d4af37]/50 disabled:opacity-50"
              title="مشاركة صورة الشهادة A4 مباشرة عبر الواتساب أو التطبيقات"
            >
              {isExportingImage ? (
                <Loader2 className="w-4 h-4 text-[#d4af37] animate-spin" />
              ) : (
                <Share2 className="w-4 h-4 text-[#d4af37]" />
              )}
              <span>{isExportingImage ? 'جاري تصدير A4...' : 'مشاركة كصورة (A4)'}</span>
            </button>

            {/* Copy Image Button */}
            <button
              onClick={handleCopyImageToClipboard}
              disabled={isExportingImage}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="نسخ الصورة للحافظة للصقها مباشرة في فيسبوك أو واتساب"
            >
              <Copy className="w-4 h-4 text-[#064e3b]" />
              <span className="hidden sm:inline">نسخ الصورة</span>
            </button>

            <button
              onClick={handleWhatsAppShare}
              className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-3.5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-emerald-300"
              title="مشاركة تفاصيل الوثيقة عبر الواتساب"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">واتساب</span>
            </button>

            {/* High Resolution A4 Download */}
            <button
              onClick={handleDownload}
              disabled={isExportingImage}
              className="bg-[#064e3b] hover:bg-[#0b6e54] text-white px-4 sm:px-5 py-2.5 rounded-xl font-bold transition-all shadow flex items-center gap-1.5 cursor-pointer hover:scale-[1.02]"
              title="تحميل شهادة الانتساب بمقاس A4 عمودي بدقة 300 DPI"
            >
              {downloaded ? <Check className="w-4 h-4 text-[#d4af37]" /> : <Download className="w-4 h-4" />}
              <span>{downloaded ? 'تم الحفظ' : 'تحميل A4 (300 DPI)'}</span>
            </button>

            {/* Instant Print A4 Button */}
            <button
              onClick={handlePrint}
              className="bg-[#d4af37] hover:brightness-110 text-[#064e3b] px-4 sm:px-5 py-2.5 rounded-xl font-black transition-all shadow flex items-center gap-1.5 cursor-pointer"
              title="طباعة الوثيقة على ورق A4 عمودي"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة (A4 عمودي)</span>
            </button>
          </div>
        </div>

      </div>

      {/* Photo Upload & Aspect Ratio Adaptation Modal */}
      <PhotoUploadModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        currentPhotoUrl={currentAvatarUrl}
        onSavePhoto={handlePhotoUpdated}
        title="تكييف وضبط صورة شهادة الانتساب"
        subtitle="يقوم النظام بقص وتكييف الصورة لتظهر متناسقة تماماً في الشهادة والكارنيه"
      />
    </div>
  );
};

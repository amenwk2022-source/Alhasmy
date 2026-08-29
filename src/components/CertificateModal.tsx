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
  Layers,
  Facebook
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
  
  // Facebook landscape mode vs Standard Certificate ratio mode
  const [exportFormat, setExportFormat] = useState<'facebook' | 'standard'>('facebook');

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

  // Generate Image Blob or Data URL with optimal social media dimensions
  const generateCertificateImage = async () => {
    if (!certRef.current) return null;
    return await toPng(certRef.current, {
      quality: 0.98,
      pixelRatio: 2.2,
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
      const blob = await toBlob(certRef.current, {
        quality: 0.98,
        pixelRatio: 2.2,
        cacheBust: true,
        skipFonts: true,
        fontEmbedCSS: '',
        backgroundColor: theme === 'emerald' ? '#fdfcf7' : theme === 'parchment' ? '#fcf8ec' : '#fafaf7'
      });

      if (!blob) throw new Error('Failed to create image blob');

      const fileName = `شهادة-انتساب-${memberName.replace(/\s+/g, '_')}-فيسبوك.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      // Check if native Web Share with files is supported
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `شهادة انتساب الشريف ${memberName}`,
          text: `شهادة انضمام وانتساب السادة الأشراف بني هاشم في مصر - الشريف ${memberName} (كود القيد: ${membershipNo})`,
          files: [file]
        });
        setShareSuccessMsg('تمت مشاركة صورة الشهادة بنجاح!');
      } else {
        // Fallback: Download PNG directly
        const dataUrl = await generateCertificateImage();
        if (dataUrl) {
          const link = document.createElement('a');
          link.download = fileName;
          link.href = dataUrl;
          link.click();
        }
        setShareSuccessMsg('تم حفظ شهادة الانتساب كصورة بأبعاد منشورات فيسبوك PNG');
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Error sharing image:', err);
        try {
          const dataUrl = await generateCertificateImage();
          if (dataUrl) {
            const link = document.createElement('a');
            link.download = `شهادة-الشريف-${memberName.replace(/\s+/g, '_')}.png`;
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
        link.download = `شهادة-انتساب-الشريف-${memberName.replace(/\s+/g, '_')}-${membershipNo}.png`;
        link.href = dataUrl;
        link.click();
        setShareSuccessMsg('تم تحميل صورة الشهادة بأبعاد منسقة PNG');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsExportingImage(false);
      setTimeout(() => setShareSuccessMsg(null), 3000);
    }
  };

  const handleCopyImageToClipboard = async () => {
    if (!certRef.current) return;
    setIsExportingImage(true);
    try {
      const blob = await toBlob(certRef.current, {
        quality: 0.98,
        pixelRatio: 2,
        cacheBust: true,
        skipFonts: true,
        fontEmbedCSS: '',
        backgroundColor: theme === 'emerald' ? '#fdfcf7' : theme === 'parchment' ? '#fcf8ec' : '#fafaf7'
      });
      if (blob) {
        const copied = await copyImageBlobToClipboard(blob);
        if (copied) {
          setShareSuccessMsg('تم نسخ صورة الشهادة للحافظة (يمكنك لصقها كمنشور على فيسبوك أو واتساب)');
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
      `*شهادة انضمام وانتساب السادة الأشراف بني هاشم في مصر*\n` +
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
    const fileName = `شهادة-انتساب-الشريف-${memberName.replace(/\s+/g, '_')}-${membershipNo}.png`;

    try {
      const blob = await toBlob(certRef.current, {
        quality: 0.98,
        pixelRatio: 2.2,
        cacheBust: true,
        skipFonts: true,
        fontEmbedCSS: '',
        backgroundColor: theme === 'emerald' ? '#fdfcf7' : theme === 'parchment' ? '#fcf8ec' : '#fafaf7'
      });

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
        setShareSuccessMsg('تم فتح نافذة مشاركة صورة الشهادة بنجاح');
      } else {
        // Fallback for desktop browsers: Download the image file + copy image/quote + open Facebook post creator
        const dataUrl = await generateCertificateImage();
        if (dataUrl) {
          const link = document.createElement('a');
          link.download = fileName;
          link.href = dataUrl;
          link.click();
        }
        await copyImageBlobToClipboard(blob);
        setShareSuccessMsg('تم تحميل صورة الشهادة بنجاح 📸 وجاري فتح فيسبوك لإرفاق الصورة في المنشور');
        
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
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-5xl w-full p-4 sm:p-8 space-y-5 shadow-2xl border-2 border-[#d4af37] max-h-[96vh] overflow-y-auto">
        
        {/* Modal Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 no-print">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold bg-[#fcfbf7] text-[#d4af37] border border-[#d4af37]/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Award className="w-3 h-3 text-[#d4af37]" />
                الوثيقة الرسمية المعتمدة (شهادة الانتساب الشريف)
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

        {/* Certificate Customization Toolbar (Optional) */}
        {isCustomizing && (
          <div className="bg-[#fafaf7] p-4 rounded-2xl border border-amber-200 text-xs space-y-3 no-print animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">طراز الشهادة:</span>
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

              {/* Dimensions Selector */}
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">أبعاد المشاركة:</span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setExportFormat('facebook')}
                    className={`px-2.5 py-1 rounded-lg font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                      exportFormat === 'facebook' 
                        ? 'bg-blue-700 text-white border-blue-800 shadow-xs' 
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    <Facebook className="w-3 h-3 text-[#d4af37]" />
                    <span>أبعاد فيسبوك (1.91:1)</span>
                  </button>
                  <button
                    onClick={() => setExportFormat('standard')}
                    className={`px-2.5 py-1 rounded-lg font-bold border transition-all cursor-pointer ${
                      exportFormat === 'standard' 
                        ? 'bg-[#064e3b] text-[#d4af37] border-[#064e3b] shadow-xs' 
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    وثيقة قياسية A4
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

        {/* Facebook Aspect Ratio Notice / Indicator */}
        <div className="flex items-center justify-between bg-blue-50/70 border border-blue-200 px-4 py-2 rounded-2xl text-xs text-blue-900 no-print">
          <div className="flex items-center gap-2">
            <Facebook className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="font-medium">
              الشهادة مصممة بأبعاد متوازنة ومضبوطة لمنشورات <strong>فيسبوك وواتساب</strong> حتى لا تظهر طويلة أو مشوهة في الخلاصة.
            </span>
          </div>
          <button
            onClick={() => setIsPhotoModalOpen(true)}
            className="text-blue-800 hover:text-blue-950 font-bold underline cursor-pointer shrink-0 text-[11px]"
          >
            تغيير وتكييف الصورة الشخصية
          </button>
        </div>

        {/* PRINTABLE OFFICIAL CERTIFICATE DOCUMENT CONTAINER */}
        {/* Enforce aspect ratio and max width for Facebook and standard view */}
        <div 
          ref={certRef}
          id="official-certificate-print" 
          className={`relative rounded-3xl transition-all border-6 sm:border-8 shadow-2xl print:border-4 print:shadow-none print:m-0 print:p-8 mx-auto ${
            exportFormat === 'facebook' 
              ? 'p-5 sm:p-8 max-w-4xl' 
              : 'p-6 sm:p-12 max-w-4xl'
          } ${
            theme === 'emerald'
              ? 'bg-[#fdfcf7] border-[#064e3b]'
              : theme === 'parchment'
              ? 'bg-[#fcf8ec] border-[#854d0e]'
              : 'bg-[#fafaf7] border-[#0f172a]'
          }`}
        >
          {/* Inner Golden Ornate Border Frame */}
          <div className="border-3 sm:border-4 border-[#d4af37] border-double rounded-2xl p-4 sm:p-7 space-y-4 sm:space-y-5 relative overflow-hidden">
            
            {/* Background Islamic Arabesque Seal & Watermark */}
            <div className="absolute inset-0 opacity-5 flex items-center justify-center pointer-events-none">
              <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-full border-8 border-[#064e3b] flex items-center justify-center">
                <span className="font-heritage text-7xl sm:text-9xl font-bold text-[#064e3b]">هاشم</span>
              </div>
            </div>

            {/* Certificate Top Header */}
            <div className="text-center space-y-2 relative z-10">
              
              {/* Basmala & Ayah */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-[#d4af37]/40 pb-2">
                <div className="text-right space-y-0.5 hidden sm:block">
                  <span className="text-[10px] text-slate-500 font-bold block">جمهورية مصر العربية</span>
                  <span className="text-xs font-heritage font-bold text-[#064e3b] block">أمانة الأنساب والتوثيق</span>
                </div>

                <div className="text-center">
                  <div className="font-heritage text-base sm:text-xl font-bold text-[#d4af37] tracking-widest">
                    بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ
                  </div>
                  <div className="text-[11px] sm:text-xs font-heritage text-[#064e3b] font-bold italic bg-[#fcfbf7] inline-block px-3 py-0.5 rounded-full border border-[#d4af37]/40 mt-1">
                    ﴿ قُل لَّا أَسْأَلُكُمْ عَلَيْهِ أَجْرًا إِلَّا الْمَوَدَّةَ فِي الْقُرْبَىٰ ﴾
                  </div>
                </div>

                <div className="text-left space-y-0.5 hidden sm:block">
                  <span className="text-[10px] text-slate-500 font-bold block">رقم القيد والتسجيل</span>
                  <span className="text-xs font-mono font-bold text-[#064e3b] block">{membershipNo}</span>
                </div>
              </div>

              {/* Certificate Title */}
              <div className="pt-1 space-y-0.5">
                <h1 className="text-xl sm:text-3xl font-bold font-heritage text-[#064e3b] tracking-wide">
                  شـهـادة انـضـمـام وانـتـسـاب
                </h1>
                <p className="text-[11px] sm:text-xs font-heritage text-[#d4af37] font-bold tracking-wider">
                  سجل السادة الأشراف بني هاشم في جمهورية مصر العربية
                </p>
              </div>

            </div>

            {/* Certificate Body Text - Compact and Elegant for Facebook display */}
            <div className="space-y-3 sm:space-y-4 text-center relative z-10 py-1">
              
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-heritage">
                تـشـهـد الأمانـة العـامـة ولجـنـة تحـقـيـق الأنـسـاب بـأن السـيـد الشـريـف /
              </p>

              {/* Member Full Name and Photo in Center Frame */}
              <div className="flex flex-row items-center justify-center gap-4 bg-gradient-to-r from-transparent via-[#f5f3e9] to-transparent py-2.5 px-4 sm:px-6 rounded-2xl border-y border-[#d4af37]/50">
                {showPhoto && currentAvatarUrl && (
                  <div className="w-14 h-18 sm:w-16 sm:h-20 rounded-xl border-2 border-[#d4af37] overflow-hidden shadow-md shrink-0 bg-white">
                    <img 
                      src={currentAvatarUrl} 
                      alt={memberName} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer" 
                    />
                  </div>
                )}
                <div className="space-y-0.5 text-right">
                  <h2 className="text-lg sm:text-2xl font-bold font-heritage text-[#064e3b]">
                    {memberName}
                  </h2>
                  <div className="text-xs text-slate-600 font-bold">
                    المنتمي إلى: <span className="text-[#854d0e]">{branchName}</span>
                  </div>
                </div>
              </div>

              {/* Proclamation text */}
              <div className="max-w-2xl mx-auto space-y-2">
                <p className="text-xs text-slate-700 leading-relaxed font-heritage">
                  قـد ثـبـت صـحـة انـتـسـابـه وانـضـمـامـه الشـريـف إلـى بـيـوت السـادة الأشـراف بـنـي هـاشـم، 
                  بـمـوجـب سـجـلات الأنـسـاب والوثـائـق الشـرعـيـة المـودعـة لـدى الأمـانـة:
                </p>

                {/* Lineage Box */}
                <div className="bg-white/95 p-3 rounded-xl border border-[#d4af37] text-xs sm:text-sm font-heritage font-bold text-[#064e3b] leading-relaxed shadow-xs line-clamp-3 sm:line-clamp-none">
                  « {lineageChain} »
                </div>
              </div>

              {customDedication && (
                <div className="bg-[#fcfbf7] p-2.5 rounded-xl border border-amber-300 text-xs font-heritage text-slate-800 italic max-w-xl mx-auto">
                  "{customDedication}"
                </div>
              )}

            </div>

            {/* Certificate Footer: Date, Seals, and Signatures */}
            <div className="pt-3 border-t-2 border-[#d4af37]/60 grid grid-cols-3 gap-2 sm:gap-6 items-center text-center text-xs relative z-10">
              
              {/* Right Signature: Head of Genealogy */}
              <div className="space-y-1">
                <span className="text-[9px] sm:text-[11px] text-slate-500 font-bold block">رئيس لجنة الأنساب بمصر</span>
                <div className="font-heritage text-xs sm:text-sm font-bold text-[#064e3b]">
                  الشريف د. إبراهيم بن محمد الجعفري
                </div>
                <div className="w-16 sm:w-24 h-0.5 bg-[#d4af37] mx-auto opacity-50"></div>
                <span className="text-[9px] text-slate-400 block font-mono">توقيع معتمد</span>
              </div>

              {/* Center Stamp: Golden Embossed Seal & QR Code */}
              <div className="flex flex-col items-center justify-center space-y-1">
                <div className="relative">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-3 border-[#d4af37] bg-[#fcfbf7] flex flex-col items-center justify-center text-[#064e3b] font-bold shadow-md">
                    <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 text-[#d4af37]" />
                    <span className="text-[7px] sm:text-[8px] font-heritage font-bold">خاتم الأمانة</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-lg p-0.5 border border-[#d4af37] shadow-xs">
                    <QrCode className="w-4 h-4 sm:w-5 sm:h-5 text-[#064e3b]" />
                  </div>
                </div>
                <span className="text-[9px] sm:text-[10px] text-slate-500 font-mono font-bold">
                  {joinDate}
                </span>
              </div>

              {/* Left Signature: Grand Syndicate / Secretary General */}
              <div className="space-y-1">
                <span className="text-[9px] sm:text-[11px] text-slate-500 font-bold block">الأمين العام للسادة الأشراف</span>
                <div className="font-heritage text-xs sm:text-sm font-bold text-[#064e3b]">
                  الشريف المستشار يحيى الهاشمي
                </div>
                <div className="w-16 sm:w-24 h-0.5 bg-[#d4af37] mx-auto opacity-50"></div>
                <span className="text-[9px] text-slate-400 block font-mono">اعتماد رسمي</span>
              </div>

            </div>

          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-2 no-print">
          <div className="text-slate-500 text-xs flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>يمكنك مشاركة الشهادة مباشرة على فيسبوك أو واتساب بأبعاد مثالية</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Facebook Share Button */}
            <button
              id="share-facebook-btn"
              onClick={handleFacebookShare}
              disabled={isExportingImage}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer hover:scale-[1.02] disabled:opacity-50"
              title="مشاركة وتصدير صورة الشهادة مباشرة إلى منشور فيسبوك"
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
              title="مشاركة صورة الشهادة مباشرة عبر الواتساب أو التطبيقات"
            >
              {isExportingImage ? (
                <Loader2 className="w-4 h-4 text-[#d4af37] animate-spin" />
              ) : (
                <Share2 className="w-4 h-4 text-[#d4af37]" />
              )}
              <span>{isExportingImage ? 'جاري تجهيز الصورة...' : 'مشاركة كصورة'}</span>
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

            <button
              onClick={handleDownload}
              disabled={isExportingImage}
              className="bg-[#064e3b] hover:bg-[#0b6e54] text-white px-4 sm:px-5 py-2.5 rounded-xl font-bold transition-all shadow flex items-center gap-1.5 cursor-pointer hover:scale-[1.02]"
            >
              {downloaded ? <Check className="w-4 h-4 text-[#d4af37]" /> : <Download className="w-4 h-4" />}
              <span>{downloaded ? 'تم الحفظ' : 'تحميل PNG'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="bg-[#d4af37] hover:brightness-110 text-[#064e3b] px-4 sm:px-5 py-2.5 rounded-xl font-black transition-all shadow flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة (A4)</span>
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
        subtitle="يقوم النظام بقص وتكييف الصورة لتظهر متناسقة تماماً في الشهادة والكارنيه وبأبعاد منشورات السوشيال ميديا"
      />
    </div>
  );
};

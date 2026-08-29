import React, { useState, useRef } from 'react';
import { UserProfile, RegisteredMember } from '../types';
import { 
  ShieldCheck, 
  Award, 
  QrCode, 
  Download, 
  Printer, 
  Check, 
  Sliders, 
  CheckCircle2,
  Share2,
  Copy,
  MessageCircle,
  Loader2,
  Camera,
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
    setShareSuccessMsg('تم حفظ وتكييف الصورة الشخصية');
    setTimeout(() => setShareSuccessMsg(null), 3000);
  };

  // 300 DPI Export calculation
  const getExportPixelRatio = () => {
    if (!certRef.current) return 2.5;
    const width = certRef.current.offsetWidth || 1050;
    return Math.max(2.0, Math.min(3.2, 3508 / width));
  };

  const generateCertificateImage = async () => {
    if (!certRef.current) return null;
    const pixelRatio = getExportPixelRatio();
    return await toPng(certRef.current, {
      pixelRatio,
      quality: 0.98,
      cacheBust: true,
      backgroundColor: theme === 'emerald' ? '#fdfcf7' : theme === 'parchment' ? '#fcf8ec' : '#fafaf7'
    });
  };

  const generateCertificateBlob = async () => {
    if (!certRef.current) return null;
    const pixelRatio = getExportPixelRatio();
    return await toBlob(certRef.current, {
      pixelRatio,
      quality: 0.98,
      cacheBust: true,
      backgroundColor: theme === 'emerald' ? '#fdfcf7' : theme === 'parchment' ? '#fcf8ec' : '#fafaf7'
    });
  };

  const handleShareAsImage = async () => {
    if (!certRef.current) return;
    setIsExportingImage(true);
    try {
      const blob = await generateCertificateBlob();
      if (!blob) throw new Error('Failed to create image blob');

      const fileName = `شهادة-انتساب-الشريف-${memberName.replace(/\s+/g, '_')}-${membershipNo}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `شهادة انتساب الشريف ${memberName}`,
          text: `شهادة انضمام وانتساب السادة الأشراف بني هاشم في مصر - الشريف ${memberName} (كود القيد: ${membershipNo})`,
          files: [file]
        });
        setShareSuccessMsg('تمت مشاركة صورة الشهادة بنجاح!');
      } else {
        const dataUrl = await generateCertificateImage();
        if (dataUrl) {
          const link = document.createElement('a');
          link.download = fileName;
          link.href = dataUrl;
          link.click();
        }
        setShareSuccessMsg('تم تحميل صورة الشهادة بجودة عالية');
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        const dataUrl = await generateCertificateImage();
        if (dataUrl) {
          const link = document.createElement('a');
          link.download = `شهادة-الشريف-${memberName.replace(/\s+/g, '_')}.png`;
          link.href = dataUrl;
          link.click();
          setShareSuccessMsg('تم حفظ الشهادة كصورة PNG بجهازك');
        }
      }
    } finally {
      setIsExportingImage(false);
      setTimeout(() => setShareSuccessMsg(null), 3500);
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
        setShareSuccessMsg('تم تحميل شهادة الانتساب كصورة عالية الدقة');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsExportingImage(false);
      setTimeout(() => setShareSuccessMsg(null), 3500);
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
          setShareSuccessMsg('تم نسخ صورة الشهادة للحافظة (يمكنك لصقها مباشرة)');
        } else {
          await handleDownloadImageOnly();
        }
      } else {
        await handleDownloadImageOnly();
      }
    } catch (e) {
      await handleDownloadImageOnly();
    } finally {
      setIsExportingImage(false);
      setTimeout(() => setShareSuccessMsg(null), 3500);
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
      const blob = await generateCertificateBlob();
      if (!blob) throw new Error('Failed to generate image blob');

      const file = new File([blob], fileName, { type: 'image/png' });
      const quote = `شهادة انضمام وانتساب السادة الأشراف بني هاشم في مصر - الشريف ${memberName} (كود القيد: ${membershipNo})`;

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `شهادة انتساب السادة الأشراف - ${memberName}`,
          text: quote
        });
        setShareSuccessMsg('تم فتح نافذة مشاركة صورة الشهادة بنجاح');
      } else {
        const dataUrl = await generateCertificateImage();
        if (dataUrl) {
          const link = document.createElement('a');
          link.download = fileName;
          link.href = dataUrl;
          link.click();
        }
        await copyImageBlobToClipboard(blob);
        setShareSuccessMsg('تم تحميل صورة الشهادة وجاري فتح فيسبوك');
        
        setTimeout(() => {
          window.open('https://www.facebook.com/', '_blank');
        }, 600);
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        await handleDownloadImageOnly();
        window.open('https://www.facebook.com/', '_blank');
      }
    } finally {
      setIsExportingImage(false);
      setTimeout(() => setShareSuccessMsg(null), 4000);
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
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn"
    >
      <div 
        id="official-certificate-modal-body"
        className="bg-white rounded-2xl max-w-5xl w-full p-3 sm:p-5 space-y-3 shadow-2xl border-2 border-[#d4af37] max-h-[96vh] overflow-y-auto"
      >
        
        {/* Modal Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5 no-print">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold bg-[#fcfbf7] text-[#d4af37] border border-[#d4af37]/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Award className="w-3 h-3 text-[#d4af37]" />
                وثيقة معتمدة وموثقة (A4 عريض)
              </span>
              <span className="text-[10px] text-slate-500 font-mono font-bold">
                كود: {membershipNo}
              </span>
            </div>
            <h3 className="text-base sm:text-xl font-bold font-heritage text-[#064e3b] mt-0.5">
              شهادة انضمام وانتساب السادة الأشراف بني هاشم
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPhotoModalOpen(true)}
              className="bg-emerald-50 hover:bg-emerald-100 text-[#064e3b] border border-emerald-300 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              title="تكييف وضبط صورة الشهادة"
            >
              <Camera className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="hidden sm:inline">الصورة</span>
            </button>

            <button
              onClick={() => setIsCustomizing(!isCustomizing)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-[#064e3b]" />
              <span>{isCustomizing ? 'إخفاء' : 'تخصيص'}</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Certificate Customization Toolbar */}
        {isCustomizing && (
          <div className="bg-[#fafaf7] p-3 rounded-xl border border-amber-200 text-xs space-y-2 no-print animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">الطراز:</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setTheme('emerald')}
                    className={`px-2.5 py-0.5 rounded-lg font-bold border transition-all cursor-pointer ${
                      theme === 'emerald' ? 'bg-[#064e3b] text-[#d4af37] border-[#d4af37]' : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    الزمردي
                  </button>
                  <button
                    onClick={() => setTheme('parchment')}
                    className={`px-2.5 py-0.5 rounded-lg font-bold border transition-all cursor-pointer ${
                      theme === 'parchment' ? 'bg-[#fcfbf7] text-[#854d0e] border-[#d4af37]' : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    التراثي
                  </button>
                  <button
                    onClick={() => setTheme('royal')}
                    className={`px-2.5 py-0.5 rounded-lg font-bold border transition-all cursor-pointer ${
                      theme === 'royal' ? 'bg-[#0f172a] text-[#d4af37] border-[#d4af37]' : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    الكحلي
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-1.5 font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPhoto}
                  onChange={(e) => setShowPhoto(e.target.checked)}
                  className="w-3.5 h-3.5 text-[#064e3b] rounded"
                />
                <span>إظهار الصورة</span>
              </label>
            </div>

            <div>
              <input
                type="text"
                value={customDedication}
                onChange={(e) => setCustomDedication(e.target.value)}
                placeholder="إضافة إهداء أو تصدير خاص بالشهادة (اختياري)..."
                className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#064e3b] outline-none"
              />
            </div>
          </div>
        )}

        {/* Success / Notification Banner */}
        {shareSuccessMsg && (
          <div className="bg-emerald-50 border border-emerald-500 text-emerald-900 p-2 rounded-xl font-bold text-xs flex items-center justify-between gap-2 shadow-sm animate-fadeIn no-print">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{shareSuccessMsg}</span>
            </div>
            <button 
              onClick={() => setShareSuccessMsg(null)}
              className="text-emerald-700 hover:text-emerald-950 font-bold px-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* THE COMPACT & FULLY BALANCED A4 LANDSCAPE CERTIFICATE DOCUMENT */}
        <div 
          ref={certRef}
          id="official-certificate-print" 
          className={`relative rounded-2xl transition-all border-4 sm:border-6 shadow-xl mx-auto w-full max-w-[1000px] flex flex-col justify-between p-3.5 sm:p-5 md:p-6 ${
            theme === 'emerald'
              ? 'bg-[#fdfcf7] border-[#064e3b]'
              : theme === 'parchment'
              ? 'bg-[#fcf8ec] border-[#854d0e]'
              : 'bg-[#fafaf7] border-[#0f172a]'
          }`}
        >
          {/* Inner Golden Double Border Frame */}
          <div className="cert-inner-frame border-2 sm:border-3 border-[#d4af37] border-double rounded-xl p-3 sm:p-5 flex flex-col justify-between h-full relative overflow-hidden space-y-2 sm:space-y-3">
            
            {/* Background Seal Watermark */}
            <div className="absolute inset-0 opacity-4 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full border-4 border-[#064e3b] flex items-center justify-center">
                <span className="font-heritage text-7xl sm:text-9xl font-bold text-[#064e3b]">هاشم</span>
              </div>
            </div>

            {/* 1. Header: State, Basmala & Ayah, Registration */}
            <div className="text-center relative z-10 space-y-1">
              <div className="flex items-center justify-between border-b border-[#d4af37]/50 pb-1.5">
                <div className="text-right space-y-0.5">
                  <span className="text-[10px] sm:text-xs text-slate-500 font-bold block leading-none">جمهورية مصر العربية</span>
                  <span className="text-[11px] sm:text-sm font-heritage font-bold text-[#064e3b] block leading-tight">أمانة الأنساب والتوثيق</span>
                </div>

                <div className="text-center px-1">
                  <div className="cert-basmala font-heritage text-base sm:text-2xl font-bold text-[#d4af37] tracking-wider leading-tight">
                    بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ
                  </div>
                  <div className="cert-ayah text-[10px] sm:text-xs font-heritage text-[#064e3b] font-bold italic bg-[#fcfbf7] inline-block px-3 py-0.5 rounded-full border border-[#d4af37]/40 mt-0.5">
                    ﴿ قُل لَّا أَسْأَلُكُمْ عَلَيْهِ أَجْرًا إِلَّا الْمَوَدَّةَ فِي الْقُرْبَىٰ ﴾
                  </div>
                </div>

                <div className="text-left space-y-0.5">
                  <span className="text-[10px] sm:text-xs text-slate-500 font-bold block leading-none">رقم القيد</span>
                  <span className="text-[11px] sm:text-sm font-mono font-bold text-[#064e3b] block leading-tight">{membershipNo}</span>
                </div>
              </div>

              {/* Certificate Title */}
              <div className="pt-0.5">
                <h1 className="cert-header-title text-xl sm:text-3xl font-bold font-heritage text-[#064e3b] tracking-wide leading-tight inline-block px-4">
                  شـهـادة انـضـمـام وانـتـسـاب
                </h1>
                <p className="cert-sub-title text-[10px] sm:text-xs font-heritage text-[#d4af37] font-bold">
                  سجل السادة الأشراف بني هاشم في جمهورية مصر العربية
                </p>
              </div>
            </div>

            {/* 2. Body Text, Name & Photo Banner, and Lineage */}
            <div className="space-y-1.5 sm:space-y-2.5 text-center relative z-10 py-1 flex-1 flex flex-col justify-center">
              
              <p className="cert-intro text-xs sm:text-sm text-slate-700 font-heritage font-medium leading-tight">
                تـشـهـد الأمانـة العـامـة ولجـنـة تحـقـيـق الأنـسـاب بـأن السـيـد الشـريـف /
              </p>

              {/* Compact Name and Photo Banner */}
              <div className="cert-member-banner flex flex-row items-center justify-center gap-3 sm:gap-6 bg-gradient-to-r from-transparent via-[#f5f3e9] to-transparent py-1.5 sm:py-2.5 px-4 sm:px-8 rounded-xl border-y border-[#d4af37]/60">
                {showPhoto && currentAvatarUrl && (
                  <div className="w-12 h-14 sm:w-16 sm:h-20 rounded-xl border border-[#d4af37] overflow-hidden shadow-sm shrink-0 bg-white">
                    <img 
                      src={currentAvatarUrl} 
                      alt={memberName} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer" 
                    />
                  </div>
                )}
                <div className="space-y-0.5 text-right">
                  <h2 className="cert-member-name text-xl sm:text-3xl font-bold font-heritage text-[#064e3b] leading-tight">
                    {memberName}
                  </h2>
                  <div className="cert-branch-text text-[10px] sm:text-xs text-slate-600 font-bold flex items-center gap-1.5 leading-none">
                    <span>المنتمي إلى:</span>
                    <span className="text-[#854d0e] font-heritage font-bold text-xs sm:text-sm">{branchName}</span>
                  </div>
                </div>
              </div>

              {/* Statement & Lineage Chain */}
              <div className="w-full max-w-4xl mx-auto space-y-1 sm:space-y-1.5">
                <p className="cert-proclamation text-[10px] sm:text-xs text-slate-700 font-heritage leading-tight">
                  قـد ثـبـت صـحـة انـتـسـابـه وانـضـمـامـه الشـريـف إلـى بـيـوت السـادة الأشـراف بـنـي هـاشـم:
                </p>

                <div className="cert-lineage-box bg-white/95 p-2 sm:p-3 rounded-xl border border-[#d4af37] text-[11px] sm:text-sm font-heritage font-bold text-[#064e3b] leading-relaxed shadow-xs text-center">
                  « {lineageChain} »
                </div>
              </div>

              {customDedication && (
                <div className="cert-dedication bg-[#fcfbf7] p-1.5 rounded-lg border border-amber-300 text-[10px] sm:text-xs font-heritage text-slate-800 italic max-w-2xl mx-auto leading-tight">
                  "{customDedication}"
                </div>
              )}

            </div>

            {/* 3. Footer: Signatures, Stamp & QR Code */}
            <div className="cert-footer-section pt-1.5 border-t border-[#d4af37]/60 relative z-10 space-y-1.5">
              
              <div className="grid grid-cols-3 gap-2 items-center text-center text-xs">
                {/* Right Signature */}
                <div className="space-y-0.5">
                  <span className="cert-sig-title text-[9px] sm:text-xs text-slate-500 font-bold block leading-none">رئيس لجنة الأنساب بمصر</span>
                  <div className="cert-sig-name font-heritage text-[11px] sm:text-sm font-bold text-[#064e3b] leading-tight">
                    الشريف د. إبراهيم بن محمد الجعفري
                  </div>
                  <div className="w-16 sm:w-24 h-0.5 bg-[#d4af37] mx-auto opacity-60 my-0.5"></div>
                  <span className="text-[8px] sm:text-[10px] text-slate-400 block font-mono leading-none">توقيع معتمد</span>
                </div>

                {/* Center Stamp */}
                <div className="flex flex-col items-center justify-center space-y-0.5">
                  <div className="relative">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-[#d4af37] bg-[#fcfbf7] flex flex-col items-center justify-center text-[#064e3b] font-bold shadow-xs">
                      <ShieldCheck className="w-5 h-5 sm:w-7 sm:h-7 text-[#d4af37]" />
                      <span className="text-[7px] sm:text-[9px] font-heritage font-bold leading-none">خاتم الأمانة</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-lg p-0.5 border border-[#d4af37] shadow-xs">
                      <QrCode className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 text-[#064e3b]" />
                    </div>
                  </div>
                  <span className="text-[9px] sm:text-[11px] text-slate-600 font-mono font-bold leading-none">
                    {joinDate}
                  </span>
                </div>

                {/* Left Signature */}
                <div className="space-y-0.5">
                  <span className="cert-sig-title text-[9px] sm:text-xs text-slate-500 font-bold block leading-none">الأمين العام للسادة الأشراف</span>
                  <div className="cert-sig-name font-heritage text-[11px] sm:text-sm font-bold text-[#064e3b] leading-tight">
                    الشريف المستشار يحيى الهاشمي
                  </div>
                  <div className="w-16 sm:w-24 h-0.5 bg-[#d4af37] mx-auto opacity-60 my-0.5"></div>
                  <span className="text-[8px] sm:text-[10px] text-slate-400 block font-mono leading-none">اعتماد رسمي</span>
                </div>
              </div>

              <div className="text-center pt-1 border-t border-[#d4af37]/30 text-[8px] sm:text-[10px] text-slate-500 font-medium leading-none">
                وثيقة نسب رسمية صادرة ومصدقة وفق السجلات العامة لأنساب السادة الأشراف بني هاشم بجمهورية مصر العربية
              </div>

            </div>

          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="flex flex-wrap items-center justify-end gap-2 pt-1 no-print">
          {/* Facebook */}
          <button
            id="share-facebook-btn"
            onClick={handleFacebookShare}
            disabled={isExportingImage}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-xl text-xs font-bold transition-all shadow flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="مشاركة على فيسبوك"
          >
            {isExportingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Facebook className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">فيسبوك</span>
          </button>

          {/* Share Image */}
          <button
            id="share-certificate-image-btn"
            onClick={handleShareAsImage}
            disabled={isExportingImage}
            className="bg-gradient-to-r from-[#064e3b] to-emerald-700 text-white px-3 py-2 rounded-xl text-xs font-bold transition-all shadow flex items-center gap-1.5 cursor-pointer border border-[#d4af37]/50 disabled:opacity-50"
          >
            {isExportingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Share2 className="w-3.5 h-3.5 text-[#d4af37]" />}
            <span>مشاركة الصورة</span>
          </button>

          {/* Copy Image */}
          <button
            onClick={handleCopyImageToClipboard}
            disabled={isExportingImage}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5 text-[#064e3b]" />
            <span className="hidden sm:inline">نسخ</span>
          </button>

          {/* WhatsApp */}
          <button
            onClick={handleWhatsAppShare}
            className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border border-emerald-300"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">واتساب</span>
          </button>

          {/* Download */}
          <button
            onClick={handleDownload}
            disabled={isExportingImage}
            className="bg-[#064e3b] hover:bg-[#0b6e54] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow flex items-center gap-1 cursor-pointer"
          >
            {downloaded ? <Check className="w-3.5 h-3.5 text-[#d4af37]" /> : <Download className="w-3.5 h-3.5" />}
            <span>تحميل</span>
          </button>

          {/* Print */}
          <button
            onClick={handlePrint}
            className="bg-[#d4af37] hover:brightness-110 text-[#064e3b] px-3.5 py-2 rounded-xl text-xs font-black transition-all shadow flex items-center gap-1 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>طباعة (A4)</span>
          </button>
        </div>

      </div>

      {/* Photo Upload Modal */}
      <PhotoUploadModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        currentPhotoUrl={currentAvatarUrl}
        onSavePhoto={handlePhotoUpdated}
        title="تكييف وضبط صورة شهادة الانتساب"
        subtitle="قص وتكييف الصورة لتظهر متناسقة تماماً في الشهادة"
      />
    </div>
  );
};

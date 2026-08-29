import React, { useState, useRef } from 'react';
import { RegisteredMember, UserProfile } from '../types';
import { 
  ShieldCheck, 
  QrCode, 
  Download, 
  Printer, 
  Check, 
  Sparkles, 
  Camera, 
  RotateCw, 
  Award, 
  FileCheck,
  CheckCircle2,
  Share2,
  Copy,
  MessageCircle,
  Loader2,
  Facebook
} from 'lucide-react';
import { toPng, toBlob } from 'html-to-image';
import { PhotoUploadModal } from './PhotoUploadModal';
import { copyImageBlobToClipboard } from '../utils/clipboard';

interface MemberCardModalProps {
  member: RegisteredMember | UserProfile | null;
  onClose: () => void;
  onUpdateMemberPhoto?: (photoUrl: string) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80'
];

export const MemberCardModal: React.FC<MemberCardModalProps> = ({ 
  member, 
  onClose,
  onUpdateMemberPhoto
}) => {
  const [downloaded, setDownloaded] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string>(() => {
    if (!member) return '';
    return 'avatarUrl' in member && member.avatarUrl ? member.avatarUrl : PRESET_AVATARS[0];
  });
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [cardTheme, setCardTheme] = useState<'emerald' | 'gold' | 'black' | 'diplomatic'>('emerald');
  const [isExportingImage, setIsExportingImage] = useState(false);
  const [shareSuccessMsg, setShareSuccessMsg] = useState<string | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);

  if (!member) return null;

  const memberName = 'fullName' in member ? member.fullName : ((member as any).name || (member as any).recipientName || 'الشريف المكرم');
  const membershipNo = member.membershipNumber || (member as any).documentNumber || 'BH-EG-1447-0786';
  const branchName = member.branch || 'الأشراف الجعافرة (أشراف الصعيد)';
  const subClan = 'subClan' in member && member.subClan ? member.subClan : 'الفرع المعتمد';
  const joinDate = 'joinDateHijri' in member ? member.joinDateHijri : ((member as any).joinDate || (member as any).issueDateHijri || '1447/08/29 هـ');
  const lineageChain = ('lineageChainSummary' in member && member.lineageChainSummary)
    ? member.lineageChainSummary 
    : ((member as any).lineageChainText || 'سلسلة نسب شريفة متصلة إلى الدوحة الهاشمية المباركة وسيد شباب أهل الجنة والجد الجامع هاشم بن عبد مناف.');
  const nationalId = 'nationalId' in member && member.nationalId ? member.nationalId : '28904121402391';

  const handlePrint = () => {
    window.print();
  };

  const handlePhotoUpdated = (newPhotoUrl: string) => {
    setPhotoUrl(newPhotoUrl);
    if (onUpdateMemberPhoto) {
      onUpdateMemberPhoto(newPhotoUrl);
    }
    setShareSuccessMsg('تم تكييف وحفظ الصورة الشخصية بنجاح على كارنيه العضوية والشهادة');
    setTimeout(() => setShareSuccessMsg(null), 3500);
  };

  // Capture Card Element as Image
  const generateCardImage = async () => {
    if (!cardRef.current) return null;
    return await toPng(cardRef.current, {
      quality: 0.98,
      pixelRatio: 2.5,
      cacheBust: true,
      skipFonts: true,
      fontEmbedCSS: ''
    });
  };

  const handleShareAsImage = async () => {
    if (!cardRef.current) return;
    setIsExportingImage(true);
    try {
      const blob = await toBlob(cardRef.current, {
        quality: 0.98,
        pixelRatio: 2.5,
        cacheBust: true,
        skipFonts: true,
        fontEmbedCSS: ''
      });

      if (!blob) throw new Error('Failed to create card image blob');

      const sideText = isFlipped ? 'ظهر' : 'وجه';
      const fileName = `كارنيه-الشريف-${memberName.replace(/\s+/g, '_')}-${membershipNo}-${sideText}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      // Native Web Share with image
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `كارنيه انضمام وانتساب الشريف ${memberName}`,
          text: `انضمام وانتساب لتجمع السادة الأشراف بني هاشم - الشريف ${memberName} (${membershipNo})`,
          files: [file]
        });
        setShareSuccessMsg('تمت مشاركة صورة الكارنيه بنجاح!');
      } else {
        // Fallback direct download
        const dataUrl = await generateCardImage();
        if (dataUrl) {
          const link = document.createElement('a');
          link.download = fileName;
          link.href = dataUrl;
          link.click();
        }
        setShareSuccessMsg('تم حفظ صورة الكارنيه عالية الدقة PNG');
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Error sharing card image:', err);
        try {
          const dataUrl = await generateCardImage();
          if (dataUrl) {
            const link = document.createElement('a');
            link.download = `كارنيه-انضمام-وانتساب-الشريف-${memberName.replace(/\s+/g, '_')}.png`;
            link.href = dataUrl;
            link.click();
            setShareSuccessMsg('تم تحميل صورة الكارنيه بجهازك');
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
    if (!cardRef.current) return;
    setIsExportingImage(true);
    try {
      const dataUrl = await generateCardImage();
      if (dataUrl) {
        const sideText = isFlipped ? 'الخلفي' : 'الأمامي';
        const link = document.createElement('a');
        link.download = `كارنيه-انضمام-وانتساب-الشريف-${memberName.replace(/\s+/g, '_')}-${membershipNo}-${sideText}.png`;
        link.href = dataUrl;
        link.click();
        setShareSuccessMsg(`تم تحميل صورة الكارنيه (${sideText}) بجودة عالية`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsExportingImage(false);
      setTimeout(() => setShareSuccessMsg(null), 3000);
    }
  };

  const handleCopyCardImage = async () => {
    if (!cardRef.current) return;
    setIsExportingImage(true);
    try {
      const blob = await toBlob(cardRef.current, {
        quality: 0.98,
        pixelRatio: 2.2,
        cacheBust: true,
        skipFonts: true,
        fontEmbedCSS: ''
      });
      if (blob) {
        const copied = await copyImageBlobToClipboard(blob);
        if (copied) {
          setShareSuccessMsg('تم نسخ صورة الكارنيه للحافظة (يمكنك لصقها في أي تطبيق أو محادثة)');
        } else {
          await handleDownloadImageOnly();
          setShareSuccessMsg('تم تحميل صورة الكارنيه بجهازك لتعذر النسخ المباشر للحافظة');
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
      `*كارنيه انضمام وانتساب لتجمع السادة الأشراف بني هاشم*\n` +
      `👤 الاسم: الشريف ${memberName}\n` +
      `📜 الفرع: ${branchName} (${subClan})\n` +
      `🔢 كود القيد: ${membershipNo}\n` +
      `🏛️ أمانة الأنساب والتوثيق - جمهورية مصر العربية\n` +
      `🔗 بوابة السادة الأشراف: https://banihashim.org.eg`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleFacebookShare = async () => {
    if (!cardRef.current) return;
    setIsExportingImage(true);
    const sideText = isFlipped ? 'الخلفي' : 'الأمامي';
    const fileName = `كارنيه-انضمام-وانتساب-الشريف-${memberName.replace(/\s+/g, '_')}-${membershipNo}-${sideText}.png`;

    try {
      const blob = await toBlob(cardRef.current, {
        quality: 0.98,
        pixelRatio: 2.5,
        cacheBust: true,
        skipFonts: true,
        fontEmbedCSS: ''
      });

      if (!blob) throw new Error('Failed to generate card image blob');

      const file = new File([blob], fileName, { type: 'image/png' });
      const quote = `كارنيه انضمام وانتساب لتجمع السادة الأشراف بني هاشم - الشريف ${memberName} (${membershipNo})`;

      // If browser supports sharing image files directly to Facebook / apps
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `كارنيه انضمام وانتساب - ${memberName}`,
          text: quote
        });
        setShareSuccessMsg('تم فتح نافذة مشاركة صورة الكارنيه بنجاح');
      } else {
        // Fallback: Download high-res card image file + copy image + open Facebook post composer
        const dataUrl = await generateCardImage();
        if (dataUrl) {
          const link = document.createElement('a');
          link.download = fileName;
          link.href = dataUrl;
          link.click();
        }
        await copyImageBlobToClipboard(blob);
        setShareSuccessMsg('تم تحميل صورة الكارنيه بنجاح 📸 وجاري فتح فيسبوك لإرفاق الصورة في المنشور');
        
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
      <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-8 space-y-6 shadow-2xl border-2 border-[#d4af37] max-h-[96vh] overflow-y-auto">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 no-print">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold bg-[#fcfbf7] text-[#d4af37] border border-[#d4af37]/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Award className="w-3 h-3 text-[#d4af37]" />
                الهوية الرقمية الرسمية الذكية
              </span>
              <span className="text-[10px] text-slate-500 font-mono font-bold">
                {membershipNo}
              </span>
            </div>
            <h3 className="text-xl font-bold font-heritage text-[#064e3b] mt-1">
              انضمام وانتساب لتجمع السادة الأشراف بني هاشم
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPhotoModalOpen(true)}
              className="bg-emerald-50 hover:bg-emerald-100 text-[#064e3b] border border-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              title="تعديل وتكييف أبعاد الصورة الشخصية"
            >
              <Camera className="w-4 h-4 text-[#d4af37]" />
              <span>تكييف الصورة</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 text-base font-bold p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Card Flip & Theme Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs no-print">
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="bg-[#064e3b] hover:bg-[#0b6e54] text-white px-4 py-2 rounded-xl font-bold transition-all shadow flex items-center gap-2 cursor-pointer"
          >
            <RotateCw className={`w-4 h-4 text-[#d4af37] transition-transform duration-500 ${isFlipped ? 'rotate-180' : ''}`} />
            <span>{isFlipped ? 'عرض وجه البطاقة (الأمامي)' : 'عرض ظهر البطاقة (الخلفي)'}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 font-bold">سمة البطاقة:</span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setCardTheme('emerald')}
                className={`w-7 h-7 rounded-full bg-[#064e3b] border-2 cursor-pointer transition-all ${cardTheme === 'emerald' ? 'border-[#d4af37] ring-2 ring-[#064e3b]/40 scale-110' : 'border-transparent opacity-70'}`}
                title="الزمردي الهاشمي الملكي"
              />
              <button
                onClick={() => setCardTheme('gold')}
                className={`w-7 h-7 rounded-full bg-[#996515] border-2 cursor-pointer transition-all ${cardTheme === 'gold' ? 'border-[#d4af37] ring-2 ring-amber-500/40 scale-110' : 'border-transparent opacity-70'}`}
                title="الذهبي الملكي الخالص"
              />
              <button
                onClick={() => setCardTheme('black')}
                className={`w-7 h-7 rounded-full bg-slate-900 border-2 cursor-pointer transition-all ${cardTheme === 'black' ? 'border-[#d4af37] ring-2 ring-slate-800/40 scale-110' : 'border-transparent opacity-70'}`}
                title="الأسود الملكي الفاخر"
              />
              <button
                onClick={() => setCardTheme('diplomatic')}
                className={`w-7 h-7 rounded-full bg-[#f4f0e2] border-2 cursor-pointer transition-all ${cardTheme === 'diplomatic' ? 'border-[#064e3b] ring-2 ring-[#d4af37]/60 scale-110' : 'border-slate-300 opacity-70'}`}
                title="الدبلوماسي العاجي"
              />
            </div>
          </div>
        </div>

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

        {/* 3D Flippable Digital Membership Card (Fixed aspect ratio 1.586:1 standard credit card size) */}
        <div ref={cardRef} className="relative perspective-1000 min-h-[320px] sm:min-h-[340px]">
          
          {/* CARD FRONT */}
          {!isFlipped ? (
            <div 
              className={`relative overflow-hidden rounded-3xl p-5 sm:p-7 shadow-2xl border-2 border-[#d4af37] space-y-4 transition-all duration-300 animate-fadeIn ${
                cardTheme === 'emerald'
                  ? 'bg-gradient-to-br from-[#064e3b] via-[#0b6e54] to-[#043e2f] text-white'
                  : cardTheme === 'gold'
                  ? 'bg-gradient-to-br from-[#854d0e] via-[#a16207] to-[#713f12] text-white'
                  : cardTheme === 'black'
                  ? 'bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#020617] text-white'
                  : 'bg-gradient-to-br from-[#fcfbf7] via-[#faf7ee] to-[#f4f0e2] text-slate-900 border-2 border-[#d4af37]'
              }`}
            >
              
              {/* Background Islamic Watermark */}
              <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
                <span className="font-heritage text-9xl font-bold text-[#d4af37]">هاشم</span>
              </div>

              {/* Card Top: Republic & Assembly Header */}
              <div className="flex items-center justify-between border-b border-[#d4af37]/40 pb-3 relative z-10">
                <div className="text-right space-y-0.5">
                  <span className={`text-[10px] sm:text-xs font-bold block ${
                    cardTheme === 'diplomatic' ? 'text-slate-600' : 'text-slate-200'
                  }`}>
                    جمهورية مصر العربية
                  </span>
                  <span className="text-xs sm:text-sm font-heritage font-bold text-[#d4af37] block">
                    لتجمع السادة الأشراف بني هاشم
                  </span>
                </div>

                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-[#d4af37] bg-[#064e3b] p-1 flex items-center justify-center shadow-lg">
                  <span className="font-heritage text-[9px] font-bold text-[#d4af37] text-center leading-tight">
                    بني<br/>هاشم
                  </span>
                </div>

                <div className="text-left space-y-0.5">
                  <span className={`text-[9px] sm:text-[10px] block font-bold ${
                    cardTheme === 'diplomatic' ? 'text-[#064e3b]' : 'text-[#d4af37]'
                  }`}>
                    انضمام وانتساب
                  </span>
                  <span className="text-xs font-mono font-bold text-[#d4af37] block">
                    {membershipNo}
                  </span>
                </div>
              </div>

              {/* Card Center: Member Details & Photo */}
              <div className="flex items-center gap-4 relative z-10 py-1">
                {/* Photo fitted into 3:4 aspect ratio */}
                <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-2xl border-2 border-[#d4af37] overflow-hidden shadow-lg bg-slate-900 shrink-0 relative group">
                  <img 
                    src={photoUrl} 
                    alt={memberName} 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer" 
                  />
                  <div className="absolute inset-0 bg-[#064e3b]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <CheckCircle2 className="w-6 h-6 text-[#d4af37]" />
                  </div>
                </div>

                {/* Member Info */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div>
                    <span className="text-[10px] text-[#d4af37] font-bold block">الاسم الشريف الكامل:</span>
                    <h4 className={`text-base sm:text-lg font-bold font-heritage truncate ${
                      cardTheme === 'diplomatic' ? 'text-[#064e3b]' : 'text-white'
                    }`}>
                      {memberName}
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs">
                    <div>
                      <span className="text-[9px] text-slate-400 block font-bold">الفرع الهاشمي:</span>
                      <span className="text-[11px] font-bold text-[#d4af37] truncate block">{branchName}</span>
                    </div>

                    <div>
                      <span className="text-[9px] text-slate-400 block font-bold">البيت / العشيرة:</span>
                      <span className={`text-[11px] truncate block ${cardTheme === 'diplomatic' ? 'text-slate-700' : 'text-slate-200'}`}>
                        {subClan}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Bar: Golden Lineage Ribbon */}
              <div className="bg-[#d4af37]/20 border-y border-[#d4af37]/40 py-1 px-3 text-[10px] font-heritage font-bold text-center text-[#d4af37] relative z-10 truncate">
                • انضمام وانتساب • لتجمع السادة الأشراف بني هاشم بمصر • أمانة الأنساب والتوثيق •
              </div>

              {/* Card Bottom: Official Status & QR */}
              <div className="flex items-center justify-between relative z-10 pt-1 text-xs">
                <div className="space-y-0.5">
                  <div className={`flex items-center gap-1.5 text-xs font-bold ${
                    cardTheme === 'diplomatic' ? 'text-[#064e3b]' : 'text-emerald-200'
                  }`}>
                    <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
                    <span>عضوية سارية ومعتمدة بالأمانة العامة</span>
                  </div>
                  <span className={`text-[10px] font-mono ${
                    cardTheme === 'diplomatic' ? 'text-slate-500' : 'text-emerald-300/80'
                  }`}>
                    تاريخ الإصدار: {joinDate}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-11 h-11 bg-white rounded-xl p-1 flex items-center justify-center text-slate-900 shadow-md border border-[#d4af37]/60">
                    <QrCode className="w-9 h-9" />
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* CARD BACK */
            <div 
              className={`relative overflow-hidden rounded-3xl p-5 sm:p-7 shadow-2xl border-2 border-[#d4af37] space-y-3 transition-all animate-fadeIn ${
                cardTheme === 'emerald'
                  ? 'bg-gradient-to-br from-[#064e3b] via-[#0b6e54] to-[#043e2f] text-white'
                  : cardTheme === 'gold'
                  ? 'bg-gradient-to-br from-[#854d0e] via-[#a16207] to-[#713f12] text-white'
                  : cardTheme === 'black'
                  ? 'bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#020617] text-white'
                  : 'bg-gradient-to-br from-[#fcfbf7] via-[#faf7ee] to-[#f4f0e2] text-slate-900 border-2 border-[#d4af37]'
              }`}
            >
              {/* Magnetic Strip */}
              <div className="w-full h-10 bg-black/90 -mx-5 sm:-mx-7 mb-1 border-y border-white/10 flex items-center justify-end px-6">
                <span className="text-[9px] text-[#d4af37] font-mono tracking-widest">
                  SECURE HASHIMITE CHIP ENCODING
                </span>
              </div>

              {/* Lineage Summary */}
              <div className="space-y-1 text-xs">
                <span className="text-[10px] text-[#d4af37] font-bold block flex items-center gap-1">
                  <FileCheck className="w-3.5 h-3.5" />
                  سند وسلسلة النسب الشريف المعتمدة:
                </span>
                <p className={`text-[11px] font-heritage leading-relaxed p-2.5 rounded-xl border line-clamp-3 ${
                  cardTheme === 'diplomatic'
                    ? 'bg-white text-slate-800 border-[#d4af37]/40'
                    : 'bg-black/30 text-slate-200 border-white/10'
                }`}>
                  « {lineageChain} »
                </p>
              </div>

              {/* Identity & Legal Security Box */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className={`p-2 rounded-xl border space-y-0.5 ${
                  cardTheme === 'diplomatic'
                    ? 'bg-white text-slate-800 border-[#d4af37]/40'
                    : 'bg-black/30 text-white border-white/10'
                }`}>
                  <span className="text-[9px] text-slate-400 block font-bold">الرقم القومي:</span>
                  <span className="font-mono font-bold text-[#d4af37] text-xs">{nationalId}</span>
                </div>
                
                <div className={`p-2 rounded-xl border space-y-0.5 ${
                  cardTheme === 'diplomatic'
                    ? 'bg-white text-slate-800 border-[#d4af37]/40'
                    : 'bg-black/30 text-white border-white/10'
                }`}>
                  <span className="text-[9px] text-slate-400 block font-bold">جهة الاعتماد:</span>
                  <span className="font-bold text-xs">أمانة الأنساب بمصر</span>
                </div>
              </div>

              {/* Security Legal Notice */}
              <div className={`text-[9.5px] sm:text-[10px] font-heritage leading-relaxed p-2 rounded-xl border ${
                cardTheme === 'diplomatic'
                  ? 'bg-amber-50/80 text-[#064e3b] border-amber-200 font-bold'
                  : 'bg-black/40 text-amber-200/90 border-white/10'
              }`}>
                * وقد سجلت هذه العضوية رسميًا في السجل العام للسادة الأشراف بني هاشم في جمهورية مصر العربية، إقرارًا بصلة الرحم والتكافل والتعاون على البر والتقوى.
              </div>

            </div>
          )}

        </div>

        {/* Modal Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-2 no-print">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPhotoModalOpen(true)}
              className="text-slate-600 hover:text-[#064e3b] font-bold flex items-center gap-1.5 cursor-pointer bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition-all"
            >
              <Camera className="w-4 h-4 text-[#d4af37]" />
              <span>تكييف الصورة</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Facebook Share Button */}
            <button
              onClick={handleFacebookShare}
              disabled={isExportingImage}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2.5 rounded-xl font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="مشاركة وتصدير صورة الكارنيه كمنشور على الفيسبوك"
            >
              {isExportingImage ? (
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              ) : (
                <Facebook className="w-4 h-4 text-white" />
              )}
              <span>مشاركة صورة الكارنيه على فيسبوك</span>
            </button>

            {/* Share as Image Button */}
            <button
              id="share-card-image-btn"
              onClick={handleShareAsImage}
              disabled={isExportingImage}
              className="bg-gradient-to-r from-[#064e3b] to-emerald-700 hover:from-emerald-800 hover:to-[#064e3b] text-white px-4 sm:px-5 py-2.5 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer hover:scale-[1.02] border border-[#d4af37]/50 disabled:opacity-50"
              title="مشاركة صورة الكارنيه مباشرة عبر الواتساب أو التطبيقات"
            >
              {isExportingImage ? (
                <Loader2 className="w-4 h-4 text-[#d4af37] animate-spin" />
              ) : (
                <Share2 className="w-4 h-4 text-[#d4af37]" />
              )}
              <span>{isExportingImage ? 'جاري تجهيز الصورة...' : 'مشاركة كصورة'}</span>
            </button>

            <button
              onClick={handleCopyCardImage}
              disabled={isExportingImage}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="نسخ صورة الكارنيه للحافظة"
            >
              <Copy className="w-4 h-4 text-[#064e3b]" />
              <span className="hidden sm:inline">نسخ</span>
            </button>

            <button
              onClick={handleWhatsAppShare}
              className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-3.5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-emerald-300"
              title="مشاركة تفاصيل الكارنيه عبر الواتساب"
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
              className="bg-[#d4af37] hover:brightness-110 text-[#064e3b] px-4 py-2.5 rounded-xl font-black transition-all shadow flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة</span>
            </button>
          </div>
        </div>

      </div>

      {/* Photo Upload & Aspect Ratio Modal */}
      <PhotoUploadModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        currentPhotoUrl={photoUrl}
        onSavePhoto={handlePhotoUpdated}
        title="تكييف وضبط صورة كارنيه العضوية"
        subtitle="يقوم المعالج بضبط أبعاد الصورة بنسبة (3:4) لتتوافق مع بطاقات الهوية الرسمية دون تشويه"
      />
    </div>
  );
};

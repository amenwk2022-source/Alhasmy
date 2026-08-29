import React, { useState, useRef } from 'react';
import { RegisteredMember, UserProfile } from '../types';
import { 
  ShieldCheck, 
  QrCode, 
  Download, 
  Printer, 
  Check, 
  Sparkles, 
  Upload, 
  Camera, 
  RotateCw, 
  Award,
  Phone,
  MapPin,
  FileCheck,
  CheckCircle2,
  Lock,
  Layers,
  Fingerprint,
  Share2,
  Copy,
  MessageCircle,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import { toPng, toBlob } from 'html-to-image';

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
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [cardTheme, setCardTheme] = useState<'emerald' | 'gold' | 'black' | 'diplomatic'>('emerald');
  const [isExportingImage, setIsExportingImage] = useState(false);
  const [shareSuccessMsg, setShareSuccessMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!member) return null;

  const memberName = 'fullName' in member ? member.fullName : ((member as any).name || (member as any).recipientName || 'الشريف المكرم');
  const membershipNo = member.membershipNumber || (member as any).documentNumber || 'BH-EG-1447-0786';
  const branchName = member.branch || 'الأشراف الجعافرة (أشراف الصعيد)';
  const subClan = 'subClan' in member && member.subClan ? member.subClan : 'الفرع المعتمد';
  const city = member.city || 'جمهورية مصر العربية';
  const country = member.country || 'جمهورية مصر العربية';
  const joinDate = 'joinDateHijri' in member ? member.joinDateHijri : ((member as any).joinDate || (member as any).issueDateHijri || '1447/08/29 هـ');
  const lineageChain = ('lineageChainSummary' in member && member.lineageChainSummary)
    ? member.lineageChainSummary 
    : ((member as any).lineageChainText || 'سلسلة نسب شريفة متصلة إلى الدوحة الهاشمية المباركة وسيد شباب أهل الجنة والجد الجامع هاشم بن عبد مناف.');
  const phone = 'phone' in member && member.phone ? member.phone : '+20 10 1234 5678';
  const nationalId = 'nationalId' in member && member.nationalId ? member.nationalId : '28904121402391';

  const handlePrint = () => {
    window.print();
  };

  // Capture Card Element as Image
  const generateCardImage = async () => {
    if (!cardRef.current) return null;
    return await toPng(cardRef.current, {
      quality: 0.98,
      pixelRatio: 2.5,
      cacheBust: true
    });
  };

  const handleShareAsImage = async () => {
    if (!cardRef.current) return;
    setIsExportingImage(true);
    try {
      const blob = await toBlob(cardRef.current, {
        quality: 0.98,
        pixelRatio: 2.5,
        cacheBust: true
      });

      if (!blob) throw new Error('Failed to create card image blob');

      const sideText = isFlipped ? 'ظهر' : 'وجه';
      const fileName = `كارنيه-الشريف-${memberName.replace(/\s+/g, '_')}-${membershipNo}-${sideText}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      // Native Web Share with image
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `كارنيه عضوية الشريف ${memberName}`,
          text: `الهوية الرقمية الرسمية للسادة الأشراف بني هاشم بمصر - الشريف ${memberName} (${membershipNo})`,
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
            link.download = `كارنيه-الشريف-${memberName.replace(/\s+/g, '_')}.png`;
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
        link.download = `كارنيه-الشريف-${memberName.replace(/\s+/g, '_')}-${membershipNo}-${sideText}.png`;
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
        cacheBust: true
      });
      if (blob && navigator.clipboard && (window as any).ClipboardItem) {
        await navigator.clipboard.write([
          new (window as any).ClipboardItem({ 'image/png': blob })
        ]);
        setShareSuccessMsg('تم نسخ صورة الكارنيه للحافظة (يمكنك لصقها في أي تطبيق أو محادثة)');
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
      `*كارنيه عضوية السادة الأشراف بني هاشم في مصر*\n` +
      `👤 الاسم: الشريف ${memberName}\n` +
      `📜 الفرع: ${branchName} (${subClan})\n` +
      `🔢 كود القيد: ${membershipNo}\n` +
      `🏛️ أمانة الأنساب والتوثيق - جمهورية مصر العربية\n` +
      `🔗 بوابة السادة الأشراف: https://banihashim.org.eg`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleDownload = () => {
    handleDownloadImageOnly();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setPhotoUrl(result);
          if (onUpdateMemberPhoto) {
            onUpdateMemberPhoto(result);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (url: string) => {
    setPhotoUrl(url);
    if (onUpdateMemberPhoto) {
      onUpdateMemberPhoto(url);
    }
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
                الهوية الرقمية الرسمية الذكية (كارنيه العضوية)
              </span>
              <span className="text-[10px] text-slate-500 font-mono font-bold">
                {membershipNo}
              </span>
            </div>
            <h3 className="text-xl font-bold font-heritage text-[#064e3b] mt-1">
              كارنيه عضوية السادة الأشراف بني هاشم في مصر
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsUploadingPhoto(!isUploadingPhoto)}
              className="bg-[#fafaf7] hover:bg-emerald-50 text-[#064e3b] border border-[#064e3b]/30 p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              title="تغيير الصورة الشخصية"
            >
              <Camera className="w-4 h-4 text-[#d4af37]" />
              <span className="hidden sm:inline">تغيير الصورة</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 text-base font-bold p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Photo Upload Panel (Expandable) */}
        {isUploadingPhoto && (
          <div className="bg-[#fafaf7] p-4 rounded-2xl border border-amber-200 text-xs space-y-3 no-print animate-fadeIn">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-[#064e3b] flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-[#d4af37]" />
                <span>رفع وتعديل الصورة الشخصية للكارنيه</span>
              </h4>
              <button
                onClick={() => setIsUploadingPhoto(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                إغلاق
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
              <div className="w-20 h-24 rounded-2xl border-2 border-[#d4af37] overflow-hidden bg-slate-100 shadow-md shrink-0">
                <img 
                  src={photoUrl} 
                  alt="الصورة الشخصية" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-2 flex-1 w-full text-center sm:text-right">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-[#064e3b] hover:bg-[#0b6e54] text-white px-3.5 py-1.5 rounded-xl font-bold transition-all shadow flex items-center gap-1.5 cursor-pointer text-xs"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>رفع صورة من جهازك</span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  <span className="text-[11px] text-slate-500">أو اختر صورة رمزية:</span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  {PRESET_AVATARS.map((url, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectPreset(url)}
                      className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                        photoUrl === url ? 'border-[#064e3b] scale-110 shadow-md' : 'border-slate-300 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt="Preset" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

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
                className={`w-7 h-7 rounded-full bg-[#f8f6ee] border-2 cursor-pointer transition-all ${cardTheme === 'diplomatic' ? 'border-[#064e3b] ring-2 ring-[#064e3b]/30 scale-110' : 'border-slate-300 opacity-70'}`}
                title="الأبيض الدبلوماسي المذهب"
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

        {/* 3D Flippable Digital Membership Card */}
        <div ref={cardRef} className="relative perspective-1000 min-h-[320px] sm:min-h-[350px]">
          
          {/* CARD FRONT */}
          {!isFlipped ? (
            <div 
              className={`relative overflow-hidden rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-[#d4af37] space-y-5 transition-all animate-fadeIn ${
                cardTheme === 'emerald'
                  ? 'bg-gradient-to-br from-[#064e3b] via-[#0b6e54] to-[#043e2f] text-white'
                  : cardTheme === 'gold'
                  ? 'bg-gradient-to-br from-[#854d0e] via-[#a16207] to-[#713f12] text-white'
                  : cardTheme === 'black'
                  ? 'bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#020617] text-white'
                  : 'bg-gradient-to-br from-[#fcfbf7] via-[#faf7ee] to-[#f4f0e2] text-slate-900 border-2 border-[#d4af37]'
              }`}
            >
              {/* Luxury Guilloche Background & Shimmer */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:14px_14px] pointer-events-none"></div>
              
              {/* Security Shimmer Line */}
              <div className="absolute top-0 right-1/4 w-32 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none"></div>

              {/* Realistic Gold Contact Smart Chip */}
              <div className="absolute top-7 left-7 w-12 h-10 rounded-lg bg-gradient-to-tr from-[#e6ca65] via-[#fff3b0] to-[#b38f26] border border-[#d4af37] p-1 shadow-md flex flex-col justify-between">
                <div className="border-b border-amber-900/30 h-1"></div>
                <div className="flex justify-between items-center px-1">
                  <div className="w-1.5 h-1.5 rounded-full border border-amber-900/40"></div>
                  <div className="w-1.5 h-1.5 rounded-full border border-amber-900/40"></div>
                </div>
                <div className="border-t border-amber-900/30 h-1"></div>
              </div>

              {/* Card Top Header: Crest & Organization */}
              <div className={`flex items-center justify-between relative z-10 border-b pb-3 pr-1 ${
                cardTheme === 'diplomatic' ? 'border-[#d4af37]/40' : 'border-white/20'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#d4af37] p-0.5 flex items-center justify-center shadow-lg">
                    <div className="w-full h-full bg-[#064e3b] rounded-[14px] flex items-center justify-center border border-[#d4af37]/60">
                      <span className="text-[#d4af37] font-heritage font-bold text-base">هاشم</span>
                    </div>
                  </div>
                  <div>
                    <h4 className={`font-heritage text-lg sm:text-xl font-bold tracking-wide ${
                      cardTheme === 'diplomatic' ? 'text-[#064e3b]' : 'text-white'
                    }`}>
                      السادة الأشراف بني هاشم في مصر
                    </h4>
                    <p className={`text-[11px] font-semibold ${
                      cardTheme === 'diplomatic' ? 'text-amber-800' : 'text-emerald-200'
                    }`}>
                      بطاقة عضوية رسمية معتمدة • أمانة الأنساب بمصر
                    </p>
                  </div>
                </div>

                <div className="text-left hidden sm:block">
                  <span className={`font-mono text-xs font-bold px-3 py-1 rounded-lg border block ${
                    cardTheme === 'diplomatic' 
                      ? 'bg-[#064e3b] text-[#d4af37] border-[#d4af37]' 
                      : 'bg-black/40 text-[#d4af37] border-[#d4af37]/40'
                  }`}>
                    {membershipNo}
                  </span>
                  <span className={`text-[9px] block mt-0.5 font-bold ${
                    cardTheme === 'diplomatic' ? 'text-slate-500' : 'text-emerald-300/80'
                  }`}>
                    كود السجل العام
                  </span>
                </div>
              </div>

              {/* Card Middle: Member Photo & Identity Details */}
              <div className="flex items-center gap-5 relative z-10 pt-1">
                
                {/* Member Photo Frame with Gold Rim & Verification Seal */}
                <div className="relative shrink-0">
                  <div className="w-24 h-30 sm:w-28 sm:h-34 rounded-2xl border-3 border-[#d4af37] overflow-hidden shadow-2xl bg-black/20">
                    <img 
                      src={photoUrl} 
                      alt={memberName} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div 
                    title="سند نسبي معتمد"
                    className="absolute -bottom-2.5 -left-2.5 bg-[#064e3b] text-[#d4af37] p-1.5 rounded-full border-2 border-[#d4af37] shadow-xl"
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>

                {/* Member Text Info */}
                <div className="space-y-2 flex-1">
                  <div>
                    <span className={`text-[10px] block font-bold ${
                      cardTheme === 'diplomatic' ? 'text-slate-500' : 'text-emerald-200'
                    }`}>
                      اسم الشريف الكامل:
                    </span>
                    <h3 className={`text-base sm:text-lg font-bold font-heritage leading-tight ${
                      cardTheme === 'diplomatic' ? 'text-[#064e3b]' : 'text-white'
                    }`}>
                      {memberName}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className={`p-2 rounded-xl border ${
                      cardTheme === 'diplomatic'
                        ? 'bg-white/80 border-[#d4af37]/40'
                        : 'bg-black/25 border-white/10'
                    }`}>
                      <span className={`text-[10px] block ${
                        cardTheme === 'diplomatic' ? 'text-slate-500' : 'text-emerald-200'
                      }`}>
                        الفرع والبيت الهاشمي:
                      </span>
                      <span className="font-bold text-[#d4af37] text-[11px] sm:text-xs line-clamp-1">
                        {branchName}
                      </span>
                    </div>

                    <div className={`p-2 rounded-xl border ${
                      cardTheme === 'diplomatic'
                        ? 'bg-white/80 border-[#d4af37]/40'
                        : 'bg-black/25 border-white/10'
                    }`}>
                      <span className={`text-[10px] block ${
                        cardTheme === 'diplomatic' ? 'text-slate-500' : 'text-emerald-200'
                      }`}>
                        مقر الإقامة والمركز:
                      </span>
                      <span className={`font-bold text-[11px] sm:text-xs line-clamp-1 ${
                        cardTheme === 'diplomatic' ? 'text-slate-800' : 'text-white'
                      }`}>
                        {city} - {country}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Microtext Line */}
              <div className="text-[8px] text-center tracking-widest uppercase opacity-60 border-t border-b border-white/10 py-0.5 overflow-hidden whitespace-nowrap">
                • السادة الأشراف بني هاشم بمصر • نقابة الأشراف • أمانة الأنساب • توثيق السجلات الشرعية •
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
                  <div className="w-12 h-12 bg-white rounded-xl p-1 flex items-center justify-center text-slate-900 shadow-md border border-[#d4af37]/60">
                    <QrCode className="w-10 h-10" />
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* CARD BACK */
            <div 
              className={`relative overflow-hidden rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-[#d4af37] space-y-4 transition-all animate-fadeIn ${
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
              <div className="w-full h-11 bg-black/90 -mx-6 sm:-mx-7 mb-2 border-y border-white/10 flex items-center justify-end px-6">
                <span className="text-[9px] text-[#d4af37] font-mono tracking-widest">
                  SECURE HASHIMITE CHIP ENCODING
                </span>
              </div>

              {/* Lineage Summary */}
              <div className="space-y-1.5 text-xs">
                <span className="text-[11px] text-[#d4af37] font-bold block flex items-center gap-1">
                  <FileCheck className="w-3.5 h-3.5" />
                  سند وسلسلة النسب الشريف المعتمدة:
                </span>
                <p className={`text-[11px] font-heritage leading-relaxed p-3 rounded-xl border line-clamp-3 ${
                  cardTheme === 'diplomatic'
                    ? 'bg-white text-slate-800 border-[#d4af37]/40'
                    : 'bg-black/30 text-slate-200 border-white/10'
                }`}>
                  « {lineageChain} »
                </p>
              </div>

              {/* Identity & Legal Security Box */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className={`p-2.5 rounded-xl border space-y-0.5 ${
                  cardTheme === 'diplomatic'
                    ? 'bg-white text-slate-800 border-[#d4af37]/40'
                    : 'bg-black/30 text-white border-white/10'
                }`}>
                  <span className="text-[10px] text-slate-400 block font-bold">الرقم القومي / المرجعي:</span>
                  <span className="font-mono font-bold text-[#d4af37]">{nationalId}</span>
                </div>
                
                <div className={`p-2.5 rounded-xl border space-y-0.5 ${
                  cardTheme === 'diplomatic'
                    ? 'bg-white text-slate-800 border-[#d4af37]/40'
                    : 'bg-black/30 text-white border-white/10'
                }`}>
                  <span className="text-[10px] text-slate-400 block font-bold">جهة الاعتماد:</span>
                  <span className="font-bold">أمانة الأنساب بمصر</span>
                </div>
              </div>

              {/* Barcode and Signature */}
              <div className={`flex items-center justify-between pt-2 border-t ${
                cardTheme === 'diplomatic' ? 'border-[#d4af37]/40' : 'border-white/20'
              }`}>
                <div>
                  <span className="text-[9px] text-slate-400 block">توقيع أمانة الأنساب:</span>
                  <span className="font-heritage text-xs text-[#d4af37] font-bold">د. إبراهيم بن محمد الجعفري</span>
                </div>

                <div className="text-left font-mono text-[9px] tracking-widest bg-black/40 text-[#d4af37] px-3 py-1 rounded border border-[#d4af37]/40">
                  |||||||| | |||||| || |||||||| ||||
                </div>
              </div>

              <div className={`text-center text-[9px] pt-1 font-bold ${
                cardTheme === 'diplomatic' ? 'text-[#064e3b]' : 'text-emerald-300/80'
              }`}>
                تجمع السادة الأشراف بني هاشم في جمهورية مصر العربية • الأمانة العامة
              </div>

            </div>
          )}

        </div>

        {/* Modal Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-2 no-print">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsUploadingPhoto(true)}
              className="text-slate-600 hover:text-[#064e3b] font-bold flex items-center gap-1.5 cursor-pointer bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition-all"
            >
              <Camera className="w-4 h-4 text-[#d4af37]" />
              <span>تغيير الصورة</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
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
              <span>{isExportingImage ? 'جاري تجهيز الصورة...' : 'مشاركة الكارنيه كصورة'}</span>
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
              <span>{downloaded ? 'تم الحفظ' : 'تحميل صورة PNG'}</span>
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
    </div>
  );
};

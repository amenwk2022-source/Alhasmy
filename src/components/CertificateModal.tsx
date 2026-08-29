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
  Calendar, 
  User, 
  Sliders, 
  FileText,
  Building,
  CheckCircle2,
  Lock,
  Layers,
  Share2,
  Image as ImageIcon,
  Copy,
  MessageCircle,
  Loader2
} from 'lucide-react';
import { toPng, toBlob } from 'html-to-image';

interface CertificateModalProps {
  member: UserProfile | RegisteredMember | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ member, onClose }) => {
  const [downloaded, setDownloaded] = useState(false);
  const [theme, setTheme] = useState<'emerald' | 'parchment' | 'royal'>('emerald');
  const [showPhoto, setShowPhoto] = useState(true);
  const [customDedication, setCustomDedication] = useState('');
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [isExportingImage, setIsExportingImage] = useState(false);
  const [shareSuccessMsg, setShareSuccessMsg] = useState<string | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const certRef = useRef<HTMLDivElement>(null);

  if (!member) return null;

  const memberName = 'fullName' in member ? member.fullName : ((member as any).name || (member as any).recipientName || 'الشريف المكرم');
  const membershipNo = member.membershipNumber || (member as any).documentNumber || 'BH-EG-1447-0786';
  const branchName = member.branch || 'الأشراف الجعافرة (أشراف الصعيد)';
  const joinDate = 'joinDateHijri' in member ? member.joinDateHijri : ((member as any).joinDate || (member as any).issueDateHijri || '1447/08/29 هـ');
  const avatarUrl = 'avatarUrl' in member ? member.avatarUrl : undefined;
  const lineageChain = ('lineageChainSummary' in member && member.lineageChainSummary)
    ? member.lineageChainSummary 
    : ((member as any).lineageChainText || 'سلسلة شريفة متصلة إلى الدوحة النبوية المباركة وسيد شباب أهل الجنة والجد الجامع هاشم بن عبد مناف، مصدقة ومقيدة بسجلات أمانة الأنساب بجمهورية مصر العربية.');

  const handlePrint = () => {
    window.print();
  };

  // Generate Image Blob or Data URL
  const generateCertificateImage = async () => {
    if (!certRef.current) return null;
    return await toPng(certRef.current, {
      quality: 0.98,
      pixelRatio: 2.2,
      cacheBust: true,
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
        backgroundColor: theme === 'emerald' ? '#fdfcf7' : theme === 'parchment' ? '#fcf8ec' : '#fafaf7'
      });

      if (!blob) throw new Error('Failed to create image blob');

      const fileName = `شهادة-الشريف-${memberName.replace(/\s+/g, '_')}-${membershipNo}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      // Check if native Web Share with files is supported
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `شهادة انتساب الشريف ${memberName}`,
          text: `شهادة انضمام وانتساب السادة الأشراف بني هاشم في مصر - الشريف ${memberName} (كود القيد: ${membershipNo})`,
          files: [file]
        });
        setShareSuccessMsg('تمت مشاركة الشهادة بنجاح!');
      } else {
        // Fallback: Download PNG directly + open share menu options
        const dataUrl = await generateCertificateImage();
        if (dataUrl) {
          const link = document.createElement('a');
          link.download = fileName;
          link.href = dataUrl;
          link.click();
        }
        setShareSuccessMsg('تم حفظ الشهادة كصورة عالية الدقة PNG');
        setShowShareMenu(true);
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Error sharing image:', err);
        // Fallback: Download image
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
        setShareSuccessMsg('تم تحميل الصورة بجودة عالية PNG');
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
        cacheBust: true
      });
      if (blob && navigator.clipboard && (window as any).ClipboardItem) {
        await navigator.clipboard.write([
          new (window as any).ClipboardItem({ 'image/png': blob })
        ]);
        setShareSuccessMsg('تم نسخ صورة الشهادة للحافظة (يمكنك لصقها مباشرة في الواتساب أو البرامج)');
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

  const handleDownload = () => {
    handleDownloadImageOnly();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-4 sm:p-8 space-y-6 shadow-2xl border-2 border-[#d4af37] max-h-[96vh] overflow-y-auto">
        
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
            <button
              onClick={() => setIsCustomizing(!isCustomizing)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-[#064e3b]" />
              <span>{isCustomizing ? 'إخفاء خيارات الشهادة' : 'تخصيص الشهادة'}</span>
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
          <div className="bg-emerald-50 border-2 border-emerald-500 text-emerald-900 p-3.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-between gap-2 shadow-lg animate-fadeIn no-print">
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

        {/* PRINTABLE OFFICIAL CERTIFICATE DOCUMENT CONTAINER */}
        <div 
          ref={certRef}
          id="official-certificate-print" 
          className={`relative p-6 sm:p-12 rounded-3xl transition-all border-8 shadow-2xl print:border-4 print:shadow-none print:m-0 print:p-8 ${
            theme === 'emerald'
              ? 'bg-[#fdfcf7] border-[#064e3b]'
              : theme === 'parchment'
              ? 'bg-[#fcf8ec] border-[#854d0e]'
              : 'bg-[#fafaf7] border-[#0f172a]'
          }`}
        >
          {/* Inner Golden Ornate Border Frame */}
          <div className="border-4 border-[#d4af37] border-double rounded-2xl p-6 sm:p-10 space-y-6 relative overflow-hidden">
            
            {/* Background Islamic Arabesque Seal & Watermark */}
            <div className="absolute inset-0 opacity-5 flex items-center justify-center pointer-events-none">
              <div className="w-96 h-96 rounded-full border-8 border-[#064e3b] flex items-center justify-center">
                <span className="font-heritage text-9xl font-bold text-[#064e3b]">هاشم</span>
              </div>
            </div>

            {/* Certificate Top Header */}
            <div className="text-center space-y-3 relative z-10">
              
              {/* Basmala */}
              <div className="font-heritage text-lg sm:text-2xl font-bold text-[#d4af37] tracking-widest">
                بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ
              </div>

              {/* Quranic Ayah of Kinship */}
              <div className="text-xs sm:text-sm font-heritage text-[#064e3b] font-bold italic bg-[#fcfbf7] inline-block px-4 py-1 rounded-full border border-[#d4af37]/40 shadow-xs">
                ﴿ قُل لَّا أَسْأَلُكُمْ عَلَيْهِ أَجْرًا إِلَّا الْمَوَدَّةَ فِي الْقُرْبَىٰ ﴾
              </div>

              {/* Official Emblems & Country */}
              <div className="flex items-center justify-between border-b-2 border-[#d4af37]/60 pb-4 pt-2">
                <div className="text-right space-y-0.5">
                  <span className="text-[10px] sm:text-xs text-slate-500 font-bold block">جمهورية مصر العربية</span>
                  <span className="text-xs sm:text-sm font-heritage font-bold text-[#064e3b] block">أمانة الأنساب والتوثيق</span>
                </div>

                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-[#d4af37] bg-[#064e3b] p-1 flex items-center justify-center shadow-lg">
                  <div className="w-full h-full border border-[#d4af37]/60 rounded-full flex flex-col items-center justify-center text-white">
                    <span className="font-heritage font-bold text-xs sm:text-sm text-[#d4af37]">بني هاشم</span>
                    <span className="text-[8px] sm:text-[9px] text-emerald-200">مصر</span>
                  </div>
                </div>

                <div className="text-left space-y-0.5">
                  <span className="text-[10px] sm:text-xs text-slate-500 font-bold block">رقم القيد والتسجيل</span>
                  <span className="text-xs sm:text-sm font-mono font-bold text-[#064e3b] block">{membershipNo}</span>
                </div>
              </div>

              {/* Certificate Title */}
              <div className="pt-2 space-y-1">
                <h1 className="text-2xl sm:text-4xl font-bold font-heritage text-[#064e3b] tracking-wide">
                  شـهـادة انـضـمـام وانـتـسـاب
                </h1>
                <p className="text-xs sm:text-sm font-heritage text-[#d4af37] font-bold tracking-wider">
                  سجل السادة الأشراف بني هاشم في جمهورية مصر العربية
                </p>
              </div>

            </div>

            {/* Certificate Body Text */}
            <div className="space-y-5 text-center relative z-10 py-2">
              
              <p className="text-xs sm:text-base text-slate-700 leading-relaxed font-heritage">
                تـشـهـد الأمانـة العـامـة ولجـنـة تحـقـيـق الأنـسـاب بـأن السـيـد الشـريـف /
              </p>

              {/* Member Full Name and Photo in Center Frame */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 bg-gradient-to-r from-transparent via-[#f5f3e9] to-transparent py-4 px-6 rounded-2xl border-y border-[#d4af37]/50">
                {showPhoto && avatarUrl && (
                  <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl border-2 border-[#d4af37] overflow-hidden shadow-md shrink-0 bg-white">
                    <img src={avatarUrl} alt={memberName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}
                <div className="space-y-1 text-center sm:text-right">
                  <h2 className="text-xl sm:text-3xl font-bold font-heritage text-[#064e3b]">
                    {memberName}
                  </h2>
                  <div className="text-xs sm:text-sm text-slate-600 font-bold">
                    المنتمي إلى: <span className="text-[#854d0e]">{branchName}</span>
                  </div>
                </div>
              </div>

              {/* Proclamation text */}
              <div className="max-w-2xl mx-auto space-y-3">
                <p className="text-xs sm:text-sm text-slate-700 leading-loose font-heritage">
                  قـد ثـبـت صـحـة انـتـسـابـه وانـضـمـامـه الشـريـف إلـى بـيـوت السـادة الأشـراف بـنـي هـاشـم، 
                  بـمـوجـب سـجـلات الأنـسـاب والوثـائـق الشـرعـيـة المـودعـة لـدى الأمـانـة، والـمـتـصـلـة بـسـنـد الـدوحـة الـنـبـويـة الـمـبـاركـة:
                </p>

                {/* Lineage Box */}
                <div className="bg-white/90 p-4 rounded-xl border border-[#d4af37] text-xs sm:text-sm font-heritage font-bold text-[#064e3b] leading-relaxed shadow-inner">
                  « {lineageChain} »
                </div>

                <p className="text-xs text-slate-600 font-heritage">
                  وقد سُجلت هذه العضوية رسمياً في السجل العام للسادة الأشراف بني هاشم في جمهورية مصر العربية، إقراراً بصلة الرحم والتكافل والتعاون على البر والتقوى.
                </p>
              </div>

              {customDedication && (
                <div className="bg-[#fcfbf7] p-3 rounded-xl border border-amber-300 text-xs font-heritage text-slate-800 italic max-w-xl mx-auto">
                  "{customDedication}"
                </div>
              )}

            </div>

            {/* Certificate Footer: Date, Seals, and Signatures */}
            <div className="pt-6 border-t-2 border-[#d4af37]/60 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center text-center text-xs relative z-10">
              
              {/* Right Signature: Head of Genealogy */}
              <div className="space-y-2">
                <span className="text-[11px] text-slate-500 font-bold block">رئيس لجنة تحقيق الأنساب بمصر</span>
                <div className="font-heritage text-sm sm:text-base font-bold text-[#064e3b]">
                  الشريف د. إبراهيم بن محمد الجعفري
                </div>
                <div className="w-24 h-0.5 bg-[#d4af37] mx-auto opacity-50"></div>
                <span className="text-[10px] text-slate-400 block font-mono">توقيع معتمد</span>
              </div>

              {/* Center Stamp: Golden Embossed Seal & QR Code */}
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-4 border-[#d4af37] bg-[#fcfbf7] flex flex-col items-center justify-center text-[#064e3b] font-bold shadow-lg">
                    <ShieldCheck className="w-8 h-8 text-[#d4af37]" />
                    <span className="text-[8px] font-heritage font-bold mt-0.5">خاتم الأمانة العامة</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-lg p-0.5 border border-[#d4af37] shadow">
                    <QrCode className="w-6 h-6 text-[#064e3b]" />
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 font-mono font-bold">
                  تحريراً في: {joinDate}
                </span>
              </div>

              {/* Left Signature: Grand Syndicate / Secretary General */}
              <div className="space-y-2">
                <span className="text-[11px] text-slate-500 font-bold block">الأمين العام لتجمع السادة الأشراف بني هاشم</span>
                <div className="font-heritage text-sm sm:text-base font-bold text-[#064e3b]">
                  الشريف المستشار يحيى بن أحمد الهاشمي
                </div>
                <div className="w-24 h-0.5 bg-[#d4af37] mx-auto opacity-50"></div>
                <span className="text-[10px] text-slate-400 block font-mono">توقيع معتمد</span>
              </div>

            </div>

          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-2 no-print">
          <div className="text-slate-500 text-xs flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>يمكنك مشاركة الشهادة كصورة أو حفظها وطباعتها بجودة عالية</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Share as Image Button */}
            <div className="relative">
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
                <span>{isExportingImage ? 'جاري تجهيز الصورة...' : 'مشاركة الشهادة كصورة'}</span>
              </button>
            </div>

            {/* Quick Actions Dropdown / Secondary Options */}
            <button
              onClick={handleCopyImageToClipboard}
              disabled={isExportingImage}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="نسخ الصورة للحافظة للصقها مباشرة"
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
              <span>{downloaded ? 'تم الحفظ' : 'تحميل صورة PNG'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="bg-[#d4af37] hover:brightness-110 text-[#064e3b] px-4 sm:px-6 py-2.5 rounded-xl font-black transition-all shadow flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة (A4)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Camera, 
  Crop, 
  Check, 
  RotateCw, 
  Sparkles, 
  ShieldCheck, 
  X, 
  Sliders,
  ZoomIn,
  ZoomOut,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';
import { fitImageToAspectRatio } from '../utils/imageUtils';

export interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhotoUrl?: string;
  onSavePhoto?: (photoUrl: string) => void;
  onPhotoSelected?: (photoUrl: string) => void;
  onPhotoSave?: (photoUrl: string) => void;
  title?: string;
  subtitle?: string;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'
];

export const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({
  isOpen,
  onClose,
  currentPhotoUrl,
  onSavePhoto,
  onPhotoSelected,
  onPhotoSave,
  title = 'رفع وتعديل الصورة الشخصية الرسمية',
  subtitle = 'يتم تكييف وضبط أبعاد الصورة تلقائياً لتناسب مقاسات كارنيه العضوية والشهادة وسجلات الأنساب'
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(currentPhotoUrl || null);
  const [targetRatio, setTargetRatio] = useState<number>(3 / 4); // 3:4 (ID Card default)
  const [ratioName, setRatioName] = useState<'3:4' | '1:1' | '4:5'>('3:4');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [autoOptimized, setAutoOptimized] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state whenever modal is opened or currentPhotoUrl changes
  useEffect(() => {
    if (isOpen) {
      setSelectedImage(currentPhotoUrl || null);
      setErrorMsg(null);
      setAutoOptimized(false);
      setZoomLevel(1);
    }
  }, [isOpen, currentPhotoUrl]);

  if (!isOpen) return null;

  const processAndSetImage = async (source: File | string, ratio = targetRatio) => {
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const fittedDataUrl = await fitImageToAspectRatio(source, {
        aspectRatio: ratio,
        maxWidth: 900,
        maxHeight: 1200,
        quality: 0.95
      });
      if (fittedDataUrl) {
        setSelectedImage(fittedDataUrl);
        setAutoOptimized(true);
      }
    } catch (err: any) {
      console.error('Failed to crop and fit image:', err);
      // Even if canvas fitting fails, read raw file if it was a File
      if (source instanceof File) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (typeof e.target?.result === 'string') {
            setSelectedImage(e.target.result);
          }
        };
        reader.readAsDataURL(source);
      } else if (typeof source === 'string') {
        setSelectedImage(source);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMsg('يرجى اختيار ملف صورة صالح (JPEG, PNG, WebP).');
        return;
      }
      processAndSetImage(file, targetRatio);
    }
    // Clear input value so selecting the same file again triggers onChange
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processAndSetImage(file, targetRatio);
    }
  };

  const handleRatioChange = (ratioVal: number, name: '3:4' | '1:1' | '4:5') => {
    setRatioName(name);
    setTargetRatio(ratioVal);
    if (selectedImage) {
      processAndSetImage(selectedImage, ratioVal);
    }
  };

  const handleConfirm = () => {
    if (selectedImage) {
      if (onSavePhoto) onSavePhoto(selectedImage);
      if (onPhotoSelected) onPhotoSelected(selectedImage);
      if (onPhotoSave) onPhotoSave(selectedImage);
      onClose();
    }
  };

  const handleRemovePhoto = () => {
    setSelectedImage(null);
    setAutoOptimized(false);
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-7 space-y-5 shadow-2xl border-2 border-[#d4af37] max-h-[96vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#d4af37]">
              <Sparkles className="w-4 h-4" />
              <span>المعالج الذكي لأبعاد صور العضوية والأنساب</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-heritage text-[#064e3b]">
              {title}
            </h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {subtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs">
            {errorMsg}
          </div>
        )}

        {/* Aspect Ratio Selector Controls */}
        <div className="bg-[#fafaf7] p-3 rounded-2xl border border-amber-200/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1">
              <Crop className="w-3.5 h-3.5 text-[#064e3b]" />
              <span>تكييف أبعاد الصورة حسب القالب المطلوب:</span>
            </span>
            <span className="text-[10px] text-emerald-800 font-mono font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
              نسبة الأبعاد: {ratioName}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleRatioChange(3 / 4, '3:4')}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 border cursor-pointer ${
                ratioName === '3:4'
                  ? 'bg-[#064e3b] text-[#d4af37] border-[#d4af37] shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="w-4 h-5 border-2 border-current rounded-xs"></div>
              <span>صورة كارنيه (3:4)</span>
            </button>

            <button
              type="button"
              onClick={() => handleRatioChange(1, '1:1')}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 border cursor-pointer ${
                ratioName === '1:1'
                  ? 'bg-[#064e3b] text-[#d4af37] border-[#d4af37] shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="w-4 h-4 border-2 border-current rounded-xs"></div>
              <span>مربعة للملف (1:1)</span>
            </button>

            <button
              type="button"
              onClick={() => handleRatioChange(4 / 5, '4:5')}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 border cursor-pointer ${
                ratioName === '4:5'
                  ? 'bg-[#064e3b] text-[#d4af37] border-[#d4af37] shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="w-4 h-5.5 border-2 border-current rounded-xs"></div>
              <span>شهادة ووثيقة (4:5)</span>
            </button>
          </div>
        </div>

        {/* Image Preview & Upload Dropzone Area */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-3xl p-4 sm:p-6 text-center transition-all ${
            isDragging 
              ? 'border-[#064e3b] bg-emerald-50 scale-[1.01]' 
              : 'border-slate-300 bg-slate-50/70 hover:bg-slate-50'
          }`}
        >
          {selectedImage ? (
            <div className="flex flex-col items-center gap-3">
              {/* Preview Container with target aspect ratio */}
              <div 
                className="relative rounded-2xl overflow-hidden border-4 border-[#d4af37] shadow-lg bg-black/5"
                style={{
                  width: ratioName === '1:1' ? '180px' : '160px',
                  height: ratioName === '1:1' ? '180px' : ratioName === '3:4' ? '213px' : '200px'
                }}
              >
                <img
                  src={selectedImage}
                  alt="معاينة الصورة الشخصية"
                  className="w-full h-full object-cover transition-transform duration-200"
                  style={{ transform: `scale(${zoomLevel})` }}
                  referrerPolicy="no-referrer"
                />

                {isProcessing && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white text-xs font-bold gap-2">
                    <div className="w-6 h-6 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
                    <span>جاري تكييف وضبط الأبعاد...</span>
                  </div>
                )}

                {autoOptimized && !isProcessing && (
                  <div className="absolute top-2 right-2 bg-[#064e3b] text-[#d4af37] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#d4af37]/60 shadow flex items-center gap-1">
                    <Check className="w-3 h-3 text-[#d4af37]" />
                    <span>مضبوطة ومكيفة</span>
                  </div>
                )}
              </div>

              {/* Zoom & Fine-tune controls */}
              <div className="flex items-center gap-3 text-xs text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
                <span className="font-bold">مستوى التقريب:</span>
                <button
                  type="button"
                  onClick={() => setZoomLevel(Math.max(1, zoomLevel - 0.1))}
                  className="p-1 hover:bg-slate-100 rounded text-slate-700"
                  title="تصغير"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-xs font-bold text-[#064e3b]">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.1))}
                  className="p-1 hover:bg-slate-100 rounded text-slate-700"
                  title="تكبير"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-[#064e3b]" />
                  <span>اختيار صورة أخرى من جهازك</span>
                </button>
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-600" />
                  <span>إلغاء الصورة</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="py-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#064e3b] flex items-center justify-center mx-auto shadow-inner">
                <Upload className="w-8 h-8 text-[#064e3b]" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-sm">
                  اسحب الصورة وأفلتها هنا، أو اضغط للتصفح
                </h4>
                <p className="text-xs text-slate-500">
                  يدعم صور JPG, PNG عالية الجودة. يقوم النظام آلياً بقص الصورة وتوسيط الوجه وضبط الأبعاد.
                </p>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-[#064e3b] hover:bg-[#0b6e54] text-white px-5 py-2 rounded-xl text-xs font-bold shadow transition-all flex items-center gap-1.5 mx-auto cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>رفع صورة من الجهاز</span>
              </button>
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
          />
        </div>

        {/* Preset Avatars Selection */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-600 block">أو اختر من النماذج الرمزية المعتمدة:</span>
          <div className="grid grid-cols-6 gap-2">
            {PRESET_AVATARS.map((url, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => processAndSetImage(url, targetRatio)}
                className={`w-full aspect-square rounded-2xl overflow-hidden border-2 transition-all cursor-pointer hover:scale-105 ${
                  selectedImage === url ? 'border-[#064e3b] ring-2 ring-[#d4af37] shadow-md' : 'border-slate-200 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold cursor-pointer"
          >
            إلغاء
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedImage || isProcessing}
            className="bg-gradient-to-r from-[#064e3b] to-emerald-700 hover:from-emerald-800 hover:to-[#064e3b] text-white px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md flex items-center gap-2 cursor-pointer border border-[#d4af37]/60 disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
            <span>اعتماد وتطبيق الصورة المكيفة</span>
          </button>
        </div>

      </div>
    </div>
  );
};

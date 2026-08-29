import React, { useState } from 'react';
import { FundProject } from '../types';
import { Heart, CheckCircle2, ShieldCheck, CreditCard, Sparkles } from 'lucide-react';

interface DonateModalProps {
  projects: FundProject[];
  defaultProjectId?: string;
  isOpen: boolean;
  onClose: () => void;
  onDonationSuccess: (projectId: string, amount: number) => void;
}

export const DonateModal: React.FC<DonateModalProps> = ({
  projects,
  defaultProjectId,
  isOpen,
  onClose,
  onDonationSuccess
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    defaultProjectId || projects[0]?.id || ''
  );
  const [amount, setAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('fawry');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const quickAmounts = [200, 500, 1000, 2000, 5000, 10000];

  const handleAmountClick = (val: number) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    const num = parseFloat(e.target.value);
    if (!isNaN(num) && num > 0) {
      setAmount(num);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    onDonationSuccess(selectedProjectId, amount);
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="bg-[#fcfbf7] text-[#d4af37] border border-[#d4af37]/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
              صندوق التكافل والوقف
            </span>
            <h3 className="text-xl font-bold font-heritage text-[#064e3b] mt-1">
              المساهمة في صندوق بني هاشم
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 sm:p-8 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 bg-[#064e3b] text-[#d4af37] rounded-full flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold font-heritage text-[#064e3b]">
              جزاكم الله خيراً وبارك في مالكم
            </h3>
            <p className="text-xs sm:text-sm text-emerald-900 max-w-md mx-auto leading-relaxed">
              «ما نقص مالٌ من صدقة». تم تسجيل مساهمتكم الكريمة بمبلغ <strong className="font-bold text-[#064e3b]">{amount.toLocaleString()} جنيه مصري</strong> في حساب الصندوق التكافلي في مصر.
            </p>

            <div className="bg-white p-4 rounded-2xl border border-emerald-200 text-xs text-slate-700 space-y-1 inline-block text-right">
              <div><span className="text-slate-400">رقم الإيصال:</span> <span className="font-mono font-bold text-[#064e3b]">DON-EG-1447-{Math.floor(10000 + Math.random() * 90000)}</span></div>
              <div><span className="text-slate-400">المشروع:</span> <strong>{projects.find(p => p.id === selectedProjectId)?.title || 'الصندوق العام بمصر'}</strong></div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleReset}
                className="bg-[#064e3b] hover:bg-[#0b6e54] text-white px-6 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* Project Select */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">المسار أو المشروع الخيري *</label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>

            {/* Quick Amounts */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">اختر مبلغ المساهمة (جنيه مصري) *</label>
              <div className="grid grid-cols-3 gap-2">
                {quickAmounts.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleAmountClick(val)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      amount === val && !customAmount
                        ? 'bg-[#064e3b] text-white border-[#064e3b] shadow-sm'
                        : 'bg-[#fafaf7] text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {val.toLocaleString()} ج.م
                  </button>
                ))}
              </div>

              <div className="pt-1">
                <input
                  type="number"
                  placeholder="أو اكتب مبلغاً مخصصاً آخر بالجنيه..."
                  value={customAmount}
                  onChange={handleCustomChange}
                  className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                />
              </div>
            </div>

            {/* Donor Identity */}
            <div className="space-y-2 pt-1 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700">اسم المتبرع الكريم (اختياري)</label>
                <label className="flex items-center gap-1.5 text-slate-500 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded text-[#064e3b]"
                  />
                  <span>فاعل خير</span>
                </label>
              </div>

              {!isAnonymous && (
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="مثال: الشريف أحمد بن محمود الجعفري"
                  className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                />
              )}
            </div>

            {/* Payment Method simulation */}
            <div className="space-y-1.5 pt-1 border-t border-slate-100">
              <label className="font-bold text-slate-700">طريقة السداد الإلكتروني في مصر</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('instapay')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'instapay' ? 'bg-[#fcfbf7] border-[#064e3b] text-[#064e3b] font-bold ring-1 ring-[#064e3b]' : 'bg-[#fafaf7] border-slate-200 text-slate-600'
                  }`}
                >
                  انستاباي InstaPay
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('fawry')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'fawry' ? 'bg-[#fcfbf7] border-[#064e3b] text-[#064e3b] font-bold ring-1 ring-[#064e3b]' : 'bg-[#fafaf7] border-slate-200 text-slate-600'
                  }`}
                >
                  فوري Fawry
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('meeza')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'meeza' ? 'bg-[#fcfbf7] border-[#064e3b] text-[#064e3b] font-bold ring-1 ring-[#064e3b]' : 'bg-[#fafaf7] border-slate-200 text-slate-600'
                  }`}
                >
                  ميزة / فيزا / ماستركارد
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('wallet')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'wallet' ? 'bg-[#fcfbf7] border-[#064e3b] text-[#064e3b] font-bold ring-1 ring-[#064e3b]' : 'bg-[#fafaf7] border-slate-200 text-slate-600'
                  }`}
                >
                  محافظ الهاتف الذكي
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-[#064e3b] hover:bg-[#0b6e54] text-white py-3 rounded-xl font-bold text-xs sm:text-sm shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Heart className="w-4 h-4 text-[#d4af37]" />
                <span>إتمام المساهمة ({amount.toLocaleString()} ج.م)</span>
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
};

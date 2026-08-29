import React, { useState } from 'react';
import { ShieldCheck, Lock, KeyRound, UserCheck, ArrowRight, AlertCircle, Sparkles, Building } from 'lucide-react';

interface AdminLoginViewProps {
  onLoginSuccess: () => void;
  onBackToHome: () => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({
  onLoginSuccess,
  onBackToHome,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      // Required credentials: admin / amen011
      if (username.trim() === 'admin' && password === 'amen011') {
        setIsLoading(false);
        onLoginSuccess();
      } else {
        setIsLoading(false);
        setError('بيانات الدخول غير صحيحة! يرجى التأكد من اسم المستخدم وكلمة السر.');
      }
    }, 400);
  };

  const handleFillCredentials = () => {
    setUsername('admin');
    setPassword('amen011');
    setError('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl p-8 border-2 border-[#d4af37] shadow-2xl space-y-6 relative overflow-hidden">
          {/* Islamic Background Pattern Accent */}
          <div className="absolute top-0 right-0 left-0 h-2.5 bg-gradient-to-r from-[#d4af37] via-[#064e3b] to-[#d4af37]"></div>
          
          <div className="text-center space-y-3 pt-2">
            <div className="w-18 h-18 mx-auto rounded-3xl bg-gradient-to-br from-[#064e3b] to-[#043e2f] p-1 shadow-xl flex items-center justify-center border-2 border-[#d4af37]">
              <div className="w-full h-full rounded-[20px] bg-[#064e3b] flex items-center justify-center">
                <ShieldCheck className="w-10 h-10 text-[#d4af37]" />
              </div>
            </div>

            <div className="space-y-1">
              <span className="inline-block bg-[#fcfbf7] text-[#064e3b] text-xs font-black px-3.5 py-1 rounded-full border border-[#d4af37]/50 shadow-sm">
                بوابة الأمانة العامة والإدارة المستقلة
              </span>
              <h2 className="text-2xl font-bold font-heritage text-[#064e3b]">
                تسجيل دخول الإدارة العليا
              </h2>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                لوحة التحكم المخصصة للأمانة العامة، إدارة السجلات، واعتماد المشجرات وإصدار الوثائق
              </p>
            </div>
          </div>

          {/* Login Error Notification */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">
                اسم المستخدم الإداري:
              </label>
              <div className="relative">
                <input
                  id="admin-username-input"
                  type="text"
                  required
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full p-3 pl-3 pr-10 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#064e3b] text-slate-900 font-mono text-sm outline-none transition-all"
                />
                <UserCheck className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">
                كلمة المرور السرية:
              </label>
              <div className="relative">
                <input
                  id="admin-password-input"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-3 pl-3 pr-10 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#064e3b] text-slate-900 font-mono text-sm outline-none transition-all"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
              </div>
            </div>

            <button
              id="admin-login-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#064e3b] hover:bg-[#0b6e54] text-white py-3.5 rounded-xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              {isLoading ? (
                <span>جاري التحقق والمصادقة...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-[#d4af37]" />
                  <span>دخول لوحة الإدارة والأمانة</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Auto-Fill / Credentials Note */}
          <div className="bg-[#fafaf7] p-3.5 rounded-2xl border border-amber-200 text-slate-700 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#064e3b] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                بيانات الدخول المعتمدة:
              </span>
              <button
                type="button"
                onClick={handleFillCredentials}
                className="text-[11px] font-bold text-[#064e3b] hover:underline cursor-pointer bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded-lg transition-colors"
              >
                تعبئة تلقائية
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[10px]">المستخدم:</span>
                <strong className="text-emerald-900 font-bold">admin</strong>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[10px]">كلمة السر:</span>
                <strong className="text-emerald-900 font-bold">amen011</strong>
              </div>
            </div>
          </div>

          <div className="pt-2 text-center border-t border-slate-100">
            <button
              onClick={onBackToHome}
              className="text-xs text-slate-500 hover:text-[#064e3b] font-bold flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة للبوابة الرئيسية والأقسام العامة</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

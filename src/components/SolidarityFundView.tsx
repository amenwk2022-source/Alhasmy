import React, { useState } from 'react';
import { FundProject } from '../types';
import { 
  HeartHandshake, 
  Heart, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  Award, 
  FileText, 
  CheckCircle2, 
  CreditCard, 
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';

interface SolidarityFundViewProps {
  projects: FundProject[];
  onOpenDonateModal: (projectId?: string) => void;
}

export const SolidarityFundView: React.FC<SolidarityFundViewProps> = ({
  projects,
  onOpenDonateModal
}) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'apply' | 'transparency'>('projects');
  
  // Assistance application form state
  const [applicantName, setApplicantName] = useState('');
  const [applicantBranch, setApplicantBranch] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantCity, setApplicantCity] = useState('');
  const [assistanceType, setAssistanceType] = useState('منحة دراسية جامعية');
  const [assistanceAmount, setAssistanceAmount] = useState('');
  const [applicationDetails, setApplicationDetails] = useState('');
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  const totalTarget = projects.reduce((sum, p) => sum + p.targetAmount, 0);
  const totalRaised = projects.reduce((sum, p) => sum + p.raisedAmount, 0);
  const totalBeneficiaries = projects.reduce((sum, p) => sum + p.beneficiariesCount, 0);

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim() || !applicantPhone.trim() || !applicantBranch.trim()) return;
    setApplicationSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Hero Header */}
      <div className="bg-gradient-to-l from-[#064e3b] via-[#0b6e54] to-[#0d9488] text-white p-6 sm:p-10 rounded-3xl shadow-xl border-b-4 border-[#d4af37] space-y-6">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-black/20 backdrop-blur-md text-[#d4af37] text-xs font-bold px-3.5 py-1 rounded-full border border-[#d4af37]/40 shadow-inner">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>صندوق بني هاشم للتكافل والوقف الخيري</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold font-heritage text-white">
            التكافل والوقف الهاشمي
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            مؤسسة تكافلية مستقلة تحت إشراف لجنة التكافل بمجلس الأعيان؛ لتقديم العون للأسر المتعففة، ورعاية الطلبة الموهوبين، وتيسير الزواج، وتنمية الأوقاف الشرعية بنزاهة وشفافية وسرية تامة.
          </p>
        </div>

        {/* Aggregate Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          <div className="bg-black/20 backdrop-blur-sm border border-white/10 p-4 rounded-2xl">
            <span className="text-[11px] text-emerald-200 block">إجمالي المساهمات المحصلة</span>
            <span className="text-xl sm:text-2xl font-bold font-heritage text-[#d4af37]">
              {totalRaised.toLocaleString()} ج.م
            </span>
          </div>
          <div className="bg-black/20 backdrop-blur-sm border border-white/10 p-4 rounded-2xl">
            <span className="text-[11px] text-emerald-200 block">إجمالي المستفيدين في مصر</span>
            <span className="text-xl sm:text-2xl font-bold font-heritage text-[#d4af37]">
              {totalBeneficiaries.toLocaleString()} مستفيد
            </span>
          </div>
          <div className="bg-black/20 backdrop-blur-sm border border-white/10 p-4 rounded-2xl">
            <span className="text-[11px] text-emerald-200 block">المشاريع التكافلية النشطة</span>
            <span className="text-xl sm:text-2xl font-bold font-heritage text-[#d4af37]">
              {projects.length} مشاريع
            </span>
          </div>
          <div className="bg-black/20 backdrop-blur-sm border border-white/10 p-4 rounded-2xl">
            <span className="text-[11px] text-emerald-200 block">الحوكمة والرقابة</span>
            <span className="text-sm font-bold text-emerald-100 flex items-center gap-1 mt-1">
              <ShieldCheck className="w-4 h-4 text-[#d4af37]" /> مدقق شرعياً ومحاسبياً
            </span>
          </div>
        </div>
      </div>

      {/* Internal Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'projects'
              ? 'bg-[#064e3b] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          مشاريع الصندوق المفتوحة للتبرع
        </button>

        <button
          onClick={() => setActiveTab('apply')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'apply'
              ? 'bg-[#064e3b] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          تقديم طلب مساعدة / منحة
        </button>

        <button
          onClick={() => setActiveTab('transparency')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'transparency'
              ? 'bg-[#064e3b] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          الشفافية والحوكمة والتقارير
        </button>
      </div>

      {/* Tab 1: Projects Grid */}
      {activeTab === 'projects' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-7 bg-[#064e3b] rounded-full"></div>
              <h2 className="text-xl font-bold font-heritage text-[#064e3b]">
                المسارات والمشاريع التكافلية المعتمدة
              </h2>
            </div>
            <button
              onClick={() => onOpenDonateModal()}
              className="bg-[#d4af37] hover:brightness-110 text-[#064e3b] text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
            >
              تبرع عام للصندوق
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((proj) => {
              const progress = Math.min(100, Math.round((proj.raisedAmount / proj.targetAmount) * 100));
              const remaining = proj.targetAmount - proj.raisedAmount;

              return (
                <div
                  key={proj.id}
                  className="bg-white border border-slate-200/90 hover:border-[#064e3b]/50 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold bg-emerald-50 text-[#064e3b] border border-emerald-200 px-3 py-1 rounded-full">
                        {proj.category}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {proj.beneficiariesCount} أسرة / طالب مستفيد
                      </span>
                    </div>

                    <h3 className="text-lg font-bold font-heritage text-[#064e3b]">
                      {proj.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                        <span>نسبة الإنجاز: {progress}%</span>
                        <span className="text-[#064e3b]">المتبقي: {remaining > 0 ? remaining.toLocaleString() : 0} ج.م</span>
                      </div>
                      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-l from-[#d4af37] to-[#064e3b] h-full rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>المجموع المحصل: {proj.raisedAmount.toLocaleString()} ج.م</span>
                        <span>المستهدف: {proj.targetAmount.toLocaleString()} ج.م</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => onOpenDonateModal(proj.id)}
                        className="flex-1 bg-[#064e3b] hover:bg-[#0b6e54] text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Heart className="w-4 h-4 text-[#d4af37]" />
                        <span>ساهم الآن في المشروع</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Application for Assistance */}
      {activeTab === 'apply' && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6 max-w-3xl mx-auto animate-fadeIn">
          <div className="border-b border-slate-100 pb-4 space-y-2">
            <span className="bg-emerald-50 text-[#064e3b] border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full">
              بوابة تقديم طلبات المساعدة والمنح
            </span>
            <h2 className="text-2xl font-bold font-heritage text-[#064e3b]">
              نموذج طلب دعم من صندوق بني هاشم للتكافل
            </h2>
            <p className="text-xs text-slate-500">
              تُعامل جميع الطلبات والبيانات بسرية تامة وتُدرس من قِبل لجنة التكافل الاجتماعي بالضوابط الشرعية والنظامية.
            </p>
          </div>

          {applicationSubmitted ? (
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-3xl p-8 text-center space-y-4">
              <div className="w-14 h-14 bg-[#064e3b] text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8 text-[#d4af37]" />
              </div>
              <h3 className="text-xl font-bold font-heritage text-[#064e3b]">
                تم استلام طلبكم بنجاح
              </h3>
              <p className="text-xs sm:text-sm text-emerald-900 max-w-md mx-auto leading-relaxed">
                رقم المتابعة السري: <span className="font-bold font-mono text-[#064e3b]">REQ-1447-{Math.floor(1000 + Math.random() * 9000)}</span>. سيقوم أمين سر لجنة التكافل بالتواصل معكم خلال 3 أيام عمل لاستكمال المستندات اللازمة بعزة وكرامة.
              </p>
              <button
                onClick={() => setApplicationSubmitted(false)}
                className="bg-[#064e3b] hover:bg-[#0b6e54] text-white text-xs font-bold px-6 py-2.5 rounded-xl cursor-pointer shadow-sm"
              >
                تقديم طلب آخر
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitApplication} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">الاسم الرباعي لمقدم الطلب *</label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="مثال: الشريف أحمد بن محمود الجعفري"
                    className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">الفرع أو البيت الهاشمي *</label>
                  <input
                    type="text"
                    required
                    value={applicantBranch}
                    onChange={(e) => setApplicantBranch(e.target.value)}
                    placeholder="مثال: الأشراف الجعافرة / بيت الحجاجية"
                    className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">رقم الهاتف للتواصل المباشر *</label>
                  <input
                    type="tel"
                    required
                    value={applicantPhone}
                    onChange={(e) => setApplicantPhone(e.target.value)}
                    placeholder="+20 10 0000 0000"
                    className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">المدينة / المحافظة بمصر *</label>
                  <input
                    type="text"
                    required
                    value={applicantCity}
                    onChange={(e) => setApplicantCity(e.target.value)}
                    placeholder="مثال: قنا / القاهرة / الأقصر"
                    className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">نوع الدعم المطلوب *</label>
                  <select
                    value={assistanceType}
                    onChange={(e) => setAssistanceType(e.target.value)}
                    className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                  >
                    <option>منحة دراسية جامعية / تميز أكاديمي</option>
                    <option>إعانة زواج للمقبلين على الزواج</option>
                    <option>إعانة أسرة متعففة / سلة غذائية</option>
                    <option>علاج ورعاية صحية عاجلة</option>
                    <option>تفريج كربة وسداد التزامات طارئة</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">المبلغ التقديري المطلوب (ج.م)</label>
                  <input
                    type="number"
                    value={assistanceAmount}
                    onChange={(e) => setAssistanceAmount(e.target.value)}
                    placeholder="مثال: 25,000"
                    className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">شرح الحالة والتفاصيل *</label>
                <textarea
                  rows={4}
                  required
                  value={applicationDetails}
                  onChange={(e) => setApplicationDetails(e.target.value)}
                  placeholder="يرجى ذكر نبذة عن الحالة والالتزامات والمستندات المتوفرة..."
                  className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                ></textarea>
              </div>

              <div className="bg-[#fcfbf7] p-3.5 rounded-2xl border border-[#d4af37]/30 text-[11px] text-slate-700 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>إقرار: أقر بصحة البيانات المذكورة وأوافق على دراستها من لجنة التكافل بالسرية التامة.</span>
              </div>

              <button
                type="submit"
                className="w-full bg-[#064e3b] hover:bg-[#0b6e54] text-white py-3 rounded-2xl font-bold text-xs sm:text-sm shadow transition-all cursor-pointer"
              >
                إرسال الطلب للجنة التكافل
              </button>
            </form>
          )}
        </div>
      )}

      {/* Tab 3: Transparency & Governance */}
      {activeTab === 'transparency' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-2 h-7 bg-[#d4af37] rounded-full"></div>
              <h2 className="text-xl font-bold font-heritage text-[#064e3b]">
                مبادئ الحوكمة والشفافية في صندوق بني هاشم
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#fcfbf7] p-6 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#064e3b] text-[#d4af37] flex items-center justify-center font-bold">
                  1
                </div>
                <h3 className="font-bold text-sm text-slate-900">الرقابة والتدقيق الشرعي</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  يخضع الصندوق لمراجعة شرعية دورية تضمن مطابقة جميع المصارف للأحكام الفقهية المتعلقة بالصدقات والأوقاف والوصايا.
                </p>
              </div>

              <div className="bg-[#fcfbf7] p-6 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#064e3b] text-[#d4af37] flex items-center justify-center font-bold">
                  2
                </div>
                <h3 className="font-bold text-sm text-slate-900">التدقيق المالي المحاسبي</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  حسابات بنكية رسمية مستقلة وتدقيق مالي ربع سنوي معتمد من مكتب محاسبي قانوني لضمان أعلى معايير النزاهة.
                </p>
              </div>

              <div className="bg-[#fcfbf7] p-6 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#064e3b] text-[#d4af37] flex items-center justify-center font-bold">
                  3
                </div>
                <h3 className="font-bold text-sm text-slate-900">السرية وكرامة المستفيدين</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  تُحجب أسماء وهوية الأسر المستفيدة كلياً برقم ملف سري مشفر، وتصل المساعدات مباشرة لحساباتهم المصرفية بعزة تامة.
                </p>
              </div>
            </div>

            <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between text-xs text-[#064e3b]">
              <span className="font-bold">تحميل التقرير المالي والاجتماعي السنوي المدقق لعام 1446هـ (PDF)</span>
              <button className="bg-[#064e3b] text-white px-4 py-2 rounded-xl font-medium hover:bg-[#0b6e54] cursor-pointer shadow-xs">
                تحميل التقرير
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

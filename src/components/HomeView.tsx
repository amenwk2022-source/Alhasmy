import React, { useState } from 'react';
import { 
  TabType, 
  NewsItem, 
  DiwanNotice, 
  FundProject, 
  FamilyBranch,
  CouncilMember 
} from '../types';
import { 
  GitFork, 
  HeartHandshake, 
  Sparkles, 
  Users, 
  BookOpen, 
  ShieldCheck, 
  Calendar, 
  Award, 
  ChevronLeft, 
  Heart, 
  MessageSquare, 
  ArrowRight,
  TrendingUp,
  Clock,
  MapPin,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

interface HomeViewProps {
  news: NewsItem[];
  notices: DiwanNotice[];
  fundProjects: FundProject[];
  branches: FamilyBranch[];
  council: CouncilMember[];
  onSelectTab: (tab: TabType) => void;
  onOpenRegisterModal: () => void;
  onOpenAddNoticeModal: () => void;
  onOpenDonateModal: (projectId?: string) => void;
  onBlessNotice: (noticeId: string) => void;
  onSelectBranch: (branchId: string) => void;
  onOpenMemberCard?: () => void;
  onOpenCertificate?: () => void;
  onOpenPersonalTree?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  news,
  notices,
  fundProjects,
  branches,
  council,
  onSelectTab,
  onOpenRegisterModal,
  onOpenAddNoticeModal,
  onOpenDonateModal,
  onBlessNotice,
  onSelectBranch,
  onOpenMemberCard,
  onOpenCertificate,
  onOpenPersonalTree,
}) => {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  const stats = [
    { label: 'أفراد مسجلون بالبوابة', value: '+38,500', desc: 'في محافظات مصر المختلفة', icon: <Users className="w-5 h-5 text-[#d4af37]" /> },
    { label: 'بيوت وفروع موثقة', value: '142', desc: 'بمشجرات وسجلات معتمدة تاريخياً', icon: <GitFork className="w-5 h-5 text-[#d4af37]" /> },
    { label: 'مساعدات صندوق التكافل', value: '9.4M', desc: 'جنيه مصري للطلاب والأسر', icon: <HeartHandshake className="w-5 h-5 text-[#d4af37]" /> },
    { label: 'مناسبات وفعاليات موثقة', value: '1,420+', desc: 'أفراح وتكريم وصلات رحم بمصر', icon: <Sparkles className="w-5 h-5 text-[#d4af37]" /> },
  ];

  return (
    <div className="space-y-12 pb-16">
      
      {/* Sleek Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-l from-[#064e3b] via-[#0b6e54] to-[#0d9488] text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 rounded-b-3xl shadow-2xl border-b-4 border-[#d4af37]">
        {/* Subtle decorative background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-black/20 backdrop-blur-md border border-[#d4af37]/40 px-4 py-1.5 rounded-full text-xs text-[#d4af37] shadow-inner font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
            <span>بوابة الشمل والصلة والتكافل لآل البيت والبيوت الهاشمية في جمهورية مصر العربية</span>
          </div>

          {/* Main Title */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-heritage tracking-wide text-white leading-tight">
              تجمع السادة الأشراف بني هاشم في مصر
            </h1>
            <p className="text-base sm:text-2xl text-emerald-100 max-w-3xl mx-auto font-light leading-relaxed">
              «صلةٌ وتآلف.. ووقفٌ وتكافل.. وتوثيقٌ لتاريخٍ عريق في أرض الكنانة»
            </p>
          </div>

          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
            مرحباً بكم في الموقع الرسمي لتجمع السادة الأشراف بني هاشم في جمهورية مصر العربية، الرابطة العائلية الجامعة لتوثيق الأنساب الشريفة، وتوطيد أواصر القربى، ودعم المبادرات الخيرية والتعليمية في محافظات الصعيد والدلتا والقاهرة.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-3">
            <button
              id="hero-register-btn"
              onClick={onOpenRegisterModal}
              className="bg-[#d4af37] hover:brightness-110 text-[#064e3b] font-extrabold px-8 py-3.5 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center gap-2 text-sm sm:text-base cursor-pointer hover:scale-[1.02]"
            >
              <Users className="w-5 h-5" />
              <span>تسجيل انتساب فرد / عائلة</span>
            </button>

            <button
              id="hero-genealogy-btn"
              onClick={() => onSelectTab('genealogy')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold px-6 py-3.5 rounded-xl border border-white/20 shadow transition-all flex items-center gap-2 text-sm sm:text-base cursor-pointer"
            >
              <GitFork className="w-5 h-5 text-[#d4af37]" />
              <span>شجرة النسب والبطون الهاشمية</span>
            </button>

            <button
              id="hero-diwan-btn"
              onClick={() => onSelectTab('diwan')}
              className="bg-[#043e2f]/80 hover:bg-[#043e2f] text-[#d4af37] font-bold px-6 py-3.5 rounded-xl border border-[#d4af37]/40 transition-all flex items-center gap-2 text-sm sm:text-base cursor-pointer"
            >
              <Sparkles className="w-5 h-5" />
              <span>ديوان المناسبات والتهاني</span>
            </button>
          </div>

        </div>

        {/* Stats Strip */}
        <div className="max-w-6xl mx-auto mt-14 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <div 
                key={idx}
                className="bg-white/10 backdrop-blur-md border border-white/15 p-5 rounded-2xl text-center space-y-1.5 hover:border-[#d4af37]/70 transition-all shadow-lg"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-black/20 flex items-center justify-center mb-2 border border-white/10 shadow-inner">
                  {stat.icon}
                </div>
                <div className="text-xl sm:text-2xl font-bold font-heritage text-[#d4af37]">{stat.value}</div>
                <div className="text-xs sm:text-sm font-bold text-white">{stat.label}</div>
                <div className="text-[11px] text-emerald-200">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services: Lineage Tree, Photo ID Card & Official Certificate */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[#d4af37] text-xs font-bold bg-[#fcfbf7] border border-[#d4af37]/40 px-3 py-1 rounded-full inline-block mb-1">
                خدمات العضوية والتوثيق المعتمدة
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-heritage text-[#064e3b]">
                شجرة نسبك • كارنيه العضوية بصورتك • شهادة الانضمام الرسمية
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                خدمات رقمية حصرية لأعضاء تجمع السادة الأشراف بني هاشم في مصر لتوثيق الأنساب وإصدار الهويات الرقمية المعتمدة
              </p>
            </div>

            <button
              onClick={() => onSelectTab('profile')}
              className="bg-[#064e3b] hover:bg-[#0b6e54] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
            >
              <span>الانتقال لملفي الشخصي</span>
              <ChevronLeft className="w-4 h-4 text-[#d4af37]" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 1. Lineage Tree Generator Card */}
            <div className="bg-gradient-to-br from-[#fafaf7] to-[#f4f3ec] border-2 border-slate-200 hover:border-[#064e3b] rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#064e3b] text-[#d4af37] flex items-center justify-center shadow-md">
                  <GitFork className="w-6 h-6" />
                </div>
                <h3 className="font-heritage text-lg font-bold text-[#064e3b] group-hover:text-[#0b6e54] transition-colors">
                  مشجر شجرة النسب التفاعلي للشخص
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  أنشئ شجرة نسبك الشخصية، وأضف الآباء والأجداد والأبناء والأحفاد، مع ميزة التكبير والتصغير والطباعة المباشرة.
                </p>
              </div>

              <button
                onClick={() => {
                  if (onOpenPersonalTree) onOpenPersonalTree();
                  else onSelectTab('profile');
                }}
                className="w-full bg-[#064e3b] hover:bg-[#0b6e54] text-white py-2.5 rounded-xl text-xs font-bold shadow flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <GitFork className="w-4 h-4 text-[#d4af37]" />
                <span>فتح شجرة النسب الشخصية</span>
              </button>
            </div>

            {/* 2. Photo ID Card */}
            <div className="bg-gradient-to-br from-[#064e3b] via-[#0b6e54] to-[#043e2f] text-white border-2 border-[#d4af37] rounded-3xl p-6 shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-4 group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#d4af37] text-[#064e3b] flex items-center justify-center shadow-md font-bold">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="font-heritage text-lg font-bold text-white group-hover:text-[#d4af37] transition-colors">
                  كارنيه العضوية الرسمي (بصورتك)
                </h3>
                <p className="text-xs text-emerald-100 leading-relaxed">
                  بطاقة عضوية رقمية موثقة تحمل صورتك الشخصية والرمز الرقمي QR والشريحة الذكية وسلسلة النسب، قابلة للتقليب ثلاثي الأبعاد والتحميل.
                </p>
              </div>

              <button
                onClick={() => {
                  if (onOpenMemberCard) onOpenMemberCard();
                  else onSelectTab('profile');
                }}
                className="w-full bg-[#d4af37] hover:brightness-110 text-[#064e3b] py-2.5 rounded-xl text-xs font-bold shadow flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>عرض وتعديل كارنيه العضوية</span>
              </button>
            </div>

            {/* 3. Official Certificate */}
            <div className="bg-gradient-to-br from-[#fcfbf7] to-[#faf5e6] border-2 border-[#d4af37] rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#d4af37] text-[#064e3b] flex items-center justify-center shadow-md font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-heritage text-lg font-bold text-[#064e3b] group-hover:text-[#0b6e54] transition-colors">
                  شهادة الانضمام الرسمية المعتمدة
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed">
                  شهادة رسمية مذهبة ممهورة بخاتم أمانة الأنساب وتوقيع الأمين العام في مصر، جاهزة للطباعة بجودة A4 والتأطير.
                </p>
              </div>

              <button
                onClick={() => {
                  if (onOpenCertificate) onOpenCertificate();
                  else onSelectTab('profile');
                }}
                className="w-full bg-[#064e3b] hover:bg-[#0b6e54] text-[#d4af37] py-2.5 rounded-xl text-xs font-bold shadow flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                <span>إصدار شهادة الانضمام</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Banner: Annual Gathering & Council Meeting */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#f8f6ee] border border-[#d4af37]/40 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-right">
            <div className="inline-flex items-center gap-1.5 bg-[#d4af37] text-[#064e3b] text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              <Calendar className="w-3.5 h-3.5" />
              <span>الحدث الأبرز القادم</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-heritage text-[#064e3b]">
              الملتقى السنوي العام لبني هاشم في مصر (الدورة الحادية عشرة 1447هـ)
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 max-w-2xl leading-relaxed">
              تحت شعار "صلةٌ وتآلف.. ووقفٌ وتكافل" بقاعة المؤتمرات الكبرى بالأزهر الشريف بالقاهرة. يتضمن تكريم أوائل الثانوية والجامعات وحفظة القرآن، وتدشين معجم أنساب الأشراف بالديار المصرية.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#064e3b] font-medium pt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-[#d4af37]" /> السبت 1 ذو القعدة 1447 هـ (18 أبريل 2026)
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-[#d4af37]" /> قاعة مؤتمرات الأزهر الشريف الكبرى - مدينة نصر، القاهرة
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => onSelectTab('diwan')}
              className="bg-[#064e3b] hover:bg-[#0b6e54] text-[#d4af37] px-6 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all shadow text-center cursor-pointer"
            >
              تأكيد الحضور والمشاركة
            </button>
            <button
              onClick={() => onSelectTab('council')}
              className="bg-white hover:bg-slate-50 text-[#064e3b] border border-slate-200 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all text-center cursor-pointer shadow-sm"
            >
              جدول أعمال الملتقى
            </button>
          </div>
        </div>
      </section>

      {/* Main Grid: Latest Diwan Announcements & Urgent News */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Diwan Live Board (2 Columns) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-7 bg-[#064e3b] rounded-full"></div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold font-heritage text-[#064e3b] flex items-center gap-2">
                    <span>ديوان المناسبات والتهاني والمواساة</span>
                  </h2>
                  <p className="text-xs text-slate-500">شارك أهلك وذوي القربى أفراحهم ومناسباتهم ودعواتك الصادقة</p>
                </div>
              </div>

              <button
                onClick={onOpenAddNoticeModal}
                className="bg-[#064e3b] hover:bg-[#0b6e54] text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>أضف تهنئة / خبراً</span>
              </button>
            </div>

            <div className="space-y-3.5">
              {notices.slice(0, 3).map((notice) => (
                <div
                  key={notice.id}
                  className="bg-white border-r-4 border-r-emerald-600 border border-slate-200/80 hover:border-emerald-600/60 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        notice.category === 'أفراح وزواج' ? 'bg-emerald-100 text-emerald-800' :
                        notice.category === 'تخرج وتفوق' ? 'bg-blue-100 text-blue-800' :
                        notice.category === 'مولود جديد' ? 'bg-amber-100 text-amber-800' :
                        notice.category === 'تعزية ومواساة' ? 'bg-slate-200 text-slate-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {notice.category}
                      </span>
                      <span className="text-xs text-slate-400">{notice.date}</span>
                    </div>

                    <span className="text-xs font-medium text-[#064e3b] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                      {notice.familyBranch}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 leading-snug">
                    {notice.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {notice.content}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {notice.city}
                    </span>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onBlessNotice(notice.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                          notice.userBlessed
                            ? 'bg-rose-50 text-rose-600 border border-rose-200'
                            : 'bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${notice.userBlessed ? 'fill-rose-500 text-rose-500' : ''}`} />
                        <span>{notice.userBlessed ? 'باركت ودعوت' : 'تقديم تبريك / دعاء'}</span>
                        <span className="font-bold">({notice.blessingsCount})</span>
                      </button>

                      {notice.comments && notice.comments.length > 0 && (
                        <span className="text-slate-500 flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                          <span>{notice.comments.length} كلمات</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => onSelectTab('diwan')}
                className="text-[#064e3b] hover:text-[#0b6e54] font-bold text-xs sm:text-sm inline-flex items-center gap-1 cursor-pointer"
              >
                <span>عرض جميع مناسبات وتبريكات ديوان بني هاشم</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Latest News & Resolutions */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
              <div className="w-2 h-7 bg-[#d4af37] rounded-full"></div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-heritage text-[#064e3b]">
                  أخبار وقرارات المجلس
                </h2>
                <p className="text-xs text-slate-500">أحدث مستجدات الأمانة العامة واللجان</p>
              </div>
            </div>

            <div className="space-y-3">
              {news.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedNews(item)}
                  className="bg-white border border-slate-200 hover:border-[#064e3b] p-4.5 rounded-2xl shadow-sm transition-all cursor-pointer space-y-2 group"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="text-[#064e3b] font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-100">
                      {item.category}
                    </span>
                    <span>{item.date}</span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#064e3b] transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>{item.author}</span>
                    <span className="text-[#064e3b] font-bold flex items-center gap-0.5">
                      قراءة المزيد <ChevronLeft className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center pt-1">
              <button
                onClick={() => onSelectTab('news')}
                className="text-[#064e3b] hover:text-[#0b6e54] font-bold text-xs sm:text-sm inline-flex items-center gap-1 cursor-pointer"
              >
                <span>استعراض جميع الأخبار والفعاليات القادمة</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Link to Forum and Heritage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="bg-gradient-to-br from-[#064e3b] to-[#043e2f] text-white p-5 rounded-2xl space-y-2.5 shadow-md border border-[#0b6e54]">
                <div className="flex items-center gap-2 text-[#d4af37]">
                  <MessageSquare className="w-4 h-4 text-[#d4af37]" />
                  <h3 className="font-bold text-xs">منتدى الحوار والنقاش</h3>
                </div>
                <p className="text-[11px] text-emerald-100/90 leading-relaxed">
                  طرح البحوث التاريخية، والاستشارات، والمبادرات الشبابية.
                </p>
                <button
                  onClick={() => onSelectTab('forum')}
                  className="w-full bg-[#d4af37] hover:brightness-110 text-[#064e3b] font-bold text-[11px] py-2 rounded-xl transition-all cursor-pointer shadow"
                >
                  دخول المنتدى
                </button>
              </div>

              <div className="bg-[#f4efe0] text-[#064e3b] p-5 rounded-2xl space-y-2.5 shadow-sm border border-[#d4af37]/40">
                <div className="flex items-center gap-2 text-[#064e3b]">
                  <BookOpen className="w-4 h-4 text-[#d4af37]" />
                  <h3 className="font-bold text-xs">خزانة التراث والمخطوطات</h3>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  أكثر من 180 مخطوطة ووثيقة وقفية ومشجر تاريخي موثق.
                </p>
                <button
                  onClick={() => onSelectTab('heritage')}
                  className="w-full bg-[#064e3b] hover:bg-[#0b6e54] text-white font-bold text-[11px] py-2 rounded-xl transition-all cursor-pointer shadow"
                >
                  تصفح الخزانة
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Major Lineage Branches Showcase */}
      <section className="bg-white/60 py-12 px-4 sm:px-6 lg:px-8 border-y border-emerald-900/10">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="text-center space-y-2 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 text-xs text-[#064e3b] font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <GitFork className="w-3.5 h-3.5 text-[#064e3b]" />
              <span>فروع وبطون النسب الهاشمي الشريف</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-heritage text-[#064e3b]">
              البيوت والسلالات الهاشمية المتفرعة
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              سلاسل كريمة متصلة بالسند التاريخي الموثق من أبناء هاشم بن عبد مناف، والأشراف الحسنيين والحسينيين والعباسيين والجعفريين والعقيليين.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {branches.slice(0, 4).map((branch) => (
              <div
                key={branch.id}
                onClick={() => {
                  onSelectBranch(branch.id);
                  onSelectTab('genealogy');
                }}
                className="bg-white border border-slate-200/90 hover:border-[#064e3b] hover:shadow-lg transition-all rounded-3xl p-6 space-y-3 cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold bg-emerald-50 text-[#064e3b] px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                      {branch.subBranchesCount} فرعاً وعائلة
                    </span>
                    <span className="text-[11px] text-slate-400">سند موثق</span>
                  </div>

                  <h3 className="text-lg font-bold font-heritage text-slate-900 group-hover:text-[#064e3b] transition-colors">
                    {branch.name}
                  </h3>

                  <p className="text-xs text-slate-500 font-medium line-clamp-2">
                    {branch.rootFather}
                  </p>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {branch.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#064e3b] font-bold">
                  <span>استكشاف المشجر والتفاصيل</span>
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => onSelectTab('genealogy')}
              className="bg-[#064e3b] hover:bg-[#0b6e54] text-white px-7 py-3 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <GitFork className="w-4 h-4 text-[#d4af37]" />
              <span>استعراض شجرة النسب الكاملة وجميع الفروع والبيوت ({branches.length} بطناً وفرعاً)</span>
            </button>
          </div>

        </div>
      </section>

      {/* Solidarity Fund Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs text-[#064e3b] font-bold bg-[#f8f6ee] px-3 py-1 rounded-full border border-[#d4af37]/40 mb-1">
                <HeartHandshake className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>صندوق بني هاشم للتكافل والوقف الخيري</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-heritage text-[#064e3b]">
                مشاريع الدعم والتكافل الاجتماعي
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                مبادرات تكافلية لتمكين الطلاب، وتيسير الزواج، وكفالة الأسر، وإدارة الأوقاف بروح الأخوة
              </p>
            </div>

            <button
              onClick={() => onOpenDonateModal()}
              className="bg-[#064e3b] hover:bg-[#0b6e54] text-[#d4af37] px-6 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <Heart className="w-4 h-4 text-[#d4af37]" />
              <span>المساهمة في الصندوق</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {fundProjects.map((proj) => {
              const progress = Math.min(100, Math.round((proj.raisedAmount / proj.targetAmount) * 100));
              return (
                <div
                  key={proj.id}
                  className="bg-[#fafaf7] border border-slate-200/90 rounded-2xl p-5 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        {proj.category}
                      </span>
                      <span className="text-slate-400 text-[11px]">{proj.beneficiariesCount} مستفيد</span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 line-clamp-2">
                      {proj.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2">
                      {proj.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <div className="flex items-center justify-between text-xs text-slate-700 font-semibold">
                      <span>المنجز: {progress}%</span>
                      <span>{proj.raisedAmount.toLocaleString()} / {proj.targetAmount.toLocaleString()} ج.م</span>
                    </div>

                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#064e3b] h-full rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>

                    <button
                      onClick={() => onOpenDonateModal(proj.id)}
                      className="w-full mt-2 bg-white hover:bg-emerald-50 text-[#064e3b] border border-[#064e3b]/30 hover:border-[#064e3b] py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      دعم هذا المشروع
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => onSelectTab('fund')}
              className="text-[#064e3b] hover:text-[#0b6e54] font-bold text-xs sm:text-sm inline-flex items-center gap-1 cursor-pointer"
            >
              <span>استعراض التقارير المالية والشفافية وتقديم طلب مساعدة</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* Council & Leadership Highlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#064e3b] text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border-2 border-[#d4af37]/30">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#0b6e54] pb-5">
            <div>
              <span className="text-xs text-[#d4af37] font-bold bg-black/20 px-3 py-1 rounded-full border border-[#d4af37]/30">
                الهيكل التنظيمي والمؤسسي
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-heritage text-white mt-1">
                مجلس الأعيان واللجان التخصصية
              </h2>
              <p className="text-xs text-emerald-100/90">
                نخبة من العلماء، المؤرخين، الأكاديميين، والقياديين لخدمة أهداف التجمع وتحقيق رؤيته
              </p>
            </div>

            <button
              onClick={() => onSelectTab('council')}
              className="bg-[#d4af37] hover:brightness-110 text-[#064e3b] px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shadow"
            >
              عرض المجلس واللجان
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {council.slice(0, 3).map((member) => (
              <div
                key={member.id}
                className="bg-[#043e2f]/80 border border-[#0b6e54] rounded-2xl p-5 space-y-3 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#b59226] flex items-center justify-center text-[#064e3b] font-extrabold text-lg shadow">
                    {member.name.split(' ')[1]?.[0] || 'هـ'}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#d4af37]">{member.name}</h3>
                    <p className="text-xs text-emerald-200">{member.role}</p>
                    <span className="text-[10px] text-slate-300">{member.branch}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed line-clamp-3">
                  {member.bio}
                </p>

                <div className="pt-2 border-t border-[#0b6e54] flex items-center justify-between text-[11px] text-slate-300">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#d4af37]" /> {member.location}
                  </span>
                  <span className="text-[#d4af37] font-medium">{member.committee}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* News Detail Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                {selectedNews.category}
              </span>
              <button
                onClick={() => setSelectedNews(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold px-2 py-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                إغلاق ✕
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-xs text-slate-400">{selectedNews.date} • {selectedNews.author}</span>
              <h2 className="text-xl sm:text-2xl font-bold font-heritage text-[#064e3b]">
                {selectedNews.title}
              </h2>
            </div>

            <div className="bg-amber-50/70 border-r-4 border-[#d4af37] p-4 rounded-xl text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
              {selectedNews.summary}
            </div>

            <div className="text-sm text-slate-700 leading-relaxed space-y-3">
              <p>{selectedNews.content}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>وقت القراءة التقديري: {selectedNews.readTime}</span>
              <button
                onClick={() => setSelectedNews(null)}
                className="bg-[#064e3b] hover:bg-[#0b6e54] text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer"
              >
                تم الاطلاع
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

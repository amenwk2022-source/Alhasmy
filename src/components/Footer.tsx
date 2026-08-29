import React from 'react';
import { TabType } from '../types';
import { ShieldCheck, MapPin, Phone, Mail, Globe, Heart, GitFork, BookOpen, Users, ArrowUp } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: TabType) => void;
  onOpenRegisterModal: () => void;
  onOpenGenealogyVerifyModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onSelectTab, 
  onOpenRegisterModal,
  onOpenGenealogyVerifyModal 
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#043e2f] text-[#E2E8F0] border-t-4 border-[#d4af37] pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Column 1: Identity & Crest */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#b59226] p-0.5 shadow flex items-center justify-center">
                <div className="w-full h-full bg-[#064e3b] rounded-[14px] flex items-center justify-center border border-[#d4af37]/40">
                  <span className="text-[#d4af37] font-heritage font-bold text-sm">أشراف هاشم</span>
                </div>
              </div>
              <div>
                <h3 className="font-heritage text-xl font-bold text-[#d4af37]">تجمع السادة الأشراف بني هاشم في مصر</h3>
                <p className="text-xs text-emerald-300">الرابطة العائلية والتكافلية الكبرى</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              كيان عائلي جامع يهدف إلى ترسيخ صلة الرحم والتكاتف والتكافل الاجتماعي، وتوثيق الأنساب والتاريخ والتراث الهاشمي الشريف في جمهورية مصر العربية وفق المنهج العلمي المحقق.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-[#d4af37]">
              <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
              <span>موثق ومعتمد من هيئة الأعيان ومجلس الأنساب بمصر</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-[#d4af37] border-r-2 border-[#d4af37] pr-2">
              أقسام البوابة
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <button 
                  onClick={() => onSelectTab('genealogy')} 
                  className="hover:text-[#d4af37] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <GitFork className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>شجرة النسب والبيوت الهاشمية</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectTab('news')} 
                  className="hover:text-[#d4af37] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]"></span>
                  <span>الأخبار والفعاليات ومواعيد اللقاءات</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectTab('forum')} 
                  className="hover:text-[#d4af37] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>منتدى الحوار والنقاش والمبادرات</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectTab('diwan')} 
                  className="hover:text-[#d4af37] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]"></span>
                  <span>ديوان المناسبات والتهاني والمواساة</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectTab('fund')} 
                  className="hover:text-[#d4af37] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  <span>صندوق التكافل والوقف الهاشمي</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectTab('heritage')} 
                  className="hover:text-[#d4af37] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                  <span>مكتبة المخطوطات والوثائق التاريخية</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectTab('council')} 
                  className="hover:text-[#d4af37] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  <span>مجلس الأعيان واللجان التخصصية</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Member Services */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-[#d4af37] border-r-2 border-[#d4af37] pr-2">
              خدمات المنتسبين
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <button 
                  onClick={onOpenRegisterModal} 
                  className="w-full text-right bg-[#064e3b] hover:bg-[#0b6e54] text-white p-2.5 rounded-xl border border-[#0b6e54] transition-all flex items-center justify-between cursor-pointer"
                >
                  <span>تسجيل انتساب فرد / عائلة</span>
                  <span className="text-[10px] bg-[#d4af37] text-[#064e3b] px-2 py-0.5 rounded-full font-bold">متاح</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenGenealogyVerifyModal}
                  className="w-full text-right bg-white/5 hover:bg-white/10 text-slate-200 p-2.5 rounded-xl border border-white/10 transition-all flex items-center justify-between cursor-pointer"
                >
                  <span>طلب فحص وتصديق مشجر نسب</span>
                  <span className="text-[10px] text-[#d4af37]">إلكتروني</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectTab('directory')}
                  className="hover:text-[#d4af37] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>دليل منسقي المناطق والمحافظات</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectTab('fund')}
                  className="hover:text-[#d4af37] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>طلب منحة دراسية أو إعانة زواج</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Locations */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-[#d4af37] border-r-2 border-[#d4af37] pr-2">
              التواصل والمقرات في مصر
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span>المقر الرئيسي: القاهرة - التجمع الخامس / شارع التسعين، مبنى تجمع بني هاشم</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>فرع صعيد مصر: قنا (دندرة) / أسوان (دراو)</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>فرع الإسكندرية والوجه البحري: سموحة / طنطا</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span dir="ltr">+20 2 2750 8899 / +20 10 1234 5678</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>diwan@banihashim.org.eg</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>www.banihashim.org.eg</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#0b6e54] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="text-center sm:text-right">
            <p>© {new Date().getFullYear()} تجمع بني هاشم - جميع الحقوق محفوظة لعموم أبناء وبنات بني هاشم.</p>
            <p className="text-[11px] text-slate-400/80 mt-0.5">البوابة الرقمية الرسمية للتواصل والتكافل والتوثيق النسبي والتاريخي.</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              id="scroll-to-top-btn"
              onClick={scrollToTop}
              className="flex items-center gap-1.5 bg-[#064e3b] hover:bg-[#0b6e54] text-[#d4af37] px-4 py-2 rounded-xl border border-[#d4af37]/30 transition-all cursor-pointer font-bold shadow"
            >
              <span>العودة للأعلى</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

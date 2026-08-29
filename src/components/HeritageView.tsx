import React, { useState } from 'react';
import { HeritageItem, ShrineItem } from '../types';
import { INITIAL_SHRINES } from '../data/mockData';
import { 
  BookOpen, 
  Search, 
  FileText, 
  Download, 
  ShieldCheck, 
  Clock, 
  Eye, 
  Bookmark, 
  Sparkles,
  Scroll,
  Layers,
  MapPin,
  Building2,
  Compass,
  Landmark,
  ExternalLink,
  CheckCircle2,
  X
} from 'lucide-react';

interface HeritageViewProps {
  heritageItems: HeritageItem[];
}

export const HeritageView: React.FC<HeritageViewProps> = ({ heritageItems }) => {
  const [activeTab, setActiveTab] = useState<'manuscripts' | 'shrines' | 'timeline'>('manuscripts');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedShrineCategory, setSelectedShrineCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeItem, setActiveItem] = useState<HeritageItem | null>(null);
  const [activeShrine, setActiveShrine] = useState<ShrineItem | null>(null);

  const manuscriptTypes = [
    { id: 'all', label: 'جميع الوثائق والمخطوطات' },
    { id: 'مخطوطة تاريخية', label: 'المخطوطات النادرة' },
    { id: 'مشجر نسب', label: 'مشجرات الأنساب' },
    { id: 'وثيقة وقفية', label: 'الوثائق الوقفية والحجج' },
    { id: 'كتاب توثيقي', label: 'الكتب والمراجع المحققة' },
    { id: 'ديوان شعري', label: 'الدواوين والقصائد' },
  ];

  const shrineCategories = [
    { id: 'all', label: 'جميع المقامات والمساجد' },
    { id: 'مراقد آل البيت', label: 'مراقد آل البيت النبوي' },
    { id: 'أقطاب السادة الأشراف', label: 'أقطاب السادة الأشراف' },
    { id: 'أعلام ومشايخ مصر', label: 'أعلام وأولياء الصعيد والدلتا' },
  ];

  const filteredItems = heritageItems.filter((item) => {
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.extract.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const filteredShrines = INITIAL_SHRINES.filter((shrine) => {
    const matchesCat = selectedShrineCategory === 'all' || shrine.category === selectedShrineCategory;
    const matchesSearch = 
      shrine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shrine.honoredPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shrine.governorate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shrine.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shrine.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-l from-[#064e3b] via-[#0b6e54] to-[#0d9488] text-white p-6 sm:p-10 rounded-3xl shadow-xl border-b-4 border-[#d4af37] space-y-4">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-black/20 backdrop-blur-md text-[#d4af37] text-xs font-bold px-3.5 py-1 rounded-full border border-[#d4af37]/40 shadow-inner">
            <Landmark className="w-3.5 h-3.5" />
            <span>خزانة الوثائق والمراقد التاريخية في مصر</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold font-heritage text-white">
            مكتبة التراث ومراقد آل البيت في مصر
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            أرشيف رقمي وتوثيقي شامل يضم أندر المخطوطات والوثائق الشرعية، ودليل المراقد والمساجد الكبرى لآل البيت النبوي والسادة الأشراف في القاهرة والصعيد والدلتا.
          </p>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('manuscripts')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'manuscripts'
              ? 'bg-[#064e3b] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4 text-[#d4af37]" />
          <span>المخطوطات والحجج الوقفية ({heritageItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('shrines')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'shrines'
              ? 'bg-[#064e3b] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4 text-[#d4af37]" />
          <span>دليل مراقد ومساجد آل البيت بمصر ({INITIAL_SHRINES.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'timeline'
              ? 'bg-[#064e3b] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Clock className="w-4 h-4 text-[#d4af37]" />
          <span>محطات الحضور الهاشمي في تاريخ مصر</span>
        </button>
      </div>

      {/* TAB 1: Manuscripts & Rare Documents */}
      {activeTab === 'manuscripts' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Filter and Search Bar */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {manuscriptTypes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedType(t.id)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedType === t.id
                      ? 'bg-[#064e3b] text-white shadow-sm'
                      : 'bg-[#fafaf7] text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="relative min-w-[240px]">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث بالعنوان، المؤلف، أو المحتوى..."
                className="w-full bg-[#fafaf7] text-xs sm:text-sm text-slate-900 placeholder-slate-400 rounded-2xl pl-3 pr-9 py-2.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#064e3b] focus:bg-white"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            </div>
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200/90 hover:border-[#064e3b]/50 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold bg-[#fcfbf7] text-[#d4af37] border border-[#d4af37]/40 px-3 py-0.5 rounded-full">
                      {item.type}
                    </span>
                    <span className="text-xs text-slate-400">{item.century}</span>
                  </div>

                  <h3 className="text-lg font-bold font-heritage text-[#064e3b]">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#064e3b] font-bold">
                    المؤلف / المحقق: {item.author}
                  </p>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Extract Quote */}
                  <div className="bg-[#fcfbf7] border-r-4 border-[#d4af37] p-3.5 rounded-2xl text-xs text-slate-700 italic font-amiri leading-relaxed">
                    "{item.extract}"
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span>المقر: {item.archivedAt}</span>
                    <span className="text-[#064e3b] font-bold">{item.pagesCount} صفحة</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveItem(item)}
                      className="flex-1 bg-[#064e3b] hover:bg-[#0b6e54] text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>معاينة تفاصيل المخطوطة والتحقيق</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Historic Shrines & Mosques in Egypt */}
      {activeTab === 'shrines' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Shrines Category Filter */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {shrineCategories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedShrineCategory(c.id)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedShrineCategory === c.id
                      ? 'bg-[#064e3b] text-white shadow-sm'
                      : 'bg-[#fafaf7] text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="relative min-w-[240px]">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث باسم المقام، المدينة، أو المحافظة..."
                className="w-full bg-[#fafaf7] text-xs sm:text-sm text-slate-900 placeholder-slate-400 rounded-2xl pl-3 pr-9 py-2.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#064e3b] focus:bg-white"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            </div>
          </div>

          {/* Shrines Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredShrines.map((shrine) => (
              <div
                key={shrine.id}
                className="bg-white border border-slate-200/90 hover:border-[#064e3b]/50 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold bg-emerald-50 text-[#064e3b] border border-emerald-200 px-3 py-0.5 rounded-full">
                      {shrine.category}
                    </span>
                    <span className="text-xs text-slate-500 font-bold flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#064e3b]" />
                      <span>{shrine.governorate} - {shrine.district}</span>
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold font-heritage text-[#064e3b]">
                    {shrine.name}
                  </h3>

                  <div className="bg-[#fcfbf7] p-2.5 rounded-xl border border-slate-200 text-xs">
                    <span className="font-bold text-[#d4af37] block">السند النسبي:</span>
                    <p className="text-slate-700">{shrine.lineage}</p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {shrine.description}
                  </p>

                  <div className="space-y-1 text-xs text-slate-500 pt-1">
                    <p><strong className="text-slate-700">المعالم المعمارية:</strong> {shrine.architecturalFeatures}</p>
                    <p><strong className="text-slate-700">التقاليد والآداب:</strong> {shrine.visitingTraditions}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono text-[11px]">{shrine.era}</span>
                  <button
                    onClick={() => setActiveShrine(shrine)}
                    className="bg-[#064e3b] hover:bg-[#0b6e54] text-white px-4 py-2 rounded-xl font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>عرض التفاصيل الكاملة</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 3: Historical Epochs Timeline */}
      {activeTab === 'timeline' && (
        <div className="bg-[#fcfbf7] border border-[#d4af37]/40 rounded-3xl p-6 sm:p-10 space-y-6 shadow-sm animate-fadeIn">
          <div className="flex items-center gap-3 border-b border-[#d4af37]/30 pb-4">
            <Clock className="w-6 h-6 text-[#d4af37]" />
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-heritage text-[#064e3b]">
                سجل الحضور والريادة الهاشمية في تاريخ مصر
              </h2>
              <p className="text-xs text-slate-500">محطات فارقة توثق هجرات واستقرار السادة الأشراف بالديار المصرية</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#064e3b] text-sm">العصر النبوي والفتوحات الإسلامية</span>
                <span className="text-[10px] bg-emerald-50 text-[#064e3b] px-2 py-0.5 rounded-full font-bold">20 هـ</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                مشاركة الصحابة والفرسان من بني هاشم وبني عبد المطلب في فتح مصر وبناء مدينة الفسطاط وجامع عمرو بن العاص، وتأسيس أولى روافد العلم العربي والإسلامي في أرض الكنانة.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#064e3b] text-sm">قدوم السيدة زينب ونفيسة العلم</span>
                <span className="text-[10px] bg-emerald-50 text-[#064e3b] px-2 py-0.5 rounded-full font-bold">61 - 193 هـ</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                استقبال أهل مصر لعقيلة الطالبيين السيدة زينب الكبرى ولدعائها الخالد لمصر، ثم قدوم السيدة نفيسة بنت الحسن الأنور وتدريسها للعلم الشريف بحضور الإمام الشافعي.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#064e3b] text-sm">استقرار الجعافرة والأدارسة بالصعيد والدلتا</span>
                <span className="text-[10px] bg-emerald-50 text-[#064e3b] px-2 py-0.5 rounded-full font-bold">القرن 3 - 6 هـ</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                وفود بطون الأشراف الجعافرة لمدن قنا وأسوان وإدفو ودراو، واستقرار الأدارسة في صعيد ومطروح والإسكندرية، وتأسيس القرى والديار والتجارة النيلية والأوقاف.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#064e3b] text-sm">عصر الأقطاب وإنشاء نقابة الأشراف</span>
                <span className="text-[10px] bg-emerald-50 text-[#064e3b] px-2 py-0.5 rounded-full font-bold">القرن 7 هـ - الحديث</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                عصر القطب السيد أحمد البدوي بطنطا وسيدي إبراهيم الدسوقي، وتثبيت نقابة الأشراف لضبط الأنساب وإصدار حجج النسب الشرعية المحفوظة في دار الوثائق المصرية.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Manuscript Detail Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="bg-[#064e3b] text-[#d4af37] text-[10px] font-bold px-3 py-1 rounded-full">
                  {activeItem.type}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-heritage text-[#064e3b] mt-2">
                  {activeItem.title}
                </h3>
                <p className="text-xs text-slate-500 font-bold mt-1">المؤلف: {activeItem.author}</p>
              </div>
              <button
                onClick={() => setActiveItem(null)}
                className="p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-3 bg-[#fafaf7] p-3.5 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[11px]">العصر الزمني:</span>
                  <span className="font-bold text-slate-800">{activeItem.century}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">مكان الحفظ والأرشفة:</span>
                  <span className="font-bold text-slate-800">{activeItem.archivedAt}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">عدد الصفحات المحققة:</span>
                  <span className="font-bold text-slate-800">{activeItem.pagesCount} صفحة</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">جهة التحقيق والمصادقة:</span>
                  <span className="font-bold text-[#064e3b]">{activeItem.verifiedBy}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">الوصف العام والمحتوى:</h4>
                <p className="leading-relaxed bg-white p-3 rounded-xl border border-slate-200 text-slate-600">
                  {activeItem.description}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#064e3b] mb-1">مقتطف ومقدمة المخطوطة:</h4>
                <div className="bg-[#fcfbf7] border-r-4 border-[#d4af37] p-4 rounded-xl font-amiri text-sm leading-relaxed text-slate-800">
                  "{activeItem.extract}"
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setActiveItem(null)}
                className="flex-1 bg-[#064e3b] hover:bg-[#0b6e54] text-white py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                إغلاق المعاينة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shrine Detail Modal */}
      {activeShrine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="bg-[#d4af37] text-[#064e3b] text-[10px] font-bold px-3 py-1 rounded-full">
                  {activeShrine.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-heritage text-[#064e3b] mt-2">
                  {activeShrine.name}
                </h3>
                <p className="text-xs text-slate-500 font-bold mt-1">
                  الموقع: {activeShrine.governorate} - {activeShrine.district}
                </p>
              </div>
              <button
                onClick={() => setActiveShrine(null)}
                className="p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700">
              <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200">
                <span className="text-[#064e3b] font-bold block text-[11px]">نسب وترجمة صاحب المقام:</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{activeShrine.honoredPerson}</p>
                <p className="text-slate-600 mt-1">{activeShrine.lineage}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">نبذة تاريخية وسيرة:</h4>
                <p className="leading-relaxed bg-white p-3 rounded-xl border border-slate-200 text-slate-600">
                  {activeShrine.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-[#fafaf7] p-3 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-800 block mb-1">المعالم المعمارية:</span>
                  <p className="text-slate-600">{activeShrine.architecturalFeatures}</p>
                </div>
                <div className="bg-[#fafaf7] p-3 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-800 block mb-1">التقاليد والزيارات:</span>
                  <p className="text-slate-600">{activeShrine.visitingTraditions}</p>
                </div>
              </div>

              {activeShrine.coordinates && (
                <div className="flex items-center justify-between bg-slate-100 p-3 rounded-xl text-[11px] text-slate-600">
                  <span>الإحداثيات الجغرافية:</span>
                  <span className="font-mono font-bold text-[#064e3b]">{activeShrine.coordinates}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => setActiveShrine(null)}
                className="w-full bg-[#064e3b] hover:bg-[#0b6e54] text-white py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

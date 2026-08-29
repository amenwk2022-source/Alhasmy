import React, { useState } from 'react';
import { FamilyBranch, LineagePerson, GovernorateDistribution, GenealogyReference } from '../types';
import { INITIAL_GOVERNORATES, INITIAL_GENEALOGY_REFERENCES } from '../data/mockData';
import { 
  GitFork, 
  Search, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  UserCheck, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  Info,
  ExternalLink,
  BookOpen,
  Award,
  Layers,
  Compass,
  Users,
  Building2,
  CheckCircle2,
  Filter,
  Sparkles,
  ArrowRight,
  BookMarked
} from 'lucide-react';

interface GenealogyViewProps {
  branches: FamilyBranch[];
  rootNodes: LineagePerson[];
  selectedBranchId?: string;
  onOpenGenealogyVerifyModal: () => void;
}

export const GenealogyView: React.FC<GenealogyViewProps> = ({
  branches,
  rootNodes,
  selectedBranchId,
  onOpenGenealogyVerifyModal
}) => {
  const [activeSection, setActiveSection] = useState<'tree' | 'branches' | 'map' | 'references'>('tree');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>(selectedBranchId || 'all');
  const [activePerson, setActivePerson] = useState<LineagePerson | null>(rootNodes[0] || null);
  const [expandedBranchId, setExpandedBranchId] = useState<string | null>(selectedBranchId || null);
  const [selectedGeneration, setSelectedGeneration] = useState<number | 'all'>('all');
  
  // Governorate Map Filter
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [activeGovernorate, setActiveGovernorate] = useState<GovernorateDistribution | null>(INITIAL_GOVERNORATES[0]);

  const regions = [
    { id: 'all', label: 'جميع محافظات مصر' },
    { id: 'الصعيد ومصر العليا', label: 'الصعيد ومصر العليا' },
    { id: 'الوجه البحري والدلتا', label: 'الوجه البحري والدلتا' },
    { id: 'القاهرة الكبرى والجيزة', label: 'القاهرة الكبرى والجيزة' },
    { id: 'مدن القناة وسيناء', label: 'مدن القناة وسيناء' },
    { id: 'البحر الأحمر والواحات', label: 'البحر الأحمر والواحات' },
  ];

  const filteredGovernorates = INITIAL_GOVERNORATES.filter((gov) => {
    const matchesRegion = selectedRegion === 'all' || gov.region === selectedRegion;
    const matchesSearch = 
      gov.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gov.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gov.prominentBranches.some(b => b.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesRegion && matchesSearch;
  });

  // Filtered branches
  const filteredBranches = branches.filter((b) => {
    const matchesSearch = 
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.lineage.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.rootFather.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.geographicalSpread.some(loc => loc.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (selectedBranchFilter === 'all') return matchesSearch;
    return matchesSearch && b.id === selectedBranchFilter;
  });

  // Filtered nodes
  const filteredNodes = rootNodes.filter((node) => {
    const matchesGen = selectedGeneration === 'all' || node.generation === selectedGeneration;
    const matchesSearch = 
      node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (node.bio && node.bio.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesGen && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-l from-[#064e3b] via-[#0b6e54] to-[#0d9488] text-white p-6 sm:p-10 rounded-3xl shadow-xl border-b-4 border-[#d4af37] relative overflow-hidden space-y-4">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-black/20 backdrop-blur-md text-[#d4af37] text-xs font-bold px-3.5 py-1 rounded-full border border-[#d4af37]/40 shadow-inner">
            <GitFork className="w-3.5 h-3.5" />
            <span>المشجر التاريخي وسجل الأنساب المحقق في مصر</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold font-heritage text-white">
            شجرة النسب والبيوت الهاشمية في مصر
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            استعراض السلاسل المباركة المتصلة من الجد الجامع هاشم بن عبد مناف وذرية الإمامين الحسن والحسين رضي الله عنهما، والبيوت الهاشمية الموثقة في صعيد مصر والدلتا والقاهرة ومدن القناة وسيناء.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              id="request-verify-btn"
              onClick={onOpenGenealogyVerifyModal}
              className="bg-[#d4af37] hover:brightness-110 text-[#064e3b] font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.02]"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>طلب فحص وتوثيق نسب وإصدار مشجر معتمد</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSection('tree')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeSection === 'tree'
              ? 'bg-[#064e3b] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <GitFork className="w-4 h-4 text-[#d4af37]" />
          <span>مشجر النسب وسلسلة الأجيال المباركة</span>
        </button>

        <button
          onClick={() => setActiveSection('branches')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeSection === 'branches'
              ? 'bg-[#064e3b] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4 text-[#d4af37]" />
          <span>دليل البيوت والبطون الهاشمية ({branches.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('map')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeSection === 'map'
              ? 'bg-[#064e3b] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Compass className="w-4 h-4 text-[#d4af37]" />
          <span>خريطة انتشار الأشراف بمحافظات مصر</span>
        </button>

        <button
          onClick={() => setActiveSection('references')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeSection === 'references'
              ? 'bg-[#064e3b] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookMarked className="w-4 h-4 text-[#d4af37]" />
          <span>المراجع والمصادر المحققة</span>
        </button>
      </div>

      {/* SECTION 1: Interactive Tree & Lineage Hierarchy Navigator */}
      {activeSection === 'tree' && (
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-7 bg-[#064e3b] rounded-full"></div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-heritage text-[#064e3b]">
                  السلسلة المباركة (من الجيل الأول إلى فروع الأئمة والأشراف)
                </h2>
                <p className="text-xs text-slate-500">انقر على أي شخصية لاستعراض تفاصيل النسب والسيرة والسند التاريخي</p>
              </div>
            </div>

            {/* Generation filter */}
            <div className="flex items-center gap-1.5 bg-[#fafaf7] p-1.5 rounded-2xl text-xs overflow-x-auto max-w-full border border-slate-200">
              <button
                onClick={() => setSelectedGeneration('all')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  selectedGeneration === 'all' ? 'bg-[#064e3b] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                جميع الأجيال
              </button>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((gen) => (
                <button
                  key={gen}
                  onClick={() => setSelectedGeneration(gen)}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap cursor-pointer ${
                    selectedGeneration === gen ? 'bg-[#064e3b] text-white font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  الجيل {gen}
                </button>
              ))}
            </div>
          </div>

          {/* Tree Nodes Visual Grid & Detail Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Nodes list / Tree Cards */}
            <div className="lg:col-span-2 space-y-3 max-h-[560px] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {filteredNodes.map((node) => {
                  const isSelected = activePerson?.id === node.id;
                  return (
                    <div
                      key={node.id}
                      onClick={() => setActivePerson(node)}
                      className={`p-4.5 rounded-2xl border transition-all cursor-pointer space-y-2 relative ${
                        isSelected
                          ? 'bg-emerald-50/90 border-[#064e3b] shadow-md ring-2 ring-[#064e3b]/20 border-r-4 border-r-[#d4af37]'
                          : 'bg-[#fafaf7] border-slate-200/80 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold bg-white text-[#064e3b] border border-emerald-200 px-2.5 py-0.5 rounded-full shadow-xs">
                          الجيل {node.generation}
                        </span>
                        {node.birthYearHijri && (
                          <span className="text-[11px] text-slate-400">{node.birthYearHijri}</span>
                        )}
                      </div>

                      <h3 className="font-bold text-sm text-slate-900 leading-snug">
                        {node.name}
                      </h3>

                      {node.title && (
                        <p className="text-xs text-[#d4af37] font-bold line-clamp-1">
                          {node.title}
                        </p>
                      )}

                      <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-200/60">
                        <span className="text-[#064e3b] font-bold">{node.branch}</span>
                        <span className="text-slate-400">{node.location}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Active Node Detail Card */}
            {activePerson && (
              <div className="bg-[#fcfbf7] border-2 border-[#d4af37]/50 rounded-3xl p-6 space-y-4 shadow-sm self-start">
                <div className="border-b border-[#d4af37]/30 pb-3">
                  <span className="bg-[#d4af37] text-[#064e3b] text-[10px] font-bold px-3 py-0.5 rounded-full shadow-xs">
                    بطاقة تعريف النسب والترجمة
                  </span>
                  <h3 className="text-xl font-bold font-heritage text-[#064e3b] mt-2">
                    {activePerson.name}
                  </h3>
                  {activePerson.title && (
                    <p className="text-xs text-[#0b6e54] font-bold mt-0.5">
                      {activePerson.title}
                    </p>
                  )}
                </div>

                <div className="space-y-2.5 text-xs text-slate-700">
                  <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-500">الفرع الشريف:</span>
                    <span className="font-bold text-[#064e3b]">{activePerson.branch}</span>
                  </div>

                  <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-500">الجيل من هاشم:</span>
                    <span className="font-bold text-slate-900">الجيل رقم {activePerson.generation}</span>
                  </div>

                  {activePerson.location && (
                    <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-500">الموطن والنشأة:</span>
                      <span className="font-medium text-slate-800">{activePerson.location}</span>
                    </div>
                  )}
                </div>

                {activePerson.bio && (
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-800">نبذة تاريخية وسيرة:</h4>
                    <p className="text-xs text-slate-600 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200">
                      {activePerson.bio}
                    </p>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    onClick={onOpenGenealogyVerifyModal}
                    className="w-full bg-[#064e3b] hover:bg-[#0b6e54] text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>طلب فحص الاتصال بهذا السند الشريف</span>
                  </button>
                </div>
              </div>
            )}

          </div>

        </section>
      )}

      {/* SECTION 2: Major Branches Catalog & Search */}
      {activeSection === 'branches' && (
        <section className="space-y-6 animate-fadeIn">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-7 bg-[#d4af37] rounded-full"></div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-heritage text-[#064e3b]">
                  دليل البطون والأسر والبيوت الهاشمية في مصر ({filteredBranches.length} بيتاً وفرعاً)
                </h2>
                <p className="text-xs text-slate-500">ابحث عن اسم الفرع، السند النسبي، أو النطاق الجغرافي بمحافظات مصر</p>
              </div>
            </div>

            {/* Search bar */}
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث عن فرع، اسم جد، محافظة، مدينة..."
                className="w-full bg-white text-xs sm:text-sm text-slate-900 placeholder-slate-400 rounded-xl pl-3 pr-9 py-2.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#064e3b]"
              />
              <Search className="w-4 h-4 text-[#064e3b] absolute right-3 top-3" />
            </div>
          </div>

          {/* Branches Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBranches.map((branch) => {
              const isExpanded = expandedBranchId === branch.id;
              return (
                <div
                  key={branch.id}
                  className="bg-white border border-slate-200/90 hover:border-[#064e3b]/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg sm:text-xl font-bold font-heritage text-[#064e3b]">
                          {branch.name}
                        </h3>
                        <span className="bg-emerald-50 text-[#064e3b] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                          {branch.subBranchesCount} عائلة موثقة
                        </span>
                      </div>
                      <p className="text-xs text-[#0b6e54] font-semibold mt-0.5">
                        الجد الجامع: {branch.rootFather}
                      </p>
                    </div>

                    <button
                      onClick={() => setExpandedBranchId(isExpanded ? null : branch.id)}
                      className="p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Lineage Trace Box */}
                  <div className="bg-[#fcfbf7] border-r-4 border-[#d4af37] p-3.5 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 block">السلسلة النسبية المتصلة:</span>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {branch.lineage}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {branch.description}
                  </p>

                  {/* Geographic spread tags */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#064e3b]" />
                      <span>الانتشار والتواجد في محافظات مصر:</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {branch.geographicalSpread.map((loc, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] px-2.5 py-0.5 rounded-lg transition-colors"
                        >
                          {loc}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-slate-100 space-y-3 animate-fadeIn text-xs text-slate-600">
                      <div>
                        <span className="font-bold text-slate-800 block mb-1">أبرز الأعلام والشخصيات التاريخية بمصر:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {branch.notableFigures.map((fig, idx) => (
                            <span key={idx} className="bg-emerald-50 text-[#064e3b] border border-emerald-200 px-2.5 py-0.5 rounded-lg text-[11px] font-medium">
                              {fig}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-slate-500">العصر التاريخي: {branch.historicalEra}</span>
                        <button
                          onClick={onOpenGenealogyVerifyModal}
                          className="text-[#064e3b] hover:underline font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          طلب مشجر هذا الفرع <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </section>
      )}

      {/* SECTION 3: Hashemite Egypt Geographic Distribution Map */}
      {activeSection === 'map' && (
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-7 bg-[#064e3b] rounded-full"></div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-heritage text-[#064e3b]">
                  خريطة انتشار وتمركز السادة الأشراف بمحافظات مصر
                </h2>
                <p className="text-xs text-slate-500">
                  توزيع العائلات الموثقة والمراقد التاريخية وممثلي التجمع بالأقاليم المصرية
                </p>
              </div>
            </div>

            {/* Region Filter */}
            <div className="flex items-center gap-1.5 bg-[#fafaf7] p-1.5 rounded-2xl text-xs overflow-x-auto max-w-full border border-slate-200">
              {regions.map((reg) => (
                <button
                  key={reg.id}
                  onClick={() => setSelectedRegion(reg.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedRegion === reg.id
                      ? 'bg-[#064e3b] text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  {reg.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Governorates List */}
            <div className="lg:col-span-2 space-y-3 max-h-[580px] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {filteredGovernorates.map((gov) => {
                  const isSelected = activeGovernorate?.id === gov.id;
                  return (
                    <div
                      key={gov.id}
                      onClick={() => setActiveGovernorate(gov)}
                      className={`p-4.5 rounded-2xl border transition-all cursor-pointer space-y-3 relative ${
                        isSelected
                          ? 'bg-emerald-50/90 border-[#064e3b] shadow-md ring-2 ring-[#064e3b]/20 border-r-4 border-r-[#d4af37]'
                          : 'bg-[#fafaf7] border-slate-200/80 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold font-heritage text-[#064e3b]">
                          {gov.name}
                        </span>
                        <span className="bg-white text-[#d4af37] border border-[#d4af37]/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                          {gov.registeredFamiliesCount} عائلة موثقة
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {gov.description}
                      </p>

                      <div className="pt-2 border-t border-slate-200/60 flex flex-wrap gap-1">
                        {gov.prominentBranches.slice(0, 2).map((br, idx) => (
                          <span key={idx} className="bg-white text-[#064e3b] border border-emerald-200 text-[10px] font-medium px-2 py-0.5 rounded-lg">
                            {br}
                          </span>
                        ))}
                        {gov.prominentBranches.length > 2 && (
                          <span className="text-[10px] text-slate-400 self-center">+{gov.prominentBranches.length - 2} فروع</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Active Governorate Detail Card */}
            {activeGovernorate && (
              <div className="bg-[#fcfbf7] border-2 border-[#d4af37]/50 rounded-3xl p-6 space-y-4 shadow-sm self-start">
                <div className="border-b border-[#d4af37]/30 pb-3">
                  <span className="bg-[#064e3b] text-[#d4af37] text-[10px] font-bold px-3 py-0.5 rounded-full shadow-xs">
                    {activeGovernorate.region}
                  </span>
                  <h3 className="text-2xl font-bold font-heritage text-[#064e3b] mt-2">
                    {activeGovernorate.name}
                  </h3>
                  {activeGovernorate.representativeName && (
                    <p className="text-xs text-slate-500 mt-1">
                      منسق التجمع بالمحافظة: <span className="font-bold text-[#064e3b]">{activeGovernorate.representativeName}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-3 text-xs text-slate-700">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-800 block">نبذة تاريخية عن الاستقرار الهاشمي:</span>
                    <p className="text-slate-600 leading-relaxed">
                      {activeGovernorate.description}
                    </p>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                    <span className="font-bold text-[#064e3b] block">أبرز البيوت والبطون المقيمة:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeGovernorate.prominentBranches.map((br, idx) => (
                        <span key={idx} className="bg-emerald-50 text-[#064e3b] border border-emerald-200 px-2 py-0.5 rounded-md font-medium">
                          {br}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                    <span className="font-bold text-[#d4af37] block">المراقد والمقامات الهاشمية بالمحافظة:</span>
                    <ul className="space-y-1 text-slate-600">
                      {activeGovernorate.historicalShrines.map((shrine, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-[#064e3b]" />
                          <span>{shrine}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={onOpenGenealogyVerifyModal}
                    className="w-full bg-[#064e3b] hover:bg-[#0b6e54] text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Users className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>طلب تسجيل أسرة من {activeGovernorate.name}</span>
                  </button>
                </div>
              </div>
            )}

          </div>

        </section>
      )}

      {/* SECTION 4: Classical References & Sources Library */}
      {activeSection === 'references' && (
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn">
          
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="w-2 h-7 bg-[#d4af37] rounded-full"></div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-heritage text-[#064e3b]">
                المراجع والمصادر المحققة في أنساب السادة الأشراف بمصر
              </h2>
              <p className="text-xs text-slate-500">
                أمهات كتب الأنساب وسجلات دار الوثائق القومية المصرية المعتمدة لدى لجنة تحقيق الأنساب
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {INITIAL_GENEALOGY_REFERENCES.map((ref) => (
              <div
                key={ref.id}
                className="bg-[#fcfbf7] border border-[#d4af37]/40 hover:border-[#064e3b] rounded-3xl p-6 space-y-4 shadow-sm hover:shadow-md transition-all"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-bold bg-[#064e3b] text-[#d4af37] px-2.5 py-0.5 rounded-full">
                    {ref.century}
                  </span>
                  <h3 className="text-lg font-bold font-heritage text-[#064e3b] mt-1">
                    {ref.title}
                  </h3>
                  <p className="text-xs text-slate-600 font-bold">
                    المؤلف: {ref.author}
                  </p>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200">
                  {ref.importance}
                </p>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-700 block">أبرز الأبواب والموضوعات:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {ref.keyTopics.map((topic, idx) => (
                      <span key={idx} className="bg-white text-[#064e3b] border border-emerald-200 text-[10px] px-2.5 py-0.5 rounded-lg">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-emerald-50/80 border-r-4 border-[#064e3b] p-3 rounded-xl text-xs text-slate-700 font-amiri leading-relaxed">
                  {ref.excerpt}
                </div>
              </div>
            ))}
          </div>

        </section>
      )}

    </div>
  );
};

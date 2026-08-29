import React, { useState } from 'react';
import { UserProfile, PersonalTreeNode } from '../types';
import { 
  GitFork, 
  Plus, 
  Trash2, 
  Edit3, 
  Download, 
  Printer, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Sparkles, 
  Check, 
  User, 
  Calendar, 
  Briefcase, 
  MapPin, 
  ShieldCheck, 
  Upload, 
  CheckCircle2,
  Share2,
  RefreshCw
} from 'lucide-react';

interface PersonalFamilyTreeModalProps {
  user: UserProfile;
  onClose: () => void;
  onUpdateUser: (updatedUser: UserProfile) => void;
}

export const PersonalFamilyTreeModal: React.FC<PersonalFamilyTreeModalProps> = ({
  user,
  onClose,
  onUpdateUser
}) => {
  const [activeView, setActiveView] = useState<'visual' | 'pedigree' | 'manage'>('visual');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [downloaded, setDownloaded] = useState(false);
  const [selectedNode, setSelectedNode] = useState<PersonalTreeNode | null>(null);

  // Add/Edit node modal state inside tree
  const [isNodeModalOpen, setIsNodeModalOpen] = useState(false);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [nodeForm, setNodeForm] = useState<Omit<PersonalTreeNode, 'id'>>({
    name: '',
    relation: 'الابن',
    birthYear: '',
    occupation: '',
    location: user.city || 'القاهرة',
    notes: ''
  });

  const treeNodes = user.personalTree || [];

  // Group nodes by relation/generation level
  const ancestors = treeNodes.filter(n => ['الجد الثالث', 'الجد الثاني', 'الجد الأول', 'الأب'].includes(n.relation));
  const rootPerson = treeNodes.find(n => n.relation === 'صاحب الملف') || {
    id: 'pt-root',
    name: user.fullName,
    relation: 'صاحب الملف' as const,
    birthYear: '1414 هـ',
    occupation: user.occupation,
    location: user.city,
    notes: 'صاحب الملف الرئيسي'
  };
  const children = treeNodes.filter(n => ['الابن', 'الابنة'].includes(n.relation));
  const grandchildren = treeNodes.filter(n => ['الحفيد'].includes(n.relation));

  const handleSaveNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nodeForm.name.trim()) return;

    let updatedTree: PersonalTreeNode[];
    if (editingNodeId) {
      updatedTree = treeNodes.map(n => n.id === editingNodeId ? { ...n, ...nodeForm } : n);
    } else {
      const newNode: PersonalTreeNode = {
        id: 'node-' + Date.now(),
        ...nodeForm
      };
      updatedTree = [...treeNodes, newNode];
    }

    onUpdateUser({
      ...user,
      personalTree: updatedTree
    });

    setIsNodeModalOpen(false);
    setEditingNodeId(null);
    setNodeForm({
      name: '',
      relation: 'الابن',
      birthYear: '',
      occupation: '',
      location: user.city || 'القاهرة',
      notes: ''
    });
  };

  const handleDeleteNode = (id: string) => {
    const updated = treeNodes.filter(n => n.id !== id);
    onUpdateUser({
      ...user,
      personalTree: updated
    });
    if (selectedNode?.id === id) {
      setSelectedNode(null);
    }
  };

  const handleOpenEdit = (node: PersonalTreeNode) => {
    setEditingNodeId(node.id);
    setNodeForm({
      name: node.name,
      relation: node.relation,
      birthYear: node.birthYear || '',
      occupation: node.occupation || '',
      location: node.location || '',
      notes: node.notes || ''
    });
    setIsNodeModalOpen(true);
  };

  const handleOpenAdd = (defaultRelation: PersonalTreeNode['relation'] = 'الابن') => {
    setEditingNodeId(null);
    setNodeForm({
      name: '',
      relation: defaultRelation,
      birthYear: '',
      occupation: '',
      location: user.city || 'القاهرة',
      notes: ''
    });
    setIsNodeModalOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-5 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-6xl w-full p-4 sm:p-8 space-y-6 shadow-2xl border-2 border-[#d4af37] max-h-[96vh] overflow-y-auto flex flex-col justify-between">
        
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 no-print">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold bg-[#fcfbf7] text-[#d4af37] border border-[#d4af37]/40 px-3 py-0.5 rounded-full flex items-center gap-1">
                <GitFork className="w-3 h-3 text-[#064e3b]" />
                شجرة النسب الشريف التفاعلية
              </span>
              <span className="text-[10px] text-slate-500 font-mono font-bold">
                {user.membershipNumber}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heritage text-[#064e3b] mt-1">
              شجرة نسب الشريف: {user.fullName}
            </h3>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-2">
            <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1 text-xs font-bold">
              <button
                onClick={() => setActiveView('visual')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeView === 'visual' ? 'bg-white text-[#064e3b] shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                شجرة النسب التفاعلية
              </button>
              <button
                onClick={() => setActiveView('pedigree')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeView === 'pedigree' ? 'bg-white text-[#064e3b] shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                عمود النسب الشريف
              </button>
              <button
                onClick={() => setActiveView('manage')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeView === 'manage' ? 'bg-white text-[#064e3b] shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                إدارة أفراد النسب ({treeNodes.length})
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 text-base font-bold p-1.5 rounded-xl hover:bg-slate-100 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Toolbar (Zoom & Quick Add) */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#fafaf7] p-3 rounded-2xl border border-slate-200/80 text-xs no-print">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOpenAdd('الابن')}
              className="bg-[#064e3b] hover:bg-[#0b6e54] text-white px-3.5 py-1.5 rounded-xl font-bold transition-all shadow flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#d4af37]" />
              <span>إضافة فرد جديد لشجرة النسب</span>
            </button>

            <button
              onClick={() => handleOpenAdd('الأب')}
              className="bg-white hover:bg-slate-50 text-[#064e3b] border border-slate-300 px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة أب أو جد للسلسلة</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-xs">
              <button
                onClick={() => setZoomLevel(prev => Math.max(0.7, prev - 0.1))}
                className="p-1 text-slate-500 hover:text-slate-900 cursor-pointer"
                title="تصغير"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono font-bold px-1 text-slate-700">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.1))}
                className="p-1 text-slate-500 hover:text-slate-900 cursor-pointer"
                title="تكبير"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer border-r border-slate-100 pr-1 mr-1"
                title="إعادة ضبط الحجم"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* MAIN VIEW 1: Visual Interactive Tree Canvas */}
        {activeView === 'visual' && (
          <div className="relative overflow-x-auto overflow-y-auto bg-gradient-to-b from-[#fbfbfa] to-[#f4f3ec] rounded-3xl p-6 sm:p-10 border-2 border-slate-200 min-h-[440px] flex flex-col items-center justify-center shadow-inner">
            
            <div 
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
              className="space-y-8 sm:space-y-12 transition-transform duration-200 w-full max-w-4xl"
            >
              
              {/* Level 1: Ancestors (Grandparents & Father) */}
              <div className="space-y-4 text-center">
                <span className="text-[10px] font-bold bg-[#064e3b]/10 text-[#064e3b] px-3 py-0.5 rounded-full inline-block border border-[#064e3b]/20">
                  طبقة الآباء والأجداد (سلسلة الأصول)
                </span>

                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                  {ancestors.map((anc) => (
                    <div
                      key={anc.id}
                      onClick={() => handleOpenEdit(anc)}
                      className="bg-white hover:bg-emerald-50/50 rounded-2xl p-3.5 sm:p-4 border-2 border-[#d4af37]/60 shadow-md min-w-[160px] sm:min-w-[190px] text-center space-y-1 relative group cursor-pointer transition-all hover:scale-105"
                    >
                      <span className="text-[9px] font-bold bg-[#064e3b] text-[#d4af37] px-2 py-0.5 rounded-full">
                        {anc.relation}
                      </span>
                      <h4 className="font-heritage text-sm sm:text-base font-bold text-[#064e3b]">
                        {anc.name}
                      </h4>
                      {anc.birthYear && (
                        <p className="text-[10px] text-slate-500">الحقبة: {anc.birthYear}</p>
                      )}
                      {anc.location && (
                        <p className="text-[10px] text-slate-500">{anc.location}</p>
                      )}
                    </div>
                  ))}

                  {ancestors.length === 0 && (
                    <button
                      onClick={() => handleOpenAdd('الأب')}
                      className="border-2 border-dashed border-slate-300 hover:border-[#064e3b] rounded-2xl p-4 text-center text-xs text-slate-500 hover:text-[#064e3b] transition-all cursor-pointer"
                    >
                      + أضف والدك أو جدك لشجرة النسب
                    </button>
                  )}
                </div>

                {/* Connecting Vertical Stem */}
                <div className="w-0.5 h-6 bg-[#064e3b]/40 mx-auto"></div>
              </div>

              {/* Level 2: The Core Member (Root Person) */}
              <div className="text-center space-y-2 relative">
                <div className="inline-block bg-gradient-to-r from-[#064e3b] via-[#0b6e54] to-[#043e2f] text-white p-5 sm:p-6 rounded-3xl border-3 border-[#d4af37] shadow-2xl min-w-[240px] sm:min-w-[300px]">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-[#d4af37] overflow-hidden mx-auto mb-2 bg-[#064e3b] shadow-md">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#d4af37] text-2xl font-bold font-heritage">
                        {user.fullName.charAt(0)}
                      </div>
                    )}
                  </div>
                  
                  <span className="text-[10px] font-bold bg-[#d4af37] text-[#064e3b] px-3 py-0.5 rounded-full inline-block mb-1">
                    صاحب شجرة النسب
                  </span>
                  
                  <h3 className="text-base sm:text-xl font-bold font-heritage text-white">
                    {user.fullName}
                  </h3>
                  <p className="text-[11px] text-emerald-200 mt-0.5 font-medium">{user.branch}</p>
                  <p className="text-[10px] text-emerald-300/80 font-mono mt-0.5">{user.membershipNumber}</p>
                </div>

                {/* Connecting Line downwards to children */}
                {(children.length > 0 || grandchildren.length > 0) && (
                  <div className="w-0.5 h-6 bg-[#064e3b]/40 mx-auto"></div>
                )}
              </div>

              {/* Level 3: Children (الذرية والأبناء) */}
              <div className="space-y-4 text-center">
                <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-3 py-0.5 rounded-full inline-block border border-amber-300">
                  الذرية المباركة (الأبناء والبنات والفروع)
                </span>

                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                  {children.map((child) => (
                    <div
                      key={child.id}
                      onClick={() => handleOpenEdit(child)}
                      className="bg-white hover:bg-amber-50/50 rounded-2xl p-3.5 sm:p-4 border-2 border-amber-300 shadow-md min-w-[150px] sm:min-w-[180px] text-center space-y-1 relative group cursor-pointer transition-all hover:scale-105"
                    >
                      <span className="text-[9px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded-full">
                        {child.relation}
                      </span>
                      <h4 className="font-heritage text-sm sm:text-base font-bold text-slate-800">
                        {child.name}
                      </h4>
                      {child.birthYear && (
                        <p className="text-[10px] text-slate-500">سنة الولادة: {child.birthYear}</p>
                      )}
                      {child.location && (
                        <p className="text-[10px] text-slate-500">{child.location}</p>
                      )}
                    </div>
                  ))}

                  {children.length === 0 && (
                    <button
                      onClick={() => handleOpenAdd('الابن')}
                      className="border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-2xl p-4 text-center text-xs text-slate-500 hover:text-amber-700 transition-all cursor-pointer"
                    >
                      + أضف ابناً أو ابنة لشجرة النسب
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* MAIN VIEW 2: Pedigree Column (عمود وسلسلة النسب) */}
        {activeView === 'pedigree' && (
          <div className="bg-[#fafaf7] rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-[11px] font-bold bg-[#064e3b] text-[#d4af37] px-3 py-1 rounded-full inline-block">
                سلسلة النسب المتصلة
              </span>
              <h4 className="text-lg sm:text-xl font-bold font-heritage text-[#064e3b]">
                عمود النسب الشريف من صاحب الملف حتى الجد الجامع
              </h4>
              <p className="text-xs text-slate-500">
                تسلسل السلسلة الهاشمية المباركة المعتمدة لدى لجنة الأنساب بمصر
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-3">
              {/* Stepper items */}
              <div className="relative border-r-2 border-[#064e3b] pr-6 space-y-6 mr-4">
                
                {/* Node 1 */}
                <div className="relative group">
                  <div className="absolute -right-[31px] top-1.5 w-4 h-4 rounded-full bg-[#d4af37] border-2 border-[#064e3b]"></div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <span className="text-[10px] font-bold text-[#064e3b]">الجيل 38 المعاصر:</span>
                    <h5 className="font-heritage text-base font-bold text-[#064e3b]">{user.fullName}</h5>
                    <p className="text-xs text-slate-500 mt-1">{user.occupation} • {user.city}</p>
                  </div>
                </div>

                {/* Ancestors list */}
                {ancestors.map((anc) => (
                  <div key={anc.id} className="relative group">
                    <div className="absolute -right-[31px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-[#064e3b]"></div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                      <span className="text-[10px] font-bold text-slate-500">{anc.relation}:</span>
                      <h5 className="font-heritage text-base font-bold text-slate-800">{anc.name}</h5>
                      <p className="text-xs text-slate-500 mt-1">{anc.occupation || 'سجل الأجداد'} {anc.birthYear && `• ${anc.birthYear}`}</p>
                    </div>
                  </div>
                ))}

                {/* Root Lineage text */}
                <div className="relative group">
                  <div className="absolute -right-[31px] top-1.5 w-4 h-4 rounded-full bg-[#064e3b] border-2 border-[#d4af37]"></div>
                  <div className="bg-[#064e3b] text-white p-4 rounded-2xl border-2 border-[#d4af37] shadow-md">
                    <span className="text-[10px] font-bold text-[#d4af37]">السلسلة التاريخية الشريفة:</span>
                    <p className="font-heritage text-xs sm:text-sm text-[#d4af37] leading-relaxed mt-1">
                      « {user.lineageChainSummary} »
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* MAIN VIEW 3: Manage Nodes Table / Grid */}
        {activeView === 'manage' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                إجمالي أفراد شجرة النسب المسجلين: <strong>{treeNodes.length}</strong>
              </span>
              <button
                onClick={() => handleOpenAdd('الابن')}
                className="bg-[#064e3b] hover:bg-[#0b6e54] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>إضافة فرد جديد</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {treeNodes.map((node) => {
                const isRoot = node.relation === 'صاحب الملف';
                return (
                  <div
                    key={node.id}
                    className={`p-4 rounded-2xl border transition-all relative ${
                      isRoot ? 'bg-emerald-50/60 border-[#064e3b]' : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isRoot ? 'bg-[#064e3b] text-[#d4af37]' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {node.relation}
                      </span>

                      {!isRoot && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEdit(node)}
                            className="text-slate-400 hover:text-[#064e3b] p-1 cursor-pointer"
                            title="تعديل"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteNode(node.id)}
                            className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                            title="حذف"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <h4 className="font-heritage text-base font-bold text-[#064e3b]">
                      {node.name}
                    </h4>

                    <div className="mt-2 space-y-0.5 text-xs text-slate-500">
                      {node.birthYear && <p>سنة الولادة: {node.birthYear}</p>}
                      {node.occupation && <p>المهنة: {node.occupation}</p>}
                      {node.location && <p>المكان: {node.location}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal Bottom Actions (Screen Only) */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-3 border-t border-slate-100 no-print">
          <div className="text-slate-500 text-[11px] flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
            <span>شجرة نسب معتمدة ومحفوظة في حسابك الشخصي</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="bg-[#064e3b] hover:bg-[#0b6e54] text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow flex items-center gap-1.5 cursor-pointer hover:scale-[1.02]"
            >
              {downloaded ? <Check className="w-4 h-4 text-[#d4af37]" /> : <Download className="w-4 h-4" />}
              <span>{downloaded ? 'تم تصدير شجرة النسب' : 'تصدير شجرة النسب كصورة'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="bg-[#d4af37] hover:brightness-110 text-[#064e3b] px-4 py-2.5 rounded-xl font-bold transition-all shadow flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة شجرة النسب</span>
            </button>
          </div>
        </div>

        {/* Add/Edit Individual Node Sub-Modal */}
        {isNodeModalOpen && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border-2 border-[#d4af37] shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-base font-bold font-heritage text-[#064e3b] flex items-center gap-2">
                  <GitFork className="w-4 h-4 text-[#d4af37]" />
                  {editingNodeId ? 'تعديل بيانات الفرد' : 'إضافة فرد جديد لشجرة النسب'}
                </h4>
                <button
                  onClick={() => setIsNodeModalOpen(false)}
                  className="text-slate-400 hover:text-slate-700 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveNode} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">الاسم الكريم:</label>
                  <input
                    type="text"
                    required
                    value={nodeForm.name}
                    onChange={(e) => setNodeForm({ ...nodeForm, name: e.target.value })}
                    placeholder="مثال: الشريف عبد الله بن أحمد..."
                    className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">صلة القرابة:</label>
                    <select
                      value={nodeForm.relation}
                      onChange={(e) => setNodeForm({ ...nodeForm, relation: e.target.value as any })}
                      className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                    >
                      <option value="الأب">الأب</option>
                      <option value="الجد الأول">الجد الأول</option>
                      <option value="الجد الثاني">الجد الثاني</option>
                      <option value="الجد الثالث">الجد الثالث</option>
                      <option value="الابن">الابن</option>
                      <option value="الابنة">الابنة</option>
                      <option value="الحفيد">الحفيد / الحفيدة</option>
                      <option value="الزوجة / الزوج">الزوجة / الزوج</option>
                      <option value="الأخ / الأخت">الأخ / الأخت</option>
                      <option value="العم / العمة">العم / العمة</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">سنة الولادة أو الحقبة:</label>
                    <input
                      type="text"
                      value={nodeForm.birthYear}
                      onChange={(e) => setNodeForm({ ...nodeForm, birthYear: e.target.value })}
                      placeholder="مثال: 1445 هـ"
                      className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">المهنة / الصفة:</label>
                    <input
                      type="text"
                      value={nodeForm.occupation}
                      onChange={(e) => setNodeForm({ ...nodeForm, occupation: e.target.value })}
                      placeholder="مثال: مهندس / طالب"
                      className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">المحافظة / المدينة بمصر:</label>
                    <input
                      type="text"
                      value={nodeForm.location}
                      onChange={(e) => setNodeForm({ ...nodeForm, location: e.target.value })}
                      placeholder="مثال: القاهرة / قنا"
                      className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsNodeModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="bg-[#064e3b] hover:bg-[#0b6e54] text-white px-5 py-2 rounded-xl font-bold shadow"
                  >
                    حفظ في شجرة النسب
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

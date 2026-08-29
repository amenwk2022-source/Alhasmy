import React, { useState } from 'react';
import { DiwanNotice, NoticeCategory } from '../types';
import { copyTextToClipboard } from '../utils/clipboard';
import { 
  Sparkles, 
  Heart, 
  MessageSquare, 
  PlusCircle, 
  Search, 
  MapPin, 
  Send, 
  Calendar, 
  Share2, 
  Check, 
  Filter 
} from 'lucide-react';

interface DiwanViewProps {
  notices: DiwanNotice[];
  onBlessNotice: (noticeId: string) => void;
  onAddComment: (noticeId: string, author: string, text: string) => void;
  onOpenAddNoticeModal: () => void;
}

export const DiwanView: React.FC<DiwanViewProps> = ({
  notices,
  onBlessNotice,
  onAddComment,
  onOpenAddNoticeModal
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: { author: string; text: string } }>({});
  const [activeCommentNoticeId, setActiveCommentNoticeId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories: { id: string; label: string; count?: number }[] = [
    { id: 'all', label: 'جميع المناسبات' },
    { id: 'أفراح وزواج', label: 'أفراح وزواج' },
    { id: 'تخرج وتفوق', label: 'تخرج وتفوق' },
    { id: 'مولود جديد', label: 'مواليد وبشائر' },
    { id: 'ترقية وتكريم', label: 'ترقيات وتكريم' },
    { id: 'تعزية ومواساة', label: 'تعازي ومواساة' },
    { id: 'مجلس وديوان', label: 'مجالس ولقاءات' },
  ];

  const filteredNotices = notices.filter((notice) => {
    const matchesCat = selectedCategory === 'all' || notice.category === selectedCategory;
    const matchesSearch = 
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.personName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.familyBranch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSendComment = (noticeId: string) => {
    const input = commentInputs[noticeId];
    if (!input || !input.text.trim()) return;
    const author = input.author.trim() || 'ابن عم من بني هاشم';
    onAddComment(noticeId, author, input.text.trim());
    setCommentInputs(prev => ({
      ...prev,
      [noticeId]: { author: '', text: '' }
    }));
  };

  const handleShare = async (notice: DiwanNotice) => {
    await copyTextToClipboard(`${notice.title} - تجمع بني هاشم: ${notice.content}`);
    setCopiedId(notice.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-l from-[#064e3b] via-[#0b6e54] to-[#0d9488] text-white p-6 sm:p-10 rounded-3xl shadow-xl border-b-4 border-[#d4af37] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-black/20 backdrop-blur-md text-[#d4af37] text-xs font-bold px-3.5 py-1 rounded-full border border-[#d4af37]/40 shadow-inner">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ديوان العائلة المفتوح للتهاني والتبريكات والمواساة</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold font-heritage text-white">
            ديوان بني هاشم
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            منصة تواصل ومشاركة وجدانية لجميع أفراد وبيوت بني هاشم في شتى بقاع الأرض؛ لنبارك للمتزوجين، ونهنئ المتفوقين، ونستبشر بالمواليد، ونواسي أهلنا في أحزانهم بالدعاء الصادق.
          </p>
        </div>

        <button
          id="diwan-add-notice-btn"
          onClick={onOpenAddNoticeModal}
          className="bg-[#d4af37] hover:brightness-110 text-[#064e3b] font-bold text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-lg transition-all duration-200 flex items-center gap-2 shrink-0 cursor-pointer hover:scale-[1.02]"
        >
          <PlusCircle className="w-5 h-5 text-[#064e3b]" />
          <span>نشر مناسبة أو تهنئة جديدة</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#064e3b] text-white shadow-sm'
                    : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative min-w-[260px]">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث باسم الشخص، الفرع، أو المدينة..."
            className="w-full bg-[#fafaf7] text-xs sm:text-sm text-slate-900 placeholder-slate-400 rounded-xl pl-3 pr-9 py-2.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#064e3b]"
          />
          <Search className="w-4 h-4 text-[#064e3b] absolute right-3 top-3" />
        </div>
      </div>

      {/* Notices Feed */}
      <div className="space-y-5">
        {filteredNotices.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
            <Sparkles className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">لا توجد منشورات مطابقة للبحث</h3>
            <p className="text-xs text-slate-500">جرب تغيير معايير البحث أو تصفح جميع التصنيفات</p>
          </div>
        ) : (
          filteredNotices.map((notice) => {
            const isCommentOpen = activeCommentNoticeId === notice.id;
            const currentComment = commentInputs[notice.id] || { author: '', text: '' };

            return (
              <article
                key={notice.id}
                className="bg-white border border-slate-200/90 hover:border-[#064e3b]/50 rounded-3xl p-5 sm:p-7 shadow-sm transition-all space-y-4"
              >
                {/* Notice Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      notice.category === 'أفراح وزواج' ? 'bg-emerald-50 text-[#064e3b] border border-emerald-200' :
                      notice.category === 'تخرج وتفوق' ? 'bg-blue-50 text-blue-800 border border-blue-200' :
                      notice.category === 'مولود جديد' ? 'bg-amber-50 text-amber-900 border border-amber-200' :
                      notice.category === 'تعزية ومواساة' ? 'bg-slate-100 text-slate-800 border border-slate-300' :
                      'bg-purple-50 text-purple-800 border border-purple-200'
                    }`}>
                      {notice.category}
                    </span>

                    <span className="text-xs text-slate-400">{notice.date}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#064e3b] bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                      {notice.familyBranch}
                    </span>
                    <button
                      onClick={() => handleShare(notice)}
                      className="p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                      title="نسخ ومشاركة"
                    >
                      {copiedId === notice.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Title & Body */}
                <div className="space-y-2">
                  <h2 className="text-lg sm:text-xl font-bold font-heritage text-[#064e3b] leading-snug">
                    {notice.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-[#fcfbf7] p-4 rounded-2xl border border-slate-200/80">
                    {notice.content}
                  </p>
                </div>

                {/* Location & Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1 text-slate-600 font-medium">
                    <MapPin className="w-4 h-4 text-[#064e3b]" /> {notice.city}
                  </span>

                  <div className="flex items-center gap-3">
                    {/* Bless / Pray Button */}
                    <button
                      onClick={() => onBlessNotice(notice.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                        notice.userBlessed
                          ? 'bg-rose-50 text-rose-600 border border-rose-200'
                          : 'bg-[#064e3b] hover:bg-[#0b6e54] text-white'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${notice.userBlessed ? 'fill-rose-500 text-rose-500' : 'text-[#d4af37]'}`} />
                      <span>{notice.userBlessed ? 'باركت ودعوت له' : 'تقديم تبريك ودعاء'}</span>
                      <span className="bg-black/15 px-2 py-0.5 rounded text-[11px]">
                        {notice.blessingsCount}
                      </span>
                    </button>

                    {/* Toggle Comment Button */}
                    <button
                      onClick={() => setActiveCommentNoticeId(isCommentOpen ? null : notice.id)}
                      className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 text-slate-500" />
                      <span>تبريكات وكلمات ({notice.comments?.length || 0})</span>
                    </button>
                  </div>
                </div>

                {/* Comments Section */}
                {isCommentOpen && (
                  <div className="pt-4 border-t border-slate-100 space-y-3 bg-[#fcfbf7] p-5 rounded-2xl mt-3 animate-fadeIn border border-[#d4af37]/20">
                    <h4 className="text-xs font-bold text-[#064e3b]">
                      دعوات وكلمات الأهل والأقارب:
                    </h4>

                    {/* Comments list */}
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {notice.comments && notice.comments.length > 0 ? (
                        notice.comments.map((comment) => (
                          <div key={comment.id} className="bg-white p-3 rounded-xl border border-slate-200 space-y-1 text-xs">
                            <div className="flex items-center justify-between text-slate-500 text-[11px]">
                              <span className="font-bold text-[#064e3b]">{comment.author}</span>
                              <span>{comment.date}</span>
                            </div>
                            <p className="text-slate-700">{comment.text}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 italic">كن أول من يكتب دعاءً أو كلمة تبريك مباركة.</p>
                      )}
                    </div>

                    {/* Add Comment Input Form */}
                    <div className="space-y-2 pt-2 border-t border-[#d4af37]/30">
                      <input
                        type="text"
                        placeholder="اسمك الكريم / صلتك (اختياري)..."
                        value={currentComment.author}
                        onChange={(e) => setCommentInputs({
                          ...commentInputs,
                          [notice.id]: { ...currentComment, author: e.target.value }
                        })}
                        className="w-full bg-white text-xs text-slate-900 placeholder-slate-400 rounded-xl p-2.5 border border-slate-300 focus:ring-2 focus:ring-[#064e3b]"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="اكتب تهنئتك أو دعاءك الطيب هنا..."
                          value={currentComment.text}
                          onChange={(e) => setCommentInputs({
                            ...commentInputs,
                            [notice.id]: { ...currentComment, text: e.target.value }
                          })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSendComment(notice.id);
                            }
                          }}
                          className="flex-1 bg-white text-xs text-slate-900 placeholder-slate-400 rounded-xl p-2.5 border border-slate-300 focus:ring-2 focus:ring-[#064e3b]"
                        />
                        <button
                          onClick={() => handleSendComment(notice.id)}
                          className="bg-[#064e3b] hover:bg-[#0b6e54] text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer shadow-xs"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>إرسال</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>

    </div>
  );
};

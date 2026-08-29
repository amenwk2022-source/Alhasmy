import React, { useState } from 'react';
import { 
  ForumTopic, 
  ForumReply, 
  ForumCategoryType, 
  ForumNotification, 
  UserProfile 
} from '../types';
import { 
  MessageSquare, 
  Pin, 
  Lock, 
  Unlock, 
  ShieldAlert, 
  ShieldCheck, 
  Heart, 
  Send, 
  Plus, 
  Search, 
  Filter, 
  Bell, 
  Eye, 
  Share2, 
  Tag, 
  ChevronRight, 
  User, 
  Sparkles, 
  Trash2, 
  Check, 
  BookOpen, 
  Users, 
  Rocket, 
  HelpCircle, 
  Feather,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface ForumViewProps {
  topics: ForumTopic[];
  notifications: ForumNotification[];
  currentUser: UserProfile;
  onAddTopic: (topic: ForumTopic) => void;
  onAddReply: (topicId: string, reply: ForumReply) => void;
  onToggleLikeTopic: (topicId: string) => void;
  onToggleLikeReply: (topicId: string, replyId: string) => void;
  onTogglePinTopic: (topicId: string) => void;
  onToggleLockTopic: (topicId: string) => void;
  onDeleteTopic: (topicId: string) => void;
  onMarkNotificationsRead: () => void;
}

export const ForumView: React.FC<ForumViewProps> = ({
  topics,
  notifications,
  currentUser,
  onAddTopic,
  onAddReply,
  onToggleLikeTopic,
  onToggleLikeReply,
  onTogglePinTopic,
  onToggleLockTopic,
  onDeleteTopic,
  onMarkNotificationsRead
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  
  // Create Topic Modal
  const [isCreateTopicModalOpen, setIsCreateTopicModalOpen] = useState(false);
  const [topicTitle, setTopicTitle] = useState('');
  const [topicCat, setTopicCat] = useState<ForumCategoryType>('التاريخ والتوثيق العائلي');
  const [topicContent, setTopicContent] = useState('');
  const [topicTagsInput, setTopicTagsInput] = useState('');

  // Reply Input
  const [replyContent, setReplyContent] = useState('');

  // Notifications Popover
  const [showNotifications, setShowNotifications] = useState(false);
  const [copiedTopicId, setCopiedTopicId] = useState<string | null>(null);

  const categories: { name: ForumCategoryType | 'الكل'; icon: React.ReactNode; desc: string }[] = [
    { name: 'الكل', icon: <Sparkles className="w-4 h-4" />, desc: 'جميع النقاشات والمواضيع' },
    { name: 'التاريخ والتوثيق العائلي', icon: <BookOpen className="w-4 h-4 text-[#d4af37]" />, desc: 'أبحاث الأنساب والمخطوطات والروايات التاريخية' },
    { name: 'الأنشطة الاجتماعية والتكافل', icon: <Users className="w-4 h-4 text-emerald-600" />, desc: 'مبادرات صلة الرحم والوقف وصناديق الدعم' },
    { name: 'المبادرات الشبابية وريادة الأعمال', icon: <Rocket className="w-4 h-4 text-blue-600" />, desc: 'المشاريع الناشئة والابتكار والتدريب المهني' },
    { name: 'استشارات وتوجيه', icon: <HelpCircle className="w-4 h-4 text-amber-600" />, desc: 'استشارات شرعية، قانونية، وأكاديمية متخصصة' },
    { name: 'ملتقى الأدب والتراث والشعر', icon: <Feather className="w-4 h-4 text-purple-600" />, desc: 'المساجلات الشعرية والنصوص الأدبية التراثية' },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredTopics = topics.filter((top) => {
    const matchesCategory = selectedCategory === 'الكل' || top.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      top.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      top.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      top.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      top.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Sort pinned first
  const sortedTopics = [...filteredTopics].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  const activeTopic = topics.find(t => t.id === selectedTopicId) || null;

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicTitle.trim() || !topicContent.trim()) return;

    const tags = topicTagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const newTopic: ForumTopic = {
      id: 'top-' + Date.now(),
      title: topicTitle,
      category: topicCat,
      authorId: currentUser.id,
      authorName: currentUser.fullName,
      authorTitle: currentUser.kunyaOrTitle || currentUser.occupation,
      authorBranch: currentUser.branch,
      authorAvatar: currentUser.avatarUrl,
      authorVerified: currentUser.isVerifiedLineage,
      content: topicContent,
      tags: tags.length > 0 ? tags : ['بني هاشم', 'نقاش عائلي'],
      createdAt: 'الآن',
      viewsCount: 1,
      likesCount: 1,
      userLiked: true,
      repliesCount: 0,
      isPinned: false,
      isLocked: false,
      isOfficial: false,
      lastActivity: 'الآن',
      replies: []
    };

    onAddTopic(newTopic);
    setIsCreateTopicModalOpen(false);
    setTopicTitle('');
    setTopicContent('');
    setTopicTagsInput('');
    setSelectedTopicId(newTopic.id);
  };

  const handleAddReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTopic || !replyContent.trim()) return;

    const newReply: ForumReply = {
      id: 'rep-' + Date.now(),
      topicId: activeTopic.id,
      authorId: currentUser.id,
      authorName: currentUser.fullName,
      authorTitle: currentUser.kunyaOrTitle || currentUser.occupation,
      authorBranch: currentUser.branch,
      authorAvatar: currentUser.avatarUrl,
      authorVerified: currentUser.isVerifiedLineage,
      content: replyContent,
      createdAt: 'الآن',
      likes: 0,
      userLiked: false,
      isModeratorReply: currentUser.isVerifiedLineage
    };

    onAddReply(activeTopic.id, newReply);
    setReplyContent('');
  };

  const handleShareTopic = (topicId: string, title: string) => {
    navigator.clipboard?.writeText(`${window.location.origin}#topic-${topicId}`);
    setCopiedTopicId(topicId);
    setTimeout(() => setCopiedTopicId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Forum Header Banner */}
      <div className="bg-gradient-to-l from-[#064e3b] via-[#0b6e54] to-[#043e2f] text-white rounded-3xl p-6 sm:p-10 shadow-xl border-4 border-[#d4af37]/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#d4af37] text-[#064e3b] text-xs font-black px-3.5 py-1 rounded-full shadow-sm">
              <MessageSquare className="w-3.5 h-3.5" />
              ديوان الحوار والنقاش الهاشمي
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold font-heritage tracking-wide text-white">
              منتدى الحوار وتبادل الأفكار
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed font-light">
              مساحة تفاعلية لتعزيز أواصر القربى، مناقشة المخطوطات والتوثيق، إطلاق المبادرات المجتمعية، والمساجلات الأدبية وفق قيم الاحترام والتكامل.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications && unreadCount > 0) {
                    onMarkNotificationsRead();
                  }
                }}
                className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-2xl relative border border-white/20 transition-all cursor-pointer"
                title="التنبيهات"
              >
                <Bell className="w-5 h-5 text-[#d4af37]" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#064e3b]">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Popover */}
              {showNotifications && (
                <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-80 sm:w-96 bg-white text-slate-800 rounded-3xl shadow-2xl border-2 border-[#d4af37] p-4 z-50 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                    <h4 className="text-sm font-bold font-heritage text-[#064e3b] flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-[#d4af37]" />
                      تنبيهات المنتدى
                    </h4>
                    <span className="text-[11px] text-slate-400">آخر المستجدات</span>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-4">لا توجد تنبيهات جديدة</p>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            if (notif.topicId) {
                              setSelectedTopicId(notif.topicId);
                              setShowNotifications(false);
                            }
                          }}
                          className={`p-2.5 rounded-xl text-xs space-y-1 transition-colors cursor-pointer ${
                            notif.read ? 'bg-[#fafaf7] hover:bg-slate-100' : 'bg-emerald-50 border border-emerald-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#064e3b]">{notif.title}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{notif.time}</span>
                          </div>
                          <p className="text-slate-600 text-[11px] line-clamp-2">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsCreateTopicModalOpen(true)}
              className="bg-[#d4af37] hover:brightness-110 text-[#064e3b] px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <span>موضوع جديد</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Forum Content: Split view or Topic Detail */}
      {selectedTopicId && activeTopic ? (
        /* TOPIC DETAIL & DISCUSSION THREAD VIEW */
        <div className="space-y-6 animate-fadeIn">
          {/* Back button */}
          <button
            onClick={() => setSelectedTopicId(null)}
            className="text-xs sm:text-sm text-[#064e3b] hover:text-[#0b6e54] font-bold flex items-center gap-1.5 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
            <span>العودة لقائمة موضوعات المنتدى</span>
          </button>

          {/* Topic Main Post */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 overflow-hidden shrink-0">
                  {activeTopic.authorAvatar ? (
                    <img 
                      src={activeTopic.authorAvatar} 
                      alt={activeTopic.authorName} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#064e3b] font-bold font-heritage">
                      {activeTopic.authorName.charAt(0)}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                      {activeTopic.authorName}
                    </h4>
                    {activeTopic.authorVerified && (
                      <span title="نسب موثق"><ShieldCheck className="w-4 h-4 text-[#064e3b]" /></span>
                    )}
                    {activeTopic.isOfficial && (
                      <span className="bg-[#d4af37]/20 text-[#064e3b] border border-[#d4af37]/50 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        موضوع معتمد
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#d4af37] font-semibold">
                    {activeTopic.authorTitle} • {activeTopic.authorBranch}
                  </p>
                </div>
              </div>

              {/* Status badges & Admin actions */}
              <div className="flex items-center gap-2">
                <span className="bg-[#fafaf7] border border-slate-200 text-slate-700 text-xs px-3 py-1 rounded-full font-bold">
                  {activeTopic.category}
                </span>

                {/* Moderation toggles */}
                <button
                  onClick={() => onTogglePinTopic(activeTopic.id)}
                  title={activeTopic.isPinned ? 'إلغاء التثبيت' : 'تثبيت في الأعلى'}
                  className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    activeTopic.isPinned ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-slate-50 text-slate-500 border-slate-200'
                  }`}
                >
                  <Pin className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onToggleLockTopic(activeTopic.id)}
                  title={activeTopic.isLocked ? 'فتح الردود' : 'إغلاق الردود'}
                  className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    activeTopic.isLocked ? 'bg-red-100 text-red-800 border-red-300' : 'bg-slate-50 text-slate-500 border-slate-200'
                  }`}
                >
                  {activeTopic.isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Topic Content */}
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold font-heritage text-[#064e3b] leading-relaxed">
                {activeTopic.title}
              </h2>

              <p className="text-slate-800 text-sm sm:text-base leading-loose whitespace-pre-line bg-[#fafaf7] p-5 rounded-2xl border border-slate-200/60">
                {activeTopic.content}
              </p>

              {/* Tags */}
              {activeTopic.tags && activeTopic.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {activeTopic.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-emerald-50 text-[#064e3b] border border-emerald-200 text-xs px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1"
                    >
                      <Tag className="w-3 h-3 text-[#d4af37]" />
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Topic Footer & Metrics */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {activeTopic.createdAt}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  {activeTopic.viewsCount} مشاهدة
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                  {activeTopic.replies.length} ردود
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleLikeTopic(activeTopic.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold border transition-all cursor-pointer ${
                    activeTopic.userLiked
                      ? 'bg-red-50 text-red-600 border-red-200'
                      : 'bg-[#fafaf7] text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${activeTopic.userLiked ? 'fill-red-500' : ''}`} />
                  <span>تأييد وإعجاب ({activeTopic.likesCount})</span>
                </button>

                <button
                  onClick={() => handleShareTopic(activeTopic.id, activeTopic.title)}
                  className="bg-[#fafaf7] text-slate-700 border border-slate-200 hover:bg-slate-100 px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-[#d4af37]" />
                  <span>{copiedTopicId === activeTopic.id ? 'تم النسخ' : 'مشاركة'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* REPLIES SECTION */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-heritage text-[#064e3b] flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#d4af37]" />
                الردود والمشاركات ({activeTopic.replies.length})
              </h3>
            </div>

            {activeTopic.replies.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-2 text-slate-500 text-xs">
                <p className="font-bold text-slate-700">لا توجد ردود على هذا الموضوع بعد.</p>
                <p>كن أول من يشارك برأيه ومداخلته الكريمة.</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {activeTopic.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all ${
                      reply.isModeratorReply
                        ? 'border-emerald-300 bg-emerald-50/20 shadow-xs'
                        : 'border-slate-200/80 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 overflow-hidden shrink-0">
                          {reply.authorAvatar ? (
                            <img 
                              src={reply.authorAvatar} 
                              alt={reply.authorName} 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#064e3b] font-bold">
                              {reply.authorName.charAt(0)}
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 text-xs sm:text-sm">
                              {reply.authorName}
                            </span>
                            {reply.authorVerified && <ShieldCheck className="w-3.5 h-3.5 text-[#064e3b]" />}
                            {reply.isModeratorReply && (
                              <span className="bg-emerald-100 text-[#064e3b] text-[9px] font-black px-2 py-0.5 rounded-full">
                                رد رسمي
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400">
                            {reply.authorBranch} • {reply.createdAt}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => onToggleLikeReply(activeTopic.id, reply.id)}
                        className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                          reply.userLiked
                            ? 'bg-red-50 text-red-600 border-red-200 font-bold'
                            : 'bg-[#fafaf7] text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${reply.userLiked ? 'fill-red-500' : ''}`} />
                        <span>{reply.likes}</span>
                      </button>
                    </div>

                    <p className="text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line pr-13">
                      {reply.content}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Add Reply Form */}
            {activeTopic.isLocked ? (
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-center text-xs text-amber-900 font-bold flex items-center justify-center gap-2">
                <Lock className="w-4 h-4" />
                <span>تم إغلاق الردود على هذا الموضوع من قبل المشرفين</span>
              </div>
            ) : (
              <form 
                onSubmit={handleAddReplySubmit}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-md space-y-3"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-[#064e3b]">
                  <MessageSquare className="w-4 h-4 text-[#d4af37]" />
                  <span>إضافة رد أو تعقيب باسم: <strong>{currentUser.fullName}</strong></span>
                </div>

                <textarea
                  rows={3}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="اكتب ردك أو مداخلتك هنا بأدب وتوثيق..."
                  className="w-full bg-[#fafaf7] border border-slate-300 rounded-2xl p-3.5 text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b] transition-all"
                  required
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">
                    تخضع كافة الردود لضوابط الحوار والتكافل المعتمدة
                  </span>
                  <button
                    type="submit"
                    className="bg-[#064e3b] hover:bg-[#0b6e54] text-white px-5 py-2 rounded-xl text-xs font-bold shadow transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 rotate-180 text-[#d4af37]" />
                    <span>إرسال الرد</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : (
        /* FORUM DIRECTORY & TOPIC LIST */
        <div className="space-y-6">
          {/* Categories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`p-3.5 rounded-2xl border text-right transition-all flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-[#064e3b] text-white border-[#064e3b] shadow-md ring-2 ring-[#d4af37]/40'
                      : 'bg-white text-slate-700 border-slate-200/80 hover:border-[#064e3b]/40 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-xl ${isSelected ? 'bg-white/15' : 'bg-slate-100'}`}>
                      {cat.icon}
                    </div>
                  </div>
                  <h4 className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                    {cat.name}
                  </h4>
                </button>
              );
            })}
          </div>

          {/* Search and stats bar */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث بالعنوان، الكاتب، الكلمات المفتاحية، المخطوطات..."
                className="w-full bg-[#fafaf7] border border-slate-300 rounded-2xl pl-4 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b] transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
            </div>

            <div className="flex items-center gap-3 shrink-0 text-xs text-slate-500">
              <span>المواضيع المتاحة: <strong className="text-[#064e3b]">{sortedTopics.length}</strong></span>
              <span>•</span>
              <span className="text-[#d4af37] font-semibold">قسم: {selectedCategory}</span>
            </div>
          </div>

          {/* Topics List */}
          <div className="space-y-4">
            {sortedTopics.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-3">
                <MessageSquare className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="text-base font-bold text-slate-700">لا توجد مواضيع مطابقة للبحث</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  جرّب تعديل كلمات البحث أو اختر قسماً آخر، أو ابدأ بنشر موضوع نقاش جديد.
                </p>
                <button
                  onClick={() => setIsCreateTopicModalOpen(true)}
                  className="bg-[#064e3b] text-[#d4af37] px-4 py-2 rounded-xl text-xs font-bold shadow cursor-pointer"
                >
                  إنشاء موضوع جديد
                </button>
              </div>
            ) : (
              sortedTopics.map((topic) => (
                <div
                  key={topic.id}
                  onClick={() => setSelectedTopicId(topic.id)}
                  className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all duration-200 hover:shadow-md cursor-pointer relative group ${
                    topic.isPinned
                      ? 'border-2 border-[#d4af37]/60 bg-gradient-to-r from-white via-white to-amber-50/30'
                      : 'border-slate-200/80 hover:border-[#064e3b]/40'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-[#fcfbf7] text-[#064e3b] border border-[#d4af37]/40 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                        {topic.category}
                      </span>
                      {topic.isPinned && (
                        <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Pin className="w-3 h-3 text-amber-600" />
                          مثبت في الأعلى
                        </span>
                      )}
                      {topic.isOfficial && (
                        <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-700" />
                          رسمي من الأعيان
                        </span>
                      )}
                      {topic.isLocked && (
                        <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          مغلق
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] text-slate-400 font-mono">
                      آخر نشاط: {topic.lastActivity || topic.createdAt}
                    </span>
                  </div>

                  {/* Title & Preview */}
                  <div className="space-y-1.5">
                    <h3 className="text-base sm:text-lg font-bold font-heritage text-[#064e3b] group-hover:text-[#0b6e54] transition-colors leading-snug">
                      {topic.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {topic.content}
                    </p>
                  </div>

                  {/* Topic Metadata & Stats Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3.5 mt-3.5 border-t border-slate-100 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 overflow-hidden">
                        {topic.authorAvatar ? (
                          <img src={topic.authorAvatar} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-emerald-800">
                            {topic.authorName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <span className="font-semibold text-slate-800 text-[11px]">
                        {topic.authorName}
                      </span>
                      <span className="text-slate-400 text-[10px]">({topic.authorBranch})</span>
                    </div>

                    <div className="flex items-center gap-4 text-[11px]">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-red-500" />
                        {topic.likesCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-[#064e3b]" />
                        {topic.replies.length} رد
                      </span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Eye className="w-3.5 h-3.5" />
                        {topic.viewsCount}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* CREATE NEW TOPIC MODAL */}
      {isCreateTopicModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto border-2 border-[#d4af37] shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xl font-bold font-heritage text-[#064e3b] flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#d4af37]" />
                إنشاء موضوع نقاش جديد
              </h3>
              <button
                onClick={() => setIsCreateTopicModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTopic} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">عنوان الموضوع:</label>
                <input
                  type="text"
                  value={topicTitle}
                  onChange={(e) => setTopicTitle(e.target.value)}
                  placeholder="اختر عنواناً واضحاً يعبر عن فكرة النقاش..."
                  className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">القسم / التصنيف:</label>
                <select
                  value={topicCat}
                  onChange={(e) => setTopicCat(e.target.value as any)}
                  className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                >
                  <option value="التاريخ والتوثيق العائلي">التاريخ والتوثيق العائلي</option>
                  <option value="الأنشطة الاجتماعية والتكافل">الأنشطة الاجتماعية والتكافل</option>
                  <option value="المبادرات الشبابية وريادة الأعمال">المبادرات الشبابية وريادة الأعمال</option>
                  <option value="استشارات وتوجيه">استشارات وتوجيه</option>
                  <option value="ملتقى الأدب والتراث والشعر">ملتقى الأدب والتراث والشعر</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">نص الموضوع والمداخلة:</label>
                <textarea
                  rows={5}
                  value={topicContent}
                  onChange={(e) => setTopicContent(e.target.value)}
                  placeholder="اكتب تفاصيل الفكرة، المراجع، أو الأسئلة التي ترغب في طرحها على أعضاء التجمع..."
                  className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">الكلمات المفتاحية (مفصولة بفواصل):</label>
                <input
                  type="text"
                  value={topicTagsInput}
                  onChange={(e) => setTopicTagsInput(e.target.value)}
                  placeholder="أنساب, أوقاف, مكة, وثائق..."
                  className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                />
              </div>

              <div className="p-3 bg-[#fafaf7] rounded-xl border border-slate-200 text-[11px] text-slate-600">
                النشر باسم: <strong className="text-[#064e3b]">{currentUser.fullName}</strong> ({currentUser.branch})
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateTopicModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-[#064e3b] hover:bg-[#0b6e54] text-white px-6 py-2.5 rounded-xl font-bold shadow transition-all cursor-pointer"
                >
                  نشر الموضوع في المنتدى
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

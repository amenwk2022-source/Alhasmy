import React, { useState } from 'react';
import { NewsItem, EventItem } from '../types';
import { copyTextToClipboard } from '../utils/clipboard';
import { 
  Newspaper, 
  Calendar, 
  MapPin, 
  Clock, 
  User, 
  Heart, 
  Share2, 
  CheckCircle2, 
  PlusCircle, 
  Filter, 
  Search, 
  CalendarPlus, 
  Sparkles, 
  ChevronRight, 
  Users, 
  Tag, 
  MessageSquare, 
  ExternalLink,
  Flame,
  Building,
  Check,
  X
} from 'lucide-react';

interface NewsAndEventsViewProps {
  news: NewsItem[];
  events: EventItem[];
  onAddNewsItem: (item: NewsItem) => void;
  onAddEventItem: (event: EventItem) => void;
  onToggleEventRSVP: (eventId: string) => void;
  onLikeNews: (newsId: string) => void;
}

export const NewsAndEventsView: React.FC<NewsAndEventsViewProps> = ({
  news,
  events,
  onAddNewsItem,
  onAddEventItem,
  onToggleEventRSVP,
  onLikeNews
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'news' | 'events'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected Article for Full Read Modal
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);

  // Selected Event for Details Modal
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  // New Article / Event Submission Modal
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [publishType, setPublishType] = useState<'news' | 'event'>('news');

  // Form states
  const [newsTitle, setNewsTitle] = useState('');
  const [newsCategory, setNewsCategory] = useState<NewsItem['category']>('أخبار التجمع');
  const [newsSummary, setNewsSummary] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsAuthor, setNewsAuthor] = useState('أمانة الإعلام والاتصال');

  const [eventTitle, setEventTitle] = useState('');
  const [eventCategory, setEventCategory] = useState<EventItem['category']>('لقاء عائلي عام');
  const [eventDateGregorian, setEventDateGregorian] = useState('');
  const [eventDateHijri, setEventDateHijri] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventCity, setEventCity] = useState('مكة المكرمة');
  const [eventLocationName, setEventLocationName] = useState('');
  const [eventAddress, setEventAddress] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventOrganizer, setEventOrganizer] = useState('لجنة الفعاليات المركزية');
  const [eventMaxAttendees, setEventMaxAttendees] = useState(300);

  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Categories list for filtering
  const newsCategories = ['الكل', 'أخبار التجمع', 'قرارات المجلس', 'إنجازات وتكريم', 'ملتقيات وفعاليات', 'مبادرات مجتمعية'];

  const filteredNews = news.filter((item) => {
    const matchesCategory = selectedCategory === 'الكل' || item.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredEvents = events.filter((ev) => {
    const matchesSearch = searchQuery === '' || 
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      ev.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleShare = async (id: string, title: string) => {
    await copyTextToClipboard(`${window.location.origin} - ${title}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadCalendar = (ev: EventItem) => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//تجمع بني هاشم//الفعاليات الرسمية//AR
BEGIN:VEVENT
SUMMARY:${ev.title}
DESCRIPTION:${ev.description}
LOCATION:${ev.locationName}, ${ev.city} - ${ev.addressDetails}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `event-${ev.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (publishType === 'news') {
      if (!newsTitle.trim() || !newsContent.trim()) return;
      const newItem: NewsItem = {
        id: 'news-' + Date.now(),
        title: newsTitle,
        category: newsCategory,
        date: 'الآن (شعبان 1447 هـ)',
        summary: newsSummary || newsContent.slice(0, 120) + '...',
        content: newsContent,
        author: newsAuthor || 'أمانة الإعلام والاتصال',
        readTime: '3 دقائق',
        likes: 1,
        isPinned: false
      };
      onAddNewsItem(newItem);
    } else {
      if (!eventTitle.trim() || !eventLocationName.trim()) return;
      const newEv: EventItem = {
        id: 'ev-' + Date.now(),
        title: eventTitle,
        category: eventCategory,
        dateGregorian: eventDateGregorian || 'قريباً 2026',
        dateHijri: eventDateHijri || 'شوال 1447 هـ',
        time: eventTime || '07:00 مساءً',
        city: eventCity,
        locationName: eventLocationName,
        addressDetails: eventAddress,
        description: eventDesc,
        organizer: eventOrganizer,
        organizerRole: 'إشراف الأمانة العامة',
        maxAttendees: Number(eventMaxAttendees) || 250,
        confirmedAttendeesCount: 1,
        isUserAttending: true,
        status: 'قادمة ومتاحة للتسجيل'
      };
      onAddEventItem(newEv);
    }

    setIsPublishModalOpen(false);
    // Reset forms
    setNewsTitle('');
    setNewsSummary('');
    setNewsContent('');
    setEventTitle('');
    setEventLocationName('');
    setEventAddress('');
    setEventDesc('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-l from-[#064e3b] via-[#0b6e54] to-[#043e2f] text-white rounded-3xl p-6 sm:p-10 shadow-xl border-4 border-[#d4af37]/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#d4af37] text-[#064e3b] text-xs font-black px-3.5 py-1 rounded-full shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              المركز الإعلامي والفعاليات
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold font-heritage tracking-wide text-white">
              الأخبار والفعاليات ومناسبات التجمع
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed font-light">
              مواكبة شاملة لكافة أنشطة بيوت بني هاشم، القرارات الرسمية للمجلس، وإعلانات الملتقيات والفعاليات الاجتماعية والثقافية مع خدمة تأكيد الحضور المباشر.
            </p>
          </div>

          <button
            onClick={() => setIsPublishModalOpen(true)}
            className="bg-[#d4af37] hover:brightness-110 text-[#064e3b] px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm shadow-lg transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-5 h-5" />
            <span>نشر خبر أو تنظيم فعالية</span>
          </button>
        </div>
      </div>

      {/* Filter and Tab Controls */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Main SubTabs: All vs News vs Events */}
          <div className="flex items-center bg-[#fafaf7] p-1.5 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveSubTab('all')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeSubTab === 'all'
                  ? 'bg-[#064e3b] text-[#d4af37] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              الكل ({news.length + events.length})
            </button>
            <button
              onClick={() => setActiveSubTab('news')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeSubTab === 'news'
                  ? 'bg-[#064e3b] text-[#d4af37] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Newspaper className="w-4 h-4" />
              <span>الأخبار والمقالات ({news.length})</span>
            </button>
            <button
              onClick={() => setActiveSubTab('events')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeSubTab === 'events'
                  ? 'bg-[#064e3b] text-[#d4af37] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>جدول الفعاليات ({events.length})</span>
            </button>
          </div>

          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في الأخبار والفعاليات، المدن، التواريخ..."
              className="w-full bg-[#fafaf7] border border-slate-300 rounded-2xl pl-4 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b] focus:border-transparent transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
          </div>
        </div>

        {/* Category filters (active when not only events) */}
        {activeSubTab !== 'events' && (
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 pb-1">
            <span className="text-xs text-slate-400 font-bold shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              التصنيف:
            </span>
            {newsCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#064e3b] text-[#d4af37] shadow-xs'
                    : 'bg-[#fafaf7] text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* UPCOMING EVENTS SECTION (shown if tab is 'all' or 'events') */}
      {(activeSubTab === 'all' || activeSubTab === 'events') && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-emerald-50 text-[#064e3b] rounded-2xl flex items-center justify-center border border-[#064e3b]/20">
                <Calendar className="w-5 h-5 text-[#d4af37]" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-heritage text-[#064e3b]">
                  جدول الفعاليات والملتقيات القادمة
                </h2>
                <p className="text-xs text-slate-500">
                  سجل حضورك مسبقاً لحفظ مقعدك وتلقي التنبيهات بالموعد والموقع
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-[#064e3b] bg-emerald-50 px-3 py-1 rounded-full">
              {filteredEvents.length} فعالية معتمدة
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredEvents.map((ev) => (
              <div
                key={ev.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-md hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between"
              >
                {/* Event Top Banner Image / Category */}
                <div className="relative h-48 sm:h-52 bg-slate-900 overflow-hidden">
                  {ev.image && (
                    <img 
                      src={ev.image} 
                      alt={ev.title} 
                      className="w-full h-full object-cover opacity-75 hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <span className="bg-[#064e3b]/90 backdrop-blur-md text-[#d4af37] text-xs font-bold px-3 py-1 rounded-full border border-[#d4af37]/40 shadow-sm">
                      {ev.category}
                    </span>
                    <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      {ev.city}
                    </span>
                  </div>

                  <div className="absolute bottom-4 right-4 left-4 text-white space-y-1">
                    <div className="flex items-center gap-2 text-xs text-[#d4af37] font-semibold">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{ev.dateHijri} ({ev.dateGregorian})</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold font-heritage leading-tight text-white">
                      {ev.title}
                    </h3>
                  </div>
                </div>

                {/* Event Body */}
                <div className="p-5 sm:p-6 space-y-4 flex-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-600 bg-[#fafaf7] p-3.5 rounded-2xl border border-slate-200/70">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#064e3b]" />
                      <span>{ev.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-[#064e3b]" />
                      <span className="truncate">{ev.locationName}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:col-span-2">
                      <MapPin className="w-4 h-4 text-[#d4af37]" />
                      <span className="text-slate-700">{ev.addressDetails}</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed line-clamp-3">
                    {ev.description}
                  </p>

                  {/* Attendance & Capacity Meter */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">المقاعد المسجلة:</span>
                      <span className="font-bold text-[#064e3b]">
                        {ev.confirmedAttendeesCount} من {ev.maxAttendees || 300} مقعد
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-l from-[#064e3b] to-[#0b6e54] rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (ev.confirmedAttendeesCount / (ev.maxAttendees || 300)) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Event Action Footer */}
                <div className="p-4 sm:p-5 bg-[#fafaf7] border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedEvent(ev)}
                      className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      تفاصيل وجدول الفعالية
                    </button>
                    <button
                      onClick={() => handleDownloadCalendar(ev)}
                      title="إضافة إلى تقويم هاتفك"
                      className="bg-white hover:bg-slate-50 text-[#064e3b] border border-slate-300 p-2 rounded-xl text-xs transition-all cursor-pointer"
                    >
                      <CalendarPlus className="w-4 h-4 text-[#d4af37]" />
                    </button>
                  </div>

                  <button
                    onClick={() => onToggleEventRSVP(ev.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer ${
                      ev.isUserAttending
                        ? 'bg-emerald-100 hover:bg-emerald-200 text-[#064e3b] border border-[#064e3b]/30'
                        : 'bg-[#064e3b] hover:bg-[#0b6e54] text-white'
                    }`}
                  >
                    {ev.isUserAttending ? (
                      <>
                        <Check className="w-4 h-4 text-[#064e3b]" />
                        <span>تم تأكيد حضورك (إلغاء)</span>
                      </>
                    ) : (
                      <>
                        <PlusCircle className="w-4 h-4 text-[#d4af37]" />
                        <span>تسجيل الحضور</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ARTICLES & NEWS SECTION (shown if tab is 'all' or 'news') */}
      {(activeSubTab === 'all' || activeSubTab === 'news') && (
        <div className="space-y-5 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-emerald-50 text-[#064e3b] rounded-2xl flex items-center justify-center border border-[#064e3b]/20">
                <Newspaper className="w-5 h-5 text-[#d4af37]" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-heritage text-[#064e3b]">
                  المقالات الإخبارية والإعلانات الرسمية
                </h2>
                <p className="text-xs text-slate-500">
                  آخر مستجدات التجمع ومبادرات اللجان والتغطيات الحصرية
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-[#064e3b] bg-emerald-50 px-3 py-1 rounded-full">
              {filteredNews.length} مقال إخباري
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-3xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md ${
                  item.isPinned ? 'border-2 border-[#d4af37]/60 ring-2 ring-[#d4af37]/10' : 'border-slate-200/80'
                }`}
              >
                <div className="p-6 space-y-3.5 flex-1">
                  {/* Category & Date Header */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="bg-[#fcfbf7] text-[#064e3b] border border-[#d4af37]/40 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                      {item.category}
                    </span>
                    {item.isPinned && (
                      <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Flame className="w-3 h-3 text-amber-600" />
                        مثبت
                      </span>
                    )}
                  </div>

                  <h3 
                    onClick={() => setSelectedArticle(item)}
                    className="text-lg font-bold font-heritage text-[#064e3b] hover:text-[#0b6e54] transition-colors cursor-pointer leading-snug"
                  >
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {item.summary}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-[#064e3b]" />
                      {item.author}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {item.date}
                    </span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-6 py-3.5 bg-[#fafaf7] border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedArticle(item)}
                    className="text-xs text-[#064e3b] hover:text-[#0b6e54] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>قراءة الخبر كاملاً</span>
                    <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onLikeNews(item.id)}
                      className={`flex items-center gap-1 text-xs transition-colors cursor-pointer ${
                        item.userLiked ? 'text-red-600 font-bold' : 'text-slate-500 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${item.userLiked ? 'fill-red-500' : ''}`} />
                      <span>{item.likes}</span>
                    </button>
                    <button
                      onClick={() => handleShare(item.id, item.title)}
                      className="text-slate-400 hover:text-slate-700 transition-colors p-1 cursor-pointer"
                      title="مشاركة الخبر"
                    >
                      <Share2 className="w-4 h-4 text-[#d4af37]" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto border-2 border-[#d4af37] shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3 gap-3">
              <div>
                <span className="bg-[#fcfbf7] text-[#d4af37] border border-[#d4af37]/40 text-xs font-bold px-3 py-0.5 rounded-full inline-block mb-2">
                  {selectedArticle.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-heritage text-[#064e3b] leading-snug">
                  {selectedArticle.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500 bg-[#fafaf7] p-3 rounded-2xl border border-slate-200/60">
              <span className="flex items-center gap-1 font-semibold text-[#064e3b]">
                <User className="w-3.5 h-3.5" />
                {selectedArticle.author}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {selectedArticle.date}
              </span>
              <span>•</span>
              <span>وقت القراءة: {selectedArticle.readTime}</span>
            </div>

            <div className="prose prose-sm max-w-none text-slate-800 text-sm sm:text-base leading-relaxed space-y-4">
              <p className="font-semibold text-emerald-950 bg-emerald-50/70 p-4 rounded-2xl border-r-4 border-[#064e3b]">
                {selectedArticle.summary}
              </p>
              <p className="whitespace-pre-line leading-loose text-slate-700">
                {selectedArticle.content}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onLikeNews(selectedArticle.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    selectedArticle.userLiked
                      ? 'bg-red-50 text-red-600 border-red-200'
                      : 'bg-[#fafaf7] text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${selectedArticle.userLiked ? 'fill-red-500' : ''}`} />
                  <span>إعجاب ({selectedArticle.likes})</span>
                </button>
                <button
                  onClick={() => handleShare(selectedArticle.id, selectedArticle.title)}
                  className="bg-[#fafaf7] text-slate-700 border border-slate-200 hover:bg-slate-100 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-[#d4af37]" />
                  <span>مشاركة</span>
                </button>
              </div>

              <button
                onClick={() => setSelectedArticle(null)}
                className="bg-[#064e3b] text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto border-2 border-[#d4af37] shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3 gap-3">
              <div>
                <span className="bg-[#fcfbf7] text-[#d4af37] border border-[#d4af37]/40 text-xs font-bold px-3 py-0.5 rounded-full inline-block mb-1">
                  {selectedEvent.category} • {selectedEvent.city}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-heritage text-[#064e3b]">
                  {selectedEvent.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Event Meta Box */}
            <div className="bg-[#fcfbf7] p-4 rounded-2xl border border-[#d4af37]/30 space-y-2 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#064e3b]" />
                  <span><strong>التاريخ:</strong> {selectedEvent.dateHijri} ({selectedEvent.dateGregorian})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#064e3b]" />
                  <span><strong>التوقيت:</strong> {selectedEvent.time}</span>
                </div>
                <div className="flex items-center gap-2 sm:col-span-2">
                  <MapPin className="w-4 h-4 text-[#d4af37]" />
                  <span><strong>المكان:</strong> {selectedEvent.locationName} - {selectedEvent.addressDetails}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-700">
              <h4 className="font-bold text-[#064e3b]">عن الفعالية وأهدافها:</h4>
              <p className="leading-relaxed whitespace-pre-line">{selectedEvent.description}</p>

              {selectedEvent.agenda && (
                <div className="pt-2 space-y-2">
                  <h4 className="font-bold text-[#064e3b]">برنامج وجدول الفعالية:</h4>
                  <ul className="space-y-1.5 pr-4 list-disc text-xs text-slate-700">
                    {selectedEvent.agenda.map((ag, i) => (
                      <li key={i}>{ag}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => handleDownloadCalendar(selectedEvent)}
                className="bg-white border border-slate-300 text-[#064e3b] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-slate-50 cursor-pointer"
              >
                <CalendarPlus className="w-4 h-4 text-[#d4af37]" />
                <span>إضافة للتقويم</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onToggleEventRSVP(selectedEvent.id);
                  }}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedEvent.isUserAttending
                      ? 'bg-emerald-100 text-[#064e3b] border border-[#064e3b]'
                      : 'bg-[#064e3b] hover:bg-[#0b6e54] text-white shadow'
                  }`}
                >
                  {selectedEvent.isUserAttending ? '✓ تم تأكيد حضورك' : 'تسجيل وتأكيد الحضور الآن'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Publish Article / Event Modal */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto border-2 border-[#d4af37] shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xl font-bold font-heritage text-[#064e3b]">
                نشر مقال إخباري أو اقتراح فعالية
              </h3>
              <button
                onClick={() => setIsPublishModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Type selector */}
            <div className="flex items-center bg-[#fafaf7] p-1.5 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => setPublishType('news')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  publishType === 'news' ? 'bg-[#064e3b] text-[#d4af37] shadow-sm' : 'text-slate-600'
                }`}
              >
                مقال إخباري / إعلان
              </button>
              <button
                type="button"
                onClick={() => setPublishType('event')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  publishType === 'event' ? 'bg-[#064e3b] text-[#d4af37] shadow-sm' : 'text-slate-600'
                }`}
              >
                فعالية أو ملتقى عائلي
              </button>
            </div>

            <form onSubmit={handlePublishSubmit} className="space-y-3.5 text-xs">
              {publishType === 'news' ? (
                <>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">عنوان المقال أو الإعلان:</label>
                    <input
                      type="text"
                      value={newsTitle}
                      onChange={(e) => setNewsTitle(e.target.value)}
                      placeholder="اكتب عنواناً جذاباً ودقيقاً..."
                      className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">التصنيف:</label>
                      <select
                        value={newsCategory}
                        onChange={(e) => setNewsCategory(e.target.value as any)}
                        className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                      >
                        <option value="أخبار التجمع">أخبار التجمع</option>
                        <option value="قرارات المجلس">قرارات المجلس</option>
                        <option value="إنجازات وتكريم">إنجازات وتكريم</option>
                        <option value="ملتقيات وفعاليات">ملتقيات وفعاليات</option>
                        <option value="مبادرات مجتمعية">مبادرات مجتمعية</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">الجهة الناشرة / الكاتب:</label>
                      <input
                        type="text"
                        value={newsAuthor}
                        onChange={(e) => setNewsAuthor(e.target.value)}
                        className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">الملخص الموجز:</label>
                    <input
                      type="text"
                      value={newsSummary}
                      onChange={(e) => setNewsSummary(e.target.value)}
                      placeholder="ملخص يظهر في بطاقة الخبر..."
                      className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">نص المقال الكامل:</label>
                    <textarea
                      rows={4}
                      value={newsContent}
                      onChange={(e) => setNewsContent(e.target.value)}
                      placeholder="اكتب تفاصيل الخبر كاملاً..."
                      className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">عنوان الفعالية أو اللقاء:</label>
                    <input
                      type="text"
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                      placeholder="مثال: الملتقى الهاشمي لصلة الرحم..."
                      className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">التصنيف:</label>
                      <select
                        value={eventCategory}
                        onChange={(e) => setEventCategory(e.target.value as any)}
                        className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                      >
                        <option value="لقاء عائلي عام">لقاء عائلي عام</option>
                        <option value="ملتقى شبابي">ملتقى شبابي</option>
                        <option value="ندوة تاريخية وتراثية">ندوة تاريخية وتراثية</option>
                        <option value="تكريم المتفوقين">تكريم المتفوقين</option>
                        <option value="مجلس ديوان دوري">مجلس ديوان دوري</option>
                        <option value="ورشة عمل وتدريب">ورشة عمل وتدريب</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">المدينة:</label>
                      <input
                        type="text"
                        value={eventCity}
                        onChange={(e) => setEventCity(e.target.value)}
                        placeholder="مكة المكرمة / الرياض..."
                        className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">التاريخ (هجري):</label>
                      <input
                        type="text"
                        value={eventDateHijri}
                        onChange={(e) => setEventDateHijri(e.target.value)}
                        placeholder="25 شوال 1447هـ"
                        className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">التاريخ (ميلادي):</label>
                      <input
                        type="text"
                        value={eventDateGregorian}
                        onChange={(e) => setEventDateGregorian(e.target.value)}
                        placeholder="12 مايو 2026"
                        className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">الوقت:</label>
                      <input
                        type="text"
                        value={eventTime}
                        onChange={(e) => setEventTime(e.target.value)}
                        placeholder="07:00 م"
                        className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">اسم القاعة أو المركز:</label>
                      <input
                        type="text"
                        value={eventLocationName}
                        onChange={(e) => setEventLocationName(e.target.value)}
                        placeholder="قاعة المؤتمرات الكبرى"
                        className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">الحد الأقصى للحضور:</label>
                      <input
                        type="number"
                        value={eventMaxAttendees}
                        onChange={(e) => setEventMaxAttendees(Number(e.target.value))}
                        className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">العنوان بالتفصيل:</label>
                    <input
                      type="text"
                      value={eventAddress}
                      onChange={(e) => setEventAddress(e.target.value)}
                      placeholder="الحي والشارع..."
                      className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">وصف الفعالية والأجندة:</label>
                    <textarea
                      rows={3}
                      value={eventDesc}
                      onChange={(e) => setEventDesc(e.target.value)}
                      placeholder="تفاصيل اللقاء وبرنامج الحفل..."
                      className="w-full bg-[#fafaf7] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#064e3b]"
                    />
                  </div>
                </>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPublishModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-[#064e3b] hover:bg-[#0b6e54] text-white px-6 py-2.5 rounded-xl font-bold shadow transition-all cursor-pointer"
                >
                  نشر واعتماد الآن
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

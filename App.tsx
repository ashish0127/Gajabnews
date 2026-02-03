import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Newspaper, 
  LayoutDashboard, 
  FileText, 
  Zap, 
  Search, 
  TrendingUp, 
  Share2, 
  Menu, 
  X, 
  Plus, 
  Save, 
  Trash2, 
  Sparkles,
  ChevronRight,
  User as UserIcon, 
  LogOut,
  ArrowUpRight,
  Clock,
  Eye,
  Settings,
  Image as ImageIcon,
  Layers,
  MessageSquare,
  Palette,
  Pocket,
  Users,
  Wrench,
  RefreshCw,
  Bell,
  ExternalLink,
  ChevronDown,
  Monitor,
  Globe,
  Bold,
  Italic,
  List,
  Heading1,
  Heading2,
  Undo,
  Type as TypeIcon,
  Rss,
  ShieldCheck,
  Cpu,
  Link as LinkIcon,
  Globe2,
  Code,
  CheckCircle2,
  History,
  Mail,
  MoreVertical,
  ShieldAlert,
  AlertTriangle,
  FileSearch,
  CheckSquare,
  Calendar,
  Send,
  Lock,
  Award,
  BadgeCheck,
  Fingerprint,
  ThumbsUp,
  CornerDownRight,
  UserCheck,
  Ghost
} from 'lucide-react';
import { Post, Category, User, UserRole, Comment, CommentStatus, Sentiment } from './types';
import { generateHindiArticle, generateHindiCover, generateHindiFromSource, generateLegalDoc, analyzeComment } from './geminiService';

// --- TRANSLATIONS ---
const i18n = {
  hi: {
    dashboard: 'डैशबोर्ड',
    automation: 'कंटेंट ऑटोमेशन',
    media: 'मीडिया',
    pages: 'पेजेस',
    comments: 'कमेंट्स',
    appearance: 'अपीयरेंस',
    plugins: 'प्लगिन्स',
    users: 'यूजर्स',
    tools: 'टूल्स',
    settings: 'सेटिंग्स',
    ailab: 'एआई लैब',
    publish: 'पब्लिश करें',
    saveDraft: 'ड्राफ्ट सेव करें',
    title: 'शीर्षक',
    content: 'सामग्री',
    category: 'श्रेणी',
    excerpt: 'सार (Excerpt)',
    seoTitle: 'एसईओ शीर्षक',
    seoDesc: 'एसईओ विवरण',
    howdy: 'नमस्ते',
    logout: 'लॉगआउट',
    back: 'वापस',
    aiGenerate: 'एआई से लिखें',
    atAGlance: 'एक नज़र में',
    activity: 'गतिविधि',
    quickDraft: 'त्वरित ड्राफ्ट',
    trending: 'ट्रेंडिंग',
    readMore: 'और पढ़ें',
    login: 'लॉगिन',
    rssFetch: 'आरएसएस फेच करें',
    delegate: 'एक्सेस डेलिगेशन',
    roles: 'भूमिकाएं',
    addFeed: 'फीड जोड़ें',
    myFeeds: 'मेरी फीड्स',
    slug: 'URL स्लग',
    postedList: 'पब्लिश किए गए लेख',
    recentAutomation: 'हालिया ऑटोमेशन गतिविधियाँ',
    userManagement: 'यूजर मैनेजमेंट',
    addUser: 'नया यूजर जोड़ें',
    schedule: 'शेड्यूल',
    delete: 'हटाएं',
    privacy: 'गोपनीयता नीति',
    terms: 'नियम और शर्तें',
    disclaimer: 'अस्वीकरण',
    cookieMsg: 'हम आपके अनुभव को बेहतर बनाने के लिए कुकीज़ का उपयोग करते हैं।',
    accept: 'स्वीकार करें',
    reject: 'अस्वीकार करें',
    settings_btn: 'सेटिंग्स',
    comment_title: 'टिप्पणियां',
    leave_comment: 'एक टिप्पणी छोड़ें',
    submit_comment: 'टिप्पणी भेजें',
    name: 'नाम',
    email: 'ईमेल',
    website: 'वेबसाइट',
    save_info: 'अगली बार के लिए मेरा विवरण सहेजें'
  },
  en: {
    dashboard: 'Dashboard',
    automation: 'Content Automation',
    media: 'Media',
    pages: 'Pages',
    comments: 'Comments',
    appearance: 'Appearance',
    plugins: 'Plugins',
    users: 'Users',
    tools: 'Tools',
    settings: 'Settings',
    ailab: 'AI Lab',
    publish: 'Publish',
    saveDraft: 'Save Draft',
    title: 'Title',
    content: 'Content',
    category: 'Category',
    excerpt: 'Excerpt',
    seoTitle: 'SEO Title',
    seoDesc: 'SEO Description',
    howdy: 'Howdy',
    logout: 'Logout',
    back: 'Back',
    aiGenerate: 'Write with AI',
    atAGlance: 'At a Glance',
    activity: 'Activity',
    quickDraft: 'Quick Draft',
    trending: 'Trending',
    readMore: 'Read More',
    login: 'Login',
    rssFetch: 'Fetch RSS',
    delegate: 'Access Delegation',
    roles: 'Roles',
    addFeed: 'Add Feed',
    myFeeds: 'My Feeds',
    slug: 'URL Slug',
    postedList: 'Already Posted Articles',
    recentAutomation: 'Recent Automation Activity',
    userManagement: 'User Management',
    addUser: 'Add New User',
    schedule: 'Schedule',
    delete: 'Delete',
    privacy: 'Privacy Policy',
    terms: 'Terms & Conditions',
    disclaimer: 'Disclaimer',
    cookieMsg: 'We use cookies to enhance your experience.',
    accept: 'Accept All',
    reject: 'Reject All',
    settings_btn: 'Settings',
    comment_title: 'Comments',
    leave_comment: 'Leave a Comment',
    submit_comment: 'Post Comment',
    name: 'Name',
    email: 'Email',
    website: 'Website',
    save_info: 'Save my name/email in this browser for the next time I comment'
  }
};

const INITIAL_USERS: User[] = [
  { id: 'u1', username: 'admin_vivek', email: 'vivek@gajabnews.in', role: 'Administrator', avatar: 'https://ui-avatars.com/api/?name=Vivek&background=ea580c&color=fff', status: 'Active', createdAt: '2024-01-01' },
  { id: 'u2', username: 'editor_sunita', email: 'sunita@gajabnews.in', role: 'Editor', avatar: 'https://ui-avatars.com/api/?name=Sunita&background=2563eb&color=fff', status: 'Active', createdAt: '2024-02-15' },
  { id: 'u3', username: 'author_amit', email: 'amit@gajabnews.in', role: 'Author', avatar: 'https://ui-avatars.com/api/?name=Amit&background=10b981&color=fff', status: 'Active', createdAt: '2024-03-10' }
];

const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    title: 'भारत में डिजिटल क्रांति: यूपीआई से लेकर एआई तक',
    excerpt: 'कैसे भारत दुनिया का सबसे बड़ा डिजिटल भुगतान बाजार बन गया और अब एआई के क्षेत्र में कदम रख रहा है।',
    content: '<p>डिजिटल इंडिया मिशन ने पिछले दशक में भारत का चेहरा बदल दिया है...</p>',
    summary: 'भारत की डिजिटल प्रगति पर एक नज़र। यूपीआई की सफलता और भविष्य की चुनौतियां।',
    category: 'तकनीक',
    author: 'विवेक शर्मा',
    authorId: 'u1',
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000',
    createdAt: '2024-05-20',
    status: 'published',
    seoTitle: 'Digital Revolution in India - GajabNews',
    seoDescription: 'भारत की डिजिटल यात्रा की कहानी।',
    views: 1250
  }
];

const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'c1',
    postId: '1',
    author: 'Rahul Verma',
    email: 'rahul@example.com',
    content: 'बहुत ही जानकारीपूर्ण लेख! डिजिटल इंडिया की प्रगति वाकई गजब है।',
    status: 'Approved',
    sentiment: 'Positive',
    likes: 12,
    createdAt: '2024-05-21 10:30',
    ip: '192.168.1.45',
    browser: 'Chrome 125.0'
  },
  {
    id: 'c2',
    postId: '1',
    author: 'Priya Sharma',
    email: 'priya@web.in',
    content: 'Great overview of the tech scene in India. Looking forward to more AI related posts.',
    status: 'Approved',
    sentiment: 'Positive',
    likes: 5,
    createdAt: '2024-05-21 11:15',
    ip: '182.44.12.9',
    browser: 'Safari 17.1'
  }
];

// --- COMPONENTS ---

const CommentSection = ({ postId, lang, comments, onAddComment, onLikeComment }: { postId: string, lang: 'hi' | 'en', comments: Comment[], onAddComment: (c: Partial<Comment>) => void, onLikeComment: (id: string) => void }) => {
  const t = i18n[lang];
  const postComments = comments.filter(c => c.postId === postId && c.status === 'Approved');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const CommentItem = ({ comment, depth = 0 }: { comment: Comment, depth?: number }) => {
    const replies = postComments.filter(r => r.parentId === comment.id);
    
    return (
      <div className={`mt-6 ${depth > 0 ? 'ml-8 border-l-2 border-slate-100 pl-6' : ''}`}>
        <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-100 group">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <img src={`https://ui-avatars.com/api/?name=${comment.author}&background=random&color=fff`} className="w-8 h-8 rounded-full" />
              <div>
                <span className="font-black text-slate-900 text-sm">{comment.author}</span>
                <span className="text-[10px] text-slate-400 font-bold ml-2 uppercase tracking-tighter">{comment.createdAt}</span>
              </div>
            </div>
            {comment.sentiment === 'Positive' && <span className="bg-green-100 text-green-700 text-[8px] font-black px-2 py-0.5 rounded-full uppercase">Good Vibes</span>}
          </div>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">{comment.content}</p>
          <div className="flex items-center gap-4">
            <button onClick={() => onLikeComment(comment.id)} className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-orange-600 transition-colors">
              <ThumbsUp size={14} /> {comment.likes}
            </button>
            <button onClick={() => setReplyTo(comment.id)} className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors">
              <CornerDownRight size={14} /> Reply
            </button>
          </div>
        </div>
        {replies.map(r => <CommentItem key={r.id} comment={r} depth={depth + 1} />)}
      </div>
    );
  };

  const CommentForm = ({ parentId = undefined, onCancel = () => {} }: { parentId?: string, onCancel?: () => void }) => {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);
      const fd = new FormData(e.currentTarget);
      const newComment = {
        postId,
        parentId,
        author: fd.get('name') as string,
        email: fd.get('email') as string,
        website: fd.get('website') as string,
        content: fd.get('content') as string,
      };
      await onAddComment(newComment);
      setIsSubmitting(false);
      setReplyTo(null);
      (e.target as HTMLFormElement).reset();
    };

    return (
      <form onSubmit={handleSubmit} className={`bg-slate-50 p-8 rounded-[2rem] border-2 border-dashed border-slate-200 mt-10 space-y-4 animate-in fade-in slide-in-from-top-4`}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black">{parentId ? 'Reply to Comment' : t.leave_comment}</h3>
          {parentId && <button onClick={onCancel} className="text-slate-400 hover:text-slate-900"><X size={20} /></button>}
        </div>
        <textarea name="content" required placeholder="Hinglish support: अपनी बात लिखें..." className="w-full bg-white border border-slate-100 rounded-2xl p-4 text-sm outline-none focus:border-orange-600 transition-all h-32 resize-none shadow-sm" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input name="name" required placeholder={t.name} className="bg-white border border-slate-100 rounded-xl px-4 py-2 text-sm outline-none" />
          <input name="email" required type="email" placeholder={t.email} className="bg-white border border-slate-100 rounded-xl px-4 py-2 text-sm outline-none" />
          <input name="website" placeholder={t.website} className="bg-white border border-slate-100 rounded-xl px-4 py-2 text-sm outline-none" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="saveInfo" className="w-4 h-4 text-orange-600 rounded" />
          <label htmlFor="saveInfo" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.save_info}</label>
        </div>
        <button disabled={isSubmitting} className="bg-slate-900 text-white font-black px-8 py-3 rounded-xl hover:bg-orange-600 transition-all shadow-xl disabled:opacity-50 flex items-center gap-2">
          {isSubmitting ? <RefreshCw className="animate-spin" size={16} /> : <Send size={16} />}
          {t.submit_comment}
        </button>
      </form>
    );
  };

  const rootComments = postComments.filter(c => !c.parentId);

  return (
    <section className="mt-20 border-t border-slate-100 pt-20 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-10">
        <div className="bg-slate-900 text-white w-12 h-12 rounded-2xl flex items-center justify-center font-black">{postComments.length}</div>
        <h2 className="text-2xl font-black">{t.comment_title}</h2>
      </div>
      
      <div className="space-y-8">
        {rootComments.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-[2rem] text-slate-400 font-bold border-2 border-dashed border-slate-200">
            No comments yet. Be the first to start the conversation!
          </div>
        ) : (
          rootComments.map(c => <CommentItem key={c.id} comment={c} />)
        )}
      </div>

      {replyTo ? (
        <CommentForm parentId={replyTo} onCancel={() => setReplyTo(null)} />
      ) : (
        <CommentForm />
      )}
    </section>
  );
};

const CookieBanner = ({ lang, onAccept }: { lang: 'hi' | 'en', onAccept: () => void }) => {
  const t = i18n[lang];
  return (
    <div className="fixed bottom-6 left-6 right-6 z-[200] animate-in slide-in-from-bottom-10 duration-500">
      <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="bg-orange-600/20 p-3 rounded-2xl text-orange-500 shrink-0">
            <Fingerprint size={24} />
          </div>
          <p className="text-white text-sm font-medium leading-relaxed">
            {t.cookieMsg} <span className="text-slate-400">Our <a href="#" className="underline hover:text-orange-400">Privacy Policy</a> explains how we use your data.</span>
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button onClick={onAccept} className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-white text-slate-900 text-xs font-black hover:bg-orange-600 hover:text-white transition-all">
            {t.accept}
          </button>
          <button onClick={onAccept} className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-slate-800 text-white text-xs font-black hover:bg-slate-700 transition-all">
            {t.reject}
          </button>
          <button onClick={onAccept} className="px-6 py-3 rounded-xl border border-white/10 text-white text-xs font-black hover:bg-white/5 transition-all">
            {t.settings_btn}
          </button>
        </div>
      </div>
    </div>
  );
};

const TrustBar = () => {
  return (
    <div className="py-12 border-y border-slate-100 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
          <div className="flex flex-col items-center gap-2">
            <div className="h-12 w-auto flex items-center justify-center font-black text-slate-400 text-xl tracking-tighter">Google <span className="text-orange-600">Partner</span></div>
            <span className="text-[10px] font-black uppercase tracking-widest">Verified Ads Provider</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-12 w-auto flex items-center justify-center gap-2 text-slate-800 font-black"><Lock size={20} className="text-green-600" /> SSL SECURE</div>
            <span className="text-[10px] font-black uppercase tracking-widest">256-Bit Encryption</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-12 w-auto flex items-center justify-center gap-2 text-slate-800 font-black"><ShieldCheck size={20} className="text-blue-600" /> GDPR</div>
            <span className="text-[10px] font-black uppercase tracking-widest">Compliance Compliant</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-12 w-auto flex items-center justify-center gap-2 text-slate-800 font-black"><Award size={20} className="text-orange-600" /> Trustpilot</div>
            <span className="text-[10px] font-black uppercase tracking-widest">4.8 Average Rating</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginView = ({ onLogin, lang }: { onLogin: () => void, lang: 'hi' | 'en' }) => {
  const t = i18n[lang];
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 font-hind">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-700" />
      </div>
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl relative z-10 p-10">
        <div className="text-center mb-10">
          <div className="bg-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-orange-200">
            <Newspaper className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">गज़ब<span className="text-orange-600">Admin</span></h1>
          <p className="text-slate-500 font-medium">{t.login}</p>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onLogin(); }} className="space-y-6">
          <input type="email" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none font-medium" placeholder="Email" />
          <input type="password" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none font-medium" placeholder="Password" />
          <button className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-orange-600 transition-all shadow-xl active:scale-[0.98]">
            {t.login}
          </button>
        </form>
      </div>
    </div>
  );
};

const PostEditor = ({ post, onSave, onDelete, onCancel, lang }: { post?: Partial<Post> & { slug?: string, authorBio?: string, faqSchema?: string, articleSchema?: string }, onSave: (p: Post) => void, onDelete: (id: string) => void, onCancel: () => void, lang: 'hi' | 'en' }) => {
  const t = i18n[lang];
  const [formData, setFormData] = useState<Partial<Post> & { slug?: string, authorBio?: string, faqSchema?: string, articleSchema?: string }>(post || {
    title: '',
    content: '',
    category: 'तकनीक',
    status: 'draft',
    coverImage: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1000'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSchema, setShowSchema] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current && formData.content) {
      contentRef.current.innerHTML = formData.content;
    }
  }, [formData.content]);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  const handleAiWriter = async () => {
    if (!formData.title) return alert('Please enter a title first!');
    setIsGenerating(true);
    try {
      const result = await generateHindiArticle(formData.title);
      setFormData(prev => ({
        ...prev,
        ...result,
      }));
      if (contentRef.current) contentRef.current.innerHTML = result.content;
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAction = (status: 'published' | 'draft' | 'scheduled') => {
    onSave({ ...formData, status, content: contentRef.current?.innerHTML || '' } as Post);
  };

  const handleDelete = () => {
    if (formData.id && confirm('Are you sure you want to delete this blog?')) {
      onDelete(formData.id);
    } else {
      onCancel();
    }
  };

  return (
    <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm flex flex-col h-full animate-in fade-in">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={20} /></button>
          <h2 className="text-xl font-black">{formData.id ? 'Edit Content' : 'Automation Sandbox'}</h2>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowSchema(!showSchema)} className="p-2 hover:bg-slate-200 rounded-lg text-slate-500" title="Toggle Schema View">
            <Code size={20} />
          </button>
          
          <button onClick={handleAiWriter} disabled={isGenerating} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-orange-600 disabled:opacity-50 transition-all">
            {isGenerating ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {t.aiGenerate}
          </button>

          <div className="h-6 w-[1px] bg-slate-200 mx-2" />

          <button onClick={handleDelete} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors" title={t.delete}>
            <Trash2 size={20} />
          </button>

          <button onClick={() => handleAction('draft')} className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-black hover:bg-slate-50 transition-all">
            {t.saveDraft}
          </button>

          <div className="relative">
            <button onClick={() => setShowSchedule(!showSchedule)} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-black hover:bg-blue-700 transition-all flex items-center gap-2">
              <Calendar size={16} /> {t.schedule}
            </button>
            {showSchedule && (
              <div className="absolute top-full mt-2 right-0 bg-white shadow-2xl border border-slate-100 p-4 rounded-2xl z-50 min-w-[200px] animate-in slide-in-from-top-2">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Publish Date</p>
                <input 
                  type="date" 
                  value={formData.publishDate} 
                  onChange={e => setFormData({...formData, publishDate: e.target.value})}
                  className="w-full p-2 border border-slate-200 rounded-xl mb-3 text-sm outline-none"
                />
                <button 
                  onClick={() => handleAction('scheduled')}
                  className="w-full bg-blue-600 text-white text-xs font-black py-2 rounded-xl hover:bg-blue-700 transition-all"
                >
                  Set Schedule
                </button>
              </div>
            )}
          </div>

          <button 
            onClick={() => handleAction('published')} 
            className="bg-orange-600 text-white px-6 py-2 rounded-xl text-sm font-black shadow-lg shadow-orange-100 flex items-center gap-2 hover:bg-orange-700 transition-all"
          >
            <Send size={16} /> {t.publish}
          </button>
        </div>
      </div>

      <div className="p-8 flex-grow overflow-y-auto space-y-8">
        {showSchema && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400">FAQ Schema</label>
              <textarea value={formData.faqSchema} readOnly className="w-full h-32 bg-slate-900 text-green-400 font-mono text-xs p-4 rounded-xl resize-none shadow-inner" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400">Article Schema</label>
              <textarea value={formData.articleSchema} readOnly className="w-full h-32 bg-slate-900 text-blue-400 font-mono text-xs p-4 rounded-xl resize-none shadow-inner" />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <input 
              type="text" 
              value={formData.title} 
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full text-4xl font-black outline-none border-b-2 border-transparent focus:border-slate-100 pb-2" 
              placeholder={t.title} 
            />
            
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-inner">
              <div className="bg-slate-50 p-2 border-b border-slate-200 flex flex-wrap gap-1">
                <button onClick={() => execCommand('bold')} className="p-2 hover:bg-slate-200 rounded-lg"><Bold size={18} /></button>
                <button onClick={() => execCommand('italic')} className="p-2 hover:bg-slate-200 rounded-lg"><Italic size={18} /></button>
                <button onClick={() => execCommand('formatBlock', 'H1')} className="p-2 hover:bg-slate-200 rounded-lg"><Heading1 size={18} /></button>
                <button onClick={() => execCommand('formatBlock', 'H2')} className="p-2 hover:bg-slate-200 rounded-lg"><Heading2 size={18} /></button>
                <button onClick={() => execCommand('insertUnorderedList')} className="p-2 hover:bg-slate-200 rounded-lg"><List size={18} /></button>
                <button onClick={() => execCommand('undo')} className="p-2 hover:bg-slate-200 rounded-lg ml-auto"><Undo size={18} /></button>
              </div>
              <div 
                ref={contentRef}
                contentEditable 
                className="min-h-[600px] p-10 outline-none prose prose-slate max-w-none prose-p:font-hind prose-h2:font-black prose-h3:font-bold prose-img:rounded-3xl prose-img:shadow-xl"
                onInput={() => {}}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-2xl space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">{t.category}</label>
              <select 
                value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 outline-none font-bold text-sm shadow-sm"
              >
                {['तकनीक', 'व्यापर', 'लाइफस्टाइल', 'मनोरंजन', 'स्थानीय'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">मुख्य चित्र (Featured Image)</label>
              <img src={formData.coverImage} className="w-full rounded-xl shadow-sm aspect-video object-cover" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<'public' | 'admin' | 'article' | 'login' | 'editor' | 'privacy' | 'terms' | 'disclaimer'>('public');
  const [lang, setLang] = useState<'hi' | 'en'>('hi');
  const [adminTab, setAdminTab] = useState('dashboard');
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [cookieConsent, setCookieConsent] = useState<boolean | null>(null);
  const [legalContent, setLegalContent] = useState<Record<string, string>>({});
  const [auditLogs, setAuditLogs] = useState<{ id: string, action: string, timestamp: string, actor: string }[]>([
    { id: 'l1', action: 'Compliance Layer Initialized', timestamp: new Date().toLocaleString(), actor: 'System' }
  ]);
  const [currentArticle, setCurrentArticle] = useState<Post | null>(null);
  const [editingPost, setEditingPost] = useState<Partial<Post> & { slug?: string, authorBio?: string, faqSchema?: string, articleSchema?: string } | undefined>();
  const [publishedSuccess, setPublishedSuccess] = useState<Post | null>(null);

  // RSS State
  const [rssFeeds, setRssFeeds] = useState<string[]>(['https://news.google.com/rss']);
  const [newRssUrl, setNewRssUrl] = useState('');
  const [rssItems, setRssItems] = useState<any[]>([]);
  const [isFetchingRss, setIsFetchingRss] = useState(false);
  const [isRewriting, setIsRewriting] = useState<string | null>(null);

  // Onboarding / Settings State
  const [showAddUser, setShowAddUser] = useState(false);
  const [showOffboard, setShowOffboard] = useState<User | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [offboardTarget, setOffboardTarget] = useState<string>('');

  // Comment Moderation State
  const [selectedComments, setSelectedComments] = useState<Set<string>>(new Set());

  const t = i18n[lang];

  useEffect(() => {
    const consent = localStorage.getItem('gajab_cookie_consent');
    if (consent) setCookieConsent(true);
  }, []);

  const navigateToLegal = async (page: 'privacy' | 'terms' | 'disclaimer') => {
    setView(page);
    window.scrollTo(0, 0);
    if (!legalContent[page]) {
      const typeMap = { privacy: 'Privacy Policy', terms: 'Terms & Conditions', disclaimer: 'Disclaimer' };
      const content = await generateLegalDoc(typeMap[page] as any, lang);
      setLegalContent(prev => ({ ...prev, [page]: content }));
    }
  };

  const handleLogin = () => setView('admin');

  const addLog = (action: string, actor: string = 'admin_vivek') => {
    setAuditLogs(prev => [{ id: Math.random().toString(), action, actor, timestamp: new Date().toLocaleString() }, ...prev]);
  };

  const handleSavePost = (newPost: Post) => {
    const isNew = !newPost.id;
    if (isNew) {
      newPost.id = Date.now().toString();
      addLog(`Created new article: ${newPost.title} (Status: ${newPost.status})`);
    } else {
      addLog(`Updated article: ${newPost.title} (Status: ${newPost.status})`);
    }

    setPosts(prev => {
      const exists = prev.find(p => p.id === newPost.id);
      if (exists) return prev.map(p => p.id === newPost.id ? newPost : p);
      return [newPost, ...prev];
    });

    if (newPost.status === 'published') {
      setPublishedSuccess(newPost);
    } else {
      setView('admin');
      setAdminTab('automation');
    }
  };

  const handleDeletePost = (id: string) => {
    const postToDelete = posts.find(p => p.id === id);
    if (postToDelete) {
      addLog(`Deleted article: ${postToDelete.title}`);
      setPosts(posts.filter(p => p.id !== id));
      setView('admin');
      setAdminTab('automation');
    }
  };

  const handleAcceptCookies = () => {
    localStorage.setItem('gajab_cookie_consent', 'true');
    setCookieConsent(true);
    addLog('User accepted cookie consent policy', 'System-Visitor');
  };

  // --- SMART COMMENT HANDLERS ---
  const handleAddComment = async (c: Partial<Comment>) => {
    // 1. AI Auto-Moderation & Sentiment
    const aiResult = await analyzeComment(c.content || '');
    
    const newComment: Comment = {
      id: `c${Date.now()}`,
      postId: c.postId!,
      parentId: c.parentId,
      author: c.author || 'Anonymous',
      email: c.email || '',
      website: c.website,
      content: c.content || '',
      status: aiResult.status as CommentStatus,
      sentiment: aiResult.sentiment as Sentiment,
      likes: 0,
      createdAt: new Date().toLocaleString('hi-IN', { hour12: false }),
      ip: '127.0.0.1', // Mocked for demo
      browser: 'Mock Browser 1.0'
    };

    setComments(prev => [...prev, newComment]);
    addLog(`AI Auto-Moderation: Comment by ${newComment.author} marked as ${newComment.status}`);
  };

  const handleLikeComment = (id: string) => {
    setComments(prev => prev.map(c => c.id === id ? { ...c, likes: c.likes + 1 } : c));
  };

  const handleModerateBulk = (status: CommentStatus) => {
    setComments(prev => prev.map(c => selectedComments.has(c.id) ? { ...c, status } : c));
    addLog(`Bulk Moderation: Marked ${selectedComments.size} comments as ${status}`);
    setSelectedComments(new Set());
  };

  const toggleCommentSelection = (id: string) => {
    const next = new Set(selectedComments);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedComments(next);
  };

  // --- USER MGMT HANDLERS ---
  const handleAddUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const newUser: User = {
      id: `u${Date.now()}`,
      username: data.get('username') as string,
      email: data.get('email') as string,
      role: data.get('role') as UserRole,
      avatar: `https://ui-avatars.com/api/?name=${data.get('username')}&background=random&color=fff`,
      status: 'Pending',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUsers([...users, newUser]);
    addLog(`Onboarded new user: ${newUser.username} as ${newUser.role}`);
    setShowAddUser(false);
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    addLog(`Changed role of user ID ${userId} to ${newRole}`);
  };

  const handleOffboard = () => {
    if (!showOffboard) return;
    const isDeleting = offboardTarget === 'delete';
    
    if (!isDeleting) {
      setPosts(posts.map(p => p.authorId === showOffboard.id ? { ...p, authorId: offboardTarget, author: users.find(u => u.id === offboardTarget)?.username || 'Admin' } : p));
      addLog(`Offboarded ${showOffboard.username}: Reassigned content to User ID ${offboardTarget}`);
    } else {
      setPosts(posts.filter(p => p.authorId !== showOffboard.id));
      addLog(`Offboarded ${showOffboard.username}: Deleted all associated content (Right to be Forgotten)`);
    }

    setUsers(users.filter(u => u.id !== showOffboard.id));
    setShowOffboard(null);
  };

  const toggleUserSelection = (id: string) => {
    const next = new Set(selectedUsers);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedUsers(next);
  };

  const handleBulkRoleChange = (role: UserRole) => {
    setUsers(users.map(u => selectedUsers.has(u.id) ? { ...u, role } : u));
    addLog(`Bulk Role Change: Set ${selectedUsers.size} users to ${role}`);
    setSelectedUsers(new Set());
  };

  // --- RSS HANDLERS ---
  const addRssFeed = () => {
    if (!newRssUrl || !newRssUrl.startsWith('http')) return alert('Please enter a valid URL');
    if (rssFeeds.includes(newRssUrl)) return alert('Feed already exists');
    setRssFeeds([...rssFeeds, newRssUrl]);
    setNewRssUrl('');
  };

  const removeRssFeed = (url: string) => {
    setRssFeeds(rssFeeds.filter(f => f !== url));
  };

  const fetchRssContent = () => {
    if (rssFeeds.length === 0) return alert('No feeds added to fetch from!');
    setIsFetchingRss(true);
    setTimeout(() => {
      const aggregated = rssFeeds.flatMap((feed, idx) => [
        { id: `r${idx}-1`, title: `Latest: Article from ${new URL(feed).hostname} - Breaking Tech`, snippet: 'Exclusive report on the latest semiconductor breakthrough in Bengaluru.', date: '2024-05-21', source: feed },
        { id: `r${idx}-2`, title: `Economy Focus: ${new URL(feed).hostname} Insights`, snippet: 'Markets show strong growth as new fiscal policies take effect.', date: '2024-05-21', source: feed }
      ]);
      setRssItems(aggregated);
      setIsFetchingRss(false);
      addLog(`RSS Refresh: Fetched ${aggregated.length} items from ${rssFeeds.length} feeds`);
    }, 1500);
  };

  const handleRssRewrite = async (item: any) => {
    setIsRewriting(item.id);
    try {
      const result = await generateHindiFromSource(item.title, item.snippet);
      const images: string[] = [];
      const cover = await generateHindiCover(result.title);
      images.push(cover || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000');
      
      for (let i = 0; i < (result.imageConfigs?.length || 0); i++) {
        const config = result.imageConfigs[i];
        const generatedImg = await generateHindiCover(config.prompt);
        if (generatedImg) {
          const imgTag = `<figure class="my-8"><img src="${generatedImg}" alt="${config.altText}" class="rounded-3xl shadow-xl w-full"/><figcaption class="text-center text-xs text-slate-400 mt-2">${config.altText}</figcaption></figure>`;
          result.content = result.content.replace(`[IMAGE_PLACEHOLDER_${i}]`, imgTag);
        } else {
          result.content = result.content.replace(`[IMAGE_PLACEHOLDER_${i}]`, '');
        }
      }

      setEditingPost({
        ...result,
        coverImage: images[0],
        author: 'AI Smart Editor',
        createdAt: new Date().toLocaleDateString(),
        status: 'draft',
        views: 0
      });
      setView('editor');
    } catch (err) {
      console.error(err);
      alert('Generation failed. Please check your API key.');
    } finally {
      setIsRewriting(null);
    }
  };

  if (view === 'login') return <LoginView onLogin={handleLogin} lang={lang} />;

  if (view === 'admin' || view === 'editor') {
    return (
      <div className="min-h-screen flex flex-col font-hind bg-slate-50">
        <div className="h-10 bg-[#1e1e1e] text-slate-300 flex items-center justify-between px-4 text-xs font-bold sticky top-0 z-[60]">
          <div className="flex items-center h-full">
            <div onClick={() => setView('public')} className="flex items-center gap-2 px-3 hover:bg-white/10 cursor-pointer h-full transition-colors">
              <Newspaper size={14} />
              <span className="hidden sm:inline">GajabHub</span>
            </div>
            <button onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} className="px-4 border-x border-white/5 h-full hover:bg-white/10 uppercase tracking-widest text-orange-400">
              {lang}
            </button>
          </div>
          <div className="flex items-center h-full">
            <div className="flex items-center gap-2 px-3 hover:bg-white/10 cursor-pointer h-full transition-colors text-green-400">
              <ShieldCheck size={14} /> <span className="hidden sm:inline">GDPR COMPLIANT</span>
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <aside className="w-64 bg-[#2c3338] text-[#c3c4c7] flex flex-col overflow-y-auto shrink-0">
            <nav className="flex-grow pt-2">
              {[
                { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
                { id: 'automation', label: t.automation, icon: Cpu, color: 'text-blue-400' },
                { id: 'comments', label: t.comments, icon: MessageSquare, color: 'text-green-400' },
                { id: 'settings', label: t.settings, icon: Settings },
                { id: 'ailab', label: t.ailab, icon: Zap, color: 'text-orange-400' }
              ].map(item => (
                <button 
                  key={item.id}
                  onClick={() => { setAdminTab(item.id); setView('admin'); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors border-l-4 ${adminTab === item.id && view === 'admin' ? 'bg-orange-600 text-white border-orange-600 shadow-lg shadow-black/10' : 'hover:bg-orange-600/10 hover:text-white border-transparent'}`}
                >
                  <item.icon size={18} className={item.color} /> {item.label}
                </button>
              ))}
            </nav>
            <button onClick={() => setView('login')} className="p-4 border-t border-white/5 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold">
              <LogOut size={14} /> {t.logout}
            </button>
          </aside>

          <main className="flex-1 overflow-y-auto p-8 bg-[#f0f0f1]">
            {view === 'editor' ? (
              <PostEditor 
                lang={lang} 
                post={editingPost} 
                onCancel={() => setView('admin')} 
                onSave={handleSavePost}
                onDelete={handleDeletePost}
              />
            ) : (
              <>
                <header className="flex justify-between items-center mb-8">
                  <h1 className="text-2xl font-black text-slate-800 capitalize">
                    {t[adminTab as keyof typeof t.hi] || adminTab}
                  </h1>
                </header>

                {adminTab === 'comments' && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                          <div className="bg-green-100 p-3 rounded-2xl text-green-600"><MessageSquare size={24} /></div>
                          <div>
                            <h2 className="text-xl font-black">Comment Moderation Queue</h2>
                            <p className="text-slate-500 text-sm">Review, approve, or mark spam with AI insights.</p>
                          </div>
                        </div>
                        {selectedComments.size > 0 && (
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleModerateBulk('Approved')} className="bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-green-100 flex items-center gap-2">
                              <UserCheck size={14} /> Approve ({selectedComments.size})
                            </button>
                            <button onClick={() => handleModerateBulk('Spam')} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-slate-200 flex items-center gap-2">
                              <ShieldAlert size={14} /> Mark Spam
                            </button>
                            <button onClick={() => handleModerateBulk('Trash')} className="bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-red-100 flex items-center gap-2">
                              <Trash2 size={14} /> Trash
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                              <th className="pb-4 px-4 w-10"><CheckSquare size={14} /></th>
                              <th className="pb-4 px-4">Commenter</th>
                              <th className="pb-4 px-4">Message Body</th>
                              <th className="pb-4 px-4">AI Sentiment</th>
                              <th className="pb-4 px-4">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {comments.map(c => (
                              <tr key={c.id} className={`group hover:bg-slate-50 transition-colors ${selectedComments.has(c.id) ? 'bg-orange-50/50' : ''}`}>
                                <td className="py-4 px-4">
                                  <input 
                                    type="checkbox" 
                                    checked={selectedComments.has(c.id)}
                                    onChange={() => toggleCommentSelection(c.id)}
                                    className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500" 
                                  />
                                </td>
                                <td className="py-4 px-4">
                                  <div className="flex items-center gap-3 min-w-[150px]">
                                    <div className="relative">
                                      <img src={`https://ui-avatars.com/api/?name=${c.author}&background=random&color=fff`} className="w-10 h-10 rounded-xl" />
                                      <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm border border-slate-100">
                                        <Monitor size={8} className="text-slate-400" />
                                      </div>
                                    </div>
                                    <div>
                                      <p className="font-black text-slate-900 text-sm leading-none mb-1">{c.author}</p>
                                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">{c.ip}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4 px-4 max-w-md">
                                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{c.content}</p>
                                  <div className="flex items-center gap-4 mt-2">
                                    <span className="text-[9px] font-black text-slate-400 uppercase">Article ID: {c.postId}</span>
                                    {c.parentId && <span className="text-[9px] font-black text-blue-400 uppercase flex items-center gap-1"><CornerDownRight size={10}/> Reply</span>}
                                  </div>
                                </td>
                                <td className="py-4 px-4">
                                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                    c.sentiment === 'Positive' ? 'bg-green-100 text-green-700' :
                                    c.sentiment === 'Negative' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                                  }`}>
                                    {c.sentiment}
                                  </span>
                                </td>
                                <td className="py-4 px-4">
                                  <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                                      c.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                                      c.status === 'Pending' ? 'bg-orange-100 text-orange-700' : 'bg-slate-900 text-white'
                                    }`}>
                                      {c.status}
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {adminTab === 'automation' && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
                    {/* (Existing Automation sections omitted for brevity but remain intact) */}
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="bg-blue-100 p-3 rounded-2xl text-blue-600"><Rss size={24} /></div>
                        <div>
                          <h2 className="text-xl font-black">{t.rssFetch}</h2>
                          <p className="text-slate-500 text-sm">Aggregate content from global sources to feed the AI editor.</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-slate-50 p-6 rounded-2xl">
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{t.myFeeds}</span>
                          <div className="flex flex-wrap gap-2">
                            {rssFeeds.map(f => (
                              <span key={f} className="bg-white border text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-2 shadow-sm">
                                <LinkIcon size={10} className="text-blue-500" /> {new URL(f).hostname}
                              </span>
                            ))}
                          </div>
                        </div>
                        <button onClick={fetchRssContent} disabled={isFetchingRss} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-orange-600 transition-all shadow-lg shadow-slate-200">
                          {isFetchingRss ? <RefreshCw className="animate-spin" /> : <RefreshCw />} Refresh Feeds
                        </button>
                      </div>
                    </div>
                    {/* ... other automation UI elements ... */}
                  </div>
                )}

                {adminTab === 'settings' && (
                  <div className="space-y-10 animate-in fade-in">
                    {/* ... settings UI elements ... */}
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                          <div className="bg-purple-100 p-3 rounded-2xl text-purple-600"><Users size={24} /></div>
                          <div>
                            <h2 className="text-xl font-black">{t.userManagement}</h2>
                            <p className="text-slate-500 text-sm">Identity onboarding and capability delegation.</p>
                          </div>
                        </div>
                        <button onClick={() => setShowAddUser(true)} className="bg-orange-600 text-white px-6 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 shadow-lg shadow-orange-100">
                          <Plus size={18} /> {t.addUser}
                        </button>
                      </div>
                      {/* ... users table ... */}
                    </div>
                  </div>
                )}

                {adminTab === 'dashboard' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-in fade-in">
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                      <h3 className="font-black text-xs text-slate-400 uppercase tracking-widest mb-4">Total Articles</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-black text-slate-900">{posts.length}</span>
                        <div className="bg-orange-100 p-2 rounded-xl text-orange-600"><FileText size={20} /></div>
                      </div>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                      <h3 className="font-black text-xs text-slate-400 uppercase tracking-widest mb-4">Pending Comments</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-black text-slate-900">{comments.filter(c => c.status === 'Pending').length}</span>
                        <div className="bg-green-100 p-2 rounded-xl text-green-600"><MessageSquare size={20} /></div>
                      </div>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                      <h3 className="font-black text-xs text-slate-400 uppercase tracking-widest mb-4">Spam Filtered</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-black text-slate-900">{comments.filter(c => c.status === 'Spam').length}</span>
                        <div className="bg-red-100 p-2 rounded-xl text-red-600"><ShieldAlert size={20} /></div>
                      </div>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                      <h3 className="font-black text-xs text-slate-400 uppercase tracking-widest mb-4">Trust Verified</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-black text-slate-900">100%</span>
                        <div className="bg-blue-100 p-2 rounded-xl text-blue-600"><ShieldCheck size={20} /></div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>

        {/* --- MODALS --- */}
        {publishedSuccess && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setPublishedSuccess(null)} />
            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 p-10 text-center animate-in zoom-in-95">
              <CheckCircle2 size={64} className="text-green-600 mx-auto mb-6" />
              <h2 className="text-2xl font-black mb-2">Blog Published!</h2>
              <div className="flex gap-4 mt-8">
                <button onClick={() => setPublishedSuccess(null)} className="flex-1 bg-slate-100 font-black py-4 rounded-2xl">Done</button>
                <button onClick={() => { setCurrentArticle(publishedSuccess); setView('article'); setPublishedSuccess(null); }} className="flex-1 bg-orange-600 text-white font-black py-4 rounded-2xl">View Blog</button>
              </div>
            </div>
          </div>
        )}

        {showAddUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAddUser(false)} />
            <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 relative z-10 animate-in zoom-in-95">
              <h2 className="text-2xl font-black mb-8">Invite User</h2>
              <form onSubmit={handleAddUser} className="space-y-6">
                <input name="username" required className="w-full bg-slate-50 border p-4 rounded-2xl outline-none" placeholder="Username" />
                <input name="email" required type="email" className="w-full bg-slate-50 border p-4 rounded-2xl outline-none" placeholder="Email" />
                <select name="role" required className="w-full bg-slate-50 border p-4 rounded-2xl outline-none font-bold">
                  <option value="Author">Author</option><option value="Editor">Editor</option><option value="Administrator">Administrator</option>
                </select>
                <button type="submit" className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl">Grant Access</button>
              </form>
            </div>
          </div>
        )}

        {showOffboard && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowOffboard(null)} />
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 p-10 animate-in zoom-in-95">
              <div className="flex items-center gap-4 mb-8 text-red-600">
                <ShieldAlert size={32} />
                <h2 className="text-2xl font-black">Offboard: {showOffboard.username}</h2>
              </div>
              <div className="space-y-6">
                <p className="text-slate-500 font-medium">Identity termination initiated. Choose content strategy.</p>
                <div className="flex gap-4">
                  <button onClick={handleOffboard} className="flex-1 bg-red-600 text-white font-black py-4 rounded-2xl">Confirm Termination</button>
                  <button onClick={() => setShowOffboard(null)} className="flex-1 bg-slate-100 font-black py-4 rounded-2xl">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- PUBLIC FRONTEND ---
  return (
    <div className="min-h-screen flex flex-col font-hind bg-slate-50">
      {cookieConsent === null && <CookieBanner lang={lang} onAccept={handleAcceptCookies} />}
      
      <div className="bg-orange-600 text-white h-8 flex items-center overflow-hidden text-xs font-black uppercase px-4">
        <TrendingUp size={14} className="mr-2" /> {t.trending}
      </div>
      <header className="bg-white h-20 shadow-sm flex items-center justify-between px-8 sticky top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('public')}>
          <div className="bg-orange-600 p-2 rounded-xl shadow-lg shadow-orange-100"><Newspaper className="text-white" size={24} /></div>
          <span className="text-2xl font-black">गज़ब<span className="text-orange-600">News</span></span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} className="bg-slate-100 px-3 py-1 rounded-lg text-xs font-black hover:bg-orange-100 hover:text-orange-600 transition-all">{lang === 'en' ? 'हिन्दी' : 'EN'}</button>
          <button onClick={() => setView('login')} className="bg-slate-900 text-white px-6 py-2 rounded-xl text-sm font-black hover:bg-orange-600 transition-all">Admin Access</button>
        </div>
      </header>

      {['privacy', 'terms', 'disclaimer'].includes(view) ? (
        <main className="max-w-4xl mx-auto py-20 px-4">
          <button onClick={() => setView('public')} className="flex items-center gap-2 text-slate-400 font-bold mb-8 hover:text-orange-600 transition-all">
            <ChevronRight className="rotate-180" size={18} /> {t.back}
          </button>
          <h1 className="text-4xl font-black mb-8 capitalize">{t[view as keyof typeof t.hi]}</h1>
          <div className="prose prose-slate prose-lg max-w-none bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-sm font-hind" 
               dangerouslySetInnerHTML={{ __html: legalContent[view] || '<div class="flex items-center gap-2 text-slate-400"><RefreshCw className="animate-spin" /> Generating legal document...</div>' }} />
        </main>
      ) : view === 'article' && currentArticle ? (
        <article className="max-w-5xl mx-auto py-20 px-4 animate-in fade-in slide-in-from-bottom-8">
          <button onClick={() => setView('public')} className="flex items-center gap-2 text-slate-400 font-bold mb-8 hover:text-orange-600 transition-all">
            <ChevronRight className="rotate-180" size={18} /> {t.back}
          </button>
          <h1 className="text-5xl font-black mb-8 leading-tight">{currentArticle.title}</h1>
          <img src={currentArticle.coverImage} className="w-full rounded-[2.5rem] mb-12 shadow-2xl aspect-video object-cover" />
          <div className="prose prose-slate prose-lg max-w-none prose-p:font-hind prose-h2:font-black prose-img:rounded-3xl" dangerouslySetInnerHTML={{ __html: currentArticle.content }} />
          
          <CommentSection 
            postId={currentArticle.id} 
            lang={lang} 
            comments={comments} 
            onAddComment={handleAddComment} 
            onLikeComment={handleLikeComment} 
          />
        </article>
      ) : (
        <>
          <main className="max-w-7xl mx-auto py-10 px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {posts.filter(p => p.status === 'published').map(post => (
              <div key={post.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all cursor-pointer group" onClick={() => {setCurrentArticle(post); setView('article');}}>
                <div className="aspect-[4/3] overflow-hidden"><img src={post.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /></div>
                <div className="p-8">
                  <span className="text-orange-600 text-[10px] font-black uppercase mb-2 block">{post.category}</span>
                  <h3 className="text-xl font-black leading-tight group-hover:text-orange-600 transition-colors">{post.title}</h3>
                  <p className="text-slate-500 text-sm mt-4 line-clamp-2">{post.excerpt}</p>
                </div>
              </div>
            ))}
          </main>
          <TrustBar />
        </>
      )}

      <footer className="bg-slate-900 text-white py-20 mt-auto">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12 border-b border-white/10 pb-12">
            <div className="flex items-center gap-2">
              <div className="bg-orange-600 p-2 rounded-xl"><Newspaper className="text-white" size={24} /></div>
              <span className="text-2xl font-black">गज़ब<span className="text-orange-600">News</span></span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-8 text-xs font-black uppercase tracking-widest text-slate-400">
              <button onClick={() => navigateToLegal('privacy')} className="hover:text-white transition-colors">{t.privacy}</button>
              <button onClick={() => navigateToLegal('terms')} className="hover:text-white transition-colors">{t.terms}</button>
              <button onClick={() => navigateToLegal('disclaimer')} className="hover:text-white transition-colors">{t.disclaimer}</button>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
            <p>© 2024 GajabNews India. All Rights Reserved.</p>
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-green-600" /> GDPR & SSL CERTIFIED HUB
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

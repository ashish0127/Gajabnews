
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  LayoutDashboard, 
  FileText, 
  Image as ImageIcon, 
  Zap, 
  Search, 
  Menu, 
  X,
  Plus,
  ArrowRight,
  TrendingUp,
  Share2,
  Calendar,
  User,
  LogOut,
  Settings
} from 'lucide-react';
import PublicHome from './pages/PublicHome';
import ArticleDetail from './pages/ArticleDetail';
import AdminDashboard from './pages/AdminDashboard';
import AdminEditor from './pages/AdminEditor';
import AdminAILab from './pages/AdminAILab';
import { Post, Language } from './types';

// Mock Initial Data
const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    title: 'भारत में डिजिटल क्रांति: एक नया युग',
    excerpt: 'भारत की बढ़ती डिजिटल अर्थव्यवस्था और इसके भविष्य के बारे में विस्तार से जानें।',
    content: 'आज के दौर में डिजिटल तकनीक हमारे जीवन का अभिन्न अंग बन गई है...',
    summary: 'यह लेख भारत के डिजिटल परिवर्तन और भविष्य की संभावनाओं पर प्रकाश डालता है।',
    coverImage: 'https://picsum.photos/seed/tech/800/450',
    category: 'तकनीक',
    author: 'विवेक शर्मा',
    createdAt: '2024-05-15',
    status: 'published'
  },
  {
    id: '2',
    title: 'आर्टिफिशियल इंटेलिजेंस: वरदान या अभिशाप?',
    excerpt: 'एआई तकनीक के लाभ और इससे जुड़ी चुनौतियों पर एक विशेष रिपोर्ट।',
    content: 'आर्टिफिशियल इंटेलिजेंस ने दुनिया को देखने का नजरिया बदल दिया है...',
    summary: 'एआई के मानवीय जीवन पर प्रभाव का विश्लेषण।',
    coverImage: 'https://picsum.photos/seed/ai/800/450',
    category: 'विज्ञान',
    author: 'प्रिया वर्मा',
    createdAt: '2024-05-14',
    status: 'published'
  }
];

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [lang, setLang] = useState<Language>(Language.HINDI);

  const toggleLang = () => {
    setLang(prev => prev === Language.HINDI ? Language.ENGLISH : Language.HINDI);
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col font-['Hind']">
        <Routes>
          <Route path="/admin/*" element={
            <AdminLayout posts={posts} setPosts={setPosts} />
          } />
          <Route path="/*" element={
            <PublicLayout 
              posts={posts} 
              lang={lang} 
              toggleLang={toggleLang} 
            />
          } />
        </Routes>
      </div>
    </HashRouter>
  );
};

const PublicLayout: React.FC<{ posts: Post[], lang: Language, toggleLang: () => void }> = ({ posts, lang, toggleLang }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-orange-600 p-1.5 rounded-lg">
                <Zap className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-gray-900 tracking-tight">समाचार<span className="text-orange-600">AI</span></span>
            </Link>

            <nav className="hidden md:flex space-x-8 text-sm font-medium">
              <Link to="/" className="text-gray-900 hover:text-orange-600">मुख्य पृष्ठ</Link>
              <Link to="/?category=tech" className="text-gray-600 hover:text-orange-600">तकनीक</Link>
              <Link to="/?category=lifestyle" className="text-gray-600 hover:text-orange-600">जीवनशैली</Link>
              <Link to="/?category=business" className="text-gray-600 hover:text-orange-600">व्यापार</Link>
            </nav>

            <div className="flex items-center gap-4">
              <button 
                onClick={toggleLang}
                className="text-xs font-bold border border-gray-200 px-2 py-1 rounded bg-gray-50 uppercase hover:bg-gray-100 transition-colors"
              >
                {lang === Language.HINDI ? 'English' : 'हिंदी'}
              </button>
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="खोजें..." 
                  className="pl-9 pr-4 py-2 border border-gray-200 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
              </div>
              <Link to="/admin" className="bg-gray-900 text-white p-2 rounded-full hover:bg-gray-800 transition-colors">
                <LayoutDashboard className="w-5 h-5" />
              </Link>
              <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t p-4 space-y-4">
            <Link to="/" className="block text-lg font-medium">मुख्य पृष्ठ</Link>
            <Link to="/?category=tech" className="block text-lg font-medium">तकनीक</Link>
            <Link to="/?category=lifestyle" className="block text-lg font-medium">जीवनशैली</Link>
            <Link to="/admin" className="block text-lg font-medium text-orange-600">डैशबोर्ड</Link>
          </div>
        )}
      </header>

      <div className="bg-orange-600 text-white overflow-hidden py-2 text-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-4">
          <span className="font-bold flex items-center gap-1 shrink-0">
            <TrendingUp className="w-4 h-4" /> ट्रेंडिंग:
          </span>
          <div className="whitespace-nowrap animate-[marquee_20s_linear_infinite]">
            <span className="mx-4">आज की बड़ी खबरें • एआई का बढ़ता प्रभाव • तकनीक और भारत • आत्मनिर्भर भारत के नए आयाम •</span>
          </div>
        </div>
      </div>

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<PublicHome posts={posts} />} />
          <Route path="/article/:id" element={<ArticleDetail posts={posts} />} />
        </Routes>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <Zap className="text-orange-500 w-8 h-8" />
              <span className="text-2xl font-bold tracking-tight">समाचार<span className="text-orange-500">AI</span></span>
            </Link>
            <p className="text-gray-400 max-w-sm">
              भारत का अग्रणी न्यूज़ और ब्लॉगिंग प्लेटफॉर्म, जो एआई की शक्ति से संचालित है। हम आपको तकनीक और स्थानीय समाचारों का बेहतरीन मिश्रण प्रदान करते हैं।
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">श्रेणियाँ</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/?category=tech" className="hover:text-white">तकनीक</Link></li>
              <li><Link to="/?category=business" className="hover:text-white">व्यापार</Link></li>
              <li><Link to="/?category=lifestyle" className="hover:text-white">जीवनशैली</Link></li>
              <li><Link to="/?category=health" className="hover:text-white">स्वास्थ्य</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">संपर्क करें</h4>
            <p className="text-gray-400 text-sm">info@samachar-ai.in</p>
            <div className="flex gap-4 mt-4">
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-600 transition-colors cursor-pointer"><Share2 className="w-4 h-4" /></div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-xs">
          © 2024 Samachar AI. सभी अधिकार सुरक्षित।
        </div>
      </footer>
    </>
  );
};

const AdminLayout: React.FC<{ posts: Post[], setPosts: React.Dispatch<React.SetStateAction<Post[]>> }> = ({ posts, setPosts }) => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white shrink-0 hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-2 border-b border-gray-800">
          <Zap className="text-orange-500 w-6 h-6" />
          <span className="text-xl font-bold">एडमिन पैनल</span>
        </div>
        <nav className="flex-grow p-4 space-y-2">
          <Link 
            to="/admin" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === '/admin' ? 'bg-orange-600' : 'hover:bg-gray-800'}`}
          >
            <LayoutDashboard className="w-5 h-5" /> डैशबोर्ड
          </Link>
          <Link 
            to="/admin/posts" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname.startsWith('/admin/posts') ? 'bg-orange-600' : 'hover:bg-gray-800'}`}
          >
            <FileText className="w-5 h-5" /> लेख (Posts)
          </Link>
          <Link 
            to="/admin/ai-lab" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === '/admin/ai-lab' ? 'bg-orange-600' : 'hover:bg-gray-800'}`}
          >
            <Zap className="w-5 h-5 text-yellow-400" /> AI लैब (Staging)
          </Link>
          <Link 
            to="/admin/media" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === '/admin/media' ? 'bg-orange-600' : 'hover:bg-gray-800'}`}
          >
            <ImageIcon className="w-5 h-5" /> मीडिया
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center font-bold">A</div>
            <div>
              <p className="text-sm font-bold">Admin</p>
              <p className="text-xs text-gray-400">Main Editor</p>
            </div>
          </div>
          <Link to="/" className="flex items-center gap-2 text-xs text-gray-400 mt-4 hover:text-white"><LogOut className="w-3 h-3" /> साइट पर जाएँ</Link>
        </div>
      </aside>

      <main className="flex-grow overflow-y-auto">
        <header className="bg-white border-b h-16 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-xl font-bold text-gray-800">
            {location.pathname === '/admin' ? 'डैशबोर्ड ओवरव्यू' : 
             location.pathname === '/admin/ai-lab' ? 'AI स्टेजिंग लैब' : 
             'कंटेंट मैनेजर'}
          </h2>
          <div className="flex items-center gap-4">
            <button className="text-gray-500 hover:text-gray-700"><Settings className="w-5 h-5" /></button>
            <Link to="/admin/editor/new" className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-orange-700 transition-colors">
              <Plus className="w-4 h-4" /> नया लेख लिखें
            </Link>
          </div>
        </header>

        <div className="p-8">
          <Routes>
            <Route path="/" element={<AdminDashboard posts={posts} setPosts={setPosts} />} />
            <Route path="/posts" element={<AdminDashboard posts={posts} setPosts={setPosts} />} />
            <Route path="/ai-lab" element={<AdminAILab onPostGenerated={(p) => setPosts([p, ...posts])} />} />
            <Route path="/editor/:id" element={<AdminEditor posts={posts} setPosts={setPosts} />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default App;

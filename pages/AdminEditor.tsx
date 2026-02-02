
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, 
  Eye, 
  Image as ImageIcon, 
  Bold, 
  Italic, 
  List, 
  ChevronLeft,
  Layout,
  Globe,
  Settings,
  Zap
} from 'lucide-react';
import { Post } from '../types';

interface AdminEditorProps {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

const AdminEditor: React.FC<AdminEditorProps> = ({ posts, setPosts }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Partial<Post>>({
    title: '',
    content: '',
    excerpt: '',
    category: 'तकनीक',
    status: 'draft',
    author: 'Admin'
  });

  useEffect(() => {
    if (id && id !== 'new') {
      const existing = posts.find(p => p.id === id);
      if (existing) setPost(existing);
    }
  }, [id, posts]);

  const handleSave = () => {
    if (id === 'new') {
      const newPost: Post = {
        ...post as Post,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
        coverImage: 'https://picsum.photos/800/450'
      };
      setPosts([newPost, ...posts]);
    } else {
      setPosts(posts.map(p => p.id === id ? { ...p, ...post } as Post : p));
    }
    alert('लेख सफलतापूर्वक सेव कर लिया गया है!');
    navigate('/admin/posts');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigate('/admin/posts')} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold">
          <ChevronLeft className="w-5 h-5" /> वापस जाएँ
        </button>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-6 py-2 border rounded-xl font-bold text-gray-600 hover:bg-gray-50">
            <Eye className="w-4 h-4" /> प्रीव्यू
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-8 py-2 bg-gray-900 text-white rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg"
          >
            <Save className="w-4 h-4" /> अभी सेव करें
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border space-y-6">
            <input 
              type="text" 
              value={post.title}
              onChange={(e) => setPost({...post, title: e.target.value})}
              placeholder="लेख का शीर्षक यहाँ लिखें (H1)..." 
              className="w-full text-4xl font-extrabold text-gray-900 border-none p-0 outline-none placeholder:text-gray-200"
            />
            
            <div className="flex items-center gap-2 p-2 border-y border-gray-100 bg-gray-50/50 -mx-8 px-8">
              <button className="p-2 hover:bg-white rounded transition-colors text-gray-600"><Bold className="w-5 h-5" /></button>
              <button className="p-2 hover:bg-white rounded transition-colors text-gray-600"><Italic className="w-5 h-5" /></button>
              <button className="p-2 hover:bg-white rounded transition-colors text-gray-600"><List className="w-5 h-5" /></button>
              <div className="w-px h-6 bg-gray-200 mx-2"></div>
              <button className="p-2 hover:bg-white rounded transition-colors text-gray-600 flex items-center gap-2 text-sm font-bold">
                <ImageIcon className="w-5 h-5" /> मीडिया जोड़ें
              </button>
            </div>

            <textarea 
              value={post.content}
              onChange={(e) => setPost({...post, content: e.target.value})}
              placeholder="अपनी कहानी हिंदी में शुरू करें..." 
              className="w-full h-[600px] border-none p-0 outline-none text-xl leading-relaxed text-gray-700 resize-none placeholder:text-gray-200"
            />
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border">
            <div className="flex items-center gap-2 mb-6 font-bold text-gray-900">
              <Globe className="w-5 h-5 text-orange-500" /> SEO सेटिंग्स (हिंदी)
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">मेटा टाइटल</label>
                <input 
                  type="text" 
                  value={post.seoTitle || post.title}
                  onChange={(e) => setPost({...post, seoTitle: e.target.value})}
                  className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500 text-sm" 
                  placeholder="गूगल में दिखने वाला शीर्षक..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">मेटा डिस्क्रिप्शन</label>
                <textarea 
                  value={post.seoDescription || post.excerpt}
                  onChange={(e) => setPost({...post, seoDescription: e.target.value, excerpt: e.target.value})}
                  className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500 text-sm h-24 resize-none" 
                  placeholder="लेख का संक्षिप्त विवरण..."
                />
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border">
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-4">
              <Layout className="w-4 h-4 text-orange-500" /> पब्लिश सेटिंग्स
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">स्थिति</label>
                <select 
                  value={post.status}
                  onChange={(e) => setPost({...post, status: e.target.value as 'draft' | 'published'})}
                  className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-gray-50 outline-none"
                >
                  <option value="draft">ड्राफ्ट</option>
                  <option value="published">प्रकाशित करें</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">श्रेणी</label>
                <select 
                  value={post.category}
                  onChange={(e) => setPost({...post, category: e.target.value})}
                  className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-gray-50 outline-none"
                >
                  <option>तकनीक</option>
                  <option>जीवनशैली</option>
                  <option>व्यापार</option>
                  <option>विज्ञान</option>
                </select>
              </div>
              <div className="pt-4 flex items-center gap-2 text-xs text-gray-400">
                <Settings className="w-3 h-3" /> अंतिम बार बदला गया: {new Date().toLocaleDateString('hi-IN')}
              </div>
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-3xl shadow-xl text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              {/* Fix: Added Zap to imports to resolve the missing name error */}
              <Zap className="w-16 h-16 text-yellow-400" />
            </div>
            <h4 className="font-bold mb-2">AI मदद चाहिए?</h4>
            <p className="text-xs text-gray-400 mb-4">हमारा AI आपके लिए लेख को बेहतर बना सकता है या सारांश लिख सकता है।</p>
            <button className="w-full bg-yellow-400 text-gray-900 font-bold py-2 rounded-xl text-sm hover:bg-yellow-500 transition-colors">
              AI स्टेजिंग लैब खोलें
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AdminEditor;

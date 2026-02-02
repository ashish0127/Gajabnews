
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Share2, MessageSquare, Bookmark, Zap, ArrowLeft, Twitter, Facebook } from 'lucide-react';
import { Post } from '../types';

interface ArticleDetailProps {
  posts: Post[];
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ posts }) => {
  const { id } = useParams<{ id: string }>();
  const post = posts.find(p => p.id === id);

  if (!post) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">लेख नहीं मिला!</h2>
        <Link to="/" className="text-orange-600 font-bold hover:underline">वापस होम पर जाएँ</Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-600 font-medium mb-8">
        <ArrowLeft className="w-4 h-4" /> वापस मुख्य पृष्ठ
      </Link>

      <header className="mb-12">
        <div className="flex items-center gap-4 mb-4 text-xs font-bold uppercase tracking-widest text-orange-600">
          <span className="bg-orange-50 px-2 py-1 rounded">{post.category}</span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-400 font-medium">{post.createdAt}</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-8 leading-[1.15]">
          {post.title}
        </h1>
        <div className="flex items-center justify-between border-y py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border-2 border-orange-500 overflow-hidden">
              <img src={`https://picsum.photos/seed/${post.author}/100`} alt={post.author} />
            </div>
            <div>
              <p className="font-bold text-gray-900">{post.author}</p>
              <p className="text-xs text-gray-500">सीनियर एडिटर</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full bg-gray-50 text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"><Twitter className="w-5 h-5" /></button>
            <button className="p-2 rounded-full bg-gray-50 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"><Facebook className="w-5 h-5" /></button>
            <button className="p-2 rounded-full bg-gray-50 text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-colors"><Bookmark className="w-5 h-5" /></button>
            <button className="p-2 rounded-full bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"><Share2 className="w-5 h-5" /></button>
          </div>
        </div>
      </header>

      <div className="rounded-[2.5rem] overflow-hidden mb-12 shadow-2xl">
        <img src={post.coverImage} alt={post.title} className="w-full object-cover" />
      </div>

      <div className="relative">
        {/* AI Summary Box */}
        {post.summary && (
          <div className="mb-10 bg-gradient-to-br from-orange-50 to-white p-8 rounded-3xl border-2 border-orange-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Zap className="w-24 h-24 text-orange-600" />
            </div>
            <div className="flex items-center gap-2 mb-4 text-orange-600 font-bold uppercase tracking-wider text-xs">
              <Zap className="w-4 h-4" /> AI सारांश (Quick Read)
            </div>
            <p className="text-lg font-medium text-gray-800 leading-relaxed italic">
              "{post.summary}"
            </p>
          </div>
        )}

        <div className="prose prose-lg max-w-none prose-orange prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-loose text-xl">
          {post.content.split('\n').map((para, i) => (
            <p key={i} className="mb-6">{para}</p>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-gray-100">
          <h3 className="text-2xl font-bold mb-8">प्रतिक्रिया दें</h3>
          <div className="flex gap-4">
             <div className="w-10 h-10 shrink-0 rounded-full bg-gray-200"></div>
             <textarea 
               placeholder="अपनी टिप्पणी यहाँ लिखें..." 
               className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-orange-500"
               rows={4}
             ></textarea>
          </div>
          <div className="flex justify-end mt-4">
            <button className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors">कमेंट पोस्ट करें</button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ArticleDetail;

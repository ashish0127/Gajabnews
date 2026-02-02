
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Zap } from 'lucide-react';
import { Post } from '../types';

interface PublicHomeProps {
  posts: Post[];
}

const PublicHome: React.FC<PublicHomeProps> = ({ posts }) => {
  const publishedPosts = posts.filter(p => p.status === 'published');
  const featuredPost = publishedPosts[0];
  const otherPosts = publishedPosts.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Featured Post */}
      {featuredPost && (
        <section className="relative rounded-3xl overflow-hidden bg-gray-900 aspect-[21/9] flex items-end">
          <img 
            src={featuredPost.coverImage} 
            alt={featuredPost.title} 
            className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          <div className="relative p-8 md:p-16 max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">विशेष लेख</span>
              <span className="text-gray-300 text-xs flex items-center gap-1"><Calendar className="w-3 h-3" /> {featuredPost.createdAt}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {featuredPost.title}
            </h1>
            <p className="text-gray-200 text-lg mb-8 line-clamp-2">
              {featuredPost.excerpt}
            </p>
            <Link 
              to={`/article/${featuredPost.id}`} 
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-bold hover:bg-orange-500 hover:text-white transition-all transform hover:-translate-y-1"
            >
              पूरा पढ़ें <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      )}

      {/* Categories & Latest Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              ताज़ा खबरें <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            </h2>
            <Link to="/archive" className="text-orange-600 font-bold text-sm hover:underline">सभी देखें</Link>
          </div>

          <div className="space-y-8">
            {otherPosts.map(post => (
              <article key={post.id} className="group flex flex-col md:flex-row gap-6 p-4 rounded-2xl hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100">
                <div className="md:w-1/3 shrink-0 rounded-xl overflow-hidden aspect-video">
                  <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-2 text-xs text-gray-500 font-medium uppercase tracking-wider">
                    <span className="text-orange-600">{post.category}</span>
                    <span>{post.createdAt}</span>
                  </div>
                  <Link to={`/article/${post.id}`}>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">{post.title}</h3>
                  </Link>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <User className="w-3 h-3" /> {post.author}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-12">
          {/* Newsletter */}
          <div className="bg-gray-900 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-orange-600/20 rounded-full blur-3xl"></div>
            <h3 className="text-2xl font-bold mb-4">जुड़े रहें!</h3>
            <p className="text-gray-400 text-sm mb-6">हर सुबह ताज़ा समाचार सीधे आपके इनबॉक्स में प्राप्त करें।</p>
            <div className="space-y-3">
              <input type="email" placeholder="आपका ईमेल" className="w-full bg-gray-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500" />
              <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl transition-colors">सब्सक्राइब करें</button>
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              लोकप्रिय श्रेणियाँ
            </h3>
            <div className="flex flex-wrap gap-2">
              {['तकनीक', 'विज्ञान', 'जीवनशैली', 'व्यापार', 'स्थानीय', 'राजनीति', 'खेल'].map(cat => (
                <Link key={cat} to={`/?category=${cat}`} className="bg-white border px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-50 hover:border-orange-500 transition-colors">
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          {/* Editor's Choice */}
          <div className="bg-white rounded-3xl border p-6">
            <h3 className="text-lg font-bold mb-6">संपादक की पसंद</h3>
            <div className="space-y-6">
              {publishedPosts.slice(0, 3).map((p, idx) => (
                <div key={p.id} className="flex gap-4">
                  <span className="text-3xl font-bold text-gray-100">{idx + 1}</span>
                  <div>
                    <Link to={`/article/${p.id}`} className="font-bold text-sm text-gray-900 hover:text-orange-600 line-clamp-2">{p.title}</Link>
                    <span className="text-xs text-gray-400 block mt-1">{p.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default PublicHome;

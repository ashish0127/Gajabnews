
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  MoreHorizontal, 
  Eye, 
  Edit2, 
  Trash2, 
  Filter,
  CheckCircle,
  Clock,
  ChevronRight
} from 'lucide-react';
import { Post } from '../types';

interface AdminDashboardProps {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ posts, setPosts }) => {
  const handleDelete = (id: string) => {
    if (window.confirm('क्या आप निश्चित रूप से इस लेख को हटाना चाहते हैं?')) {
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">कुल लेख</p>
          <p className="text-3xl font-bold mt-1">{posts.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">प्रकाशित</p>
          <p className="text-3xl font-bold mt-1 text-green-600">{posts.filter(p => p.status === 'published').length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">ड्राफ्ट</p>
          <p className="text-3xl font-bold mt-1 text-orange-600">{posts.filter(p => p.status === 'draft').length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">आज के व्यूज़</p>
          <p className="text-3xl font-bold mt-1">1,284</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="लेख खोजें..." 
              className="pl-10 pr-4 py-2 bg-gray-50 border-transparent rounded-lg focus:bg-white focus:ring-2 focus:ring-orange-500 text-sm w-full md:w-64"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200">
              <Filter className="w-4 h-4" /> फ़िल्टर
            </button>
            <select className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200 outline-none">
              <option>सभी श्रेणियाँ</option>
              <option>तकनीक</option>
              <option>व्यापार</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">लेख का शीर्षक</th>
                <th className="px-6 py-4">स्थिति (Status)</th>
                <th className="px-6 py-4">लेखक</th>
                <th className="px-6 py-4">तारीख</th>
                <th className="px-6 py-4 text-right">कार्रवाई</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {posts.map(post => (
                <tr key={post.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border">
                        <img src={post.coverImage} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 line-clamp-1">{post.title}</p>
                        <p className="text-xs text-gray-400">{post.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {post.status === 'published' ? (
                      <span className="flex items-center gap-1.5 text-green-600 bg-green-50 px-2.5 py-1 rounded-full text-xs">
                        <CheckCircle className="w-3 h-3" /> प्रकाशित
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full text-xs">
                        <Clock className="w-3 h-3" /> ड्राफ्ट
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{post.author}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{post.createdAt}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link 
                        to={`/article/${post.id}`} 
                        className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        title="देखें"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link 
                        to={`/admin/editor/${post.id}`} 
                        className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="एडिट"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(post.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="हटाएँ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t bg-gray-50/30 flex items-center justify-between text-sm text-gray-500">
          <span>दिखाया जा रहा है {posts.length} में से {posts.length}</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border rounded bg-white hover:bg-gray-50 disabled:opacity-50">पिछला</button>
            <button className="px-3 py-1 border rounded bg-white hover:bg-gray-50 disabled:opacity-50">अगला</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

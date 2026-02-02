
import React, { useState } from 'react';
import { 
  Zap, 
  Search, 
  Sparkles, 
  CheckCircle, 
  Loader2, 
  ImageIcon as LucideImageIcon, 
  Globe,
  ArrowRight,
  FileText
} from 'lucide-react';
import { generateHindiBlogContent, generateBlogImage } from '../geminiService';
import { Post } from '../types';

interface AdminAILabProps {
  onPostGenerated: (post: Post) => void;
}

const AdminAILab: React.FC<AdminAILabProps> = ({ onPostGenerated }) => {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState(0); // 0: Idle, 1: Content, 2: Image
  const [result, setResult] = useState<{
    title: string;
    content: string;
    summary: string;
    seoTitle: string;
    seoDescription: string;
    imageUrl?: string;
  } | null>(null);

  const handleGenerate = async () => {
    if (!topic) return;
    setIsGenerating(true);
    setStep(1);
    
    try {
      // 1. Generate Text
      const content = await generateHindiBlogContent(topic);
      
      // 2. Generate Image
      setStep(2);
      const imageUrl = await generateBlogImage(topic);
      
      setResult({ ...content, imageUrl: imageUrl || 'https://picsum.photos/800/450' });
    } catch (error) {
      console.error('Error generating post:', error);
      alert('कंटेंट जनरेट करने में त्रुटि हुई। कृपया दोबारा प्रयास करें।');
    } finally {
      setIsGenerating(false);
      setStep(0);
    }
  };

  const savePost = () => {
    if (!result) return;
    const newPost: Post = {
      id: Date.now().toString(),
      title: result.title,
      content: result.content,
      excerpt: result.seoDescription,
      summary: result.summary,
      coverImage: result.imageUrl || 'https://picsum.photos/800/450',
      author: 'AI Generator',
      category: 'एआई-जनरेटेड',
      createdAt: new Date().toISOString().split('T')[0],
      status: 'draft',
      seoTitle: result.seoTitle,
      seoDescription: result.seoDescription
    };
    onPostGenerated(newPost);
    setResult(null);
    setTopic('');
    alert('लेख सफलतापूर्वक ड्राफ्ट में सेव कर लिया गया है!');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-gray-900 to-indigo-900 rounded-[2.5rem] p-12 text-white shadow-2xl relative overflow-hidden mb-12">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Sparkles className="w-48 h-48" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-yellow-400 p-2 rounded-xl">
              <Zap className="text-gray-900 w-8 h-8" />
            </div>
            <h2 className="text-3xl font-extrabold uppercase tracking-tight">AI स्टेजिंग लैब</h2>
          </div>
          <p className="text-indigo-100 text-lg mb-8 max-w-xl">
            केवल एक कीवर्ड या यूआरएल पेस्ट करें, और जेमिनी 3 प्रो के साथ एक पूर्ण 600+ शब्दों का हिंदी ब्लॉग लेख और आकर्षक कवर इमेज प्राप्त करें।
          </p>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="विषय या यूआरएल यहाँ लिखें (उदा. भारत में डिजिटल क्रांति)..." 
                className="w-full bg-white/10 border-white/20 text-white rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-yellow-400 outline-none backdrop-blur-md placeholder:text-gray-400"
              />
            </div>
            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !topic}
              className="bg-yellow-400 text-gray-900 font-bold px-8 py-4 rounded-2xl hover:bg-yellow-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {step === 1 ? 'लिख रहा हूँ...' : 'इमेज बना रहा हूँ...'}
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" /> जनरेट करें
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {result && (
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <CheckCircle className="text-green-500 w-6 h-6" /> परिणाम तैयार है!
            </h3>
            <div className="flex gap-4">
              <button 
                onClick={() => setResult(null)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                हटाएँ
              </button>
              <button 
                onClick={savePost}
                className="bg-gray-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-orange-600 transition-colors"
              >
                ड्राफ्ट के रूप में सेव करें
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="aspect-video rounded-3xl overflow-hidden bg-gray-100 border relative group">
                <img src={result.imageUrl} alt="AI Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 border border-white/20">
                    <LucideImageIcon className="w-4 h-4" /> इमेज जनरेटेड
                  </span>
                </div>
              </div>
              <div className="p-6 bg-gray-50 rounded-3xl">
                <p className="text-xs font-bold text-gray-400 uppercase mb-2">SEO मेटा टाइटल</p>
                <p className="font-bold text-gray-800">{result.seoTitle}</p>
                <hr className="my-4" />
                <p className="text-xs font-bold text-gray-400 uppercase mb-2">SEO डिस्क्रिप्शन</p>
                <p className="text-gray-600 text-sm leading-relaxed">{result.seoDescription}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold text-orange-500 uppercase mb-2">हेडलाइन</p>
                <h4 className="text-2xl font-extrabold text-gray-900 leading-tight">{result.title}</h4>
              </div>
              <div>
                <p className="text-xs font-bold text-orange-500 uppercase mb-2">AI सारांश</p>
                <p className="p-4 bg-orange-50 rounded-2xl border-l-4 border-orange-400 text-gray-800 italic font-medium">
                  {result.summary}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-orange-500 uppercase mb-2">लेख का हिस्सा</p>
                <div className="prose prose-sm prose-orange line-clamp-6 text-gray-600 leading-relaxed">
                  {result.content.split('\n').slice(0, 5).join('\n')}...
                </div>
              </div>
              <button className="w-full border-2 border-gray-900 text-gray-900 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-900 hover:text-white transition-colors">
                <FileText className="w-5 h-5" /> पूरा लेख पढ़ें
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAILab;

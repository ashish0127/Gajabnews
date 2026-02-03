
export type UserRole = 'Administrator' | 'Editor' | 'Author' | 'Contributor' | 'Subscriber';
export type CommentStatus = 'Pending' | 'Approved' | 'Spam' | 'Trash';
export type Sentiment = 'Positive' | 'Neutral' | 'Negative';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  avatar: string;
  status: 'Active' | 'Pending' | 'Suspended';
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  parentId?: string; // For nested replies
  author: string;
  email: string;
  website?: string;
  content: string;
  status: CommentStatus;
  sentiment: Sentiment;
  likes: number;
  createdAt: string;
  ip: string;
  browser: string;
}

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  summary: string;
  category: string;
  author: string;
  authorId?: string;
  coverImage: string;
  createdAt: string;
  status: 'published' | 'draft' | 'scheduled';
  publishDate?: string;
  seoTitle: string;
  seoDescription: string;
  views: number;
  slug?: string;
  authorBio?: string;
  faqSchema?: string;
  articleSchema?: string;
}

export type Category = 'तकनीक' | 'व्यापार' | 'लाइफस्टाइल' | 'मनोरंजन' | 'स्थानीय';

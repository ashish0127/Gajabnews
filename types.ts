
export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  summary: string;
  coverImage: string;
  category: string;
  author: string;
  createdAt: string;
  status: 'published' | 'draft';
  seoTitle?: string;
  seoDescription?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'editor';
}

export enum Language {
  HINDI = 'hi',
  ENGLISH = 'en'
}

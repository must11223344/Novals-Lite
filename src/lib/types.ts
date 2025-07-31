
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Story {
  id: string;
  title: string;
  description: string;
  content: string;
  author: string;
  authorAvatarUrl: string;
  thumbnailUrl: string;
  category: string;
  tags: string[];
  createdAt: string;
  reads: number;
}

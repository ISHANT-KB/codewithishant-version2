export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  cover_url?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogListItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  cover_url?: string;
  published: boolean;
  created_at: string;
}
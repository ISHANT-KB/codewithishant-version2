export interface Cheatsheet {
  id: string;
  title: string;
  slug: string;
  category: string;
  description?: string | null;
  content: string;
}

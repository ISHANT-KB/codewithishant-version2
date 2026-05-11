export interface Topic {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string | null;
}

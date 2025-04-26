export type Post = {
  id: number;
  md5: string;
  title: string;
  filename: string;
  ext: string;
  description: string;
  tags: string[];
  categories: string[];
  trans: boolean;
  created_at: Date;
  updated_at: Date;
  source: string[];
};

export type Suggestions = {
  name: string;
};

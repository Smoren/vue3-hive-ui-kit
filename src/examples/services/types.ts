export type PostAuthor = {
  id: number;
  owner_id: number;
  name: string;
  usage_count: number;
  created_at: number;
  updated_at: number | null;
};

export type PostTag = {
  id: number;
  owner_id: number;
  name: string;
  usage_count: number;
  post_id: number;
  created_at: number;
  updated_at: number | null;
};

export type PostItem = {
  id: number;
  owner_id: number;
  signer_id: number | null;
  from_id: number;
  date: number;
  name: string | null;
  text: string;
  text_preview: string;
  category: string;
  authors: PostAuthor[];
  tags: PostTag[];
  hidden: boolean;
  created_at: number;
  updated_at: number | null;
};

export type PostList = PostItem[];

export type FilterConfig = {
  command: string[],
  authors: string[],
  tags: string[],
  categories: string[],
  date_from: number | null,
  date_until: number | null
};

export type SimilarPost = {
  post_id: number;
  owner_id: number;
  name: string | null;
  category: string | null;
  link: string;
  keywords_count: number;
  keywords: string[];
  weight: number;
};

export type SimilarPostList = SimilarPost[];

export type ChoiceOption = {
  name: string;
  value: string;
}

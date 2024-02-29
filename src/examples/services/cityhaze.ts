import type { FilterConfig, SimilarPostList, PostList, PostAuthor, PostTag } from '../services/types';
import { http } from '@/examples/api/init';

export const mainApi = {
  getPostList: async (ownerId: number, filterConfig: FilterConfig): Promise<PostList> => {
    try {
      return await http.post<PostList>({
        path: `/wall/post/${ownerId}`,
        data: filterConfig,
      });
    } catch (err) {
      console.error(`getTextList API error: ${err}`);
      throw err;
    }
  },

  getSimilarPostList: async (ownerId: number, id: number): Promise<SimilarPostList> => {
    try {
      return await http.get<SimilarPostList>({
        path: `/wall/similar/${ownerId}/${id}`,
        affectCounter: false,
      });
    } catch (err) {
      console.error(`getSimilarTexts API error: ${err}`);
      throw err;
    }
  },

  getFormulaPredictions: async (query: string): Promise<string[]> => {
    try {
      return await http.get<string[]>({
        path: `/wall/word?query=${query}`,
        affectCounter: false,
      });
    } catch (err) {
      console.error(`getFormulaPredictions API error: ${err}`);
      throw err;
    }
  },

  getAuthorList: async (ownerId: number, query: string): Promise<PostAuthor[]> => {
    try {
      return await http.get<PostAuthor[]>({
        path: `/wall/author/${ownerId}?query=${query}`,
        affectCounter: false,
      });
    } catch (err) {
      console.error(`getAuthorList API error: ${err}`);
      throw err;
    }
  },

  getTagList: async (ownerId: number, query: string): Promise<PostTag[]> => {
    try {
      return await http.get<PostTag[]>({
        path: `/wall/tag/${ownerId}?query=${query}`,
        affectCounter: false,
      });
    } catch (err) {
      console.error(`getTagList API error: ${err}`);
      throw err;
    }
  },
};

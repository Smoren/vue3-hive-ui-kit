import type { PostAuthor, PostItem, PostTag } from '../services/types';

export const getDate = (ts: number): string => {
  const date = new Date(ts * 1000);
  return date.toLocaleDateString('ru') + ' ' + date.toLocaleTimeString('ru').slice(0, 5);
};

export const getAuthorVkLink = (author: PostAuthor): string => {
  return author.id > 0 ? `https://vk.com/id${author.id}` : `https://vk.com/club${Math.abs(author.id)}`;
};

export const getTagVkLink = (tag: PostTag): string => {
  return `https://vk.com/wall${tag.owner_id}?q=%23${encodeURI(tag.name)}`;
};

export const getPostVkLink = (postItem: PostItem): string => {
  return `https://vk.com/wall${postItem.owner_id}_${postItem.id}`;
};

export const toBase64 = (str: string) => window.btoa(encodeURIComponent(str));

export const fromBase64 = (str: string) => decodeURIComponent(window.atob(str));

export const getDefaultOwnerId = (): number => {
  return -74962618;
};

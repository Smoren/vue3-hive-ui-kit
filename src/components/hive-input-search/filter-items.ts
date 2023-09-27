export const filterItems = <T>(items: T, query: string, fields: string[], caseSensitive = false): T => {
  const result = [];

  if (items && Array.isArray(items)) {
    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];
      let searchCache = '';
      for (const field of fields) {
        searchCache = searchCache.concat(item[field]);
      }
      if (!caseSensitive) {
        searchCache = searchCache.toLowerCase();
      }
      if (searchCache.includes(query.toLowerCase())) {
        result.push(item);
      }
    }
  }

  return result as T;
}

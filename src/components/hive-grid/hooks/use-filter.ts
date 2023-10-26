export const filterItems = <T>(items: T, query: string, fields: string[], caseSensitive = false): T => {
  const result = [];

  if (items && Array.isArray(items)) {
    if (!caseSensitive) {
      query = query.toLowerCase();
    }

    const words = query.replace(/[ \t\n]+/, ' ').split(' ');

    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];
      let searchCache = '';
      for (const field of fields) {
        searchCache = searchCache.concat(` ${item[field]}`);
      }
      if (!caseSensitive) {
        searchCache = searchCache.toLowerCase();
      }

      const matchCount = words
        .map((word) =>
          Number(
            searchCache
              .toLowerCase()
              .replace(/[ \t\n]+/, ' ')
              .split(' ')
              .reduce((partialSum: boolean, a: string) => partialSum || a.startsWith(word), false),
          ),
        )
        .reduce((partialSum, a) => partialSum + a, 0);
      if (matchCount === words.length) {
        result.push(item);
      }
    }
  }

  return result as T;
};

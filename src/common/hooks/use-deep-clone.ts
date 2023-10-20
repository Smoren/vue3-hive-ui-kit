export const useDeepClone = <T>(obj: T) => JSON.parse(JSON.stringify(obj)) as T;

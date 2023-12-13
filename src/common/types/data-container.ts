export type DataContainerNodeWithRaw<T> = Record<string, unknown> & {
  key: string;
  value: unknown;
  title: string;
  visible: boolean;
  raw: T;
  prev: DataContainerNode<T> | null;
  next: DataContainerNode<T> | null;
};

export type DataContainerNode<T> = Omit<DataContainerNodeWithRaw<T>, 'raw'> & {
  raw: DataContainerNodeWithRaw<T> | null;
};

export type DataContainer<T> = Record<string, DataContainerNode<T>>;

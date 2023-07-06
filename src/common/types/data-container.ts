interface DataContainerNodeWithRaw<T> extends Record<string, unknown> {
  key: string;
  value: unknown;
  title: string;
  visible: boolean;
  raw: T;
  prev: DataContainerNode<T> | null;
  next: DataContainerNode<T> | null;
}

interface DataContainerNode<T> extends Record<string, unknown> {
  key: string;
  value: unknown;
  title: string;
  visible: boolean;
  raw: DataContainerNodeWithRaw<T> | null;
  prev: DataContainerNode<T> | null;
  next: DataContainerNode<T> | null;
}

type DataContainer<T> = Record<string, DataContainerNode<T>>;

export type { DataContainer, DataContainerNode, DataContainerNodeWithRaw };

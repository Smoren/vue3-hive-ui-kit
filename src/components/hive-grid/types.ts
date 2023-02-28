interface ColumnWithoutChildren {
  id: string;
  children: undefined;
  field: string;
  title: string;
  width?: string;
  cell: string;
  colspan: number;
}

interface ColumnWithChildren {
  id: string;
  children?: ColumnWithoutChildren[] | ColumnWithChildren[];
  title: string;
  field: undefined;
  width: undefined;
  cell: undefined;
  colspan: number;
}

interface ColgroupItem {
  id: string;
  field: string;
  width: string;
  cell: string;
}

export type { ColumnWithoutChildren, ColgroupItem, ColumnWithChildren };

import type { ComputedRef } from 'vue';

export type ColumnWithoutChildren = {
  id: string;
  children: undefined;
  field: string;
  fields: string[];
  title: string;
  width?: string;
  cell: string;
  colspan: number;
};

export type ColumnWithChildren = {
  id: string;
  children?: ColumnWithoutChildren[] | ColumnWithChildren[];
  title: string;
  field: undefined;
  fields: undefined;
  width: undefined;
  cell: undefined;
  colspan: number;
};

export type ColgroupItem = {
  id: string;
  field: string;
  width: string;
  cell: string;
};

export type CssClassConfig = string | string[] | ((row: Record<string, unknown>) => string[] | string);

export type GridColumns = {
  field: string;
  fields?: string[];
  title: string;
  width?: number;
  editable?: boolean;
  editType?:
    | 'text'
    | 'number'
    | 'date'
    | 'dropdown-list'
    | 'date-range'
    | 'date-time-range'
    | 'time-range'
    | 'date-time'
    | 'time'
    | 'textarea'
    | 'autocomplete'
    | 'checkbox'
    | 'multiselect';
  sortable?: boolean;
  sort?: (a: object, b: object) => number;
  viewType?: 'text' | 'list' | 'checkbox' | 'file' | 'function';
  separator?: string;
  options?: string[];
  inEditMode?: boolean;
  cssClass?: CssClassConfig;
  function?: (...args: any) => void; // TODO переименовать логично
};

export type GridConfig = {
  columns: GridColumns[];
  dataItems: ComputedRef<object[]>;
  rowCssClass?: CssClassConfig;
};

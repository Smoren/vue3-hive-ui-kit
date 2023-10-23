import type { ColgroupItem, ColumnWithChildren, ColumnWithoutChildren } from '@/components/hive-grid/types';

export default function getColgroupItem(column: ColumnWithoutChildren | ColumnWithChildren, result: ColgroupItem[]) {
  if (!column.children) {
    result.push({
      id: '1',
      field: column.field as string,
      width: column.width ?? '200px',
      cell: column.cell as string,
    });
  } else {
    const children = column.children;

    for (let i = 0; i < children.length; i++) {
      // @ts-ignore
      getColgroupItem(children[i], result);
    }
  }
}

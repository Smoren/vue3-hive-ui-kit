import COLUMN_WIDTH from '@hive/components/hive-grid/constants';
import type {
  ColgroupItem,
  ColumnWithChildren,
  ColumnWithoutChildren,
} from '@hive/components/hive-grid/types';

export default function getColgroupItem(
  column: ColumnWithoutChildren | ColumnWithChildren,
  result: ColgroupItem[]
) {
  if (!column.children) {
    result.push({
      id: '1',
      field: column.field as string,
      width: column.width ?? COLUMN_WIDTH,
      cell: column.cell as string,
    });
  } else {
    const children = column.children;

    for (let i = 0; i < children.length; i++) {
      getColgroupItem(children[i], result);
    }
  }
}

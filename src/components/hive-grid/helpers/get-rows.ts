import type {
  ColumnWithChildren,
  ColumnWithoutChildren,
} from '@hive/components/hive-grid/types';

export default function getRows(
  columns: ColumnWithoutChildren[] | ColumnWithChildren[]
) {
  const result = {};

  const getRow = (
    clmns: ColumnWithoutChildren[] | ColumnWithChildren[],
    result: Record<string, Array<ColumnWithChildren | ColumnWithoutChildren>>,
    i: number
  ) => {
    for (let j = 0; j < clmns.length; j++) {
      const column = clmns[j];

      if (!result[i]) {
        result[i] = [
          { ...column, id: '1', colspan: column.children?.length || 1 },
        ];
      } else {
        result[i].push({
          ...column,
          id: '1',
          colspan: column.children?.length || 1,
        });
      }

      if (column.children) {
        const nextI = i + 1;
        getRow(column.children, result, nextI);
      }
    }
  };

  getRow(columns, result, 0);

  return result;
}

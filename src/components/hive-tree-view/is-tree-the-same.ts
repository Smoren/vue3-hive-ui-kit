import { TreeView } from '@/ui-kit/src/components/hive-tree-view/hive-tree-view-type';

export const isTreeTheSame = (treeNew: TreeView[], treeOld: TreeView[]): boolean => {
  if (treeNew.length !== treeOld.length) {
    return false;
  }
  let flag: boolean = true;
  for (let i = 0; i < treeNew.length; i++) {
    if (treeNew[i].children.length !== treeOld[i].children.length) {
      return false;
    }
    if (treeNew[i].id !== treeOld[i].id || treeNew[i].name !== treeOld[i].name) {
      return false;
    }
    if (treeNew[i].children.length !== 0) {
      flag = flag && isTreeTheSame(treeNew[i].children, treeOld[i].children);
    }
  }
  return flag;
};

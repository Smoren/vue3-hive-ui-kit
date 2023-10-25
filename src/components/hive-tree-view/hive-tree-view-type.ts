export interface TreeView {
  img?: string | TreeViewImg;
  name: string;
  children: TreeView[];
  checked?: boolean;
  choosen?: boolean;
  subdivision_id?: string;
  id?: string;
  classifier_id?: string;
  hive_tree_node_id?: symbol;
}

interface TreeViewImg {
  src: string;
  width: number;
  height: number;
}

export interface ChoosenNode {
  node: TreeView | null;
}

export interface TreeImg {
  key: string;
  value: string;
  img: string;
}

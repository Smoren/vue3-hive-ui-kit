export interface TreeView {
  img?: string | TreeViewImg;
  name: string;
  children: TreeView[];
  checked?: boolean;
  choosen?: boolean;
}

interface TreeViewImg {
  src: string;
  width: number;
  height: number;
}

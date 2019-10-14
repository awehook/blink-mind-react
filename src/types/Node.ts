export type NodeKeyType = string;

//节点 Drag and drop 时 Drop 区域的位置
export type DropDirType = "in" | "before" | "after";

export enum FocusItemMode {
  Normal,
  PopupMenu,
  EditingContent,
  EditingDesc
}

export enum NodeWidgetDirection {
  LEFT, // 从右向左
  RIGHT, // 从左向右
  ROOT // root
}

export enum NodeStyle {
  PRIMARY_HAS_BORDER_NORMAL_NO_BORDER,
  ALL_HAS_BORDER
}

export interface INodeRecordType {
  key: NodeKeyType;
}

export interface INodeModel {
  getKey(): NodeKeyType;
}

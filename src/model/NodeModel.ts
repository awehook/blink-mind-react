export type NodeKeyType = string ;

export enum FocusItemMode {
  Normal,
  PopupMenu,
  Editing
}

export interface INodeRecordType {
  key: NodeKeyType;
}

export interface INodeModel {
  getKey(): NodeKeyType;
}

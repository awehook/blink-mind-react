export type NodeKeyType = string;

export interface INodeRecordType {
  key: NodeKeyType;
}

export interface INodeModel {
  getKey(): NodeKeyType;
}

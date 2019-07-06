import { INodeModel, NodeKeyType, INodeRecordType } from "./NodeModel";
import { Record, List } from "immutable";

interface MindNodeLayoutRecordType {
  x: number;
  y: number;
  boundingHeight: number;
}

const defaultMindNodeLayoutRecord: MindNodeLayoutRecordType = {
  x: 0,
  y: 0,
  boundingHeight: 0
};

// @ts-ignore
export class MindNodeLayoutModel extends Record(defaultMindNodeLayoutRecord) {
  constructor() {
    super();
  }
}

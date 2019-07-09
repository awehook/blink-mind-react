import { INodeModel, NodeKeyType, INodeRecordType } from "./NodeModel";
import { Record, List } from "immutable";
import { MindNodeLayoutModel } from "./MindNodeLayoutModel";

interface IMindNodeRecordType extends INodeRecordType {
  parentKey: NodeKeyType;
  content: string;
  subItemKeys?: List<NodeKeyType>;
  collapse: boolean;
  layout: MindNodeLayoutModel;
}

const defaultMindNodeRecord: IMindNodeRecordType = {
  key: null,
  parentKey: null,
  content: null,
  subItemKeys: List(),
  collapse: false,
  layout: new MindNodeLayoutModel()
};

// @ts-ignore
export class MindNodeModel extends Record(defaultMindNodeRecord)
  implements INodeModel {
  constructor() {
    super();
  }
  getKey(): NodeKeyType {
    return this.get("key");
  }

  getParentKey(): NodeKeyType {
    return this.get("parentKey");
  }

  getContent(): any {
    return this.get("content");
  }

  getSubItemKeys(): List<NodeKeyType> {
    return this.get("subItemKeys");
  }

  getCollapse(): boolean {
    return this.get("collapse");
  }

  getLayout(): MindNodeLayoutModel {
    return this.get("layout");
  }

  updateLayout(obj: any): MindNodeModel {
    return this.update("layout", layout => layout.merge(obj));
  }

  static createWith(obj: any): MindNodeModel {
    let node = new MindNodeModel();
    node = node.merge({
      key: obj.key,
      parentKey: obj.parentKey,
      content: obj.content,
      subItemKeys: List(obj.subItemKeys),
      collapse: obj.collapse
    });
    return node;
  }
}

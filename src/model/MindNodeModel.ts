import { INodeModel, NodeKeyType, INodeRecordType } from "../types/Node";
import { Record, List } from "immutable";
// @ts-ignore
import MarkdownSerializer from './encoding/MarkdownSerializer';

interface IMindNodeRecordType extends INodeRecordType {
  parentKey: NodeKeyType;
  content: any;
  desc: any;
  subItemKeys?: List<NodeKeyType>;
  collapse: boolean;
}

const defaultMindNodeRecord: IMindNodeRecordType = {
  key: null,
  parentKey: null,
  content: null,
  desc: null,
  subItemKeys: List(),
  collapse: false
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

  getDesc(): any {
    return this.get("desc");
  }

  getSubItemKeys(): List<NodeKeyType> {
    return this.get("subItemKeys");
  }

  getCollapse(): boolean {
    return this.get("collapse");
  }

  contentToString() {
    let content  = this.getContent();
    if(typeof content === 'string')
      return content;
    else {
      return MarkdownSerializer.serialize(content);
    }
  }

  descToString() {
    let desc  = this.getDesc();
    if(desc=== null)
      return null;
    if(typeof desc === 'string')
      return desc;
    else {
      return MarkdownSerializer.serialize(desc);
    }
  }

  toString()  {
    return this.toJSON().toString();
  }

  toJSON() {
    return {
      key: this.getKey(),
      parentKey: this.getParentKey(),
      subItemKeys: this.getSubItemKeys(),
      collapse: this.getCollapse(),
      content: this.contentToString(),
      desc: this.descToString(),
    }
  }

  static create(
    key: NodeKeyType,
    parentKey = null,
    content = "new node",
    subItemKeys = List([]),
    collapse = false
  ): MindNodeModel {
    return MindNodeModel.createWith({
      key,
      parentKey,
      content,
      subItemKeys,
      collapse
    });
  }

  static createWith(obj: any): MindNodeModel {
    let node = new MindNodeModel();
    node = node.merge({
      key: obj.key,
      parentKey: obj.parentKey,
      content: obj.content,
      desc: obj.desc,
      subItemKeys: List(obj.subItemKeys),
      collapse: obj.collapse
    });
    return node;
  }
}

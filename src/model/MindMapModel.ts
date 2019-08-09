import { NodeKeyType } from "./NodeModel";
import { Record, Map } from "immutable";
import { MindNodeModel } from "./MindNodeModel";
type MindMapRecordType = {
  rootItemKey: NodeKeyType;
  editorRootItemKey: NodeKeyType;
  itemMap: Map<NodeKeyType, MindNodeModel>;
  focusItemKey: NodeKeyType;
};

const defaultMindMapRecord: MindMapRecordType = {
  rootItemKey: null,
  editorRootItemKey: null,
  itemMap: Map(),
  focusItemKey: null
};

export class MindMapModel extends Record(defaultMindMapRecord) {
  constructor() {
    super();
  }
  getRootItemKey(): NodeKeyType {
    return this.get("rootItemKey");
  }

  getEditorRootItemKey(): NodeKeyType {
    return this.get("editorRootItemKey");
  }

  getEditorRootItem(): MindNodeModel {
    return this.getItemMap().get(this.getEditorRootItemKey());
  }

  getItemMap(): Map<NodeKeyType, MindNodeModel> {
    return this.get("itemMap");
  }

  getFocusItemKey(): NodeKeyType {
    return this.get("focusItemKey");
  }

  getItem(key: NodeKeyType): MindNodeModel {
    return this.getItemMap().get(key);
  }

  getParentItem(key: NodeKeyType): MindNodeModel {
    let item = this.getItem(key);
    if (item.getParentKey()) return this.getItem(item.getParentKey());
    return null;
  }

  getItemVisualLevel(key: NodeKeyType): number {
    let item = this.getItem(key);
    let level = 0;
    while (item && item.getKey() !== this.getEditorRootItemKey()) {
      level++;
      item = this.getParentItem(item.getKey());
    }
    return level;
  }

  static createWith(obj: any): MindMapModel {
    let model = new MindMapModel();
    model = model.merge({
      rootItemKey: obj.rootItemKey,
      editorRootItemKey: obj.editorRootItemKey
    });
    model = model.withMutations(model => {
      obj.items.forEach(itemObj => {
        model.update("itemMap", itemMap =>
          itemMap.set(itemObj.key, MindNodeModel.createWith(itemObj))
        );
      });
    });
    return model;
  }
}

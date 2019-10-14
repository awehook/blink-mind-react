import { FocusItemMode, NodeKeyType } from "../types/Node";
import { Map, Record } from "immutable";
import { MindNodeModel } from "./MindNodeModel";

type MindMapRecordType = {
  rootItemKey: NodeKeyType;
  editorRootItemKey: NodeKeyType;
  itemMap: Map<NodeKeyType, MindNodeModel>;
  focusItemKey: NodeKeyType;
  focusItemMode: FocusItemMode;
  dropAreaKey: string;
};

const defaultMindMapRecord: MindMapRecordType = {
  rootItemKey: null,
  editorRootItemKey: null,
  itemMap: Map(),
  focusItemKey: null,
  focusItemMode: FocusItemMode.Normal,
  dropAreaKey: null
};

export class MindMapModel extends Record(defaultMindMapRecord) {
  constructor() {
    super();
  }
  getRootItemKey(): NodeKeyType {
    return this.get("rootItemKey");
  }

  getRootItem(): MindNodeModel {
    return this.getItem(this.getRootItemKey());
  }

  getDropAreaKey(): string {
    return this.get("dropAreaKey");
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

  getFocusItemMode(): FocusItemMode {
    return this.get("focusItemMode");
  }

  getEditingContentItemKey(): NodeKeyType {
    if (this.get("focusItemMode") !== FocusItemMode.EditingContent) return null;
    return this.getFocusItemKey();
  }

  getEditingDescItemKey(): NodeKeyType {
    if (this.get("focusItemMode") !== FocusItemMode.EditingDesc) return null;
    return this.getFocusItemKey();
  }

  getPopupMenuItemKey(): NodeKeyType {
    if (this.get("focusItemMode") !== FocusItemMode.PopupMenu) return null;
    return this.getFocusItemKey();
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

  // serialize() {
  //   return JSON.stringify(this);
  // }

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

import { NodeKeyType } from "./NodeModel";
import { Record, Map } from "immutable";
import { MindNodeModel } from "./MindNodeModel";
import { MindDiagramLayoutConfig } from "blink-mind-react";
type MindMapRecordType = {
  rootItemKey: NodeKeyType;
  editorRootItemKey: NodeKeyType;
  itemMap: Map<NodeKeyType, MindNodeModel>;
};

const defaultMindMapRecord: MindMapRecordType = {
  rootItemKey: null,
  editorRootItemKey: null,
  itemMap: Map()
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

  getItem(key: NodeKeyType): MindNodeModel {
    return this.getItemMap().get(key);
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

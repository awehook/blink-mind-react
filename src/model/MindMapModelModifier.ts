import { MindNodeModel } from "./MindNodeModel";
import { MindMapModel } from "./MindMapModel";
import { NodeKeyType } from "./NodeModel";
import { uuidv4 } from "../util";
import { Stack } from "immutable";
import { Value } from "slate";

export enum OpType {
  UNDO,
  REDO,
  TOGGLE_COLLAPSE,
  SET_ITEM_CONTENT,
  FOCUS_ITEM,
  ADD_CHILD,
  ADD_SIBLING,
  DELETE_NODE
}

type OpFunctionType = (
  model: MindMapModel,
  itemKey: NodeKeyType,
  arg?
) => MindMapModel;

export class MindMapModelModifier {
  static undoStack: Stack<MindMapModel> = Stack();
  static redoStack: Stack<MindMapModel> = Stack();
  static opMap = new Map<OpType, OpFunctionType>([
    [OpType.UNDO, MindMapModelModifier.undo],
    [OpType.REDO, MindMapModelModifier.redo],
    [OpType.TOGGLE_COLLAPSE, MindMapModelModifier.toggleCollapse],
    [OpType.SET_ITEM_CONTENT, MindMapModelModifier.setItemContent],
    [OpType.FOCUS_ITEM, MindMapModelModifier.focusItem],
    [OpType.ADD_CHILD, MindMapModelModifier.addChild],
    [OpType.ADD_SIBLING,MindMapModelModifier.addSibling],
    [OpType.DELETE_NODE, MindMapModelModifier.deleteNode]
  ]);

  static op(
    model: MindMapModel,
    opType: OpType,
    itemKey: NodeKeyType,
    arg
  ): MindMapModel {
    if (opType === OpType.DELETE_NODE) console.log(opType);
    if (MindMapModelModifier.opMap.has(opType)) {
      let opFunc = MindMapModelModifier.opMap.get(opType);
      let res = opFunc(model, itemKey, arg);
      if (
        opType !== OpType.UNDO &&
        opType !== OpType.REDO &&
        opType !== OpType.FOCUS_ITEM &&
        opType !== OpType.SET_ITEM_CONTENT
      ) {
        MindMapModelModifier.undoStack = MindMapModelModifier.undoStack.push(
          res
        );
      }
      console.log(res);
      return res;
    }
    return model;
  }

  static undo(model: MindMapModel): MindMapModel {
    if (MindMapModelModifier.undoStack.size > 1) {
      model = MindMapModelModifier.popUndoStack();
      MindMapModelModifier.pushRedoStack(model);
      model = MindMapModelModifier.undoStack.peek();
    }
    return model;
  }

  static redo(model: MindMapModel): MindMapModel {
    if (MindMapModelModifier.redoStack.size > 0) {
      model = MindMapModelModifier.popRedoStack();
      MindMapModelModifier.pushUndoStack(model);
    }
    return model;
  }

  static pushUndoStack(model: MindMapModel) {
    MindMapModelModifier.undoStack = MindMapModelModifier.undoStack.push(model);
  }

  static popUndoStack(): MindMapModel {
    let model = MindMapModelModifier.undoStack.peek();
    MindMapModelModifier.undoStack = MindMapModelModifier.undoStack.pop();
    return model;
  }

  static pushRedoStack(model: MindMapModel) {
    MindMapModelModifier.redoStack = MindMapModelModifier.redoStack.push(model);
  }

  static popRedoStack(): MindMapModel {
    let model = MindMapModelModifier.redoStack.peek();
    MindMapModelModifier.redoStack = MindMapModelModifier.redoStack.pop();
    return model;
  }

  static toggleCollapse(
    model: MindMapModel,
    itemKey: NodeKeyType
  ): MindMapModel {
    let item = model.getItem(itemKey);
    if (item.getSubItemKeys().size !== 0) {
      item = item.merge({
        collapse: !item.getCollapse()
      });
      model = MindMapModelModifier.setItem(model, item);
    }
    return model;
  }

  static setItem(model: MindMapModel, item: MindNodeModel): MindMapModel {
    return model.update("itemMap", itemMap => itemMap.set(item.getKey(), item));
  }

  static focusItem(model: MindMapModel, itemKey: NodeKeyType) {
    let item = model.getItem(itemKey);
    if (item) {
      if (itemKey !== model.getFocusItemKey())
        model = model.set("focusItemKey", itemKey);
    }
    return model;
  }

  static setItemContent(
    model: MindMapModel,
    itemKey: NodeKeyType,
    content: any
  ) {
    let item = model.getItem(itemKey);
    let needPush = false;
    if (item) {
      if (MindMapModelModifier.undoStack.size === 0) {
        MindMapModelModifier.pushUndoStack(model);
      }
      if (item.getContent() instanceof Value) {
        let oldContent = item.getContent() as Value;
        needPush = oldContent.document !== content.document;
      }

      item = item.merge({ content: content });
      model = MindMapModelModifier.setItem(model, item);
    }
    model = model.set("focusItemKey", itemKey);
    if (needPush) MindMapModelModifier.pushUndoStack(model);
    return model;
  }

  static addChild(model: MindMapModel, itemKey: NodeKeyType) {
    let item = model.getItem(itemKey);
    if (item) {
      let child = MindNodeModel.create(uuidv4());
      child = child.set("parentKey", item.getKey());
      item = item
        .set("collapse", false)
        .update("subItemKeys", subItemKeys => subItemKeys.push(child.getKey()));
      model = model.update("itemMap", itemMap =>
        itemMap.set(item.getKey(), item).set(child.getKey(), child)
      );
      model = model.set("focusItemKey", child.getKey());
    }
    return model;
  }

  static addSibling(model: MindMapModel, itemKey: NodeKeyType) {
    let item = model.getItem(itemKey);
    if (itemKey === model.getRootItemKey()) return model;
    if (item) {
      let sibling = MindNodeModel.create(uuidv4());
      sibling = sibling.set("parentKey", item.getParentKey());
      let pItem = model.getParentItem(itemKey);
      pItem = pItem.update("subItemKeys", subItemKeys =>
        subItemKeys.insert(subItemKeys.indexOf(itemKey) + 1, sibling.getKey())
      );
      model = model.update("itemMap", itemMap =>
        itemMap.set(pItem.getKey(), pItem).set(sibling.getKey(), sibling)
      );
    }
    return model;
  }
  static deleteNode(model: MindMapModel, itemKey: NodeKeyType) {
    console.log(`deleteItem ${itemKey}`);
    if (itemKey === model.getRootItemKey()) {
      return model;
    }
    let item = model.getItem(itemKey);
    let pItem = model.getItem(item.getParentKey());

    let idx = pItem.getSubItemKeys().indexOf(itemKey);
    pItem = pItem.update("subItemKeys", subItemKeys => subItemKeys.delete(idx));

    model = model
      .set("focusItemKey", item.getParentKey())
      .update("itemMap", itemMap => {
        let deleteKeys = MindMapModelModifier.getAllSubItemKeys(model, itemKey);
        itemMap = itemMap.set(pItem.key, pItem);
        itemMap = itemMap.withMutations(map => {
          map = map.delete(itemKey);
          for (let dkey of deleteKeys) {
            map = map.delete(dkey);
          }
          return map;
        });
        return itemMap;
      });
    return model;
  }

  static getAllSubItemKeys(model: MindMapModel, itemKey: NodeKeyType) {
    let item = model.getItem(itemKey);

    let res = [];
    if (item.getSubItemKeys().size > 0) {
      let subItemKeys = item.getSubItemKeys().toArray();
      res.push(subItemKeys);
      for (let subKey of subItemKeys) {
        res.push(MindMapModelModifier.getAllSubItemKeys(model, subKey));
      }
    }
    return res;
  }
}

import { MindNodeModel } from "./MindNodeModel";
import { MindMapModel } from "./MindMapModel";
import { FocusItemMode, NodeKeyType } from "../types/Node";
import { uuidv4 } from "../util";
import { Stack } from "immutable";
import { Value } from "slate";
import { NodeRelationship } from "./NodeRelationship";
import debug from "debug";

const log = debug('model:modifier');
export enum OpType {
  UNDO = 1,
  REDO,
  TOGGLE_COLLAPSE,
  SET_ITEM_CONTENT,
  SET_ITEM_DESC,
  FOCUS_ITEM,
  START_EDITING_DESC,
  START_EDITING_CONTENT,
  END_EDITING,
  SET_POPUP_MENU_ITEM_KEY,
  ADD_CHILD,
  ADD_SIBLING,
  DELETE_NODE,
  DRAG_AND_DROP
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
    [OpType.SET_ITEM_DESC, MindMapModelModifier.setItemDesc],
    [OpType.FOCUS_ITEM, MindMapModelModifier.focusItem],
    [OpType.START_EDITING_CONTENT, MindMapModelModifier.startEditingContent],
    [OpType.START_EDITING_DESC,MindMapModelModifier.startEditingDesc],
    [OpType.END_EDITING,MindMapModelModifier.endEditing],
    [OpType.SET_POPUP_MENU_ITEM_KEY, MindMapModelModifier.setPopupMenuItemKey],
    [OpType.ADD_CHILD, MindMapModelModifier.addChild],
    [OpType.ADD_SIBLING, MindMapModelModifier.addSibling],
    [OpType.DELETE_NODE, MindMapModelModifier.deleteNode],
    [OpType.DRAG_AND_DROP, MindMapModelModifier.dragAndDrop]
  ]);

  static op(
    model: MindMapModel,
    opType: OpType,
    itemKey: NodeKeyType,
    arg
  ): MindMapModel {
    if (opType === OpType.DELETE_NODE) log(opType);
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
    // log(`set focus item key ${itemKey}`);
    if (itemKey !== model.getFocusItemKey()) {
      model = model.set("focusItemKey", itemKey);
    }
    if (itemKey === null) {
      model = model.set("focusItemMode", FocusItemMode.Normal);
    }
    return model;
  }

  static setFocusItemMode(
    model: MindMapModel,
    mode: FocusItemMode
  ) {
    if (mode !== model.getFocusItemMode())
      model = model.set("focusItemMode", mode);
    return model;
  }

  static setFocusItemKey(
    model: MindMapModel,
    key: NodeKeyType
  ) {
    if (key !== model.getFocusItemKey())
      model = model.set("focusItemKey", key);
    return model;
  }

  static setPopupMenuItemKey(model: MindMapModel, itemKey: NodeKeyType) {
    log('set popup menu item key ' ,itemKey);
    if (itemKey !== model.getPopupMenuItemKey()) {
      if (itemKey !== model.getFocusItemKey())
        model = model.set("focusItemKey", itemKey);
      if (model.get("focusItemMode") !== FocusItemMode.PopupMenu)
        model = model.set("focusItemMode", FocusItemMode.PopupMenu);
    }
    return model;
  }

  static setItemContent(
    model: MindMapModel,
    itemKey: NodeKeyType,
    content: any
  ) : MindMapModel {
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

  static setItemDesc(model: MindMapModel, itemKey: NodeKeyType, desc: any) : MindMapModel{
    let item = model.getItem(itemKey);
    let needPush = false;
    if (item) {
      if (MindMapModelModifier.undoStack.size === 0) {
        MindMapModelModifier.pushUndoStack(model);
      }
      if (item.getContent() instanceof Value) {
        let oldContent = item.getContent() as Value;
        needPush = oldContent.document !== desc.document;
      }

      item = item.merge({ desc });
      model = MindMapModelModifier.setItem(model, item);
    }
    model = model
      .set("focusItemKey", itemKey)
      .set("focusItemMode", FocusItemMode.EditingDesc);
    if (needPush) MindMapModelModifier.pushUndoStack(model);
    return model;
  }

  static startEditingContent(model: MindMapModel, itemKey: NodeKeyType) {
    log('set editing item key ', itemKey);
    if (itemKey !== model.getEditingContentItemKey()) {
      model = MindMapModelModifier.setFocusItemKey(model,itemKey);
      model = MindMapModelModifier.setFocusItemMode(model,FocusItemMode.EditingContent);
    }
    return model;
  }

  static startEditingDesc(
    model: MindMapModel,
    itemKey: NodeKeyType,
  ) : MindMapModel {
    let item = model.getItem(itemKey);
    if (item) {
      let desc = item.getDesc();
      if (desc===null || desc===undefined) {
        model = MindMapModelModifier.setItemDesc(model,itemKey,"");
      }
    }
    if (itemKey !== model.getEditingDescItemKey()) {
      model = MindMapModelModifier.setFocusItemKey(model, itemKey);
      model = MindMapModelModifier.setFocusItemMode(model, FocusItemMode.EditingDesc);
    }
    return model;
  }

  static endEditing(
    model: MindMapModel,
    itemKey: NodeKeyType,
  ) : MindMapModel {
    model = MindMapModelModifier.setFocusItemMode(model,FocusItemMode.Normal);
    return  model;
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
      model = MindMapModelModifier.startEditingContent(model, child.getKey());
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
      model = MindMapModelModifier.startEditingContent(model, sibling.getKey());
    }
    return model;
  }
  static deleteNode(model: MindMapModel, itemKey: NodeKeyType) {
    log('deleteItem ',itemKey);
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

  // 是否在一个分支上
  static getRelation(
    model: MindMapModel,
    srcKey: NodeKeyType,
    dstKey: NodeKeyType
  ): NodeRelationship {
    let srcItem = model.getItem(srcKey);
    let dstItem = model.getItem(dstKey);
    if (srcItem && dstItem) {
      if (srcItem.getParentKey() == dstItem.getParentKey())
        return NodeRelationship.Sibling;
      let pItem = srcItem;
      while (pItem.getParentKey()) {
        if (pItem.getParentKey() === dstItem.getKey())
          return NodeRelationship.Descendant;
        pItem = model.getParentItem(pItem.getKey());
      }
      pItem = dstItem;
      while (pItem.getParentKey()) {
        if (pItem.getParentKey() === srcItem.getKey())
          return NodeRelationship.Ancestor;
        pItem = model.getParentItem(pItem.getKey());
      }
    }
    return NodeRelationship.None;
  }

  static dragAndDrop(
    model: MindMapModel,
    srcKey: NodeKeyType,
    dstKey: NodeKeyType
  ) {
    if (
      srcKey === model.getEditorRootItemKey() ||
      srcKey === dstKey ||
      MindMapModelModifier.getRelation(model, srcKey, dstKey) ===
        NodeRelationship.Ancestor
    )
      return model;

    let srcItem = model.getItem(srcKey);
    let dstItem = model.getItem(dstKey);
    if (srcItem.getParentKey() === dstKey) return model;

    let srcParentKey = srcItem.getParentKey();
    let srcParentItem = model.getItem(srcParentKey);
    let srcParentSubItemKeys = srcParentItem.getSubItemKeys();
    let index = srcParentSubItemKeys.indexOf(srcKey);

    srcParentSubItemKeys = srcParentSubItemKeys.delete(index);

    let dstSubItemKeys = dstItem.getSubItemKeys();
    dstSubItemKeys = dstSubItemKeys.push(srcKey);
    model = model.withMutations(m => {
      m.setIn(["itemMap", srcParentKey, "subItemKeys"], srcParentSubItemKeys)
        .setIn(["itemMap", srcKey, "parentKey"], dstKey)
        .setIn(["itemMap", dstKey, "subItemKeys"], dstSubItemKeys)
        .setIn(["itemMap", dstKey, "collapse"], false);
    });
    return model;
  }
}

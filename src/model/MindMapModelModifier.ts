import { MindNodeModel } from "./MindNodeModel";
import { MindDiagramLayoutConfig, MindMapModel } from "blink-mind-react";
import { NodeKeyType } from "./NodeModel";

export enum OpType {
  TOGGLE_COLLAPSE
}

type OpFunctionType = (
  model: MindMapModel,
  itemKey: NodeKeyType,
  arg?
) => MindMapModel;

export class MindMapModelModifier {
  static opMap = new Map<OpType, OpFunctionType>([
    [OpType.TOGGLE_COLLAPSE, MindMapModelModifier.toggleCollapse]
  ]);
  static op(
    model: MindMapModel,
    opType: OpType,
    itemKey: NodeKeyType,
    arg
  ): MindMapModel {
    if (MindMapModelModifier.opMap.has(opType)) {
      let opFunc = MindMapModelModifier.opMap.get(opType);
      return opFunc(model, itemKey, arg);
    }
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

  // static layout(model: MindMapModel, rect:ClientRect, layoutConfig: MindDiagramLayoutConfig): MindMapModel {
  //   let rootItem = model.getEditorRootItem();
  //   rootItem = rootItem.updateLayout({x: rect.width/4, y: rect.height/2});
  //
  // }

  // static measureRect(model: MindMapModel, itemKey: NodeKeyType, layoutConfig: MindDiagramLayoutConfig): MindNodeModel {
  //   let item = model.getItem(itemKey);
  //   if(item.getSubItemKeys().size === 0 || item.getCollapse()){
  //     item.updateLayout({
  //       boundingHeight:
  //     })
  //   }
  // }
}

import { MindNodeModel } from "./MindNodeModel";
import { MindDiagramLayoutConfig, MindMapModel } from "blink-mind-react";
import {NodeKeyType} from './NodeModel';

export class MindMapModelModifier {
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

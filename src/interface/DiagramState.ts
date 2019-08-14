import { MindMapModel } from "../model/MindMapModel";
import { DiagramConfig } from "../config/DiagramConfig";
import { OpType } from "../model/MindMapModelModifier";
import { NodeKeyType } from "../model/NodeModel";

export interface DiagramState {
  mindMapModel: MindMapModel;
  zoom: number;
  config: DiagramConfig;
  setMindMapModel(model: MindMapModel);
  setZoom(zoom: number);
  op(opType: OpType, key: NodeKeyType, arg?);
}

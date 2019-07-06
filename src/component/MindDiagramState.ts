import { MindMapModel } from "../model/MindMapModel";
import { DiagramConfig } from "../config/DiagramConfig";
import { OpType } from "../model/MindMapModelModifier";
import { NodeKeyType } from "../model/NodeModel";

export interface MindDiagramState {
  mindMapModel: MindMapModel;
  offsetX: number;
  offsetY: number;
  zoom: number;
  config: DiagramConfig
  setMindMapModel(model: MindMapModel);
  setOffset(x: number, y: number);
  setZoom(zoom: number);
  op(opType: OpType, key: NodeKeyType,arg?);
}

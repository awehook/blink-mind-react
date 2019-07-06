import { MindMapModel } from "../model/MindMapModel";

export interface MindDiagramState {
  mindMapModel: MindMapModel;
  offsetX: number;
  offsetY: number;
  zoom: number;
  setMindMapModel(model: MindMapModel);
  setOffset(x: number, y: number);
  setZoom(zoom: number);
}

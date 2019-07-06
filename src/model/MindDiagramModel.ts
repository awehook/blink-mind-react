import { MindMapModel } from "./MindMapModel";

export type MindDiagramLayoutConfig = {
  hMargin: number;
  vMargin: number;
};

const defaultLayoutConfig: MindDiagramLayoutConfig = {
  hMargin: 30,
  vMargin: 30
};

export class MindDiagramModel {
  mindMapModel: MindMapModel;
  layoutConfig: MindDiagramLayoutConfig;

  offsetX: number;
  offsetY: number;
  zoom: number;
  //gridSize: number;

  constructor(
    mindMapModel: MindMapModel,
    layoutConfig: MindDiagramLayoutConfig = defaultLayoutConfig
  ) {
    this.mindMapModel = mindMapModel;
    this.layoutConfig = layoutConfig;
    this.offsetX = 0;
    this.offsetY = 0;
    this.zoom = 1;
  }
}

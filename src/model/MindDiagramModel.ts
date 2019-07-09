import { MindMapModel } from "./MindMapModel";
import { defaultDiagramConfig, DiagramConfig } from "../config/DiagramConfig";

export class MindDiagramModel {
  mindMapModel: MindMapModel;
  config?: DiagramConfig;
  zoom: number;
  //gridSize: number;

  constructor(mindMapModel: MindMapModel, config: DiagramConfig = {}) {
    this.mindMapModel = mindMapModel;
    this.config = Object.assign(defaultDiagramConfig, config);
    this.zoom = 1;
  }
}

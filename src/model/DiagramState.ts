import { MindMapModel } from "./MindMapModel";
import { defaultDiagramConfig, DiagramConfig } from "../config/DiagramConfig";
import { MindMapModelModifier, OpType } from "./MindMapModelModifier";
import { NodeKeyType } from "../types/Node";
import debug from "debug";
const log = debug("model:DiagramState");

export class DiagramState {
  mindMapModel: MindMapModel;
  config: DiagramConfig;

  constructor(mindMapModel: MindMapModel, config: DiagramConfig) {
    this.mindMapModel = mindMapModel;
    this.config = config;
  }

  static setMindMapModel(
    state: DiagramState,
    model: MindMapModel
  ): DiagramState {
    return new DiagramState(model, state.config);
  }

  static op(
    state: DiagramState,
    opType: OpType,
    key: NodeKeyType,
    arg?
  ): DiagramState {
    log(`op:${OpType[opType]}`);
    if (!key && opType !== OpType.FOCUS_ITEM)
      key = state.mindMapModel.getFocusItemKey();
    log("start:", state.mindMapModel);
    let mindMapModel = MindMapModelModifier.op(
      state.mindMapModel,
      opType,
      key,
      arg
    );
    log("end:", mindMapModel);
    return new DiagramState(mindMapModel, state.config);
  }
  static createWith(mindMapModel, config): DiagramState {
    config = Object.assign(defaultDiagramConfig, config);
    let diagramState = new DiagramState(mindMapModel, config);
    return diagramState;
  }
}

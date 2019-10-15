import { MindMapModel } from "./MindMapModel";
import { defaultDiagramConfig, DiagramConfig } from "../config/DiagramConfig";
import { MindMapModelModifier, OpType } from "./MindMapModelModifier";
import { NodeKeyType } from "../types/Node";
import debug from "debug";
import { ThemeConfig } from "../config/ThemeConfigs";
import { Stack } from "immutable";
const log = debug("model:DiagramState");

export class DiagramState {
  private readonly mindMapModel: MindMapModel;
  private readonly config: DiagramConfig;

  undoStack: Stack<MindMapModel> = Stack();
  redoStack: Stack<MindMapModel> = Stack();

  constructor(mindMapModel: MindMapModel, config: DiagramConfig) {
    this.mindMapModel = mindMapModel;
    this.config = config;
    this.undoStack = Stack();
    this.redoStack = Stack();
  }

  getThemeConfig(): ThemeConfig {
    return this.config.themeConfigs[this.config.theme];
  }

  getMindMapModel(): MindMapModel {
    return this.mindMapModel;
  }

  getConfig(): DiagramConfig {
    return this.config;
  }

  static setMindMapModel(
    state: DiagramState,
    model: MindMapModel
  ): DiagramState {
    return new DiagramState(model, state.config);
  }

  static setConfig(state: DiagramState, config: DiagramConfig): DiagramState {
    return new DiagramState(state.getMindMapModel(), config);
  }

  static op(
    state: DiagramState,
    opType: OpType,
    key: NodeKeyType,
    arg?
  ): DiagramState {
    log(`op:${OpType[opType]}`);
    if (!key && opType !== OpType.FOCUS_ITEM)
      key = state.getMindMapModel().getFocusItemKey();
    log("start:", state.getMindMapModel());
    let mindMapModel = MindMapModelModifier.op(
      state.getMindMapModel(),
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

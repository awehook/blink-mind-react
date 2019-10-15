import { MindMapModel } from './MindMapModel';
import { defaultDiagramConfig, DiagramConfig } from '../config/DiagramConfig';
import { MindMapModelModifier, OpType } from './MindMapModelModifier';
import { NodeKeyType } from '../types/Node';
import debug from 'debug';
import { ThemeConfig } from '../config/ThemeConfigs';
import { Stack, Record } from 'immutable';
const log = debug('model:DiagramState');

type DiagramStateRecordType = {
  model: MindMapModel;
  config: DiagramConfig;
  allowUndo: boolean;
  undoStack: Stack<MindMapModel>;
  redoStack: Stack<MindMapModel>;
};

const defaultRecord: DiagramStateRecordType = {
  model: null,
  config: null,
  allowUndo: true,
  undoStack: Stack(),
  redoStack: Stack()
};

const DiagramStateRecord = Record(defaultRecord);

export class DiagramState {
  _immutable: Record<DiagramStateRecordType>;

  constructor(immutable: Record<DiagramStateRecordType>) {
    this._immutable = immutable;
  }

  getImmutable(): Record<DiagramStateRecordType> {
    return this._immutable;
  }

  getThemeConfig(): ThemeConfig {
    return this.getConfig().themeConfigs[this.getConfig().theme];
  }

  getModel(): MindMapModel {
    return this.getImmutable().get('model');
  }

  getConfig(): DiagramConfig {
    return this.getImmutable().get('config');
  }

  getAllowUndo(): boolean {
    return this.getImmutable().get('allowUndo');
  }

  getUndoStack(): Stack<MindMapModel> {
    return this.getImmutable().get('undoStack');
  }
  getRedoStack(): Stack<MindMapModel> {
    return this.getImmutable().get('redoStack');
  }

  static undo(state: DiagramState): DiagramState {
    if (!state.getAllowUndo()) {
      return state;
    }
    const undoStack = state.getUndoStack();
    const newModel = undoStack.peek();
    if (!newModel) return state;
    log('undo');
    return DiagramState.set(state, {
      model: newModel,
      undoStack: undoStack.shift(),
      redoStack: state.getRedoStack().push(state.getModel())
    });
  }

  static redo(state: DiagramState): DiagramState {
    if (!state.getAllowUndo()) {
      return state;
    }
    const redoStack = state.getRedoStack();
    const newModel = redoStack.peek();
    if (!newModel) return state;

    log('redo');
    return DiagramState.set(state, {
      model: newModel,
      redoStack: redoStack.shift(),
      undoStack: state.getUndoStack().push(state.getModel())
    });
  }

  static set(state: DiagramState, obj: Object) {
    log('set start', state.getImmutable());
    const newInnerState = state.getImmutable().withMutations(innerState => {
      innerState.merge(obj);
    });
    log('set end', newInnerState);
    return new DiagramState(newInnerState);
  }

  static setModel(state: DiagramState, model: MindMapModel): DiagramState {
    const innerState = state.getImmutable().set('model', model);
    return new DiagramState(innerState);
  }

  static setConfig(state: DiagramState, config: DiagramConfig): DiagramState {
    const innerState = state.getImmutable().set('config', config);
    return new DiagramState(innerState);
  }

  static op(
    state: DiagramState,
    opType: OpType,
    key: NodeKeyType,
    arg?
  ): DiagramState {
    log(`op:${OpType[opType]}`);
    if (!key && opType !== OpType.FOCUS_ITEM)
      key = state.getModel().getFocusItemKey();
    log('start:', state.getModel(), state.getUndoStack());
    const { model, needPushUndo } = MindMapModelModifier.op(
      state.getModel(),
      opType,
      key,
      arg
    );
    if (state.getModel() === model) return state;
    let innerState;
    innerState = state.getImmutable().set('model', model);
    if (needPushUndo) {
      const undoStack = state.getUndoStack().push(state.getModel());
      innerState = innerState.set('undoStack', undoStack);
    }

    log('end:', model, innerState.get('undoStack'));
    return new DiagramState(innerState);
  }
  static createWith(model, config): DiagramState {
    config = Object.assign(defaultDiagramConfig, config);
    const innerState = new DiagramStateRecord({
      model,
      config
    });
    return new DiagramState(innerState);
  }
}

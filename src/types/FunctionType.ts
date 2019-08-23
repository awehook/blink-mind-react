import { DiagramState } from "../model/DiagramState";
import { OpType } from "../model/MindMapModelModifier";
import { NodeKeyType } from "../model/NodeModel";

export type OnChangeFunction = (diagramState: DiagramState) => void;

export type OpFunction = (opType: OpType, nodeKey: NodeKeyType, arg?) => void;

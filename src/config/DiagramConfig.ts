export enum DiagramLayoutDirection {
  LEFT_TO_RIGHT,
  RIGHT_TO_LEFT,
  LEFT_AND_RIGHT
}
export type  DiagramConfig = {
  direction?: DiagramLayoutDirection
  hMargin?: number;
  vMargin?: number;
  theme?: string;
  rootItemStyle?: any;
  primaryItemStyle?: any;
  normalItemStyle?: any;
}

export const defaultDiagramConfig = {
  direction: DiagramLayoutDirection.LEFT_TO_RIGHT,
  hMargin: 30,
  vMargin: 10,
  theme: "theme-orange",
  rootItemStyle: {
    fontSize: "24px",
    borderRadius: "10px",
    padding: "10px 25px"
  },
  primaryItemStyle: {
    fontSize: "16px",
    borderRadius: "6px",
    padding: "6px 15px"
  }
};

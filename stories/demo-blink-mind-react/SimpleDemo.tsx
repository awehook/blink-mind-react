import * as React from "react";
import {
  DiagramWidget,
  MindDiagramModel,
  MindMapModel,
  DiagramConfig
} from "blink-mind-react";

import "./demo.css";

function Demo() {
  let mindModel = MindMapModel.createWith({
    rootItemKey: "root",
    editorRootItemKey: "root",
    items: [
      { key: "root", content: "MainTopic", subItemKeys: ["sub1", "sub2"] },
      {
        key: "sub1",
        parentKey: "root",
        content: "SubTopic",
        subItemKeys: [],
        collapse: true
      },
      {
        key: "sub2",
        parentKey: "root",
        content: "SubTopic",
        subItemKeys: []
      }
    ]
  });
  let diagramConfig : DiagramConfig = {
    hMargin: 10
  };
  let diagramModel = new MindDiagramModel(mindModel,diagramConfig);
  return <DiagramWidget diagramModel={diagramModel} />;
}

export default Demo;

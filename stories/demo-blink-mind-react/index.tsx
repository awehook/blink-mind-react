import * as React from "react";
import {
  MindDiagramWidget,
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
      { key: "root", content: "my plan", subItemKeys: ["sub1", "sub2"] },
      {
        key: "sub1",
        parentKey: "root",
        content: "learn front end",
        subItemKeys: ["sub1_1", "sub1_2"],
        collapse: true
      },
      {
        key: "sub2",
        parentKey: "root",
        content: "learn server tech",
        subItemKeys: ["sub2_1", "sub2_2"]
      },
      {
        key: "sub1_1",
        parentKey: "sub1",
        content: "learn webpack",
        subItemKeys: ["sub1_1_1", "sub1_1_2"]
      },
      { key: "sub1_2", content: "learn react", parentKey: "sub1" },
      { key: "sub2_1", content: "learn mysql", parentKey: "sub2" },
      { key: "sub2_2", content: "learn docker", parentKey: "sub2" },
      { key: "sub1_1_1", content: "learn webpack plugin", parentKey: "sub1_1" },
      { key: "sub1_1_2", content: "learn webpack loader", parentKey: "sub1_1" }
    ]
  });
  let diagramModel = new MindDiagramModel(mindModel);
  return (
    <MindDiagramWidget diagramModel={diagramModel} />
  );
}

export default Demo;

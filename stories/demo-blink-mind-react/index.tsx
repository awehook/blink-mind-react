import * as React from "react";
import {
  MindDiagramWidget,
  MindDiagramModel,
  MindMapModel
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
        content: "learn front end",
        subItemKeys: ["sub1_1", "sub1_2"],
        collapse: true
      },
      {
        key: "sub2",
        content: "learn server tech",
        subItemKeys: ["sub2_1", "sub2_2"]
      },
      {
        key: "sub1_1",
        content: "learn webpack",
        subItemKeys: ["sub1_1_1", "sub1_1_2"]
      },
      { key: "sub1_2", content: "learn react" },
      { key: "sub2_1", content: "learn mysql" },
      { key: "sub2_2", content: "learn docker" },
      { key: "sub1_1_1", content: "learn webpack plugin" },
      { key: "sub1_1_2", content: "learn webpack loader" }
    ]
  });
  let diagramModel = new MindDiagramModel(mindModel);
  return (
    <div className="demo">
      <MindDiagramWidget diagramModel={diagramModel} />
    </div>
  );
}

export default Demo;

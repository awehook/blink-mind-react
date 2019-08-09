import * as React from "react";
import {
  MindDiagramWidget,
  MindDiagramModel,
  MindMapModel,
  DiagramConfig
} from "blink-mind-react";

import "./demo.css";

function generateSubItemKeys(key:string,subItemCount: number) {
  return Array.from({length: subItemCount}, (x,i) => i+1).map((i)=>`${key}_sub${i}`);
}

function generateExampleItems(
  level: number,
  collapseLevel: number,
  parentKey: string,
  subItemCount: number = 2,
  curLevel: number = 0
) {
  let res = [];
  if (curLevel === level) {
    for(let i = 1; i<=subItemCount; i++) {
      res = res.concat({
        key: `${parentKey}_sub${i}`,
        parentKey,
        content: `${parentKey}_sub${i}`,
        subItemKeys: [],
        collapse: curLevel >= collapseLevel
      })
    }
  } else {
    for(let i = 1; i<=subItemCount; i++) {
      res = res.concat(
        {
          key: `${parentKey}_sub${i}`,
          parentKey,
          content: `${parentKey}_sub${i}`,
          subItemKeys: generateSubItemKeys(`${parentKey}_sub${i}`,subItemCount),
          collapse: curLevel >= collapseLevel
        });
      res = res.concat(generateExampleItems(level, collapseLevel,`${parentKey}_sub${i}`,subItemCount,curLevel+1));
    }
  }
  if(curLevel===0) {
    res = res.concat({
      key: parentKey, content: "root", subItemKeys: generateSubItemKeys(parentKey, subItemCount)
    });
  }
  return res;
}

function Demo() {
  let items = generateExampleItems(2,1,'root',4);
  let mindModel = MindMapModel.createWith({
    rootItemKey: "root",
    editorRootItemKey: "root",
    // items: [
    //   { key: "root", content: "my plan", subItemKeys: ["sub1", "sub2"] },
    //   {
    //     key: "sub1",
    //     parentKey: "root",
    //     content: "learn front end",
    //     subItemKeys: ["sub1_1", "sub1_2"],
    //     collapse: true
    //   },
    //   {
    //     key: "sub2",
    //     parentKey: "root",
    //     content: "learn server tech",
    //     subItemKeys: ["sub2_1", "sub2_2"]
    //   },
    //   {
    //     key: "sub1_1",
    //     parentKey: "sub1",
    //     content: "learn webpack",
    //     subItemKeys: ["sub1_1_1", "sub1_1_2"]
    //   },
    //   { key: "sub1_2", content: "learn react", parentKey: "sub1" },
    //   { key: "sub2_1", content: "learn mysql", parentKey: "sub2" },
    //   { key: "sub2_2", content: "learn docker", parentKey: "sub2" },
    //   { key: "sub1_1_1", content: "learn webpack plugin", parentKey: "sub1_1" },
    //   { key: "sub1_1_2", content: "learn webpack loader", parentKey: "sub1_1" }
    // ]
    items: items
  });
  let diagramConfig : DiagramConfig = {
    hMargin: 10
  };
  let diagramModel = new MindDiagramModel(mindModel,diagramConfig);
  return <MindDiagramWidget diagramModel={diagramModel} />;
}

export default Demo;

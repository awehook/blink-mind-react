import { MindMapModel } from "../MindMapModel";
import MarkdownSerializer from "./MarkdownSerializer";
import { MindNodeModel } from "../MindNodeModel";
import debug from 'debug'
const log = debug('model:encoding');

export function convertMindMapModelToRaw(model:MindMapModel) {
  let obj: any = {};
  obj.rootItemKey = model.getRootItemKey();
  obj.items = model.getItemMap();
  let title = model.getRootItem().getContent();
  if(typeof title === 'string')
    obj.title = title;
  else
    obj.title = MarkdownSerializer.serialize(title);
  return obj;
}

export function convertRawToMindMapModel(obj) : MindMapModel {
  let model = new MindMapModel();
  model = model.merge({
    rootItemKey: obj.rootItemKey,
    editorRootItemKey: obj.rootItemKey
  });
  log('convertRawToMindMapModel');
  model = model.withMutations(model => {
    Object.keys(obj.items).forEach(key=>{
      let itemObj = obj.items[key];
      model.update("itemMap", itemMap =>
        itemMap.set(itemObj.key, MindNodeModel.createWith(itemObj))
      );
    });
  });
  return model;
}

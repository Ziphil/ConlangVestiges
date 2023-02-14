//

import {
  AvendiaTemplateManager
} from "../generator/transformer";


const manager = new AvendiaTemplateManager();

manager.registerElementRule(true, true, (transformer, document) => {
  return document.createDocumentFragment();
});

manager.registerTextRule(true, (transformer, document, text) => {
  const content = text.data;
  const self = document.createTextNode(content);
  return self;
});

export default manager;
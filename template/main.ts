//

import {
  AvendiaTemplateManager
} from "../generator/transformer";


const manager = new AvendiaTemplateManager();

manager.registerElementRule("page", "", (transformer, document, element) => {
  const self = document.createDocumentFragment();
  const number = +element.getAttribute("number");
  transformer.variables.number = number;
  self.appendChild(transformer.apply(element, "page"));
  return self;
});

manager.registerElementRule("header", "page", (transformer, document, element) => {
  const self = document.createDocumentFragment();
  self.appendElement("header", (self) => {
    self.addClassName("header");
    self.appendElement("div", (self) => {
      self.addClassName("header-main");
      self.appendElement("div", (self) => {
        self.addClassName("header-left");
      });
      self.appendElement("h1", (self) => {
        self.addClassName("header-title");
        self.appendTextNode("人工言語古文書展");
      });
      self.appendElement("div", (self) => {
        self.addClassName("header-right");
      });
    });
    self.appendElement("div", (self) => {
      self.addClassName("header-number");
      self.appendElement("div", (self) => {
        self.addClassName("header-number-inner");
        self.appendTextNode(transformer.variables.number.toString());
      });
    });
  });
  return self;
});

export default manager;
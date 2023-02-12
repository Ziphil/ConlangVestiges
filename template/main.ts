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
        self.appendTextNode("言語創造の痕跡展");
      });
      self.appendElement("div", (self) => {
        self.addClassName("header-right");
      });
    });
  });
  return self;
});

manager.registerElementRule("main", "page", (transformer, document, element) => {
  const self = document.createDocumentFragment();
  self.appendElement("main", (self) => {
    self.addClassName("main");
    self.appendChild(transformer.apply(element, "page"));
  });
  return self;
});

manager.registerElementRule("title", "page", (transformer, document, element) => {
  const self = document.createDocumentFragment();
  self.appendSection((sectionSelf, self) => {
    sectionSelf.addClassName("section-title");
    self.appendElement("div", (self) => {
      self.addClassName("title");
      self.appendElement("img", (self) => {
        self.addClassName("title-ornament");
        self.setAttribute("src", "../material/ornament-left.svg");
        self.setAttribute("alt", "");
      });
      self.appendElement("div", (self) => {
        self.addClassName("title-main");
        self.appendElement("div", (self) => {
          self.addClassName("title-main-number");
          self.appendTextNode(transformer.variables.number.toString());
        });
        self.appendElement("h2", (self) => {
          self.addClassName("title-main-text");
          self.appendChild(transformer.apply(element));
        });
      });
      self.appendElement("img", (self) => {
        self.addClassName("title-ornament");
        self.setAttribute("src", "../material/ornament-right.svg");
        self.setAttribute("alt", "");
      });
    });
  });
  return self;
});

manager.registerElementRule("exhibit-webpage", "page", (transformer, document, element) => {
  const self = document.createDocumentFragment();
  const path = element.getAttribute("src");
  self.appendSection((sectionSelf, self) => {
    sectionSelf.addClassName("section-exhibit");
    self.appendElement("div", (self) => {
      self.addClassName("exhibit");
      self.appendElement("div", (self) => {
        self.addClassName("exhibit-inner");
        self.appendElement("iframe", (self) => {
          self.addClassName("exhibit-iframe");
          self.setAttribute("src", path);
        });
      });
    });
  });
  return self;
});

export default manager;
//

import {
  AvendiaTemplateManager
} from "../generator/transformer";


const manager = new AvendiaTemplateManager();

manager.registerElementRule("top", "", (transformer, document, element) => {
  const self = document.createDocumentFragment();
  self.appendChild(transformer.apply(element, "top"));
  return self;
});

manager.registerElementRule("list", "top", (transformer, document, element) => {
  const self = document.createDocumentFragment();
  self.appendSection("section", (sectionSelf, self) => {
    sectionSelf.addClassName("section-table");
    self.appendElement("ul", (self) => {
      self.addClassName("table");
      self.appendChild(transformer.apply(element));
    });
  });
  return self;
});

manager.registerElementRule("item", "top", (transformer, document, element) => {
  const self = document.createDocumentFragment();
  const number = +element.getAttribute("number");
  self.appendElement("li", (self) => {
    self.addClassName("table-item");
    self.appendElement("a", (self) => {
      self.addClassName("table-item-inner");
      self.setAttribute("href", `exhibit/${number}.html`);
      self.appendElement("div", (self) => {
        self.addClassName("table-main");
        self.appendElement("div", (self) => {
          self.addClassName("table-number");
          self.appendTextNode(number.toString());
        });
        self.appendChild(transformer.apply(element, "item"));
      });
    });
  });
  return self;
});

manager.registerElementRule("title", "item", (transformer, document, element) => {
  const self = document.createDocumentFragment();
  self.appendElement("h2", (self) => {
    self.addClassName("table-title");
    self.appendChild(transformer.apply(element));
  });
  return self;
});

manager.registerElementRule("exhibitor", "item", (transformer, document, element) => {
  const self = document.createDocumentFragment();
  self.appendElement("div", (self) => {
    self.addClassName("table-exhibitor");
    self.appendChild(transformer.apply(element));
  });
  return self;
});

manager.registerElementRule(true, "top", (transformer, document, element) => {
  const self = document.createDocumentFragment();
  self.appendElement(element.tagName, (self) => {
    for (let i = 0 ; i < element.attributes.length ; i ++) {
      const {name, value} = element.attributes.item(i)!;
      self.setAttribute(name, value);
    }
    self.appendChild(transformer.apply());
  });
  return self;
});

export default manager;
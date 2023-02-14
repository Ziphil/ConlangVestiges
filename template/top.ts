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
    sectionSelf.addClassName("section-list");
    self.appendElement("ul", (self) => {
      self.addClassName("list");
      self.appendChild(transformer.apply(element));
    });
  });
  return self;
});

manager.registerElementRule("item", "top", (transformer, document, element) => {
  const self = document.createDocumentFragment();
  const number = +element.getAttribute("number");
  self.appendElement("li", (self) => {
    self.addClassName("list-item");
    self.appendElement("a", (self) => {
      self.addClassName("list-item-inner");
      self.setAttribute("href", `exhibit/${number}.html`);
      self.appendElement("div", (self) => {
        self.addClassName("list-main");
        self.appendElement("div", (self) => {
          self.addClassName("list-number");
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
    self.addClassName("list-title");
    self.appendChild(transformer.apply(element));
  });
  return self;
});

manager.registerElementRule("exhibitor", "item", (transformer, document, element) => {
  const self = document.createDocumentFragment();
  self.appendElement("div", (self) => {
    self.addClassName("list-exhibitor");
    self.appendChild(transformer.apply(element));
  });
  return self;
});

manager.registerElementRule("separator", "top", (transformer, document, element) => {
  const self = document.createDocumentFragment();
  self.appendChild(transformer.call("separator", element));
  return self;
});

manager.registerElementFactory("separator", (transformer, document, element) => {
  const self = document.createDocumentFragment();
  self.appendSection("div", (sectionSelf, self) => {
    sectionSelf.addClassName("section-separator");
    self.addClassName("section-inner-separator");
    self.appendElement("div", (self) => {
      self.addClassName("dot");
    });
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
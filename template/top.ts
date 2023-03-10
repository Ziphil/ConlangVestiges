//

import {
  AvendiaTemplateManager
} from "../generator/transformer";


const manager = new AvendiaTemplateManager();

manager.registerElementRule("top", "", (transformer, document, element) => {
  const self = document.createDocumentFragment();
  transformer.variables.urlPrefix = "";
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
        self.appendChild(transformer.apply(element, "top.item"));
      });
    });
  });
  return self;
});

manager.registerElementRule("title", "top.item", (transformer, document, element) => {
  const self = document.createDocumentFragment();
  self.appendElement("h2", (self) => {
    self.addClassName("table-title");
    self.appendChild(transformer.apply(element));
  });
  return self;
});

manager.registerElementRule("exhibitor", "top.item", (transformer, document, element) => {
  const self = document.createDocumentFragment();
  self.appendElement("div", (self) => {
    self.addClassName("table-exhibitor");
    self.appendChild(transformer.apply(element));
  });
  return self;
});

manager.registerElementRule("request", "top", (transformer, document, element) => {
  const self = document.createDocumentFragment();
  self.appendChild(transformer.call("separator"));
  self.appendSection("section", (sectionSelf, self) => {
    sectionSelf.addClassName("section-request");
    self.appendElement("section", (self) => {
      self.addClassName("request-main");
      self.appendChild(transformer.apply(element, "top.request"));
    });
  });
  return self;
});

manager.registerElementRule("content", "top.request", (transformer, document, element) => {
  const self = document.createDocumentFragment();
  self.appendElement("div", (self) => {
    self.addClassName("content");
    self.appendChild(transformer.apply(element));
  });
  return self;
});

manager.registerElementRule("h2", "top.request", (transformer, document, element) => {
  const self = document.createDocumentFragment();
  self.appendElement("h2", (self) => {
    self.addClassName("request-heading");
    self.appendChild(transformer.apply(element));
  });
  return self;
});

manager.registerElementRule("h3", "top.request", (transformer, document, element) => {
  const self = document.createDocumentFragment();
  self.appendElement("h3", (self) => {
    self.addClassName("request-subheading");
    self.appendChild(transformer.apply(element));
  });
  return self;
});

manager.registerElementRule("a", "top.request", (transformer, document, element) => {
  const self = document.createDocumentFragment();
  const path = element.getAttribute("href");
  self.appendElement("a", (self) => {
    self.addClassName("request-link");
    self.setAttribute("href", path);
    self.setAttribute("target", "_blank");
    self.appendChild(transformer.apply(element));
  });
  return self;
});

manager.registerElementRule("button", "top.request", (transformer, document, element) => {
  const self = document.createDocumentFragment();
  self.appendElement("a", (self) => {
    self.addClassName("request-button");
    self.setAttribute("href", "https://forms.gle/CAwkSo26kUdQDihq9");
    self.setAttribute("target", "_blank");
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
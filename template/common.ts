//

import {
  AvendiaTemplateManager
} from "../generator/transformer";


const manager = new AvendiaTemplateManager();

manager.registerElementRule("p", true, (transformer, document, element) => {
  const self = document.createDocumentFragment();
  self.appendElement("p", (self) => {
    self.addClassName("paragraph");
    self.appendChild(transformer.apply(element));
  });
  return self;
});

manager.registerElementRule("ul", true, (transformer, document, element) => {
  const self = document.createDocumentFragment();
  self.appendElement("ul", (self) => {
    self.addClassName("list");
    self.appendChild(transformer.apply(element));
  });
  return self;
});

manager.registerElementRule("li", true, (transformer, document, element) => {
  const self = document.createDocumentFragment();
  self.appendElement("li", (self) => {
    self.addClassName("list-item");
    self.appendChild(transformer.apply(element));
  });
  return self;
});

manager.registerElementFactory("dot", (transformer, document, element) => {
  const self = document.createDocumentFragment();
  self.appendSection("div", (sectionSelf, self) => {
    sectionSelf.addClassName("section-dot");
    self.addClassName("section-inner-dot");
    self.appendElement("div", (self) => {
      self.addClassName("dot");
    });
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

manager.registerElementRule("footer", ["page", "top"], (transformer, document, element, scope) => {
  const self = document.createDocumentFragment();
  if (scope === "page") {
    self.appendSection("section", (sectionSelf, self) => {
      sectionSelf.addClassName("section-navigation");
      self.appendChild(transformer.call("navigation"));
    });
  }
  self.appendElement("footer", (self) => {
    self.addClassName("footer");
    self.appendElement("div", (self) => {
      self.addClassName("footer-inner");
      self.appendElement("div", (self) => {
        self.addClassName("footer-left");
        self.appendElement("div", (self) => {
          self.addClassName("footer-title");
          self.appendTextNode("言語創造の痕跡展");
        });
        self.appendElement("div", (self) => {
          self.addClassName("footer-organizer");
          self.appendTextNode("Organized by ");
          self.appendElement("a", (self) => {
            self.addClassName("footer-link");
            self.setAttribute("href", "https://ziphil.com");
            self.setAttribute("target", "_blank");
            self.appendTextNode("Ziphil");
          });
        });
      });
      self.appendElement("div", (self) => {
        self.addClassName("footer-right");
        self.appendElement("div", (self) => {
          self.appendTextNode("View on ");
          self.appendElement("a", (self) => {
            self.addClassName("footer-link");
            self.setAttribute("href", "https://github.com/Ziphil/ConlangArchive");
            self.setAttribute("target", "_blank");
            self.appendTextNode("GitHub");
          });
        });
        self.appendElement("div", (self) => {
          self.appendTextNode("Ornament images by ");
          self.appendElement("a", (self) => {
            self.addClassName("footer-link");
            self.setAttribute("href", "https://www.freepik.com");
            self.setAttribute("target", "_blank");
            self.appendTextNode("rawpixel.com / Freepik");
          });
        });
      });
    });
  });
  return self;
});


export default manager;
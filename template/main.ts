//

import {
  AvendiaTemplateManager
} from "../generator/transformer";


const MAX_PAGE = 17;

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
  const number = transformer.variables.number as number;
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
          self.appendTextNode(number.toString());
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
    self.appendChild(transformer.call("navigation"));
  });
  return self;
});

manager.registerElementFactory("navigation", (transformer, document, element) => {
  const self = document.createDocumentFragment();
  const number = transformer.variables.number as number;
  self.appendElement("div", (self) => {
    self.addClassName("navigation");
    self.appendElement("div", (self) => {
      self.addClassName("navigation-link-container");
      if (number > 1) {
        self.appendElement("a", (self) => {
          self.addClassName("navigation-link");
          self.setAttribute("href", (number - 1).toString() + ".html");
          self.appendElement("img", (self) => {
            self.addClassName("navigation-arrow");
            self.setAttribute("src", "../material/arrow-left.svg");
            self.setAttribute("alt", "");
          });
          self.appendElement("div", (self) => {
            self.addClassName("navigation-number");
            self.appendTextNode((number - 1).toString());
          });
        });
      }
    });
    self.appendElement("div", (self) => {
      self.addClassName("navigation-center");
      self.appendElement("img", (self) => {
        self.addClassName("navigation-arrow-center");
        self.setAttribute("src", "../material/arrow-center.svg");
        self.setAttribute("alt", "");
      });
    });
    self.appendElement("div", (self) => {
      self.addClassName("navigation-link-container");
      if (number < MAX_PAGE) {
        self.appendElement("a", (self) => {
          self.addClassName("navigation-link");
          self.appendElement("div", (self) => {
            self.addClassName("navigation-number");
            self.appendTextNode((number + 1).toString());
          });
          self.setAttribute("href", (number + 1).toString() + ".html");
          self.appendElement("img", (self) => {
            self.addClassName("navigation-arrow");
            self.setAttribute("src", "../material/arrow-right.svg");
            self.setAttribute("alt", "");
          });
        });
      }
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

manager.registerElementRule("description", "page", (transformer, document, element) => {
  const self = document.createDocumentFragment();
  self.appendSection((sectionSelf, self) => {
    sectionSelf.addClassName("section-description");
    self.appendChild(transformer.apply(element, "description"));
  });
  return self;
});

manager.registerElementRule("comment", "description", (transformer, document, element) => {
  const self = document.createDocumentFragment();
  self.appendElement("section", (self) => {
    self.addClassName("comment");
    self.appendElement("h3", (self) => {
      self.addClassName("comment-heading");
      self.appendTextNode("出展者のコメント");
    });
    self.appendElement("div", (self) => {
      self.addClassName("comment-main");
      self.appendChild(transformer.apply(element));
    });
  });
  return self;
});

manager.registerElementRule("p", "description", (transformer, document, element) => {
  const self = document.createDocumentFragment();
  self.appendElement("p", (self) => {
    self.addClassName("comment-paragraph");
    self.appendChild(transformer.apply(element));
  });
  return self;
});

manager.registerElementRule("information", "description", (transformer, document, element) => {
  const self = document.createDocumentFragment();
  self.appendElement("section", (self) => {
    self.addClassName("information");
    self.appendChild(transformer.apply(element));
  });
  return self;
});

manager.registerElementRule("exhibitor", "description", (transformer, document, element) => {
  const self = document.createDocumentFragment();
  self.appendElement("div", (self) => {
    self.addClassName("information-exhibitor");
    self.appendChild(transformer.apply(element));
  });
  return self;
});

manager.registerElementRule("date", "description", (transformer, document, element) => {
  const self = document.createDocumentFragment();
  self.appendElement("div", (self) => {
    self.addClassName("information-date");
    self.appendChild(transformer.apply(element));
  });
  return self;
});

export default manager;
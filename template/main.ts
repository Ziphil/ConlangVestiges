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
      self.addClassName("header-inner");
      self.appendElement("div", (self) => {
        self.addClassName("header-left");
      });
      self.appendElement("h1", (self) => {
        self.addClassName("header-title");
        self.appendElement("a", (self) => {
          self.setAttribute("href", "../index.html");
          self.appendTextNode("言語創造の痕跡展");
        });
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
  self.appendSection("section", (sectionSelf, self) => {
    sectionSelf.addClassName("section-title");
    self.addClassName("section-inner-title");
    self.appendElement("div", (self) => {
      self.addClassName("title");
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
          self.setAttribute("data-position", "left");
          self.appendElement("div", (self) => {
            self.addClassName("navigation-number");
            self.appendTextNode((number - 1).toString());
          });
        });
      }
    });
    self.appendElement("div", (self) => {
      self.addClassName("navigation-center");
      self.appendElement("div", (self) => {
        self.addClassName("dot");
      });
    });
    self.appendElement("div", (self) => {
      self.addClassName("navigation-link-container");
      if (number < MAX_PAGE) {
        self.appendElement("a", (self) => {
          self.addClassName("navigation-link");
          self.setAttribute("href", (number + 1).toString() + ".html");
          self.setAttribute("data-position", "right");
          self.appendElement("div", (self) => {
            self.addClassName("navigation-number");
            self.appendTextNode((number + 1).toString());
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
  self.appendSection("section", (sectionSelf, self) => {
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
  self.appendChild(transformer.call("dot", element));
  self.appendSection("section", (sectionSelf, self) => {
    sectionSelf.addClassName("section-description");
    self.addClassName("section-inner-description");
    self.appendChild(transformer.apply(element, "description"));
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

manager.registerElementRule("comment", "description", (transformer, document, element) => {
  const self = document.createDocumentFragment();
  self.appendElement("section", (self) => {
    self.addClassName("comment");
    self.appendElement("h3", (self) => {
      self.addClassName("comment-heading");
      self.appendTextNode("出展者のコメント");
    });
    self.appendElement("div", (self) => {
      self.addClassName("content");
      self.appendChild(transformer.apply(element));
    });
  });
  return self;
});

manager.registerElementRule("p", true, (transformer, document, element) => {
  const self = document.createDocumentFragment();
  self.appendElement("p", (self) => {
    self.addClassName("paragraph");
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
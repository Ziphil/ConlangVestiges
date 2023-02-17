//

import fs from "fs";
import {
  AvendiaTemplateManager
} from "../generator/transformer";


const maxNumber = fs.readdirSync("./document/exhibit").length;

const manager = new AvendiaTemplateManager();

manager.registerElementRule("page", "", (transformer, document, element) => {
  const self = document.createDocumentFragment();
  const number = +element.getAttribute("number");
  transformer.variables.number = number;
  transformer.variables.urlPrefix = "../";
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
      if (number < maxNumber) {
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

manager.registerElementRule("exhibit", "page", (transformer, document, element) => {
  const self = document.createDocumentFragment();
  const type = element.getAttribute("type");
  self.appendSection("section", (sectionSelf, self) => {
    self.addClassName("section-exhibit");
    self.appendElement("div", (self) => {
      self.addClassName("exhibit");
      self.setAttribute("data-type", type);
      self.appendElement("div", (self) => {
        self.addClassName("exhibit-inner");
        self.setAttribute("data-type", type);
        self.appendChild(transformer.apply(element, "exhibit"));
      });
    });
  });
  return self;
});

manager.registerElementRule("exhibit-webpage", "exhibit", (transformer, document, element) => {
  const self = document.createDocumentFragment();
  const path = element.getAttribute("src");
  self.appendElement("iframe", (self) => {
    self.addClassName("exhibit-webpage");
    self.setAttribute("src", path);
  });
  return self;
});

manager.registerElementRule("exhibit-pdf", "exhibit", (transformer, document, element) => {
  const self = document.createDocumentFragment();
  const path = element.getAttribute("src");
  self.appendElement("iframe", (self) => {
    self.addClassName("exhibit-pdf");
    self.setAttribute("src", path);
  });
  return self;
});

manager.registerElementRule("exhibit-image", "exhibit", (transformer, document, element) => {
  const self = document.createDocumentFragment();
  const path = element.getAttribute("src");
  self.appendElement("img", (self) => {
    self.addClassName("exhibit-image");
    self.setAttribute("src", path);
  });
  return self;
});

manager.registerElementRule("exhibit-text", "exhibit", (transformer, document, element) => {
  const self = document.createDocumentFragment();
  self.appendElement("p", (self) => {
    self.addClassName("exhibit-text");
    self.appendChild(transformer.apply(element));
  });
  return self;
});

manager.registerElementRule("exhibit-link", "exhibit", (transformer, document, element) => {
  const self = document.createDocumentFragment();
  const path = element.getAttribute("href");
  self.appendElement("div", (self) => {
    self.addClassName("exhibit-link");
    self.appendElement("p", (self) => {
      self.addClassName("exhibit-link-explanation");
      self.appendTextNode("資料ページの埋め込みが許可されていないため、以下のリンクから別タブでご覧ください。");
    });
    self.appendElement("a", (self) => {
      self.addClassName("exhibit-link-link");
      self.setAttribute("href", path);
      self.setAttribute("target", "_blank");
      self.appendTextNode("資料ページへ");
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
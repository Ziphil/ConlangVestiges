//

import {
  BaseDocument,
  BaseDocumentFragment,
  BaseElement,
  BaseText
} from "@zenml/zenml";


export class AvendiaElement extends BaseElement<AvendiaDocument, AvendiaDocumentFragment, AvendiaElement, AvendiaText> {

  public addClassName(className: string): void {
    const currentClassName = this.attributes.get("class");
    const nextClassName = (currentClassName) ? currentClassName + " " + className : className;
    this.attributes.set("class", nextClassName);
  }

  public insertHead<N extends AvendiaElement | AvendiaText>(child: N): N {
    return this.fragment.insertHead(child);
  }

}


export class AvendiaDocument extends BaseDocument<AvendiaDocument, AvendiaDocumentFragment, AvendiaElement, AvendiaText> {

  public placeholder(): AvendiaElement {
    return this.createElement("");
  }

  protected prepareDocumentFragment(): AvendiaDocumentFragment {
    return new AvendiaDocumentFragment(this);
  }

  protected prepareElement(tagName: string): AvendiaElement {
    return new AvendiaElement(this, tagName);
  }

  protected prepareTextNode(content: string): AvendiaText {
    return new AvendiaText(this, content);
  }

}


export class AvendiaDocumentFragment extends BaseDocumentFragment<AvendiaDocument, AvendiaDocumentFragment, AvendiaElement, AvendiaText> {

  public insertHead<N extends AvendiaElement | AvendiaText>(child: N): N {
    let firstSpace = "";
    for (const node of this.nodes) {
      if (node instanceof BaseText) {
        let match;
        if ((match = node.content.match(/^\s*$/)) !== null) {
          firstSpace += match[0];
          node.content = "";
        } else if ((match = node.content.match(/^\s+/)) !== null) {
          firstSpace += match[0];
          node.content = node.content.replace(/^\s+/, "");
          break;
        }
      } else {
        break;
      }
    }
    this.nodes.unshift(child);
    if (firstSpace !== "") {
      this.nodes.unshift(this.document.createTextNode(firstSpace));
    }
    return child;
  }

}


export class AvendiaText extends BaseText<AvendiaDocument, AvendiaDocumentFragment, AvendiaElement, AvendiaText> {

}
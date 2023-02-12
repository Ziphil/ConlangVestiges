//

import {
  AnyObject,
  BaseTransformer,
  BaseTransformerOptions,
  LightTransformer,
  TemplateManager
} from "@zenml/zenml";
import dotjs from "dot";
import TEMPLATE_HTML from "../template/template.html";
import type {
  AvendiaDocument
} from "./dom";


export class AvendiaTransformer extends BaseTransformer<AvendiaDocument, AnyObject, AnyObject> {

  private template: (...args: Array<any>) => string;

  public constructor(implementation: () => AvendiaDocument, options?: BaseTransformerOptions<AvendiaDocument, AnyObject, AnyObject>) {
    super(implementation, options);
    this.template = dotjs.template(TEMPLATE_HTML, {...dotjs.templateSettings, strip: false});
  }

  protected stringify(document: AvendiaDocument): string {
    if (this.variables.mode === "page") {
      const view = {
        environments: this.environments,
        variables: this.variables,
        document
      };
      const output = this.template(view);
      return output;
    } else {
      document.options.includeDeclaration = true;
      const output = document.toString();
      return output;
    }
  }

  protected resetEnvironments(initialEnvironments?: Partial<AnyObject>): void {
    this.environments = {...initialEnvironments};
  }

  protected resetVariables(initialVariables?: Partial<AnyObject>): void {
    this.variables = {...initialVariables};
  }

}


export class AvendiaTemplateManager extends TemplateManager<AvendiaDocument> {

}


export type AvendiaLightTransformer = LightTransformer<AvendiaDocument, AnyObject, AnyObject>;
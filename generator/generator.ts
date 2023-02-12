//

import {
  DOMImplementation
} from "@zenml/xmldom";
import {
  ZenmlParser,
  measureAsync
} from "@zenml/zenml";
import chalk from "chalk";
import chokidar from "chokidar";
import commandLineArgs from "command-line-args";
import cssTreeUtil from "css-tree";
import fs from "fs/promises";
import glob from "glob-promise";
import pathUtil from "path";
import sass from "sass";
import {
  SourceSpan as SassSourceSpan
} from "sass";
import templateManagers from "../template";
import {
  AvendiaDocument
} from "./dom";
import {
  AvendiaTransformer
} from "./transformer";


export class AvendiaGenerator {

  private parser!: ZenmlParser;
  private transformer!: AvendiaTransformer;
  private count: number;

  public constructor() {
    this.count = 0;
  }

  public async execute(): Promise<void> {
    const options = commandLineArgs([
      {name: "watch", alias: "w", type: Boolean}
    ]);
    this.parser = this.createParser();
    this.transformer = this.createTransformer();
    if (options.watch) {
      await this.executeWatch();
    } else {
      await this.executeNormal();
    }
  }

  private async executeNormal(): Promise<void> {
    const documentPaths = await this.getDocumentPaths();
    const promises = documentPaths.map(async (documentPath) => {
      await this.saveNormal(documentPath);
    });
    await Promise.all(promises);
    this.printLast();
  }

  private async executeWatch(): Promise<void> {
    const promise = new Promise((resolve, reject) => {
      const watcher = chokidar.watch("./document", {persistent: true, ignoreInitial: true});
      watcher.on("add", (documentPath) => {
        if (this.checkValidDocumentPath(documentPath)) {
          this.saveNormal(documentPath);
        }
      });
      watcher.on("change", (documentPath) => {
        if (this.checkValidDocumentPath(documentPath)) {
          this.saveNormal(documentPath);
        }
      });
      watcher.on("error", (error) => {
        reject(error);
      });
    });
    await promise;
    this.printLast();
  }

  private async saveNormal(documentPath: string): Promise<void> {
    const intervals = {convert: 0, upload: 0};
    try {
      intervals.convert = await measureAsync(async () => {
        await this.transformNormal(documentPath);
      });
      this.printNormal(documentPath, intervals, true);
    } catch (error) {
      this.printNormal(documentPath, intervals, false);
      await this.logError(documentPath, error);
    }
  }

  private async transformNormal(documentPath: string): Promise<void> {
    const extension = pathUtil.extname(documentPath).slice(1);
    const outputPaths = this.getOutputPaths(documentPath);
    const promises = outputPaths.map(async (outputPath) => {
      if (extension === "zml") {
        await this.transformNormalZml(documentPath, outputPath);
      } else if (extension === "scss") {
        await this.transformNormalScss(documentPath, outputPath);
      }
    });
    await Promise.all(promises);
  }

  private async transformNormalZml(documentPath: string, outputPath: string): Promise<void> {
    const inputString = await fs.readFile(documentPath, {encoding: "utf-8"});
    const inputDocument = this.parser.tryParse(inputString);
    const outputString = this.transformer.transformStringify(inputDocument, {initialVariables: {}});
    await fs.mkdir(pathUtil.dirname(outputPath), {recursive: true});
    await fs.writeFile(outputPath, outputString, {encoding: "utf-8"});
  }

  private async transformNormalScss(documentPath: string, outputPath: string): Promise<void> {
    const logMessage = function (message: string, options: {span?: SassSourceSpan}): void {
      Function.prototype();
    };
    const options = {
      file: documentPath,
      logger: {debug: logMessage, warn: logMessage}
    };
    const cssString = sass.renderSync(options).css.toString("utf-8");
    const cssTree = cssTreeUtil.parse(cssString);
    cssTreeUtil.walk(cssTree, (node) => {
      if (node.type === "Dimension") {
        if (node.unit === "rpx") {
          node.value = (parseFloat(node.value) / 16).toString();
          node.unit = "rem";
        }
      }
    });
    const outputString = cssTreeUtil.generate(cssTree);
    await fs.mkdir(pathUtil.dirname(outputPath), {recursive: true});
    await fs.writeFile(outputPath, outputString, {encoding: "utf-8"});
  }

  private printNormal(documentPath: string, intervals: {convert: number, upload: number}, succeed: boolean): void {
    let output = "";
    const count = ++ this.count;
    output += " ";
    output += Math.min(count, 9999).toString().padStart(4);
    output += " : ";
    output += chalk.cyan(Math.min(intervals.convert, 9999).toString().padStart(4));
    output += "  |  ";
    output += (succeed) ? chalk.yellow(documentPath) : chalk.bgYellow.black(documentPath);
    console.log(output);
  }

  private printLast(): void {
    let output = "";
    const count = this.count;
    if (count > 0) {
      output += "-".repeat(39);
      output += "\n";
      output += " ".repeat(27) + count.toString().padStart(5) + " files";
    }
    console.log(output);
  }

  private async logError(documentPath: string, error: unknown): Promise<void> {
    let output = "";
    output += `[${documentPath}]` + "\n";
    if (error instanceof Error) {
      output += error.message.trim() + "\n";
      output += (error.stack ?? "").trim() + "\n";
    } else {
      output += ("" + error).trim() + "\n";
    }
    output += "\n";
    await fs.appendFile("./log/error.txt", output, {encoding: "utf-8"});
  }

  private createParser(): ZenmlParser {
    const options = {specialElementNames: {brace: "x", bracket: "xn", slash: "i"}};
    const parser = new ZenmlParser(new DOMImplementation(), options);
    return parser;
  }

  private createTransformer(): AvendiaTransformer {
    const options = {initialEnvironments: {}};
    const transformer = new AvendiaTransformer(() => new AvendiaDocument({includeDeclaration: false, html: true}), options);
    for (const manager of templateManagers) {
      transformer.regsiterTemplateManager(manager);
    }
    return transformer;
  }

  private async getDocumentPaths(): Promise<Array<string>> {
    const documentPaths = [];
    const rawDocumentPaths = await glob("./document/**/*");
    for (const documentPath of rawDocumentPaths) {
      if (this.checkValidDocumentPath(documentPath)) {
        documentPaths.push(documentPath);
      }
    }
    return documentPaths;
  }

  private getOutputPaths(documentPath: string): Array<string> {
    let outputPath = pathUtil.join("./out", pathUtil.relative("./document", documentPath));
    outputPath = outputPath.replace(/\.zml$/, ".html");
    outputPath = outputPath.replace(/\.scss$/, ".css");
    outputPath = outputPath.replace(/\.tsx?$/, ".js");
    return [outputPath];
  }

  private checkValidDocumentPath(documentPath: string): boolean {
    return pathUtil.basename(documentPath).match(/^(index|main|\d+)\.(\w+)$/) !== null;
  }

}
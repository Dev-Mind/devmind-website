/// <reference types="node" />
import { HandlebarsTemplate, Options } from "./extension/model";
export declare class DevMindGulpBuilder {
    constructor(givenOptions: Options);
    private options;
    applyTemplate(handlebarsTemplateFile: string, partials: Array<HandlebarsTemplate>): import("stream").Duplex;
    convertToHtml(): import("stream").Duplex;
    convertToJson(fileName: string): import("stream").Duplex;
    convertToRss(filename: string): import("stream").Duplex;
    convertToSitemap(): import("stream").Duplex;
    convertToBlogList(handlebarsTemplateFile: string, partials: Array<HandlebarsTemplate>, filename: string, nbArticleMax: number): import("stream").Duplex;
    convertToBlogPage(handlebarsTemplateFile: string, partials: Array<HandlebarsTemplate>, blogIndexFile: string): import("stream").Duplex;
    fileExist(filePath: string): boolean;
    filesExist(): import("stream").Duplex;
    highlightCode(selector: any): import("stream").Duplex;
    readAsciidoc(): import("stream").Duplex;
    readHtml(): import("stream").Duplex;
    readIndex(): import("stream").Duplex;
}

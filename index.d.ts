/// <reference types="node" />
import { HandlebarsTemplate, Options } from "./extension/model";
import { Duplex } from "stream";
export declare class DevMindGulpBuilder {
    constructor(givenOptions?: Options);
    private options;
    applyTemplate(handlebarsTemplateFile: string, partials: Array<HandlebarsTemplate>): Duplex;
    convertToHtml(): Duplex;
    convertToJson(fileName: string): Duplex;
    convertToRss(filename: string): Duplex;
    convertToSitemap(): Duplex;
    convertToBlogList(handlebarsTemplateFile: string, partials: Array<HandlebarsTemplate>, filename: string, nbArticleMax: number): Duplex;
    convertToBlogPage(handlebarsTemplateFile: string, partials: Array<HandlebarsTemplate>, blogIndexFile: string): Duplex;
    fileExist(filePath: string): boolean;
    filesExist(): Duplex;
    highlightCode(selector: any): Duplex;
    readAsciidoc(): Duplex;
    readHtml(): Duplex;
    readIndex(): Duplex;
}

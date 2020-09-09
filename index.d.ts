/// <reference types="node" />
import { HandlebarsTemplate, Options } from "./extension/model";
import { Transform } from "stream";
export declare class DevMindGulpBuilder {
    constructor(givenOptions?: Options);
    private readonly options;
    applyTemplate(handlebarsTemplateFile: string, partials: Array<HandlebarsTemplate>): Transform;
    convertToHtml(): Transform;
    convertToJson(filename: string): Transform;
    convertToRss(filename: string): Transform;
    convertToSitemap(): Transform;
    convertToBlogList(handlebarsTemplateFile: string, partials: Array<HandlebarsTemplate>, filename: string, nbArticleMax: number): Transform;
    convertToBlogPage(handlebarsTemplateFile: string, partials: Array<HandlebarsTemplate>, blogIndexFile: string): Transform;
    fileExist(filePath: string): boolean;
    filesExist(): Transform;
    highlightCode(selector: any): Transform;
    readAsciidoc(): Transform;
    readHtml(): Transform;
    readIndex(): Transform;
}

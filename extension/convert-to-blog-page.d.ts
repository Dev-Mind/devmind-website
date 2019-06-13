/// <reference types="node" />
import { HandlebarsTemplate, Options } from "./model";
/**
 * This plugin is used to read the firebase index. The final aim is to generate static page for blog post
 * (everything has to be static for indexing bots)
 */
export declare function extConvertToBlogPage(options: Options, handlebarsTemplateFile: string, partials: Array<HandlebarsTemplate>, blogIndexFile: string): import("stream").Duplex;

/// <reference types="node" />
import { HandlebarsTemplate, Options } from "./model";
import { Transform } from "stream";
export declare function extConvertToBlogList(options: Options, handlebarsTemplateFile: string, partials: Array<HandlebarsTemplate>, filename: string, nbArticleMax: number): Transform;

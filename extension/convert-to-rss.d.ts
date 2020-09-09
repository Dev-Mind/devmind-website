/// <reference types="node" />
import { Options } from "./model";
import { Transform } from "stream";
/**
 * This plugin parse metadata file to build a Rss XML descriptor
 */
export declare function extConvertToRss(options: Options, filename: string): Transform;

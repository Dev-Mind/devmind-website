/// <reference types="node" />
import { Options } from "./model";
import { Duplex } from "stream";
/**
 * This plugin parse all the asciidoc files to build a Rss XML descriptor
 */
export declare function extConvertToRss(options: Options, filename: string): Duplex;

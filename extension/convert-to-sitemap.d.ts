/// <reference types="node" />
import { Options } from "./model";
import { Transform } from "stream";
/**
 * This plugin parse indexes (blog + page) and create a sitemap for bot indexer
 */
export declare function extConvertToSitemap(options: Options): Transform;

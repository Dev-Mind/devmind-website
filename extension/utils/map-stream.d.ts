/// <reference types="node" />
import { Duplex } from 'stream';
/**
 * Filter will reemit the data if cb(err,pass) pass is truthy
 * @param mapper
 */
export declare function mapStream(mapper: any): Duplex;

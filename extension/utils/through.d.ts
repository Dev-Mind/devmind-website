/// <reference types="node" />
import { Duplex } from 'stream';
/**
 * a stream that does nothing but re-emit the input.
 * useful for aggregating a series of changing but not ending streams into one stream)
 */
export declare function through(write: (stream: Duplex, data?: any) => void, end: (Duplex: any) => void): Duplex;

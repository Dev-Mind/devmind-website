'use strict';

import * as Vinyl from 'vinyl';
import * as PluginError from 'plugin-error';
import {through} from './utils/through';
import {Duplex} from "stream";

/**
 * This plugin writes the blog metadata in a local index
 */
export function extConvertToJson(filename: string): Duplex {
  if (!filename) throw new PluginError('convertToJson', 'Missing target filename for convert-to-json');

  let json = [];

  const iterateOnStream = (stream: Duplex, data) => {
    json.push(JSON.stringify(data.indexData));
  };

  const endStream = (stream: Duplex) => {
    const target = new Vinyl({path: filename, contents: Buffer.from(`[${json}]`)});
    stream.emit('data', target);
    stream.emit('end');
  };

  return through(iterateOnStream, endStream);
}





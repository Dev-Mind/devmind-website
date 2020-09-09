'use strict';

import * as Vinyl from 'vinyl';
import * as PluginError from 'plugin-error';
import {Transform} from "stream";
import * as through2 from 'through2';

/**
 * This plugin returns blog metadata in a JSON array
 */
export function extConvertToJson(filename: string): Transform {
  if (!filename) throw new PluginError('convertToJson', 'Missing target filename for convert-to-json');

  let json = [];

  const iterateOnStream = function (file, _, next) {
    json.push(JSON.stringify(file.indexData));
    next(null, file);
  };

  const flushStream = function (cb) {
    const target = new Vinyl({path: filename, contents: Buffer.from(`[${json}]`)});
    this.push(target);
    cb();
  };

  return through2.obj(iterateOnStream, flushStream);

}





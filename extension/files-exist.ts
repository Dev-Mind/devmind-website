'use strict';

import {Options} from "./model";
import {extFileExist} from './file-exist';
import * as PluginError from 'plugin-error';
import * as path from 'path';
import {Transform} from "stream";
import * as through2 from 'through2';

export function extFilesExist(options: Options): Transform {

  return through2.obj((file, _, next) => {
    const page = path.resolve(__dirname, options.path, file.path);
    if (!extFileExist(page)) {
      throw new PluginError('files-exist', `File ${file.path} does not exist`);
    }
    next(null, file);
  });
}

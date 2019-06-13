'use strict';

import {Options} from "./model";
import {extFileExist} from './file-exist';
import * as PluginError from 'plugin-error';
import * as path from 'path';
import {mapStream} from "./utils/map-stream";


export function extFilesExist(options: Options) {

    return mapStream((file, next) => {
        const page = path.resolve(__dirname, options.path, file.path);
        if (!extFileExist(page)) {
            throw new PluginError('files-exist', `File ${file.path} does not exist`);
        }
        next(null, file);
    });
};

'use strict';

import * as fs from 'fs';

/**
 * This extension return true if the file exists
 *
 * Example of usage
 * ----
 * const page = path.resolve(__dirname, options.path, file.path);
 * if(!fileExist(page)){
 *     throw new PluginError('files-exist', `File ${file.path} does not existe`);
 * }
 * ----
 * @param filePath
 * @return boolean
 */
export function extFileExist(filePath: string): boolean {
    try {
        fs.accessSync(filePath);
        return true;
    } catch (e) {
        return false;
    }
}


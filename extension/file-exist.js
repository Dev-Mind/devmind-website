'use strict';
exports.__esModule = true;
exports.extFileExist = void 0;
var fs = require("fs");
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
function extFileExist(filePath) {
    try {
        fs.accessSync(filePath);
        return true;
    }
    catch (e) {
        return false;
    }
}
exports.extFileExist = extFileExist;

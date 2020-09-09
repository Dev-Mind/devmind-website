'use strict';
exports.__esModule = true;
exports.extFilesExist = void 0;
var file_exist_1 = require("./file-exist");
var PluginError = require("plugin-error");
var path = require("path");
var through2 = require("through2");
function extFilesExist(options) {
    return through2.obj(function (file, _, next) {
        var page = path.resolve(__dirname, options.path, file.path);
        if (!file_exist_1.extFileExist(page)) {
            throw new PluginError('files-exist', "File " + file.path + " does not exist");
        }
        next(null, file);
    });
}
exports.extFilesExist = extFilesExist;

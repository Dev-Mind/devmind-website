'use strict';
exports.__esModule = true;
exports.extConvertToJson = void 0;
var Vinyl = require("vinyl");
var PluginError = require("plugin-error");
var through2 = require("through2");
/**
 * This plugin returns blog metadata in a JSON array
 */
function extConvertToJson(filename) {
    if (!filename)
        throw new PluginError('convertToJson', 'Missing target filename for convert-to-json');
    var json = [];
    var iterateOnStream = function (file, _, next) {
        json.push(JSON.stringify(file.indexData));
        next(null, file);
    };
    var flushStream = function (cb) {
        var target = new Vinyl({ path: filename, contents: Buffer.from("[" + json + "]") });
        this.push(target);
        cb();
    };
    return through2.obj(iterateOnStream, flushStream);
}
exports.extConvertToJson = extConvertToJson;

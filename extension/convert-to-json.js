'use strict';
exports.__esModule = true;
exports.extConvertToJson = void 0;
var Vinyl = require("vinyl");
var PluginError = require("plugin-error");
var through_1 = require("./utils/through");
/**
 * This plugin writes the blog metadata in a local index
 */
function extConvertToJson(filename) {
    if (!filename)
        throw new PluginError('convertToJson', 'Missing target filename for convert-to-json');
    var json = [];
    var iterateOnStream = function (stream, data) {
        json.push(JSON.stringify(data.indexData));
    };
    var endStream = function (stream) {
        var target = new Vinyl({ path: filename, contents: Buffer.from("[" + json + "]") });
        stream.emit('data', target);
        stream.emit('end');
    };
    return through_1.through(iterateOnStream, endStream);
}
exports.extConvertToJson = extConvertToJson;

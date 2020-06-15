'use strict';
exports.__esModule = true;
exports.extConvertToRss = void 0;
var model_1 = require("./model");
var time_1 = require("./utils/time");
var Vinyl = require("vinyl");
var PluginError = require("plugin-error");
var fs = require("fs");
var path = require("path");
var file_exist_1 = require("./file-exist");
var through_1 = require("./utils/through");
/**
 * This plugin parse all the asciidoc files to build a Rss XML descriptor
 */
function extConvertToRss(options, filename) {
    var pagesPath = path.resolve(__dirname, options.path, options.metadata.rss);
    if (!file_exist_1.extFileExist(pagesPath)) {
        throw new PluginError('convert-to-rss', "Missing metadata page with all blog descriptions. Define this file. The default path is " + options.metadata.rss);
    }
    var rssMetadata = JSON.parse(fs.readFileSync(pagesPath, model_1.FILE_ENCODING));
    if (!filename)
        throw new PluginError('convert-to-rss', 'Missing target filename for asciidoctor-rss');
    var xml = '';
    function iterateOnStream(stream, data) {
        var content = data.length === 0 ? '' : data
            .map(function (metadata) { return "\n          <item>\n            <link>" + rssMetadata.blogurl + "/" + metadata.dir + "/" + metadata.filename + ".html</link>\n            <title>" + metadata.doctitle + "</title>\n            <description>" + metadata.teaser + "</description>\n            <pubDate>" + time_1.convertDateEn(metadata.revdate) + "</pubDate>\n            <enclosure url=\"" + rssMetadata.blogimgurl + "/" + metadata.dir + "/" + metadata.imgteaser + "\"/>\n          </item>\n        "; })
            .reduce(function (a, b) { return a + b; });
        xml = "\n        <rss xmlns:atom=\"http://www.w3.org/2005/Atom\" version=\"2.0\">\n            <channel>\n                <title>" + rssMetadata.title + "</title>\n                <description>" + rssMetadata.description + "</description>\n                <copyright>" + rssMetadata.copyright + "</copyright>\n                <link>" + rssMetadata.blogurl + "</link>\n                <atom:link href=\"" + rssMetadata.blogurl + "\" rel=\"self\" type=\"application/rss+xml\"/>\n                <pubDate>" + time_1.currentDateIso() + "</pubDate>\n                <image>\n                  <url>" + rssMetadata.logourl + "</url>\n                  <title>" + rssMetadata.shorttile + "</title>\n                  <link>" + rssMetadata.blogurl + "</link>\n                </image>\n                " + content + "\n            </channel>\n        </rss>";
    }
    function endStream(stream) {
        var target = new Vinyl({ path: filename, contents: Buffer.from(xml) });
        stream.emit('data', target);
        stream.emit('end');
    }
    return through_1.through(iterateOnStream, endStream);
}
exports.extConvertToRss = extConvertToRss;
;

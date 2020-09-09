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
var through2 = require("through2");
/**
 * This plugin parse metadata file to build a Rss XML descriptor
 */
function extConvertToRss(options, filename) {
    if (!filename)
        throw new PluginError('convert-to-rss', 'Missing target filename for asciidoctor-rss');
    var pagesPath = path.resolve(__dirname, options.path, options.metadata.rss);
    if (!file_exist_1.extFileExist(pagesPath)) {
        throw new PluginError('convert-to-rss', "Missing metadata page with all blog descriptions. Define this file. The default path is " + options.metadata.rss);
    }
    var rssMetadata = JSON.parse(fs.readFileSync(pagesPath, model_1.FILE_ENCODING));
    return through2.obj(function (file, _, next) {
        var xml = file.length === 0 ? '' : file
            .map(function (metadata) { return "\n          <item>\n            <link>" + rssMetadata.blogurl + "/" + metadata.dir + "/" + metadata.filename + ".html</link>\n            <title>" + metadata.doctitle + "</title>\n            <description>" + metadata.teaser + "</description>\n            <pubDate>" + time_1.convertDateEn(metadata.revdate) + "</pubDate>\n            <enclosure url=\"" + rssMetadata.blogimgurl + "/" + metadata.dir + "/" + metadata.imgteaser + "\"/>\n          </item>\n        "; })
            .reduce(function (a, b) { return a + b; });
        var rss = ("<rss xmlns:atom=\"http://www.w3.org/2005/Atom\" version=\"2.0\">\n                   <channel>\n                        <title>" + rssMetadata.title + "</title>\n                        <description>" + rssMetadata.description + "</description>\n                        <copyright>" + rssMetadata.copyright + "</copyright>\n                        <link>" + rssMetadata.blogurl + "</link>\n                        <atom:link href=\"" + rssMetadata.blogurl + "\" rel=\"self\" type=\"application/rss+xml\"/>\n                        <pubDate>" + time_1.currentDateIso() + "</pubDate>\n                        <image>\n                          <url>" + rssMetadata.logourl + "</url>\n                          <title>" + rssMetadata.shorttile + "</title>\n                          <link>" + rssMetadata.blogurl + "</link>\n                        </image>\n                        " + xml + "\n                    </channel>\n                </rss>").trim().replace(/\s\s+/g, '');
        var target = new Vinyl({ path: filename, contents: Buffer.from(rss) });
        next(null, target);
    });
}
exports.extConvertToRss = extConvertToRss;

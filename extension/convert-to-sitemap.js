'use strict';
exports.__esModule = true;
exports.extConvertToSitemap = void 0;
var model_1 = require("./model");
var PluginError = require("plugin-error");
var fs = require("fs");
var path = require("path");
var file_exist_1 = require("./file-exist");
var moment = require("moment");
var through2 = require("through2");
var Vinyl = require("vinyl");
/**
 * This plugin parse indexes (blog + page) and create a sitemap for bot indexer
 */
function extConvertToSitemap(options) {
    var pagesPath = path.resolve(__dirname, options.path, options.metadata.sitemap);
    if (!file_exist_1.extFileExist(pagesPath)) {
        throw new PluginError('convert-to-sitemap', "Missing metadata page with all blog descriptions. Define this file. The default path is " + options.metadata.rss);
    }
    var siteMetadata = JSON.parse(fs.readFileSync(pagesPath, model_1.FILE_ENCODING));
    var xml = "";
    function createUrlNode(file, metadata) {
        if (!!metadata.priority && metadata.priority < 0) {
            return '';
        }
        if (metadata.blog) {
            if (file.path.lastIndexOf("blog/") > 0) {
                return "<url>\n            <loc>" + siteMetadata.url + "/blog/" + metadata.dir + "/" + metadata.filename + ".html</loc>\n            <lastmod>" + moment(siteMetadata.revdate).format() + "</lastmod>\n            <priority>0.51</priority>\n        </url>";
            }
            if (file.path.lastIndexOf("training/") > 0) {
                return "<url>\n            <loc>" + siteMetadata.url + "/blog/" + metadata.dir + "/" + metadata.filename + ".html</loc>\n            <lastmod>" + moment(siteMetadata.revdate).format() + "</lastmod>\n            <priority>0.51</priority>\n        </url>";
            }
        }
        return "<url>\n        <loc>" + siteMetadata.url + "/" + metadata.filename + ".html</loc>\n        <lastmod>" + moment().format() + "</lastmod>\n        <priority>" + (metadata.priority ? metadata.priority : 0.51) + "</priority>\n    </url>";
    }
    var iterateOnStream = function (file, _, next) {
        var data = JSON.parse(file.contents);
        xml += data.length === 0 ? '' : data
            .map(function (metadata) { return createUrlNode(file, metadata); })
            .reduce(function (a, b) { return a + b; });
        next(null, file);
    };
    var flushStream = function (cb) {
        var fileContent = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n    <urlset\n      xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\"\n      xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"\n      xsi:schemaLocation=\"http://www.sitemaps.org/schemas/sitemap/0.9\n            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd\">\n        <url>\n          <loc>" + siteMetadata.url + "/</loc>\n          <lastmod>" + moment().format() + "</lastmod>\n          <priority>1.00</priority>\n        </url>\n        <url>\n          <loc>" + siteMetadata.url + "/blog.html</loc>\n          <lastmod>" + moment().format() + "</lastmod>\n          <priority>0.90</priority>\n        </url>\n        <url>\n          <loc>" + siteMetadata.url + "/blog_archive.html</loc>\n          <lastmod>" + moment().format() + "</lastmod>\n          <priority>0.90</priority>\n        </url>\n        " + xml + "\n      </urlset>";
        var target = new Vinyl({ path: 'sitemap.xml', contents: Buffer.from("" + fileContent) });
        this.push(target);
        cb();
    };
    return through2.obj(iterateOnStream, flushStream);
}
exports.extConvertToSitemap = extConvertToSitemap;

'use strict';
exports.__esModule = true;
var model_1 = require("./model");
var PluginError = require("plugin-error");
var Vinyl = require("vinyl");
var fs = require("fs");
var path = require("path");
var file_exist_1 = require("./file-exist");
var through_1 = require("./utils/through");
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
    function createUrlNode(metadata) {
        if (!!metadata.priority && metadata.priority < 0) {
            return '';
        }
        if (metadata.blog) {
            return "<url>\n        <loc>" + siteMetadata.url + "/blog/" + metadata.dir + "/" + metadata.filename + ".html</loc>\n        <changefreq>weekly</changefreq>\n        <priority>0.3</priority>\n        <news:news>\n          <news:publication>\n              <news:name>" + siteMetadata.name + "</news:name>\n              <news:language>fr</news:language>\n          </news:publication>\n          <news:genres>Blog</news:genres>\n          <news:publication_date>" + metadata.revdate + "</news:publication_date>\n          <news:title>" + metadata.doctitle + "</news:title>\n          <news:keywords>" + metadata.keywords + "</news:keywords>\n          <news:stock_tickers>" + metadata.category + "</news:stock_tickers>\n        </news:news>\n    </url>";
        }
        return "<url>\n        <loc>" + siteMetadata.url + "/" + metadata.filename + ".html</loc>\n        <changefreq>weekly</changefreq>\n        <priority>" + (metadata.priority ? metadata.priority : 0.3) + "</priority>\n    </url>";
    }
    function iterateOnStream(stream, data) {
        xml += data.length === 0 ? '' : data
            .map(function (metadata) { return createUrlNode(metadata); })
            .reduce(function (a, b) { return a + b; });
    }
    function endStream(stream) {
        var fileContent = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n      <urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\" xmlns:news=\"http://www.google.com/schemas/sitemap-news/0.9\">\n        <url>\n          <loc>" + siteMetadata.url + "/</loc>\n          <changefreq>weekly</changefreq>\n          <priority>1</priority>\n        </url>\n        <url>\n          <loc>" + siteMetadata.url + "/blog.html</loc>\n          <changefreq>weekly</changefreq>\n          <priority>0.9</priority>\n        </url>\n        <url>\n          <loc>" + siteMetadata.url + "/blog_archive.html</loc>\n          <changefreq>weekly</changefreq>\n          <priority>0.9</priority>\n        </url>\n        " + xml + "\n      </urlset>";
        var target = new Vinyl({ path: 'sitemap.xml', contents: Buffer.from(fileContent) });
        stream.emit('data', target);
        stream.emit('end');
    }
    return through_1.through(iterateOnStream, endStream);
}
exports.extConvertToSitemap = extConvertToSitemap;
;

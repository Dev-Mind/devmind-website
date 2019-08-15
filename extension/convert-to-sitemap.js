'use strict';
exports.__esModule = true;
var model_1 = require("./model");
var PluginError = require("plugin-error");
var Vinyl = require("vinyl");
var fs = require("fs");
var path = require("path");
var file_exist_1 = require("./file-exist");
var through_1 = require("./utils/through");
var moment = require("moment");
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
            return "<url>\n        <loc>" + siteMetadata.url + "/blog/" + metadata.dir + "/" + metadata.filename + ".html</loc>\n        <lastmod>" + moment(siteMetadata.revdate).format() + "</lastmod>\n        <priority>0.51</priority>      \n    </url>";
            // <news:news>
            //   <news:publication>
            //       <news:name>${siteMetadata.name}</news:name>
            //       <news:language>fr</news:language>
            //   </news:publication>
            //   <news:genres>Blog</news:genres>
            //   <news:publication_date>${metadata.revdate}</news:publication_date>
            //   <news:title>${metadata.doctitle}</news:title>
            //   <news:keywords>${metadata.keywords}</news:keywords>
            //   <news:stock_tickers>${metadata.category}</news:stock_tickers>
            // </news:news>
        }
        return "<url>\n        <loc>" + siteMetadata.url + "/" + metadata.filename + ".html</loc>\n        <lastmod>" + moment().format() + "</lastmod>\n        <priority>" + (metadata.priority ? metadata.priority : 0.51) + "</priority>\n    </url>";
    }
    function iterateOnStream(stream, data) {
        xml += data.length === 0 ? '' : data
            .map(function (metadata) { return createUrlNode(metadata); })
            .reduce(function (a, b) { return a + b; });
    }
    function endStream(stream) {
        var fileContent = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n    <urlset\n      xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\"\n      xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"\n      xsi:schemaLocation=\"http://www.sitemaps.org/schemas/sitemap/0.9\n            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd\">\n        <url>\n          <loc>" + siteMetadata.url + "/</loc>\n          <lastmod>" + moment().format() + "</lastmod>\n          <priority>1.00</priority>\n        </url>\n        <url>\n          <loc>" + siteMetadata.url + "/blog.html</loc>\n          <lastmod>" + moment().format() + "</lastmod>\n          <priority>0.90</priority>\n        </url>\n        <url>\n          <loc>" + siteMetadata.url + "/blog_archive.html</loc>\n          <lastmod>" + moment().format() + "</lastmod>\n          <priority>0.90</priority>\n        </url>\n        " + xml + "\n      </urlset>";
        var target = new Vinyl({ path: 'sitemap.xml', contents: Buffer.from(fileContent) });
        stream.emit('data', target);
        stream.emit('end');
    }
    return through_1.through(iterateOnStream, endStream);
}
exports.extConvertToSitemap = extConvertToSitemap;
;

"use strict";
exports.__esModule = true;
var apply_template_1 = require("./extension/apply-template");
var read_index_1 = require("./extension/read-index");
var read_asciidoctor_1 = require("./extension/read-asciidoctor");
var convert_to_html_1 = require("./extension/convert-to-html");
var convert_to_json_1 = require("./extension/convert-to-json");
var convert_to_rss_1 = require("./extension/convert-to-rss");
var convert_to_sitemap_1 = require("./extension/convert-to-sitemap");
var convert_to_blog_list_1 = require("./extension/convert-to-blog-list");
var convert_to_blog_page_1 = require("./extension/convert-to-blog-page");
var file_exist_1 = require("./extension/file-exist");
var files_exist_1 = require("./extension/files-exist");
var highlight_code_1 = require("./extension/highlight-code");
var read_html_1 = require("./extension/read-html");
var defaultOptions = {
    path: '../../../',
    modeDev: true,
    metadata: {
        rss: 'src/metadata/rss.json',
        blog: 'src/metadata/blog.json',
        html: 'src/metadata/html.json',
        sitemap: 'src/metadata/sitemap.json'
    }
};
var DevMindGulpBuilder = /** @class */ (function () {
    function DevMindGulpBuilder(givenOptions) {
        this.options = givenOptions;
        this.options.path = givenOptions.path || defaultOptions.path;
        if (!givenOptions.metadata) {
            this.options.metadata = defaultOptions.metadata;
        }
        else {
            this.options.metadata.rss = givenOptions.metadata.rss || defaultOptions.metadata.rss;
            this.options.metadata.blog = givenOptions.metadata.blog || defaultOptions.metadata.blog;
            this.options.metadata.html = givenOptions.metadata.html || defaultOptions.metadata.html;
            this.options.metadata.sitemap = givenOptions.metadata.sitemap || defaultOptions.metadata.sitemap;
        }
        this.options.path = givenOptions.path || defaultOptions.path;
        this.options.modeDev = !(process.env.NODE_ENV && process.env.NODE_ENV === 'prod');
    }
    DevMindGulpBuilder.prototype.applyTemplate = function (handlebarsTemplateFile, partials) {
        return apply_template_1.extApplyTemplate(this.options, handlebarsTemplateFile, partials);
    };
    DevMindGulpBuilder.prototype.convertToHtml = function () {
        return convert_to_html_1.extConvertToHtml();
    };
    DevMindGulpBuilder.prototype.convertToJson = function (fileName) {
        return convert_to_json_1.extConvertToJson(fileName);
    };
    DevMindGulpBuilder.prototype.convertToRss = function (filename) {
        return convert_to_rss_1.extConvertToRss(this.options, filename);
    };
    DevMindGulpBuilder.prototype.convertToSitemap = function () {
        return convert_to_sitemap_1.extConvertToSitemap(this.options);
    };
    DevMindGulpBuilder.prototype.convertToBlogList = function (handlebarsTemplateFile, partials, filename, nbArticleMax) {
        return convert_to_blog_list_1.extConvertToBlogList(this.options, handlebarsTemplateFile, partials, filename, nbArticleMax);
    };
    DevMindGulpBuilder.prototype.convertToBlogPage = function (handlebarsTemplateFile, partials, blogIndexFile) {
        return convert_to_blog_page_1.extConvertToBlogPage(this.options, handlebarsTemplateFile, partials, blogIndexFile);
    };
    DevMindGulpBuilder.prototype.fileExist = function (filePath) {
        return file_exist_1.extFileExist(filePath);
    };
    DevMindGulpBuilder.prototype.filesExist = function () {
        return files_exist_1.extFilesExist(this.options);
    };
    DevMindGulpBuilder.prototype.highlightCode = function (selector) {
        return highlight_code_1.extHighlightCode(selector);
    };
    DevMindGulpBuilder.prototype.readAsciidoc = function () {
        return read_asciidoctor_1.extReadAsciidoc(this.options);
    };
    DevMindGulpBuilder.prototype.readHtml = function () {
        return read_html_1.extReadHtml(this.options);
    };
    DevMindGulpBuilder.prototype.readIndex = function () {
        return read_index_1.extReadIndex();
    };
    return DevMindGulpBuilder;
}());
exports.DevMindGulpBuilder = DevMindGulpBuilder;

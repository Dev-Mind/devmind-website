"use strict";
exports.__esModule = true;
exports.extConvertToBlogList = void 0;
var Vinyl = require("vinyl");
var PluginError = require("plugin-error");
var handlebars = require("handlebars");
var fs = require("fs");
var path = require("path");
var moment = require("moment");
var model_1 = require("./model");
var time_1 = require("./utils/time");
var file_exist_1 = require("./file-exist");
var through2 = require("through2");
function extConvertToBlogList(options, handlebarsTemplateFile, partials, filename, nbArticleMax) {
    if (!handlebarsTemplateFile)
        throw new PluginError('convert-to-blog-list', 'Missing source handlebarsTemplateFile for convert-to-blog-list');
    if (!filename)
        throw new PluginError('convert-to-blog-list', 'Missing target filename for convert-to-blog-list');
    if (!partials)
        throw new PluginError('convert-to-blog-list', 'Missing source partials for convert-to-blog-list');
    var pagesPath = path.resolve(__dirname, options.path, options.metadata.blog);
    if (!file_exist_1.extFileExist(pagesPath)) {
        throw new PluginError('convert-to-blog-list', "Missing metadata page with all blog descriptions. Define this file. The default path is " + options.metadata.blog);
    }
    var pages = JSON.parse(fs.readFileSync(pagesPath, model_1.FILE_ENCODING));
    partials.forEach(function (partial) { return handlebars.registerPartial(partial.key, fs.readFileSync(path.resolve(__dirname, options.path, partial.path), model_1.FILE_ENCODING)); });
    var handlebarsTemplate = handlebars.compile(fs.readFileSync(path.resolve(__dirname, options.path, handlebarsTemplateFile), model_1.FILE_ENCODING));
    var metadata = {
        keywords: function () { return pages[filename].keywords; },
        title: function () { return pages[filename].title; },
        description: function () { return pages[filename].description; },
        gendate: function () { return time_1.currentDate(); },
        genInstant: function () { return time_1.currentDateIso(); },
        canonicalUrl: function () { return filename; },
        firstArticle: undefined,
        secondArticles: undefined,
        otherArticles: undefined,
        last15Articles: undefined,
        articleByYears: []
    };
    var iterateOnStream = function (file, _, next) {
        var blogIndex = file
            .map(function (a) {
            a.date = a.revdate.substring(8, 10) + '/' + a.revdate.substring(5, 7) + '/' + a.revdate.substring(0, 4);
            return a;
        })
            .sort(function (a, b) { return (a.strdate < b.strdate ? 1 : (a.strdate > b.strdate ? -1 : 0)); });
        if (nbArticleMax) {
            metadata.firstArticle = function () { return blogIndex[0]; };
            metadata.secondArticles = function () { return blogIndex.filter(function (e, index) { return index > 0 && index <= nbArticleMax; }); };
            metadata.otherArticles = function () { return blogIndex.filter(function (e, index) { return index > nbArticleMax; }); };
            metadata.last15Articles = function () { return blogIndex.filter(function (e, index) { return index < 10; }); };
        }
        else {
            blogIndex
                .map(function (article) { return moment(article.strdate).format("YYYY"); })
                .filter(function (value, index, array) { return array.indexOf(value) === index; })
                .sort(function (a, b) { return a < b ? 1 : -1; })
                .forEach(function (year) { return metadata.articleByYears.push({
                key: year,
                value: []
            }); });
            blogIndex.forEach(function (article) { return metadata
                .articleByYears
                .filter(function (year) { return year.key === moment(article.strdate).format("YYYY"); })[0]
                .value
                .push(article); });
        }
        next();
    };
    var flushStream = function (cb) {
        var target = new Vinyl({ path: filename, contents: Buffer.from(handlebarsTemplate(metadata)) });
        this.push(target);
        cb();
    };
    return through2.obj(iterateOnStream, flushStream);
}
exports.extConvertToBlogList = extConvertToBlogList;

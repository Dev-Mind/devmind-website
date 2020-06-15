'use strict';
exports.__esModule = true;
exports.extReadHtml = void 0;
var model_1 = require("./model");
var PluginError = require("plugin-error");
var fs = require("fs");
var path = require("path");
var time_1 = require("./utils/time");
var file_exist_1 = require("./file-exist");
var map_stream_1 = require("./utils/map-stream");
/**
 * Read a stream of HTML files and build for each HTML file
 *  - a templateModel, a structure JSON used after with handlebar and
 *  - an indexData object used to build an index file used by other extensions
 *
 * Example of usage*
 * ----
 * gulp.task('html-template', () => gulp.src(`src/html/*.html`)
 *     .pipe(website.readHtml())
 *     .pipe(website.applyTemplate(`src/templates/site.handlebars`))
 *     .pipe(gulp.dest('build/dist')));
 * ----
 * @returns {stream}
 */
function extReadHtml(options) {
    var pageMetadataPath = path.resolve(__dirname, options.path, options.metadata.html);
    if (!file_exist_1.extFileExist(pageMetadataPath)) {
        throw new PluginError('read-html', "Missing metadata page with all html descriptions. Define this file. The default path is " + options.metadata.html);
    }
    var pageMetadata = JSON.parse(fs.readFileSync(pageMetadataPath, model_1.FILE_ENCODING));
    return map_stream_1.mapStream(function (file, next) {
        var html = fs.readFileSync(file.path, model_1.FILE_ENCODING);
        file.fileName = file.path.substring(file.path.lastIndexOf(path.sep) + 1, file.path.length);
        if (!pageMetadata[file.fileName])
            throw new PluginError('read-html', "Missing index definition for " + file.path + " in the build script html-read");
        var indexData = {
            strdate: time_1.currentDate(),
            revdate: time_1.currentDateEn(),
            doctitle: pageMetadata[file.fileName].title,
            description: pageMetadata[file.fileName].description,
            keywords: pageMetadata[file.fileName].keywords.split(","),
            filename: file.fileName.substring(0, file.fileName.lastIndexOf('.')),
            priority: pageMetadata[file.fileName].priority,
            dir: path.sep
        };
        file.templateModel = {
            keywords: function () { return indexData.keywords; },
            title: function () { return indexData.doctitle; },
            description: function () { return indexData.description; },
            contents: function () { return Buffer.from(html); },
            gendate: function () { return indexData.strdate; },
            genInstant: function () { return time_1.currentDateIso(); },
            blog: function () { return pageMetadata[file.fileName].blog; },
            canonicalUrl: function () { return file.fileName; },
            modedev: function () { return options.modeDev; }
        };
        file.indexData = indexData;
        next(null, file);
    });
}
exports.extReadHtml = extReadHtml;

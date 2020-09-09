'use strict';
exports.__esModule = true;
exports.extConvertToBlogPage = void 0;
var model_1 = require("./model");
var PluginError = require("plugin-error");
var handlebars = require("handlebars");
var fs = require("fs");
var path = require("path");
var through2 = require("through2");
/**
 * This plugin is used to read the firebase index. The final aim is to generate static page for blog post
 * (everything has to be static for indexing bots)
 */
function extConvertToBlogPage(options, handlebarsTemplateFile, partials, blogIndexFile) {
    if (!handlebarsTemplateFile)
        throw new PluginError('convert-to-blog-page', 'Missing source handlebarsTemplateFile for convert-to-blog-page');
    if (!blogIndexFile)
        throw new PluginError('convert-to-blog-page', 'Missing source blogIndexFile for convert-to-blog-page');
    if (!partials)
        throw new PluginError('convert-to-blog-page', 'Missing source partials for convert-to-blog-page');
    partials.forEach(function (partial) { return handlebars.registerPartial(partial.key, fs.readFileSync(path.resolve(__dirname, options.path, partial.path), model_1.FILE_ENCODING)); });
    var handlebarsTemplate = handlebars.compile(fs.readFileSync(path.resolve(__dirname, options.path, handlebarsTemplateFile), model_1.FILE_ENCODING));
    var blogIndexPath = path.resolve(__dirname, options.path, blogIndexFile);
    var blogIndex = JSON.parse(fs.readFileSync(blogIndexPath, model_1.FILE_ENCODING));
    return through2.obj(function (file, _, next) {
        // We need to find the previous blog post, the current and the next
        var previousPost;
        var nextPost;
        blogIndex
            .sort(function (a, b) { return (a.strdate < b.strdate ? 1 : (a.strdate > b.strdate ? -1 : 0)); })
            .forEach(function (elt, index, array) {
            if (elt.filename === file.templateModel.filename()) {
                nextPost = index > 0 ? array[index - 1] : undefined;
                previousPost = index < array.length ? array[index + 1] : undefined;
            }
        });
        if (previousPost) {
            file.templateModel.previous = {
                dir: previousPost.dir,
                filename: previousPost.filename,
                doctitle: previousPost.doctitle
            };
        }
        if (nextPost) {
            file.templateModel.next = {
                dir: nextPost.dir,
                filename: nextPost.filename,
                doctitle: nextPost.doctitle
            };
        }
        var content = handlebarsTemplate(file.templateModel)
            .replace('<html><head></head><body>', '')
            .replace('</body>', '')
            .replace('</html>', '');
        file.templateModel.contents = file.contents.toString();
        file.contents = Buffer.from(content);
        next(null, file);
    });
}
exports.extConvertToBlogPage = extConvertToBlogPage;

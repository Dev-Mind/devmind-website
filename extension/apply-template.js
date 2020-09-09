"use strict";
exports.__esModule = true;
exports.extApplyTemplate = void 0;
var model_1 = require("./model");
var file_exist_1 = require("./file-exist");
var handlebars = require("handlebars");
var fs = require("fs");
var path = require("path");
var PluginError = require("plugin-error");
var through2 = require("through2");
/**
 * Used to apply a handlebar template on a file stream. This extension has to be applied after `read-html` or
 * `read-asciidoctor` extensions which create the `templateModel` sent to handlebars to populate the template
 *
 * Example of usage
 * ----
 * const HANDLEBARS_PARTIALS = [
 *   {key: '_html_header', path: 'src/templates/_html_header.handlebars'},
 *   {key: '_html_footer', path: 'src/templates/_html_footer.handlebars'}
 * ];
 * gulp.task('html-template', () => gulp.src('src/html/*.html)
 *   .pipe(website.readHtml())
 *   .pipe(website.applyTemplate('src/templates/site.handlebars`, HANDLEBARS_PARTIALS))
 *   .pipe(gulp.dest('build/dist')));
 * ----
 * @param options
 * @param handlebarsTemplateFile
 * @param partials
 * @returns {stream}
 */
function extApplyTemplate(options, handlebarsTemplateFile, partials) {
    var handlebarsTemplatePath = path.resolve(__dirname, options.path, handlebarsTemplateFile);
    if (!file_exist_1.extFileExist(handlebarsTemplatePath)) {
        throw new PluginError('apply-template', "handlebars template " + handlebarsTemplatePath + " is required");
    }
    if (partials) {
        partials.forEach(function (partial) { return handlebars.registerPartial(partial.key, fs.readFileSync(path.resolve(__dirname, options.path, partial.path), model_1.FILE_ENCODING)); });
    }
    var handlebarsTemplate = handlebars.compile(fs.readFileSync(handlebarsTemplatePath, model_1.FILE_ENCODING));
    return through2.obj(function (file, _, next) {
        file.contents = Buffer.from(handlebarsTemplate(file.templateModel));
        next(null, file);
    });
}
exports.extApplyTemplate = extApplyTemplate;

'use strict';
exports.__esModule = true;
exports.extConvertToHtml = void 0;
var through2 = require("through2");
/**
 * Used to change Asciidoc file extension to html
 *
 * Example of usage
 * ----
 * gulp.task('blog-indexing', () => gulp.src('src/blog/*.adoc')
 *     .pipe(website.readAsciidoc())
 *     .pipe(website.convertToHtml())
 *     .pipe(gulp.dest('build/.tmp')));
 * ----
 * @returns {stream}
 */
function extConvertToHtml() {
    return through2.obj(function (file, _, next) {
        var html = file.ast.convert();
        file.contents = Buffer.from(html);
        file.extname = '.html';
        file.path = file.path.replace('.adoc', '.html');
        next(null, file);
    });
}
exports.extConvertToHtml = extConvertToHtml;

'use strict';
exports.__esModule = true;
exports.extConvertToHtml = void 0;
var map_stream_1 = require("./utils/map-stream");
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
    return map_stream_1.mapStream(function (file, next) {
        var html = file.ast.convert();
        file.contents = Buffer.from(html);
        file.extname = '.html';
        file.path = file.path.replace('.adoc', '.html');
        next(null, file);
    });
}
exports.extConvertToHtml = extConvertToHtml;

'use strict';
exports.__esModule = true;
exports.extReadIndex = void 0;
var through2 = require("through2");
/**
 * Used to parse a JSON file with metadata and send the content to another extension in file stream in gulp
 *
 * Example of usage*
 * ----
 * gulp.task('blog-rss', () => gulp.src('build/.tmp/blogindex.json')
 *     .pipe(website.readIndex())
 *     .pipe(website.convertToRss('blog.xml'))
 *     .pipe(gulp.dest('build/dist/rss')));
 * ----
 * In this example I read an index written in Json and `read-index` helps to read the content and send it to another
 * extension like `convert-to-rss` for example
 */
function extReadIndex() {
    return through2.obj(function (file, _, next) { return next(null, JSON.parse(file.contents)); });
}
exports.extReadIndex = extReadIndex;

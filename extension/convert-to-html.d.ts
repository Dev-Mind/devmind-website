/// <reference types="node" />
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
export declare function extConvertToHtml(): import("stream").Duplex;

'use strict';

import {Transform} from "stream";
import * as through2 from 'through2';

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
export function extConvertToHtml(): Transform {
  return through2.obj((file, _, next) => {
    const html = file.ast.convert();
    file.contents = Buffer.from(html);
    file.extname = '.html';
    file.path = file.path.replace('.adoc', '.html');
    next(null, file);
  });
}

'use strict';

import {mapStream} from "./utils/map-stream";
import {Duplex} from "stream";

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
export function extConvertToHtml(): Duplex {

  return mapStream((file, next) => {
    const html = file.ast.convert();
    file.contents = Buffer.from(html);
    file.extname = '.html';
    file.path = file.path.replace('.adoc', '.html');
    next(null, file);
  });
}

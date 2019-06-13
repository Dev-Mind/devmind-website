'use strict';


import {mapStream} from "./utils/map-stream";

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
export function extReadIndex() {
    return mapStream(async (file, next) => next(null, JSON.parse(file.contents)));
}



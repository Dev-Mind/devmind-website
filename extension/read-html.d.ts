/// <reference types="node" />
import { Options } from "./model";
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
export declare function extReadHtml(options: Options): import("stream").Duplex;

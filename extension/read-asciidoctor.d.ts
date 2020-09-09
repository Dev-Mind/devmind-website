/// <reference types="node" />
import { Options } from "./model";
import { Transform } from "stream";
/**
 * Read a stream of Asciidoc files and build for each HTML file. If you use code example in your asciidoc a feature to highlight language keywords.
 * - a templateModel, a structure JSON used after with handlebar and
 * - an indexData object used to build an index file used by other extensions
 *
 * Example of usage
 * ----
 * gulp.task('adoc-template', () => gulp.src(`src/html/*.html`)
 *     .pipe(website.readAsciidoc())
 *     .pipe(website.convertToHtml())
 *     .pipe(website.applyTemplate(`src/templates/site.handlebars`))
 *     .pipe(gulp.dest('build/dist')));
 *----
 *
 * @param options
 * @return stream
 */
export declare function extReadAsciidoc(options: Options): Transform;

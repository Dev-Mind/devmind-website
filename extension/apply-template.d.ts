/// <reference types="node" />
import { HandlebarsTemplate, Options } from "./model";
import { Duplex } from "stream";
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
export declare function extApplyTemplate(options: Options, handlebarsTemplateFile: string, partials: Array<HandlebarsTemplate>): Duplex;

import {FILE_ENCODING, HandlebarsTemplate, Options} from "./model";
import {extFileExist} from "./file-exist";
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import * as PluginError from 'plugin-error';
import {mapStream} from './utils/map-stream';
import {Duplex} from "stream";

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
export function extApplyTemplate(options: Options,
                                 handlebarsTemplateFile: string,
                                 partials: Array<HandlebarsTemplate>): Duplex {

  const handlebarsTemplatePath = path.resolve(__dirname, options.path, handlebarsTemplateFile);
  if (!extFileExist(handlebarsTemplatePath)) {
    throw new PluginError('apply-template',
      `handlebars template ${handlebarsTemplatePath} is required`);
  }

  if (partials) {
    partials.forEach(partial => handlebars.registerPartial(
      partial.key,
      fs.readFileSync(path.resolve(__dirname, options.path, partial.path),
        FILE_ENCODING)));
  }

  const handlebarsTemplate = handlebars.compile(fs.readFileSync(handlebarsTemplatePath, FILE_ENCODING));

  return mapStream(async (file, next) => {
    file.contents = Buffer.from(handlebarsTemplate(file.templateModel));
    next(null, file);
  });
}


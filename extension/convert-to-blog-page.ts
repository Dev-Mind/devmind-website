'use strict';

import {FILE_ENCODING, HandlebarsTemplate, Options} from "./model";
import * as PluginError from 'plugin-error';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import {Transform} from "stream";
import * as through2 from 'through2';

/**
 * This plugin is used to read the firebase index. The final aim is to generate static page for blog post
 * (everything has to be static for indexing bots)
 */
export function extConvertToBlogPage(options: Options,
                                     handlebarsTemplateFile: string,
                                     partials: Array<HandlebarsTemplate>,
                                     blogIndexFile: string): Transform {

  if (!handlebarsTemplateFile) throw new PluginError('convert-to-blog-page', 'Missing source handlebarsTemplateFile for convert-to-blog-page');
  if (!blogIndexFile) throw new PluginError('convert-to-blog-page', 'Missing source blogIndexFile for convert-to-blog-page');
  if (!partials) throw new PluginError('convert-to-blog-page', 'Missing source partials for convert-to-blog-page');

  partials.forEach(partial => handlebars.registerPartial(partial.key, fs.readFileSync(path.resolve(__dirname, options.path, partial.path), FILE_ENCODING)));
  const handlebarsTemplate = handlebars.compile(fs.readFileSync(path.resolve(__dirname, options.path, handlebarsTemplateFile), FILE_ENCODING));

  const blogIndexPath = path.resolve(__dirname, options.path, blogIndexFile);
  const blogIndex = JSON.parse(fs.readFileSync(blogIndexPath, FILE_ENCODING));

  return through2.obj((file, _, next) => {
    // We need to find the previous blog post, the current and the next
    let previousPost;
    let nextPost;

    blogIndex
      .sort((a, b) => (a.strdate < b.strdate ? 1 : (a.strdate > b.strdate ? -1 : 0)))
      .forEach((elt, index, array) => {
        if (elt.filename === file.templateModel.filename()) {

          nextPost = index > 0 ? array[index - 1] : undefined;
          previousPost = index < array.length ? array[index + 1] : undefined;
        }
      });

    if (previousPost) {
      file.templateModel.previous = {
        dir: previousPost.dir,
        filename: previousPost.filename,
        doctitle: previousPost.doctitle
      };
    }
    if (nextPost) {
      file.templateModel.next = {
        dir: nextPost.dir,
        filename: nextPost.filename,
        doctitle: nextPost.doctitle
      };
    }

    var ampRegexp = new RegExp('&amp;', 'g');
    const content = handlebarsTemplate(file.templateModel)
      .replace('<html><head></head><body>', '')
      .replace('</body>', '')
      .replace('</html>', '')
      .replace(ampRegexp, '&')
      .replace('</html>', '');

    file.templateModel.contents = file.contents.toString();
    file.contents = Buffer.from(content);

    next(null, file);
  });
}








'use strict';

import {FILE_ENCODING, IndexData, Options} from "./model";
import * as PluginError from 'plugin-error';
import * as fs from 'fs';
import * as path from 'path';
import {currentDate, currentDateEn, currentDateIso} from "./utils/time";
import {extFileExist} from "./file-exist";
import {Transform} from "stream";
import * as through2 from 'through2';
import {TransformCallback} from "through2";

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
export function extReadHtml(options: Options): Transform {

  const pageMetadataPath = path.resolve(__dirname, options.path, options.metadata.html);
  if (!extFileExist(pageMetadataPath)) {
    throw new PluginError('read-html', `Missing metadata page with all html descriptions. Define this file. The default path is ${options.metadata.html}`);
  }
  const pageMetadata = JSON.parse(fs.readFileSync(pageMetadataPath, FILE_ENCODING));

  return through2.obj((file, _, next: TransformCallback) => {
    const html = fs.readFileSync(file.path, FILE_ENCODING);
    file.fileName = file.path.substring(file.path.lastIndexOf(path.sep) + 1, file.path.length);

    if (!pageMetadata[file.fileName]) throw new PluginError('read-html', `Missing index definition for ${file.path} in the build script html-read`);

    const indexData: IndexData = {
      strdate: currentDate(),
      revdate: currentDateEn(),
      doctitle: pageMetadata[file.fileName].title,
      description: pageMetadata[file.fileName].description,
      keywords: pageMetadata[file.fileName].keywords.split(","),
      filename: file.fileName.substring(0, file.fileName.lastIndexOf('.')),
      priority: pageMetadata[file.fileName].priority,
      dir: path.sep
    };

    file.templateModel = {
      keywords: () => indexData.keywords,
      title: () => indexData.doctitle,
      description: () => indexData.description,
      contents: () => Buffer.from(html),
      gendate: () => indexData.strdate,
      genInstant: () => currentDateIso(),
      blog: () => pageMetadata[file.fileName].blog,
      canonicalUrl: () => file.fileName,
      modedev: () => options.modeDev,
    };

    file.indexData = indexData;

    next(null, file);
  });
}


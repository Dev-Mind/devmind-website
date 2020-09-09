'use strict';

import {convertDateEn, currentDateIso} from "./utils/time";
import {IndexBlogData, Options} from "./model";
import {Transform} from "stream";
import * as through2 from 'through2';
import {TransformCallback} from "through2";

const asciidoctorOptions = {
  safe: 'safe',
  doctype: 'article',
  header_footer: false,
  attributes: {
    imagesdir: '/assets/images',
  },
};

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
export function extReadAsciidoc(options: Options): Transform {

  const asciidoctor = require(`${options.path}node_modules/asciidoctor.js/dist/node/asciidoctor`)();

  return through2.obj((file, _, next: TransformCallback) => {

    const opts = Object.assign({}, asciidoctorOptions, {});
    opts.attributes = Object.assign({}, opts.attributes);

    const asciidoc = file.contents.toString();
    file.ast = asciidoctor.load(asciidoc, opts);
    file.attributes = file.ast.getAttributes();

    const filename = file.path.substring(file.path.lastIndexOf("/") + 1, file.path.lastIndexOf("."));

    let dir = '';
    if (file.path.lastIndexOf("blog/") > 0) {
      dir = file.path.substring(file.path.lastIndexOf("blog/") + "blog/".length, file.path.lastIndexOf("/"));
    }
    if (file.path.lastIndexOf("training/") > 0) {
      dir = file.path.substring(file.path.lastIndexOf("training/") + "training/".length, file.path.lastIndexOf("/"));
    }

    const indexData: IndexBlogData = {
      strdate: file.attributes.revdate,
      revdate: convertDateEn(file.attributes.revdate),
      description: file.attributes.description,
      doctitle: file.attributes.doctitle,
      keywords: file.attributes.keywords ? file.attributes.keywords.split(",") : undefined,
      filename: filename,
      category: file.attributes.category,
      teaser: file.attributes.teaser,
      imgteaser: file.attributes.imgteaser,
      modeDev: options.modeDev,
      blog: true,
      dir: dir,
      priority: 0.6
    };

    // make all model properties accessible through fat-arrow "getters"
    // this way, file.* values can be changed before templating
    file.templateModel = {
      keywords: () => indexData.keywords,
      title: () => indexData.doctitle,
      revdate: () => indexData.revdate,
      gendate: () => indexData.strdate,
      genInstant: () => currentDateIso(),
      contents: () => file.contents,
      'github-edit-url': () => file.git.githubEditUrl,
      filename: () => indexData.filename,
      dir: () => indexData.dir,
      category: () => indexData.category,
      teaser: () => indexData.teaser,
      imgteaser: () => indexData.imgteaser,
      status: () => file.attributes.status,
      modedev: () => indexData.modeDev,
      canonicalUrl: () => `blog/${dir}/${filename}.html`
    };

    if (file.attributes.status !== 'draft') {
      file.indexData = indexData;
    }

    next(null, file);
  });
}



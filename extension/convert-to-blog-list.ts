import * as Vinyl from 'vinyl';
import * as PluginError from 'plugin-error';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import * as moment from 'moment';
import {FILE_ENCODING, HandlebarsTemplate, Options} from "./model";
import {currentDate, currentDateIso} from "./utils/time";
import {extFileExist} from "./file-exist";
import {Transform} from "stream";
import * as through2 from 'through2';

export function extConvertToBlogList(options: Options,
                                     handlebarsTemplateFile: string,
                                     partials: Array<HandlebarsTemplate>,
                                     filename: string,
                                     nbArticleMax: number): Transform {

  if (!handlebarsTemplateFile) throw new PluginError('convert-to-blog-list', 'Missing source handlebarsTemplateFile for convert-to-blog-list');
  if (!filename) throw new PluginError('convert-to-blog-list', 'Missing target filename for convert-to-blog-list');
  if (!partials) throw new PluginError('convert-to-blog-list', 'Missing source partials for convert-to-blog-list');

  const pagesPath = path.resolve(__dirname, options.path, options.metadata.blog);
  if (!extFileExist(pagesPath)) {
    throw new PluginError('convert-to-blog-list', `Missing metadata page with all blog descriptions. Define this file. The default path is ${options.metadata.blog}`);
  }

  const pages = JSON.parse(fs.readFileSync(pagesPath, FILE_ENCODING));

  partials.forEach(partial => handlebars.registerPartial(
    partial.key,
    fs.readFileSync(path.resolve(__dirname, options.path, partial.path),
      FILE_ENCODING)));

  const handlebarsTemplate = handlebars.compile(fs.readFileSync(path.resolve(__dirname, options.path, handlebarsTemplateFile), FILE_ENCODING));

  const metadata = {
    keywords: () => pages[filename].keywords,
    title: () => pages[filename].title,
    description: () => pages[filename].description,
    gendate: () => currentDate(),
    genInstant: () => currentDateIso(),
    canonicalUrl: () => filename,
    firstArticle: undefined,
    secondArticles: undefined,
    otherArticles: undefined,
    last15Articles: undefined,
    articleByYears: []
  };

  const iterateOnStream = function (file, _, next) {
    const blogIndex = file
      .map(a => {
        a.date = a.revdate.substring(8, 10) + '/' + a.revdate.substring(5, 7) + '/' + a.revdate.substring(0, 4);
        return a;
      })
      .sort((a, b) => (a.strdate < b.strdate ? 1 : (a.strdate > b.strdate ? -1 : 0)));

    if (nbArticleMax) {
      metadata.firstArticle = () => blogIndex[0];
      metadata.secondArticles = () => blogIndex.filter((e, index) => index > 0 && index <= nbArticleMax);
      metadata.otherArticles = () => blogIndex.filter((e, index) => index > nbArticleMax);
      metadata.last15Articles = () => blogIndex.filter((e, index) => index < 10);
    } else {
      blogIndex
        .map(article => moment(article.strdate).format("YYYY"))
        .filter((value, index, array) => array.indexOf(value) === index)
        .sort((a, b) => a < b ? 1 : -1)
        .forEach(year => metadata.articleByYears.push({
          key: year,
          value: []
        }));

      blogIndex.forEach(article => metadata
        .articleByYears
        .filter(year => year.key === moment(article.strdate).format("YYYY"))[0]
        .value
        .push(article)
      );
    }
    next();
  }

  const flushStream = function (cb) {
    const target = new Vinyl({path: filename, contents: Buffer.from(handlebarsTemplate(metadata))});
    this.push(target);
    cb();
  };

  return through2.obj(iterateOnStream, flushStream);

}

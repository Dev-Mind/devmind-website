'use strict';

import {FILE_ENCODING, Options} from "./model";
import * as PluginError from 'plugin-error';
import * as fs from 'fs';
import * as path from 'path';
import {extFileExist} from "./file-exist";
import {Transform} from "stream";
import * as moment from "moment";
import * as through2 from 'through2';
import * as Vinyl from "vinyl";

/**
 * This plugin parse indexes (blog + page) and create a sitemap for bot indexer
 */
export function extConvertToSitemap(options: Options): Transform {

  const pagesPath = path.resolve(__dirname, options.path, options.metadata.sitemap);
  if (!extFileExist(pagesPath)) {
    throw new PluginError('convert-to-sitemap', `Missing metadata page with all blog descriptions. Define this file. The default path is ${options.metadata.rss}`);
  }
  const siteMetadata = JSON.parse(fs.readFileSync(pagesPath, FILE_ENCODING));


  let xml = ``;

  function createUrlNode(metadata) {
    if (!!metadata.priority && metadata.priority < 0) {
      return '';
    }
    if (metadata.blog) {
      return `<url>
        <loc>${siteMetadata.url}/blog/${metadata.dir}/${metadata.filename}.html</loc>
        <lastmod>${moment(siteMetadata.revdate).format()}</lastmod>
        <priority>0.51</priority>
    </url>`;
    }
    return `<url>
        <loc>${siteMetadata.url}/${metadata.filename}.html</loc>
        <lastmod>${moment().format()}</lastmod>
        <priority>${metadata.priority ? metadata.priority : 0.51}</priority>
    </url>`;
  }

  const iterateOnStream = function (file, _, next) {
    const data = JSON.parse(file.contents);
    xml += data.length === 0 ? '' : data
      .map(metadata => createUrlNode(metadata))
      .reduce((a, b) => a + b);
    next(null, file)
  };

  const flushStream = function (cb) {
    const fileContent = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
        <url>
          <loc>${siteMetadata.url}/</loc>
          <lastmod>${moment().format()}</lastmod>
          <priority>1.00</priority>
        </url>
        <url>
          <loc>${siteMetadata.url}/blog.html</loc>
          <lastmod>${moment().format()}</lastmod>
          <priority>0.90</priority>
        </url>
        <url>
          <loc>${siteMetadata.url}/blog_archive.html</loc>
          <lastmod>${moment().format()}</lastmod>
          <priority>0.90</priority>
        </url>
        ${xml}
      </urlset>`;
    const target = new Vinyl({path: 'sitemap.xml', contents: Buffer.from(`${fileContent}`)});
    this.push(target);
    cb();
  };

  return through2.obj(iterateOnStream, flushStream);
}

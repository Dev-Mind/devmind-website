'use strict';

import {FILE_ENCODING, Options} from "./model";
import * as PluginError from 'plugin-error';

import * as Vinyl from 'vinyl';
import * as fs from 'fs';
import * as path from 'path';
import {extFileExist} from "./file-exist";
import {through} from './utils/through';
import {Duplex} from "stream";

/**
 * This plugin parse indexes (blog + page) and create a sitemap for bot indexer
 */
export function extConvertToSitemap(options: Options): Duplex {

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
        <changefreq>weekly</changefreq>
        <priority>0.3</priority>
        <news:news>
          <news:publication>
              <news:name>${siteMetadata.name}</news:name>
              <news:language>fr</news:language>
          </news:publication>
          <news:genres>Blog</news:genres>
          <news:publication_date>${metadata.revdate}</news:publication_date>
          <news:title>${metadata.doctitle}</news:title>
          <news:keywords>${metadata.keywords}</news:keywords>
          <news:stock_tickers>${metadata.category}</news:stock_tickers>
        </news:news>
    </url>`;
    }
    return `<url>
        <loc>${siteMetadata.url}/${metadata.filename}.html</loc>
        <changefreq>weekly</changefreq>
        <priority>${metadata.priority ? metadata.priority : 0.3}</priority>
    </url>`;
  }

  function iterateOnStream(stream: Duplex, data) {
    xml += data.length === 0 ? '' : data
      .map(metadata => createUrlNode(metadata))
      .reduce((a, b) => a + b);
  }

  function endStream(stream: Duplex) {
    const fileContent = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
        <url>
          <loc>${siteMetadata.url}/</loc>
          <changefreq>weekly</changefreq>
          <priority>1</priority>
        </url>
        <url>
          <loc>${siteMetadata.url}/blog.html</loc>
          <changefreq>weekly</changefreq>
          <priority>0.9</priority>
        </url>
        <url>
          <loc>${siteMetadata.url}/blog_archive.html</loc>
          <changefreq>weekly</changefreq>
          <priority>0.9</priority>
        </url>
        ${xml}
      </urlset>`;

    let target = new Vinyl({path: 'sitemap.xml', contents: Buffer.from(fileContent)});
    stream.emit('data', target);
    stream.emit('end');
  }

  return through(iterateOnStream, endStream);
};

'use strict';

import {FILE_ENCODING, Options} from "./model";
import {convertDateEn, currentDateIso} from "./utils/time";

import * as Vinyl from 'vinyl';
import * as PluginError from 'plugin-error';
import * as fs from 'fs';
import * as path from 'path';
import {extFileExist} from "./file-exist";
import {Transform} from "stream";
import * as through2 from 'through2';

/**
 * This plugin parse metadata file to build a Rss XML descriptor
 */
export function extConvertToRss(options: Options, filename: string): Transform {

  if (!filename) throw new PluginError('convert-to-rss', 'Missing target filename for asciidoctor-rss');

  const pagesPath = path.resolve(__dirname, options.path, options.metadata.rss);
  if (!extFileExist(pagesPath)) {
    throw new PluginError('convert-to-rss', `Missing metadata page with all blog descriptions. Define this file. The default path is ${options.metadata.rss}`);
  }
  const rssMetadata = JSON.parse(fs.readFileSync(pagesPath, FILE_ENCODING));

  return through2.obj((file, _, next) => {
    const xml = file.length === 0 ? '' : file
      .map(metadata => `
          <item>
            <link>${rssMetadata.blogurl}/${metadata.dir}/${metadata.filename}.html</link>
            <title>${metadata.doctitle}</title>
            <description>${metadata.teaser}</description>
            <pubDate>${convertDateEn(metadata.revdate)}</pubDate>
            <enclosure url="${rssMetadata.blogimgurl}/${metadata.dir}/${metadata.imgteaser}"/>
          </item>
        `)
      .reduce((a, b) => a + b);
    const rss = `<rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
                   <channel>
                        <title>${rssMetadata.title}</title>
                        <description>${rssMetadata.description}</description>
                        <copyright>${rssMetadata.copyright}</copyright>
                        <link>${rssMetadata.blogurl}</link>
                        <atom:link href="${rssMetadata.blogurl}" rel="self" type="application/rss+xml"/>
                        <pubDate>${currentDateIso()}</pubDate>
                        <image>
                          <url>${rssMetadata.logourl}</url>
                          <title>${rssMetadata.shorttile}</title>
                          <link>${rssMetadata.blogurl}</link>
                        </image>
                        ${xml}
                    </channel>
                </rss>`.trim().replace(/\s\s+/g, '');
    const target = new Vinyl({path: filename, contents: Buffer.from(rss)});
    next(null, target);
  });
}

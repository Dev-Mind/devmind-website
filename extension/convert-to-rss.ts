'use strict';

import {FILE_ENCODING, Options} from "./model";
import {convertDateEn, currentDateIso} from "./utils/time";

import * as Vinyl from 'vinyl';
import * as PluginError from 'plugin-error';
import * as fs from 'fs';
import * as path from 'path';
import {extFileExist} from "./file-exist";
import {through} from './utils/through';
import {Duplex} from "stream";

/**
 * This plugin parse all the asciidoc files to build a Rss XML descriptor
 */
export function extConvertToRss(options: Options, filename: string) {

    const pagesPath = path.resolve(__dirname, options.path, options.metadata.rss);
    if (!extFileExist(pagesPath)) {
        throw new PluginError('convert-to-rss', `Missing metadata page with all blog descriptions. Define this file. The default path is ${options.metadata.rss}`);
    }
    const rssMetadata = JSON.parse(fs.readFileSync(pagesPath, FILE_ENCODING));

    if (!filename) throw new PluginError('convert-to-rss', 'Missing target filename for asciidoctor-rss');

    let xml = '';

    function iterateOnStream(stream, data) {
        const content = data.length === 0 ? '' : data
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

        xml = `
        <rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
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
                ${content}
            </channel>
        </rss>`;
    }

    function endStream(stream: Duplex) {
        let target = new Vinyl({path: filename, contents: Buffer.from(xml)});
        stream.emit('data', target);
        stream.emit('end');
    }

    return through(iterateOnStream, endStream);
};

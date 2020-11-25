'use strict';

import {Transform} from 'stream';
import * as through2 from 'through2';
import {TransformCallback} from 'through2';

const Prism = require('prismjs');
const cheerio = require('cheerio');
const loadLanguages = require('prismjs/components/');

export function extHighlightCode({selector}): Transform {

  const updateSpecialCharacters = (html) => {
    return html
      .replace(/&amp;lt<span class="token punctuation">;<\/span>/g, '&lt;')
      .replace(/&amp;gt<span class="token punctuation">;<\/span>/g, '&gt;')
      .replace(/&amp;quot<span class="token punctuation">;<\/span>/g, '&quot;')
      .replace(/&amp;apos<span class="token punctuation">;<\/span>/g, '&apos;')
      .replace(/<span class=\"token operator\">&amp;<\/span>quot<span class=\"token punctuation\">;<\/span>/g, '&quot;')
      .replace(/<span class=\"token operator\">&amp;<\/span>lt<span class=\"token punctuation\">;<\/span>/g, '&lt;')
      .replace(/<span class=\"token operator\">&amp;<\/span>apos<span class=\"token punctuation\">;<\/span>/g, '&apos;')
      .replace(/<span class=\"token operator\">&amp;<\/span>gt<span class=\"token punctuation\">;<\/span>/g, '&gt;')
      .replace(/<span class=\"token operator\">&amp;<\/span>gt<span class=\"token punctuation\">;<\/span>/g, '&gt;')
  };

  return through2.obj((file, _, next: TransformCallback) => {
    const $ = cheerio.load(file.contents.toString(), {
      decodeEntities: true,
      lowerCaseTags: false,
      withEndIndices: false,
      normalizeWhitespace: false,
      recognizeSelfClosing: true
    });

    $(selector).each((index, code) => {
      const elem = $(code);
      const language = elem.prop('data-lang') || 'javascript';
      const fileContents = elem.html();
      loadLanguages(language)
      const highlightedContents = Prism.highlight(fileContents, Prism.languages[language], language);
      const finalHtml = updateSpecialCharacters(highlightedContents);
      elem.parent().replaceWith(`<pre class="language-${language}">${finalHtml}</pre>`);
      elem.addClass('highlights');
    });

    file.contents = Buffer.from($.html());
    next(null, file)
  });
}

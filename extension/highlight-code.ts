'use strict';

import {Transform} from 'stream';
import * as through2 from 'through2';
import {TransformCallback} from 'through2';

const Prism = require('prismjs');
const cheerio = require('cheerio');
const loadLanguages = require('prismjs/components/');

export function extHighlightCode({selector}): Transform {

  return through2.obj((file, _, next: TransformCallback) => {
    const $ = cheerio.load(file.contents.toString(), {decodeEntities: false});

    $(selector).each((index, code) => {
      const elem = $(code);
      const language = elem.prop('data-lang');
      const fileContents = elem.html();
      loadLanguages(language)
      const highlightedContents = Prism.highlight(fileContents, Prism.languages[language], language);
      elem.parent().replaceWith(`<pre class="language-${language}">${highlightedContents}</pre>`);
      elem.addClass('highlights');
    });

    file.contents = Buffer.from($.html());
    next(null, file)
  });
}

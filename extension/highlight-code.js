'use strict';

const map = require('map-stream');
const Prism = require('node-prismjs');
const cheerio = require('cheerio');

module.exports = function ({ selector }) {

  const updateComment = (html, language) => {
    let startSeparator = '//';
    let endSeparator = '';
    switch (language) {
      case 'shell':
        startSeparator = '#';
        break;
      case 'html':
        startSeparator = '<!--';
        endSeparator = '-->';
        break;
    }

    return html.replace(/<span class=\"token operator\">&lt;<\/span>b <span class=\"token keyword\">class<\/span><span class=\"token operator\">=<\/span><span class=\"token string\">\"conum\"<\/span><span class=\"token operator\">><\/span><span class=\"token punctuation\">\(<\/span><span class=\"token number\">/g, startSeparator + ' (')
               .replace(/<\/span><span class=\"token punctuation\">\)<\/span><span class=\"token operator\">&lt;<\/span><span class=\"token operator\">\/<\/span>b<span class=\"token operator\">><\/span>/g, ')' + endSeparator);

  };

  return map((file, next) => {
    const $ = cheerio.load(file.contents.toString(), { decodeEntities: false });

    $(selector).each((index, code) => {
      const elem = $(code);
      const language = elem.prop('data-lang');
      const fileContents = elem.html();
      const highlightedContents = Prism.highlight(fileContents,  Prism.languages[language] || Prism.languages.autoit);
      elem.parent().replaceWith( `<pre class="language-${language}">${updateComment(highlightedContents)}</pre>`);
      elem.addClass('highlights');
    });

    file.contents = Buffer.from($.html());
    next(null, file)
  });
};

'use strict';

import {mapStream} from "./utils/map-stream";

const Prism = require('node-prismjs');
const cheerio = require('cheerio');

export function extHighlightCode({selector}) {

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
            .replace(/<span class=\"token operator\">=<\/span><span class=\"token operator\">&amp;<\/span>gt<span class=\"token punctuation\">;<\/span>/g, '=>')
            .replace(/<span class=\"token punctuation\">\)<\/span><span class=\"token operator\">&lt;<\/span><span class=\"token operator\">\/<\/span>b<span class=\"token operator\">><\/span>/g, ')' + endSeparator);


    };

    const updateJava = (html, language) => {
        if (language === 'java' || language === 'Java') {
            return html.replace(/<span class=\"token operator\">&amp;<\/span>lt<span class=\"token punctuation\">;<\/span>/g, '&lt;')
                .replace(/<span class=\"token operator\">&amp;<\/span>gt<span class=\"token punctuation\">;<\/span>/g, '&gt;')
        }
        return html;
    };

    return mapStream((file, next) => {
        const $ = cheerio.load(file.contents.toString(), {decodeEntities: false});

        $(selector).each((index, code) => {
            const elem = $(code);
            const language = elem.prop('data-lang');
            const fileContents = elem.html();
            const highlightedContents = Prism.highlight(fileContents, Prism.languages[language] || Prism.languages.autoit);
            const htmlWithComments = updateComment(highlightedContents, language);
            const finalHtml = updateJava(htmlWithComments, language);
            elem.parent().replaceWith(`<pre class="language-${language}">${finalHtml}</pre>`);
            elem.addClass('highlights');
        });

        file.contents = Buffer.from($.html());
        next(null, file)
    });
};

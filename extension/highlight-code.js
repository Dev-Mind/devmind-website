'use strict';
exports.__esModule = true;
exports.extHighlightCode = void 0;
var through2 = require("through2");
var Prism = require('prismjs');
var cheerio = require('cheerio');
var loadLanguages = require('prismjs/components/');
function extHighlightCode(_a) {
    var selector = _a.selector;
    var updateSpecialCharacters = function (html) {
        return html
            .replace(/&amp;lt<span class="token punctuation">;<\/span>/g, '&lt;')
            .replace(/&amp;gt<span class="token punctuation">;<\/span>/g, '&gt;')
            .replace(/<span class=\"token operator\">&amp;<\/span>quot<span class=\"token punctuation\">;<\/span>/g, '&quot;')
            .replace(/<span class=\"token operator\">&amp;<\/span>lt<span class=\"token punctuation\">;<\/span>/g, '&lt;')
            .replace(/<span class=\"token operator\">&amp;<\/span>apos<span class=\"token punctuation\">;<\/span>/g, '&apos;')
            .replace(/<span class=\"token operator\">&amp;<\/span>gt<span class=\"token punctuation\">;<\/span>/g, '&gt;');
    };
    return through2.obj(function (file, _, next) {
        var $ = cheerio.load(file.contents.toString(), {
            decodeEntities: true,
            lowerCaseTags: false,
            withEndIndices: false,
            normalizeWhitespace: false,
            recognizeSelfClosing: true
        });
        $(selector).each(function (index, code) {
            var elem = $(code);
            var language = elem.prop('data-lang') || 'javascript';
            var fileContents = elem.html();
            loadLanguages(language);
            var highlightedContents = Prism.highlight(fileContents, Prism.languages[language], language);
            var finalHtml = updateSpecialCharacters(highlightedContents);
            elem.parent().replaceWith("<pre class=\"language-" + language + "\">" + finalHtml + "</pre>");
            elem.addClass('highlights');
        });
        file.contents = Buffer.from($.html());
        next(null, file);
    });
}
exports.extHighlightCode = extHighlightCode;

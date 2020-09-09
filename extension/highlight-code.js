'use strict';
exports.__esModule = true;
exports.extHighlightCode = void 0;
var through2 = require("through2");
var Prism = require('node-prismjs');
var cheerio = require('cheerio');
function extHighlightCode(_a) {
    var selector = _a.selector;
    var updateComment = function (html, language) {
        var startSeparator = '//';
        var endSeparator = '';
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
    var updateJava = function (html, language) {
        if (language === 'java' || language === 'Java') {
            return html.replace(/<span class=\"token operator\">&amp;<\/span>lt<span class=\"token punctuation\">;<\/span>/g, '&lt;')
                .replace(/<span class=\"token operator\">&amp;<\/span>gt<span class=\"token punctuation\">;<\/span>/g, '&gt;');
        }
        return html;
    };
    return through2.obj(function (file, _, next) {
        var $ = cheerio.load(file.contents.toString(), { decodeEntities: false });
        $(selector).each(function (index, code) {
            var elem = $(code);
            var language = elem.prop('data-lang');
            var fileContents = elem.html();
            var highlightedContents = Prism.highlight(fileContents, Prism.languages[language] || Prism.languages.autoit);
            var htmlWithComments = updateComment(highlightedContents, language);
            var finalHtml = updateJava(htmlWithComments, language);
            elem.parent().replaceWith("<pre class=\"language-" + language + "\">" + finalHtml + "</pre>");
            elem.addClass('highlights');
        });
        file.contents = Buffer.from($.html());
        next(null, file);
    });
}
exports.extHighlightCode = extHighlightCode;

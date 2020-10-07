'use strict';
exports.__esModule = true;
exports.extHighlightCode = void 0;
var through2 = require("through2");
var Prism = require('prismjs');
var cheerio = require('cheerio');
var loadLanguages = require('prismjs/components/');
function extHighlightCode(_a) {
    var selector = _a.selector;
    return through2.obj(function (file, _, next) {
        var $ = cheerio.load(file.contents.toString(), { decodeEntities: false });
        $(selector).each(function (index, code) {
            var elem = $(code);
            var language = elem.prop('data-lang') || 'javascript';
            var fileContents = elem.html();
            loadLanguages(language);
            var highlightedContents = Prism.highlight(fileContents, Prism.languages[language], language);
            elem.parent().replaceWith("<pre class=\"language-" + language + "\">" + highlightedContents + "</pre>");
            elem.addClass('highlights');
        });
        file.contents = Buffer.from($.html());
        next(null, file);
    });
}
exports.extHighlightCode = extHighlightCode;

'use strict';
exports.__esModule = true;
var time_1 = require("./utils/time");
var map_stream_1 = require("./utils/map-stream");
var asciidoctorOptions = {
    safe: 'safe',
    doctype: 'article',
    header_footer: false,
    attributes: {
        imagesdir: '/assets/images'
    }
};
/**
 * Read a stream of Asciidoc files and build for each HTML file. If you use code example in your asciidoc a feature to highlight language keywords.
 * - a templateModel, a structure JSON used after with handlebar and
 * - an indexData object used to build an index file used by other extensions
 *
 * Example of usage
 * ----
 * gulp.task('adoc-template', () => gulp.src(`src/html/*.html`)
 *     .pipe(website.readAsciidoc())
 *     .pipe(website.convertToHtml())
 *     .pipe(website.applyTemplate(`src/templates/site.handlebars`))
 *     .pipe(gulp.dest('build/dist')));
 *----
 *
 * @param options
 * @return stream
 */
function extReadAsciidoc(options) {
    var asciidoctor = require(options.path + "node_modules/asciidoctor.js/dist/node/asciidoctor")();
    return map_stream_1.mapStream(function (file, next) {
        var opts = Object.assign({}, asciidoctorOptions, {});
        opts.attributes = Object.assign({}, opts.attributes);
        var asciidoc = file.contents.toString();
        file.ast = asciidoctor.load(asciidoc, opts);
        file.attributes = file.ast.getAttributes();
        var filename = file.path.substring(file.path.lastIndexOf("/") + 1, file.path.lastIndexOf("."));
        var dir = '';
        if (file.path.lastIndexOf("blog/") > 0) {
            dir = file.path.substring(file.path.lastIndexOf("blog/") + "blog/".length, file.path.lastIndexOf("/"));
        }
        if (file.path.lastIndexOf("training/") > 0) {
            dir = file.path.substring(file.path.lastIndexOf("training/") + "training/".length, file.path.lastIndexOf("/"));
        }
        var indexData = {
            strdate: file.attributes.revdate,
            revdate: time_1.convertDateEn(file.attributes.revdate),
            description: file.attributes.description,
            doctitle: file.attributes.doctitle,
            keywords: file.attributes.keywords.split(","),
            filename: filename,
            category: file.attributes.category,
            teaser: file.attributes.teaser,
            imgteaser: file.attributes.imgteaser,
            modeDev: options.modeDev,
            blog: true,
            dir: dir,
            priority: 0.6
        };
        // make all model properties accessible through fat-arrow "getters"
        // this way, file.* values can be changed before templating
        file.templateModel = {
            keywords: function () { return indexData.keywords; },
            title: function () { return indexData.doctitle; },
            revdate: function () { return indexData.revdate; },
            gendate: function () { return indexData.strdate; },
            genInstant: function () { return time_1.currentDateIso(); },
            contents: function () { return file.contents; },
            'github-edit-url': function () { return file.git.githubEditUrl; },
            filename: function () { return indexData.filename; },
            dir: function () { return indexData.dir; },
            category: function () { return indexData.category; },
            teaser: function () { return indexData.teaser; },
            imgteaser: function () { return indexData.imgteaser; },
            status: function () { return file.attributes.status; },
            modedev: function () { return indexData.modeDev; },
            canonicalUrl: function () { return "blog/" + dir + "/" + filename + ".html"; }
        };
        if (file.attributes.status !== 'draft') {
            file.indexData = indexData;
        }
        next(null, file);
    });
}
exports.extReadAsciidoc = extReadAsciidoc;

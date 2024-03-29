'use strict';
exports.__esModule = true;
exports.extReadAsciidoc = void 0;
var time_1 = require("./utils/time");
var through2 = require("through2");
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
    return through2.obj(function (file, _, next) {
        var opts = Object.assign({}, asciidoctorOptions, {});
        opts.attributes = Object.assign({}, opts.attributes);
        var asciidoc = file.contents.toString();
        file.ast = asciidoctor.load(asciidoc, opts);
        file.attributes = file.ast.getAttributes();
        var filename = file.path.substring(file.path.lastIndexOf("/") + 1, file.path.lastIndexOf("."));
        var dir = '';
        var subdirectory = '';
        if (options.dirNames && options.dirNames.length > 0) {
            options.dirNames.forEach(function (dirname) {
                if (file.path.lastIndexOf(dirname) > 0) {
                    dir = file.path.substring(file.path.lastIndexOf(dirname) + dirname.length, file.path.lastIndexOf("/"));
                    subdirectory = dirname;
                }
            });
        }
        else {
            if (file.path.lastIndexOf("blog/") > 0) {
                dir = file.path.substring(file.path.lastIndexOf("blog/") + "blog/".length, file.path.lastIndexOf("/"));
                subdirectory = 'blog';
            }
            if (file.path.lastIndexOf("training/") > 0) {
                dir = file.path.substring(file.path.lastIndexOf("training/") + "training/".length, file.path.lastIndexOf("/"));
                subdirectory = 'training';
            }
        }
        var indexData = {
            strdate: file.attributes.revdate,
            revdate: time_1.convertDateEn(file.attributes.revdate),
            description: file.attributes.description,
            doctitle: file.attributes.doctitle,
            keywords: file.attributes.keywords ? file.attributes.keywords.split(",") : undefined,
            filename: filename,
            category: file.attributes.category,
            teaser: file.attributes.teaser,
            imgteaser: file.attributes.imgteaser,
            subdirectory: subdirectory,
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
            canonicalUrl: function () { return (subdirectory + "/" + dir + "/" + filename + ".html").replace('//', '/'); }
        };
        if (file.attributes.status !== 'draft') {
            file.indexData = indexData;
        }
        next(null, file);
    });
}
exports.extReadAsciidoc = extReadAsciidoc;

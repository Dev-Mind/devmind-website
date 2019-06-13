'use strict';
import {DevMindGulpBuilder} from './index';
import {dest, parallel, series, src, task} from 'gulp';

const website = new DevMindGulpBuilder({path: '../'});
const HANDLEBARS_PARTIALS = [
    {key: '_page_header', path: 'src/templates/_page_header.handlebars'}
];


task('blog-indexing', () =>
    src('src/blog/**/*.adoc')
        .pipe(website.readAsciidoc())
        .pipe(website.convertToHtml())
        .pipe(website.convertToJson('blogindex.json'))
        .pipe(dest('build/.tmp'))
);

task('blog-rss', () =>
    src('build/.tmp/blogindex.json')
        .pipe(website.readIndex())
        .pipe(website.convertToRss('blog.xml'))
        .pipe(dest('build/dist/rss'))
);

task('blog-list', () =>
    src('build/.tmp/blogindex.json')
        .pipe(website.readIndex())
        .pipe(website.convertToBlogList('src/templates/site.handlebars', HANDLEBARS_PARTIALS, 'site.html', 1))
        .pipe(dest('build/dist'))
);

task('blog-page', (cb) => {
    src('src/blog/**/*.adoc')
        .pipe(website.readAsciidoc())
        .pipe(website.convertToHtml())
        .pipe(website.highlightCode({selector: 'pre.highlight code'}))
        .pipe(
            website.convertToBlogPage('src/templates/site.handlebars', HANDLEBARS_PARTIALS, 'build/.tmp/blogindex.json'))
        .pipe(dest('build/dist/blog'))
        .on('end', () => cb())
});

task('blog', series('blog-indexing', 'blog-page', 'blog-list', 'blog-rss'));

task('html-indexing', () =>
    src(`src/html/**/*.html`)
        .pipe(website.readHtml())
        .pipe(website.convertToJson('pageindex.json'))
        .pipe(dest('build/.tmp')));

task('html-template', () =>
    src(`src/html/**/*.html`)
        .pipe(website.readHtml())
        .pipe(website.applyTemplate(`src/templates/site.handlebars`, HANDLEBARS_PARTIALS))
        .pipe(dest('build/.tmp'))
        .pipe(dest('build/dist')));

task('html', parallel('html-indexing', 'html-template'));

task('sitemap', () =>
    src(['build/.tmp/blogindex.json', 'build/.tmp/pageindex.json'])
        .pipe(website.readIndex())
        .pipe(website.convertToSitemap())
        .pipe(dest('build/dist'))
);

task('check', () =>
    src([ // We must have a blog index page
        'build/.tmp/blogindex.json',
        // We must have a page index page
        'build/.tmp/pageindex.json',
        // We must have a RSS file
        'build/dist/rss/blog.xml',
        // We must have a site map
        'build/dist/sitemap.xml',
        // We must have an HTML page generated
        'build/dist/index.html',
        // We must have an pure teplate page generated
        'build/dist/site.html',
        // We must have a blog page
        'build/dist/blog/2018/test.html'
    ])
        .pipe(website.filesExist())
        .pipe(dest('build/check'))
);

task('default', series('blog', 'html', 'sitemap', 'check'));
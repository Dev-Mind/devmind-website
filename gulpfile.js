'use strict';

const gulp = require('gulp');
const website = require('./index')({path: '../'});

const HANDLEBARS_PARTIALS = [
  {key: '_page_header', path: 'src/templates/_page_header.handlebars'}
];

gulp.task('blog-indexing', () =>
  gulp.src('src/blog/**/*.adoc')
      .pipe(website.readAsciidoc())
      .pipe(website.convertToHtml())
      .pipe(website.convertToJson('blogindex.json'))
      .pipe(gulp.dest('build/.tmp'))
);

gulp.task('blog-rss', () =>
  gulp.src('build/.tmp/blogindex.json')
      .pipe(website.readIndex())
      .pipe(website.convertToRss('blog.xml'))
      .pipe(gulp.dest('build/dist/rss'))
);

gulp.task('blog-list', () =>
  gulp.src('build/.tmp/blogindex.json')
      .pipe(website.readIndex())
      .pipe(website.convertToBlogList('src/templates/site.handlebars', HANDLEBARS_PARTIALS, 'site.html', 1))
      .pipe(gulp.dest('build/dist'))
);

gulp.task('blog-page', (cb) => {
  gulp.src('src/blog/**/*.adoc')
      .pipe(website.readAsciidoc())
      .pipe(website.convertToHtml())
      .pipe(website.highlightCode({selector: 'pre.highlight code'}))
      .pipe(
        website.convertToBlogPage('src/templates/site.handlebars', HANDLEBARS_PARTIALS, 'build/.tmp/blogindex.json'))
      .pipe(gulp.dest('build/dist/blog'))
      .on('end', () => cb())
});

gulp.task('blog', gulp.series('blog-indexing', 'blog-page', 'blog-list', 'blog-rss'), cb => cb());

gulp.task('html-indexing', () =>
  gulp.src(`src/html/**/*.html`)
      .pipe(website.readHtml())
      .pipe(website.convertToJson('pageindex.json'))
      .pipe(gulp.dest('build/.tmp')));

gulp.task('html-template', () =>
  gulp.src(`src/html/**/*.html`)
      .pipe(website.readHtml())
      .pipe(website.applyTemplate(`src/templates/site.handlebars`, HANDLEBARS_PARTIALS))
      .pipe(gulp.dest('build/.tmp'))
      .pipe(gulp.dest('build/dist')));

gulp.task('html', gulp.parallel('html-indexing', 'html-template'));

gulp.task('sitemap', () =>
  gulp.src(['build/.tmp/blogindex.json', 'build/.tmp/pageindex.json'])
      .pipe(website.readIndex())
      .pipe(website.convertToSitemap())
      .pipe(gulp.dest('build/dist'))
);

gulp.task('check', () =>
  gulp.src([ // We must have a blog index page
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
      .pipe(website.extFilesExist())
      .pipe(gulp.dest('build/check'))
);

gulp.task('default', gulp.series('blog', 'html', 'sitemap', 'check'), cb => cb());
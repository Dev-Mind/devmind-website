const extReadHtml = require('./extension/read-html');
const extApplyTemplate = require('./extension/apply-template');
const extFileExist = require('./extension/file-exist');
const extFilesExist = require('./extension/files-exist');
const extHighlightCode = require('./extension/highlight-code');

const extReadAsciidoc = require('./extension/read-asciidoctor');
const extReadIndex = require('./extension/read-index');

const extConvertToHtml = require('./extension/convert-to-html');
const extConvertToJson = require('./extension/convert-to-json');
const extConvertToRss = require('./extension/convert-to-rss');
const extConvertToSitemap = require('./extension/convert-to-sitemap');
const extConvertToBlogList = require('./extension/convert-to-blog-list');
const extConvertToBlogPage = require('./extension/convert-to-blog-page');

const isProd = process.env.NODE_ENV && process.env.NODE_ENV === 'prod';

const checkOptions = (options) => {
  if (!options.path) {
    options.path = '../../../';
  }
  if(!options.metadata){
    options.metadata = {};
    if(!options.metadata.rss){
      options.metadata.rss = 'src/metadata/rss.json';
    }
    if(!options.metadata.blog){
      options.metadata.blog = 'src/metadata/blog.json';
    }
    if(!options.metadata.html){
      options.metadata.html = 'src/metadata/html.json';
    }
    if(!options.metadata.sitemap){
      options.metadata.sitemap = 'src/metadata/sitemap.json';
    }
  }
  options.modeDev = !isProd;
  console.log(`This plugin is running in mode ${isProd ? 'PROD' : 'DEV'}`);
};

function website(options) {
  if (!options) {
    options = {};
  }
  checkOptions(options);
  return {
    applyTemplate: (handlebarsTemplateFile, partials) => extApplyTemplate(options, handlebarsTemplateFile, partials),

    extFilesExist : () => extFilesExist(options),
    fileExist: () => extFileExist(filePath),
    highlightCode: (selector) => extHighlightCode(selector),

    readAsciidoc: () => extReadAsciidoc(options),
    readHtml: () => extReadHtml(options),
    readIndex: () => extReadIndex(),

    convertToHtml: () => extConvertToHtml(),
    convertToJson: (fileName) => extConvertToJson(fileName),
    convertToRss: (filename) => extConvertToRss(options, filename),
    convertToSitemap: () => extConvertToSitemap(options),
    convertToBlogList: (handlebarsTemplateFile, partials, filename, nbArticleMax) => extConvertToBlogList(options, handlebarsTemplateFile, partials, filename, nbArticleMax),
    convertToBlogPage: (handlebarsTemplateFile, partials, blogIndexFile) => extConvertToBlogPage(options, handlebarsTemplateFile, partials, blogIndexFile)
  };
}


module.exports = website;
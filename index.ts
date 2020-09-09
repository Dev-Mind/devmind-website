import {HandlebarsTemplate, Options} from "./extension/model";
import {extApplyTemplate} from "./extension/apply-template";
import {extReadIndex} from "./extension/read-index";
import {extReadAsciidoc} from "./extension/read-asciidoctor";
import {extConvertToHtml} from "./extension/convert-to-html";
import {extConvertToJson} from "./extension/convert-to-json";
import {extConvertToRss} from "./extension/convert-to-rss";
import {extConvertToBlogList} from "./extension/convert-to-blog-list";
import {extConvertToBlogPage} from "./extension/convert-to-blog-page";
import {extFileExist} from "./extension/file-exist";
import {extFilesExist} from "./extension/files-exist";
import {extHighlightCode} from "./extension/highlight-code";
import {extReadHtml} from "./extension/read-html";
import {Transform} from "stream";
import {extConvertToSitemap} from "./extension/convert-to-sitemap";


const defaultOptions: Options = {
  path: '../../../',
  modeDev: true,
  metadata: {
    rss: 'src/metadata/rss.json',
    blog: 'src/metadata/blog.json',
    html: 'src/metadata/html.json',
    sitemap: 'src/metadata/sitemap.json'
  }
};

export class DevMindGulpBuilder {

  constructor(givenOptions?: Options) {
    this.options = defaultOptions;
    this.options.modeDev = !(process.env.NODE_ENV && process.env.NODE_ENV === 'prod');
    if (givenOptions) {
      this.options.path = givenOptions.path || defaultOptions.path;
      if (givenOptions.metadata) {
        this.options.metadata.rss = givenOptions.metadata.rss || defaultOptions.metadata.rss;
        this.options.metadata.blog = givenOptions.metadata.blog || defaultOptions.metadata.blog;
        this.options.metadata.html = givenOptions.metadata.html || defaultOptions.metadata.html;
        this.options.metadata.sitemap = givenOptions.metadata.sitemap || defaultOptions.metadata.sitemap;
      }
    }
  }

  private readonly options: Options;

  applyTemplate(handlebarsTemplateFile: string, partials: Array<HandlebarsTemplate>) {
    return extApplyTemplate(this.options, handlebarsTemplateFile, partials);
  }


  convertToHtml(): Transform {
    return extConvertToHtml();
  }

  convertToJson(filename: string): Transform {
    return extConvertToJson(filename);
  }

  convertToRss(filename: string): Transform {
    return extConvertToRss(this.options, filename);
  }

  convertToSitemap(): Transform {
    return extConvertToSitemap(this.options);
  }

  convertToBlogList(handlebarsTemplateFile: string,
                    partials: Array<HandlebarsTemplate>,
                    filename: string,
                    nbArticleMax: number): Transform {
    return extConvertToBlogList(this.options, handlebarsTemplateFile, partials, filename, nbArticleMax);
  }

  convertToBlogPage(handlebarsTemplateFile: string,
                    partials: Array<HandlebarsTemplate>,
                    blogIndexFile: string): Transform {
    return extConvertToBlogPage(this.options, handlebarsTemplateFile, partials, blogIndexFile);
  }

  fileExist(filePath: string): boolean {
    return extFileExist(filePath);
  }


  filesExist(): Transform {
    return extFilesExist(this.options);
  }

  highlightCode(selector): Transform {
    return extHighlightCode(selector);
  }

  readAsciidoc(): Transform {
    return extReadAsciidoc(this.options);
  }

  readHtml(): Transform {
    return extReadHtml(this.options);
  }

  readIndex(): Transform {
    return extReadIndex();
  }
}

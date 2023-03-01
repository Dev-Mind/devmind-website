export const FILE_ENCODING = 'utf8';

export interface Metadata {
  rss?: string;
  blog?: string;
  html?: string;
  sitemap?: string;
}

export interface Options {
  path?: string;
  modeDev?: boolean;
  metadata?: Metadata;
  dirNames: Array<string>;
}

export interface HandlebarsTemplate {
  key: string;
  path: string;
}

export interface IndexData {
  // Date to display in our DATE_FORMAT
  strdate: string;
  // Instant when data was generated
  revdate: string;
  // Name of the page
  doctitle: string;
  // Summary for indexation
  description: string;
  // Keywords associated to the page
  keywords: Array<string>;
  // The filename
  filename: string;
  // prioriry for indexation bots
  priority: number;
  // for asciidoc you can define your page in a subdirectory (usefull for a blog with a subdirectory per year, or by topic)
  dir: string;
}

export interface IndexBlogData extends IndexData {
  // to regroup elements
  category: string;
  // little teaser to introduce the page
  teaser: string;
  // image to use with this teaser (used on https://www.dev-mind.fr/ to display page blog with all articles)
  imgteaser: string;
  // read in environment variables
  modeDev: boolean;
  // boolean to say if the page is a blog post or not
  blog: boolean;
}

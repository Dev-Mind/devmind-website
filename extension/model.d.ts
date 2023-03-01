export declare const FILE_ENCODING = "utf8";
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
    strdate: string;
    revdate: string;
    doctitle: string;
    description: string;
    keywords: Array<string>;
    filename: string;
    priority: number;
    dir: string;
}
export interface IndexBlogData extends IndexData {
    category: string;
    teaser: string;
    imgteaser: string;
    modeDev: boolean;
    blog: boolean;
}

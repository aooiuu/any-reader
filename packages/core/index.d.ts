declare enum ContentType {
    MANGA = 0,
    NOVEL = 1,
    VIDEO = 2,
    AUDIO = 3,
    RSS = 4,
    NOVELMORE = 5
}
interface Rule {
    searchUrl: string;
    host: string;
    searchList: string;
    searchCover: string;
    searchName: string;
    searchAuthor: string;
    searchChapter: string;
    searchDescription: string;
    searchResult: string;
    chapterUrl: string;
    chapterName: string;
    chapterList: string;
    chapterCover: string;
    chapterTime: string;
    chapterResult: string;
    contentItems: string;
    id: string;
    name: string;
    sort: number;
    contentType: ContentType;
    cookies?: string;
}
interface SearchItem {
    cover: string;
    name: string;
    author: string;
    chapter: string;
    description: string;
    url: string;
}
interface ChapterItem {
    url: string;
    name: string;
    contentUrl?: string;
    cover?: string;
    time?: string;
}
declare class RuleManager {
    rule: Rule;
    constructor(rule: Rule);
    /**
     *
     * @param url
     * @param keyword
     * @param result
     * @returns
     */
    fetch(url: string, keyword?: string, result?: string): Promise<{
        params: any;
        body: any;
    }>;
    search(keyword: string): Promise<SearchItem[]>;
    getChapter(result: string): Promise<ChapterItem[]>;
    getContent(result: string, lastResult?: string): Promise<string[]>;
}

declare abstract class Analyzer {
    abstract parse(content: string): void;
    abstract getString(rule: string): Promise<string>;
    abstract getStringList(rule: string): Promise<string[]>;
    abstract getElements(rule: string): Promise<string | string[]>;
}

declare class SingleRule {
    analyzer: Analyzer;
    rule: string;
    replace: string;
    constructor(analyzer: Analyzer, rule: string, replace?: string);
}
declare class AnalyzerManager {
    private _content;
    constructor(content: string);
    splitRuleReversed(rule: string): SingleRule[];
    _getElements(r: SingleRule, rule?: string): Promise<string | string[]>;
    getElements(rule: string): Promise<any[]>;
    replaceSmart(replace: string): (s: string) => string;
    _getString(r: SingleRule, rule?: string): Promise<string>;
    getString(rule: string): Promise<string>;
    _getStringList(r: SingleRule, rule?: string): Promise<string[]>;
    getStringList(rule: string): Promise<string[]>;
    getUrl(rule: string, host: string): Promise<string>;
}

declare function decodeRule(text: string): any;

export { AnalyzerManager, ChapterItem, ContentType, Rule, RuleManager, SearchItem, decodeRule };

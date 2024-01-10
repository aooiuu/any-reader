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
    fetch(url: string, keyword?: string, result?: string): Promise<any>;
    search(keyword: string): Promise<SearchItem[]>;
    getChapter(url: string): Promise<ChapterItem[]>;
    getContent(url: string): Promise<string>;
}

declare abstract class Analyzer {
    abstract parse(content: string): void;
    abstract getString(rule: string): Promise<string[]>;
    abstract getStringList(rule: string): void;
    abstract getElements(rule: string): string | string[];
}

declare class AnalyzerHtml implements Analyzer {
    _content: string;
    parse(content: string): void;
    getString(rule: string): Promise<string[]>;
    _getResult(lastRule: string, html?: string): string;
    getStringList(rule: string): Promise<string[]>;
    getElements(rule: string): string[];
}

declare class AnalyzerJS implements Analyzer {
    _content: string;
    parse(content: string): void;
    getString(): Promise<string[]>;
    _getResult(): string;
    getStringList(): Promise<string[]>;
    getElements(rule: string): any;
}

declare class AnalyzerJSonPath implements Analyzer {
    _content: any;
    parse(content: string | any): void;
    getString(rule: string): Promise<string[]>;
    _getResult(rule: string): string;
    getStringList(rule: string): Promise<string[]>;
    getElements(rule: string): any;
}

declare class SingleRule {
    analyzer: Analyzer;
    rule: string;
    constructor(analyzer: Analyzer, rule: string);
}
declare class AnalyzerManager {
    private _content;
    constructor(content: string);
    splitRuleReversed(rule: string): SingleRule[];
    _getElements(r: SingleRule, rule?: string): Promise<string | string[]>;
    getElements(rule: string): Promise<string[]>;
    _getString(r: SingleRule, rule?: string): Promise<string>;
    getString(rule: string): Promise<string>;
    getUrl(rule: string, host: string): Promise<string>;
}

declare function decodeRule(text: string): any;

export { AnalyzerHtml, AnalyzerJS, AnalyzerJSonPath, AnalyzerManager, ChapterItem, Rule, RuleManager, SearchItem, decodeRule };

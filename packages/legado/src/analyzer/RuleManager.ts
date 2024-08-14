import type { LegadoRule } from "../types";
import { AnalyzerManager } from "./AnalyzerManager";
import { AnalyzeUrl } from "./AnalyzeUrl";
import * as cheerio from "cheerio";
import { RuleEvaluator } from "./common";
import { Fmt } from "../utils/FormatUtils";
import { NetworkUtils } from "../utils/NetworkUtils";

abstract class RuleManager {
  rule: LegadoRule;
  constructor(rule: LegadoRule) {
    this.rule = rule;
  }
  // 搜索
  abstract search(keyword: string): Promise<unknown[]>;
  // 获取章节
  abstract getChapter(rule: string): Promise<unknown[]>;
  // 获取内容
  abstract getContent(rule: string): Promise<string[]>;
}

export interface SearchItem {
  cover: string;
  name: string;
  author: string;
  chapter: string;
  description: string;
  url: string;
}

export interface ChapterItem {
  url: string;
  name: string;
  contentUrl?: string;
  cover?: string;
  time?: string;
}

export class LegadoRuleManager implements RuleManager {
  rule: LegadoRule;

  constructor(rule: LegadoRule) {
    this.rule = rule;
  }

  async search(keyword: string): Promise<unknown[]> {
    const analyzeUrl = new AnalyzeUrl(
      this.rule.searchUrl,
      keyword,
      null,
      this.rule.bookSourceUrl,
    );
    await analyzeUrl.init();
    const resp = await analyzeUrl.getStrResponseAwait();
    const body = resp.body;
    const baseUrl = resp.raw.request.url;
    const analyzeRule = new AnalyzerManager(body);
    const list = analyzeRule.getElements(this.rule.ruleSearch.bookList);

    const bookListRule = this.rule.ruleSearch;

    const ruleName = analyzeRule.parseStrings(bookListRule.name);
    const ruleBookUrl = analyzeRule.parseStrings(bookListRule.bookUrl);
    const ruleAuthor = analyzeRule.parseStrings(bookListRule.author);
    const ruleCoverUrl = analyzeRule.parseStrings(bookListRule.coverUrl);
    const ruleIntro = analyzeRule.parseStrings(bookListRule.intro);
    // const ruleKind = analyzeRule.parseStrings(bookListRule.kind);
    const ruleLastChapter = analyzeRule.parseStrings(bookListRule.lastChapter);
    // const ruleWordCount = analyzeRule.parseStrings(bookListRule.wordCount);

    const bookList: SearchItem[] = [];

    for (const item of list) {
      bookList.push(
        this.getSearchItem(
          analyzeRule,
          item,
          baseUrl,
          ruleName,
          ruleBookUrl,
          ruleAuthor,
          ruleCoverUrl,
          ruleIntro,
          null,
          ruleLastChapter,
          null,
        ),
      );
    }

    return bookList;
  }

  getSearchItem(
    analyzeRule: AnalyzerManager,
    item: any,
    baseUrl: string,
    ruleName: RuleEvaluator | null,
    ruleBookUrl: RuleEvaluator | null,
    ruleAuthor: RuleEvaluator | null,
    ruleCoverUrl: RuleEvaluator | null,
    ruleIntro: RuleEvaluator | null,
    ruleKind: RuleEvaluator | null,
    ruleLastChapter: RuleEvaluator | null,
    ruleWordCount: RuleEvaluator | null,
  ): SearchItem {
    analyzeRule.setContent(item);
    const name = Fmt.bookName(analyzeRule.getString(ruleName));
    const author = Fmt.author(analyzeRule.getString(ruleAuthor));
    const chapter = analyzeRule.getString(ruleLastChapter);
    const description = Fmt.html(analyzeRule.getString(ruleIntro));
    const cover = NetworkUtils.getAbsoluteURL(
      baseUrl,
      analyzeRule.getString(ruleCoverUrl),
    );
    const url = analyzeRule.getString(ruleBookUrl, null, true);

    return { name, author, chapter, description, cover, url };
  }

  async getChapter(result: string): Promise<unknown[]> {
    return [result];
  }

  async getContent(result: string): Promise<string[]> {
    return [result];
  }
}

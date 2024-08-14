import { isolate } from "../javascript/vm";
import { parseJson } from "./utils";
import { RuleAnalyzer } from "./RuleAnalyzer";
import { NetworkUtils } from "../utils/NetworkUtils";
import axios, { AxiosRequestConfig } from "axios";
import { load } from "cheerio";
import contentType from "content-type";
import iconv from "iconv-lite";
import chardet from "chardet";
import { encode } from "urlencode";

const http = axios.create();

export class AnalyzeUrl {
  ruleUrl: string = "";
  private JS_PATTERN: RegExp = /<js>([\s\S]*?)<\/js>|@js:([\s\S]*)/ig;
  private pagePattern: RegExp = /<(.*?)>/;
  private paramPattern: RegExp = /\s*,\s*(?=\{)/;
  private baseUrl = "";
  private method: RequestMethod = RequestMethod.GET;
  headerMap: Record<string, string> = {};
  body: string | null = null;
  type: string | null = null;
  charset: string | null = null;
  retry: number = 0;
  useWebView: boolean = false;
  webJs: string | null = null;
  serverID: number | null = null;
  urlNoQuery: string = "";
  fieldMap: Record<string, string> = {};

  constructor(url: string);
  constructor(url: string, key?: string | null);
  constructor(url: string, key?: string | null, page?: number | null);
  constructor(
    url: string,
    key?: string | null,
    page?: number | null,
    baseUrl?: string,
  );
  constructor(
    public url: string,
    public key?: string | null,
    public page?: number | null,
    baseUrl?: string,
  ) {
    baseUrl ??= "";
    const urlMatcher = this.paramPattern.exec(baseUrl);
    if (urlMatcher) {
      this.baseUrl = baseUrl.substring(0, urlMatcher.index);
      this.paramPattern.lastIndex = 0;
    } else {
      this.baseUrl = baseUrl;
    }

    this.headerMap["User-Agent"] =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36";
  }

  async init() {
    await this.initUrl();
    return this;
  }

  private async initUrl() {
    this.ruleUrl = this.url;
    await this.analyzeJs();
    await this.replaceKeyPageJs();
    await this.analyzeUrl();
  }

  /**
   * 执行 @js,<js></js>
   */
  private async analyzeJs(): Promise<void> {
    let start = 0;
    let result = this.ruleUrl;
    let match: RegExpExecArray | null;

    while ((match = this.JS_PATTERN.exec(this.ruleUrl)) !== null) {
      if (match.index > start) {
        const substring = this.ruleUrl.substring(start, match.index).trim();
        if (substring.length > 0) {
          result = substring.replace("@result", result);
        }
      }

      result = (await this.evalJS(match[1] || match[2], result)).toString();
      start = match.index + match[0].length; // 更新开始索引
    }

    if (this.ruleUrl.length > start) {
      const substring = this.ruleUrl.substring(start).trim();
      if (substring.length > 0) {
        result = substring.replace("@result", result);
      }
    }

    this.ruleUrl = result;
  }

  /**
   * 替换关键字,页数,JS
   */
  private async replaceKeyPageJs(): Promise<void> {
    // 此方法没有返回值
    // 先替换内嵌规则再替换页数规则，避免内嵌规则中存在大于小于号时，规则被切错
    // js
    if (this.ruleUrl.includes("{{") && this.ruleUrl.includes("}}")) {
      const analyze = new RuleAnalyzer(this.ruleUrl); // 创建解析
      // 替换所有内嵌 {{js}}
      const url = await analyze.innerRule2("{{", "}}", async (it: string) => {
        const jsEval = (await this.evalJS(it)) ?? "";
        if (typeof jsEval === "string") {
          return jsEval;
        } else {
          return String(jsEval);
        }
      });

      if (url) {
        this.ruleUrl = url;
      }
    }

    // page
    if (this.page) {
      let match = this.pagePattern.exec(this.ruleUrl);
      while (match) {
        const pages = match[1].split(","); // 获取匹配组
        this.ruleUrl =
          this.page < pages.length
            ? this.ruleUrl.replace(match[0], pages[this.page - 1].trim())
            : this.ruleUrl.replace(match[0], pages[pages.length - 1].trim());

        // 继续查找下一个匹配
        match = this.pagePattern.exec(this.ruleUrl);
      }
    }
  }

  /**
   * 解析 Url
   */
  private async analyzeUrl(): Promise<void> {
    // 使用正则表达式查找第一个 ',' 前的部分
    const urlMatcher = this.paramPattern.exec(this.ruleUrl);
    const urlNoOption = urlMatcher
      ? this.ruleUrl.substring(0, urlMatcher.index)
      : this.ruleUrl;

    this.url = NetworkUtils.getAbsoluteURL(this.baseUrl, urlNoOption);
    const baseUrlResult = NetworkUtils.getBaseUrl(this.url);
    if (baseUrlResult) {
      this.baseUrl = baseUrlResult;
    }

    if (urlNoOption.length !== this.ruleUrl.length) {
      const optionJson = this.ruleUrl.substring(
        urlMatcher!.index + urlMatcher![0].length,
      ); // 获取选项 JSON 部分
      const obj = parseJson<any>(optionJson);
      const option: UrlOption = obj
        ? Object.assign(new UrlOption(), obj)
        : null;

      if (option) {
        const method = option.getMethod();
        if (method && method.toUpperCase() === "POST") {
          this.method = RequestMethod.POST;
        }

        const headerMap = option.getHeaderMap();
        if (headerMap) {
          Object.entries(headerMap).forEach(([key, value]) => {
            this.headerMap[key.toString()] = value.toString();
          });
        }

        const body = option.getBody();
        if (body) {
          this.body = body;
        }

        this.type = option.getType();
        this.charset = option.getCharset();
        this.retry = option.getRetry();
        this.useWebView = option.useWebView();
        this.webJs = option.getWebJs();

        const jsStr = option.getJs();
        if (jsStr) {
          const evalResult = await this.evalJS(jsStr, this.url);
          if (evalResult) {
            this.url = evalResult.toString();
          }
        }

        this.serverID = option.getServerID();
      }
    }

    this.urlNoQuery = this.url;
    switch (this.method) {
      case RequestMethod.GET:
        const pos = this.url.indexOf("?");
        if (pos !== -1) {
          this.analyzeFields(this.url.substring(pos + 1));
          this.urlNoQuery = this.url.substring(0, pos);
        }
        break;
      case RequestMethod.POST:
        if (this.body) {
          if (
            !this.isJson(this.body) &&
            !this.isXml(this.body) &&
            !this.headerMap["Content-Type"]
          ) {
            this.analyzeFields(this.body);
          }
        }
        break;
    }
  }
  analyzeFields(fieldsTxt: string): void {
    const queryS = fieldsTxt.split("&").filter((s) => !!s.trim());

    for (const query of queryS) {
      const queryPair = query.split("=", 2).filter((s) => !!s.trim());
      const key = queryPair[0];
      const value = queryPair[1] || "";

      if (!this.charset) {
        if (NetworkUtils.hasUrlEncoded(value)) {
          this.fieldMap[key] = value;
        } else {
          this.fieldMap[key] = encodeURIComponent(value);
        }
      } else if (this.charset === "escape") {
        this.fieldMap[key] = escape(value);
      } else {
        this.fieldMap[key] = encode(value, this.charset);
      }
    }
  }

  async getStrResponseAwait() {
    const requestConfig: AxiosRequestConfig<any> = {
      responseType: "arraybuffer",
      responseEncoding: undefined,
      validateStatus(status: number) {
        return true;
      },
      paramsSerializer(params) {
        return Object.keys(params)
          .map((key) => `${key}=${params[key]}`)
          .join("&");
      },
    };
    requestConfig.url = this.urlNoQuery;
    requestConfig.method = this.method;
    requestConfig.data = this.body;
    requestConfig.headers = this.headerMap;
    if (this.method === RequestMethod.GET) {
      requestConfig.params = this.fieldMap;
    } else if (this.method === RequestMethod.POST) {
      if (
        Object.keys(this.fieldMap).length > 0 ||
        !this.body ||
        !this.body.trim()
      ) {
        requestConfig.data = Object.keys(this.fieldMap)
          .map((key) => `${key}=${this.fieldMap[key]}`)
          .join("&");
      } else {
        requestConfig.data = this.body;
      }
    }
    const resp = await http(requestConfig);
    const ct = contentType.parse(resp.headers["content-type"] || "");
    const charset = ct.parameters.charset;
    let encoding = charset || this.charset;
    if (!encoding) encoding = chardet.detect(resp.data);

    let str = iconv.decode(resp.data, encoding || "utf8");
    if (ct.type === "text/html" && /<!doctype html>/i.test(str))
      str = load(str, null, true).html();
    return {
      raw: resp,
      body: str
    };
  }

  isJson(text: string | null): boolean {
    if (!text) return false;
    const str = text.trim();
    return (
      (str.startsWith("{") && str.endsWith("}")) ||
      (str.startsWith("[") && str.endsWith("]"))
    );
  }

  isXml(text: string | null) {
    if (!text) return false;
    const str = text.trim();
    return str.startsWith("<") && str.endsWith(">");
  }

  /**
   * 执行 JS
   */
  public async evalJS(jsStr: string, result: any = null): Promise<any> {
    const context = await isolate.createContext();
    const bindings = context.global;
    // await bindings.set("java", new ivm.Reference(this));
    await bindings.set("key", this.key);
    await bindings.set("page", this.page);
    await bindings.set("result", result);
    return context.eval(jsStr);
  }
}

enum RequestMethod {
  GET = "GET",
  POST = "POST",
}

class UrlOption {
  private method: string | null = null;
  private charset: string | null = null;
  private headers: any | null = null;
  private body: any | null = null;
  private origin: string | null = null;
  private retry: number | null = null;
  private type: string | null = null;
  private webView: any | null = null;
  private webJs: string | null = null;
  private js: string | null = null;
  private serverID: number | null = null;

  setMethod(value: string | null): void {
    this.method = value?.trim() ? value : null;
  }

  getMethod(): string | null {
    return this.method;
  }

  setCharset(value: string | null): void {
    this.charset = value?.trim() ? value : null;
  }

  getCharset(): string | null {
    return this.charset;
  }

  setOrigin(value: string | null): void {
    this.origin = value?.trim() ? value : null;
  }

  getOrigin(): string | null {
    return this.origin;
  }

  setRetry(value: string | null): void {
    this.retry = value && !isNaN(Number(value)) ? parseInt(value) : null;
  }

  getRetry(): number {
    return this.retry ?? 0; // 返回 0 如果 retry 为 null
  }

  setType(value: string | null): void {
    this.type = value?.trim() ? value : null;
  }

  getType(): string | null {
    return this.type;
  }

  useWebView(): boolean {
    return (
      this.webView !== null &&
      this.webView !== "" &&
      this.webView !== false &&
      this.webView !== "false"
    );
  }

  setWebView(boolean: boolean): void {
    this.webView = boolean ? true : null;
  }

  setHeaders(value: string | null): void {
    this.headers = value?.trim() ? JSON.parse(value) : null;
  }

  getHeaderMap(): Record<string, string> | null {
    if (this.headers instanceof Object) {
      return this.headers;
    }
    if (typeof this.headers === "string") {
      return JSON.parse(this.headers);
    }
    return null;
  }

  setBody(value: string | null): void {
    if (value?.trim()) {
      try {
        const parsedValue = JSON.parse(value);
        if (Array.isArray(parsedValue) || typeof parsedValue === "object") {
          this.body = parsedValue;
        } else {
          this.body = value;
        }
      } catch {
        this.body = value; // 如果不是有效的 JSON，则保留原始字符串
      }
    } else {
      this.body = null;
    }
  }

  getBody(): string | null {
    return typeof this.body === "string"
      ? this.body
      : JSON.stringify(this.body);
  }

  setWebJs(value: string | null): void {
    this.webJs = value?.trim() ? value : null;
  }

  getWebJs(): string | null {
    return this.webJs;
  }

  setJs(value: string | null): void {
    this.js = value?.trim() ? value : null;
  }

  getJs(): string | null {
    return this.js;
  }

  setServerID(value: string | null): void {
    this.serverID = value?.trim() ? Number(value) : null;
  }

  getServerID(): number | null {
    return this.serverID;
  }
}

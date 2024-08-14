export class NetworkUtils {
  private static notNeedEncoding: Set<number> = new Set();

  /**
   * 获取绝对地址
   */
  static getAbsoluteURL(baseURL: string | undefined, relativePath: string): string {
    if (!baseURL || baseURL.trim() === '') {
      return relativePath.trim();
    }

    let absoluteUrl: URL | null = null;

    try {
      const trimmedBaseURL = baseURL.split(',')[0].trim();
      absoluteUrl = new URL(trimmedBaseURL);
    } catch (e) {
      // console.error("Error in parsing base URL: ", e);
    }

    return this.getAbsoluteURL2(absoluteUrl, relativePath);
  }

  /**
   * 获取绝对地址
   */
  static getAbsoluteURL2(baseURL: URL | null, relativePath: string): string {
    const relativePathTrim = relativePath.trim();
    if (baseURL === null) return relativePathTrim;
    if (this.isAbsUrl(relativePathTrim)) return relativePathTrim;
    if (this.isDataUrl(relativePathTrim)) return relativePathTrim;
    if (relativePathTrim.startsWith('javascript')) return '';

    let relativeUrl = relativePathTrim;

    try {
      const parseUrl = new URL(relativePathTrim, baseURL);
      relativeUrl = parseUrl.toString();
      return relativeUrl;
    } catch (e) {
      // console.error("网址拼接出错: ", e);
    }

    return relativeUrl;
  }

  static getBaseUrl(url: string | null): string | null {
    if (!url) return null;

    const lowerCaseUrl = url.toLowerCase();
    if (lowerCaseUrl.startsWith('http://') || lowerCaseUrl.startsWith('https://')) {
      const index = url.indexOf('/', 9);
      return index === -1 ? url : url.substring(0, index);
    }

    return null;
  }

  private static initializeNotNeedEncoding(): void {
    for (let i = 'a'.charCodeAt(0); i <= 'z'.charCodeAt(0); i++) {
      this.notNeedEncoding.add(i);
    }
    for (let i = 'A'.charCodeAt(0); i <= 'Z'.charCodeAt(0); i++) {
      this.notNeedEncoding.add(i);
    }
    for (let i = '0'.charCodeAt(0); i <= '9'.charCodeAt(0); i++) {
      this.notNeedEncoding.add(i);
    }
    for (const char of '+-_.$:()!*@&#,[]') {
      this.notNeedEncoding.add(char.charCodeAt(0));
    }
  }

  static needsEncoding(char: string): boolean {
    return !this.notNeedEncoding.has(char.charCodeAt(0));
  }

  static hasUrlEncoded(str: string): boolean {
    if (!this.notNeedEncoding.size) {
      this.initializeNotNeedEncoding();
    }

    let needEncode = false;
    let i = 0;

    while (i < str.length) {
      const c = str[i];

      if (this.notNeedEncoding.has(c.charCodeAt(0))) {
        i++;
        continue;
      }

      // 检查是否为 URL 编码的格式
      if (c === '%' && i + 2 < str.length) {
        const c1 = str[++i];
        const c2 = str[++i];

        if (NetworkUtils.isDigit16Char(c1) && NetworkUtils.isDigit16Char(c2)) {
          i++;
          continue;
        }
      }

      // 对于其他字符，标记为需要 URL 编码
      needEncode = true;
      break;
    }

    return !needEncode;
  }

  /**
   * 判断 c 是否是 16 进制的字符
   */
  static isDigit16Char(c: string): boolean {
    return (c >= '0' && c <= '9') || (c >= 'A' && c <= 'F') || (c >= 'a' && c <= 'f');
  }

  private static isAbsUrl(url: string): boolean {
    return /^(http|https):\/\/.+/.test(url);
  }

  static isDataUrl(str: string | null): boolean {
    return str !== null && this.dataUriRegex.test(str);
  }

  private static dataUriRegex: RegExp = /^data:.*?;base64,(.*)$/;
}

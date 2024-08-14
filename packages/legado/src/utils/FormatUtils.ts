export class Fmt {
  private static bookNameRegex: RegExp = /\s+作\s*者.*|\s+\S+\s+著/g;
  private static authorRegex: RegExp = /^\s*作\s*者[:：\s]+|\s+著/g;
  private static spaceRegex: RegExp = /&nbsp;|&ensp;|&emsp;/g;
  private static noPrintRegex: RegExp = /&thinsp;|&zwnj;|&zwj;/g;
  private static wrapHtmlRegex: RegExp = /<\/?(?:div|p|br|hr|h\d|article|dd|dl)[^>]*>/g;
  private static commentRegex: RegExp = /<!--[^>]*-->/g;
  private static indent1Regex: RegExp = /\s*\n+\s*/g; // 段缩进正则1
  private static indent2Regex: RegExp = /^[\n\s]+/g; // 段缩进正则2
  private static lastRegex: RegExp = /[\n\s]+$/g; // 清理尾部空行
  private static otherHtmlRegex: RegExp = /<\/?[a-zA-Z]+(?=[ >])[^<>]*>/g;
  private static scriptStyleRegex: RegExp = /<script[^>]*>[\s\S]*?<\/script>|<style[^>]*>[\s\S]*?<\/style>/g;

  public static bookName(text: string): string {
      return text.replace(this.bookNameRegex, '').trim();
  }

  public static author(text: string): string {
      return text.replace(this.authorRegex, '').trim();
  }

  public static wordCount(text: string): string {
      if (!text) {
          return '';
      }
      
      let words: number;
      try {
          words = parseInt(text, 10);
          if (words > 10000) {
              return `${(words / 10000.0).toFixed(1)}万字`;
          } else {
              return `${words}字`;
          }
      } catch {
          return text;
      }
  }

  public static html(text: string, otherRegex: RegExp = this.otherHtmlRegex): string {
      text = text.normalize('NFC');
      text = text.replace(/\ufeff/g, '');
      text = text.replace(/\u200b/g, '');
      text = text.replace(this.spaceRegex, ' ');
      text = text.replace(this.noPrintRegex, '');
      text = text.replace(this.wrapHtmlRegex, '\n');
      text = text.replace(this.commentRegex, '');
      text = text.replace(otherRegex, '');
      text = text.replace(this.indent1Regex, '\n　　');
      text = text.replace(this.indent2Regex, '　　');
      text = text.replace(this.lastRegex, '');

      return text;
  }
}

import { Element } from './Element';
import { $ } from './Jsoup';
import * as cheerio from 'cheerio';

export class Elements extends Array {
  constructor(elements?: cheerio.AnyNode[] | Elements | Element) {
    super();
    if (elements) {
      if (elements instanceof Elements) {
        this.push(...elements);
      } else if (elements instanceof Element) {
        this.push(elements);
      } else {
        this.push(...elements.map((el) => new Element(el)));
      }
    }
  }

  private getAnyNodes() {
    return Array.from(this).map((item: Element) => item.element);
  }

  attr(key: string): string {
    return $(this.getAnyNodes()).attr(key) ?? '';
  }

  children() {
    return new Elements($(this.getAnyNodes()).children().get());
  }

  select(cssQuery: string): Elements {
    return new Elements($(this.getAnyNodes()).find(cssQuery).get());
  }

  remove() {
    $(this.getAnyNodes()).remove();
  }

  clear() {
    this.length = 0;
  }

  addAll(items: cheerio.AnyNode[] | Elements) {
    if (items instanceof Elements) {
      this.push(...items);
    } else {
      this.push(...items.map((el) => new Element(el)));
    }
  }

  outerHtml(): string {
    return $(this.getAnyNodes()).prop('outerHTML')!!;
  }
}

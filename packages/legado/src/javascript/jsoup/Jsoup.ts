import { Elements } from './Elements';
import * as cheerio from 'cheerio';

export const $ = cheerio.load([]);

export class Jsoup {
  static parse(html: string): Elements {
    const $doc = cheerio.load(html);
    return new Elements($doc.root().children().get());
  }
}

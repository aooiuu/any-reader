import _xpath from 'xpath.js';
import { DOMParser, MIME_TYPE } from '@xmldom/xmldom';

export function xpath(html: string, xpath: string) {
  const doc = new DOMParser().parseFromString(html, MIME_TYPE.HTML);
  return _xpath(doc, xpath).map((e) => String(e));
}

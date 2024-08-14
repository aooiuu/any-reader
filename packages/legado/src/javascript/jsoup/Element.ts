import { AnyNode } from "domhandler";
import { Elements } from "./Elements";
import { Node } from "typescript";
import * as cheerio from "cheerio";
import { $ } from "./Jsoup";

export class Element {
  element: AnyNode;
  constructor(element: AnyNode) {
    this.element = element;
  }

  attr(key: string) {
    return $(this.element).attr(key)
  }

  select(cssQuery: string): Elements {
    return new Elements($(this.element).find(cssQuery).get());
  }

  text() {
    return $(this.element).text();
  }

  ownText() {
    return $(this.element).contents().filter((i, node) => {
      return node.type === "text" || $(node).prop("tagName") === "br"
    }).map((i ,el) => {
      if (el.type === "text") {
        return (el as unknown as Text).data
      } else {
        return " "
      }
    }).get().join("").replace(/\s+/g, " ")
  }

  textNodes() {
    const textNodes =  $(this.element).contents().filter((i, node) => {
      return node.type === "text"
    }).get()
    return new Elements(textNodes)
  }
}

import { Rule } from '@any-reader/rule-utils';

export default class IPTV {
  private rule: Rule;

  constructor(rule: Rule) {
    this.rule = rule;
  }

  async search() {
    return [];
  }
  async getChapter() {
    return [];
  }
  async getContent() {
    return [];
  }
  async discoverMap() {
    return [];
  }
  async discover() {
    return [];
  }
}

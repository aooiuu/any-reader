import * as rule from "./rule.json";
import type { LegadoRule } from "./types";
import { LegadoRuleManager as RuleManager } from "./index";

const analyzer = new RuleManager(rule as unknown as LegadoRule);

async function search() {
  const list = await analyzer.search("我的");
  // const chapters = await analyzer.getChapter(list[0].url)
  // const content = await analyzer.getContent(chapters[0].url)
  // eslint-disable-next-line no-console
  console.log(list);
}

search();

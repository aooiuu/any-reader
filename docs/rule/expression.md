| 特性       | 说明                                      | 示例                               |
| ---------- | :---------------------------------------- | :--------------------------------- |
| `@css`     | 使用 css 选择器查找内容 [规则测试][@css]  | `@css:.box1 .box2@text`            |
| `@json`    | 使用 jsonpath 查找内容 [规则测试][@json]  | `@json:$.list[:1].title`           |
| `@xpath`   | 使用 xpath 查找内容 [规则测试][@xpath]    | `@xpath://*[@class="box3"]/text()` |
| `@js`      | 使用 js 脚本 [规则测试][@js]              | `@js:1+1`                          |
| `@filter`  | 模拟浏览器加载地址后匹配指定链接          | `@filter:(?:m3u8\|mp4)`            |
| `@replace` | 替换匹配到的内容为空 [规则测试][@replace] | `@replace:\d`                      |
| `##`       | 正则替换 [规则测试][##]                   | `$.a##2##替换文本`                 |
| `{‍​‍{}}`  | 拼接 [规则测试][​拼接]                    | `http://www.aaa.com/{‍{$.id}}`     |
| `\|\|`     | 或, 直到规则匹配成功 [规则测试][或]       | `$.a\|\|$.b`                       |
| `&&`       |                                           |                                    |
| 嵌套组合   |                                           | `$.info.body@css:.box1 .box2@text` |

规则可以省略开头的,**@css**、**@xpath**、**@json**, 因为解析器会尝试自动识别。

[@css]: /play/#eyJpbnB1dFRleHQiOiI8ZGl2IGNsYXNzPVwiYm94MVwiPjxkaXYgY2xhc3M9XCJib3gyXCI+Y29udGVudDwvZGl2PjwvZGl2PiIsInJ1bGUiOiIuYm94MSAuYm94MkB0ZXh0IiwiaXNMaXN0IjpmYWxzZX0=
[@json]: /play/#eyJpbnB1dFRleHQiOiJ7XCJhXCI6IDF9IiwicnVsZSI6IiQuYSIsImlzTGlzdCI6ZmFsc2V9
[@xpath]: /play/#eyJpbnB1dFRleHQiOiI8ZGl2IGNsYXNzPVwiYm94MVwiPjxkaXYgY2xhc3M9XCJib3gyXCI+Y29udGVudDI8L2Rpdj48ZGl2IGNsYXNzPVwiYm94M1wiPmNvbnRlbnQzPC9kaXY+PC9kaXY+IiwicnVsZSI6Ii8vKltAY2xhc3M9XCJib3gzXCJdL3RleHQoKSIsImlzTGlzdCI6ZmFsc2V9
[@js]: /play/#eyJpbnB1dFRleHQiOiIiLCJydWxlIjoiQGpzOmZldGNoKCdodHRwczovL2Fvb2l1dS5naXRodWIuaW8vYW55LXJlYWRlci9wbGF5JykudGhlbihlID0+IGUudGV4dCgpKUBjc3M6dGFibGUgdGhAaHRtbCIsImlzTGlzdCI6ZmFsc2V9
[@replace]: /play/#eyJpbnB1dFRleHQiOiJhMTJiM2MiLCJydWxlIjoiQHJlcGxhY2U6XFxkIiwiaXNMaXN0IjpmYWxzZX0=
[##]: /play/#eyJpbnB1dFRleHQiOiJ7XCJhXCI6IFwiMTIzXCJ9IiwicnVsZSI6IiQuYSMjMiMj5pu/5o2i5paH5pysIiwiaXNMaXN0IjpmYWxzZX0=
[​拼接]: /play/#eyJpbnB1dFRleHQiOiJ7XCJhXCI6IDF9IiwicnVsZSI6InF7eyQueHx8JC5hfX13IiwiaXNMaXN0IjpmYWxzZX0=
[或]: /play/#eyJpbnB1dFRleHQiOiJ7XCJhXCI6IFwiMVwifSIsInJ1bGUiOiIkLmJ8fCQuYSIsImlzTGlzdCI6ZmFsc2V9

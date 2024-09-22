export interface Rule {
  // ===== 通用字段 =====
  // 域名
  // 当发起网络请求时, 如果最终的地址非 `http` 开头, 那么请求的时候会自动拼接上 `host`
  // 规则里也可以使用变量 `$host` 来获取它
  host: string;
  id: string; // uuid, 用于区分规则的唯一性
  name: string; // 规则名称
  sort: number; // 规则排序, 越高越靠前
  contentType: ContentType; // 规则类型
  loadJs: string; // 全局JS脚本
  author: string; // 规则作者
  userAgent: string; // Headers JSON字符串

  // ===== 解析流程 - 搜索 =====
  enableSearch: boolean; // 表示搜索功能开启的状态
  searchUrl: string; // 用法可参考 `URL地址规则`
  // 以下规则用法可参考 `取列表规则`
  // 可以使用变量: `result` 获取 `searchUrl` 的结果
  searchList: string;
  // 以下规则用法可参考 `取内容规则`
  // 可以使用变量: `result` 获取 `searchList` 数组当前项的结果
  searchCover: string; // 封面
  searchName: string; // 标题
  searchAuthor: string; // 作者
  searchChapter: string; // 最新章节
  searchDescription: string; // 描述
  searchResult: string; // 结果

  // ===== 解析流程 - 章节列表 =====
  // 以下规则用法可参考 `URL地址规则`
  // 可以使用变量: `result` 获取 `searchResult` 或者 `discoverResult` 的结果
  chapterUrl: string;
  // 以下规则用法可参考 `取列表规则`
  // 可以使用变量: `result` 获取 `chapterUrl` 的结果
  // 可以使用变量: `lastResult` 获取 `searchResult` 或者 `discoverResult` 的结果
  chapterList: string; // 列表
  // 以下规则用法可参考 `取内容规则`
  // 可以使用变量: `result` 获取 `chapterList` 数组当前项的结果
  // 可以使用变量: `lastResult` 获取 `searchResult` 或者 `discoverResult` 的结果
  chapterName: string; // 标题
  chapterCover: string; // 封面
  chapterTime: string; // 时间
  chapterNextUrl: string; // 下一页地址
  chapterResult: string; // 结果

  // ===== 解析流程 - 发现页 =====
  enableDiscover: boolean; // 是否启用发现页
  discoverUrl: string; // 用法可参考 `发现页分类规则`
  // 以下规则用法可参考 `取列表规则`
  // 可以使用变量: `result` 获取 `discoverUrl` 的结果
  discoverList: string; // 列表
  // 以下规则用法可参考 `取内容规则`
  // 可以使用变量: `result` 获取 `discoverList` 数组当前项的结果
  discoverName: string; // 标题
  discoverCover: string; // 封面
  discoverAuthor: string; // 作者
  discoverDescription: string; // 描述
  discoverResult: string; // 结果
  // discoverItems: string
  discoverTags: string;
  discoverChapter: string;
  discoverNextUrl: string; // 下一页地址

  // ===== 解析流程 - 正文 =====
  contentUrl: string;
  contentItems: string; // 内容
  contentNextUrl: string; // 用于一篇正文存在多个页面的场景
  contentDecoder: string; // 用户正文图片需要解密的场景
}

enum ContentType {
  MANGA = 0, // 漫画
  NOVEL = 1, // 小说
  VIDEO = 2, // 视频
  AUDIO = 3, // 音频
  RSS = 4,
  NOVELMORE = 5
}

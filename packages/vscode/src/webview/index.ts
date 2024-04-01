import * as path from 'path';
import * as fs from 'fs';
import * as vscode from 'vscode';
import * as EasyPostMessage from 'easy-post-message';
import { Rule, RuleManager } from '@any-reader/core';
import { COMMANDS } from '../constants';
import * as ruleFileManager from '../utils/ruleFileManager';
import { createAdapter } from '../utils/easyPostMessage';
import { TreeNode } from '../treeview/bookManager';

export class WebView {
  private mSearchToken: any;
  private webviewPanel?: vscode.WebviewPanel;
  private context: vscode.ExtensionContext;
  private isVue = false;
  private pm!: any;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  getWebViewContent(templatePath: string) {
    const resourcePath = path.join(this.context!.extensionPath, templatePath);
    const dirPath = path.dirname(resourcePath);
    const html = fs.readFileSync(resourcePath, 'utf-8').replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(\.\/.+?)"/g, (m, $1, $2) => {
      return $1 + this.webviewPanel!.webview.asWebviewUri(vscode.Uri.file(path.resolve(dirPath, $2))) + '"';
    });
    return html;
  }

  async navigateTo(routePath = '', title = 'AnyReader') {
    this.initWebviewPanel(title);
    if (!this.isVue) {
      this.webviewPanel!.webview.html = this.getWebViewContent(path.join('template-dist', 'index.html'));
    }
    this.pm.emit('router.push', routePath, this.webviewPanel?.webview);
    this.isVue = true;
    this.webviewPanel!.reveal();
  }

  // 打开阅读面板
  async openWebviewPanel(article: TreeNode, content: string) {
    this.isVue = false;
    const title: string = article.data.name;
    this.initWebviewPanel(title);
    this.webviewPanel!.webview.html = content;
    this.webviewPanel!.reveal();
  }

  // 获取所有规则
  onBookSource({ source }: { source: WebView }) {
    this.pm.emit('getBookSource', ruleFileManager.list(), source);
  }

  // 获取单个谷子额
  onGetRule({ source, data }: { source: WebView; data: Rule }) {
    const rules = ruleFileManager.list();
    this.pm.emit(
      'getRule',
      rules.find((e) => e.id === data.id),
      source
    );
  }

  // 添加规则
  onAddRule({ data }: { data: Rule }) {
    ruleFileManager.update(data);
  }

  // 更新规则
  async onUpdateRule({ source, data }: { source: WebView; data: Rule }) {
    await ruleFileManager.update(data);
    this.pm.emit('getBookSource', ruleFileManager.list(), source);
  }

  // 搜索
  async onSearch({ source, data }: { source: WebView; data: any }) {
    const { uuid, keyword, contentTypes } = data;
    this.mSearchToken = uuid;
    const rules = ruleFileManager.list().filter((e) => contentTypes.includes(e.contentType) && e.enableSearch);
    const count = rules.length;
    let runCount = 0;
    if (count === 0) {
      this.pm.emit(
        'search',
        {
          runCount,
          count,
          uuid
        },
        source
      );
    }
    for (const rule of rules) {
      if (this.mSearchToken !== uuid) {
        return;
      }
      const analyzer = new RuleManager(rule);
      const searchItems = await analyzer.search(keyword).catch(() => []);
      runCount++;
      this.pm.emit(
        'search',
        {
          runCount,
          count,
          uuid,
          rule,
          list: searchItems
        },
        source
      );
    }
  }

  // 获取章节
  async onGetChapter({ data }: { data: any }) {
    const { rule, data: searchItem } = data;
    vscode.commands.executeCommand(
      COMMANDS.getChapter,
      {
        ...searchItem,
        ruleId: rule.id
      },
      {
        saveHistory: searchItem
      }
    );
  }

  // 获取分类
  async onDiscoverMap(data: any) {
    const { rule } = data;
    const ruleManager = new RuleManager(rule);
    const res = await ruleManager.discoverMap();
    return {
      rule,
      data: res
    };
  }

  // 获取分类下内容
  async onDiscover(data: any) {
    const { rule, data: params } = data;
    const ruleManager = new RuleManager(rule);
    return {
      rule,
      data: await ruleManager.discover(params.value)
    };
  }

  // 编辑规则
  onEditBookSource() {
    vscode.commands.executeCommand(COMMANDS.editBookSource);
  }

  initWebviewPanel(title: string) {
    if (!this.webviewPanel) {
      this.webviewPanel = vscode.window.createWebviewPanel('any-reader', title, vscode.ViewColumn.One, {
        retainContextWhenHidden: true,
        enableScripts: true
      });
      this.webviewPanel.onDidDispose(
        () => {
          this.webviewPanel = undefined;
          this.isVue = false;
        },
        this,
        this.context!.subscriptions
      );
      // @ts-ignore
      this.pm = new EasyPostMessage(createAdapter(this.webviewPanel.webview));

      // 异步
      this.pm.on('getBookSource', this.onBookSource.bind(this));
      this.pm.on('getRule', this.onGetRule.bind(this));
      this.pm.on('addRule', this.onAddRule.bind(this));
      this.pm.on('updateRule', this.onUpdateRule.bind(this));
      this.pm.on('search', this.onSearch.bind(this));
      this.pm.on('getChapter', this.onGetChapter.bind(this));
      this.pm.on('editBookSource', this.onEditBookSource.bind(this));

      // 同步
      this.pm.answer('discoverMap', this.onDiscoverMap.bind(this));
      this.pm.answer('discover', this.onDiscover.bind(this));
    } else {
      this.webviewPanel.title = title;
    }
  }
}

import * as path from 'path';
import * as fs from 'fs';
import * as vscode from 'vscode';
import * as EasyPostMessage from 'easy-post-message';
import { Rule, RuleManager } from '@any-reader/core';
import { COMMANDS } from '../constants';
import * as ruleFileManager from '../utils/ruleFileManager';
import { createAdapter } from '../utils/easyPostMessage';
import { TreeNode } from '../treeview/bookManager';
import favoritesProvider from '../treeview/favorites';
import favoritesManager from '../utils/favoritesManager';

function success(data: any, msg = '') {
  return {
    code: 0,
    data,
    msg
  };
}

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
  onBookSource() {
    return success(ruleFileManager.list());
  }

  // 获取单个规则
  onGetRule(data: Rule) {
    const rules = ruleFileManager.list();
    return success(rules.find((e) => e.id === data.id));
  }

  // 添加规则
  onAddRule(data: Rule) {
    ruleFileManager.update(data);
  }

  // 更新规则
  async onUpdateRule(data: Rule) {
    await ruleFileManager.update(data);
    return success(data);
  }

  // 搜索
  async onSearchByRuleId({ ruleId, keyword }: { ruleId: string; keyword: string }) {
    const rule = await ruleFileManager.findById(ruleId);
    const analyzer = new RuleManager(rule);
    return success(await analyzer.search(keyword).catch(() => []));
  }

  // 获取章节
  async onGetChapter(data: any) {
    const { ruleId, data: searchItem } = data;
    const rule = await ruleFileManager.findById(ruleId);
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
    const rule = await ruleFileManager.findById(data.ruleId);
    const ruleManager = new RuleManager(rule);
    return success(await ruleManager.discoverMap());
  }

  // 获取分类下内容
  async onDiscover(data: any) {
    const rule = await ruleFileManager.findById(data.ruleId);
    const ruleManager = new RuleManager(rule);
    return success(await ruleManager.discover(data.data.value));
  }

  // 编辑规则
  onEditBookSource() {
    vscode.commands.executeCommand(COMMANDS.editBookSource);
  }

  // 获取收藏列表
  async onGetFavoritesList() {
    return success(await favoritesManager.list());
  }

  async onStar({ data, ruleId }: any) {
    await favoritesManager.add(data, await ruleFileManager.findById(ruleId));
    favoritesProvider.refresh();
    return success(true);
  }

  async onUnstar({ data, ruleId }: any) {
    await favoritesManager.del(data, await ruleFileManager.findById(ruleId));
    favoritesProvider.refresh();
    return success(true);
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

      // vsc
      this.pm.answer('post@vscode/getChapter', this.onGetChapter.bind(this));
      this.pm.answer('get@vscode/editBookSource', this.onEditBookSource.bind(this));

      this.pm.answer('get@discoverMap', this.onDiscoverMap.bind(this));
      this.pm.answer('get@getFavorites', this.onGetFavoritesList.bind(this));
      this.pm.answer('post@discover', this.onDiscover.bind(this));
      this.pm.answer('post@star', this.onStar.bind(this));
      this.pm.answer('post@unstar', this.onUnstar.bind(this));

      this.pm.answer('get@rules', this.onBookSource.bind(this));
      this.pm.answer('get@getRuleById', this.onGetRule.bind(this));
      this.pm.answer('post@createRule', this.onAddRule.bind(this));
      this.pm.answer('post@updateRule', this.onUpdateRule.bind(this));

      this.pm.answer('post@searchByRuleId', this.onSearchByRuleId.bind(this));
    } else {
      this.webviewPanel.title = title;
    }
  }
}

export class RuleAnalyzer {
  private queue: string; // 被处理字符串
  private pos: number;
  private start: number;
  private startX: number;

  private rule: string[]; // 分割出的规则列表
  private step: number; // 分割字符的长度
  public elementsType: string; // 当前分割字符串
  // 设置平衡组函数，根据上下文设定
  private chompBalanced: (a: string, b: string) => boolean;

  constructor(data: string, code: boolean = false) {
    this.queue = data; // 初始化被处理字符串
    this.pos = 0; // 当前处理到的位置
    this.start = 0; // 当前处理字段的开始
    this.startX = 0; // 当前规则的开始

    this.rule = []; // 初始化规则列表
    this.step = 0; // 初始化分割字符的长度
    this.elementsType = ''; // 初始化当前分割字符串
    this.chompBalanced = code ? this.chompCodeBalanced : this.chompRuleBalanced;
  }

  // 修剪当前规则之前的"@"或者空白符
  trim(): void {
    if (this.queue[this.pos] === '@' || this.queue[this.pos] < '!') {
      this.pos++;
      while (this.queue[this.pos] === '@' || this.queue[this.pos] < '!') {
        this.pos++;
      }
      this.start = this.pos; // 开始点推移
      this.startX = this.pos; // 规则起始点推移
    }
  }

  // 将pos重置为0，方便复用
  reSetPos(): void {
    this.pos = 0;
    this.startX = 0;
  }

  /**
   * 从剩余字串中拉出一个字符串，直到但不包括匹配序列
   * @param seq 查找的字符串 **区分大小写**
   * @return 是否找到相应字段。
   */
  private consumeTo(seq: string): boolean {
    this.start = this.pos; // 将处理到的位置设置为规则起点
    const offset = this.queue.indexOf(seq, this.pos);
    if (offset !== -1) {
      this.pos = offset;
      return true;
    } else {
      return false;
    }
  }

  /**
   * 从剩余字串中拉出一个字符串，直到但不包括匹配序列（匹配参数列表中一项即为匹配），或剩余字串用完。
   * @param seq 匹配字符串序列
   * @return 成功返回true并设置间隔，失败则直接返回false
   */
  private consumeToAny(...seq: string[]): boolean {
    let pos = this.pos; // 声明新变量记录匹配位置，不更改类本身的位置

    while (pos !== this.queue.length) {
      for (const s of seq) {
        if (this.queue.substr(pos, s.length) === s) {
          this.step = s.length; // 间隔数
          this.pos = pos; // 匹配成功, 同步处理位置到类
          return true; // 匹配就返回 true
        }
      }
      pos++; // 逐个试探
    }
    return false;
  }

  /**
   * 从剩余字串中拉出一个字符串，直到但不包括匹配序列（匹配参数列表中一项即为匹配），或剩余字串用完。
   * @param seq 匹配字符序列
   * @return 返回匹配位置
   */
  private findToAny(...seq: string[]): number {
    let pos = this.pos; // 声明新变量记录匹配位置，不更改类本身的位置

    while (pos !== this.queue.length) {
      for (const s of seq) {
        if (this.queue[pos] === s) return pos; // 匹配则返回位置
      }
      pos++; // 逐个试探
    }
    return -1;
  }

  /**
   * 拉出一个非内嵌代码平衡组，存在转义文本
   */
  private chompCodeBalanced(open: string, close: string): boolean {
    let pos = this.pos; // 声明临时变量记录匹配位置，匹配成功后才同步到类的pos

    let depth = 0; // 嵌套深度
    let otherDepth = 0; // 其他对称符合嵌套深度

    let inSingleQuote = false; // 单引号
    let inDoubleQuote = false; // 双引号

    do {
      if (pos === this.queue.length) break;
      const c = this.queue[pos++];
      if (c !== RuleAnalyzer.ESC) {
        // 非转义字符
        if (c === "'" && !inDoubleQuote)
          inSingleQuote = !inSingleQuote; // 匹配具有语法功能的单引号
        else if (c === '"' && !inSingleQuote) inDoubleQuote = !inDoubleQuote; // 匹配具有语法功能的双引号

        if (inSingleQuote || inDoubleQuote) continue; // 语法单元未匹配结束，直接进入下个循环

        if (c === '[')
          depth++; // 开始嵌套一层
        else if (c === ']')
          depth--; // 闭合一层嵌套
        else if (depth === 0) {
          // 处于默认嵌套中的非默认字符不需要平衡，仅depth为0时默认嵌套全部闭合，此字符才进行嵌套
          if (c === open) otherDepth++;
          else if (c === close) otherDepth--;
        }
      } else {
        pos++;
      }
    } while (depth > 0 || otherDepth > 0); // 拉出一个平衡字串

    if (depth > 0 || otherDepth > 0) return false;
    this.pos = pos; // 同步位置
    return true;
  }

  private chompRuleBalanced(open: string, close: string): boolean {
    let pos = this.pos; // 声明临时变量记录匹配位置，匹配成功后才同步到类的pos
    let depth = 0; // 嵌套深度
    let inSingleQuote = false; // 单引号
    let inDoubleQuote = false; // 双引号

    do {
      if (pos === this.queue.length) break;
      const c = this.queue[pos++];
      if (c === "'" && !inDoubleQuote)
        inSingleQuote = !inSingleQuote; // 匹配具有语法功能的单引号
      else if (c === '"' && !inSingleQuote) inDoubleQuote = !inDoubleQuote; // 匹配具有语法功能的双引号

      if (inSingleQuote || inDoubleQuote) continue;
      else if (c === '\\') {
        // 不在引号中的转义字符才将下个字符转义
        pos++;
        continue;
      }

      if (c === open)
        depth++; // 开始嵌套一层
      else if (c === close) depth--; // 闭合一层嵌套
    } while (depth > 0); // 拉出一个平衡字串

    if (depth > 0) return false;
    this.pos = pos; // 同步位置
    return true;
  }

  splitRule(...split: string[]): Array<string> {
    // 首段匹配, elementsType为空

    if (split.length === 1) {
      this.elementsType = split[0]; // 设置分割字串
      if (!this.consumeTo(this.elementsType)) {
        this.rule.push(this.queue.substring(this.startX));
        return this.rule;
      } else {
        this.step = this.elementsType.length; // 设置分隔符长度
        return this.splitRule2(); // 递归匹配
      }
    } else if (!this.consumeToAny(...split)) {
      // 未找到分隔符
      this.rule.push(this.queue.substring(this.startX));
      return this.rule;
    }

    const end = this.pos; // 记录分隔位置
    this.pos = this.start; // 重回开始，启动另一种查找

    do {
      const st = this.findToAny('[', '('); // 查找筛选器位置

      if (st === -1) {
        this.rule = [this.queue.substring(this.startX, end)]; // 压入分隔的首段规则到数组
        this.elementsType = this.queue.substring(end, end + this.step); // 设置组合类型
        this.pos = end + this.step; // 跳过分隔符

        while (this.consumeTo(this.elementsType)) {
          // 循环切分规则压入数组
          this.rule.push(this.queue.substring(this.start, this.pos));
          this.pos += this.step; // 跳过分隔符
        }

        this.rule.push(this.queue.substring(this.pos)); // 将剩余字段压入数组末尾
        return this.rule;
      }

      if (st > end) {
        // 先匹配到st1pos，表明分隔字串不在选择器中，将选择器前分隔字串分隔的字段依次压入数组
        this.rule = [this.queue.substring(this.startX, end)]; // 压入分隔的首段规则到数组
        this.elementsType = this.queue.substring(end, end + this.step); // 设置组合类型
        this.pos = end + this.step; // 跳过分隔符

        while (this.consumeTo(this.elementsType) && this.pos < st) {
          // 循环切分规则压入数组
          this.rule.push(this.queue.substring(this.start, this.pos));
          this.pos += this.step; // 跳过分隔符
        }

        if (this.pos > st) {
          this.startX = this.start;
          return this.splitRule(...split); // 首段已匹配,但当前段匹配未完成,调用二段匹配
        } else {
          // 执行到此，证明后面再无分隔字符
          this.rule.push(this.queue.substring(this.pos)); // 将剩余字段压入数组末尾
          return this.rule;
        }
      }

      this.pos = st; // 位置推移到筛选器处
      const next = this.queue[this.pos] === '[' ? ']' : ')'; // 平衡组末尾字符

      if (!this.chompBalanced(this.queue[this.pos], next)) {
        throw new Error(this.queue.substring(0, this.start) + '后未平衡'); // 拉出一个筛选器,不平衡则报错
      }
    } while (end > this.pos);

    this.start = this.pos; // 设置开始查找筛选器位置的起始位置
    return this.splitRule(...split); // 递归调用首段匹配
  }

  private splitRule2(): Array<string> {
    // 二段匹配被调用, elementsType非空(已在首段赋值), 直接按elementsType查找, 比首段采用的方式更快

    const end = this.pos; // 记录分隔位置
    this.pos = this.start; // 重回开始，启动另一种查找

    do {
      const st = this.findToAny('[', '('); // 查找筛选器位置

      if (st === -1) {
        this.rule.push(this.queue.substring(this.startX, end)); // 压入分隔的首段规则到数组
        this.pos = end + this.step; // 跳过分隔符

        while (this.consumeTo(this.elementsType)) {
          // 循环切分规则压入数组
          this.rule.push(this.queue.substring(this.start, this.pos));
          this.pos += this.step; // 跳过分隔符
        }

        this.rule.push(this.queue.substring(this.pos)); // 将剩余字段压入数组末尾
        return this.rule;
      }

      if (st > end) {
        // 先匹配到st1pos，表明分隔字串不在选择器中，将选择器前分隔字串分隔的字段依次压入数组
        this.rule.push(this.queue.substring(this.startX, end)); // 压入分隔的首段规则到数组
        this.pos = end + this.step; // 跳过分隔符

        while (this.consumeTo(this.elementsType) && this.pos < st) {
          // 循环切分规则压入数组
          this.rule.push(this.queue.substring(this.start, this.pos));
          this.pos += this.step; // 跳过分隔符
        }

        if (this.pos > st) {
          this.startX = this.start;
          return this.splitRule2(); // 首段已匹配,但当前段匹配未完成,调用二段匹配
        } else {
          // 执行到此，证明后面再无分隔字符
          this.rule.push(this.queue.substring(this.pos)); // 将剩余字段压入数组末尾
          return this.rule;
        }
      }

      this.pos = st; // 位置推移到筛选器处
      const next = this.queue[this.pos] === '[' ? ']' : ')'; // 平衡组末尾字符

      if (!this.chompBalanced(this.queue[this.pos], next)) {
        throw new Error(this.queue.substring(0, this.start) + '后未平衡'); // 拉出一个筛选器,不平衡则报错
      }
    } while (end > this.pos);

    this.start = this.pos; // 设置开始查找筛选器位置的起始位置

    return !this.consumeTo(this.elementsType) ? (this.rule.push(this.queue.substring(this.startX)), this.rule) : this.splitRule2(); // 递归匹配
  }

  /**
   * 替换内嵌规则
   * @param inner 起始标志, 如 {$.
   * @param startStep 不属于规则部分的前置字符长度，如 {$. 中 { 不属于规则的组成部分，故 startStep 为 1
   * @param endStep 不属于规则部分的后置字符长度
   * @param fr 查找到内嵌规则时，用于解析的函数
   */
  innerRule(inner: string, startStep: number = 1, endStep: number = 1, fr: (input: string) => string | null): string {
    let st = '';

    while (this.consumeTo(inner)) {
      // 拉取成功返回 true
      const posPre = this.pos; // 记录 consumeTo 匹配位置
      if (this.chompCodeBalanced('{', '}')) {
        const frv = fr(this.queue.substring(posPre + startStep, this.pos - endStep));
        if (frv && frv.length > 0) {
          st += this.queue.substring(this.startX, posPre) + frv; // 压入内嵌规则前的内容
          this.startX = this.pos; // 记录下次规则起点
          continue; // 获取内容成功，继续选择下个内嵌规则
        }
      }
      this.pos += inner.length; // 拉出字段不平衡，跳到此 inner 后继续匹配
    }

    return this.startX === 0 ? '' : (st += this.queue.substring(this.startX));
  }

  /**
   * 切分内嵌规则，若没有内嵌规则返回空列表
   */
  splitInnerRule(inner: string): string[] {
    const result: string[] = [];

    while (this.consumeTo(inner)) {
      // 拉取成功返回 true
      const posPre = this.pos; // 记录 consumeTo 匹配位置
      if (this.chompCodeBalanced('{', '}')) {
        const tmp = this.queue.substring(this.startX, posPre);
        if (tmp.length > 0) {
          result.push(tmp);
        }
        result.push(this.queue.substring(posPre, this.pos));
        this.startX = this.pos; // 记录下次规则起点
        continue; // 继续选择下个内嵌规则
      }
      this.pos += inner.length; // 拉出字段不平衡，跳到此 inner 后继续匹配
    }

    if (this.startX !== 0) {
      result.push(this.queue.substring(this.startX));
    }

    return result;
  }

  /**
   * 替换内嵌规则
   * @param startStr 开始字符串
   * @param endStr 结束字符串
   * @param fr 查找到内嵌规则时，用于解析的函数
   */
  async innerRule2(startStr: string, endStr: string, fr: (input: string) => Promise<string | null>): Promise<string> {
    const st = []; // 使用数组来构建字符串

    while (this.consumeTo(startStr)) {
      // 拉取成功返回 true
      this.pos += startStr.length; // 跳过开始字符串
      const posPre = this.pos; // 记录 consumeTo 匹配位置

      if (this.consumeTo(endStr)) {
        const frv = await fr(this.queue.substring(posPre, this.pos));
        st.push(this.queue.substring(this.startX, posPre - startStr.length) + (frv || '')); // 压入内嵌规则前的内容及解析得到的字符串
        this.pos += endStr.length; // 跳过结束字符串
        this.startX = this.pos; // 记录下次规则起点
      }
    }

    return this.startX === 0 ? this.queue : st.join('') + this.queue.substring(this.startX);
  }

  // 转义字符
  private static readonly ESC: string = '\\';
}

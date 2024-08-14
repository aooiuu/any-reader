import { AnalyzerManager } from "./AnalyzerManager";
import { RuleEvaluator } from "./common";

export abstract class RegexEvaluator extends RuleEvaluator {
    abstract replace(context: AnalyzerManager, beforeContent: any, content: any): string;
    abstract replaceList(context: AnalyzerManager, beforeContent: any, content: any): string[];

    override getStrings(context: AnalyzerManager, value: any): string[] {
        if (Array.isArray(value)) {
            return this.replaceList(context, value, value);
        } else {
            return this.replace(context, value, value?.toString() || '').split('\n');
        }
    }

    override getString(context: AnalyzerManager, value: any): string {
        return this.replace(context, value, value?.toString() || '');
    }

    static Replace = class extends RegexEvaluator {
        constructor(private regexEval: RuleEvaluator, private replacementEval: RuleEvaluator) {
            super();
        }
    
        override replace(context: AnalyzerManager, beforeContent: any, content: any): string {
            const vResult = content?.toString() || '';
            if (!vResult) return '';
    
            const replacement = this.replacementEval.getString(context, beforeContent);
            const regex = this.regexEval.eval(context, beforeContent);
    
            if (regex instanceof RegExp) {
                return vResult.replace(regex, replacement);
            } else if (typeof regex === 'string') {
                return vResult.replace(new RegExp(regex), replacement);
            } else {
                throw new Error('Invalid state: unsupport regex type.');
            }
        }
    
        override replaceList(context: AnalyzerManager, beforeContent: any, content: any): string[] {
            const resultList = content as any[];
            if (resultList.length === 0) return [];
    
            const replacement = this.replacementEval.getString(context, beforeContent);
            const regex = this.regexEval.eval(context, beforeContent);
    
            return resultList.map(result => {
                if (regex instanceof RegExp) {
                    return result.toString().replace(regex, replacement);
                } else if (typeof regex === 'string') {
                    return result.toString().replace(new RegExp(regex), replacement);
                } else {
                    throw new Error('Invalid state: unsupport regex type.');
                }
            });
        }
    
        override toString(): string {
            const replacement = this.replacementEval.toString();
            return replacement ? `##${this.regexEval}##${this.replacementEval}` : `##${this.regexEval}`;
        }
    }

    static ReplaceFirst = class extends RegexEvaluator {
        constructor(private regexEval: RuleEvaluator, private replacementEval: RuleEvaluator) {
            super();
        }
    
        override replace(context: AnalyzerManager, beforeContent: any, content: any): string {
            const result = beforeContent?.toString() || '';
            const replacement = this.replacementEval.getString(context, result);
            const regex = this.regexEval.eval(context, result) as RegExp;
    
            const match = regex.exec(content?.toString() || '')?.[0] || '';
            return match ? content.toString().replace(regex, replacement) : '';
        }
    
        override replaceList(context: AnalyzerManager, beforeContent: any, content: any): string[] {
            const resultList = beforeContent as any[];
            const replacement = this.replacementEval.getString(context, content);
            const regex = this.regexEval.eval(context, content) as RegExp;
    
            return resultList.map(result => {
                const match = regex.exec(result.toString())?.[0] || '';
                return match ? result.toString().replace(regex, replacement) : replacement;
            });
        }
    
        override toString(): string {
            return `##${this.regexEval}##${this.replacementEval}###`;
        }
    }
    
    static RegexLiteral = class extends RuleEvaluator {
        private regex: RegExp | null;
    
        constructor(private str: string) {
            super();
            this.regex = this.compileRegex(str);
        }
    
        private compileRegex(str: string): RegExp | null {
            try {
                return new RegExp(str);
            } catch {
                return null;
            }
        }
    
        override eval(context: AnalyzerManager, value: any): any {
            return this.regex || this.str;
        }
    
        override getString(context: AnalyzerManager, value: any): string {
            return this.str;
        }
    
        override toString(): string {
            return this.str;
        }
    }

    static RegexEval = class extends RuleEvaluator {
        constructor(private _eval: RuleEvaluator) {
            super();
        }
    
        override eval(context: AnalyzerManager, value: any): any {
            const regex = this._eval.getString(context, value);
            try {
                return new RegExp(regex);
            } catch {
                return regex;
            }
        }
    
        override toString(): string {
            return this._eval.toString();
        }
    }

    static ReplacementLiteral = class extends RuleEvaluator {
        constructor(private str: string) {
            super();
        }
    
        override getString(context: AnalyzerManager, value: any): string {
            return this.str;
        }
    
        override toString(): string {
            return this.str;
        }
    }

    static ReplacementEval = class extends RuleEvaluator {
        constructor(private _eval: RuleEvaluator) {
            super();
        }
    
        override getString(context: AnalyzerManager, value: any): string {
            return this._eval.getString(context, value);
        }
    
        override toString(): string {
            return this._eval.toString();
        }
    }

    static AllInOne = class extends RuleEvaluator {
        private patterns: RegExp[];
    
        constructor(private regexStrList: string[]) {
            super();
            this.patterns = regexStrList.map(str => new RegExp(str));
        }
    
        private prepare(value: any): string | null {
            let result = value?.toString() || '';
            const sb = [];
    
            for (let i = 0; i < this.patterns.length - 1; i++) {
                const pattern = this.patterns[i];
                const matcher = result.match(pattern);
                if (!matcher) return null;
    
                sb.push(...matcher);
                result = sb.join('');
                sb.length = 0;
            }
    
            return result;
        }
    
        override getElement(context: AnalyzerManager, value: any): any | null {
            const result = this.prepare(value);
            if (!result) return null;
    
            const pattern = this.patterns[this.patterns.length - 1];
            const matcher = result.match(pattern);
            if (!matcher) return null;
    
            return [...matcher];
        }
    
        override getElements(context: AnalyzerManager, value: any): any[] {
            const result = this.prepare(value);
            if (!result) return [];
    
            const pattern = this.patterns[this.patterns.length - 1];
            const matches = [];
            let match;
    
            while ((match = pattern.exec(result))) {
                matches.push([...match]);
            }
    
            return matches;
        }
    
        override toString(): string {
            return ':' + this.regexStrList.join('&&');
        }
    }

}

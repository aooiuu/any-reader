import { AnalyzerManager } from "./AnalyzerManager";
import { RuleEvaluator } from "./common";

export class JsonPathEvaluator extends RuleEvaluator {
    private jsonpath: string;
    private compiledPath: JsonPath | null;

    constructor(jsonpath: string) {
        super();
        this.jsonpath = jsonpath;
        this.compiledPath = this.compilePath(jsonpath);
    }

    private compilePath(path: string): JsonPath | null {
        try {
            return JsonPath.compile(path);
        } catch (e) {
            return null;
        }
    }

    getString(context: AnalyzerManager, value: any): string {
        if (!this.compiledPath) return "";
        return this.getStrings(context, value).join("\n");
    }

    getStrings(context: AnalyzerManager, value: any): string[] {
        const ctx = value as ReadContext;
        if (!this.compiledPath) return [];
        const result: string[] = [];
        try {
            const obj = ctx.read<any>(this.compiledPath);
            if (Array.isArray(obj)) {
                obj.forEach(item => result.push(item.toString()));
            } else {
                result.push(obj.toString());
            }
        } catch (e) {
        }
        return result;
    }

    getElements(context: AnalyzerManager, value: any): any[] {
        const ctx = value as ReadContext;
        try {
            return ctx.read(this.compiledPath) as List<any>;
        } catch (e) {
        }
        return [];
    }

    getElement(context: AnalyzerManager, value: any): any {
        const ctx = value as ReadContext;
        return ctx.read(this.compiledPath);
    }

    toString(): string {
        return this.jsonpath;
    }

    static ConvertWrapper = class extends RuleEvaluator {
        private _eval: RuleEvaluator;

        constructor(_eval: RuleEvaluator) {
            super();
            this._eval = _eval;
        }

        private parse(json: any): ReadContext {
            if (json instanceof ReadContext) {
                return json;
            } else if (typeof json === "string") {
                return JsonPath.parse<string>(json);
            } else {
                return JsonPath.parse<any>(json);
            }
        }

        getString(context: AnalyzerManager, value: any): string {
            if (!value) return "";
            return this._eval.getString(context, this.parse(value));
        }

        getStrings(context: AnalyzerManager, value: any): string[] | null {
            if (!value) return null;
            return this._eval.getStrings(context, this.parse(value));
        }

        getElements(context: AnalyzerManager, value: any): any[] {
            if (!value) return [];
            return this._eval.getElements(context, this.parse(value));
        }

        getElement(context: AnalyzerManager, value: any): any | null {
            if (!value) return null;
            return this._eval.getElement(context, this.parse(value));
        }

        toString(): string {
            return this._eval.toString();
        }
    }
}

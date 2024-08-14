import { AnalyzerManager } from "./AnalyzerManager";
import { RuleEvaluator } from "./common";

export abstract class JsEvaluator extends RuleEvaluator {
    abstract evalElements(context: AnalyzerManager, value?: any): any;

    static Js = class extends JsEvaluator {
        private script: JsEvaluator;
        private prefix: string;

        constructor(script: JsEvaluator, prefix: string) {
            super();
            this.script = script;
            this.prefix = prefix;
        }

        override getString(context: AnalyzerManager, value?: any): string {
            return this.eval(context, value).toString();
        }

        override getStrings(context: AnalyzerManager, value?: any): string[] | null {
            return this.eval(context, value) as string[] | null;
        }

        override getElement(context: AnalyzerManager, value?: any): any {
            return this.eval(context, value);
        }

        override getElements(context: AnalyzerManager, value?: any): any[] {
            const script = this.script.evalElements(context, value)
            return context.evalJS(script, value)
        }

        override eval(context: AnalyzerManager, value?: any): any {
            const script = this.script.eval(context, value)
            return context.evalJS(script, value);
        }

        override evalElements(context: AnalyzerManager, value?: any): any {
            const script = this.script.evalElements(context, value)
            return context.evalJS(script, value);
        }

        override toString(): string {
            switch (this.prefix) {
                case "<js>":
                    return `<js>${this.script}</js>`;
                case "@js:":
                    return `@js:${this.script}`;
                default:
                    return this.script.toString();
            }
        }
    }

    static ScriptLiteral = class extends JsEvaluator {
        private script: string;
        private compiledScript: CompiledScript;

        constructor(script: string) {
            super();
            this.script = script
            this.compiledScript = RhinoScriptEngine.compile(script);
        }

        override eval(context: AnalyzerManager, value?: any): any {
            return this.compiledScript;
        }

        override evalElements(context: AnalyzerManager, value?: any): any {
            return this.compiledScript;
        }

        override toString(): string {
            return this.script;
        }
    };

    static ScriptEval = class extends JsEvaluator {
        private script: RuleEvaluator;
        private compiledScript: CompiledScript;

        constructor(script: RuleEvaluator) {
            super();
            this.script = script;
            this.compiledScript = RhinoScriptEngine.compile(script.toString());
        }

        override eval(context: AnalyzerManager, value?: any): any {
            return RhinoScriptEngine.compile(this.script.getString(context, value));
        }

        override evalElements(context: AnalyzerManager, value?: any): any {
            return this.compiledScript;
        }

        override toString(): string {
            return this.script.toString();
        }
    };
}

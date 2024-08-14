import { AnalyzerManager } from "./AnalyzerManager";

export class BaseRuleEvaluator {
    private getClassName() {
        return this.constructor.name;
    }

    getString(context: AnalyzerManager, value: any): string {
        throw new Error(`${this.getClassName()} 类没有实现 getString`);
    }

    getElement(context: AnalyzerManager, value: any): any | null {
        throw new Error(`${this.getClassName()} 类没有实现 getElement`);
    }

    getString0(context: AnalyzerManager, value: any): string {
        throw new Error(`${this.getClassName()} 类没有实现 getString0`);
    }

    getStrings(context: AnalyzerManager, value: any): string[] | null {
        throw new Error(`${this.getClassName()} 类没有实现 getStrings`);
    }

    getElements(context: AnalyzerManager, value: any): any[] {
        throw new Error(`${this.getClassName()} 类没有实现 getElements`);
    }

    eval(context: AnalyzerManager, value: any): any | null {
        throw new Error(`${this.getClassName()} 类没有实现 eval`);
    }
}

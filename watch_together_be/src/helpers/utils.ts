export function runFunctionWithString(functionName: string, ...args: any[]) {
    const fn = new Function(`return this.${functionName}(${args.map(arg => `${arg},`)})`);
    return fn();
}
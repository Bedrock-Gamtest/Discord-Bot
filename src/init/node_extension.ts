const GeneratorT = Object.getPrototypeOf(function*(){});
const AsyncGeneratorT = Object.getPrototypeOf(async function*(){});
const AsyncFunctionT = Object.getPrototypeOf(async function(){}).constructor;

Object.assign(globalThis,{
    Generator:GeneratorT,
    GeneratorFunction: GeneratorT.constructor,
    AsyncGenerator: AsyncGeneratorT,
    AsyncGeneratorFunction: AsyncGeneratorT.constructor,
    AsyncFunction: AsyncFunctionT
});

type GeneratorType =  { ():(Generator), prototype: Generator };
type GeneratorFunctionType = {(...a: any):GeneratorFunction,new (...a: any):GeneratorFunction, prototype: GeneratorFunction};
type AsyncGeneratorType =  { ():(AsyncGenerator), prototype: AsyncGenerator };
type AsyncGeneratorFunctionType = {(...a: any):AsyncGeneratorFunction,new (...a: any):AsyncGeneratorFunction, prototype: AsyncGeneratorFunction};
type AsyncFunctionType = {(...a: any):(()=>Promise<any>),new (...a: any):(()=>Promise<any>), prototype: (()=>Promise<any>)};
declare global {
    var Generator: GeneratorType;
    var GeneratorFunction: GeneratorFunctionType;
    var AsyncGenerator: AsyncGeneratorType;
    var AsyncGeneratorFunction: AsyncGeneratorFunctionType;
    var AsyncFunction: AsyncFunctionType;
}
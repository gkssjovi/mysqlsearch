type CellSize = [number, number];

type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any ? A : never;
type Unpacked<T> = T extends (infer U)[] ? U : T;

declare module 'printable-characters' {
    export function strlen(str: string): number;
}

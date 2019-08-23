import { Action } from "../action/types";
export interface Mutator<T = any> {
    (action: Action, state: T, key?: string | number, parent?: any): T;
}
export declare type MutatorsObj = {
    [propName: string]: Mutator;
};
export declare type MutatorsReturnObject<TMutatorsObj extends MutatorsObj> = {
    [P in keyof TMutatorsObj]: ReturnType<TMutatorsObj[P]>;
};
//# sourceMappingURL=types.d.ts.map
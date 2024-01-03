export { }

declare global {
    interface Array<T> {
        deduplication(func?: (data1: T, data2: T) => boolean): T[]
        findLastIndex(
            predicate: (value: T, index: number, obj: T[]) => unknown,
            thisArg?: any
        ): number
    }
    // interface Object {
    //     testFunc: (func: any) => unknown[]
    // }
}

function arrayDistinct<T>(list: T[]): T[] {
    const result = [];
    for (var i = 0; i < list.length; i++) {
        var value = list[i];
        if (result.indexOf(value) == -1)
            result.push(value);
    }
    return result;
}

// 중복 제거
if (!Array.prototype.deduplication) {
    Array.prototype.deduplication = function <T>(func?: (data1: T, data2: T) => boolean) {
        return func ? this.filter((v, i) => this.findIndex(_ => func(v, _)) === i) : arrayDistinct(this)
    }
}
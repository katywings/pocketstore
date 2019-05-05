import clone from "fast-clone";

export const isPromiseLike = function(promise): promise is Promise<any> {
  return promise && (<Promise<any>>promise).then !== undefined;
};

export var once = function(fn) {
  var done = false;
  var result;

  return function() {
    if (!done) {
      result = fn();
      done = true;
    }

    return result;
  };
};

export const findInArray = function(
  values: any[],
  predicate: (value, key, values) => any
) {
  let idx = 0;
  for (const value of values) {
    const result = predicate(value, idx, values);
    if (result) {
      return result;
    }

    idx++;
  }
};

const isObjectLike = function(value) {
  return value != null && typeof value == "object";
};

export const cloneDeep = function(value) {
  return clone(value);
};

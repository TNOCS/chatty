/**
 * Original author: fuzetsu
 * Source: https://github.com/fuzetsu/mergerino
 */

export const assign =
  Object.assign ||
  ((a: any, b: any) => (b && Object.keys(b).forEach(k => (a[k] = b[k])), a));

type PatchFunction = <T extends Record<string, any>>(t: T, m: any) => T;

const run = <T extends Record<string, any>>(
  isArr: boolean,
  copy: T,
  patch: T | T[] | PatchFunction
): T => {
  const type = typeof patch;
  if (patch && type === 'object') {
    if (Array.isArray(patch)) {
      for (const p of patch) {
        copy = run(isArr, copy, p);
      }
    } else {
      for (const k of Object.keys(patch) as Array<keyof T>) {
        const val = (patch as T)[k];
        if (typeof val === 'function') {
          copy[k] = val(copy[k], merge);
        } else if (val === undefined) {
          isArr && !isNaN(+k) ? copy.splice(k, 1) : delete copy[k];
        } else if (
          val === null ||
          typeof val !== 'object' ||
          Array.isArray(val)
        ) {
          copy[k] = val;
        } else if (typeof copy[k] === 'object') {
          copy[k] = val === copy[k] ? val : (merge(copy[k], val) as T[keyof T]);
        } else {
          copy[k] = run(false, {} as T[keyof T], val);
        }
      }
    }
  } else if (type === 'function') {
    copy = (patch as PatchFunction)(copy, merge);
  }
  return copy;
};

export type ValueOf<U> = U[keyof U];

/**
 * Object.assign supercharged, supporting:
 * - Deep patching
 * - Patching based on the current value
 * - Deleting properties that are undefined
 *
 * @author Daniel Loomer, https://github.com/fuzetsu
 */
export const merge = <
  T extends Record<string, any> | ((m: T) => T) | ((m: T) => Promise<T>)
>(
  source: T | T[],
  ...patches: T[]
) => {
  const isArr = Array.isArray(source);
  return run(
    isArr,
    isArr ? (source as T[]).slice() : assign({}, source),
    patches
  );
};

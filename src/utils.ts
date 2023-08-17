import { DeepPartial } from "./types";

/**
 * Turns a string into title case string
 *  - If non string input is passed, method will return same input
 * @param value string to be converted to title case
 * @param splitter splitter to split the input. defaults to whitespace
 * @returns Title Case String
 */
export function toTitleCase(value: string, splitter = " "): string {
  if (typeof value !== "string") {
    return value;
  }
  return value
    .split(splitter)
    .map(
      (v) =>
        v.substring(0, 1)?.toLocaleUpperCase() +
        v.substring(1)?.toLocaleLowerCase()
    )
    .join(" ");
}

/**
 * Turns an object's kabab cased keys to camel case keys
 * @param value object to be converted
 * @returns Camel case keyed object
 */
export function camelize<R = unknown, T = unknown>(value: T): R {
  if (typeof value !== "object" || value === null) {
    return value as unknown as R;
  }
  if (Array.isArray(value)) {
    return camelizeArray(value) as unknown as R;
  } else {
    return camelizeObject(value);
  }
}

/**
 * Checks the validity of an entity.
 * An entity is considered valid -
 *  - array : if at least 1 element is valid
 *  - bigint : always valid
 *  - boolean : always valid
 *  - number : always valid
 *  - object : if it is non null and has at least 1 value which is valid
 *  - string : if it contains atleast 1 character other than whitespace
 *  - others : always invalid
 * @param value input whose validity is to be checked
 * @returns boolean value if input is valid
 */
export function isValid<T = unknown>(value: T): boolean {
  switch (typeof value) {
    case "string":
      return Boolean(value.trim().length);
    case "object":
      if (value === null) {
        return false;
      }
      if (Array.isArray(value)) {
        return value.some((v) => isValid(v));
      } else {
        return Object.keys(value).some((k) =>
          isValid((value as Record<string, unknown>)[k])
        );
      }
    case "number":
      return true;
    case "bigint":
      return true;
    case "boolean":
      return true;
    default:
      return false;
  }
}

/**
 * Groups an array based on key generator passed.
 *  - array item resulting in invalid key generated will be skipped
 * @param value array to be grouped
 * @param keyGenerator function which will be executed for each item of the array
 * @returns Grouped value
 */
export function groupBy<T extends {}>(
  value: T[],
  keyGenerator: (item: T) => string
): Record<string, T[]> {
  if (!Array.isArray(value) || typeof keyGenerator !== "function") {
    return {};
  }
  return value.reduce((accumulator, currentItem) => {
    const key = keyGenerator(currentItem);
    if (!isValid(key)) {
      return accumulator;
    }
    if (!accumulator[key]) {
      accumulator[key] = [];
    }
    accumulator[key]?.push(currentItem);
    return accumulator;
  }, {} as Record<string, T[]>);
}

/**
 * Normalize an array based on key generator passed
 * - array item resulting in invalid key generated will be skipped
 * - always first array item will be present in normalized object for the same key generated
 * @param value array to be normalized
 * @param keyGenerator function which will be executed for each item of the array
 * @returns Normalized object
 */
export function normalize<T extends {}>(
  value: T[],
  keyGenerator: (item: T) => string
): Record<string, T> {
  if (!Array.isArray(value) || typeof keyGenerator !== "function") {
    return {};
  }
  return value.reduce((accumulator, currentItem) => {
    const key = keyGenerator(currentItem);
    if (!isValid(key)) {
      return accumulator;
    }
    if (!accumulator[key]) {
      accumulator[key] = currentItem;
    }
    return accumulator;
  }, {} as Record<string, T>);
}

/**
 * Checks the equality of two entity
 *  - array will be compared based on index
 *  - objects will be recursively compared
 *  - string will be compared using '==='
 *  - all others will be compared using '==='
 * @param value1 first entity
 * @param value2 second entity
 * @param trimWhiteSpace whether strings are to be trimmed before comparing. defaults to false
 * @param ignoreCase whether string values are to be compared ignoring case. defaults to true
 * @returns
 */
export function areEqual<T = unknown>(
  value1: T,
  value2: T,
  trimWhiteSpace = false,
  ignoreCase = true
): boolean {
  if (typeof value1 !== typeof value2) {
    return false;
  }
  switch (typeof value1) {
    case "string":
      let v1 = value1 as string;
      let v2 = value2 as string;
      if (trimWhiteSpace) {
        v1 = v1.trim();
        v2 = v2.trim();
      }
      if (ignoreCase) {
        return v1.toLocaleLowerCase() === v2.toLocaleLowerCase();
      } else {
        return v1 === v2;
      }
    case "object":
      if (value1 === null || value2 === null) {
        return value1 === value2;
      }
      if (Array.isArray(value1) && Array.isArray(value2)) {
        return (
          value1.length === value2.length &&
          value2.every((value, index) => areEqual(value, value1[index], trimWhiteSpace, ignoreCase))
        );
      } else if (
        (Array.isArray(value1) && !Array.isArray(value2)) ||
        (Array.isArray(value2) && !Array.isArray(value1))
      ) {
        return false;
      } else {
        const v1 = value1 as unknown as Record<string, unknown>;
        const v2 = value2 as unknown as Record<string, unknown>;
        const keys = Object.keys(v1);
        return (
          keys.length === Object.keys(v2).length &&
          keys.every((key) => areEqual(v1[key], v2[key], trimWhiteSpace, ignoreCase))
        );
      }
    default:
      return value1 === value2;
  }
}

/**
 * Checks a condition and throw error if condition doesn't satisfy
 * @param condition condition to be checked
 * @param message error message
 */
export function invarient(
  condition: unknown,
  message?: string
): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

/**
 * Sanitizes an entity
 *  - array : removes invalid values
 *  - objects : removes invalid values
 *  - string : trims
 *  - others : returns same input
 * @param value entity to be sanitized
 * @returns Sanitized entity
 */
export function sanitize<T = unknown>(value: T): DeepPartial<T> {
  if (typeof value === "string") {
    return value.trim() as DeepPartial<T>;
  } else if (typeof value === "object") {
    if (value === null) {
      return value as DeepPartial<T>;
    }
    if (Array.isArray(value)) {
      const sanitizedArray: T[] = [];
      value.forEach((v) => {
        const sanitizedV = sanitize(v);
        if (isValid(sanitizedV)) {
          sanitizedArray.push(sanitizedV);
        }
      });
      return sanitizedArray as DeepPartial<T>;
    } else {
      const v = value as unknown as Record<string, unknown>;
      const result: Record<string, unknown> = {};
      const keys = Object.keys(v);
      keys.forEach((k) => {
        const _v = sanitize(v[k]);
        if (isValid(_v)) {
          result[k] = _v;
        }
      });
      return result as DeepPartial<T>;
    }
  } else {
    return value as DeepPartial<T>;
  }
}

function camelizeObject<R = unknown, T = unknown>(obj: T): R {
  if (typeof obj !== "object" || obj === null) {
    return obj as unknown as R;
  }

  if (Array.isArray(obj)) {
    return camelizeArray(obj) as unknown as R;
  } else {
    const input = obj as Record<string, unknown>;
    const keys = Object.keys(input);
    const result: Record<string, unknown> = {};
    keys.forEach((key) => {
      const value = input[key];
      const splittedKey = key.split("_");
      const transformedKey =
        splittedKey[0]?.toLocaleLowerCase() +
        splittedKey
          .slice(1)
          .map((k) => toTitleCase(k))
          .join("");
      result[transformedKey] = camelizeObject(value);
    });
    return result as R;
  }
}

function camelizeArray<R = unknown, T = unknown>(arr: T[]): R[] {
  if (!Array.isArray(arr)) {
    return arr as unknown as R[];
  }
  return arr.map((item) => {
    if (Array.isArray(item)) {
      return camelizeArray(item);
    } else {
      return camelizeObject(item);
    }
  }) as R[];
}

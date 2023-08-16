type _DeepPartial<T extends {}> = {
  [K in keyof T]?: DeepPartial<T[K]>;
};

/**
 * Turns all the proerty of entity including nested properties optional
 */
export type DeepPartial<T> = T extends (...args: unknown[]) => unknown
  ? T | undefined
  : T extends object
  ? T extends ReadonlyArray<infer Item>
    ? Item[] extends T
      ? readonly Item[] extends T
        ? ReadonlyArray<DeepPartial<Item | undefined>>
        : Array<DeepPartial<Item | undefined>>
      : _DeepPartial<T>
    : _DeepPartial<T>
  : T | undefined;

/**
 * Transform a type T to a new type having keys matching type V
 */
export type KeyMatching<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

/**
 * Prettifies object type
 */
export type Prettify<T> = { [K in keyof T]: T[K] } & {};

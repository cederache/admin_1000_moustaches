/**
 * Type for nullable boolean fields (e.g. Animal sterilised, adopted).
 * - undefined: key omitted from payload (no change)
 * - null: sent as "key": null so server stores null
 * - boolean: true/false
 */
export type NullableBoolean = boolean | null | undefined;

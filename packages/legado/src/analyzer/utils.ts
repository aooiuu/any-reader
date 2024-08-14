export function isExplicitObject(value: any) {
    return typeof value === 'object' && value !== null && value.constructor === Object;
}

export function parseJson<T>(jsonString: string): T | null {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.error("JSON parsing error:", e);
    return null;
  }
}

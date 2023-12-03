export function fixTypesSerialization<T>(object: T[]): ({toJSON(): T[]}) {
  const data = {
    toJSON() {
      return object;
    }
  }
  return data;
}
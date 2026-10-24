export function Cache<Instance extends object, Arguments extends number[]>(
  target: object,
  methodName: string | symbol,
  descriptor: TypedPropertyDescriptor<
    (this: Instance, ...args: Arguments) => number
  >
): void {
  const originalMethod = descriptor.value;

  if (originalMethod === undefined) {
    throw new Error("Cache must decorate a method");
  }

  const instanceCaches = new WeakMap<Instance, Map<string, number>>();

  descriptor.value = function (
    this: Instance,
    ...args: Arguments
  ): number {
    if (!args.every(argument => Number.isFinite(argument))) {
      throw new Error("Cache arguments must be finite numbers");
    }

    let cache = instanceCaches.get(this);

    if (cache === undefined) {
      cache = new Map<string, number>();
      instanceCaches.set(this, cache);
    }

    const key = args
      .map(argument => Object.is(argument, -0) ? "-0" : String(argument))
      .join(",");

    const cachedResult = cache.get(key);

    if (cachedResult !== undefined) {
      console.log(`[CACHE HIT] ${String(methodName)}(${key})`);

      return cachedResult;
    }

    console.log(`[CACHE MISS] ${String(methodName)}(${key})`);

    const result = originalMethod.apply(this, args);

    cache.set(key, result);

    return result;
  };
}
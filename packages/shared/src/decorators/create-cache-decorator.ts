export interface CreateCacheDecoratorOptions<T> {
  getItem: (key: string) => Promise<T>;
  setItem: (
    key: string,
    value: T,
    options: {
      ttl: number;
    }
  ) => Promise<void>;
}

function isEmpty(data: any): boolean {
  if (typeof data === 'undefined') return true;
  if (typeof data === 'string' || Array.isArray(data)) return !data.length;
  if (typeof data === 'boolean') return false;
  else return !Object.keys(data).length;
}

export interface DecoratorArgs {
  ttl?: number;
  cacheKey: (arg: { className: string; methodName: string; args: any[] }) => string;
  verify?: (data: any) => boolean;
}

export function createCacheDecorator<T>(options: CreateCacheDecoratorOptions<T>) {
  return (decoratorArgs: DecoratorArgs): MethodDecorator => {
    return (_target: unknown, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
      const fn = descriptor.value;

      descriptor.value = async function (...args: unknown[]) {
        const methodName = propertyKey.toString();
        let cacheKey = '';
        if (typeof decoratorArgs.cacheKey === 'function') {
          cacheKey = decoratorArgs.cacheKey({
            className: this.constructor.name,
            methodName,
            args
          });
        } else {
          cacheKey = `${this.constructor.name}_${methodName}`;
        }

        const cachedResult = await options.getItem(cacheKey);
        const verified = typeof decoratorArgs.verify !== 'function' || decoratorArgs.verify(cachedResult);

        if (!isEmpty(cachedResult) && verified) {
          return cachedResult;
        } else {
          const result = await fn.apply(this, args);
          if (!isEmpty(result)) {
            await options.setItem(cacheKey, result, {
              ttl: decoratorArgs.ttl || 0
            });
          }

          return result;
        }
      };

      return descriptor;
    };
  };
}

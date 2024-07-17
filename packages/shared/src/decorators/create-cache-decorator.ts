export interface CreateCacheDecoratorOptions<T> {
  getItem: (key: string) => Promise<T>
  setItem: (key: string, value: T) => Promise<void>
}

export function createCacheDecorator<T>(
  options: CreateCacheDecoratorOptions<T>,
) {
  return (decoratorArgs: {
    cacheKey: (arg: {
      className: string
      methodName: string
      args: any[]
    }) => string
  }): MethodDecorator => {
    return (
      _target: unknown,
      propertyKey: string | symbol,
      descriptor: TypedPropertyDescriptor<any>,
    ) => {
      const fn = descriptor.value

      descriptor.value = async function (...args: unknown[]) {
        const methodName = propertyKey.toString()
        let cacheKey = ''
        if (typeof decoratorArgs.cacheKey === 'function') {
          cacheKey = decoratorArgs.cacheKey({
            className: this.constructor.name,
            methodName,
            args,
          })
        }
        else {
          cacheKey = `${this.constructor.name}_${methodName}`
        }

        const cachedResult = await options.getItem(cacheKey)

        if (cachedResult !== undefined) {
          return cachedResult
        }
        else {
          const result = await fn.apply(this, args)
          await options.setItem(cacheKey, result)
          return result
        }
      }

      return descriptor
    }
  }
}

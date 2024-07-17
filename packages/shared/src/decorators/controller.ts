import { isConstructor, isFunction } from '../utils/is'

const PATH_METADATA = 'path'
const METHOD_METADATA = 'method'

export enum RequestMethod {
  GET = 'GET',
  POST = 'POST',
}

export function Controller(path: string): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(PATH_METADATA, path, target)
  }
}

interface RequestMappingMetadata {
  path?: string | string[]
  method?: RequestMethod
}

const defaultMetadata = {
  [PATH_METADATA]: '/',
  [METHOD_METADATA]: RequestMethod.GET,
}

function RequestMapping(
  metadata: RequestMappingMetadata = defaultMetadata,
): MethodDecorator {
  const pathMetadata = metadata[PATH_METADATA]
  const path = pathMetadata && pathMetadata.length ? pathMetadata : '/'
  const requestMethod = metadata[METHOD_METADATA] || RequestMethod.GET

  return (
    target: object,
    key: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    Reflect.defineMetadata(PATH_METADATA, path, descriptor.value)
    Reflect.defineMetadata(METHOD_METADATA, requestMethod, descriptor.value)
    return descriptor
  }
}

function createMappingDecorator(method: RequestMethod) {
  return (path?: string | string[]): MethodDecorator => {
    return RequestMapping({
      [PATH_METADATA]: path,
      [METHOD_METADATA]: method,
    })
  }
}

export const Get = createMappingDecorator(RequestMethod.GET)
export const Post = createMappingDecorator(RequestMethod.POST)

interface Route {
  method: string
  route: string
  methodName: string
}

export function mapRoute(controller: object): Route[] {
  const instance = Object.create(controller)
  const prototype = instance.prototype
  const basePath: string = Reflect.getMetadata(PATH_METADATA, controller)

  const methodsNames = Object.getOwnPropertyNames(prototype).filter(
    methodName =>
      !isConstructor(methodName)
      && isFunction(prototype[methodName])
      && Reflect.getMetadata(PATH_METADATA, prototype[methodName]),
  )

  return methodsNames.map((methodName) => {
    const fn = prototype[methodName]
    const methodPath: string = Reflect.getMetadata(PATH_METADATA, fn)
    let route = basePath.replace(/^\//, '') // 移出前缀斜杠
    if (methodPath.startsWith('/'))
      route = methodPath // 方法定义完整路径
    else route = `${route}/${methodPath}` // 补充 controller 路径

    const method = Reflect.getMetadata(METHOD_METADATA, fn)
    return {
      method,
      route,
      methodName,
    }
  })
}

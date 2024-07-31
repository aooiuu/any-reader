export class JsVmException extends Error {
  constructor(message = '') {
    super(JSON.stringify({
      type: 'JsVmException',
      message,
    }))
  }
}

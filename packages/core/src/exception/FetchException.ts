export class FetchException extends Error {
  constructor(message = '', params: any = {}) {
    super(JSON.stringify({
      type: 'FetchException',
      params,
      message,
    }))
  }
}

import puppeteer from 'puppeteer'
import type { Analyzer } from './Analyzer'

export class AnalyzerFilter implements Analyzer {
  private _content!: string
  private _url!: string

  parse(content: string | string[]) {
    if (Array.isArray(content))
      this._content = content.join('\n')
    else
      this._content = content

    this._url = this._content
  }

  async getString(rule: string): Promise<string> {
    return (await this.getStringList(rule)).join('')
  }

  // "(?:m3u8|mp4)(?:$|/|\\?|&)"
  async getStringList(rule: string): Promise<any[]> {
    const r = rule.split('@@')
    const reg = new RegExp(r[0])

    if (reg.test(this._url)) {
      return [
        { url: this._url },
      ]
    }

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setRequestInterception(true)

    const result: any = []
    page.on('request', (req) => {
      if (req.isInterceptResolutionHandled())
        return
      const url = req.url()

      if (reg.test(url)) {
        result.push({
          url,
          method: req.method(),
          headers: req.headers(),
        })
        req.abort()
      }
      else {
        req.continue()
      }
    })

    await page.goto(this._url)
    await browser.close()
    return result
  }

  async getElements(rule: string): Promise<string[]> {
    return this.getStringList(rule)
  }
}

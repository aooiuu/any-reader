/**
 * 功能实现参考: https://github.com/SchneeHertz/node-edge-tts/blob/master/src/edge-tts.ts
 */

import { createWriteStream, readFileSync } from 'node:fs'
import { Buffer } from 'node:buffer'
import { WebSocket } from 'ws'
import { v4 } from 'uuid'

interface subLine {
  part: string
  start: number
  end: number
}

interface configure {
  outputFormat?: string
}

class EdgeTTS {
  private outputFormat: string

  constructor({
    outputFormat = 'audio-24khz-48kbitrate-mono-mp3',
  }: configure = {}) {
    this.outputFormat = outputFormat
  }

  async _connectWebSocket(): Promise<WebSocket> {
    const wsConnect = new WebSocket(
      'wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=6A5AA1D4EAFF4E9FB37E23D68491D6F4',
      {
        host: 'speech.platform.bing.com',
        origin: 'chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.66 Safari/537.36 Edg/103.0.1264.44',
        },
      },
    )
    return new Promise((resolve) => {
      wsConnect.on('open', () => {
        wsConnect.send(`Content-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n
          {
            "context": {
              "synthesis": {
                "audio": {
                  "metadataoptions": {
                    "sentenceBoundaryEnabled": "false",
                    "wordBoundaryEnabled": "true"
                  },
                  "outputFormat": "${this.outputFormat}"
                }
              }
            }
          }
        `)
        resolve(wsConnect)
      })
    })
  }

  async ttsPromise(
    text: string,
    audioPath: string,
    {
      volume = 'default',
      pitch = 'default',
      rate = 'default',
      voice = 'zh-CN-XiaoyiNeural',
      lang = 'zh-CN',
    } = {},
  ) {
    const _wsConnect = await this._connectWebSocket()
    // eslint-disable-next-line @typescript-eslint/ban-types
    return new Promise((resolve: Function) => {
      const audioStream = createWriteStream(audioPath!)
      const subFile: subLine[] = []
      _wsConnect.on('message', async (data: Buffer, isBinary: boolean) => {
        if (isBinary) {
          const separator = 'Path:audio\r\n'
          const index = data.indexOf(separator) + separator.length
          const audioData = data.subarray(index)
          audioStream.write(audioData)
        }
        else {
          const message = data.toString()
          if (message.includes('Path:turn.end')) {
            audioStream.end()
            resolve(
              resolve(Buffer.from(readFileSync(audioPath!)).toString('base64')),
            )
          }
          else if (message.includes('Path:audio.metadata')) {
            const splitTexts = message.split('\r\n')
            try {
              const metadata = JSON.parse(splitTexts[splitTexts.length - 1])
              metadata.Metadata.forEach((element: any) => {
                subFile.push({
                  part: element.Data.text.Text,
                  start: Math.floor(element.Data.Offset / 10000),
                  end: Math.floor(
                    (element.Data.Offset + element.Data.Duration) / 10000,
                  ),
                })
              })
            }
            catch {}
          }
        }
      })
      const data = `X-RequestId:${v4()}\r\n`
      + 'Content-Type:application/ssml+xml\r\n'
      + 'Path:ssml\r\n\r\n'
       + `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="${lang}">`
    + `<voice name="${voice}">`
    + `<prosody rate="${rate}" pitch="${pitch}" volume="${volume}">${text}</prosody>`
    + '</voice>'
    + '</speak>'
      _wsConnect.send(data)
    })
  }
}

export { EdgeTTS }

export const tts = new EdgeTTS()

import md5 from 'blueimp-md5';
import { Cacheable, Controller, Post } from '../decorators';
import { tts } from '../utils/tts';
import { BaseController } from './BaseController';

@Controller('/tts')
export class TTS extends BaseController {
  @Post('base64')
  @Cacheable({
    cacheKey({ args }) {
      const { text = '' } = args[0];
      return `tts@${md5(text)}`;
    }
  })
  async base64({ text }: { text: string }) {
    return tts.ttsPromise(text);
  }
}

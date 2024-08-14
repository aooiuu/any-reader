import { Controller, Post } from '../decorators';
import { BaseController } from './BaseController';

@Controller('/config')
export class Config extends BaseController {
  @Post('read')
  async read() {
    return this.app.config;
  }

  @Post('save')
  async list(data: any) {
    return this.app.updateConfig(data);
  }
}

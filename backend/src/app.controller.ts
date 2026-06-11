import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('hc')
  hc() {
    return { ok: true };
  }
}

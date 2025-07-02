import { Controller, Sse } from '@nestjs/common';
import { InfoService } from './info.service';
import { InfoEntity } from './info.entity';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

@ApiTags('服务器运行状态')
@ApiBearerAuth('bearer')
@Controller('info')
export class InfoController {
  constructor(private readonly infoService: InfoService) {}

  @Sse()
  @ApiOperation({ summary: '运行信息' })
  @ApiOkResponse({ type: InfoEntity })
  systemInfo() {
    return this.infoService.systemInfo();
  }
}

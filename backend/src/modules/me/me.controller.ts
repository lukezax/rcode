import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CodesService } from '../codes/codes.service';
import { TargetsService } from '../targets/targets.service';

@ApiTags('用户中心')
@Controller('me')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MeController {
  constructor(
    private readonly codesService: CodesService,
    private readonly targetsService: TargetsService,
  ) {}

  @Get('codes')
  @ApiOperation({ summary: '我的上传' })
  async myCodes(@Request() req) {
    return this.codesService.findMyCodes(req.user.id);
  }

  @Get('feedbacks')
  @ApiOperation({ summary: '我的反馈' })
  async myFeedbacks(@Request() req) {
    return this.codesService.findMyFeedbacks(req.user.id);
  }

  @Get('applications')
  @ApiOperation({ summary: '我的目标申请' })
  async myApplications(@Request() req) {
    return this.targetsService.findMyApplications(req.user.id);
  }
}

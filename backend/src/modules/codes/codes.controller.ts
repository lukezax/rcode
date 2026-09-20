import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CodesService } from './codes.service';
import { CreateCodeDto } from './dto/create-code.dto';
import { FeedbackDto, ReportDto } from './dto/feedback.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../common/guards/optional-jwt-auth.guard';

@ApiTags('邀请码')
@Controller('codes')
export class CodesController {
  constructor(private readonly codesService: CodesService) {}

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: '获取邀请码详情（游客可访问，登录后显示完整码）' })
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.codesService.findOne(id, req.user?.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '上传邀请码' })
  async create(@Body() dto: CreateCodeDto, @Request() req) {
    return this.codesService.create(req.user.id, dto);
  }

  @Post(':id/view')
  @ApiOperation({ summary: '增加查看次数' })
  async incrementView(@Param('id', ParseIntPipe) id: number) {
    return this.codesService.incrementView(id);
  }

  @Post(':id/feedback')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '提交有效/无效反馈' })
  async feedback(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: FeedbackDto,
    @Request() req,
  ) {
    return this.codesService.feedback(req.user.id, id, dto);
  }

  @Post(':id/report')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '举报邀请码' })
  async report(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ReportDto,
    @Request() req,
  ) {
    return this.codesService.report(req.user.id, id, dto);
  }
}

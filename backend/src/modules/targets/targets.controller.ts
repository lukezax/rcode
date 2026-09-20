import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { TargetsService } from './targets.service';
import { CreateTargetDto } from './dto/create-target.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('目标')
@Controller('targets')
export class TargetsController {
  constructor(private readonly targetsService: TargetsService) {}

  @Get()
  @ApiOperation({ summary: '获取目标列表' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'keyword', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  async findAll(
    @Query('category') category?: string,
    @Query('keyword') keyword?: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.targetsService.findAll({ category, keyword, page, pageSize });
  }

  @Get(':id')
  @ApiOperation({ summary: '获取目标详情' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.targetsService.findOne(id);
  }

  @Get(':id/codes')
  @ApiOperation({ summary: '获取目标下的邀请码列表' })
  @ApiQuery({ name: 'sort', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  async findCodes(
    @Param('id', ParseIntPipe) id: number,
    @Query('sort') sort?: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.targetsService.findCodes(id, { sort, page, pageSize });
  }

  @Post('apply')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '申请新增目标' })
  async apply(@Body() dto: CreateTargetDto, @Request() req) {
    return this.targetsService.apply(dto, req.user.id);
  }
}

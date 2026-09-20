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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { RejectTargetDto, ResolveReportDto } from './dto/admin.dto';
import { AdminGuard } from '../../common/guards/admin.guard';

@ApiTags('管理后台')
@Controller('admin')
@UseGuards(AdminGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('targets/pending')
  @ApiOperation({ summary: '待审批目标列表' })
  async pendingTargets() {
    return this.adminService.findPendingTargets();
  }

  @Post('targets/:id/approve')
  @ApiOperation({ summary: '通过目标申请' })
  async approveTarget(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.adminService.approveTarget(id, req.user.id);
  }

  @Post('targets/:id/reject')
  @ApiOperation({ summary: '拒绝目标申请' })
  async rejectTarget(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RejectTargetDto,
    @Request() req,
  ) {
    return this.adminService.rejectTarget(id, req.user.id, dto.reason);
  }

  @Get('codes')
  @ApiOperation({ summary: '邀请码管理列表' })
  async codes(
    @Query('targetId') targetId?: number,
    @Query('status') status?: string,
    @Query('keyword') keyword?: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.adminService.findCodes({
      targetId,
      status,
      keyword,
      page,
      pageSize,
    });
  }

  @Post('codes/:id/remove')
  @ApiOperation({ summary: '下架邀请码' })
  async removeCode(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.removeCode(id);
  }

  @Get('reports')
  @ApiOperation({ summary: '举报列表' })
  async reports(@Query('status') status?: string) {
    return this.adminService.findReports(status);
  }

  @Post('reports/:id/resolve')
  @ApiOperation({ summary: '处理举报' })
  async resolveReport(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ResolveReportDto,
  ) {
    return this.adminService.resolveReport(id, dto.action);
  }

  @Get('stats')
  @ApiOperation({ summary: '统计数据' })
  async stats() {
    return this.adminService.getStats();
  }

  @Get('users')
  @ApiOperation({ summary: '用户列表' })
  async users() {
    return this.adminService.findUsers();
  }

  @Post('users/:id/toggle')
  @ApiOperation({ summary: '封禁/解封用户' })
  async toggleUser(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.toggleUserStatus(id);
  }
}

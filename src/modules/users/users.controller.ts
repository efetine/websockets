import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LimitPipe } from '../products/pipes/limitPage.pipe';
import { CreateUserDto } from '../../../db/schema';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get All Paginated Users (page/limit)' })
  async findAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', LimitPipe) limit: number,
  ) {
    return await this.usersService.findAll({ page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get User By ID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.usersService.findOneBy(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update User By ID' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: Partial<CreateUserDto>,
  ) {
    return await this.usersService.updateUser(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete User By ID' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.usersService.removeUser(id);
  }
}

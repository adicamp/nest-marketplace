import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateItemDto } from './dtos/create-item.dto';
import { ItemService } from './item.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../user/user.entity';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ItemDto } from './dtos/item.dto';
import { ApproveItemDto } from './dtos/approve-item.dto';
import { AdminGuard } from '../guards/admin.guard';
import { QueryItemDto } from './dtos/query-item.dto';

@Controller('items')
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Get()
  getAllItems(@Query() query: QueryItemDto) {
    return this.itemService.getAllItems(query);
  }

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ItemDto)
  createItem(@Body() body: CreateItemDto, @CurrentUser() user: User) {
    return this.itemService.create(body, user);
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  approveItem(@Param('id') id: string, @Body() body: ApproveItemDto) {
    return this.itemService.approveItem(parseInt(id), body.approved);
  }
}

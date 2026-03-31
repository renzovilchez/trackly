import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { LinksService } from './links.service';
import { Link } from './links.entity';
import { CreateLinkDto } from './dto/create-link.dto';

@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Post()
  createLink(@Body() link: CreateLinkDto): Promise<Link> {
    return this.linksService.createLink(link);
  }

  @Get()
  async getLinks(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ) {
    return this.linksService.getLinksWithPagination(page, limit, search);
  }

  @Get(':id')
  getLinkById(@Param('id', ParseIntPipe) id: number): Promise<Link> {
    return this.linksService.getLinkById(id);
  }
}

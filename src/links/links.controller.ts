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
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(0), ParseIntPipe) limit?: number,
    @Query('search') search?: string,
  ): Promise<
    | Link[]
    | {
        data: Link[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      }
  > {
    if (!page && !limit) {
      return this.linksService.getLinks();
    }
    return this.linksService.getLinksWithPagination(
      page || 1,
      limit || 10,
      search,
    );
  }

  @Get(':id')
  getLinkById(@Param('id', ParseIntPipe) id: number): Promise<Link> {
    return this.linksService.getLinkById(id);
  }
}

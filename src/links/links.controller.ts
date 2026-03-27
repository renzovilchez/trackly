import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { LinksService } from './links.service';
import { Link } from './links.entity';
import { DeleteResult } from 'typeorm';
import { CreateLinkDto } from './dto/create-link.dto';

@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Post()
  createLink(@Body() link: CreateLinkDto): Promise<Link> {
    return this.linksService.createLink(link);
  }

  @Get()
  getLinks(): Promise<Link[]> {
    return this.linksService.getLinks();
  }

  @Get(':id')
  getLinkById(@Param('id', ParseIntPipe) id: number): Promise<Link> {
    return this.linksService.getLinkById(id);
  }

  @Delete(':id')
  deleteLink(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.linksService.deleteLink(id);
  }
}

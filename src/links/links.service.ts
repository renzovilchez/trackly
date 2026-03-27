import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Link } from './links.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateLinkDto } from './dto/create-link.dto';
import { nanoid } from 'nanoid';

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(Link)
    private readonly linkRepository: Repository<Link>,
  ) {}

  async createLink(dto: CreateLinkDto): Promise<Link> {
    const maxRetries = 3;
    let attempts = 0;

    while (attempts < maxRetries) {
      const slug = nanoid(6);

      try {
        const link = await this.linkRepository.save({
          url: dto.url,
          slug,
        });
        return link;
      } catch (error) {
        attempts++;
        const isDuplicate =
          error.code === '23505' || // PostgreSQL
          error.code === 'ER_DUP_ENTRY' || // MySQL
          error?.message?.includes('UNIQUE constraint failed') || // SQLite
          error?.message?.includes(
            'duplicate key value violates unique constraint',
          );

        if (isDuplicate) {
          if (attempts >= maxRetries) {
            throw new ConflictException(
              'No se pudo generar un slug único. Inténtalo de nuevo.',
            );
          }
        } else {
          throw error;
        }
      }
    }

    throw new HttpException(
      'Error inesperado al crear el enlace',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  async getLinks(): Promise<Link[]> {
    const links = await this.linkRepository.find();
    return links;
  }

  async getLinkById(id: number): Promise<Link> {
    const link = await this.linkRepository.findOne({ where: { id } });
    if (!link) {
      throw new NotFoundException('Link no encontrado');
    }
    return link;
  }

  async deleteLink(id: number): Promise<DeleteResult> {
    return this.linkRepository.delete(id);
  }

  async findBySlug(slug: string): Promise<Link> {
    const link = await this.linkRepository.findOne({ where: { slug } });
    if (!link) {
      throw new NotFoundException('Link no encontrado');
    }
    return link;
  }
}

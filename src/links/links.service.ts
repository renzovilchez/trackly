import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Link } from './links.entity';
import { Repository } from 'typeorm';
import { CreateLinkDto } from './dto/create-link.dto';
import { nanoid } from 'nanoid';

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(Link)
    private readonly linkRepository: Repository<Link>,
  ) {}

  async createLink(dto: CreateLinkDto): Promise<Link> {
    if (!dto.url.startsWith('https://')) {
      throw new BadRequestException('Solo URLs HTTPS son permitidas');
    }
    const urlObj = new URL(dto.url);
    const hostname = urlObj.hostname;

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      throw new BadRequestException('No se permiten URLs locales');
    }
    if (
      /^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.)|^127\./.test(hostname)
    ) {
      throw new BadRequestException('No se permiten IPs privadas');
    }

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

  async getLinksWithPagination(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{
    data: Link[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const query = this.linkRepository.createQueryBuilder('link');

    if (search) {
      query.andWhere('(link.url ILIKE :search OR link.slug ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    const [data, total] = await query
      .skip(skip)
      .take(limit)
      .orderBy('link.createdAt', 'DESC')
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findBySlug(slug: string): Promise<Link> {
    const link = await this.linkRepository.findOne({ where: { slug } });
    if (!link) {
      throw new NotFoundException('Link no encontrado');
    }
    return link;
  }
}

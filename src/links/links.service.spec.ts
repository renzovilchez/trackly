import { Test, TestingModule } from '@nestjs/testing';
import { LinksService } from './links.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Link } from './links.entity';
import { NotFoundException } from '@nestjs/common';

describe('LinksService', () => {
  let service: LinksService;
  let repo: any;

  const mockLinkRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LinksService,
        {
          provide: getRepositoryToken(Link),
          useValue: mockLinkRepository,
        },
      ],
    }).compile();

    service = module.get<LinksService>(LinksService);
    repo = module.get(getRepositoryToken(Link));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createLink', () => {
    it('should successfully create and return a link', async () => {
      const dto = { url: 'https://example.com' };
      const expectedLink = { id: 1, url: dto.url, slug: 'random', createdAt: new Date() };
      repo.save.mockResolvedValue(expectedLink);

      const result = await service.createLink(dto);
      expect(result).toEqual(expectedLink);
      expect(repo.save).toHaveBeenCalled();
    });
  });

  describe('getLinkById', () => {
    it('should return a link if found', async () => {
      const expectedLink = { id: 1, url: 'https://example.com', slug: 'random' };
      repo.findOne.mockResolvedValue(expectedLink);

      const result = await service.getLinkById(1);
      expect(result).toEqual(expectedLink);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.getLinkById(99)).rejects.toThrow(NotFoundException);
    });
  });
});

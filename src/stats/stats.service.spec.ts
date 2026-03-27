import { Test, TestingModule } from '@nestjs/testing';
import { StatsService } from './stats.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Stat } from './stat.entity';
import { Link } from '../links/links.entity';
import { NotFoundException } from '@nestjs/common';

describe('StatsService', () => {
  let service: StatsService;
  let statRepo: any;
  let linkRepo: any;

  const mockStatRepository = {
    find: jest.fn(),
    save: jest.fn(),
  };

  const mockLinkRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatsService,
        {
          provide: getRepositoryToken(Stat),
          useValue: mockStatRepository,
        },
        {
          provide: getRepositoryToken(Link),
          useValue: mockLinkRepository,
        },
      ],
    }).compile();

    service = module.get<StatsService>(StatsService);
    statRepo = module.get(getRepositoryToken(Stat));
    linkRepo = module.get(getRepositoryToken(Link));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getStats', () => {
    it('should return stats for a given link ID', async () => {
      const stats = [{ id: 1, ipAddress: '127.0.0.1', clickedAt: new Date() }];
      statRepo.find.mockResolvedValue(stats);

      const result = await service.getStats(1);
      expect(result).toEqual(stats);
      expect(statRepo.find).toHaveBeenCalledWith({ where: { link: { id: 1 } } });
    });
  });

  describe('createStat', () => {
    it('should create and return a stat if link exists', async () => {
      const mockLink = { id: 1, url: 'https://example.com' };
      const expectedStat = { id: 1, ipAddress: '127.0.0.1', link: mockLink };
      
      linkRepo.findOne.mockResolvedValue(mockLink);
      statRepo.save.mockResolvedValue(expectedStat);

      const result = await service.createStat('127.0.0.1', 1);
      expect(result).toEqual(expectedStat);
      expect(linkRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(statRepo.save).toHaveBeenCalledWith({ ipAddress: '127.0.0.1', link: mockLink });
    });

    it('should throw NotFoundException if link does not exist', async () => {
      linkRepo.findOne.mockResolvedValue(null);
      await expect(service.createStat('127.0.0.1', 99)).rejects.toThrow(NotFoundException);
    });
  });
});

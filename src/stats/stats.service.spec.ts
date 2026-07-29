import { Test, TestingModule } from '@nestjs/testing';
import { StatsService } from './stats.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Stat } from './stat.entity';

describe('StatsService', () => {
  let service: StatsService;
  let statRepo: jest.Mocked<any>;

  const mockStatRepository = {
    count: jest.fn(),
    find: jest.fn(),
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockResolvedValue({ count: '0' }),
      getRawMany: jest.fn().mockResolvedValue([]),
      getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatsService,
        {
          provide: getRepositoryToken(Stat),
          useValue: mockStatRepository,
        },
      ],
    }).compile();

    service = module.get<StatsService>(StatsService);
    statRepo = module.get(getRepositoryToken(Stat));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getStatsSummary', () => {
    it('should return aggregated stats for a given link ID', async () => {
      statRepo.count.mockResolvedValue(3);

      const result = await service.getStatsSummary(1);

      expect(result.totalClicks).toBe(3);
      expect(result.uniqueVisitors).toBe(0);
      expect(result.topBrowsers).toEqual([]);
      expect(result.topReferrers).toEqual([]);
      expect(result.last7Days).toHaveLength(7);
      expect(statRepo.count).toHaveBeenCalledWith({
        where: { link: { id: 1 } },
      });
    });

    it('should return empty stats when no data exists', async () => {
      statRepo.count.mockResolvedValue(0);

      const result = await service.getStatsSummary(999);

      expect(result.totalClicks).toBe(0);
      expect(result.uniqueVisitors).toBe(0);
      expect(result.topBrowsers).toEqual([]);
      expect(result.topReferrers).toEqual([]);
    });
  });

  describe('createStat', () => {
    it('should create and return a stat with hashed IP', async () => {
      const inputData = {
        ip: '127.0.0.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0',
        referer: 'https://google.com/search?q=test',
        linkId: 1,
      };

      const savedStat = {
        id: 1,
        ipHash: expect.any(String),
        browser: 'Chrome',
        refererDomain: 'google.com',
      };

      statRepo.save.mockResolvedValue(savedStat);

      const result = await service.createStat(inputData);

      expect(result).toEqual(savedStat);
      expect(statRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          ipHash: expect.any(String),
          browser: 'Chrome',
          refererDomain: 'google.com',
        }),
      );
    });

    it('should handle null userAgent and referer', async () => {
      const inputData = {
        ip: '192.168.1.1',
        userAgent: '',
        referer: '',
        linkId: 2,
      };

      const savedStat = {
        id: 2,
        ipHash: expect.any(String),
        browser: null,
        refererDomain: null,
      };

      statRepo.save.mockResolvedValue(savedStat);

      const result = await service.createStat(inputData);

      expect(result.browser).toBeNull();
      expect(result.refererDomain).toBeNull();
    });
  });

  describe('cleanupOldStats', () => {
    it('should delete stats older than 30 days', async () => {
      statRepo.delete.mockResolvedValue({ affected: 5 });

      await service.cleanupOldStats();

      expect(statRepo.delete).toHaveBeenCalledWith({
        clickedAt: expect.any(Object),
      });
    });
  });
});

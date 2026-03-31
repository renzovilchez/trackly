import { Test, TestingModule } from '@nestjs/testing';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';

describe('StatsController', () => {
  let controller: StatsController;
  let statsService: StatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatsController],
      providers: [
        {
          provide: StatsService,
          useValue: {
            getStatsSummary: jest.fn().mockReturnValue({ totalClicks: 0 }),
          },
        },
      ],
    }).compile();

    controller = module.get<StatsController>(StatsController);
    statsService = module.get<StatsService>(StatsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

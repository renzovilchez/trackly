import { Test, TestingModule } from '@nestjs/testing';
import { RedirectController } from './redirect.controller';
import { LinksService } from '../links.service';
import { StatsService } from '../../stats/stats.service';

describe('RedirectController', () => {
  let controller: RedirectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RedirectController],
      providers: [
        { provide: LinksService, useValue: { findBySlug: jest.fn() } },
        { provide: StatsService, useValue: { createStat: jest.fn() } },
      ],
    }).compile();

    controller = module.get<RedirectController>(RedirectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

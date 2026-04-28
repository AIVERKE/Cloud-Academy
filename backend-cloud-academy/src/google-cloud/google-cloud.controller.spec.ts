import { Test, TestingModule } from '@nestjs/testing';
import { GoogleCloudController } from './google-cloud.controller';

describe('GoogleCloudController', () => {
  let controller: GoogleCloudController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoogleCloudController],
    }).compile();

    controller = module.get<GoogleCloudController>(GoogleCloudController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

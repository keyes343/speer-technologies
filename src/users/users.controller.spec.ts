import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import httpMocks from 'node-mocks-http';

describe('UsersController', () => {
  let controller: UsersController;

  // const mockUsersService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

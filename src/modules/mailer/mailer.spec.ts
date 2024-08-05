import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from './mailer.service';

describe('MailerService', () => {
  let mailerService: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: MailerService,
          useValue: {
            sendPasswordRecoveryEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    mailerService = module.get<MailerService>(MailerService);
  });

  it('should send a password recovery email', async () => {
    await mailerService.sendPasswordRecoveryEmail('test@example.com', 'dummy-token');

    expect(mailerService.sendPasswordRecoveryEmail).toHaveBeenCalledWith(
      'test@example.com',
      'dummy-token'
    );
  });
});

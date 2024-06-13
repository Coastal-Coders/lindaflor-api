import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ReviewModule],
  providers: [ReviewModule, PrismaModule],
})
export class ReviewModule {}

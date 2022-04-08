import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService] //Exporting prisma service so other modules can query the database
})
export class DatabaseModule {}

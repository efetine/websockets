import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesRepository } from './files.repository';

@Module({
  providers: [FilesService, FilesRepository],
})
export class FilesModule {}

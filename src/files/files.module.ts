import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nodo } from './entities/nodo.entity';
import { FileNode } from './entities/file-node.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Nodo]),
    TypeOrmModule.forFeature([FileNode], "files"),
  ],
  providers: [FilesService],
  controllers: [FilesController]
})
export class FilesModule {}

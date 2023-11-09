import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ILike, Like, MoreThan } from "typeorm";

import { FilterProfitsDto } from 'src/profits/dto/filter-profits.dto';
import { Repository } from 'typeorm';
import { FileNode } from './entities/file-node.entity';
import { Nodo } from './entities/nodo.entity';
import { ResponseService } from 'src/interfaces/response.interface';
import { FilterFilesDto } from './dto/filter-files.dto';





@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(Nodo)
    private readonly nodesRepository: Repository<Nodo>,
    @InjectRepository(FileNode, 'files')
    private readonly filesRepository: Repository<FileNode>,
  ) { }

  async getDirectory(filterFilesDto: FilterFilesDto): Promise<ResponseService> {
    console.log(filterFilesDto);
    const getRootParent = async () => {
      const parent = await this.nodesRepository.findOne({
        where: {
          typeNode: 'C',
          level: 0,
          name: Like('%seguro%')
        }
      });
      return parent.id
    }
    let filter = {
      status: true,
    }
    if (filterFilesDto.name) {
      filter["name"] = ILike(`%${filterFilesDto.name}%`);
      filter['idParent'] = MoreThan(2);
    } else {
      filter['idParent'] = filterFilesDto.parent ?? (await getRootParent())
    }

    //idParent: 
    const query = this.nodesRepository.find({
      where: filter,
      take: filterFilesDto.limit ?? 20,
      order: {
        typeNode: {
          direction: 'DESC'
        },
        name: {
          direction: 'ASC'
        },
        
      },
      skip:
        filterFilesDto.page === 1
          ? 0
          : (filterFilesDto.page - 1) * (filterFilesDto.limit ?? 20),
    });

    const total = await this.nodesRepository.count({ where: filter });

    return {
      docs: await query,
      totalDocs: total,
      totalPages: Math.ceil(total / (filterFilesDto.limit ?? 20)),
      currentPage: filterFilesDto.page,
      hasNextPage: total === (filterFilesDto.page * (filterFilesDto.limit ?? 20)) || (filterFilesDto.page * (filterFilesDto.limit ?? 20)) > total ? false : true
    }

  }

  async getListFiles(filterFilesDto: FilterProfitsDto): Promise<{
    docs: Array<Nodo>;
    totalDocs: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
  }> {
    let filter = [{
      status: true,
    }]
    if (filterFilesDto.name) {
      filter[0]['name'] = ILike(`%${filterFilesDto.name}%`)
      /*filter.push({
        'nameFile': ILike('%'+ filterFilesDto.name: '%')
      })*/
    }
    const query = this.nodesRepository.find({
      where: filter,
      take: filterFilesDto.limit ?? 20,
      order: {
        name: {
          direction: 'ASC'
        }
      },
      skip:
        filterFilesDto.page === 1
          ? 0
          : (filterFilesDto.page - 1) * (filterFilesDto.limit ?? 20),
    });

    const total = await this.nodesRepository.count({ where: filter });

    return {
      docs: await query,
      totalDocs: total,
      totalPages: Math.ceil(total / filterFilesDto.limit),
      currentPage: filterFilesDto.page,
      hasNextPage: total === (filterFilesDto.page * filterFilesDto.limit) || (filterFilesDto.page * filterFilesDto.limit) > total ? false : true
    }
  }

  async downloadFile(id: number): Promise<{
    type: string,
    file: Buffer
  }> {
    const query = await this.filesRepository.findOne({ where: { id } });
    if (!query) {
      throw new NotFoundException('File Not found');
    }
    // Get type
    const typeFile = async (): Promise<string> => {
      const type = (await this.nodesRepository.findOne({ where: { idFile: id } })).nameFile.split('.')[1]
      if (type == 'xlsx')
        return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      if (type == 'xls')
        return "application/vnd.ms-excel"
      if (type == 'xlsm')
        return "application/vnd.ms-excel.sheet.macroEnabled.12"
      if (type == 'ppt')
        return "application/vnd.ms-powerpoint"
      if (type == 'pptx')
        return "application/vnd.openxmlformats-officedocument.presentationml.presentation"
      if (type == 'pdf')
        return "application/pdf"
      if (type == 'doc')
        return "application/msword"
      if (type == 'docx')
        return "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      if (type == 'rar')
        return "application/vnd.rar"
      if (type == 'zip')
        return "application/zip"
      if (type == 'mp4')
        return "video/mp4"
      if (type == 'mp4')
        return "video/mpeg"
      if (type == 'jpg' || type == 'jpeg')
        return "image/jpeg"
      if (type == 'png')
        return "image/png"
      if (type == 'bmp')
        return "image/bmp"
      if (type.length > 0)
        return "octet/stream"
    }
    // Buffer File
    return {
      type: await typeFile(),
      file: Buffer.from(query.name, 'base64')
    };
  }
}

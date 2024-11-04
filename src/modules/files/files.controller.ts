import {
  Controller,
  Get,
  Post,
  Body,
  UploadedFiles,
  UseInterceptors,
  Res,
  BadRequestException,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get()
  async findAllImages() {
    return this.filesService.getAllImages();
  }

  @Post('uploadMultipleImages/:productId')
  @UseInterceptors(FilesInterceptor('files'))
  async createMultipleImages(
    @Param('productId') productId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Res() res: Response,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided for upload.');
    }

    const successfulUploads =
      await this.filesService.uploadMultipleImages(files);
    if (successfulUploads.length === 0) {
      return res
        .status(400)
        .json({ message: 'No images were uploaded successfully.' });
    }
    const savedImages = await this.filesService.saveImages(
      successfulUploads,
      productId,
    );
    return res
      .status(201)
      .json({ message: 'Images uploaded successfully', images: savedImages });
  }

  @Get('product/:productId')
  async findAllImagesByProductId(@Param('productId') productId: string) {
    return this.filesService.findAllImagesByProductId(productId);
  }

  @Delete('gallery/:id')
  async deleteGalleryPhoto(@Param('id') publicId: string) {
    try {
      const result = await this.filesService.deleteGalleryImage(publicId);

      return {
        success: true,
        message: 'Image deleted successfully.',
        data: result,
      };
    } catch (error) {
      console.error('Error deleting image:', error);
      throw new HttpException(
        'Failed to delete image.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

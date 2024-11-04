import { Injectable } from '@nestjs/common';
import { FilesRepository } from './files.repository';
import { InsertImage } from '../../../db/schemas/files.schema';

@Injectable()
export class FilesService {
  private readonly MAX_FILE_SIZE = 10485760;
  constructor(private filesRepository: FilesRepository) {}

  async uploadImage(file: Express.Multer.File) {
    const imageResult = await this.filesRepository.uploadImage(file);

    return {
      public_id: imageResult.public_id,
      secure_url: imageResult.secure_url,
    };
  }

  async removeSingleImage(publicId: string): Promise<Object> {
    return await this.filesRepository.removeSingleImage(publicId);
  }

  async removeMultipleImages(publicsIds: string[]): Promise<Object> {
    return await this.filesRepository.removeMultipleImages(publicsIds);
  }

  async uploadMultipleImages(files: Express.Multer.File[]) {
    const results = await Promise.allSettled(
      files.map((file) => {
        if (file.size > this.MAX_FILE_SIZE) {
          return Promise.reject(
            new Error(`File size too large. Maximum is ${this.MAX_FILE_SIZE}.`),
          );
        }
        return this.uploadImage(file);
      }),
    );

    const rejected = results.filter((result) => result.status === 'rejected');
    const successful = results
      .filter(
        (
          result,
        ): result is PromiseFulfilledResult<{
          public_id: string;
          secure_url: string;
        }> => result.status === 'fulfilled',
      )
      .map((result) => result.value);

    if (rejected.length > 0) {
      console.log('Some images failed to upload:', rejected);
    }

    return successful;
  }

  async saveImages(
    files: { public_id: string; secure_url: string }[],
    productId: string,
  ) {
    const imageData: InsertImage[] = files.map((image) => ({
      publicId: image.public_id,
      secureUrl: image.secure_url,
      productId: productId,
    }));

    return this.filesRepository.createMultipleImages(imageData);
  }

  async getAllImages() {
    return await this.filesRepository.findAllImages();
  }
  async findAllImagesByProductId(productId: string) {
    return await this.filesRepository.findImagesByProductId(productId);
  }

  async deleteGalleryImage(publicId: string): Promise<{message: string}> {
    return this.filesRepository.deleteImageByPublicId(publicId);
  }
}

import { IsString, IsUUID, Length } from 'class-validator';
import { CreateProductDto } from './create-product.dto';

export class CreateDigitalProductDto extends CreateProductDto {
  @IsString()
  @Length(20, 20, { message: 'The cdKey must be exactly 20 characters long' })
  cdKey: string;

  @IsUUID('4', { message: 'genreId must be a valid UUID (version 4)' })
  genreId?: string;

  @IsUUID('4', { message: 'productId must be a valid UUID (version 4)' })
  productId: string;
}

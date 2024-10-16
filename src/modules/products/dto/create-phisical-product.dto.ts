import { IsUUID, IsInt, Min } from 'class-validator';
import { CreateProductDto } from './create-product.dto';

export class CreatePhysicalProductDto extends CreateProductDto {
  @IsInt({ message: 'weight must be an integer' })
  @Min(0, { message: 'weight must be a non-negative value' })
  weight: number;

  @IsUUID('4', { message: 'categoryId must be a valid UUID (version 4)' })
  categoryId: string;

  @IsUUID('4', { message: 'productId must be a valid UUID (version 4)' })
  productId: string;
}

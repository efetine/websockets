import {
  IsInt,
  Min,
  IsOptional,
  IsString,
  MaxLength,
  IsEnum,
} from 'class-validator';

export enum ProductType {
  DIGITAL = 'digital',
  PHYSICAL = 'physical',
}

export class CreateProductDto {
  @IsInt({ message: 'The price must be an integer' })
  @Min(0, { message: 'The price must be a non-negative value' })
  price: number;

  @IsString({ message: 'The description must be a string' })
  @MaxLength(50, {
    message: 'The description must be at most 50 characters long',
  })
  @IsOptional()
  description?: string;

  @IsEnum(ProductType, {
    message: 'The type must be either digital or physical',
  })
  type: ProductType;

  @IsInt({ message: 'The stock must be an integer' })
  @Min(0, { message: 'The stock must be a non-negative value' })
  stock: number;

  @IsString({ message: 'The name must be a string' })
  @MaxLength(15, { message: 'The name must be at most 15 characters long' })
  name: string;
}

import { PartialType } from '@nestjs/mapped-types';
import { CreatePhisicalProductDto } from './create-phisical-product.dto';

export class UpdatePhisicalProductDto extends PartialType(CreatePhisicalProductDto) {}

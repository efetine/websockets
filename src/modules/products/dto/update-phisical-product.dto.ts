import { PartialType } from '@nestjs/mapped-types';
import { CreatePhysicalProductDto } from './create-phisical-product.dto';

export class UpdatePhisicalProductDto extends PartialType(CreatePhysicalProductDto) {}

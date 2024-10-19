import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class RemoveOneImage {
  @IsNotEmpty()
  @IsString()
  ID: string;
}

export class RemoveManyImages {
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @ArrayNotEmpty()
  IDs: Array<string>;
}

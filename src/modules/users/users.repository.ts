import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto, UserEntity, users } from '../../../db/schemas/schema';
import { db } from '../../config/db';
import { eq, and } from 'drizzle-orm';
import { FilesService } from '../files/files.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly filesService: FilesService) {}

  async findAllUsers({
    page,
    limit,
  }: {
    page: number;
    limit: number;
  }): Promise<CreateUserDto[]> {
    const users = await db.query.users
      .findMany({
        limit: limit,
        offset: (page - 1) * limit,
      })
      .catch((err) => {
        throw new BadRequestException('Error fetching users');
      });

    if (users.length === 0) {
      throw new NotFoundException('Users not found');
    }
    return users;
  }

  async findOneById(id: string): Promise<UserEntity> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });
    if (!user) throw new NotFoundException('User by ID not found');
    return user;
  }

  async updateUserById(
    id: string,
    body: Partial<CreateUserDto>,
  ): Promise<Partial<CreateUserDto>[]> {
    const updateUser = await db
      .update(users)
      .set(body)
      .where(eq(users.id, id))
      .returning({
        email: users.email,
        id: users.id,
        name: users.name,
        image: users.image,
      });
    if (updateUser.length == 0) throw new NotFoundException('User Not Found');
    return updateUser;
  }

  async removeUserById(id: string): Promise<{ message: string }> {
    const rowCount = (
      await db
        .update(users)
        .set({ active: false })
        .where(and(eq(users.id, id), eq(users.active, true)))
    ).rowCount;
    if (rowCount == 0) throw new NotFoundException('User Not Found');
    return { message: 'User deleted Successfuly' };
  }

  async uploadProfileImage(id: string, file: Express.Multer.File) {
    const resultFile = await this.filesService.uploadImage(file);

    const resultUser = await db
      .update(users)
      .set({ image: resultFile.secure_url })
      .where(eq(users.id, id))
      .returning();

    if (resultUser.length === 0)
      throw new NotFoundException(`User with ${id} uuid not found.`);

    return resultFile;
  }

  async removeProfileImage(userId: string, publicId: string) {
    await this.filesService.removeSingleImage(publicId);

    const result = await db
      .update(users)
      .set({ image: 'default_profile_picture.png' })
      .where(eq(users.id, userId))
      .returning();

    if (result.length === 0)
      throw new NotFoundException(`User with ${userId} didn't exist.`);

    return { message: 'User profile image modified successfuly.' };
  }
}

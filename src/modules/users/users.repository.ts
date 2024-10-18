import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateUserDto, users } from '../../../db/schema';
import { db } from '../../config/db';
import { eq } from 'drizzle-orm';

export class UsersRepository {
  constructor() {}

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

  async findOneById(id: string): Promise<CreateUserDto> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });
    if (!user) throw new NotFoundException('User not Found');
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
    
    
  removeUserById(id: string) {
    throw new Error('Method not implemented.');
  }
}

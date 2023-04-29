import { PrismaClient } from '.prisma/user-prisma-client';
export { PrismaClient as UserPrismaClient };
export * from '.prisma/user-prisma-client';
export const prismaClient = new PrismaClient({});

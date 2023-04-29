import { PrismaClient } from '.prisma/message-prisma-client';
export { PrismaClient as MessagePrismaClient };
export * from '.prisma/message-prisma-client';
export const prismaClient = new PrismaClient({});

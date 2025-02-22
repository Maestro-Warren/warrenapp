import { PrismaClient } from "@prisma/client";

const prismaClientSignleton = () => {
    return new PrismaClient()
}

declare const globalThis: {
    prismaGlobal: ReturnType<typeof prismaClientSignleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSignleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
import ws from "ws";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool, neonConfig } from "@neondatabase/serverless";

let prisma: PrismaClient;

const PrismaClientSingleton = () => {
  // Configure Neon for serverless environments
  neonConfig.webSocketConstructor = ws;
  const connectionString = process.env.DATABASE_URL as string;

  // Create a Neon Pool
  const pool = new Pool({ connectionString });

  // Initialize the Neon Adapter
  const adapter = new PrismaNeon(pool);

  // Initialize Prisma Client with the adapter
  return new PrismaClient({ adapter });
};

// Use a global singleton for Prisma in development
declare global {
  // Ensure PrismaGlobal is part of globalThis
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

if (!global.prismaGlobal) {
  global.prismaGlobal = PrismaClientSingleton();
}

// Reuse prisma in development or initialize it in production
// eslint-disable-next-line prefer-const
prisma = global.prismaGlobal;

export default prisma;

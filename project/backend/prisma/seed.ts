import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      {
        name: "Etienne",
        email: "etienne.techer@epitech.eu",
        gender: "MALE",
      },
      {
        name: "Mathilde",
        email: "mathilde.pothin1234@gmail.com",
        gender: "FEMALE",
      }
    ]
  });
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect()); 
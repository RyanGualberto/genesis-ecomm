import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main(i: number) {
  await prisma.product.create({
    data: {
      name: `Product ${i}`,
      description: `Description ${i}`,
      price: i,
      category: `celulares`,
      image: `https://picsum.photos/seed/${i}/200/300`,
      userId: "6503cde6-93ff-4a38-bef8-021aaeac96af",
      quantityAvailable: i,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
}

async function seed() {
  for (let i = 1; i <= 100; i++) {
    await main(i);
  }
}

seed().then(() => {
  console.log("Seeding complete!");
});

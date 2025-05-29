const { PrismaClient } = require("../src/generated/prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.time("Seeding complete 🌱");

  await prisma.tenant.createMany({
    data: [
      {
        name: "Semanal Plus"
      },
      {
        name: "Plus Credito"
      },
      {
        name: "Credito Express"
      }
    ]
  })

  const tenants = await prisma.tenant.findMany({
    where: {
      name: { in: ["Semanal Plus", "Plus Credito", "Credito Express"] },
    },
  })

  await prisma.user.createMany({
    data: [
      {
        name: "Luis Canales",
        email: "canalesluis9@gmail.com",
        password: await bcrypt.hash("hsdpaumts_37567559", 10),
        role: "SUPERADMIN",
        tenantId: tenants[0].id
      },
      {
        name: "Bruno Gimenez",
        email: "brunogimenez389@gmail.com",
        password: await bcrypt.hash("brunogimenez389@gmail.com", 10),
        role: "SUPERADMIN",
        tenantId: tenants[0].id
      },
      {
        name: "Dueño Plus Credito",
        email: "pluscredito@gmail.com",
        password: await bcrypt.hash("pluscredito@gmail.com", 10),
        role: "ADMIN",
        tenantId: tenants[1].id
      },
      {
        name: "Empleado Plus Credito",
        email: "emppluscredito@gmail.com",
        password: await bcrypt.hash("emppluscredito@gmail.com", 10),
        role: "BASIC",
        tenantId: tenants[1].id
      },
      {
        name: "Dueño Credito Express",
        email: "creditoexpress@gmail.com",
        password: await bcrypt.hash("creditoexpress@gmail.com", 10),
        role: "ADMIN",
        tenantId: tenants[2].id
      },
    ],
  });

  console.timeEnd("Seeding complete 🌱");
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from "./../../src/generated/prisma";
import { permissions } from "./../../src/constants/permissions";
const prisma = new PrismaClient();

const roles = [
  {
    name: "ADMIN",
    description:
      "Full access to manage users, businesses, drivers, and system settings",
  },
  {
    name: "CUSTOMER",
    description:
      "Can request deliveries, track shipments, and manage personal profile",
  },
  {
    name: "DRIVER",
    description:
      "Can accept delivery requests, update delivery status, and manage profile",
  },
];

async function main() {
  roles.forEach(async (role) => {
    await prisma.role.upsert({
      where: {
        name: role.name,
      },
      create: {
        name: role.name,
        description: role.description,
      },
      update: {
        name: role.name,
        description: role.description,
      },
    });
  });

  permissions.forEach(async (permission) => {
    await prisma.permission.upsert({
      where: {
        key: permission.key,
      },
      create: {
        module: "",
        key: permission.key,
        name: permission.name,
      },
      update: {
        module: "",
        key: permission.key,
        name: permission.name,
      },
    });
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

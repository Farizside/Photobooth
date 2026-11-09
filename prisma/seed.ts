import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_OWNER_EMAIL ?? "owner@photobooth.local";
  const password = process.env.SEED_OWNER_PASSWORD;
  if (!password) {
    throw new Error("SEED_OWNER_PASSWORD belum diisi di .env");
  }

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "Owner",
      role: "OWNER",
      passwordHash: await bcrypt.hash(password, 12),
    },
  });

  const packages = [
    { name: "Basic", price: 25000, photoCount: 2, layout: "strip-2", sortOrder: 1 },
    { name: "Standard", price: 35000, photoCount: 4, layout: "strip-4", sortOrder: 2 },
    { name: "Premium", price: 50000, photoCount: 4, layout: "grid-2x2", printCopies: 2, sortOrder: 3 },
  ];
  for (const p of packages) {
    const exists = await prisma.package.findFirst({ where: { name: p.name } });
    if (!exists) await prisma.package.create({ data: p });
  }

  if ((await prisma.booth.count()) === 0) {
    await prisma.booth.create({
      data: {
        name: "Booth 1",
        location: "Contoh Lokasi",
        deviceToken: randomBytes(24).toString("hex"),
      },
    });
  }

  const defaults: Record<string, unknown> = {
    brandName: "Photobooth",
    welcomeText: "Sentuh layar untuk mulai",
    countdownSeconds: 5,
    currency: "IDR",
    idleTimeoutSeconds: 60,
  };
  for (const [key, value] of Object.entries(defaults)) {
    await prisma.setting.upsert({
      where: { key },
      update: {},
      create: { key, value: value as never },
    });
  }

  console.log("Seed selesai.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

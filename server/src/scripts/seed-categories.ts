import { db } from "../db";
import { categories } from "../db/schema";

const cats = [
    { name: "Специальные предложения", slug: "special-offers" },
    { name: "Здоровье и Аптека", slug: "health-pharmacy" },
    { name: "Продукты питания", slug: "food" },
    { name: "Хобби и творчество", slug: "hobby-creative" },
    { name: "Образование", slug: "education" },
    { name: "Для дома и сада", slug: "home-garden" },
    { name: "Строительство и ремонт", slug: "construction-repair" },
    { name: "Мебель", slug: "furniture" },
    { name: "Одежда", slug: "clothing" },
    { name: "Электротехника", slug: "electronics" },
    { name: "Украшения и ювелирные изделия", slug: "jewelry" },
    { name: "Подарки", slug: "gifts" },
    { name: "Цифровые товары", slug: "digital" },
    { name: "Страхование и финансы", slug: "insurance-finance" },
    { name: "Антиквариат и коллекционерам", slug: "antiques-collectibles" },
    { name: "Детские товары", slug: "kids" },
    { name: "Канцелярия", slug: "stationery" },
    { name: "Уход за собой", slug: "self-care" },
    { name: "Спорт", slug: "sport" },
    { name: "Услуги", slug: "services" },
    { name: "Зоотовары", slug: "pets" },
    { name: "Автотовары", slug: "auto" },
    { name: "Туризм", slug: "tourism" },
    { name: "Другое", slug: "other" },
];

async function seed() {
    console.log("Seeding categories...");
    for (const cat of cats) {
        try {
            await db.insert(categories).values(cat);
            console.log("✓", cat.name);
        } catch {
            console.log("⊘", cat.name, "(exists)");
        }
    }
    console.log("Done!");
    process.exit(0);
}

seed();

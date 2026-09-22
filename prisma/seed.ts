import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

const CATEGORIES = [
  { slug: "sut-mahsulotlari", name: "Sut mahsulotlari", nameRu: "Молочные продукты", nameEn: "Dairy", icon: "🥛", sortOrder: 1 },
  { slug: "yog-va-moylar", name: "Yog‘ va moylar", nameRu: "Масла и жиры", nameEn: "Oils & Fats", icon: "🧈", sortOrder: 2 },
  { slug: "gosht", name: "Go‘sht", nameRu: "Мясо", nameEn: "Meat", icon: "🥩", sortOrder: 3 },
  { slug: "tovuq", name: "Tovuq", nameRu: "Курица", nameEn: "Poultry", icon: "🍗", sortOrder: 4 },
  { slug: "meva-sabzavot", name: "Meva va sabzavotlar", nameRu: "Фрукты и овощи", nameEn: "Fruits & Vegetables", icon: "🥦", sortOrder: 5 },
  { slug: "non-pishiriq", name: "Non va pishiriqlar", nameRu: "Хлеб и выпечка", nameEn: "Bread & Bakery", icon: "🍞", sortOrder: 6 },
  { slug: "ichimliklar", name: "Ichimliklar", nameRu: "Напитки", nameEn: "Drinks", icon: "🥤", sortOrder: 7 },
  { slug: "shirinliklar", name: "Shirinliklar", nameRu: "Сладости", nameEn: "Sweets", icon: "🍫", sortOrder: 8 },
  { slug: "oziq-ovqat", name: "Oziq-ovqat", nameRu: "Бакалея", nameEn: "Groceries", icon: "🍚", sortOrder: 9 },
  { slug: "maishiy", name: "Maishiy mahsulotlar", nameRu: "Хозтовары", nameEn: "Household", icon: "🧴", sortOrder: 10 },
  { slug: "gigiyena", name: "Gigiyena", nameRu: "Гигиена", nameEn: "Hygiene", icon: "🧼", sortOrder: 11 },
  { slug: "bolalar", name: "Bolalar mahsulotlari", nameRu: "Детские товары", nameEn: "Baby & Kids", icon: "👶", sortOrder: 12 },
] as const;

type SeedProduct = {
  sku: string;
  name: string;
  brand: string;
  category: (typeof CATEGORIES)[number]["slug"];
  weight: string;
  price: number;
  oldPrice?: number;
  image: string;
  stock: number;
  rating: number;
  ratingCount: number;
  isFeatured?: boolean;
  description: string;
  ingredients: string;
  nutrition: string;
  daysAgo?: number;
};

const PRODUCTS: SeedProduct[] = [
  {
    sku: "CEL-1001",
    name: "Persil Kir yuvish kukuni",
    brand: "Persil",
    category: "maishiy",
    weight: "3 kg",
    price: 59000,
    oldPrice: 69000,
    image: "/products/persil-3kg.png",
    stock: 42,
    rating: 4.6,
    ratingCount: 128,
    isFeatured: true,
    description:
      "Persil Deep Clean kir yuvish kukuni — eng qiyin dog‘larni ham samarali tozalaydi, matolar tolasini asraydi va uzoq davom etuvchi yoqimli hid qoldiradi.",
    ingredients: "5-15% anion faol moddalar, <5% noion faol moddalar, sovun, fermentlar, atir kompozitsiyasi.",
    nutrition: "Oziq-ovqat mahsuloti emas.",
    daysAgo: 2,
  },
  {
    sku: "CEL-1002",
    name: "Olma",
    brand: "Mahalliy fermer",
    category: "meva-sabzavot",
    weight: "1 kg",
    price: 22000,
    image: "/products/olma-1kg.png",
    stock: 87,
    rating: 4.8,
    ratingCount: 64,
    isFeatured: true,
    description: "Toza, shirin va sersuv qizil olmalar. Har kuni yangilanadigan yetkazuvchidan.",
    ingredients: "100% tabiiy meva.",
    nutrition: "Energiya: 52 kcal/100g, uglevod: 14g, tola: 2.4g, vitamin C.",
    daysAgo: 0,
  },
  {
    sku: "CEL-1003",
    name: "Tuxum",
    brand: "Parranda fabrikasi",
    category: "oziq-ovqat",
    weight: "10 dona",
    price: 18000,
    image: "/products/tuxum-10dona.png",
    stock: 120,
    rating: 4.7,
    ratingCount: 210,
    description: "Fermer tovuqlaridan olingan yangi tuxumlar, C toifa, 10 donalik qadoq.",
    ingredients: "100% tabiiy tovuq tuxumi.",
    nutrition: "Energiya: 143 kcal/100g, oqsil: 13g, yog‘: 10g.",
    daysAgo: 5,
  },
  {
    sku: "CEL-1004",
    name: "Makfa Makaron",
    brand: "Makfa",
    category: "oziq-ovqat",
    weight: "450 g",
    price: 12000,
    image: "/products/makfa-makaron.png",
    stock: 5,
    rating: 4.5,
    ratingCount: 96,
    description: "Qattiq bug‘doy navlaridan tayyorlangan Penne shaklidagi makaron mahsuloti.",
    ingredients: "Qattiq bug‘doy noni (durum).",
    nutrition: "Energiya: 350 kcal/100g, oqsil: 12g, uglevod: 71g.",
    daysAgo: 10,
  },
  {
    sku: "CEL-1005",
    name: "Nestlé Sut",
    brand: "Nestlé",
    category: "sut-mahsulotlari",
    weight: "1 L",
    price: 13500,
    image: "/products/nestle-sut.png",
    stock: 60,
    rating: 4.6,
    ratingCount: 143,
    isFeatured: true,
    description: "Ultra pasterizatsiyalangan sigir suti, 3.2% yog‘lilik, uzoq muddat saqlanadi.",
    ingredients: "Normallashtirilgan sigir suti.",
    nutrition: "Energiya: 60 kcal/100ml, oqsil: 3g, yog‘: 3.2g.",
    daysAgo: 1,
  },
  {
    sku: "CEL-1006",
    name: "President Sariq Yog‘i",
    brand: "President",
    category: "yog-va-moylar",
    weight: "300 g",
    price: 50000,
    oldPrice: 56000,
    image: "/products/president-yogi.png",
    stock: 3,
    rating: 4.9,
    ratingCount: 178,
    isFeatured: true,
    description:
      "President Gastronomique — 82% yog‘lilikka ega premium fransuz sariyog‘i. Nozik ta’m va tabiiy tarkib.",
    ingredients: "Pasterizatsiyalangan qaymoq (sut).",
    nutrition: "Energiya: 736 kcal/100g, yog‘: 82g, oqsil: 0.7g.",
    daysAgo: 3,
  },
  {
    sku: "CEL-1007",
    name: "Coca-Cola",
    brand: "Coca-Cola",
    category: "ichimliklar",
    weight: "1.5 L",
    price: 14000,
    image: "/products/coca-cola.png",
    stock: 95,
    rating: 4.7,
    ratingCount: 302,
    isFeatured: true,
    description: "Klassik Coca-Cola gazlangan ichimligi, 1.5 litrlik qayta yopiladigan shishada.",
    ingredients: "Suv, qand, karbonat angidrid gazi, karamel rangi, fosfat kislotasi, tabiiy aromatizatorlar, kofein.",
    nutrition: "Energiya: 42 kcal/100ml, uglevod: 10.6g.",
    daysAgo: 4,
  },
  { sku: "CEL-1101", name: "Qo‘qon Tvorog", brand: "Qo‘qon Sut", category: "sut-mahsulotlari", weight: "200 g", price: 16000, image: "/products/tvorog-qoqon.svg", stock: 34, rating: 4.4, ratingCount: 41, description: "Yumshoq va yog‘li tvorog, kunlik nonushta uchun ideal.", ingredients: "Sut, achitqi kulturasi.", nutrition: "Energiya: 155 kcal/100g, oqsil: 16g.", daysAgo: 6 },
  { sku: "CEL-1102", name: "Danone Yogurt", brand: "Danone", category: "sut-mahsulotlari", weight: "900 g", price: 21000, image: "/products/yogurt-danone.svg", stock: 28, rating: 4.5, ratingCount: 77, description: "Tabiiy qatiq, probiotik kulturalar bilan boyitilgan.", ingredients: "Sut, jonli yogurt kulturalari.", nutrition: "Energiya: 61 kcal/100g, oqsil: 3.5g.", daysAgo: 8 },
  { sku: "CEL-1103", name: "Oltin Dala kungaboqar yog‘i", brand: "Oltin Dala", category: "yog-va-moylar", weight: "1 L", price: 24000, oldPrice: 27000, image: "/products/oltin-dala-yog.svg", stock: 51, rating: 4.3, ratingCount: 58, description: "Rafinatsiyalangan va dezodorlangan kungaboqar yog‘i, qovurish va salatlar uchun.", ingredients: "100% kungaboqar yog‘i.", nutrition: "Energiya: 899 kcal/100g, yog‘: 99.9g.", daysAgo: 12 },
  { sku: "CEL-1104", name: "Anchor Butter", brand: "Anchor", category: "yog-va-moylar", weight: "200 g", price: 34000, image: "/products/anchor-butter.svg", stock: 22, rating: 4.7, ratingCount: 63, description: "Yangi Zelandiya sariyog‘i, tabiiy va boy ta’mga ega.", ingredients: "Pasterizatsiyalangan qaymoq.", nutrition: "Energiya: 745 kcal/100g, yog‘: 82g.", daysAgo: 15 },
  { sku: "CEL-1105", name: "Mol go‘shti (gushtli)", brand: "Qassob", category: "gosht", weight: "1 kg", price: 98000, image: "/products/mol-goshti.svg", stock: 18, rating: 4.6, ratingCount: 39, description: "Yangi so‘yilgan mol go‘shti, gushtli qism, gril va qozon uchun mos.", ingredients: "100% mol go‘shti.", nutrition: "Energiya: 250 kcal/100g, oqsil: 26g.", daysAgo: 1 },
  { sku: "CEL-1106", name: "Qo‘y go‘shti", brand: "Qassob", category: "gosht", weight: "1 kg", price: 110000, image: "/products/qoy-goshti.svg", stock: 0, rating: 4.5, ratingCount: 22, description: "Yosh qo‘y go‘shti, shashlik va milliy taomlar uchun.", ingredients: "100% qo‘y go‘shti.", nutrition: "Energiya: 294 kcal/100g, oqsil: 25g.", daysAgo: 20 },
  { sku: "CEL-1107", name: "Tovuq filesi", brand: "Parranda fabrikasi", category: "tovuq", weight: "1 kg", price: 45000, image: "/products/tovuq-file.svg", stock: 64, rating: 4.6, ratingCount: 91, isFeatured: true, description: "Suyaksiz va terisiz tovuq ko‘krak filesi, diyetik ovqatlanish uchun.", ingredients: "100% tovuq go‘shti.", nutrition: "Energiya: 165 kcal/100g, oqsil: 31g.", daysAgo: 2 },
  { sku: "CEL-1108", name: "Tovuq son", brand: "Parranda fabrikasi", category: "tovuq", weight: "1 kg", price: 32000, image: "/products/tovuq-son.svg", stock: 4, rating: 4.4, ratingCount: 54, description: "Sersuv va mazali tovuq son qismi.", ingredients: "100% tovuq go‘shti.", nutrition: "Energiya: 209 kcal/100g, oqsil: 26g.", daysAgo: 9 },
  { sku: "CEL-1109", name: "Banan", brand: "Import", category: "meva-sabzavot", weight: "1 kg", price: 17000, image: "/products/banan.svg", stock: 73, rating: 4.5, ratingCount: 48, description: "Shirin va yetilgan bananlar, energiya manbai.", ingredients: "100% tabiiy meva.", nutrition: "Energiya: 89 kcal/100g, kaliy: 358mg.", daysAgo: 0 },
  { sku: "CEL-1110", name: "Pomidor", brand: "Mahalliy fermer", category: "meva-sabzavot", weight: "1 kg", price: 12000, image: "/products/pomidor.svg", stock: 55, rating: 4.3, ratingCount: 33, description: "Sersuv qizil pomidorlar, salat va taomlar uchun.", ingredients: "100% tabiiy sabzavot.", nutrition: "Energiya: 18 kcal/100g, vitamin C.", daysAgo: 1 },
  { sku: "CEL-1111", name: "Bodring", brand: "Mahalliy fermer", category: "meva-sabzavot", weight: "1 kg", price: 10000, image: "/products/bodring.svg", stock: 61, rating: 4.2, ratingCount: 27, description: "Yangi va gurustli bodringlar.", ingredients: "100% tabiiy sabzavot.", nutrition: "Energiya: 15 kcal/100g.", daysAgo: 3 },
  { sku: "CEL-1112", name: "Oq non", brand: "Non Kombinati", category: "non-pishiriq", weight: "500 g", price: 6000, image: "/products/oq-non.svg", stock: 88, rating: 4.6, ratingCount: 112, isFeatured: true, description: "An’anaviy retsept bo‘yicha pishirilgan yumshoq oq non.", ingredients: "Un, suv, tuz, achitqi.", nutrition: "Energiya: 265 kcal/100g.", daysAgo: 0 },
  { sku: "CEL-1113", name: "Baget non", brand: "Non Kombinati", category: "non-pishiriq", weight: "300 g", price: 9000, image: "/products/baget-non.svg", stock: 40, rating: 4.4, ratingCount: 36, description: "Frantsuzcha uslubdagi qarsildoq po‘stli baget.", ingredients: "Un, suv, tuz, achitqi.", nutrition: "Energiya: 270 kcal/100g.", daysAgo: 0 },
  { sku: "CEL-1114", name: "Fanta", brand: "Coca-Cola Company", category: "ichimliklar", weight: "1.5 L", price: 14000, image: "/products/fanta.svg", stock: 70, rating: 4.5, ratingCount: 88, description: "Apelsin ta’mli gazlangan ichimlik.", ingredients: "Suv, qand, apelsin sharbati kontsentrati, gaz.", nutrition: "Energiya: 45 kcal/100ml.", daysAgo: 5 },
  { sku: "CEL-1115", name: "Borjomi mineral suvi", brand: "Borjomi", category: "ichimliklar", weight: "0.5 L", price: 11000, image: "/products/mineral-suv.svg", stock: 46, rating: 4.6, ratingCount: 52, description: "Tabiiy gazlangan mineral suv, Gruziyadan.", ingredients: "Tabiiy mineral suv.", nutrition: "Energiya: 0 kcal.", daysAgo: 7 },
  { sku: "CEL-1116", name: "Alpen Gold shokolad", brand: "Alpen Gold", category: "shirinliklar", weight: "90 g", price: 15000, oldPrice: 18000, image: "/products/alpen-gold.svg", stock: 66, rating: 4.7, ratingCount: 134, isFeatured: true, description: "Sut shokoladi butun findiq bilan.", ingredients: "Qand, kakao mahsulotlari, sut kukuni, findiq.", nutrition: "Energiya: 545 kcal/100g.", daysAgo: 2 },
  { sku: "CEL-1117", name: "Oreo pechenye", brand: "Oreo", category: "shirinliklar", weight: "133 g", price: 9500, image: "/products/oreo.svg", stock: 58, rating: 4.6, ratingCount: 97, description: "Vanil kremli shokoladli pechenye.", ingredients: "Un, qand, o‘simlik yog‘i, kakao kukuni.", nutrition: "Energiya: 480 kcal/100g.", daysAgo: 6 },
  { sku: "CEL-1118", name: "Lazzat guruch", brand: "Lazzat", category: "oziq-ovqat", weight: "1 kg", price: 17000, image: "/products/guruch-lazzat.svg", stock: 6, rating: 4.5, ratingCount: 71, description: "Yuqori sifatli laser tozalangan guruch, osh uchun ideal.", ingredients: "100% guruch.", nutrition: "Energiya: 130 kcal/100g (pishirilgan).", daysAgo: 11 },
  { sku: "CEL-1119", name: "Oltin Don un", brand: "Oltin Don", category: "oziq-ovqat", weight: "2 kg", price: 19000, image: "/products/un-oltin-don.svg", stock: 44, rating: 4.4, ratingCount: 49, description: "Yuqori navli bug‘doy uni, pishiriqlar uchun.", ingredients: "100% bug‘doy uni.", nutrition: "Energiya: 364 kcal/100g.", daysAgo: 14 },
  { sku: "CEL-1120", name: "Fairy idish yuvish suyuqligi", brand: "Fairy", category: "maishiy", weight: "500 ml", price: 22000, image: "/products/fairy-idish.svg", stock: 39, rating: 4.7, ratingCount: 165, description: "Yog‘ni samarali eritadigan konsentrlangan idish yuvish vositasi.", ingredients: "5-15% anion faol moddalar, konservantlar, hid beruvchilar.", nutrition: "Oziq-ovqat mahsuloti emas.", daysAgo: 3 },
  { sku: "CEL-1121", name: "Zewa tualet qog‘ozi", brand: "Zewa", category: "maishiy", weight: "8 dona", price: 28000, image: "/products/zewa-qogoz.svg", stock: 31, rating: 4.6, ratingCount: 84, description: "3 qatlamli yumshoq tualet qog‘ozi, 8 rulon qadoqda.", ingredients: "100% tsellyuloza.", nutrition: "Oziq-ovqat mahsuloti emas.", daysAgo: 9 },
  { sku: "CEL-1122", name: "Colgate tish pastasi", brand: "Colgate", category: "gigiyena", weight: "100 ml", price: 14000, image: "/products/colgate-pasta.svg", stock: 52, rating: 4.7, ratingCount: 118, description: "Tishlarni butun kun davomida himoya qiluvchi ftorli tish pastasi.", ingredients: "Suv, abraziv moddalar, natriy ftorid.", nutrition: "Oziq-ovqat mahsuloti emas.", daysAgo: 4 },
  { sku: "CEL-1123", name: "Dove sovun", brand: "Dove", category: "gigiyena", weight: "90 g", price: 8500, image: "/products/dove-sovun.svg", stock: 2, rating: 4.6, ratingCount: 102, description: "1/4 namlovchi krem bilan boyitilgan sovun.", ingredients: "Natriy tallovat, glitserin, namlovchi krem.", nutrition: "Oziq-ovqat mahsuloti emas.", daysAgo: 1 },
  { sku: "CEL-1124", name: "Pampers Baby Dry", brand: "Pampers", category: "bolalar", weight: "4-son, 58 dona", price: 89000, oldPrice: 99000, image: "/products/pampers.svg", stock: 24, rating: 4.8, ratingCount: 211, isFeatured: true, description: "Tungi himoya uchun yuqori namlik shimuvchi bolalar tagliklari.", ingredients: "Tsellyuloza, super absorbent polimer.", nutrition: "Oziq-ovqat mahsuloti emas.", daysAgo: 0 },
  { sku: "CEL-1125", name: "Johnson's bolalar shampuni", brand: "Johnson's", category: "bolalar", weight: "500 ml", price: 32000, image: "/products/johnsons-shampun.svg", stock: 27, rating: 4.7, ratingCount: 89, description: "Ko‘zlarni achitmaydigan yumshoq formula, har kuni ishlatish uchun.", ingredients: "Suv, yuvuvchi moddalar, aloe vera ekstrakti.", nutrition: "Oziq-ovqat mahsuloti emas.", daysAgo: 2 },
];

const ZONES = [
  { name: "1-zona", minKm: 0, maxKm: 5, fee: 20000, sortOrder: 1 },
  { name: "2-zona", minKm: 5, maxKm: 10, fee: 30000, sortOrder: 2 },
  { name: "3-zona", minKm: 10, maxKm: 15, fee: 45000, sortOrder: 3 },
];

const PICKUP_LOCATIONS = [
  { name: "Celestia — Yunusobod filiali", address: "Toshkent sh., Amir Temur ko‘chasi 108", openHours: "08:00–23:00" },
  { name: "Celestia — Chilonzor filiali", address: "Toshkent sh., Bunyodkor shoh ko‘chasi 45", openHours: "08:00–22:00" },
];

async function main() {
  console.log("Seeding Celestia database...");

  const categoryIds: Record<string, string> = {};
  for (const c of CATEGORIES) {
    const cat = await db.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, nameRu: c.nameRu, nameEn: c.nameEn, icon: c.icon, sortOrder: c.sortOrder },
      create: c,
    });
    categoryIds[c.slug] = cat.id;
  }

  for (const p of PRODUCTS) {
    const createdAt = new Date(Date.now() - (p.daysAgo ?? 30) * 24 * 60 * 60 * 1000);
    const discount = p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;
    await db.product.upsert({
      where: { sku: p.sku },
      update: {
        name: p.name,
        brand: p.brand,
        categoryId: categoryIds[p.category],
        weight: p.weight,
        price: p.price,
        oldPrice: p.oldPrice ?? null,
        discount,
        image: p.image,
        stock: p.stock,
        rating: p.rating,
        ratingCount: p.ratingCount,
        isFeatured: p.isFeatured ?? false,
        isAvailable: p.stock > 0,
        description: p.description,
        ingredients: p.ingredients,
        nutrition: p.nutrition,
      },
      create: {
        sku: p.sku,
        name: p.name,
        brand: p.brand,
        categoryId: categoryIds[p.category],
        weight: p.weight,
        price: p.price,
        oldPrice: p.oldPrice ?? null,
        discount,
        image: p.image,
        stock: p.stock,
        rating: p.rating,
        ratingCount: p.ratingCount,
        isFeatured: p.isFeatured ?? false,
        isAvailable: p.stock > 0,
        description: p.description,
        ingredients: p.ingredients,
        nutrition: p.nutrition,
        createdAt,
        updatedAt: createdAt,
      },
    });
  }

  for (const z of ZONES) {
    const existing = await db.deliveryZone.findFirst({ where: { name: z.name } });
    if (!existing) await db.deliveryZone.create({ data: z });
  }

  for (const loc of PICKUP_LOCATIONS) {
    const existing = await db.pickupLocation.findFirst({ where: { name: loc.name } });
    if (!existing) await db.pickupLocation.create({ data: loc });
  }

  await db.promoCode.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: { code: "WELCOME10", type: "PERCENT", value: 10, minOrder: 0, maxDiscount: 50000, active: true },
  });
  await db.promoCode.upsert({
    where: { code: "SAVE20000" },
    update: {},
    create: { code: "SAVE20000", type: "FIXED", value: 20000, minOrder: 150000, active: true },
  });

  await db.settings.upsert({
    where: { id: "settings" },
    update: {},
    create: { id: "settings" },
  });

  const adminPassword = await bcrypt.hash("Celestia2026!", 10);
  await db.adminUser.upsert({
    where: { email: "admin@celestia.uz" },
    update: {},
    create: { email: "admin@celestia.uz", passwordHash: adminPassword, name: "Super Admin", role: "SUPER_ADMIN" },
  });
  await db.adminUser.upsert({
    where: { email: "products@celestia.uz" },
    update: {},
    create: { email: "products@celestia.uz", passwordHash: adminPassword, name: "Mahsulot Menejeri", role: "PRODUCT_MANAGER" },
  });
  await db.adminUser.upsert({
    where: { email: "orders@celestia.uz" },
    update: {},
    create: { email: "orders@celestia.uz", passwordHash: adminPassword, name: "Buyurtma Menejeri", role: "ORDER_MANAGER" },
  });

  const customerPassword = await bcrypt.hash("customer123", 10);
  const demoUser = await db.user.upsert({
    where: { phone: "+998901234567" },
    update: {},
    create: { name: "Mustafo Aliyev", phone: "+998901234567", email: "mustafo@example.com", passwordHash: customerPassword },
  });

  const existingAddr = await db.address.findFirst({ where: { userId: demoUser.id } });
  if (!existingAddr) {
    await db.address.create({
      data: {
        userId: demoUser.id,
        label: "Uy",
        city: "Toshkent",
        district: "Yunusobod tumani",
        street: "Amir Temur ko‘chasi 108",
        house: "108",
        apartment: "12",
        entrance: "3",
        floor: "5",
        isDefault: true,
      },
    });
  }

  const butter = await db.product.findUnique({ where: { sku: "CEL-1006" } });
  const milk = await db.product.findUnique({ where: { sku: "CEL-1005" } });
  const bread = await db.product.findUnique({ where: { sku: "CEL-1112" } });

  const existingOrder = await db.order.findFirst({ where: { orderNumber: "CEL-10482" } });
  if (!existingOrder && butter && milk && bread) {
    await db.order.create({
      data: {
        orderNumber: "CEL-10482",
        userId: demoUser.id,
        customerName: demoUser.name,
        phone: demoUser.phone,
        city: "Toshkent",
        district: "Yunusobod tumani",
        street: "Amir Temur ko‘chasi 108",
        house: "108",
        apartment: "12",
        deliveryMethod: "STANDARD",
        deliveryFee: 20000,
        subtotal: 128000,
        discount: 0,
        total: 148000,
        paymentMethod: "CLICK",
        paymentStatus: "PAID",
        orderStatus: "OUT_FOR_DELIVERY",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        items: {
          create: [
            { productId: butter.id, name: butter.name, image: butter.image, weight: butter.weight, price: butter.price, quantity: 2 },
            { productId: milk.id, name: milk.name, image: milk.image, weight: milk.weight, price: milk.price, quantity: 1 },
            { productId: bread.id, name: bread.name, image: bread.image, weight: bread.weight, price: bread.price, quantity: 2 },
          ],
        },
      },
    });
  }

  const existingOrder2 = await db.order.findFirst({ where: { orderNumber: "CEL-10391" } });
  if (!existingOrder2 && milk && bread) {
    await db.order.create({
      data: {
        orderNumber: "CEL-10391",
        userId: demoUser.id,
        customerName: demoUser.name,
        phone: demoUser.phone,
        city: "Toshkent",
        district: "Yunusobod tumani",
        street: "Amir Temur ko‘chasi 108",
        house: "108",
        apartment: "12",
        deliveryMethod: "EXPRESS",
        deliveryFee: 35000,
        subtotal: 33500,
        discount: 0,
        total: 68500,
        paymentMethod: "CASH",
        paymentStatus: "PAID",
        orderStatus: "DELIVERED",
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
        items: {
          create: [
            { productId: milk.id, name: milk.name, image: milk.image, weight: milk.weight, price: milk.price, quantity: 1 },
            { productId: bread.id, name: bread.name, image: bread.image, weight: bread.weight, price: bread.price, quantity: 3 },
          ],
        },
      },
    });
  }

  console.log("Seed complete.");
  console.log("Admin login: admin@celestia.uz / Celestia2026!");
  console.log("Demo customer: +998901234567 / customer123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

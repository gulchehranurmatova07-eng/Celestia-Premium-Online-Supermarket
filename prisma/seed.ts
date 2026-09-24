import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

const CATEGORIES = [
  { slug: "sut-mahsulotlari", name: "Молочные продукты", nameRu: "Молочные продукты", nameEn: "Dairy", icon: "🥛", sortOrder: 1 },
  { slug: "yog-va-moylar", name: "Масла и жиры", nameRu: "Масла и жиры", nameEn: "Oils & Fats", icon: "🧈", sortOrder: 2 },
  { slug: "gosht", name: "Мясо", nameRu: "Мясо", nameEn: "Meat", icon: "🥩", sortOrder: 3 },
  { slug: "tovuq", name: "Курица", nameRu: "Курица", nameEn: "Poultry", icon: "🍗", sortOrder: 4 },
  { slug: "meva-sabzavot", name: "Фрукты и овощи", nameRu: "Фрукты и овощи", nameEn: "Fruits & Vegetables", icon: "🥦", sortOrder: 5 },
  { slug: "non-pishiriq", name: "Хлеб и выпечка", nameRu: "Хлеб и выпечка", nameEn: "Bread & Bakery", icon: "🍞", sortOrder: 6 },
  { slug: "ichimliklar", name: "Напитки", nameRu: "Напитки", nameEn: "Drinks", icon: "🥤", sortOrder: 7 },
  { slug: "shirinliklar", name: "Сладости", nameRu: "Сладости", nameEn: "Sweets", icon: "🍫", sortOrder: 8 },
  { slug: "oziq-ovqat", name: "Бакалея", nameRu: "Бакалея", nameEn: "Groceries", icon: "🍚", sortOrder: 9 },
  { slug: "maishiy", name: "Хозтовары", nameRu: "Хозтовары", nameEn: "Household", icon: "🧴", sortOrder: 10 },
  { slug: "gigiyena", name: "Гигиена", nameRu: "Гигиена", nameEn: "Hygiene", icon: "🧼", sortOrder: 11 },
  { slug: "bolalar", name: "Детские товары", nameRu: "Детские товары", nameEn: "Baby & Kids", icon: "👶", sortOrder: 12 },
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
    name: "Стиральный порошок Persil",
    brand: "Persil",
    category: "maishiy",
    weight: "3 кг",
    price: 59000,
    oldPrice: 69000,
    image: "/products/persil-3kg.png",
    stock: 42,
    rating: 4.6,
    ratingCount: 128,
    isFeatured: true,
    description:
      "Persil Deep Clean — эффективно удаляет даже сложные пятна, бережёт волокна ткани и оставляет длительный приятный аромат.",
    ingredients: "5-15% анионные ПАВ, <5% неионные ПАВ, мыло, ферменты, отдушка.",
    nutrition: "Не является пищевым продуктом.",
    daysAgo: 2,
  },
  {
    sku: "CEL-1002",
    name: "Яблоки",
    brand: "Местный фермер",
    category: "meva-sabzavot",
    weight: "1 кг",
    price: 22000,
    image: "/products/olma.webp",
    stock: 87,
    rating: 4.8,
    ratingCount: 64,
    isFeatured: true,
    description: "Сочные и сладкие красные яблоки. Ежедневная поставка от проверенных фермеров.",
    ingredients: "100% натуральный фрукт.",
    nutrition: "Энергетическая ценность: 52 ккал/100г, углеводы: 14г, клетчатка: 2.4г, витамин C.",
    daysAgo: 0,
  },
  {
    sku: "CEL-1003",
    name: "Яйца куриные",
    brand: "Птицефабрика",
    category: "oziq-ovqat",
    weight: "10 шт",
    price: 18000,
    image: "/products/tuxum.webp",
    stock: 120,
    rating: 4.7,
    ratingCount: 210,
    description: "Свежие куриные яйца от фермерских хозяйств, категория С, упаковка 10 штук.",
    ingredients: "100% натуральное куриное яйцо.",
    nutrition: "Энергетическая ценность: 143 ккал/100г, белки: 13г, жиры: 10г.",
    daysAgo: 5,
  },
  {
    sku: "CEL-1004",
    name: "Макароны Makfa Penne",
    brand: "Makfa",
    category: "oziq-ovqat",
    weight: "450 г",
    price: 12000,
    image: "/products/makfa-makaron.png",
    stock: 5,
    rating: 4.5,
    ratingCount: 96,
    description: "Макаронные изделия из твёрдых сортов пшеницы в форме пенне.",
    ingredients: "Мука из твёрдых сортов пшеницы (дурум).",
    nutrition: "Энергетическая ценность: 350 ккал/100г, белки: 12г, углеводы: 71г.",
    daysAgo: 10,
  },
  {
    sku: "CEL-1005",
    name: "Молоко Nestlé",
    brand: "Nestlé",
    category: "sut-mahsulotlari",
    weight: "1 л",
    price: 13500,
    image: "/products/nestle-sut.png",
    stock: 60,
    rating: 4.6,
    ratingCount: 143,
    isFeatured: true,
    description: "Ультрапастеризованное коровье молоко, жирность 3.2%, длительный срок хранения.",
    ingredients: "Нормализованное коровье молоко.",
    nutrition: "Энергетическая ценность: 60 ккал/100мл, белки: 3г, жиры: 3.2г.",
    daysAgo: 1,
  },
  {
    sku: "CEL-1006",
    name: "Сливочное масло President",
    brand: "President",
    category: "yog-va-moylar",
    weight: "300 г",
    price: 50000,
    oldPrice: 56000,
    image: "/products/president-yogi.png",
    stock: 3,
    rating: 4.9,
    ratingCount: 178,
    isFeatured: true,
    description: "President Gastronomique — премиальное французское сливочное масло жирностью 82%. Нежный вкус и натуральный состав.",
    ingredients: "Пастеризованные сливки (молоко).",
    nutrition: "Энергетическая ценность: 736 ккал/100г, жиры: 82г, белки: 0.7г.",
    daysAgo: 3,
  },
  {
    sku: "CEL-1007",
    name: "Coca-Cola",
    brand: "Coca-Cola",
    category: "ichimliklar",
    weight: "1.5 л",
    price: 14000,
    image: "/products/coca-cola.png",
    stock: 95,
    rating: 4.7,
    ratingCount: 302,
    isFeatured: true,
    description: "Классический газированный напиток Coca-Cola в бутылке 1.5 литра с закручивающейся крышкой.",
    ingredients: "Вода, сахар, диоксид углерода, краситель карамельный, кислота фосфорная, натуральные ароматизаторы, кофеин.",
    nutrition: "Энергетическая ценность: 42 ккал/100мл, углеводы: 10.6г.",
    daysAgo: 4,
  },
  { sku: "CEL-1101", name: "Творог Qo‘qon Sut", brand: "Qo‘qon Sut", category: "sut-mahsulotlari", weight: "200 г", price: 16000, image: "/products/tvorog-qoqon-real.webp", stock: 34, rating: 4.4, ratingCount: 41, description: "Мягкий и жирный творог, идеален для завтрака.", ingredients: "Молоко, закваска.", nutrition: "Энергетическая ценность: 155 ккал/100г, белки: 16г.", daysAgo: 6 },
  { sku: "CEL-1102", name: "Йогурт Danone", brand: "Danone", category: "sut-mahsulotlari", weight: "900 г", price: 21000, image: "/products/yogurt-danone-real.webp", stock: 28, rating: 4.5, ratingCount: 77, description: "Натуральный йогурт, обогащённый пробиотическими культурами.", ingredients: "Молоко, живые йогуртовые культуры.", nutrition: "Энергетическая ценность: 61 ккал/100г, белки: 3.5г.", daysAgo: 8 },
  { sku: "CEL-1103", name: "Подсолнечное масло Oltin Dala", brand: "Oltin Dala", category: "yog-va-moylar", weight: "1 л", price: 24000, image: "/products/oltin-dala-yog-real.webp", stock: 51, rating: 4.3, ratingCount: 58, description: "Рафинированное дезодорированное подсолнечное масло для жарки и салатов.", ingredients: "100% подсолнечное масло.", nutrition: "Энергетическая ценность: 899 ккал/100г, жиры: 99.9г.", daysAgo: 12 },
  { sku: "CEL-1104", name: "Сливочное масло Anchor", brand: "Anchor", category: "yog-va-moylar", weight: "200 г", price: 34000, image: "/products/anchor-butter-real.webp", stock: 22, rating: 4.7, ratingCount: 63, description: "Новозеландское сливочное масло с насыщенным натуральным вкусом.", ingredients: "Пастеризованные сливки.", nutrition: "Энергетическая ценность: 745 ккал/100г, жиры: 82г.", daysAgo: 15 },
  { sku: "CEL-1105", name: "Говядина (мякоть)", brand: "Мясная лавка", category: "gosht", weight: "1 кг", price: 98000, image: "/products/mol-goshti-real.webp", stock: 18, rating: 4.6, ratingCount: 39, description: "Свежая говядина, мякоть, подходит для гриля и казана.", ingredients: "100% говядина.", nutrition: "Энергетическая ценность: 250 ккал/100г, белки: 26г.", daysAgo: 1 },
  { sku: "CEL-1106", name: "Баранина", brand: "Мясная лавка", category: "gosht", weight: "1 кг", price: 110000, image: "/products/qoy-goshti.svg", stock: 0, rating: 4.5, ratingCount: 22, description: "Молодая баранина для шашлыка и национальных блюд.", ingredients: "100% баранина.", nutrition: "Энергетическая ценность: 294 ккал/100г, белки: 25г.", daysAgo: 20 },
  { sku: "CEL-1107", name: "Куриное филе", brand: "Птицефабрика", category: "tovuq", weight: "1 кг", price: 45000, image: "/products/tovuq-file-real.webp", stock: 64, rating: 4.6, ratingCount: 91, isFeatured: true, description: "Куриное филе грудки без костей и кожи, для диетического питания.", ingredients: "100% куриное мясо.", nutrition: "Энергетическая ценность: 165 ккал/100г, белки: 31г.", daysAgo: 2 },
  { sku: "CEL-1108", name: "Куриное бедро", brand: "Птицефабрика", category: "tovuq", weight: "1 кг", price: 32000, image: "/products/tovuq-son.svg", stock: 4, rating: 4.4, ratingCount: 54, description: "Сочное куриное бедро.", ingredients: "100% куриное мясо.", nutrition: "Энергетическая ценность: 209 ккал/100г, белки: 26г.", daysAgo: 9 },
  { sku: "CEL-1109", name: "Бананы", brand: "Импорт", category: "meva-sabzavot", weight: "1 кг", price: 17000, image: "/products/banan-real.webp", stock: 73, rating: 4.5, ratingCount: 48, description: "Сладкие спелые бананы — источник энергии.", ingredients: "100% натуральный фрукт.", nutrition: "Энергетическая ценность: 89 ккал/100г, калий: 358мг.", daysAgo: 0 },
  { sku: "CEL-1110", name: "Помидоры", brand: "Местный фермер", category: "meva-sabzavot", weight: "1 кг", price: 12000, image: "/products/pomidor-real.webp", stock: 55, rating: 4.3, ratingCount: 33, description: "Сочные красные помидоры для салатов и блюд.", ingredients: "100% натуральный овощ.", nutrition: "Энергетическая ценность: 18 ккал/100г, витамин C.", daysAgo: 1 },
  { sku: "CEL-1111", name: "Огурцы", brand: "Местный фермер", category: "meva-sabzavot", weight: "1 кг", price: 10000, image: "/products/bodring-real.webp", stock: 61, rating: 4.2, ratingCount: 27, description: "Свежие хрустящие огурцы.", ingredients: "100% натуральный овощ.", nutrition: "Энергетическая ценность: 15 ккал/100г.", daysAgo: 3 },
  { sku: "CEL-1112", name: "Белый хлеб", brand: "Хлебокомбинат", category: "non-pishiriq", weight: "500 г", price: 6000, image: "/products/oq-non-real.webp", stock: 88, rating: 4.6, ratingCount: 112, isFeatured: true, description: "Мягкий белый хлеб, испечённый по традиционному рецепту.", ingredients: "Мука, вода, соль, дрожжи.", nutrition: "Энергетическая ценность: 265 ккал/100г.", daysAgo: 0 },
  { sku: "CEL-1113", name: "Багет", brand: "Хлебокомбинат", category: "non-pishiriq", weight: "300 г", price: 9000, image: "/products/baget-non-real.webp", stock: 40, rating: 4.4, ratingCount: 36, description: "Багет с хрустящей корочкой во французском стиле.", ingredients: "Мука, вода, соль, дрожжи.", nutrition: "Энергетическая ценность: 270 ккал/100г.", daysAgo: 0 },
  { sku: "CEL-1114", name: "Fanta", brand: "Coca-Cola Company", category: "ichimliklar", weight: "1.5 л", price: 14000, image: "/products/fanta-real.webp", stock: 70, rating: 4.5, ratingCount: 88, description: "Газированный напиток со вкусом апельсина.", ingredients: "Вода, сахар, концентрат апельсинового сока, диоксид углерода.", nutrition: "Энергетическая ценность: 45 ккал/100мл.", daysAgo: 5 },
  { sku: "CEL-1115", name: "Минеральная вода Borjomi", brand: "Borjomi", category: "ichimliklar", weight: "0.5 л", price: 11000, image: "/products/mineral-suv-real.webp", stock: 46, rating: 4.6, ratingCount: 52, description: "Натуральная газированная минеральная вода из Грузии.", ingredients: "Натуральная минеральная вода.", nutrition: "Энергетическая ценность: 0 ккал.", daysAgo: 7 },
  { sku: "CEL-1116", name: "Шоколад Alpen Gold", brand: "Alpen Gold", category: "shirinliklar", weight: "90 г", price: 15000, oldPrice: 18000, image: "/products/alpen-gold-real.webp", stock: 66, rating: 4.7, ratingCount: 134, isFeatured: true, description: "Молочный шоколад с цельным фундуком.", ingredients: "Сахар, какао-продукты, сухое молоко, фундук.", nutrition: "Энергетическая ценность: 545 ккал/100г.", daysAgo: 2 },
  { sku: "CEL-1117", name: "Печенье Oreo", brand: "Oreo", category: "shirinliklar", weight: "133 г", price: 9500, image: "/products/oreo-real.webp", stock: 58, rating: 4.6, ratingCount: 97, description: "Шоколадное печенье с ванильным кремом.", ingredients: "Мука, сахар, растительное масло, какао-порошок.", nutrition: "Энергетическая ценность: 480 ккал/100г.", daysAgo: 6 },
  { sku: "CEL-1118", name: "Рис Lazzat", brand: "Lazzat", category: "oziq-ovqat", weight: "1 кг", price: 17000, image: "/products/guruch-yorem.webp", stock: 6, rating: 4.5, ratingCount: 71, description: "Высококачественный шлифованный рис, идеален для плова.", ingredients: "100% рис.", nutrition: "Энергетическая ценность: 130 ккал/100г (варёный).", daysAgo: 11 },
  { sku: "CEL-1119", name: "Мука Oltin Don", brand: "Oltin Don", category: "oziq-ovqat", weight: "2 кг", price: 19000, image: "/products/un-oltin-don-real.webp", stock: 44, rating: 4.4, ratingCount: 49, description: "Пшеничная мука высшего сорта для выпечки.", ingredients: "100% пшеничная мука.", nutrition: "Энергетическая ценность: 364 ккал/100г.", daysAgo: 14 },
  { sku: "CEL-1120", name: "Средство для мытья посуды Fairy", brand: "Fairy", category: "maishiy", weight: "500 мл", price: 22000, image: "/products/fairy-idish.svg", stock: 39, rating: 4.7, ratingCount: 165, description: "Концентрированное средство, эффективно растворяет жир.", ingredients: "5-15% анионные ПАВ, консерванты, отдушка.", nutrition: "Не является пищевым продуктом.", daysAgo: 3 },
  { sku: "CEL-1121", name: "Туалетная бумага Zewa", brand: "Zewa", category: "maishiy", weight: "8 шт", price: 28000, image: "/products/zewa-qogoz-real.webp", stock: 31, rating: 4.6, ratingCount: 84, description: "Мягкая трёхслойная туалетная бумага, упаковка 8 рулонов.", ingredients: "100% целлюлоза.", nutrition: "Не является пищевым продуктом.", daysAgo: 9 },
  { sku: "CEL-1122", name: "Зубная паста Colgate", brand: "Colgate", category: "gigiyena", weight: "100 мл", price: 14000, image: "/products/colgate-pasta-real.webp", stock: 52, rating: 4.7, ratingCount: 118, description: "Фторсодержащая зубная паста для защиты зубов в течение всего дня.", ingredients: "Вода, абразивные вещества, фторид натрия.", nutrition: "Не является пищевым продуктом.", daysAgo: 4 },
  { sku: "CEL-1123", name: "Мыло Dove", brand: "Dove", category: "gigiyena", weight: "90 г", price: 8500, image: "/products/dove-sovun-real.webp", stock: 2, rating: 4.6, ratingCount: 102, description: "Мыло, обогащённое увлажняющим кремом.", ingredients: "Талловые соли натрия, глицерин, увлажняющий крем.", nutrition: "Не является пищевым продуктом.", daysAgo: 1 },
  { sku: "CEL-1124", name: "Подгузники Pampers Baby Dry", brand: "Pampers", category: "bolalar", weight: "размер 4, 58 шт", price: 89000, oldPrice: 99000, image: "/products/pampers-real.webp", stock: 24, rating: 4.8, ratingCount: 211, isFeatured: true, description: "Подгузники с высокой впитываемостью для защиты на всю ночь.", ingredients: "Целлюлоза, суперабсорбирующий полимер.", nutrition: "Не является пищевым продуктом.", daysAgo: 0 },
  { sku: "CEL-1125", name: "Детский шампунь Johnson's", brand: "Johnson's", category: "bolalar", weight: "500 мл", price: 32000, image: "/products/johnsons-shampun-real.webp", stock: 27, rating: 4.7, ratingCount: 89, description: "Мягкая формула, не раздражающая глаза, для ежедневного использования.", ingredients: "Вода, моющие вещества, экстракт алоэ вера.", nutrition: "Не является пищевым продуктом.", daysAgo: 2 },
  { sku: "CEL-1126", name: "Черешня", brand: "Местный фермер", category: "meva-sabzavot", weight: "1 кг", price: 4000, image: "/products/gilos.webp", stock: 30, rating: 4.6, ratingCount: 18, description: "Oʻzbekcha: Gilos. Сладкая сочная черешня сезонного урожая.", ingredients: "100% натуральный фрукт.", nutrition: "Энергетическая ценность: 63 ккал/100г.", daysAgo: 0 },
  { sku: "CEL-1127", name: "Картофель", brand: "Местный фермер", category: "meva-sabzavot", weight: "1 кг", price: 1100, image: "/products/kartoshka.webp", stock: 120, rating: 4.5, ratingCount: 44, description: "Oʻzbekcha: Kartoshka. Свежий картофель для варки, жарки и супов.", ingredients: "100% натуральный овощ.", nutrition: "Энергетическая ценность: 77 ккал/100г.", daysAgo: 1 },
  { sku: "CEL-1128", name: "Лук репчатый", brand: "Местный фермер", category: "meva-sabzavot", weight: "1 кг", price: 700, image: "/products/piyoz.webp", stock: 95, rating: 4.4, ratingCount: 21, description: "Oʻzbekcha: Piyoz. Сочный репчатый лук для готовки и плова.", ingredients: "100% натуральный овощ.", nutrition: "Энергетическая ценность: 40 ккал/100г.", daysAgo: 1 },
  { sku: "CEL-1129", name: "Морковь", brand: "Местный фермер", category: "meva-sabzavot", weight: "1 кг", price: 1400, image: "/products/sabzi.webp", stock: 100, rating: 4.5, ratingCount: 29, description: "Oʻzbekcha: Sabzi. Свежая сладкая морковь, незаменима для плова.", ingredients: "100% натуральный овощ.", nutrition: "Энергетическая ценность: 41 ккал/100г.", daysAgo: 0 },
  { sku: "CEL-1130", name: "Клубника", brand: "Местный фермер", category: "meva-sabzavot", weight: "1 кг", price: 4500, image: "/products/qulupnay.webp", stock: 25, rating: 4.7, ratingCount: 37, isFeatured: true, description: "Oʻzbekcha: Qulupnay. Ароматная сезонная клубника.", ingredients: "100% натуральный фрукт.", nutrition: "Энергетическая ценность: 32 ккал/100г, витамин C.", daysAgo: 0 },
  { sku: "CEL-1131", name: "Шоколадный кекс Bruni", brand: "Krember", category: "shirinliklar", weight: "252 г", price: 16000, oldPrice: 19000, image: "/products/bruni-keks.webp", stock: 40, rating: 4.6, ratingCount: 53, description: "Oʻzbekcha: Shokoladli keks. Шоколадный кекс с шоколадной начинкой, 10 шт в упаковке.", ingredients: "Мука, сахар, растительное масло, какао-продукты, яйцо куриное.", nutrition: "Энергетическая ценность: 420 ккал/100г.", daysAgo: 3 },
  { sku: "CEL-1132", name: "Чай Toza", brand: "Toza Tea", category: "oziq-ovqat", weight: "200 г", price: 14000, image: "/products/choy-toza.webp", stock: 48, rating: 4.5, ratingCount: 62, description: "Oʻzbekcha: Choy. Байховый чёрный чай с насыщенным вкусом.", ingredients: "100% чёрный чайный лист.", nutrition: "Энергетическая ценность: 1 ккал/100мл (заварка).", daysAgo: 7 },
  { sku: "CEL-1133", name: "Абрикосы", brand: "Местный фермер", category: "meva-sabzavot", weight: "1 кг", price: 4500, image: "/products/orik.webp", stock: 33, rating: 4.6, ratingCount: 24, description: "Oʻzbekcha: Oʻrik. Сладкие сочные абрикосы сезонного урожая.", ingredients: "100% натуральный фрукт.", nutrition: "Энергетическая ценность: 48 ккал/100г.", daysAgo: 0 },
  { sku: "CEL-1134", name: "Кофе Nescafe Gold", brand: "Nescafe", category: "oziq-ovqat", weight: "250 г", price: 53000, oldPrice: 59000, image: "/products/nescafe-gold.webp", stock: 36, rating: 4.7, ratingCount: 145, description: "Oʻzbekcha: Nescafe Gold kofe. Растворимый кофе, созданный с арабикой.", ingredients: "100% растворимый кофе.", nutrition: "Энергетическая ценность: 3 ккал/100мл (напиток).", daysAgo: 5 },
  { sku: "CEL-1135", name: "Каймак", brand: "Pure Milky", category: "sut-mahsulotlari", weight: "300 г", price: 5000, image: "/products/kaymak.webp", stock: 20, rating: 4.6, ratingCount: 31, description: "Oʻzbekcha: Qaymoq. Густые натуральные сливки 45% жирности.", ingredients: "Сливки коровьего молока.", nutrition: "Энергетическая ценность: 380 ккал/100г, жиры: 45г.", daysAgo: 2 },
  { sku: "CEL-1136", name: "Кефир Простоквашино", brand: "Простоквашино", category: "sut-mahsulotlari", weight: "0.5 л", price: 2000, image: "/products/kefir.webp", stock: 55, rating: 4.5, ratingCount: 68, description: "Oʻzbekcha: Kefir. Натуральный кефир 2.5% жирности без консервантов.", ingredients: "Молоко нормализованное, закваска кефирная.", nutrition: "Энергетическая ценность: 53 ккал/100г, жиры: 2.5г.", daysAgo: 1 },
  { sku: "CEL-1137", name: "Сыр ассорти", brand: "Молочная лавка", category: "sut-mahsulotlari", weight: "1 кг", price: 20000, image: "/products/pishloq.webp", stock: 15, rating: 4.7, ratingCount: 19, description: "Oʻzbekcha: Pishloq. Ассорти из твёрдых и мягких сыров.", ingredients: "Молоко, закваска, соль, сычужный фермент.", nutrition: "Энергетическая ценность: 350 ккал/100г, белки: 25г.", daysAgo: 4 },
  { sku: "CEL-1138", name: "Пряники", brand: "Кондитерская фабрика", category: "shirinliklar", weight: "400 г", price: 12000, image: "/products/pryaniki.webp", stock: 42, rating: 4.4, ratingCount: 27, description: "Oʻzbekcha: Pryanik. Мягкие пряники, обсыпанные сахарной пудрой.", ingredients: "Мука, сахар, мёд, яйцо, разрыхлитель.", nutrition: "Энергетическая ценность: 350 ккал/100г.", daysAgo: 6 },
  { sku: "CEL-1139", name: "Шампунь Pantene", brand: "Pantene", category: "gigiyena", weight: "200 мл", price: 13500, image: "/products/pantene-shampun.webp", stock: 38, rating: 4.6, ratingCount: 74, description: "Oʻzbekcha: Shampun. Шампунь Pantene Pro-V для густых и крепких волос.", ingredients: "Вода, моющие вещества, ниацинамид, пантенол.", nutrition: "Не является пищевым продуктом.", daysAgo: 3 },
  { sku: "CEL-1140", name: "Паста Reggia", brand: "Pasta Reggia", category: "oziq-ovqat", weight: "400 г", price: 4000, image: "/products/pasta-reggia.webp", stock: 60, rating: 4.5, ratingCount: 33, description: "Oʻzbekcha: Pasta. Итальянские макаронные изделия из твёрдых сортов пшеницы.", ingredients: "100% манная крупа из твёрдой пшеницы.", nutrition: "Энергетическая ценность: 350 ккал/100г (сухой продукт).", daysAgo: 8 },
  { sku: "CEL-1141", name: "Шоколад Алёнка", brand: "Красный Октябрь", category: "shirinliklar", weight: "100 г", price: 8000, image: "/products/alenka.webp", stock: 70, rating: 4.7, ratingCount: 156, description: "Oʻzbekcha: Shokolad. Классический молочный шоколад Алёнка.", ingredients: "Сахар, какао-масло, сухое цельное молоко, какао тёртое.", nutrition: "Энергетическая ценность: 534 ккал/100г.", daysAgo: 2 },
  { sku: "CEL-1142", name: "Вода Nestlé Pure Life", brand: "Nestlé", category: "ichimliklar", weight: "1.5 л", price: 1500, image: "/products/nestle-pure-life.webp", stock: 90, rating: 4.5, ratingCount: 41, description: "Oʻzbekcha: Ichimlik suvi. Очищенная питьевая вода без газа.", ingredients: "Питьевая вода.", nutrition: "Энергетическая ценность: 0 ккал.", daysAgo: 1 },
  { sku: "CEL-1143", name: "Гель для душа Nivea", brand: "Nivea", category: "gigiyena", weight: "250 мл", price: 35000, image: "/products/nivea-shower.webp", stock: 26, rating: 4.6, ratingCount: 48, description: "Oʻzbekcha: Dush geli. Гель для душа Nivea с ароматом гавайского цветка и маслом.", ingredients: "Вода, моющие вещества, ароматизатор.", nutrition: "Не является пищевым продуктом.", daysAgo: 3 },
  { sku: "CEL-1144", name: "Зубная щётка Colgate", brand: "Colgate", category: "gigiyena", weight: "1 шт", price: 6700, image: "/products/colgate-tishbrush.webp", stock: 45, rating: 4.5, ratingCount: 39, description: "Oʻzbekcha: Tish cho'tkasi. Зубная щётка Colgate Total с мягкой щетиной.", ingredients: "Пластик, нейлоновая щетина.", nutrition: "Не является пищевым продуктом.", daysAgo: 5 },
  { sku: "CEL-1145", name: "Зубная паста Sensodyne", brand: "Sensodyne", category: "gigiyena", weight: "75 мл", price: 42000, image: "/products/sensodyne.webp", stock: 22, rating: 4.7, ratingCount: 58, description: "Oʻzbekcha: Tish pastasi. Паста для восстановления и защиты чувствительных зубов.", ingredients: "Вода, абразивные вещества, нитрат калия, фторид натрия.", nutrition: "Не является пищевым продуктом.", daysAgo: 2 },
  { sku: "CEL-1146", name: "Сомса", brand: "Хлебокомбинат", category: "non-pishiriq", weight: "4 шт", price: 15000, image: "/products/somsa.webp", stock: 32, rating: 4.8, ratingCount: 66, isFeatured: true, description: "Oʻzbekcha: Somsa. Слоёная выпечка с сочной начинкой, свежая выпечка.", ingredients: "Мука, мясо, лук, специи, тесто слоёное.", nutrition: "Энергетическая ценность: 290 ккал/100г.", daysAgo: 0 },
];

const ZONES = [
  { name: "Зона 1", minKm: 0, maxKm: 5, fee: 20000, sortOrder: 1 },
  { name: "Зона 2", minKm: 5, maxKm: 10, fee: 30000, sortOrder: 2 },
  { name: "Зона 3", minKm: 10, maxKm: 15, fee: 45000, sortOrder: 3 },
];

const PICKUP_LOCATIONS = [
  { name: "Celestia — филиал Юнусабад", address: "г. Ташкент, ул. Амира Темура, 108", openHours: "08:00–23:00" },
  { name: "Celestia — филиал Чиланзар", address: "г. Ташкент, проспект Бунёдкор, 45", openHours: "08:00–22:00" },
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
    create: { email: "admin@celestia.uz", passwordHash: adminPassword, name: "Супер администратор", role: "SUPER_ADMIN" },
  });
  await db.adminUser.upsert({
    where: { email: "products@celestia.uz" },
    update: {},
    create: { email: "products@celestia.uz", passwordHash: adminPassword, name: "Менеджер товаров", role: "PRODUCT_MANAGER" },
  });
  await db.adminUser.upsert({
    where: { email: "orders@celestia.uz" },
    update: {},
    create: { email: "orders@celestia.uz", passwordHash: adminPassword, name: "Менеджер заказов", role: "ORDER_MANAGER" },
  });

  const customerPassword = await bcrypt.hash("customer123", 10);
  const demoUser = await db.user.upsert({
    where: { phone: "+998953278474" },
    update: {},
    create: { name: "Мустафо Алиев", phone: "+998953278474", email: "mustafo@example.com", passwordHash: customerPassword },
  });

  const existingAddr = await db.address.findFirst({ where: { userId: demoUser.id } });
  if (!existingAddr) {
    await db.address.create({
      data: {
        userId: demoUser.id,
        label: "Дом",
        city: "Ташкент",
        district: "Юнусабадский район",
        street: "улица Амира Темура, 108",
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
        city: "Ташкент",
        district: "Юнусабадский район",
        street: "улица Амира Темура, 108",
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
        city: "Ташкент",
        district: "Юнусабадский район",
        street: "улица Амира Темура, 108",
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
  console.log("Demo customer: +998953278474 / customer123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

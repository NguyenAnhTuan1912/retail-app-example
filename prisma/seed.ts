import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ─── Product catalog data ───
const productCatalog: Record<string, { name: string; desc: string; price: number; stock: number; rating: number }[]> = {
  phones: [
    { name: 'iPhone 15 Pro Max 256GB', desc: 'Chip A17 Pro, camera 48MP, màn hình 6.7" Super Retina XDR.', price: 29990000, stock: 50, rating: 4.7 },
    { name: 'iPhone 15 128GB', desc: 'Chip A16 Bionic, Dynamic Island, camera 48MP, USB-C.', price: 19990000, stock: 80, rating: 4.5 },
    { name: 'Samsung Galaxy S24 Ultra', desc: 'Snapdragon 8 Gen 3, camera 200MP, S-Pen tích hợp.', price: 27990000, stock: 35, rating: 4.5 },
    { name: 'Samsung Galaxy A55 5G', desc: 'Exynos 1480, camera 50MP OIS, pin 5000mAh, chống nước IP67.', price: 9490000, stock: 120, rating: 4.2 },
    { name: 'Samsung Galaxy Z Flip5', desc: 'Snapdragon 8 Gen 2, màn hình gập, Flex Window 3.4".', price: 22990000, stock: 25, rating: 4.3 },
    { name: 'Xiaomi 14 Ultra', desc: 'Camera Leica 50MP, Snapdragon 8 Gen 3, sạc nhanh 90W.', price: 19990000, stock: 40, rating: 4.4 },
    { name: 'Xiaomi Redmi Note 13 Pro+', desc: 'Dimensity 7200, camera 200MP, sạc 120W, màn AMOLED 120Hz.', price: 7990000, stock: 150, rating: 4.1 },
    { name: 'Google Pixel 8 Pro', desc: 'Tensor G3, camera AI, 7 năm cập nhật Android.', price: 22490000, stock: 25, rating: 4.5 },
    { name: 'OPPO Find X7 Ultra', desc: 'Camera Hasselblad, Snapdragon 8 Gen 3, pin 5400mAh.', price: 24990000, stock: 20, rating: 4.4 },
    { name: 'OPPO Reno 11 5G', desc: 'Dimensity 7050, camera 50MP, sạc 67W, thiết kế mỏng nhẹ.', price: 8990000, stock: 100, rating: 4.0 },
    { name: 'Vivo X100 Pro', desc: 'Dimensity 9300, camera ZEISS 50MP, pin 5400mAh.', price: 21990000, stock: 30, rating: 4.3 },
    { name: 'Realme GT5 Pro', desc: 'Snapdragon 8 Gen 3, camera Sony IMX890, sạc 100W.', price: 12990000, stock: 45, rating: 4.2 },
  ],
  laptops: [
    { name: 'MacBook Pro 14" M3 Pro', desc: '18GB RAM, 512GB SSD, màn hình Liquid Retina XDR.', price: 49990000, stock: 20, rating: 4.8 },
    { name: 'MacBook Air 15" M3', desc: '16GB RAM, 512GB SSD, fanless, pin 18 giờ.', price: 37990000, stock: 30, rating: 4.7 },
    { name: 'MacBook Air 13" M2', desc: '8GB RAM, 256GB SSD, thiết kế mỏng nhẹ, MagSafe.', price: 24990000, stock: 45, rating: 4.5 },
    { name: 'Dell XPS 15 9530', desc: 'Core i7-13700H, 16GB RAM, 512GB SSD, màn OLED 3.5K.', price: 39990000, stock: 15, rating: 4.3 },
    { name: 'Dell Inspiron 16 5630', desc: 'Core i5-1340P, 16GB RAM, 512GB SSD, màn 16" FHD+.', price: 18990000, stock: 40, rating: 4.0 },
    { name: 'ASUS ROG Zephyrus G14 2024', desc: 'Ryzen 9 8945HS, RTX 4060, 16GB RAM, OLED 2.8K 120Hz.', price: 42990000, stock: 10, rating: 4.6 },
    { name: 'ASUS Vivobook 15 OLED', desc: 'Ryzen 7 7730U, 16GB RAM, 512GB SSD, màn OLED FHD.', price: 16990000, stock: 55, rating: 4.2 },
    { name: 'Lenovo ThinkPad X1 Carbon Gen 11', desc: 'Core i7-1365U, 16GB RAM, 512GB SSD, 1.12kg.', price: 35990000, stock: 18, rating: 4.6 },
    { name: 'Lenovo IdeaPad Slim 5', desc: 'Ryzen 5 7530U, 16GB RAM, 512GB SSD, pin 12 giờ.', price: 14990000, stock: 60, rating: 4.1 },
    { name: 'HP Spectre x360 14', desc: 'Core Ultra 7, 16GB RAM, 1TB SSD, màn OLED 2.8K touch.', price: 44990000, stock: 12, rating: 4.5 },
  ],
  accessories: [
    { name: 'AirPods Pro 2 USB-C', desc: 'Chống ồn chủ động, âm thanh không gian, chip H2.', price: 5990000, stock: 100, rating: 4.6 },
    { name: 'AirPods 4', desc: 'Chip H2, âm thanh không gian, thiết kế open-ear thoải mái.', price: 3490000, stock: 120, rating: 4.3 },
    { name: 'Samsung Galaxy Buds3 Pro', desc: 'ANC thông minh, codec SSC, pin 7 giờ, chống nước IPX7.', price: 4990000, stock: 80, rating: 4.2 },
    { name: 'Samsung Galaxy Watch 6 Classic', desc: '47mm, vòng bezel xoay, đo huyết áp, GPS.', price: 8490000, stock: 60, rating: 4.3 },
    { name: 'Apple Watch Series 9 GPS', desc: 'Chip S9, Double Tap, màn hình always-on, đo SpO2.', price: 10990000, stock: 40, rating: 4.6 },
    { name: 'Anker PowerBank 20000mAh', desc: 'Sạc nhanh 22.5W, 2 cổng USB-C, nhỏ gọn.', price: 790000, stock: 200, rating: 4.7 },
    { name: 'Baseus Sạc nhanh GaN 65W', desc: 'Sạc GaN 3 cổng, PD 65W, tương thích laptop + điện thoại.', price: 590000, stock: 180, rating: 4.4 },
    { name: 'Logitech MX Master 3S', desc: 'Chuột không dây, cảm biến 8000 DPI, sạc USB-C, kết nối 3 thiết bị.', price: 2490000, stock: 70, rating: 4.8 },
    { name: 'Keychron K8 Pro', desc: 'Bàn phím cơ không dây, hot-swap, Gateron G Pro, RGB.', price: 2290000, stock: 50, rating: 4.5 },
    { name: 'Sony WH-1000XM5', desc: 'Tai nghe over-ear, chống ồn hàng đầu, pin 30 giờ, LDAC.', price: 7490000, stock: 35, rating: 4.7 },
  ],
  menFashion: [
    { name: 'Áo thun nam Polo Classic', desc: 'Cotton 100%, form regular fit, nhiều màu sắc.', price: 299000, stock: 200, rating: 4.2 },
    { name: 'Áo sơ mi nam Oxford dài tay', desc: 'Vải Oxford dày dặn, form slim fit, cổ button-down.', price: 450000, stock: 120, rating: 4.3 },
    { name: 'Quần jeans nam Slim Fit', desc: 'Denim co giãn, wash nhẹ, dáng slim fit.', price: 450000, stock: 150, rating: 4.0 },
    { name: 'Quần kaki nam chinos', desc: 'Vải kaki mềm, form slim, phù hợp công sở lẫn casual.', price: 380000, stock: 130, rating: 4.1 },
    { name: 'Áo khoác bomber nam', desc: 'Chất dù chống nước nhẹ, lót lưới thoáng mát.', price: 650000, stock: 70, rating: 4.1 },
    { name: 'Áo hoodie nam oversize', desc: 'Cotton fleece 350gsm, form oversize, mũ trùm 2 lớp.', price: 420000, stock: 90, rating: 4.4 },
    { name: 'Quần short nam thể thao', desc: 'Vải gió nhẹ, có lót trong, túi khoá kéo, co giãn 4 chiều.', price: 250000, stock: 160, rating: 4.0 },
    { name: 'Giày sneaker nam trắng basic', desc: 'Da tổng hợp, đế cao su, phong cách minimalist.', price: 890000, stock: 80, rating: 4.3 },
  ],
  womenFashion: [
    { name: 'Đầm nữ hoa nhí vintage', desc: 'Voan mềm mại, dáng xòe, họa tiết hoa nhí retro.', price: 389000, stock: 80, rating: 4.4 },
    { name: 'Áo sơ mi nữ lụa cao cấp', desc: 'Lụa satin, form rộng thanh lịch, phù hợp công sở.', price: 520000, stock: 90, rating: 4.5 },
    { name: 'Chân váy midi xếp ly', desc: 'Vải chiffon, xếp ly nhỏ, dáng midi thanh lịch.', price: 350000, stock: 100, rating: 4.3 },
    { name: 'Áo croptop nữ basic', desc: 'Cotton co giãn, form ôm, nhiều màu, phối đồ dễ dàng.', price: 180000, stock: 200, rating: 4.1 },
    { name: 'Quần culottes nữ ống rộng', desc: 'Vải linen thoáng mát, cạp chun, dáng ống rộng.', price: 320000, stock: 110, rating: 4.2 },
    { name: 'Túi xách nữ tote da PU', desc: 'Da PU cao cấp, ngăn laptop 13", quai vai chắc chắn.', price: 590000, stock: 60, rating: 4.0 },
    { name: 'Giày cao gót nữ 7cm mũi nhọn', desc: 'Da bóng, gót vuông 7cm, đệm êm, phù hợp công sở.', price: 680000, stock: 50, rating: 4.2 },
    { name: 'Bộ đồ ngủ nữ lụa satin', desc: 'Lụa satin mềm mịn, set áo cộc + quần dài, nhiều màu pastel.', price: 350000, stock: 140, rating: 4.6 },
  ],
};

async function main() {
  // ─── Clean ───
  await prisma.orderCancellation.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.apiKey.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  // ─── Users ───
  const admin = await prisma.user.create({
    data: { username: 'admin', email: 'admin@retailapp.com', passwordHash: '$2b$10$hashed_admin', fullName: 'Admin User', phoneNumber: '0900000001', role: 'admin' },
  });
  const seller1 = await prisma.user.create({
    data: { username: 'techshop', email: 'techshop@retailapp.com', passwordHash: '$2b$10$hashed_seller1', fullName: 'Tech Shop Official', phoneNumber: '0900000002', role: 'seller' },
  });
  const seller2 = await prisma.user.create({
    data: { username: 'fashionstore', email: 'fashion@retailapp.com', passwordHash: '$2b$10$hashed_seller2', fullName: 'Fashion Store VN', phoneNumber: '0900000003', role: 'seller' },
  });
  const buyer1 = await prisma.user.create({
    data: { username: 'nguyenvana', email: 'vana@gmail.com', passwordHash: '$2b$10$hashed_buyer1', fullName: 'Nguyễn Văn A', phoneNumber: '0912345678', role: 'buyer' },
  });
  const buyer2 = await prisma.user.create({
    data: { username: 'tranthib', email: 'thib@gmail.com', passwordHash: '$2b$10$hashed_buyer2', fullName: 'Trần Thị B', phoneNumber: '0987654321', role: 'buyer' },
  });
  const buyer3 = await prisma.user.create({
    data: { username: 'levanc', email: 'vanc@gmail.com', passwordHash: '$2b$10$hashed_buyer3', fullName: 'Lê Văn C', phoneNumber: '0976543210', role: 'buyer' },
  });
  console.log('✅ Users created (6)');

  // ─── API Keys ───
  await prisma.apiKey.createMany({
    data: [
      { userId: admin.id, key: 'admin-api-key-demo-retail-2026' },
      { userId: seller1.id, key: 'seller1-api-key-demo-retail-2026' },
      { userId: seller2.id, key: 'seller2-api-key-demo-retail-2026' },
      { userId: buyer1.id, key: 'buyer1-api-key-demo-retail-2026' },
      { userId: buyer2.id, key: 'buyer2-api-key-demo-retail-2026' },
      { userId: buyer3.id, key: 'buyer3-api-key-demo-retail-2026' },
    ],
  });
  console.log('✅ API Keys created');

  // ─── Addresses ───
  await prisma.address.createMany({
    data: [
      { userId: buyer1.id, recipientName: 'Nguyễn Văn A', phoneNumber: '0912345678', province: 'TP. Hồ Chí Minh', district: 'Quận 1', ward: 'Phường Bến Nghé', detailAddress: '123 Đường Lê Lợi', isDefault: true },
      { userId: buyer1.id, recipientName: 'Nguyễn Văn A', phoneNumber: '0912345678', province: 'TP. Hồ Chí Minh', district: 'Quận 7', ward: 'Phường Tân Phong', detailAddress: '456 Đường Nguyễn Thị Thập', isDefault: false },
      { userId: buyer2.id, recipientName: 'Trần Thị B', phoneNumber: '0987654321', province: 'Hà Nội', district: 'Quận Hoàn Kiếm', ward: 'Phường Hàng Bạc', detailAddress: '789 Phố Hàng Đào', isDefault: true },
      { userId: buyer3.id, recipientName: 'Lê Văn C', phoneNumber: '0976543210', province: 'Đà Nẵng', district: 'Quận Hải Châu', ward: 'Phường Thạch Thang', detailAddress: '321 Đường Bạch Đằng', isDefault: true },
    ],
  });
  console.log('✅ Addresses created');

  // ─── Categories ───
  const catElectronics = await prisma.category.create({ data: { name: 'Điện tử', slug: 'dien-tu' } });
  const catPhones = await prisma.category.create({ data: { name: 'Điện thoại', slug: 'dien-thoai', parentId: catElectronics.id } });
  const catLaptops = await prisma.category.create({ data: { name: 'Laptop', slug: 'laptop', parentId: catElectronics.id } });
  const catAccessories = await prisma.category.create({ data: { name: 'Phụ kiện', slug: 'phu-kien', parentId: catElectronics.id } });
  const catFashion = await prisma.category.create({ data: { name: 'Thời trang', slug: 'thoi-trang' } });
  const catMenFashion = await prisma.category.create({ data: { name: 'Thời trang nam', slug: 'thoi-trang-nam', parentId: catFashion.id } });
  const catWomenFashion = await prisma.category.create({ data: { name: 'Thời trang nữ', slug: 'thoi-trang-nu', parentId: catFashion.id } });
  console.log('✅ Categories created (7)');

  const categoryMap: Record<string, number> = {
    phones: catPhones.id,
    laptops: catLaptops.id,
    accessories: catAccessories.id,
    menFashion: catMenFashion.id,
    womenFashion: catWomenFashion.id,
  };
  const sellerMap: Record<string, string> = {
    phones: seller1.id,
    laptops: seller1.id,
    accessories: seller1.id,
    menFashion: seller2.id,
    womenFashion: seller2.id,
  };

  // ─── Products ───
  const allProducts: { id: string; name: string; price: number }[] = [];
  for (const [catKey, items] of Object.entries(productCatalog)) {
    for (const item of items) {
      const p = await prisma.product.create({
        data: {
          sellerId: sellerMap[catKey],
          categoryId: categoryMap[catKey],
          name: item.name,
          description: item.desc,
          basePrice: item.price,
          stockQuantity: item.stock,
          ratingAvg: item.rating,
          images: {
            create: [{ url: `https://picsum.photos/seed/${item.name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30)}/800/800`, isMain: true }],
          },
        },
      });
      allProducts.push({ id: p.id, name: p.name, price: item.price });
    }
  }
  console.log(`✅ Products created (${allProducts.length})`);

  // Helper: lấy product theo tên (partial match)
  const findProduct = (keyword: string) => allProducts.find((p) => p.name.includes(keyword))!;

  const iphone15pro = findProduct('iPhone 15 Pro');
  const iphone15 = findProduct('iPhone 15 128');
  const samsungS24 = findProduct('S24 Ultra');
  const samsungA55 = findProduct('A55');
  const xiaomi14 = findProduct('Xiaomi 14');
  const pixel8 = findProduct('Pixel 8');
  const macbookPro = findProduct('MacBook Pro');
  const macbookAir15 = findProduct('MacBook Air 15');
  const dellXps = findProduct('Dell XPS');
  const rogG14 = findProduct('ROG Zephyrus');
  const airpodsPro = findProduct('AirPods Pro');
  const airpods4 = findProduct('AirPods 4');
  const mxMaster = findProduct('MX Master');
  const sonyXm5 = findProduct('WH-1000XM5');
  const anker = findProduct('Anker');
  const polo = findProduct('Polo');
  const jeans = findProduct('jeans nam');
  const bomber = findProduct('bomber');
  const hoodie = findProduct('hoodie');
  const dam = findProduct('Đầm nữ');
  const somiNu = findProduct('sơ mi nữ');
  const culottes = findProduct('culottes');
  const sneaker = findProduct('sneaker');
  const tote = findProduct('tote');

  // ─── Cart Items ───
  await prisma.cartItem.createMany({
    data: [
      { userId: buyer1.id, productId: airpodsPro.id, quantity: 1 },
      { userId: buyer1.id, productId: polo.id, quantity: 2 },
      { userId: buyer2.id, productId: dam.id, quantity: 1 },
      { userId: buyer2.id, productId: somiNu.id, quantity: 1 },
      { userId: buyer3.id, productId: sonyXm5.id, quantity: 1 },
      { userId: buyer3.id, productId: anker.id, quantity: 2 },
    ],
  });
  console.log('✅ Cart Items created');

  const buyers = [buyer1, buyer2, buyer3];
  const addresses = [
    '123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    '789 Phố Hàng Đào, Phường Hàng Bạc, Quận Hoàn Kiếm, Hà Nội',
    '321 Đường Bạch Đằng, Phường Thạch Thang, Quận Hải Châu, Đà Nẵng',
  ];

  // ─── Orders (10 đơn hàng) ───

  // Order 1: buyer1 — iPhone 15 Pro + AirPods Pro (delivered, tháng 2)
  const order1 = await prisma.order.create({
    data: {
      buyerId: buyer1.id, totalAmount: iphone15pro.price + airpodsPro.price, status: 'delivered',
      shippingAddress: addresses[0], createdAt: new Date('2026-02-10T10:00:00Z'),
      items: { create: [
        { productId: iphone15pro.id, quantity: 1, priceAtPurchase: iphone15pro.price },
        { productId: airpodsPro.id, quantity: 1, priceAtPurchase: airpodsPro.price },
      ]},
    },
  });

  // Order 2: buyer1 — MacBook Pro (shipped, đầu tháng 4)
  const order2 = await prisma.order.create({
    data: {
      buyerId: buyer1.id, totalAmount: macbookPro.price, status: 'shipped',
      shippingAddress: addresses[0], createdAt: new Date('2026-04-05T14:30:00Z'),
      items: { create: [{ productId: macbookPro.id, quantity: 1, priceAtPurchase: macbookPro.price }] },
    },
  });

  // Order 3: buyer1 — Samsung S24 Ultra (processing, mới đặt — có thể huỷ)
  const order3 = await prisma.order.create({
    data: {
      buyerId: buyer1.id, totalAmount: samsungS24.price, status: 'processing',
      shippingAddress: addresses[0], createdAt: new Date('2026-04-22T09:00:00Z'),
      items: { create: [{ productId: samsungS24.id, quantity: 1, priceAtPurchase: samsungS24.price }] },
    },
  });

  // Order 4: buyer2 — Polo x3 + Jeans + Bomber (delivered, tháng 3)
  const order4 = await prisma.order.create({
    data: {
      buyerId: buyer2.id, totalAmount: polo.price * 3 + jeans.price + bomber.price, status: 'delivered',
      shippingAddress: addresses[1], createdAt: new Date('2026-03-15T08:00:00Z'),
      items: { create: [
        { productId: polo.id, quantity: 3, priceAtPurchase: polo.price },
        { productId: jeans.id, quantity: 1, priceAtPurchase: jeans.price },
        { productId: bomber.id, quantity: 1, priceAtPurchase: bomber.price },
      ]},
    },
  });

  // Order 5: buyer2 — Đầm + Dell XPS (cancelled, đầu tháng 4)
  const order5 = await prisma.order.create({
    data: {
      buyerId: buyer2.id, totalAmount: dam.price + dellXps.price, status: 'cancelled',
      shippingAddress: addresses[1], createdAt: new Date('2026-04-01T16:00:00Z'),
      items: { create: [
        { productId: dam.id, quantity: 1, priceAtPurchase: dam.price },
        { productId: dellXps.id, quantity: 1, priceAtPurchase: dellXps.price },
      ]},
    },
  });

  // Order 6: buyer2 — iPhone 15 (pending, mới đặt — có thể huỷ)
  const order6 = await prisma.order.create({
    data: {
      buyerId: buyer2.id, totalAmount: iphone15.price, status: 'pending',
      shippingAddress: addresses[1], createdAt: new Date('2026-04-23T11:00:00Z'),
      items: { create: [{ productId: iphone15.id, quantity: 1, priceAtPurchase: iphone15.price }] },
    },
  });

  // Order 7: buyer3 — ROG G14 + MX Master + Sony XM5 (delivered, tháng 3)
  const order7 = await prisma.order.create({
    data: {
      buyerId: buyer3.id, totalAmount: rogG14.price + mxMaster.price + sonyXm5.price, status: 'delivered',
      shippingAddress: addresses[2], createdAt: new Date('2026-03-20T12:00:00Z'),
      items: { create: [
        { productId: rogG14.id, quantity: 1, priceAtPurchase: rogG14.price },
        { productId: mxMaster.id, quantity: 1, priceAtPurchase: mxMaster.price },
        { productId: sonyXm5.id, quantity: 1, priceAtPurchase: sonyXm5.price },
      ]},
    },
  });

  // Order 8: buyer3 — Xiaomi 14 + Anker (shipped, giữa tháng 4)
  const order8 = await prisma.order.create({
    data: {
      buyerId: buyer3.id, totalAmount: xiaomi14.price + anker.price, status: 'shipped',
      shippingAddress: addresses[2], createdAt: new Date('2026-04-12T10:00:00Z'),
      items: { create: [
        { productId: xiaomi14.id, quantity: 1, priceAtPurchase: xiaomi14.price },
        { productId: anker.id, quantity: 1, priceAtPurchase: anker.price },
      ]},
    },
  });

  // Order 9: buyer3 — MacBook Air 15 (processing, mới đặt — có thể huỷ)
  const order9 = await prisma.order.create({
    data: {
      buyerId: buyer3.id, totalAmount: macbookAir15.price, status: 'processing',
      shippingAddress: addresses[2], createdAt: new Date('2026-04-21T15:00:00Z'),
      items: { create: [{ productId: macbookAir15.id, quantity: 1, priceAtPurchase: macbookAir15.price }] },
    },
  });

  // Order 10: buyer1 — Sneaker + Hoodie + Culottes cho vợ (pending, mới đặt — có thể huỷ)
  const order10 = await prisma.order.create({
    data: {
      buyerId: buyer1.id, totalAmount: sneaker.price + hoodie.price + culottes.price, status: 'pending',
      shippingAddress: addresses[0], createdAt: new Date('2026-04-24T08:00:00Z'),
      items: { create: [
        { productId: sneaker.id, quantity: 1, priceAtPurchase: sneaker.price },
        { productId: hoodie.id, quantity: 1, priceAtPurchase: hoodie.price },
        { productId: culottes.id, quantity: 1, priceAtPurchase: culottes.price },
      ]},
    },
  });

  console.log('✅ Orders created (10)');

  // ─── Order Cancellation ───
  await prisma.orderCancellation.create({
    data: { orderId: order5.id, reason: 'Tìm được nơi bán giá tốt hơn', cancelledAt: new Date('2026-04-02T10:00:00Z') },
  });
  console.log('✅ Order Cancellations created');

  // ─── Reviews ───
  await prisma.review.createMany({
    data: [
      // Điện thoại
      { productId: iphone15pro.id, userId: buyer1.id, rating: 5, comment: 'Máy đẹp, chạy mượt, camera chụp rất đẹp. Giao hàng nhanh!' },
      { productId: iphone15pro.id, userId: buyer2.id, rating: 4, comment: 'Sản phẩm tốt nhưng giá hơi cao so với thị trường.' },
      { productId: iphone15pro.id, userId: buyer3.id, rating: 5, comment: 'Dùng 2 tháng rồi, rất hài lòng. Pin cải thiện nhiều so với đời trước.' },
      { productId: samsungS24.id, userId: buyer2.id, rating: 4, comment: 'Màn hình đẹp, S-Pen tiện lợi. Camera zoom 100x ấn tượng.' },
      { productId: samsungS24.id, userId: buyer3.id, rating: 5, comment: 'Galaxy AI rất hay, dịch real-time khi gọi điện quá tiện.' },
      { productId: xiaomi14.id, userId: buyer3.id, rating: 4, comment: 'Camera Leica chụp đẹp, giá tốt hơn iPhone nhiều.' },
      { productId: pixel8.id, userId: buyer1.id, rating: 5, comment: 'Camera AI xử lý ảnh quá đỉnh, Magic Eraser xoá vật thể cực nhanh.' },
      { productId: samsungA55.id, userId: buyer2.id, rating: 4, comment: 'Tầm giá 9 triệu thì quá ngon, chống nước IP67 nữa.' },
      // Laptop
      { productId: macbookPro.id, userId: buyer1.id, rating: 5, comment: 'Hiệu năng M3 Pro quá mạnh, build chất lượng cao.' },
      { productId: macbookPro.id, userId: buyer3.id, rating: 5, comment: 'Compile code nhanh gấp đôi con Intel cũ, pin dùng cả ngày.' },
      { productId: dellXps.id, userId: buyer1.id, rating: 4, comment: 'Màn OLED rất đẹp, nhưng máy hơi nóng khi chạy nặng.' },
      { productId: rogG14.id, userId: buyer3.id, rating: 5, comment: 'Chơi game mượt, màn OLED 120Hz quá đã. Quạt hơi ồn khi full load.' },
      { productId: macbookAir15.id, userId: buyer2.id, rating: 4, comment: 'Màn hình lớn, không quạt nên rất yên tĩnh. Hơi nặng so với Air 13.' },
      // Phụ kiện
      { productId: airpodsPro.id, userId: buyer1.id, rating: 5, comment: 'Chống ồn tốt, âm thanh trong trẻo, pin trâu.' },
      { productId: airpodsPro.id, userId: buyer3.id, rating: 4, comment: 'ANC tốt nhưng đeo lâu hơi đau tai.' },
      { productId: sonyXm5.id, userId: buyer3.id, rating: 5, comment: 'Chống ồn số 1, đeo cả ngày không mỏi, âm bass sâu.' },
      { productId: sonyXm5.id, userId: buyer1.id, rating: 5, comment: 'Dùng để làm việc ở quán cafe, chống ồn cực kỳ hiệu quả.' },
      { productId: mxMaster.id, userId: buyer3.id, rating: 5, comment: 'Chuột tốt nhất từng dùng, scroll mượt, kết nối 3 máy tiện lợi.' },
      { productId: anker.id, userId: buyer1.id, rating: 5, comment: 'Nhỏ gọn mà 20000mAh, sạc nhanh iPhone rất tiện.' },
      { productId: anker.id, userId: buyer3.id, rating: 4, comment: 'Pin trâu, sạc nhanh, nhưng hơi nặng so với mong đợi.' },
      // Thời trang nam
      { productId: polo.id, userId: buyer2.id, rating: 4, comment: 'Chất vải mềm, mặc thoải mái. Sẽ mua thêm màu khác.' },
      { productId: polo.id, userId: buyer1.id, rating: 5, comment: 'Áo đẹp, giá rẻ, giao hàng nhanh. 10 điểm!' },
      { productId: jeans.id, userId: buyer2.id, rating: 3, comment: 'Form hơi rộng so với size chart, nhưng chất vải ổn.' },
      { productId: bomber.id, userId: buyer2.id, rating: 4, comment: 'Áo nhẹ, chống nước tốt, mặc mùa thu vừa đẹp.' },
      { productId: hoodie.id, userId: buyer1.id, rating: 5, comment: 'Vải dày dặn, ấm, form oversize mặc rất thoải mái.' },
      { productId: sneaker.id, userId: buyer3.id, rating: 4, comment: 'Giày đẹp, đi êm chân, nhưng hơi trơn khi trời mưa.' },
      // Thời trang nữ
      { productId: dam.id, userId: buyer2.id, rating: 5, comment: 'Đầm đẹp lắm, đúng hình, chất voan mát. Rất hài lòng!' },
      { productId: somiNu.id, userId: buyer2.id, rating: 4, comment: 'Lụa mềm mịn, mặc đi làm rất sang. Hơi dễ nhăn.' },
      { productId: culottes.id, userId: buyer2.id, rating: 4, comment: 'Vải linen mát, dáng ống rộng thoải mái, cạp chun tiện.' },
      { productId: tote.id, userId: buyer2.id, rating: 3, comment: 'Túi đẹp nhưng da PU hơi cứng, cần dùng một thời gian mới mềm.' },
    ],
  });
  console.log('✅ Reviews created (30)');

  // ─── Summary ───
  console.log('\n🎉 Seed completed!');
  console.log('─────────────────────────────────────');
  console.log('API Keys for testing:');
  console.log('  Admin:   admin-api-key-demo-retail-2026');
  console.log('  Seller1: seller1-api-key-demo-retail-2026');
  console.log('  Seller2: seller2-api-key-demo-retail-2026');
  console.log('  Buyer1:  buyer1-api-key-demo-retail-2026');
  console.log('  Buyer2:  buyer2-api-key-demo-retail-2026');
  console.log('  Buyer3:  buyer3-api-key-demo-retail-2026');
  console.log('─────────────────────────────────────');
  console.log(`Users: 6 | Products: ${allProducts.length} | Orders: 10 | Reviews: 30`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

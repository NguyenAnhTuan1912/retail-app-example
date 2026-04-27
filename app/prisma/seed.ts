import 'dotenv/config';
import * as path from 'path';

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const S3_BUCKET_NAME = 'tuann-public-test-bucket';
const S3_ROOT_PREFIX = 'demo-retail-app';
const S3_REGION = 'ap-southeast-1';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ─── Product catalog data ───
export const productCatalog: Record<
  string,
  {
    name: string;
    desc: string;
    price: number;
    stock: number;
    images: string[];
  }[]
> = {
  phones: [
    {
      name: 'iPhone 15 Pro Max 256GB',
      desc: 'Chip A17 Pro, camera 48MP, màn hình 6.7" Super Retina XDR.',
      price: 29990000,
      stock: 50,
      images: [
        'iphone_15_pro_max_256gb/1.jpg',
        'iphone_15_pro_max_256gb/2.jpg',
        'iphone_15_pro_max_256gb/3.jpg',
      ],
    },
    {
      name: 'iPhone 15 128GB',
      desc: 'Chip A16 Bionic, Dynamic Island, camera 48MP, USB-C.',
      price: 19990000,
      stock: 80,
      images: [
        'iphone_15_128gb/1.jpg',
        'iphone_15_128gb/2.jpg',
        'iphone_15_128gb/3.jpg',
      ],
    },
    {
      name: 'Samsung Galaxy S24 Ultra',
      desc: 'Snapdragon 8 Gen 3, camera 200MP, S-Pen tích hợp.',
      price: 27990000,
      stock: 35,
      images: [
        'samsung_galaxy_s24_ultra/1.jpg',
        'samsung_galaxy_s24_ultra/2.jpg',
      ],
    },
    {
      name: 'Samsung Galaxy A55 5G',
      desc: 'Exynos 1480, camera 50MP OIS, pin 5000mAh, chống nước IP67.',
      price: 9490000,
      stock: 120,
      images: ['samsung_galaxy_a55_5g/1.jpg', 'samsung_galaxy_a55_5g/2.jpg'],
    },
    {
      name: 'Samsung Galaxy Z Flip5',
      desc: 'Snapdragon 8 Gen 2, màn hình gập, Flex Window 3.4".',
      price: 22990000,
      stock: 25,
      images: ['samsung_galaxy_z_flip5/1.jpg'],
    },
    {
      name: 'Xiaomi 14 Ultra',
      desc: 'Camera Leica 50MP, Snapdragon 8 Gen 3, sạc nhanh 90W.',
      price: 19990000,
      stock: 40,
      images: ['xiaomi_14_ultra/1.jpg', 'xiaomi_14_ultra/2.jpg'],
    },
    {
      name: 'Xiaomi Redmi Note 13 Pro+',
      desc: 'Dimensity 7200, camera 200MP, sạc 120W, màn AMOLED 120Hz.',
      price: 7990000,
      stock: 150,
      images: ['xiaomi_redmi_note_13_pro_plus/1.jpg'],
    },
    {
      name: 'Google Pixel 8 Pro',
      desc: 'Tensor G3, camera AI, 7 năm cập nhật Android.',
      price: 22490000,
      stock: 25,
      images: ['google_pixel_8_pro/1.jpg', 'google_pixel_8_pro/2.jpg'],
    },
    {
      name: 'OPPO Find X7 Ultra',
      desc: 'Camera Hasselblad, Snapdragon 8 Gen 3, pin 5400mAh.',
      price: 24990000,
      stock: 20,
      images: ['oppo_find_x7_ultra/1.jpg', 'oppo_find_x7_ultra/2.jpg'],
    },
    {
      name: 'OPPO Reno 11 5G',
      desc: 'Dimensity 7050, camera 50MP, sạc 67W, thiết kế mỏng nhẹ.',
      price: 8990000,
      stock: 100,
      images: ['oppo_reno_11_5g/1.jpg'],
    },
    {
      name: 'Vivo X100 Pro',
      desc: 'Dimensity 9300, camera ZEISS 50MP, pin 5400mAh.',
      price: 21990000,
      stock: 30,
      images: ['vivo_x100_pro/1.jpg'],
    },
    {
      name: 'Realme GT5 Pro',
      desc: 'Snapdragon 8 Gen 3, camera Sony IMX890, sạc 100W.',
      price: 12990000,
      stock: 45,
      images: ['realme_gt5_pro/1.jpg'],
    },
  ],
  laptops: [
    {
      name: 'MacBook Pro 14" M3 Pro',
      desc: '18GB RAM, 512GB SSD, màn hình Liquid Retina XDR.',
      price: 49990000,
      stock: 20,
      images: [
        'macbook_pro_14_m3_pro/1.jpg',
        'macbook_pro_14_m3_pro/2.jpg',
        'macbook_pro_14_m3_pro/3.jpg',
      ],
    },
    {
      name: 'MacBook Air 15" M3',
      desc: '16GB RAM, 512GB SSD, fanless, pin 18 giờ.',
      price: 37990000,
      stock: 30,
      images: [
        'macbook_air_15_m3/1.jpg',
        'macbook_air_15_m3/2.jpg',
        'macbook_air_15_m3/3.jpg',
      ],
    },
    {
      name: 'MacBook Air 13" M2',
      desc: '8GB RAM, 256GB SSD, thiết kế mỏng nhẹ, MagSafe.',
      price: 24990000,
      stock: 45,
      images: [
        'macbook_air_13_m2/1.jpg',
        'macbook_air_13_m2/2.jpg',
        'macbook_air_13_m2/3.jpg',
      ],
    },
    {
      name: 'Dell XPS 15 9530',
      desc: 'Core i7-13700H, 16GB RAM, 512GB SSD, màn OLED 3.5K.',
      price: 39990000,
      stock: 15,
      images: ['dell_xps_15_9530/1.png'],
    },
    {
      name: 'Dell Inspiron 16 5630',
      desc: 'Core i5-1340P, 16GB RAM, 512GB SSD, màn 16" FHD+.',
      price: 18990000,
      stock: 40,
      images: ['dell_inspiron_16_5630/1.jpg'],
    },
    {
      name: 'ASUS ROG Zephyrus G14 2024',
      desc: 'Ryzen 9 8945HS, RTX 4060, 16GB RAM, OLED 2.8K 120Hz.',
      price: 42990000,
      stock: 10,
      images: ['asus_rog_zephyrus_g14_2024/1.jpg'],
    },
    {
      name: 'ASUS Vivobook 15 OLED',
      desc: 'Ryzen 7 7730U, 16GB RAM, 512GB SSD, màn OLED FHD.',
      price: 16990000,
      stock: 55,
      images: ['asus_vivobook_15_oled/1.jpg'],
    },
    {
      name: 'Lenovo ThinkPad X1 Carbon Gen 11',
      desc: 'Core i7-1365U, 16GB RAM, 512GB SSD, 1.12kg.',
      price: 35990000,
      stock: 18,
      images: ['lenovo_thinkpad_x1_carbon_gen_11/1.jpg'],
    },
    {
      name: 'Lenovo IdeaPad Slim 5',
      desc: 'Ryzen 5 7530U, 16GB RAM, 512GB SSD, pin 12 giờ.',
      price: 14990000,
      stock: 60,
      images: ['lenovo_ideapad_slim_5/1.jpg'],
    },
    {
      name: 'HP Spectre x360 14',
      desc: 'Core Ultra 7, 16GB RAM, 1TB SSD, màn OLED 2.8K touch.',
      price: 44990000,
      stock: 12,
      images: ['hp_spectre_x360_14/1.jpg'],
    },
  ],
  accessories: [
    {
      name: 'AirPods Pro 2 USB-C',
      desc: 'Chống ồn chủ động, âm thanh không gian, chip H2.',
      price: 5990000,
      stock: 100,
      images: ['airpods_pro_2_usbc/1.jpg'],
    },
    {
      name: 'AirPods 4',
      desc: 'Chip H2, âm thanh không gian, thiết kế open-ear thoải mái.',
      price: 3490000,
      stock: 120,
      images: ['airpods_4/1.jpg', 'airpods_4/2.jpg'],
    },
    {
      name: 'Samsung Galaxy Buds3 Pro',
      desc: 'ANC thông minh, codec SSC, pin 7 giờ, chống nước IPX7.',
      price: 4990000,
      stock: 80,
      images: ['samsung_galaxy_buds3_pro/1.jpg'],
    },
    {
      name: 'Samsung Galaxy Watch 6 Classic',
      desc: '47mm, vòng bezel xoay, đo huyết áp, GPS.',
      price: 8490000,
      stock: 60,
      images: ['samsung_galaxy_watch_6_classic/1.jpg'],
    },
    {
      name: 'Apple Watch Series 9 GPS',
      desc: 'Chip S9, Double Tap, màn hình always-on, đo SpO2.',
      price: 10990000,
      stock: 40,
      images: [
        'apple_watch_series_9_gps/1.jpg',
        'apple_watch_series_9_gps/2.jpg',
      ],
    },
    {
      name: 'Anker PowerBank 20000mAh',
      desc: 'Sạc nhanh 22.5W, 2 cổng USB-C, nhỏ gọn.',
      price: 790000,
      stock: 200,
      images: ['anker_powerbank_20000mah/1.jpg'],
    },
    {
      name: 'Baseus Sạc nhanh GaN 65W',
      desc: 'Sạc GaN 3 cổng, PD 65W, tương thích laptop + điện thoại.',
      price: 590000,
      stock: 180,
      images: ['baseus_sac_nhanh_gan_65w/1.jpg'],
    },
    {
      name: 'Logitech MX Master 3S',
      desc: 'Chuột không dây, cảm biến 8000 DPI, sạc USB-C, kết nối 3 thiết bị.',
      price: 2490000,
      stock: 70,
      images: ['logitech_mx_master_3s/1.jpg'],
    },
    {
      name: 'Keychron K8 Pro',
      desc: 'Bàn phím cơ không dây, hot-swap, Gateron G Pro, RGB.',
      price: 2290000,
      stock: 50,
      images: ['keychron_k8_pro/1.jpg', 'keychron_k8_pro/2.jpg'],
    },
    {
      name: 'Sony WH-1000XM5',
      desc: 'Tai nghe over-ear, chống ồn hàng đầu, pin 30 giờ, LDAC.',
      price: 7490000,
      stock: 35,
      images: ['sony_wh1000xm5/1.jpg'],
    },
  ],
  menFashion: [
    {
      name: 'Áo thun nam Polo Classic',
      desc: 'Cotton 100%, form regular fit, nhiều màu sắc.',
      price: 299000,
      stock: 200,
      images: [
        'ao_thun_nam_polo_classic/1.jpg',
        'ao_thun_nam_polo_classic/2.jpg',
      ],
    },
    {
      name: 'Áo sơ mi nam Oxford dài tay',
      desc: 'Vải Oxford dày dặn, form slim fit, cổ button-down.',
      price: 450000,
      stock: 120,
      images: [
        'ao_so_mi_nam_oxford_dai_tay/1.jpg',
        'ao_so_mi_nam_oxford_dai_tay/2.jpg',
      ],
    },
    {
      name: 'Quần jeans nam Slim Fit',
      desc: 'Denim co giãn, wash nhẹ, dáng slim fit.',
      price: 450000,
      stock: 150,
      images: [
        'quan_jeans_nam_slim_fit/1.jpg',
        'quan_jeans_nam_slim_fit/2.jpg',
      ],
    },
    {
      name: 'Quần kaki nam chinos',
      desc: 'Vải kaki mềm, form slim, phù hợp công sở lẫn casual.',
      price: 380000,
      stock: 130,
      images: ['quan_kaki_nam_chinos/1.jpg'],
    },
    {
      name: 'Áo khoác bomber nam',
      desc: 'Chất dù chống nước nhẹ, lót lưới thoáng mát.',
      price: 650000,
      stock: 70,
      images: ['ao_khoac_bomber_nam/1.jpg', 'ao_khoac_bomber_nam/2.jpg'],
    },
    {
      name: 'Áo hoodie nam oversize',
      desc: 'Cotton fleece 350gsm, form oversize, mũ trùm 2 lớp.',
      price: 420000,
      stock: 90,
      images: ['ao_hoodie_nam_oversize/1.jpg'],
    },
    {
      name: 'Quần short nam thể thao',
      desc: 'Vải gió nhẹ, có lót trong, túi khoá kéo, co giãn 4 chiều.',
      price: 250000,
      stock: 160,
      images: ['quan_short_nam_the_thao/1.jpg'],
    },
    {
      name: 'Giày sneaker nam trắng basic',
      desc: 'Da tổng hợp, đế cao su, phong cách minimalist.',
      price: 890000,
      stock: 80,
      images: [
        'giay_sneaker_nam_trang_basic/1.jpg',
        'giay_sneaker_nam_trang_basic/2.jpg',
      ],
    },
  ],
  womenFashion: [
    {
      name: 'Đầm nữ hoa nhí vintage',
      desc: 'Voan mềm mại, dáng xòe, họa tiết hoa nhí retro.',
      price: 389000,
      stock: 80,
      images: ['dam_nu_hoa_nhi_vintage/1.jpg', 'dam_nu_hoa_nhi_vintage/2.jpg'],
    },
    {
      name: 'Áo sơ mi nữ lụa cao cấp',
      desc: 'Lụa satin, form rộng thanh lịch, phù hợp công sở.',
      price: 520000,
      stock: 90,
      images: ['ao_so_mi_nu_lua_cao_cap/1.jpg'],
    },
    {
      name: 'Chân váy midi xếp ly',
      desc: 'Vải chiffon, xếp ly nhỏ, dáng midi thanh lịch.',
      price: 350000,
      stock: 100,
      images: ['chan_vay_midi_xep_ly/1.jpg'],
    },
    {
      name: 'Áo croptop nữ basic',
      desc: 'Cotton co giãn, form ôm, nhiều màu, phối đồ dễ dàng.',
      price: 180000,
      stock: 200,
      images: ['ao_croptop_nu_basic/1.jpg'],
    },
    {
      name: 'Quần culottes nữ ống rộng',
      desc: 'Vải linen thoáng mát, cạp chun, dáng ống rộng.',
      price: 320000,
      stock: 110,
      images: ['quan_culottes_nu_ong_rong/1.jpg'],
    },
    {
      name: 'Túi xách nữ tote da PU',
      desc: 'Da PU cao cấp, ngăn laptop 13", quai vai chắc chắn.',
      price: 590000,
      stock: 60,
      images: ['tui_xach_nu_tote_da_pu/1.jpg', 'tui_xach_nu_tote_da_pu/2.jpg'],
    },
    {
      name: 'Giày cao gót nữ mũi nhọn',
      desc: 'Da bóng, gót vuông 7cm, đệm êm, phù hợp công sở.',
      price: 680000,
      stock: 50,
      images: [
        'giay_cao_got_nu_mui_nhon/1.jpg',
        'giay_cao_got_nu_mui_nhon/2.jpg',
      ],
    },
    {
      name: 'Bộ đồ ngủ nữ lụa satin',
      desc: 'Lụa satin mềm mịn, set áo cộc + quần dài, nhiều màu pastel.',
      price: 350000,
      stock: 140,
      images: ['bo_do_ngu_nu_lua_satin/1.jpg'],
    },
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
    data: {
      username: 'admin',
      email: 'admin@retailapp.com',
      passwordHash:
        '$2a$12$e3io3RB9fNd/r4kx.xGuU./2UcymrMNHDQKg1wtR1wXwC5FeMIzTu',
      fullName: 'Admin User',
      phoneNumber: '0900000001',
      role: 'admin',
    },
  });
  const seller1 = await prisma.user.create({
    data: {
      username: 'techshop',
      email: 'techshop@retailapp.com',
      passwordHash:
        '$2a$12$e3io3RB9fNd/r4kx.xGuU./2UcymrMNHDQKg1wtR1wXwC5FeMIzTu',
      fullName: 'Tech Shop Official',
      phoneNumber: '0900000002',
      role: 'seller',
    },
  });
  const seller2 = await prisma.user.create({
    data: {
      username: 'fashionstore',
      email: 'fashion@retailapp.com',
      passwordHash:
        '$2a$12$e3io3RB9fNd/r4kx.xGuU./2UcymrMNHDQKg1wtR1wXwC5FeMIzTu',
      fullName: 'Fashion Store VN',
      phoneNumber: '0900000003',
      role: 'seller',
    },
  });
  const buyer1 = await prisma.user.create({
    data: {
      username: 'nguyenvana',
      email: 'vana@gmail.com',
      passwordHash:
        '$2a$12$e3io3RB9fNd/r4kx.xGuU./2UcymrMNHDQKg1wtR1wXwC5FeMIzTu',
      fullName: 'Nguyễn Văn A',
      phoneNumber: '0912345678',
      role: 'buyer',
    },
  });
  const buyer2 = await prisma.user.create({
    data: {
      username: 'tranthib',
      email: 'thib@gmail.com',
      passwordHash:
        '$2a$12$e3io3RB9fNd/r4kx.xGuU./2UcymrMNHDQKg1wtR1wXwC5FeMIzTu',
      fullName: 'Trần Thị B',
      phoneNumber: '0987654321',
      role: 'buyer',
    },
  });
  const buyer3 = await prisma.user.create({
    data: {
      username: 'levanc',
      email: 'vanc@gmail.com',
      passwordHash:
        '$2a$12$e3io3RB9fNd/r4kx.xGuU./2UcymrMNHDQKg1wtR1wXwC5FeMIzTu',
      fullName: 'Lê Văn C',
      phoneNumber: '0976543210',
      role: 'buyer',
    },
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
      {
        userId: buyer1.id,
        recipientName: 'Nguyễn Văn A',
        phoneNumber: '0912345678',
        province: 'TP. Hồ Chí Minh',
        district: 'Quận 1',
        ward: 'Phường Bến Nghé',
        detailAddress: '123 Đường Lê Lợi',
        isDefault: true,
      },
      {
        userId: buyer1.id,
        recipientName: 'Nguyễn Văn A',
        phoneNumber: '0912345678',
        province: 'TP. Hồ Chí Minh',
        district: 'Quận 7',
        ward: 'Phường Tân Phong',
        detailAddress: '456 Đường Nguyễn Thị Thập',
        isDefault: false,
      },
      {
        userId: buyer2.id,
        recipientName: 'Trần Thị B',
        phoneNumber: '0987654321',
        province: 'Hà Nội',
        district: 'Quận Hoàn Kiếm',
        ward: 'Phường Hàng Bạc',
        detailAddress: '789 Phố Hàng Đào',
        isDefault: true,
      },
      {
        userId: buyer3.id,
        recipientName: 'Lê Văn C',
        phoneNumber: '0976543210',
        province: 'Đà Nẵng',
        district: 'Quận Hải Châu',
        ward: 'Phường Thạch Thang',
        detailAddress: '321 Đường Bạch Đằng',
        isDefault: true,
      },
    ],
  });
  console.log('✅ Addresses created');

  // ─── Categories ───
  const catElectronics = await prisma.category.create({
    data: { name: 'Điện tử', slug: 'dien-tu' },
  });
  const catPhones = await prisma.category.create({
    data: {
      name: 'Điện thoại',
      slug: 'dien-thoai',
      parentId: catElectronics.id,
    },
  });
  const catLaptops = await prisma.category.create({
    data: { name: 'Laptop', slug: 'laptop', parentId: catElectronics.id },
  });
  const catAccessories = await prisma.category.create({
    data: { name: 'Phụ kiện', slug: 'phu-kien', parentId: catElectronics.id },
  });
  const catFashion = await prisma.category.create({
    data: { name: 'Thời trang', slug: 'thoi-trang' },
  });
  const catMenFashion = await prisma.category.create({
    data: {
      name: 'Thời trang nam',
      slug: 'thoi-trang-nam',
      parentId: catFashion.id,
    },
  });
  const catWomenFashion = await prisma.category.create({
    data: {
      name: 'Thời trang nữ',
      slug: 'thoi-trang-nu',
      parentId: catFashion.id,
    },
  });
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
  const s3BaseURL = `https://${S3_BUCKET_NAME}.s3.${S3_REGION}.amazonaws.com`;
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
          images: {
            create: item.images.map((url, i) => ({
              url: new URL(path.join(S3_ROOT_PREFIX, url), s3BaseURL).toString(),
              // url: path.join(s3BaseURL, S3_ROOT_PREFIX, url),
              isMain: i === 0,
            })),
          },
        },
      });
      allProducts.push({ id: p.id, name: p.name, price: item.price });
    }
  }
  console.log(`✅ Products created (${allProducts.length})`);

  // Helper: lấy product theo tên (partial match)
  const findProduct = (keyword: string) =>
    allProducts.find((p) => p.name.includes(keyword))!;

  const iphone15pro = findProduct('iPhone 15 Pro');
  const iphone15 = findProduct('iPhone 15 128');
  const samsungS24 = findProduct('S24 Ultra');
  const samsungA55 = findProduct('A55');
  const samsungZFlip = findProduct('Z Flip5');
  const xiaomi14 = findProduct('Xiaomi 14 Ultra');
  const redmiNote13 = findProduct('Redmi Note 13');
  const pixel8 = findProduct('Pixel 8');
  const oppoFindX7 = findProduct('Find X7');
  const oppoReno11 = findProduct('Reno 11');
  const vivoX100 = findProduct('Vivo X100');
  const realmeGT5 = findProduct('Realme GT5');
  const macbookPro = findProduct('MacBook Pro');
  const macbookAir15 = findProduct('MacBook Air 15');
  const macbookAir13 = findProduct('MacBook Air 13');
  const dellXps = findProduct('Dell XPS');
  const dellInspiron = findProduct('Dell Inspiron');
  const rogG14 = findProduct('ROG Zephyrus');
  const vivobook = findProduct('Vivobook');
  const thinkpadX1 = findProduct('ThinkPad X1');
  const ideapad = findProduct('IdeaPad');
  const hpSpectre = findProduct('Spectre x360');
  const airpodsPro = findProduct('AirPods Pro');
  const airpods4 = findProduct('AirPods 4');
  const galaxyBuds = findProduct('Buds3 Pro');
  const galaxyWatch = findProduct('Watch 6 Classic');
  const appleWatch = findProduct('Watch Series 9');
  const anker = findProduct('Anker');
  const baseus = findProduct('Baseus');
  const mxMaster = findProduct('MX Master');
  const keychron = findProduct('Keychron');
  const sonyXm5 = findProduct('WH-1000XM5');
  const polo = findProduct('Polo');
  const somiNam = findProduct('sơ mi nam');
  const jeans = findProduct('jeans nam');
  const kaki = findProduct('kaki nam');
  const bomber = findProduct('bomber');
  const hoodie = findProduct('hoodie');
  const shortNam = findProduct('short nam');
  const sneaker = findProduct('sneaker');
  const dam = findProduct('Đầm nữ');
  const somiNu = findProduct('sơ mi nữ');
  const chanVay = findProduct('váy midi');
  const croptop = findProduct('croptop');
  const culottes = findProduct('culottes');
  const tote = findProduct('tote');
  const caoGot = findProduct('cao gót');
  const doNgu = findProduct('đồ ngủ');

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
      buyerId: buyer1.id,
      totalAmount: iphone15pro.price + airpodsPro.price,
      status: 'delivered',
      shippingAddress: addresses[0],
      createdAt: new Date('2026-02-10T10:00:00Z'),
      items: {
        create: [
          {
            productId: iphone15pro.id,
            quantity: 1,
            priceAtPurchase: iphone15pro.price,
          },
          {
            productId: airpodsPro.id,
            quantity: 1,
            priceAtPurchase: airpodsPro.price,
          },
        ],
      },
    },
  });

  // Order 2: buyer1 — MacBook Pro (shipped, đầu tháng 4)
  const order2 = await prisma.order.create({
    data: {
      buyerId: buyer1.id,
      totalAmount: macbookPro.price,
      status: 'shipped',
      shippingAddress: addresses[0],
      createdAt: new Date('2026-04-05T14:30:00Z'),
      items: {
        create: [
          {
            productId: macbookPro.id,
            quantity: 1,
            priceAtPurchase: macbookPro.price,
          },
        ],
      },
    },
  });

  // Order 3: buyer1 — Samsung S24 Ultra (processing, mới đặt — có thể huỷ)
  const order3 = await prisma.order.create({
    data: {
      buyerId: buyer1.id,
      totalAmount: samsungS24.price,
      status: 'processing',
      shippingAddress: addresses[0],
      createdAt: new Date('2026-04-22T09:00:00Z'),
      items: {
        create: [
          {
            productId: samsungS24.id,
            quantity: 1,
            priceAtPurchase: samsungS24.price,
          },
        ],
      },
    },
  });

  // Order 4: buyer2 — Polo x3 + Jeans + Bomber (delivered, tháng 3)
  const order4 = await prisma.order.create({
    data: {
      buyerId: buyer2.id,
      totalAmount: polo.price * 3 + jeans.price + bomber.price,
      status: 'delivered',
      shippingAddress: addresses[1],
      createdAt: new Date('2026-03-15T08:00:00Z'),
      items: {
        create: [
          { productId: polo.id, quantity: 3, priceAtPurchase: polo.price },
          { productId: jeans.id, quantity: 1, priceAtPurchase: jeans.price },
          { productId: bomber.id, quantity: 1, priceAtPurchase: bomber.price },
        ],
      },
    },
  });

  // Order 5: buyer2 — Đầm + Dell XPS (cancelled, đầu tháng 4)
  const order5 = await prisma.order.create({
    data: {
      buyerId: buyer2.id,
      totalAmount: dam.price + dellXps.price,
      status: 'cancelled',
      shippingAddress: addresses[1],
      createdAt: new Date('2026-04-01T16:00:00Z'),
      items: {
        create: [
          { productId: dam.id, quantity: 1, priceAtPurchase: dam.price },
          {
            productId: dellXps.id,
            quantity: 1,
            priceAtPurchase: dellXps.price,
          },
        ],
      },
    },
  });

  // Order 6: buyer2 — iPhone 15 (pending, mới đặt — có thể huỷ)
  const order6 = await prisma.order.create({
    data: {
      buyerId: buyer2.id,
      totalAmount: iphone15.price,
      status: 'pending',
      shippingAddress: addresses[1],
      createdAt: new Date('2026-04-23T11:00:00Z'),
      items: {
        create: [
          {
            productId: iphone15.id,
            quantity: 1,
            priceAtPurchase: iphone15.price,
          },
        ],
      },
    },
  });

  // Order 7: buyer3 — ROG G14 + MX Master + Sony XM5 (delivered, tháng 3)
  const order7 = await prisma.order.create({
    data: {
      buyerId: buyer3.id,
      totalAmount: rogG14.price + mxMaster.price + sonyXm5.price,
      status: 'delivered',
      shippingAddress: addresses[2],
      createdAt: new Date('2026-03-20T12:00:00Z'),
      items: {
        create: [
          { productId: rogG14.id, quantity: 1, priceAtPurchase: rogG14.price },
          {
            productId: mxMaster.id,
            quantity: 1,
            priceAtPurchase: mxMaster.price,
          },
          {
            productId: sonyXm5.id,
            quantity: 1,
            priceAtPurchase: sonyXm5.price,
          },
        ],
      },
    },
  });

  // Order 8: buyer3 — Xiaomi 14 + Anker (shipped, giữa tháng 4)
  const order8 = await prisma.order.create({
    data: {
      buyerId: buyer3.id,
      totalAmount: xiaomi14.price + anker.price,
      status: 'shipped',
      shippingAddress: addresses[2],
      createdAt: new Date('2026-04-12T10:00:00Z'),
      items: {
        create: [
          {
            productId: xiaomi14.id,
            quantity: 1,
            priceAtPurchase: xiaomi14.price,
          },
          { productId: anker.id, quantity: 1, priceAtPurchase: anker.price },
        ],
      },
    },
  });

  // Order 9: buyer3 — MacBook Air 15 (processing, mới đặt — có thể huỷ)
  const order9 = await prisma.order.create({
    data: {
      buyerId: buyer3.id,
      totalAmount: macbookAir15.price,
      status: 'processing',
      shippingAddress: addresses[2],
      createdAt: new Date('2026-04-21T15:00:00Z'),
      items: {
        create: [
          {
            productId: macbookAir15.id,
            quantity: 1,
            priceAtPurchase: macbookAir15.price,
          },
        ],
      },
    },
  });

  // Order 10: buyer1 — Sneaker + Hoodie + Culottes cho vợ (pending, mới đặt — có thể huỷ)
  const order10 = await prisma.order.create({
    data: {
      buyerId: buyer1.id,
      totalAmount: sneaker.price + hoodie.price + culottes.price,
      status: 'pending',
      shippingAddress: addresses[0],
      createdAt: new Date('2026-04-24T08:00:00Z'),
      items: {
        create: [
          {
            productId: sneaker.id,
            quantity: 1,
            priceAtPurchase: sneaker.price,
          },
          { productId: hoodie.id, quantity: 1, priceAtPurchase: hoodie.price },
          {
            productId: culottes.id,
            quantity: 1,
            priceAtPurchase: culottes.price,
          },
        ],
      },
    },
  });

  console.log('✅ Orders created (10)');

  // ─── Order Cancellation ───
  await prisma.orderCancellation.create({
    data: {
      orderId: order5.id,
      reason: 'Tìm được nơi bán giá tốt hơn',
      cancelledAt: new Date('2026-04-02T10:00:00Z'),
    },
  });
  console.log('✅ Order Cancellations created');

  // ─── Reviews (mỗi product ít nhất 2 reviews) ───
  await prisma.review.createMany({
    data: [
      // ── Điện thoại ──
      { productId: iphone15pro.id, userId: buyer1.id, rating: 5, comment: 'Máy đẹp, chạy mượt, camera chụp rất đẹp. Giao hàng nhanh!' },
      { productId: iphone15pro.id, userId: buyer2.id, rating: 4, comment: 'Sản phẩm tốt nhưng giá hơi cao so với thị trường.' },
      { productId: iphone15pro.id, userId: buyer3.id, rating: 5, comment: 'Dùng 2 tháng rồi, rất hài lòng. Pin cải thiện nhiều so với đời trước.' },

      { productId: iphone15.id, userId: buyer1.id, rating: 4, comment: 'Dynamic Island tiện lợi, camera 48MP chụp đẹp.' },
      { productId: iphone15.id, userId: buyer2.id, rating: 5, comment: 'USB-C cuối cùng cũng có, sạc nhanh hơn hẳn.' },

      { productId: samsungS24.id, userId: buyer2.id, rating: 4, comment: 'Màn hình đẹp, S-Pen tiện lợi. Camera zoom 100x ấn tượng.' },
      { productId: samsungS24.id, userId: buyer3.id, rating: 5, comment: 'Galaxy AI rất hay, dịch real-time khi gọi điện quá tiện.' },

      { productId: samsungA55.id, userId: buyer2.id, rating: 4, comment: 'Tầm giá 9 triệu thì quá ngon, chống nước IP67 nữa.' },
      { productId: samsungA55.id, userId: buyer1.id, rating: 4, comment: 'Pin trâu, dùng cả ngày thoải mái. Màn hình AMOLED đẹp.' },

      { productId: samsungZFlip.id, userId: buyer1.id, rating: 4, comment: 'Gập lại nhỏ gọn, Flex Window tiện xem thông báo.' },
      { productId: samsungZFlip.id, userId: buyer2.id, rating: 3, comment: 'Nếp gập vẫn thấy rõ, pin hơi yếu so với giá tiền.' },

      { productId: xiaomi14.id, userId: buyer3.id, rating: 4, comment: 'Camera Leica chụp đẹp, giá tốt hơn iPhone nhiều.' },
      { productId: xiaomi14.id, userId: buyer1.id, rating: 5, comment: 'Sạc 90W siêu nhanh, 30 phút đầy pin. Rất ấn tượng.' },

      { productId: redmiNote13.id, userId: buyer2.id, rating: 4, comment: 'Camera 200MP chụp chi tiết, giá rẻ mà nhiều tính năng.' },
      { productId: redmiNote13.id, userId: buyer3.id, rating: 4, comment: 'Sạc 120W nhanh kinh khủng, màn AMOLED mượt.' },

      { productId: pixel8.id, userId: buyer1.id, rating: 5, comment: 'Camera AI xử lý ảnh quá đỉnh, Magic Eraser xoá vật thể cực nhanh.' },
      { productId: pixel8.id, userId: buyer3.id, rating: 5, comment: '7 năm update Android, đầu tư dài hạn rất đáng.' },

      { productId: oppoFindX7.id, userId: buyer1.id, rating: 4, comment: 'Camera Hasselblad chụp chân dung rất đẹp, màu sắc tự nhiên.' },
      { productId: oppoFindX7.id, userId: buyer2.id, rating: 5, comment: 'Pin 5400mAh dùng 2 ngày, sạc nhanh 100W.' },

      { productId: oppoReno11.id, userId: buyer3.id, rating: 4, comment: 'Thiết kế mỏng nhẹ, cầm vừa tay, camera ổn trong tầm giá.' },
      { productId: oppoReno11.id, userId: buyer1.id, rating: 3, comment: 'Sạc 67W nhanh nhưng pin chỉ tầm 1 ngày dùng vừa.' },

      { productId: vivoX100.id, userId: buyer2.id, rating: 4, comment: 'Camera ZEISS chụp đêm rất tốt, Dimensity 9300 mạnh.' },
      { productId: vivoX100.id, userId: buyer3.id, rating: 5, comment: 'Pin 5400mAh trâu, chơi game cả ngày không lo.' },

      { productId: realmeGT5.id, userId: buyer1.id, rating: 4, comment: 'Hiệu năng mạnh trong tầm giá, sạc 100W siêu nhanh.' },
      { productId: realmeGT5.id, userId: buyer3.id, rating: 4, comment: 'Camera Sony chụp ổn, màn hình sáng rõ ngoài trời.' },

      // ── Laptop ──
      { productId: macbookPro.id, userId: buyer1.id, rating: 5, comment: 'Hiệu năng M3 Pro quá mạnh, build chất lượng cao.' },
      { productId: macbookPro.id, userId: buyer3.id, rating: 5, comment: 'Compile code nhanh gấp đôi con Intel cũ, pin dùng cả ngày.' },

      { productId: macbookAir15.id, userId: buyer2.id, rating: 4, comment: 'Màn hình lớn, không quạt nên rất yên tĩnh. Hơi nặng so với Air 13.' },
      { productId: macbookAir15.id, userId: buyer1.id, rating: 5, comment: 'Pin 18 giờ thật sự ấn tượng, làm việc cả ngày không cần sạc.' },

      { productId: macbookAir13.id, userId: buyer2.id, rating: 4, comment: 'Mỏng nhẹ, MagSafe tiện lợi. 8GB RAM hơi ít cho multitask nặng.' },
      { productId: macbookAir13.id, userId: buyer3.id, rating: 5, comment: 'Giá tốt nhất dòng Mac, đủ dùng cho sinh viên và văn phòng.' },

      { productId: dellXps.id, userId: buyer1.id, rating: 4, comment: 'Màn OLED rất đẹp, nhưng máy hơi nóng khi chạy nặng.' },
      { productId: dellXps.id, userId: buyer2.id, rating: 4, comment: 'Thiết kế premium, bàn phím gõ sướng. Fan noise hơi lớn.' },

      { productId: dellInspiron.id, userId: buyer3.id, rating: 4, comment: 'Tầm giá 19 triệu thì rất ổn, màn 16 inch rộng rãi.' },
      { productId: dellInspiron.id, userId: buyer1.id, rating: 3, comment: 'Vỏ nhựa hơi rẻ tiền, nhưng cấu hình tốt trong phân khúc.' },

      { productId: rogG14.id, userId: buyer3.id, rating: 5, comment: 'Chơi game mượt, màn OLED 120Hz quá đã. Quạt hơi ồn khi full load.' },
      { productId: rogG14.id, userId: buyer1.id, rating: 5, comment: 'Nhỏ gọn mà mạnh, mang đi làm rồi tối về chơi game luôn.' },

      { productId: vivobook.id, userId: buyer2.id, rating: 4, comment: 'Màn OLED đẹp trong tầm giá, đủ dùng cho công việc văn phòng.' },
      { productId: vivobook.id, userId: buyer3.id, rating: 4, comment: 'Nhẹ, pin ổn, Ryzen 7 chạy mượt. Loa hơi nhỏ.' },

      { productId: thinkpadX1.id, userId: buyer1.id, rating: 5, comment: 'Bàn phím ThinkPad vẫn là số 1, nhẹ chỉ 1.12kg.' },
      { productId: thinkpadX1.id, userId: buyer3.id, rating: 4, comment: 'Bền bỉ, chuyên nghiệp. Giá hơi cao so với cấu hình.' },

      { productId: ideapad.id, userId: buyer2.id, rating: 4, comment: 'Pin 12 giờ thật sự, giá rẻ mà cấu hình ngon.' },
      { productId: ideapad.id, userId: buyer1.id, rating: 3, comment: 'Màn hình hơi tối, còn lại thì ổn trong tầm giá.' },

      { productId: hpSpectre.id, userId: buyer3.id, rating: 5, comment: 'Màn OLED 2.8K touch cực đẹp, thiết kế sang trọng.' },
      { productId: hpSpectre.id, userId: buyer2.id, rating: 4, comment: 'Xoay gập tiện lợi, bút stylus vẽ mượt. Pin tốt.' },

      // ── Phụ kiện ──
      { productId: airpodsPro.id, userId: buyer1.id, rating: 5, comment: 'Chống ồn tốt, âm thanh trong trẻo, pin trâu.' },
      { productId: airpodsPro.id, userId: buyer3.id, rating: 4, comment: 'ANC tốt nhưng đeo lâu hơi đau tai.' },

      { productId: airpods4.id, userId: buyer1.id, rating: 4, comment: 'Đeo thoải mái hơn Pro, âm thanh không gian hay.' },
      { productId: airpods4.id, userId: buyer2.id, rating: 4, comment: 'Thiết kế open-ear thoáng, nghe nhạc casual rất ổn.' },

      { productId: galaxyBuds.id, userId: buyer2.id, rating: 4, comment: 'ANC thông minh, codec SSC nghe nhạc chất lượng cao.' },
      { productId: galaxyBuds.id, userId: buyer3.id, rating: 5, comment: 'Chống nước IPX7, đeo chạy bộ thoải mái.' },

      { productId: galaxyWatch.id, userId: buyer1.id, rating: 4, comment: 'Vòng bezel xoay rất thích, đo sức khoẻ chính xác.' },
      { productId: galaxyWatch.id, userId: buyer3.id, rating: 5, comment: 'Thiết kế classic đẹp, GPS chính xác khi chạy bộ.' },

      { productId: appleWatch.id, userId: buyer1.id, rating: 5, comment: 'Double Tap tiện lợi, tích hợp tốt với iPhone.' },
      { productId: appleWatch.id, userId: buyer2.id, rating: 4, comment: 'Pin vẫn chỉ được 1 ngày, nhưng tính năng rất đầy đủ.' },

      { productId: anker.id, userId: buyer1.id, rating: 5, comment: 'Nhỏ gọn mà 20000mAh, sạc nhanh iPhone rất tiện.' },
      { productId: anker.id, userId: buyer3.id, rating: 4, comment: 'Pin trâu, sạc nhanh, nhưng hơi nặng so với mong đợi.' },

      { productId: baseus.id, userId: buyer2.id, rating: 5, comment: 'Sạc laptop + điện thoại cùng lúc, GaN nhỏ gọn.' },
      { productId: baseus.id, userId: buyer1.id, rating: 4, comment: 'Giá rẻ mà 65W, thay thế cục sạc gốc luôn.' },

      { productId: mxMaster.id, userId: buyer3.id, rating: 5, comment: 'Chuột tốt nhất từng dùng, scroll mượt, kết nối 3 máy tiện lợi.' },
      { productId: mxMaster.id, userId: buyer1.id, rating: 5, comment: 'Ergonomic tuyệt vời, dùng cả ngày không mỏi tay.' },

      { productId: keychron.id, userId: buyer3.id, rating: 5, comment: 'Hot-swap tiện đổi switch, RGB đẹp, kết nối bluetooth ổn.' },
      { productId: keychron.id, userId: buyer2.id, rating: 4, comment: 'Gõ sướng, build chắc chắn. Hơi nặng để mang đi.' },

      { productId: sonyXm5.id, userId: buyer3.id, rating: 5, comment: 'Chống ồn số 1, đeo cả ngày không mỏi, âm bass sâu.' },
      { productId: sonyXm5.id, userId: buyer1.id, rating: 5, comment: 'Dùng để làm việc ở quán cafe, chống ồn cực kỳ hiệu quả.' },

      // ── Thời trang nam ──
      { productId: polo.id, userId: buyer2.id, rating: 4, comment: 'Chất vải mềm, mặc thoải mái. Sẽ mua thêm màu khác.' },
      { productId: polo.id, userId: buyer1.id, rating: 5, comment: 'Áo đẹp, giá rẻ, giao hàng nhanh. 10 điểm!' },

      { productId: somiNam.id, userId: buyer1.id, rating: 4, comment: 'Vải Oxford dày dặn, mặc đi làm rất lịch sự.' },
      { productId: somiNam.id, userId: buyer3.id, rating: 5, comment: 'Form slim fit vừa vặn, cổ button-down đẹp.' },

      { productId: jeans.id, userId: buyer2.id, rating: 3, comment: 'Form hơi rộng so với size chart, nhưng chất vải ổn.' },
      { productId: jeans.id, userId: buyer1.id, rating: 4, comment: 'Denim co giãn thoải mái, wash nhẹ đẹp.' },

      { productId: kaki.id, userId: buyer3.id, rating: 4, comment: 'Vải mềm, mặc đi làm hay đi chơi đều được.' },
      { productId: kaki.id, userId: buyer2.id, rating: 4, comment: 'Form slim đẹp, giá hợp lý.' },

      { productId: bomber.id, userId: buyer2.id, rating: 4, comment: 'Áo nhẹ, chống nước tốt, mặc mùa thu vừa đẹp.' },
      { productId: bomber.id, userId: buyer1.id, rating: 5, comment: 'Chất dù mát, lót lưới thoáng. Mặc mưa nhẹ vẫn ok.' },

      { productId: hoodie.id, userId: buyer1.id, rating: 5, comment: 'Vải dày dặn, ấm, form oversize mặc rất thoải mái.' },
      { productId: hoodie.id, userId: buyer3.id, rating: 4, comment: 'Cotton fleece mềm, mũ trùm 2 lớp che gió tốt.' },

      { productId: shortNam.id, userId: buyer3.id, rating: 4, comment: 'Vải gió nhẹ, có lót trong tiện lợi khi tập gym.' },
      { productId: shortNam.id, userId: buyer1.id, rating: 4, comment: 'Co giãn 4 chiều thoải mái, túi khoá kéo an toàn.' },

      { productId: sneaker.id, userId: buyer3.id, rating: 4, comment: 'Giày đẹp, đi êm chân, nhưng hơi trơn khi trời mưa.' },
      { productId: sneaker.id, userId: buyer2.id, rating: 5, comment: 'Phong cách minimalist, phối đồ dễ. Đế cao su bền.' },

      // ── Thời trang nữ ──
      { productId: dam.id, userId: buyer2.id, rating: 5, comment: 'Đầm đẹp lắm, đúng hình, chất voan mát. Rất hài lòng!' },
      { productId: dam.id, userId: buyer3.id, rating: 4, comment: 'Họa tiết hoa nhí xinh, dáng xòe nữ tính.' },

      { productId: somiNu.id, userId: buyer2.id, rating: 4, comment: 'Lụa mềm mịn, mặc đi làm rất sang. Hơi dễ nhăn.' },
      { productId: somiNu.id, userId: buyer1.id, rating: 5, comment: 'Form rộng thanh lịch, chất lụa satin mát.' },

      { productId: chanVay.id, userId: buyer2.id, rating: 4, comment: 'Xếp ly nhỏ đẹp, dáng midi thanh lịch.' },
      { productId: chanVay.id, userId: buyer3.id, rating: 5, comment: 'Vải chiffon mát, mặc đi làm hay đi chơi đều hợp.' },

      { productId: croptop.id, userId: buyer1.id, rating: 4, comment: 'Cotton co giãn tốt, nhiều màu phối đồ dễ.' },
      { productId: croptop.id, userId: buyer2.id, rating: 4, comment: 'Form ôm vừa vặn, giá rẻ mà chất lượng ổn.' },

      { productId: culottes.id, userId: buyer2.id, rating: 4, comment: 'Vải linen mát, dáng ống rộng thoải mái, cạp chun tiện.' },
      { productId: culottes.id, userId: buyer3.id, rating: 5, comment: 'Mặc mùa hè rất mát, phối với áo gì cũng đẹp.' },

      { productId: tote.id, userId: buyer2.id, rating: 3, comment: 'Túi đẹp nhưng da PU hơi cứng, cần dùng một thời gian mới mềm.' },
      { productId: tote.id, userId: buyer1.id, rating: 4, comment: 'Ngăn laptop 13 inch vừa, quai vai chắc chắn.' },

      { productId: caoGot.id, userId: buyer2.id, rating: 4, comment: 'Gót vuông 7cm đi vững, đệm êm chân.' },
      { productId: caoGot.id, userId: buyer3.id, rating: 4, comment: 'Da bóng đẹp, phù hợp mặc đồ công sở.' },

      { productId: doNgu.id, userId: buyer2.id, rating: 5, comment: 'Lụa satin mềm mịn, mặc ngủ rất thoải mái.' },
      { productId: doNgu.id, userId: buyer1.id, rating: 4, comment: 'Màu pastel xinh, set áo + quần dài đầy đủ.' },
    ],
  });
  console.log('✅ Reviews created');

  // ─── Update ratingAvg from actual reviews ───
  const avgRatings = await prisma.review.groupBy({
    by: ['productId'],
    _avg: { rating: true },
  });
  for (const { productId, _avg } of avgRatings) {
    await prisma.product.update({
      where: { id: productId },
      data: { ratingAvg: _avg.rating ?? 0 },
    });
  }
  console.log(`✅ Updated ratingAvg for ${avgRatings.length} products`);

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
  console.log(
    `Users: 6 | Products: ${allProducts.length} | Orders: 10 | Reviews: 30`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

const IMG = "/images/products"

async function main() {
  // ─── Admin user ──────────────────────────────────────
  const hashedPassword = await bcrypt.hash("aplus@2026", 10)

  const admin = await prisma.user.upsert({
    where: { email: "admin@aplustechnologies.vn" },
    update: {},
    create: {
      name: "Administrator",
      email: "admin@aplustechnologies.vn",
      password: hashedPassword,
      role: "admin",
    },
  })
  console.log("✅ Admin user:", admin.email)

  // ─── Blog categories ────────────────────────────────
  const categories = [
    { name: "Công nghệ", slug: "cong-nghe" },
    { name: "Giải pháp", slug: "giai-phap" },
    { name: "Hướng dẫn", slug: "huong-dan" },
    { name: "Sự kiện", slug: "su-kien" },
    { name: "Đánh giá", slug: "danh-gia" },
    { name: "Kiến thức", slug: "kien-thuc" },
    { name: "Sức khỏe", slug: "suc-khoe" },
    { name: "Công nghiệp", slug: "cong-nghiep" },
  ]

  const categoryMap: Record<string, string> = {}
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
    categoryMap[cat.name] = created.id
  }
  console.log("✅ Categories:", categories.length)

  // ─── Products ────────────────────────────────────────
  const products = [
    {
      slug: "may-loc-nuoc-ao-smith-s600",
      name: "Máy lọc nước AO Smith S600",
      description: "Đỉnh cao công nghệ lọc nước tinh khiết với màng RO Side-Stream, giám sát điện tử i-EMS.",
      price: "9.450.000",
      priceOriginal: null,
      category: "may-loc-nuoc",
      categoryName: "Máy lọc nước",
      brand: "AO Smith",
      image: `${IMG}/238-5-1746588068.png`,
      featured: true,
      badge: "Mới nhất",
      order: 1,
    },
    {
      slug: "may-loc-nuoc-9-cap-sagana",
      name: "Máy lọc nước 9 cấp Sagana",
      description: "Lọc sạch 99.99% tạp chất và vi khuẩn, công nghệ 9 cấp lọc tiên tiến.",
      price: "4.290.000",
      priceOriginal: "5.500.000",
      category: "may-loc-nuoc",
      categoryName: "Máy lọc nước",
      brand: "Sagana",
      image: `${IMG}/163-1744700869.png`,
      featured: true,
      badge: "Bán chạy",
      order: 2,
    },
    {
      slug: "bo-loc-dau-nguon-uf-5000lh",
      name: "Bộ lọc đầu nguồn UF vỏ Inox 5000L/H",
      description: "Giải pháp lọc nước tổng hiệu quả cho mọi gia đình, công suất 5000L/H.",
      price: "12.500.000",
      priceOriginal: "13.500.000",
      category: "he-thong-loc-nuoc",
      categoryName: "Hệ thống lọc",
      brand: "APLUS",
      image: `${IMG}/bo-loc-dau-nguon-uf-vo-inox-cong-suat-5000lh-1769415880.png`,
      featured: true,
      badge: "Sale 10%",
      order: 3,
    },
    {
      slug: "karofi-kad-m59-nong-lanh-nguoi",
      name: "Karofi KAD-M59 Nóng - Lạnh - Nguội",
      description: "Giải pháp nước sạch đa năng: nóng, lạnh, nguội tiện lợi.",
      price: "12.900.000",
      priceOriginal: null,
      category: "may-loc-nuoc",
      categoryName: "Máy lọc nước",
      brand: "Karofi",
      image: `${IMG}/may-loc-nuoc-karofi-kad-m59-1764649392.png`,
      featured: true,
      badge: null,
      order: 4,
    },
    {
      slug: "karofi-kad-n91-voice",
      name: "Karofi KAD-N91 điều khiển giọng nói",
      description: "Máy lọc nước thông minh với 10 lõi lọc Smax và điều khiển giọng nói.",
      price: "16.500.000",
      priceOriginal: null,
      category: "may-loc-nuoc",
      categoryName: "Máy lọc nước",
      brand: "Karofi",
      image: `${IMG}/may-loc-nuoc-karofi-kad-n91-nong-lanh-1763280937.png`,
      featured: true,
      badge: "Cao cấp",
      order: 5,
    },
    {
      slug: "he-thong-ro-cong-nghiep-500lh",
      name: "Hệ thống RO công nghiệp APLUS 500L/H",
      description: "Phù hợp cho trường học, bệnh viện và các xưởng sản xuất.",
      price: "68.000.000",
      priceOriginal: null,
      category: "he-thong-loc-nuoc",
      categoryName: "Hệ thống lọc",
      brand: "APLUS",
      image: `${IMG}/kosovota-tong-uf--ban-cong-nghiep-1-1764141321.png`,
      featured: false,
      badge: "Công nghiệp",
      order: 6,
    },
    {
      slug: "van-3-cua-tu-dong-phi-27",
      name: "Van 3 cửa tự động Phi 27 Autovan",
      description: "Van điều khiển thông minh cho hệ thống lọc nước.",
      price: "850.000",
      priceOriginal: null,
      category: "thiet-bi-loc-nuoc",
      categoryName: "Thiết bị lọc",
      brand: "APLUS",
      image: `${IMG}/van-3-cua-tu-dong-phi-27-1763356603.png`,
      featured: false,
      badge: null,
      order: 7,
    },
    {
      slug: "van-5-cong-f65p1",
      name: "Van 5 cổng tự động F65P1",
      description: "Giải pháp điều khiển hệ thống lọc nước thông minh.",
      price: "1.290.000",
      priceOriginal: null,
      category: "thiet-bi-loc-nuoc",
      categoryName: "Thiết bị lọc",
      brand: "APLUS",
      image: `${IMG}/van-tu-dong-f65p1-5-nga-1763285913.png`,
      featured: false,
      badge: null,
      order: 8,
    },
    {
      slug: "bien-ap-24v-tw",
      name: "Biến áp 24V TW chính hãng",
      description: "Bộ đổi nguồn máy lọc nước chính hãng, ổn định và bền bỉ.",
      price: "220.000",
      priceOriginal: null,
      category: "thiet-bi-loc-nuoc",
      categoryName: "Thiết bị lọc",
      brand: "TW",
      image: `${IMG}/bien-ap-24-v-tw-1768964731.png`,
      featured: false,
      badge: null,
      order: 9,
    },
    {
      slug: "dau-bom-tw-tang-ap",
      name: "Đầu bơm TW tăng áp máy lọc RO",
      description: "Giải pháp tăng áp ổn định, bền bỉ cho hệ thống lọc nước RO.",
      price: "890.000",
      priceOriginal: null,
      category: "thiet-bi-loc-nuoc",
      categoryName: "Thiết bị lọc",
      brand: "TW",
      image: `${IMG}/dau-bom-tw-may-loc-nuoc-1763274128.png`,
      featured: false,
      badge: null,
      order: 10,
    },
    {
      slug: "van-nam-chieu-f64b",
      name: "Van 5 chiều Phi 27 F64B",
      description: "Giải pháp vận hành hệ thống làm mềm nước hiệu quả và bền bỉ.",
      price: "645.000",
      priceOriginal: "795.000",
      category: "thiet-bi-loc-nuoc",
      categoryName: "Thiết bị lọc",
      brand: "APLUS",
      image: `${IMG}/van-nam-chieu-f64b-phi-27-1763353070.png`,
      featured: false,
      badge: "Sale",
      order: 11,
    },
    {
      slug: "autovalve-f67c1",
      name: "Autovalve F67C1 – Van điều khiển tự động",
      description: "Van điều khiển lọc tự động thông minh, công suất 4 m³/h.",
      price: "1.850.000",
      priceOriginal: null,
      category: "thiet-bi-loc-nuoc",
      categoryName: "Thiết bị lọc",
      brand: "APLUS",
      image: `${IMG}/autovalve-f67c1-–-van-dieu-khien-loc-tu-dong-thong-minh,-cong-suat-4-m³h-1763270895.png`,
      featured: false,
      badge: null,
      order: 12,
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    })
  }
  console.log("✅ Products:", products.length)

  // ─── Blog posts ──────────────────────────────────────
  const posts = [
    {
      slug: "su-that-nuoc-dun-soi",
      title: "Sự thật ít ai nói về nước đun sôi: Đun sôi chưa chắc đã là nước sạch",
      excerpt: "Nước đun sôi có thực sự an toàn? Tìm hiểu vì sao đun sôi không loại bỏ kim loại nặng, tạp chất và giải pháp lọc nước hiệu quả bảo vệ sức khỏe gia đình.",
      content: `<h2>Nước đun sôi có thực sự an toàn?</h2>
<p>Nhiều gia đình Việt Nam vẫn giữ thói quen đun sôi nước trước khi uống với niềm tin rằng nhiệt độ cao sẽ tiêu diệt mọi mầm bệnh. Điều này chỉ đúng một phần.</p>
<h2>Những gì đun sôi KHÔNG loại bỏ được</h2>
<p>Đun sôi có thể tiêu diệt vi khuẩn và virus, nhưng không thể loại bỏ:</p>
<ul>
<li>Kim loại nặng (chì, thủy ngân, asen)</li>
<li>Dư lượng thuốc trừ sâu</li>
<li>Cặn vôi và khoáng chất dư thừa</li>
<li>Clo dư trong nước máy</li>
</ul>
<h2>Giải pháp từ APLUS Technologies</h2>
<p>Hệ thống lọc nước RO với công nghệ màng lọc tiên tiến có thể loại bỏ đến 99.99% tạp chất, kim loại nặng và vi khuẩn, mang đến nguồn nước tinh khiết thực sự cho gia đình bạn.</p>`,
      coverImage: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=1200",
      categoryName: "Kiến thức",
      publishedAt: new Date("2026-07-15"),
      published: true,
    },
    {
      slug: "nuoc-ion-kiem-cho-da-day-gout",
      title: "Nước ion kiềm có tốt cho dạ dày và gout không?",
      excerpt: "Nước ion kiềm có giúp cải thiện dạ dày và gout không? Cùng Aplus Technologies tìm hiểu lợi ích, cơ chế hoạt động và cách sử dụng đúng cách.",
      content: `<h2>Nước ion kiềm là gì?</h2>
<p>Nước ion kiềm (alkaline ionized water) là nước đã được điện phân, có độ pH từ 8.5 đến 9.5, chứa các ion khoáng chất có lợi cho cơ thể.</p>
<h2>Tác dụng với dạ dày</h2>
<p>Nước ion kiềm có thể hỗ trợ trung hòa axit dư thừa trong dạ dày, giúp giảm triệu chứng trào ngược và khó tiêu. Tuy nhiên, cần sử dụng đúng cách và kết hợp với chế độ ăn uống hợp lý.</p>
<h2>Tác dụng với bệnh gout</h2>
<p>Nước kiềm giúp cơ thể đào thải axit uric hiệu quả hơn, hỗ trợ giảm triệu chứng gout. Nhiều nghiên cứu cho thấy việc uống nước kiềm đều đặn có thể giảm tần suất các đợt gout cấp.</p>`,
      coverImage: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=1200",
      categoryName: "Sức khỏe",
      publishedAt: new Date("2026-07-08"),
      published: true,
    },
    {
      slug: "loi-chinh-hang-hay-loi-troi-noi",
      title: "Lõi chính hãng hay lõi trôi nổi - Lựa chọn an toàn cho gia đình",
      excerpt: "So sánh lõi lọc nước chính hãng và lõi trôi nổi: rủi ro, lợi ích và giải pháp tiết kiệm bền vững.",
      content: `<h2>Lõi lọc chính hãng vs lõi trôi nổi</h2>
<p>Trên thị trường hiện nay, lõi lọc nước trôi nổi có giá rẻ hơn 30-50% so với lõi chính hãng. Tuy nhiên, đây là sự tiết kiệm rất nguy hiểm.</p>
<h2>Rủi ro khi dùng lõi trôi nổi</h2>
<ul>
<li>Vật liệu lọc không đạt chuẩn, có thể thôi nhiễm chất độc</li>
<li>Tuổi thọ ngắn, phải thay thường xuyên hơn</li>
<li>Không loại bỏ được hết tạp chất, kim loại nặng</li>
<li>Ảnh hưởng đến tuổi thọ máy lọc nước</li>
</ul>
<h2>Giải pháp tiết kiệm bền vững</h2>
<p>APLUS Technologies cung cấp lõi lọc chính hãng đa thương hiệu với giá cạnh tranh, kèm dịch vụ thay lõi tận nhà miễn phí công lắp đặt.</p>`,
      coverImage: "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=1200",
      categoryName: "Hướng dẫn",
      publishedAt: new Date("2026-06-28"),
      published: true,
    },
    {
      slug: "nuoc-nhiem-clo-tre-so-sinh",
      title: "Nước nhiễm Clo ảnh hưởng thế nào đến trẻ sơ sinh?",
      excerpt: "Tìm hiểu tác hại của Clo trong nước máy đối với trẻ sơ sinh và lý do cần thay lõi lọc nước định kỳ.",
      content: `<h2>Clo trong nước máy</h2>
<p>Clo được sử dụng rộng rãi trong quá trình xử lý nước sinh hoạt để diệt khuẩn. Tuy nhiên, dư lượng Clo trong nước máy có thể gây hại, đặc biệt cho trẻ sơ sinh.</p>
<h2>Ảnh hưởng đến trẻ sơ sinh</h2>
<ul>
<li>Gây kích ứng da, mẩn đỏ khi tắm</li>
<li>Ảnh hưởng đến hệ tiêu hóa non nớt</li>
<li>Tác động đến hệ hô hấp khi hít hơi nước chứa Clo</li>
<li>Nguy cơ dị ứng và chàm da ở trẻ nhạy cảm</li>
</ul>
<h2>Lời khuyên từ chuyên gia</h2>
<p>Sử dụng hệ thống lọc nước đầu nguồn để loại bỏ Clo dư trước khi nước vào nhà, đảm bảo an toàn cho cả gia đình, đặc biệt là trẻ nhỏ.</p>`,
      coverImage: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=1200",
      categoryName: "Sức khỏe",
      publishedAt: new Date("2026-06-20"),
      published: true,
    },
    {
      slug: "3-sai-lam-may-loc-nuoc-nhanh-hong",
      title: "3 sai lầm khiến máy lọc nước nhanh hỏng dịp Tết",
      excerpt: "3 sai lầm phổ biến khiến máy lọc nước nhanh hỏng. Hướng dẫn kiểm tra, thay lõi và bảo dưỡng đúng cách.",
      content: `<h2>Sai lầm #1: Không thay lõi đúng hạn</h2>
<p>Đây là sai lầm phổ biến nhất. Lõi lọc quá hạn không chỉ mất khả năng lọc mà còn trở thành nơi vi khuẩn sinh sôi, biến máy lọc thành máy "nhiễm khuẩn".</p>
<h2>Sai lầm #2: Tắt máy khi đi xa nhiều ngày</h2>
<p>Nhiều gia đình tắt máy lọc nước khi đi du lịch Tết. Nước đọng trong hệ thống lâu ngày sẽ sinh khuẩn. Nên để máy chạy chế độ tự xả hoặc nhờ người xả nước định kỳ.</p>
<h2>Sai lầm #3: Dùng lõi không chính hãng</h2>
<p>Lõi lọc giá rẻ trôi nổi thường có vật liệu lọc kém chất lượng, tuổi thọ ngắn, và có thể gây hại cho sức khỏe.</p>`,
      coverImage: "https://images.unsplash.com/photo-1607443337550-b1d1bef11c3c?w=1200",
      categoryName: "Hướng dẫn",
      publishedAt: new Date("2026-06-10"),
      published: true,
    },
    {
      slug: "benh-vien-lon-uu-tien-ro",
      title: "Tại sao các bệnh viện lớn ưu tiên lắp đặt hệ thống lọc nước RO?",
      excerpt: "Hệ thống lọc nước RO giúp bệnh viện loại bỏ vi khuẩn, kim loại nặng, clo dư, đảm bảo nguồn nước tinh khiết đạt chuẩn y tế.",
      content: `<h2>Yêu cầu khắt khe về nước trong y tế</h2>
<p>Bệnh viện cần nguồn nước tinh khiết cho nhiều mục đích: pha chế thuốc, khử trùng dụng cụ, chạy thận nhân tạo, và cung cấp nước uống cho bệnh nhân.</p>
<h2>Tại sao chọn RO?</h2>
<ul>
<li>Loại bỏ 99.99% vi khuẩn, virus và ký sinh trùng</li>
<li>Lọc sạch kim loại nặng, thuốc trừ sâu dư lượng</li>
<li>Đạt chuẩn nước tinh khiết cho y tế</li>
<li>Hệ thống tự động, dễ bảo trì</li>
</ul>
<h2>APLUS Technologies – Đối tác tin cậy</h2>
<p>APLUS đã thi công hệ thống RO công nghiệp cho nhiều bệnh viện, trường học và doanh nghiệp trên toàn quốc với công suất từ 500L/h đến 10.000L/h.</p>`,
      coverImage: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200",
      categoryName: "Công nghiệp",
      publishedAt: new Date("2026-05-25"),
      published: true,
    },
  ]

  for (const post of posts) {
    const { categoryName, ...postData } = post
    const catId = categoryMap[categoryName]

    await prisma.post.upsert({
      where: { slug: post.slug },
      update: { ...postData, categoryId: catId || null },
      create: { ...postData, categoryId: catId || null },
    })
  }
  console.log("✅ Posts:", posts.length)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

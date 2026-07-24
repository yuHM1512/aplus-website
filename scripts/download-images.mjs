/**
 * Download all product images from aqualifeplus.vn to local /public/images/products/
 * Run: node scripts/download-images.mjs
 */
import { writeFileSync, mkdirSync, existsSync } from "fs"
import { basename } from "path"

const OLD_SITE = "https://aqualifeplus.vn/source/storage/app/public/product"

const images = [
  "238-5-1746588068.png",
  "163-1744700869.png",
  "bo-loc-dau-nguon-uf-vo-inox-cong-suat-5000lh-1769415880.png",
  "may-loc-nuoc-karofi-kad-m59-1764649392.png",
  "may-loc-nuoc-karofi-kad-n91-nong-lanh-1763280937.png",
  "kosovota-tong-uf--ban-cong-nghiep-1-1764141321.png",
  "van-3-cua-tu-dong-phi-27-1763356603.png",
  "van-tu-dong-f65p1-5-nga-1763285913.png",
  "bien-ap-24-v-tw-1768964731.png",
  "dau-bom-tw-may-loc-nuoc-1763274128.png",
  "van-nam-chieu-f64b-phi-27-1763353070.png",
  "autovalve-f67c1-%E2%80%93-van-dieu-khien-loc-tu-dong-thong-minh,-cong-suat-4-m%C2%B3h-1763270895.png",
]

const outDir = "public/images/products"

async function main() {
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true })
    console.log(`Created ${outDir}/`)
  }

  let success = 0
  let failed = 0

  for (const img of images) {
    const url = `${OLD_SITE}/${img}`
    const filename = decodeURIComponent(basename(img))
    const outPath = `${outDir}/${filename}`

    if (existsSync(outPath)) {
      console.log(`⏭  Skip (exists): ${filename}`)
      success++
      continue
    }

    try {
      console.log(`⬇  Downloading: ${filename}`)
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const buffer = Buffer.from(await res.arrayBuffer())
      writeFileSync(outPath, buffer)
      console.log(`✅  Saved: ${filename} (${(buffer.length / 1024).toFixed(0)} KB)`)
      success++
    } catch (err) {
      console.error(`❌  Failed: ${filename} — ${err.message}`)
      failed++
    }
  }

  console.log(`\nDone: ${success} downloaded, ${failed} failed`)
  if (failed === 0) {
    console.log("\n✅ All images downloaded! Now update code references.")
  }
}

main()

import { PNG } from 'pngjs'
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const publicDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public')

const BG = [0x1a, 0x1a, 0x2e]
const WHITE = [0xf5, 0xf5, 0xf7]
const BLACK_KEY = [0x0b, 0x0b, 0x17]

const WHITE_KEY_COUNT = 7
const BLACK_KEY_AFTER = new Set([0, 1, 3, 4, 5])

function cornerAlpha(x, y, size, radius) {
  const half = size / 2
  const dx = Math.max(Math.abs(x + 0.5 - half) - (half - radius), 0)
  const dy = Math.max(Math.abs(y + 0.5 - half) - (half - radius), 0)
  return dx * dx + dy * dy <= radius * radius ? 255 : 0
}

function renderIcon(size, { rounded }) {
  const png = new PNG({ width: size, height: size })
  const radius = size * 0.2

  const bandTop = size * 0.58
  const bandBottom = size * 0.82
  const bandLeft = size * 0.12
  const bandRight = size * 0.88
  const bandWidth = bandRight - bandLeft
  const whiteKeyWidth = bandWidth / WHITE_KEY_COUNT
  const blackKeyWidth = whiteKeyWidth * 0.55
  const blackKeyBottom = bandTop + (bandBottom - bandTop) * 0.6

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (size * y + x) << 2
      const alpha = rounded ? cornerAlpha(x, y, size, radius) : 255
      let [r, g, b] = BG

      const inBand = x >= bandLeft && x < bandRight && y >= bandTop && y < bandBottom
      if (inBand) {
        ;[r, g, b] = WHITE
        for (let key = 1; key < WHITE_KEY_COUNT; key++) {
          if (!BLACK_KEY_AFTER.has(key - 1)) continue
          const center = bandLeft + key * whiteKeyWidth
          if (x >= center - blackKeyWidth / 2 && x < center + blackKeyWidth / 2 && y < blackKeyBottom) {
            ;[r, g, b] = BLACK_KEY
          }
        }
      }

      png.data[idx] = r
      png.data[idx + 1] = g
      png.data[idx + 2] = b
      png.data[idx + 3] = alpha
    }
  }

  return PNG.sync.write(png)
}

const targets = [
  { file: 'icon-192.png', size: 192, rounded: true },
  { file: 'icon-512.png', size: 512, rounded: true },
  { file: 'apple-touch-icon.png', size: 180, rounded: false },
]

for (const { file, size, rounded } of targets) {
  writeFileSync(join(publicDir, file), renderIcon(size, { rounded }))
  console.log(`wrote public/${file}`)
}

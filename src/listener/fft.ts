export function fft(re: Float64Array, im: Float64Array): void {
  const n = re.length
  if (n === 0 || (n & (n - 1)) !== 0) throw new Error(`fft length must be a power of two, got ${n}`)

  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1
    for (; j & bit; bit >>= 1) j ^= bit
    j ^= bit
    if (i < j) {
      const tr = re[i]
      re[i] = re[j]
      re[j] = tr
      const ti = im[i]
      im[i] = im[j]
      im[j] = ti
    }
  }

  for (let len = 2; len <= n; len <<= 1) {
    const half = len >> 1
    const angle = (-2 * Math.PI) / len
    const wRe = Math.cos(angle)
    const wIm = Math.sin(angle)
    for (let start = 0; start < n; start += len) {
      let curRe = 1
      let curIm = 0
      for (let k = 0; k < half; k++) {
        const a = start + k
        const b = a + half
        const bRe = re[b] * curRe - im[b] * curIm
        const bIm = re[b] * curIm + im[b] * curRe
        re[b] = re[a] - bRe
        im[b] = im[a] - bIm
        re[a] += bRe
        im[a] += bIm
        const nextRe = curRe * wRe - curIm * wIm
        curIm = curRe * wIm + curIm * wRe
        curRe = nextRe
      }
    }
  }
}

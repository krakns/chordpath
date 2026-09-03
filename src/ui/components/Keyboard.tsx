import { mod12, type PitchClass } from '../../theory'
import type { Voicing } from '../../theory'

const WHITE_PCS: PitchClass[] = [0, 2, 4, 5, 7, 9, 11]
const BLACK_KEY_OFFSET: Partial<Record<PitchClass, number>> = { 1: 0.7, 3: 1.7, 6: 3.7, 8: 4.7, 10: 5.7 }

const WHITE_WIDTH = 40
const WHITE_HEIGHT = 160
const BLACK_WIDTH = 26
const BLACK_HEIGHT = 100
const OCTAVES = 2

function keyClassName(base: string, isActive: boolean, isRoot: boolean): string {
  return `${base}${isActive ? ` ${base}--active` : ''}${isRoot ? ' keyboard__key--root' : ''}`
}

type KeyboardProps = {
  voicing: Voicing
  rootPitchClass?: PitchClass | null
}

export function Keyboard({ voicing, rootPitchClass = null }: KeyboardProps) {
  const highlighted = new Set(voicing.map((midi) => mod12(midi)))
  const width = WHITE_WIDTH * WHITE_PCS.length * OCTAVES

  const whiteKeys = Array.from({ length: WHITE_PCS.length * OCTAVES }, (_, index) => {
    const pc = WHITE_PCS[index % WHITE_PCS.length]
    return (
      <rect
        key={`white-${index}`}
        x={index * WHITE_WIDTH}
        y={0}
        width={WHITE_WIDTH}
        height={WHITE_HEIGHT}
        className={keyClassName('keyboard__white', highlighted.has(pc), pc === rootPitchClass)}
      />
    )
  })

  const blackKeys = Array.from({ length: OCTAVES }, (_, octave) => octave).flatMap((octave) =>
    (Object.entries(BLACK_KEY_OFFSET) as Array<[string, number]>).map(([pcText, offset]) => {
      const pc = Number(pcText) as PitchClass
      const x = (octave * WHITE_PCS.length + offset) * WHITE_WIDTH - BLACK_WIDTH / 2
      return (
        <rect
          key={`black-${octave}-${pc}`}
          x={x}
          y={0}
          width={BLACK_WIDTH}
          height={BLACK_HEIGHT}
          className={keyClassName('keyboard__black', highlighted.has(pc), pc === rootPitchClass)}
        />
      )
    }),
  )

  return (
    <svg
      className="keyboard"
      viewBox={`0 0 ${width} ${WHITE_HEIGHT}`}
      role="img"
      aria-label="Keyboard diagram"
    >
      {whiteKeys}
      {blackKeys}
    </svg>
  )
}

export function unreachable(value: never, context: string): never {
  throw new Error(`unexpected ${context} ${JSON.stringify(value)}`)
}

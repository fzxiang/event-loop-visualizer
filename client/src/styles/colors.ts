export const pastels = [
  '#AFF8D8',
  '#FFCBC1',
  '#FBE4FF',
  '#D8FFD8',
  '#C4FAF8',
  '#E7FFAC',
  '#ACE7FF',
  '#FFABAB',
  '#FFB5E8',
]

export function getPastelIndexFor(idx: number) {
  return idx % pastels.length
}

export function getPastelForIndex(idx: number) {
  return pastels[getPastelIndexFor(idx)]
}

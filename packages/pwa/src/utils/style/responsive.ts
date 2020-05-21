type SizeType = {
  mobile: number
  tablet: number
  laptop: number
  gaient: number
}

type MediaQueryType = {
  [screen in keyof SizeType]: string
}

export const size: SizeType = {
  mobile: 450,
  tablet: 800,
  laptop: 1024,
  gaient: 1440,
}

export const largerThan: MediaQueryType = {
  mobile: `(min-width: ${size.mobile}px)`,
  tablet: `(min-width: ${size.tablet}px)`,
  laptop: `(min-width: ${size.laptop}px)`,
  gaient: `(min-width: ${size.gaient}px)`,
}

export const smallerThan: MediaQueryType = {
  mobile: `(max-width: ${size.mobile}px)`,
  tablet: `(max-width: ${size.tablet}px)`,
  laptop: `(max-width: ${size.laptop}px)`,
  gaient: `(max-width: ${size.gaient}px)`,
}

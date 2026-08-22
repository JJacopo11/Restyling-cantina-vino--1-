export interface VineyardCamera {
  zoom?: number
  pitch?: number
  bearing?: number
  duration?: number
}

export interface Vineyard {
  id: string
  name: string
  sourceName: string
  source: string
  sourceLayer: string
  featureId?: string | number
  center?: [number, number]
  bounds?: [[number, number], [number, number]]
  camera?: VineyardCamera
  area?: string
  varieties?: string[]
  altitude?: string
  exposure?: string
  description?: string
  image?: string
}

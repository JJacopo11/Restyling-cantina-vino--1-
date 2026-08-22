import type { Vineyard } from '~/types/vineyard'

export interface RenderedVineyardFeature {
  id?: string | number
  properties?: Record<string, unknown>
}

export const VINEYARD_STYLE_SOURCE = 'mapbox://stroboflex.axqneoo3ia4i'
export const VINEYARD_SOURCE_LAYER = '1a0520426417f365638f'
export const VINEYARD_FILL_LAYER = '1a0520426417f365638f'
export const VINEYARD_LABEL_LAYER = '1a0520426417f365638f (1)'

export interface VineyardDetails {
  area?: string
  varieties?: string[]
  altitude?: string
  exposure?: string
  description?: string
  image?: string
}

export const VINEYARD_ORDER = [
  { id: 'picolit', sourceName: 'Picolit', displayName: 'Picolit' },
  { id: 'puoje', sourceName: 'Vigna del Generale', displayName: 'Puoje' },
  { id: 'cosson', sourceName: 'Cosson', displayName: 'Cosson' },
  { id: 'cjastenet', sourceName: 'Sotto Cantina', displayName: 'Cjastenêt' },
  { id: 'vigna-giancarlo', sourceName: 'Vigna Giancarlo', displayName: 'Vigna Giancarlo' },
  { id: 'sotto-la-chiesa', sourceName: 'Sotto la Chiesa', displayName: 'Sotto la Chiesa' },
  { id: 'cialla-bianco', sourceName: 'Cialla Bianco', displayName: 'Cialla Bianco' },
  { id: 'sotto-casa', sourceName: 'Sotto Casa', displayName: 'Sotto Casa' },
  { id: 'sotto-strada', sourceName: 'Sotto Strada', displayName: 'Sotto Strada' },
  { id: 'casa-dei-fiori', sourceName: 'Casa dei Fiori', displayName: 'Casa dei Fiori' },
  { id: 'vigna-di-mario', sourceName: 'Vigna di Mario', displayName: 'Vigna di Mario' },
  { id: 'vescovo', sourceName: 'Vescovo', displayName: 'Vescovo' },
  { id: 'vigna-della-cabina', sourceName: 'Vigna della Cabina', displayName: 'Vigna della Cabina' }
].map(({ id, sourceName, displayName }) => ({
  id,
  name: displayName,
  sourceName,
  source: VINEYARD_STYLE_SOURCE,
  sourceLayer: VINEYARD_SOURCE_LAYER
}))

export function vineyardId(name: string): string {
  return name.trim().toLocaleLowerCase().replace(/[^a-z0-9]+/g, '-')
}

const VINEYARD_ID_BY_SOURCE_NAME = new Map(VINEYARD_ORDER.map((vineyard) => [vineyard.sourceName, vineyard.id]))

// Only facts already present in the original plot table are included here.
export const VINEYARD_DETAILS: Record<string, VineyardDetails> = {
  [vineyardId('Picolit')]: { area: '1,12 ha', varieties: ['Picolit'] },
  puoje: { area: '0,34 ha', varieties: ['Friulano'] },
  [vineyardId('Cosson')]: { area: '0,71 ha', varieties: ['Schioppettino'] },
  cjastenet: { area: '1,96 ha', varieties: ['Schioppettino'] },
  [vineyardId('Vigna Giancarlo')]: { area: '0,61 ha', varieties: ['Ribolla Gialla'] },
  [vineyardId('Cialla Bianco')]: { area: '2,22 ha', varieties: ['Ribolla Gialla'] },
  [vineyardId('Sotto la Chiesa')]: { area: '1,65 ha', varieties: ['Ribolla Gialla', 'Refosco'] },
  [vineyardId('Sotto Casa')]: { area: '1,57 ha', varieties: ['Friulano', 'Schioppettino'] },
  [vineyardId('Sotto Strada')]: { area: '2,39 ha', varieties: ['Schioppettino', 'Refosco'] },
  [vineyardId('Vigna di Mario')]: { area: '1,77 ha', varieties: ['Ribolla Gialla'] },
  [vineyardId('Vescovo')]: { area: '0,64 ha', varieties: ['Ribolla Gialla'] },
  [vineyardId('Vigna della Cabina')]: { area: '0,38 ha', varieties: ['Ribolla Gialla'] }
}

export function vineyardFromFeature(feature: RenderedVineyardFeature): Vineyard | null {
  const name = typeof feature.properties?.Name === 'string' ? feature.properties.Name.trim() : ''
  if (!name) return null

  const id = VINEYARD_ID_BY_SOURCE_NAME.get(name) ?? vineyardId(name)
  return {
    id,
    name: VINEYARD_ORDER.find((vineyard) => vineyard.id === id)?.name ?? name,
    sourceName: name,
    source: VINEYARD_STYLE_SOURCE,
    sourceLayer: VINEYARD_SOURCE_LAYER,
    featureId: feature.id,
    ...VINEYARD_DETAILS[id]
  }
}

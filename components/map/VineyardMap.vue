<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import mapboxgl from 'mapbox-gl'
import ThreeOverlay from '~/components/map/ThreeOverlay.vue'
import { VINEYARD_FILL_LAYER, VINEYARD_LABEL_LAYER, VINEYARD_ORDER, VINEYARD_SOURCE_LAYER, VINEYARD_STYLE_SOURCE, vineyardFromFeature } from '~/data/vineyards'
import type { RenderedVineyardFeature } from '~/data/vineyards'
import type { Vineyard } from '~/types/vineyard'

const config = useRuntimeConfig()
const mapContainer = ref<HTMLElement | null>(null)
const threeOverlay = ref<InstanceType<typeof ThreeOverlay> | null>(null)
let map: mapboxgl.Map | null = null
let resizeObserver: ResizeObserver | null = null

const styleUrl = 'mapbox://styles/stroboflex/cmt1bzgnb002101s300hcdy5q'
const valleyCamera = {
  center: [13.479799812945458, 46.07837124345784] as [number, number],
  zoom: 14.8,
  bearing: -22,
  pitch: 52
}
const initialView = valleyCamera

const terrainSourceId = 'mapbox-dem'
const selectedSourceId = 'vineyard-selection'
const hoveredSourceId = 'vineyard-hover'
const selectedLayerId = 'vineyard-selection-fill'
const selectedOutlineLayerId = 'vineyard-selection-outline'
const hoveredLayerId = 'vineyard-hover-fill'
const hoveredOutlineLayerId = 'vineyard-hover-outline'
const selectedVineyard = ref<Vineyard | null>(null)
const knownVineyards = new Map<string, Vineyard>()
const knownFeatures = new Map<string, RenderedFeature>()
const isTourRunning = ref(false)
const isTourPaused = ref(false)
const currentTourIndex = ref(0)

const TOUR_READING_TIME = 3500
const TOUR_LOCAL_MOTION_TIME = 3000
const TOUR_START_TIME = 1100
const tourTimers = new Set<ReturnType<typeof setTimeout>>()
let tourRunId = 0
let activeTourOrder: Vineyard[] = []

type Geometry = { type: string; coordinates: unknown }
type VineyardFeature = { type: 'Feature'; properties: Record<string, unknown> | null; geometry: Geometry }
type RenderedFeature = RenderedVineyardFeature & { geometry?: Geometry }
type VineyardMouseEvent = mapboxgl.MapMouseEvent & { features?: RenderedFeature[] }

function featureCollection(feature: VineyardFeature | null) {
  return { type: 'FeatureCollection' as const, features: feature ? [feature] : [] }
}

function getBounds(geometry: Geometry): [[number, number], [number, number]] | undefined {
  const coordinates: number[][] = []
  const collect = (value: unknown): void => {
    if (!Array.isArray(value)) return
    if (typeof value[0] === 'number' && typeof value[1] === 'number') {
      coordinates.push([value[0], value[1]])
      return
    }
    value.forEach(collect)
  }
  collect(geometry.coordinates)
  if (!coordinates.length) return undefined

  const longitudes = coordinates.map((coordinate) => coordinate[0])
  const latitudes = coordinates.map((coordinate) => coordinate[1])
  return [[Math.min(...longitudes), Math.min(...latitudes)], [Math.max(...longitudes), Math.max(...latitudes)]]
}

function getCenter(bounds: [[number, number], [number, number]]): [number, number] {
  return [(bounds[0][0] + bounds[1][0]) / 2, (bounds[0][1] + bounds[1][1]) / 2]
}

function enrichVineyard(feature: RenderedFeature): Vineyard | null {
  const vineyard = vineyardFromFeature(feature)
  if (!vineyard || !feature.geometry) return vineyard
  const bounds = getBounds(feature.geometry)
  return bounds ? { ...vineyard, bounds, center: getCenter(bounds) } : vineyard
}

function clearOverlay(sourceId: string) {
  const source = map?.getSource(sourceId) as mapboxgl.GeoJSONSource | undefined
  source?.setData(featureCollection(null))
}

function setOverlay(sourceId: string, feature: VineyardFeature | null) {
  const source = map?.getSource(sourceId) as mapboxgl.GeoJSONSource | undefined
  source?.setData(featureCollection(feature))
}

function getCameraFor(vineyard: Vineyard): mapboxgl.CameraOptions {
  const span = vineyard.bounds
    ? Math.max(vineyard.bounds[1][0] - vineyard.bounds[0][0], vineyard.bounds[1][1] - vineyard.bounds[0][1])
    : 0.01
  const automaticZoom = Math.min(16.2, Math.max(14.4, 16.3 - Math.log2(Math.max(span, 0.0005) / 0.002)))
  const isSmallScreen = window.matchMedia('(max-width: 640px)').matches
  return {
    center: vineyard.center,
    zoom: vineyard.camera?.zoom ?? automaticZoom - (isSmallScreen ? 0.5 : 0.15),
    pitch: vineyard.camera?.pitch ?? (isSmallScreen ? 46 : 56),
    bearing: vineyard.camera?.bearing ?? -22,
    padding: isSmallScreen
      ? { top: 28, right: 20, bottom: 185, left: 20 }
      : { top: 88, right: 44, bottom: 44, left: 310 }
  }
}

function distanceBetween(first: [number, number], second: [number, number]) {
  const earthRadius = 6371
  const toRadians = (value: number) => value * Math.PI / 180
  const latitudeDelta = toRadians(second[1] - first[1])
  const longitudeDelta = toRadians(second[0] - first[0])
  const latitudeA = toRadians(first[1])
  const latitudeB = toRadians(second[1])
  const haversine = Math.sin(latitudeDelta / 2) ** 2 + Math.cos(latitudeA) * Math.cos(latitudeB) * Math.sin(longitudeDelta / 2) ** 2
  return earthRadius * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
}

function bearingBetween(first: [number, number], second: [number, number]) {
  const toRadians = (value: number) => value * Math.PI / 180
  const toDegrees = (value: number) => value * 180 / Math.PI
  const firstLatitude = toRadians(first[1])
  const secondLatitude = toRadians(second[1])
  const longitudeDelta = toRadians(second[0] - first[0])
  return (toDegrees(Math.atan2(
    Math.sin(longitudeDelta) * Math.cos(secondLatitude),
    Math.cos(firstLatitude) * Math.sin(secondLatitude) - Math.sin(firstLatitude) * Math.cos(secondLatitude) * Math.cos(longitudeDelta)
  )) + 360) % 360
}

function midpointBetween(first: [number, number], second: [number, number]): [number, number] {
  return [(first[0] + second[0]) / 2, (first[1] + second[1]) / 2]
}

function flyToVineyard(vineyard: Vineyard) {
  if (!map || !vineyard.center) return
  const currentCenter = map.getCenter()
  const distance = distanceBetween([currentCenter.lng, currentCenter.lat], vineyard.center)
  const isSmallScreen = window.matchMedia('(max-width: 640px)').matches
  const distanceDuration = distance < 0.35 ? 1900 : distance < 0.8 ? 2700 : 3600
  const duration = vineyard.camera?.duration ?? distanceDuration + (isSmallScreen ? 250 : 0)
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  map.stop()
  map.flyTo({
    ...getCameraFor(vineyard),
    duration: reducedMotion ? 250 : duration,
    curve: distance < 0.35 ? 1.15 : 1.45,
    speed: distance < 0.35 ? 0.5 : 0.38,
    essential: true
  })
  return reducedMotion ? 250 : duration
}

function flyToTourDestination(vineyard: Vineyard, runId: number): { duration: number; selectionDelay: number } {
  if (!map || !vineyard.center) return { duration: 0, selectionDelay: 0 }
  const currentCenter = map.getCenter()
  const origin: [number, number] = [currentCenter.lng, currentCenter.lat]
  const distance = distanceBetween(origin, vineyard.center)
  const direction = bearingBetween(origin, vineyard.center)
  const isSmallScreen = window.matchMedia('(max-width: 640px)').matches
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const targetCamera = getCameraFor(vineyard)
  const targetBearing = vineyard.camera?.bearing ?? (direction + (isSmallScreen ? 0 : 8)) % 360
  const duration = reducedMotion ? 250 : vineyard.camera?.duration ?? (distance < 0.35 ? 2900 : distance < 0.8 ? 3500 : 4700)
  const waypointThreshold = isSmallScreen ? 1.1 : 0.8

  map.stop()
  if (distance >= waypointThreshold && !reducedMotion) {
    const waypointDuration = Math.min(1900, Math.max(1300, duration * 0.38))
    map.flyTo({
      center: midpointBetween(origin, vineyard.center),
      zoom: Math.max(13.8, map.getZoom() - 0.8),
      pitch: isSmallScreen ? 42 : 48,
      bearing: direction,
      duration: waypointDuration,
      curve: 1.55,
      speed: 0.34,
      essential: true
    })
    scheduleTour(() => {
      map?.flyTo({
        ...targetCamera,
        bearing: targetBearing,
        duration: duration - waypointDuration,
        curve: 1.35,
        speed: 0.4,
        essential: true
      })
    }, waypointDuration, runId)
    return { duration, selectionDelay: waypointDuration + (duration - waypointDuration) * 0.82 }
  }

  map.flyTo({
    ...targetCamera,
    bearing: targetBearing,
    duration,
    curve: distance < 0.35 ? 1.2 : 1.4,
    speed: distance < 0.35 ? 0.5 : 0.42,
    essential: true
  })
  return { duration, selectionDelay: duration * 0.82 }
}

function resetToValleyView() {
  if (!map) return
  map.stop()
  map.flyTo({ ...valleyCamera, duration: 2400, curve: 1.25, speed: 0.42, essential: true })
}

function exploreVineyards() {
  const firstVineyard = visibleVineyards()[0]
  if (firstVineyard) selectVineyard(firstVineyard, knownFeatures.get(firstVineyard.id))
}

function clearTourTimer() {
  tourTimers.forEach((timer) => clearTimeout(timer))
  tourTimers.clear()
}

function scheduleTour(callback: () => void, delay: number, runId: number) {
  const timer = setTimeout(() => {
    tourTimers.delete(timer)
    if (isTourRunning.value && !isTourPaused.value && runId === tourRunId) callback()
  }, delay)
  tourTimers.add(timer)
}

function startTourStep(runId: number) {
  if (!map || !isTourRunning.value || isTourPaused.value || runId !== tourRunId) return
  const ordered = activeTourOrder
  if (!ordered.length) return stopTour()

  const vineyard = ordered[currentTourIndex.value]
  if (!vineyard) return stopTour()
  const transfer = flyToTourDestination(vineyard, runId)
  const flightDuration = transfer.duration
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const readingTime = reducedMotion ? 500 : TOUR_READING_TIME
  const localMotionTime = reducedMotion ? 0 : TOUR_LOCAL_MOTION_TIME

  scheduleTour(() => {
    if (!isTourRunning.value || isTourPaused.value) return
    selectVineyard(vineyard, knownFeatures.get(vineyard.id), false)
  }, transfer.selectionDelay, runId)

  if (localMotionTime) {
    scheduleTour(() => {
      if (!map) return
      map.easeTo({
        bearing: map.getBearing() + (currentTourIndex.value % 2 ? -4 : 4),
        pitch: Math.min(60, map.getPitch() + 1.5),
        zoom: Math.max(14.2, map.getZoom() - 0.08),
        duration: localMotionTime,
        essential: true
      })
    }, transfer.selectionDelay + 100, runId)
  }

  scheduleTour(() => {
    if (currentTourIndex.value >= ordered.length - 1) return stopTour()
    currentTourIndex.value += 1
    startTourStep(runId)
  }, flightDuration + readingTime, runId)
}

function startTour() {
  if (!map || isTourRunning.value) return
  const ordered = visibleVineyards()
  if (!ordered.length) return
  activeTourOrder = ordered
  clearTourTimer()
  tourRunId += 1
  const runId = tourRunId
  isTourRunning.value = true
  isTourPaused.value = false
  currentTourIndex.value = 0
  map.stop()
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  map.flyTo({ ...valleyCamera, duration: reducedMotion ? 150 : TOUR_START_TIME, curve: 1.2, speed: 0.4, essential: true })
  scheduleTour(() => startTourStep(runId), reducedMotion ? 150 : TOUR_START_TIME, runId)
}

function pauseTour() {
  if (!isTourRunning.value) return
  clearTourTimer()
  isTourPaused.value = true
  map?.stop()
}

function resumeTour() {
  if (!isTourRunning.value || !isTourPaused.value) return
  isTourPaused.value = false
  tourRunId += 1
  startTourStep(tourRunId)
}

function stopTour() {
  clearTourTimer()
  tourRunId += 1
  isTourRunning.value = false
  isTourPaused.value = false
  activeTourOrder = []
  map?.stop()
}

function selectVineyard(vineyard: Vineyard, feature?: RenderedFeature, moveCamera = true): number {
  if (!map || !vineyard.center) return 0
  selectedVineyard.value = vineyard
  if (feature?.geometry) setOverlay(selectedSourceId, { type: 'Feature', properties: feature.properties ?? null, geometry: feature.geometry })
  threeOverlay.value?.setVineyardLocation(vineyard.center)
  return moveCamera ? flyToVineyard(vineyard) ?? 0 : 0
}

function clearSelection() {
  stopTour()
  selectedVineyard.value = null
  clearOverlay(selectedSourceId)
  threeOverlay.value?.setVineyardLocation()
}

function selectFeature(feature: RenderedFeature) {
  const vineyard = enrichVineyard(feature)
  if (!vineyard || !feature.geometry) return
  knownVineyards.set(vineyard.id, vineyard)
  knownFeatures.set(vineyard.id, feature)
  selectVineyard(vineyard, feature)
}

function visibleVineyards() {
  if (!map) return []
  const renderedFeatures = map.queryRenderedFeatures({ layers: [VINEYARD_FILL_LAYER] }) as RenderedFeature[]
  const sourceFeatures = map.querySourceFeatures(VINEYARD_STYLE_SOURCE, { sourceLayer: VINEYARD_SOURCE_LAYER }) as RenderedFeature[]
  const features = [...renderedFeatures, ...sourceFeatures]
  for (const feature of features) {
    const vineyard = enrichVineyard(feature)
    if (vineyard) {
      knownVineyards.set(vineyard.id, vineyard)
      knownFeatures.set(vineyard.id, feature)
    }
  }
  return VINEYARD_ORDER.map((item) => knownVineyards.get(item.id)).filter((item): item is Vineyard => Boolean(item))
}

function navigateVineyard(direction: -1 | 1) {
  const ordered = visibleVineyards()
  if (!ordered.length) return
  const currentIndex = selectedVineyard.value ? ordered.findIndex((item) => item.id === selectedVineyard.value?.id) : -1
  const nextIndex = currentIndex < 0 ? (direction === 1 ? 0 : ordered.length - 1) : (currentIndex + direction + ordered.length) % ordered.length
  const vineyard = ordered[nextIndex]
  selectVineyard(vineyard, knownFeatures.get(vineyard.id))
}

function handleVineyardClick(event: VineyardMouseEvent) {
  if (isTourRunning.value) stopTour()
  const feature = event.features?.[0]
  if (feature) selectFeature(feature)
}

function handleManualMapStart() {
  if (isTourRunning.value) stopTour()
}

function handleMouseEnter(event: VineyardMouseEvent) {
  map?.getCanvas().style.setProperty('cursor', 'pointer')
  const feature = event.features?.[0]
  if (feature?.geometry) setOverlay(hoveredSourceId, { type: 'Feature', properties: feature.properties ?? null, geometry: feature.geometry })
}

function handleMouseLeave() {
  map?.getCanvas().style.removeProperty('cursor')
  clearOverlay(hoveredSourceId)
}

function addInteractionLayers() {
  if (!map) return
  const empty = featureCollection(null)
  if (!map.getSource(selectedSourceId)) map.addSource(selectedSourceId, { type: 'geojson', data: empty })
  if (!map.getSource(hoveredSourceId)) map.addSource(hoveredSourceId, { type: 'geojson', data: empty })

  if (!map.getLayer(selectedLayerId)) map.addLayer({ id: selectedLayerId, type: 'fill', source: selectedSourceId, paint: { 'fill-color': '#f3df9b', 'fill-opacity': 0.22 } })
  if (!map.getLayer(selectedOutlineLayerId)) map.addLayer({ id: selectedOutlineLayerId, type: 'line', source: selectedSourceId, paint: { 'line-color': '#f4e5b1', 'line-width': 2.5, 'line-opacity': 0.9 } })
  if (!map.getLayer(hoveredLayerId)) map.addLayer({ id: hoveredLayerId, type: 'fill', source: hoveredSourceId, paint: { 'fill-color': '#f4e5b1', 'fill-opacity': 0.1 } })
  if (!map.getLayer(hoveredOutlineLayerId)) map.addLayer({ id: hoveredOutlineLayerId, type: 'line', source: hoveredSourceId, paint: { 'line-color': '#f4e5b1', 'line-width': 1.5, 'line-opacity': 0.55 } })

  map.on('click', VINEYARD_FILL_LAYER, handleVineyardClick)
  map.on('mouseenter', VINEYARD_FILL_LAYER, handleMouseEnter)
  map.on('mouseleave', VINEYARD_FILL_LAYER, handleMouseLeave)
  map.getCanvas().addEventListener('mousedown', handleManualMapStart)
  map.getCanvas().addEventListener('touchstart', handleManualMapStart, { passive: true })
  map.getCanvas().addEventListener('wheel', handleManualMapStart, { passive: true })
  visibleVineyards()
}

function applyDisplayNamesToLabels() {
  if (!map || !map.getLayer(VINEYARD_LABEL_LAYER)) return
  map.setLayoutProperty(VINEYARD_LABEL_LAYER, 'text-field', [
    'match',
    ['get', 'Name'],
    'Vigna del Generale',
    'Puoje',
    'Sotto Cantina',
    'Cjastenêt',
    ['get', 'Name']
  ])
}

function addTerrain() {
  if (!map || map.getTerrain()) return

  if (!map.getSource(terrainSourceId)) {
    map.addSource(terrainSourceId, {
      type: 'raster-dem',
      url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
      tileSize: 512,
      maxzoom: 14
    })
  }

  map.setTerrain({ source: terrainSourceId, exaggeration: 1 })
}

function observeMapContainer() {
  if (!mapContainer.value || resizeObserver) return
  resizeObserver = new ResizeObserver(() => {
    map?.resize()
  })
  resizeObserver.observe(mapContainer.value)
}

onMounted(() => {
  if (!mapContainer.value || map) return

  const token = config.public.mapboxToken
  if (!token) {
    console.error('NUXT_PUBLIC_MAPBOX_TOKEN is not configured.')
    return
  }

  mapboxgl.accessToken = token
  map = new mapboxgl.Map({
    container: mapContainer.value,
    style: styleUrl,
    ...initialView,
    cooperativeGestures: true,
    attributionControl: true,
    trackResize: true
  })

  map.once('load', addTerrain)
  map.once('load', addInteractionLayers)
  map.once('load', applyDisplayNamesToLabels)
  map.on('style.load', applyDisplayNamesToLabels)
  map.once('load', () => threeOverlay.value?.attachToMap(map!))
  map.once('load', observeMapContainer)
  map.addControl(new mapboxgl.NavigationControl({ showCompass: true }), 'bottom-right')
})

onBeforeUnmount(() => {
  if (!map) return
  resizeObserver?.disconnect()
  resizeObserver = null
  map.off('click', VINEYARD_FILL_LAYER, handleVineyardClick)
  map.off('mouseenter', VINEYARD_FILL_LAYER, handleMouseEnter)
  map.off('mouseleave', VINEYARD_FILL_LAYER, handleMouseLeave)
  map.getCanvas().removeEventListener('mousedown', handleManualMapStart)
  map.getCanvas().removeEventListener('touchstart', handleManualMapStart)
  map.getCanvas().removeEventListener('wheel', handleManualMapStart)
  stopTour()
  map.off('style.load', applyDisplayNamesToLabels)
  map.stop()
  threeOverlay.value?.detachFromMap()
  map.getCanvas().style.removeProperty('cursor')
  map.remove()
  map = null
})
</script>

<template>
  <div class="vineyard-map-shell">
    <div ref="mapContainer" class="vineyard-map" aria-label="Mappa satellitare dei vigneti di Cialla" />
    <ThreeOverlay ref="threeOverlay" />
    <div class="vineyard-tour-controls">
      <button v-if="!isTourRunning && !selectedVineyard" class="vineyard-tour-start" aria-label="Avvia il tour dei vigneti" @click="startTour">Avvia il tour <span>&rarr;</span></button>
      <template v-else-if="isTourRunning">
        <button v-if="!isTourPaused" class="vineyard-tour-control" aria-label="Metti in pausa il tour" @click="pauseTour">Pausa</button>
        <button v-else class="vineyard-tour-control" aria-label="Riprendi il tour" @click="resumeTour">Riprendi</button>
        <button class="vineyard-tour-control" aria-label="Termina il tour" @click="stopTour">Termina tour</button>
      </template>
      <template v-else>
        <button class="vineyard-tour-start" aria-label="Avvia il tour dei vigneti" @click="startTour">Avvia il tour <span>&rarr;</span></button>
        <button class="vineyard-tour-reset" aria-label="Torna alla vista generale della valle" @click="resetToValleyView">Vista valle</button>
      </template>
    </div>
    <Transition name="vineyard-panel" mode="out-in">
      <aside v-if="selectedVineyard" :key="selectedVineyard.id" class="vineyard-panel" aria-live="polite">
        <div class="vineyard-panel-top">
          <button class="vineyard-nav" aria-label="Vigna precedente" :disabled="isTourRunning" @click="navigateVineyard(-1)">&larr;</button>
          <button class="vineyard-close" aria-label="Chiudi informazioni vigna" @click="clearSelection">&times;</button>
        </div>
        <p class="vineyard-panel-label">Vigneto</p>
        <h3>{{ selectedVineyard.name }}</h3>
        <img
          v-if="selectedVineyard.image"
          class="vineyard-image"
          :src="selectedVineyard.image"
          :alt="`Vigneto ${selectedVineyard.name}`"
        >
        <dl v-if="selectedVineyard.area || selectedVineyard.varieties?.length || selectedVineyard.exposure || selectedVineyard.altitude" class="vineyard-facts">
          <div v-if="selectedVineyard.area"><dt>Superficie</dt><dd>{{ selectedVineyard.area }}</dd></div>
          <div v-if="selectedVineyard.varieties?.length"><dt>Vitigni</dt><dd>{{ selectedVineyard.varieties.join(' · ') }}</dd></div>
          <div v-if="selectedVineyard.exposure"><dt>Esposizione</dt><dd>{{ selectedVineyard.exposure }}</dd></div>
          <div v-if="selectedVineyard.altitude"><dt>Altitudine</dt><dd>{{ selectedVineyard.altitude }}</dd></div>
        </dl>
        <p v-if="selectedVineyard.description" class="vineyard-description">{{ selectedVineyard.description }}</p>
        <button class="vineyard-nav vineyard-next" aria-label="Vigna successiva" :disabled="isTourRunning" @click="navigateVineyard(1)">&rarr;</button>
      </aside>
    </Transition>
  </div>
</template>

<style scoped>
.vineyard-map-shell { position: relative; }
.vineyard-map {
  width: 100%;
  height: clamp(460px, 48vw, 620px);
  min-height: 400px;
  overflow: hidden;
  border-radius: 14px;
  background: #d7d0c2;
}

.vineyard-panel {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 2;
  width: min(280px, calc(100% - 40px));
  padding: 16px 18px 18px;
  color: #f5efe3;
  background: rgba(44, 10, 16, 0.9);
  box-shadow: 0 14px 32px rgba(36, 6, 9, 0.28);
  backdrop-filter: blur(8px);
}

.vineyard-panel-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.vineyard-panel-label { margin: 0 0 7px; color: #e6d29a; font: 500 10px/1.2 'Jost', sans-serif; letter-spacing: .2em; text-transform: uppercase; }
.vineyard-panel h3 { margin: 0 0 16px; color: #f5efe3; font: 600 30px/1 'Cormorant Garamond', serif; }
.vineyard-image { display: block; width: 100%; height: 112px; margin: -2px 0 16px; object-fit: cover; border-radius: 2px; }
.vineyard-facts { display: grid; gap: 10px; margin: 0; }
.vineyard-facts div { display: grid; grid-template-columns: 72px 1fr; gap: 10px; }
.vineyard-facts dt { color: #c9b79e; font: 500 10px/1.35 'Jost', sans-serif; letter-spacing: .12em; text-transform: uppercase; }
.vineyard-facts dd { margin: 0; color: #f5efe3; font: 400 13px/1.35 'Jost', sans-serif; }
.vineyard-description { margin: 14px 0 0; color: #e8dfcf; font: 400 13px/1.55 'Jost', sans-serif; }
.vineyard-nav, .vineyard-close { display: grid; width: 30px; height: 30px; place-items: center; border: 1px solid rgba(230, 210, 154, 0.38); background: transparent; color: #f5efe3; cursor: pointer; font-size: 19px; line-height: 1; }
.vineyard-next { position: absolute; right: 18px; bottom: 18px; }
.vineyard-nav:focus-visible, .vineyard-close:focus-visible { outline: 2px solid #e6d29a; outline-offset: 2px; }
.vineyard-tour-controls { position: absolute; top: 20px; right: 20px; z-index: 2; display: flex; gap: 8px; }
.vineyard-tour-controls button { padding: 10px 14px; border: 1px solid rgba(230, 210, 154, 0.5); background: rgba(44, 10, 16, 0.84); color: #f5efe3; font: 500 11px/1.2 'Jost', sans-serif; letter-spacing: .12em; text-transform: uppercase; cursor: pointer; backdrop-filter: blur(8px); }
.vineyard-tour-controls button:disabled, .vineyard-nav:disabled { cursor: default; opacity: .45; }
.vineyard-tour-controls span { margin-left: 7px; color: #e6d29a; font-size: 16px; vertical-align: -1px; }
.vineyard-tour-controls button:focus-visible { outline: 2px solid #e6d29a; outline-offset: 3px; }
.vineyard-panel:has(.vineyard-next) .vineyard-description:last-child { padding-right: 38px; }
.vineyard-panel-enter-active, .vineyard-panel-leave-active { transition: opacity .22s ease, transform .22s ease; }
.vineyard-panel-enter-from, .vineyard-panel-leave-to { opacity: 0; transform: translateY(-8px); }

@media (max-width: 640px) {
  .vineyard-map { height: 390px; }
  .vineyard-panel { top: auto; right: 12px; bottom: 12px; left: 12px; width: auto; padding: 14px 16px 16px; }
  .vineyard-panel h3 { font-size: 27px; }
  .vineyard-panel-enter-from, .vineyard-panel-leave-to { transform: translateY(8px); }
  .vineyard-tour-controls { top: 12px; right: 12px; gap: 5px; }
  .vineyard-tour-controls button { padding: 9px 11px; font-size: 10px; }
}
</style>

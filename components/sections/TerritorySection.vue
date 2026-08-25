<script setup lang="ts">
import VineyardMap from '~/components/map/VineyardMap.vue'
</script>

<template>
  <section id="territorio" class="content-section territory">
    <div class="section-intro">
      <p class="eyebrow">Il territorio</p>
      <h2>La mappa dei nostri vigneti</h2>
    </div>
    <div class="territory-grid">
      <ClientOnly>
        <VineyardMap />
        <template #fallback><div class="map-fallback">Caricamento della mappa...</div></template>
      </ClientOnly>
    </div>
  </section>
</template>

<style scoped>
.territory-grid{display:block}
.map-fallback{height:clamp(460px,48vw,620px);display:grid;place-items:center;background:#d7d0c2;border-radius:14px;color:#5a463f}
@media (max-width:640px){.map-fallback{height:390px}}
</style>

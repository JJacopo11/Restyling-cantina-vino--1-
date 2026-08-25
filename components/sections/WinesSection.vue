<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { WINES } from '~/data/wines'

const assetUrl = useAssetUrl()
const { t } = useI18n()
</script>

<template>
  <section id="vini" class="content-section wines">
    <div class="center-head"><p class="eyebrow">{{ t('wines.kicker') }}</p><h2>{{ t('wines.title') }}</h2></div>
    <div class="wine-grid">
      <article v-for="wine in WINES" :key="wine.name" class="wine-card">
        <div class="bottle"><img :src="assetUrl(wine.image)" :alt="wine.name"></div>
        <span :style="{ color: wine.tone }">{{ wine.type }}</span>
        <h3>{{ wine.name }}</h3>
        <small>{{ wine.grape }}</small>
        <p>{{ wine.note }}</p>
      </article>
    </div>
  </section>
</template>

<style scoped>
.wine-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.wine-card{display:flex;flex-direction:column;align-items:center;padding:34px 26px 28px;text-align:center;transition:transform .35s,box-shadow .35s}
.wine-card:hover{transform:translateY(-6px);box-shadow:0 24px 46px -28px rgba(90,17,30,.55)}
.bottle{width:100%;height:300px;margin-bottom:24px}.bottle img{width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 16px 22px rgba(36,6,9,.3))}
.wine-card>span{font-size:10.5px;letter-spacing:.22em;text-transform:uppercase;font-weight:600}
.wine-card h3{margin:12px 0 7px;font-size:25px;line-height:1.05}
.wine-card small{color:#8a756c;font-size:11.5px;letter-spacing:.12em;text-transform:uppercase;font-weight:500}
.wine-card p{margin:14px 0 0;color:#5a463f;font-size:14px;line-height:1.6;font-weight:300}
@media (max-width:900px){.wine-grid{grid-template-columns:repeat(2,1fr)}}
@media (max-width:640px){.wine-grid{grid-template-columns:1fr;max-width:380px;margin-left:auto;margin-right:auto}}
</style>

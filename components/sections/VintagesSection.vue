<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { DECADES, VINTAGES } from '~/data/vintages'
import type { Vintage } from '~/types/content'

const { t } = useI18n()
const selectedDecade = ref('1970')
const selectedVintage = ref<Vintage | null>(null)

const visibleVintages = computed(() => {
  const decade = DECADES.find(item => item.key === selectedDecade.value)!
  return VINTAGES.filter(item => item.year >= decade.lo && item.year <= decade.hi)
})
</script>

<template>
  <section id="annate" class="vintages">
    <div class="section-inner">
      <div class="section-head narrow">
        <p class="eyebrow">{{ t('vintages.kicker') }}</p>
        <h2>{{ t('vintages.title') }}</h2>
        <p>{{ t('vintages.sub') }}</p>
      </div>
      <div class="decades">
        <button v-for="decade in DECADES" :key="decade.key" :class="{ selected: selectedDecade === decade.key }" @click="selectedDecade = decade.key">{{ decade.label }}</button>
      </div>
      <div class="vintage-grid">
        <button v-for="vintage in visibleVintages" :key="vintage.year" class="vintage-card" @click="selectedVintage = vintage">
          <i /><strong>{{ vintage.year }}</strong><span>{{ vintage.character }}</span><small>{{ vintage.note }}</small>
        </button>
      </div>
    </div>
  </section>

  <div v-if="selectedVintage" class="drawer-backdrop" @click="selectedVintage = null">
    <aside class="vintage-drawer" @click.stop>
      <button class="drawer-close" aria-label="Chiudi" @click="selectedVintage = null">&times;</button>
      <p class="eyebrow">{{ t('vintages.kicker') }} &middot; Schioppettino di Cialla</p>
      <strong class="drawer-year">{{ selectedVintage.year }}</strong>
      <span class="drawer-tag">{{ selectedVintage.character }}</span>
      <p class="eyebrow">{{ t('vintages.notesLabel') }}</p>
      <em>{{ selectedVintage.note }}</em>
      <p>{{ selectedVintage.detail }}</p>
      <a class="button" :href="`mailto:info@ronchidicialla.it?subject=Richiesta annata ${selectedVintage.year}`">{{ t('vintages.reqBtn') }}</a>
    </aside>
  </div>
</template>

<style scoped>
.vintages{padding:104px 0;background:#f0e7d6;color:#2a1a17}
.vintages .section-head>p:last-child{color:#5a463f}
.decades{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:34px}
.decades button{padding:11px 22px;border:1px solid rgba(42,26,23,.22);border-radius:40px;background:transparent;color:#5a463f;cursor:pointer}
.decades button.selected{border-color:#7e1726;background:#7e1726;color:#f5efe3}
.vintage-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:14px}
.vintage-card{position:relative;display:flex;flex-direction:column;min-height:168px;padding:22px 20px 20px;border:1px solid rgba(42,26,23,.1);background:#fbf8f1;text-align:left;cursor:pointer;transition:transform .3s,box-shadow .3s}
.vintage-card:hover{transform:translateY(-3px);box-shadow:0 14px 30px -18px rgba(90,17,30,.5)}
.vintage-card i{position:absolute;top:18px;right:18px;width:8px;height:8px;border-radius:50%;background:#c01f2e}
.vintage-card strong{color:#7e1726;font:600 40px 'Cormorant Garamond',serif;line-height:1}
.vintage-card span{margin:10px 0 8px;color:#9a7a30;font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;font-weight:500}
.vintage-card small{color:#5a463f;font-size:13px;line-height:1.5;font-weight:300}
.drawer-backdrop{position:fixed;inset:0;z-index:90;background:rgba(30,5,9,.55);backdrop-filter:blur(3px)}
.vintage-drawer{position:absolute;top:0;right:0;bottom:0;width:min(460px,92vw);padding:48px 44px;overflow-y:auto;background:#f5efe3;box-shadow:-30px 0 60px -20px rgba(30,5,9,.6);color:#5a463f}
.drawer-close{position:absolute;top:26px;right:30px;border:0;background:none;color:#9a7a30;font-size:26px;cursor:pointer}
.drawer-year{display:block;margin:4px 0 6px;color:#7e1726;font:600 96px 'Cormorant Garamond',serif;line-height:.9}
.drawer-tag{display:inline-block;margin-bottom:28px;padding:6px 14px;border-radius:40px;background:#c01f2e;color:#fff;font-size:11px;letter-spacing:.2em;text-transform:uppercase}
.vintage-drawer em{display:block;margin:0 0 22px;color:#2a1a17;font:italic 24px/1.4 'Cormorant Garamond',serif}
.vintage-drawer p:not(.eyebrow){font-size:16px;line-height:1.8;font-weight:300}
@media (max-width:640px){.vintages{padding:74px 0}.vintage-grid{grid-template-columns:1fr 1fr;gap:12px}}
@media (max-width:380px){.vintage-grid{grid-template-columns:1fr}}
</style>

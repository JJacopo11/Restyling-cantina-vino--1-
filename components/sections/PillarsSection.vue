<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const assetUrl = useAssetUrl()
const { t } = useI18n()
</script>

<template>
  <section class="pillars">
    <div class="section-inner">
      <div class="section-head"><p class="eyebrow">{{ t('pillars.kicker') }}</p><h2>{{ t('pillars.title') }}</h2></div>
      <div class="pillar-grid">
        <article>
          <div class="pillar-image"><img :src="assetUrl('/uploads/SCHIOPPETTINO-01.jpg')" alt="Schioppettino"></div>
          <h3>{{ t('pillars.schioppettino') }}</h3>
          <p>La stessa filosofia che adottiamo in vigna ci guida in vinificazione: pazienza, rispetto del frutto, lungo affinamento.</p>
          <a href="#schioppettino-story">{{ t('pillars.readMore') }} <span>&rarr;</span></a>
        </article>
        <article>
          <div class="pillar-image"><img :src="assetUrl('/uploads/biodiversityfriend.png')" alt="Biodiversity Friend"></div>
          <h3>{{ t('pillars.biodiversity') }}</h3>
          <p>Ronchi sono le colline coltivate a vigna; Cialla è una valle protetta dai boschi, dove la natura detta il ritmo.</p>
          <a href="#biodiversity-story">{{ t('pillars.readMore') }} <span>&rarr;</span></a>
        </article>
      </div>
    </div>
  </section>
  <section id="schioppettino-story" class="dark-story">
    <p class="eyebrow">Lo Schioppettino</p>
    <h3>La storia in breve</h3>
    <p>Il recupero dello Schioppettino di Cialla rappresenta uno dei principali contributi della famiglia Rapuzzi alla viticoltura friulana, attraverso un’attività di ricerca, selezione e conservazione iniziata negli anni Settanta.</p>
  </section>
  <section id="biodiversity-story" class="dark-story darker">
    <p class="eyebrow">Biodiversity Friend</p>
    <h3>Perché è importante</h3>
    <p>Ronchi di Cialla aderisce al protocollo Biodiversity Friend, che promuove la conservazione della biodiversità attraverso il monitoraggio di flora, fauna e qualità dell’agroecosistema. La tutela dell’equilibrio ecologico costituisce un elemento integrante della gestione dei vigneti.</p>
  </section>
</template>

<style scoped>
.pillars{padding:104px 0;background:#2c0a10;color:#f0e6d6}
.pillars h2,.dark-story h3{color:#f4ecdc}
.pillar-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:28px}
.pillar-grid article{display:flex;flex-direction:column}
.pillar-image{height:300px;overflow:hidden;border-radius:18px}.pillar-image img{width:100%;height:100%;object-fit:contain}
.pillar-grid h3{margin:24px 0 10px;color:#f4ecdc;font-size:28px}
.pillar-grid p{margin:0 0 16px;color:#c9b79e;font-size:15px;line-height:1.7;font-weight:300}
.pillar-grid a{margin-top:auto;color:#e6d29a;text-decoration:none;font-size:12px;letter-spacing:.16em;text-transform:uppercase}
.dark-story{padding:84px max(40px,calc((100% - 880px)/2));background:#24090f}
.dark-story.darker{background:#1f0b0f}
.dark-story h3{margin:0 0 18px;font-size:clamp(32px,3.8vw,44px);line-height:1.05;font-weight:500}
.dark-story p:last-child{max-width:880px;margin:0;color:#f7efe3;font-size:15px;line-height:1.8;font-weight:300}
@media (max-width:1024px){.section-head{grid-template-columns:1fr}}
@media (max-width:900px){.pillar-grid{grid-template-columns:1fr 1fr;gap:36px 24px}}
@media (max-width:640px){.pillars{padding:74px 0}.pillar-grid{grid-template-columns:1fr}}
</style>

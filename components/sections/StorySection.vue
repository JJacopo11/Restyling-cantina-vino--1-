<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const assetUrl = useAssetUrl()
const { t } = useI18n()
</script>

<template>
  <section id="azienda" class="content-section story">
    <div>
      <p class="eyebrow">{{ t('story.kicker') }}</p>
      <h2>{{ t('story.title') }}</h2>
      <p>La famiglia cosi riunita in sinergia, rappresenta oggi un formidabile motore di tradizione e conoscenza scientifica che contraddistingue questa piccola ma esclusiva Azienda-Famiglia.</p>
      <div class="story-stats">
        <div><strong>1970</strong><span>La rinascita</span></div>
        <div><strong>7</strong><span>Vitigni autoctoni</span></div>
        <div><strong>3</strong><span>Generazioni</span></div>
      </div>
    </div>
    <div class="story-image">
      <img :src="assetUrl('/uploads/ivanepierpaolorapuzzi.jpg')" alt="Ivan e Pierpaolo Rapuzzi">
      <span>Ivan e Pierpaolo Rapuzzi</span>
    </div>
  </section>
</template>

<style scoped>
.story{display:grid;grid-template-columns:1.05fr .95fr;gap:72px;align-items:center}
.story p:not(.eyebrow){max-width:56ch;color:#5a463f;font-size:16.5px;line-height:1.78;font-weight:300}
.story-image{position:relative;height:520px;overflow:hidden}.story-image img{width:100%;height:100%;object-fit:cover}
.story-image span{position:absolute;inset:auto 0 0;padding:18px 20px;color:#f4ecdc;background:linear-gradient(0deg,rgba(36,6,9,.74),transparent);font:italic 18px 'Cormorant Garamond',serif}
.story-stats{display:flex;gap:44px;margin-top:40px;padding-top:34px;border-top:1px solid rgba(42,26,23,.12)}
.story-stats strong{display:block;color:#7e1726;font:600 44px 'Cormorant Garamond',serif;line-height:1}
.story-stats span{display:block;margin-top:6px;color:#9a7a30;font-size:12px;letter-spacing:.12em;text-transform:uppercase}
@media (max-width:1024px){.story{grid-template-columns:1fr;gap:46px}}
@media (max-width:640px){.story-image{height:400px}.story-stats{gap:26px;flex-wrap:wrap}}
</style>

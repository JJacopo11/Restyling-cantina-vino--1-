<script setup lang="ts">
const assetUrl = useAssetUrl()
</script>

<template>
  <section id="top" class="hero">
    <div class="hero-mark" :style="{ '--hero-mark-image': `url('${assetUrl('/assets/emblem.png')}')` }" />
    <div class="hero-frame" />
    <div class="hero-content">
      <p class="eyebrow">Cialla - Colli Orientali del Friuli</p>
      <h1>Ronchi di Cialla</h1>
      <p>Produzione di vini solo da varieta autoctone nei Colli Orientali del Friuli dal 1970.</p>
      <div class="hero-actions">
        <a href="#vini" class="button">Scopri i vini</a>
        <NuxtLink to="/prenota" class="button button-ghost">Prenota un'esperienza</NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero{position:relative;display:flex;align-items:flex-end;min-height:620px;height:88vh;overflow:hidden;color:#f7f1e4;background:radial-gradient(125% 120% at 76% 18%,#5a111e,#3a0b13 46%,#220609)}
.hero-mark{position:absolute;inset:0;opacity:.12;background:var(--hero-mark-image, none) 87% 40%/min(56vh,580px) no-repeat}
.hero-frame{position:absolute;inset:24px;border:1px solid rgba(194,160,74,.42)}
.hero-content{position:relative;z-index:1;width:min(1280px,100%);margin:auto;padding:0 40px 72px}
.hero .eyebrow{color:#e6d29a}
h1{max-width:14ch;margin:0;font-size:clamp(56px,9vw,132px);line-height:.92;font-weight:500}
.hero-content>p:not(.eyebrow){max-width:46ch;margin:26px 0 34px;color:#ede3d0;font-size:17px;line-height:1.55;font-weight:300}
.hero-actions{display:flex;gap:14px;flex-wrap:wrap}
@media (max-width:640px){.hero{min-height:540px;height:78vh}.hero-content{padding:0 22px 46px}.hero-frame{inset:14px}}
</style>

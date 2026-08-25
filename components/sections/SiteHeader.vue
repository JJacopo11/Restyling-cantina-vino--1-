<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const assetUrl = useAssetUrl()
const menuOpen = ref(false)
const { t, locale } = useI18n()
const languages = ['it', 'en', 'fr', 'de'] as const
function setLang(code: string) {
  locale.value = code
}
</script>

<template>
  <header class="site-header">
    <a href="#top" class="brand" @click="menuOpen = false"><img :src="assetUrl('/assets/emblem.png')" alt="Ronchi di Cialla"><span><strong>RONCHI DI CIALLA</strong><small>Colli Orientali del Friuli</small></span></a>
    <nav class="main-nav" :class="{ open: menuOpen }"><a href="#azienda" @click="menuOpen = false">{{ t('nav.azienda') }}</a><a href="#territorio" @click="menuOpen = false">{{ t('nav.territorio') }}</a><a href="#vini" @click="menuOpen = false">{{ t('nav.vini') }}</a><a href="#annate" @click="menuOpen = false">{{ t('nav.annate') }}</a><a href="#esperienze" @click="menuOpen = false">{{ t('nav.esperienze') }}</a><a href="#contatti" @click="menuOpen = false">{{ t('nav.contatti') }}</a></nav>
    <div class="header-actions"><div class="languages"><button v-for="code in languages" :key="code" :class="{ active: locale === code }" @click="setLang(code)">{{ code.toUpperCase() }}</button></div><button class="menu-toggle" aria-label="Menu" :aria-expanded="menuOpen" @click="menuOpen = !menuOpen"><i /><i /><i /></button></div>
  </header>
</template>

<style scoped>
.site-header{position:sticky;top:0;z-index:60;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:16px 40px;background:rgba(245,239,227,.88);backdrop-filter:blur(14px);border-bottom:1px solid rgba(42,26,23,.1)}
.brand{display:flex;align-items:center;gap:13px;color:inherit;text-decoration:none}.brand img{width:44px;height:44px;object-fit:contain}.brand span{display:flex;flex-direction:column;line-height:1}.brand strong{font:600 21px 'Cormorant Garamond',serif;letter-spacing:.04em}.brand small{margin-top:4px;color:#9a7a30;font-size:9px;letter-spacing:.3em;text-transform:uppercase}
.main-nav{display:flex;gap:28px}.main-nav a{color:#4a3530;text-decoration:none;font-size:13px;letter-spacing:.12em;text-transform:uppercase}
.header-actions,.languages{display:flex;align-items:center;gap:4px}.languages button{border:0;background:transparent;color:#9a7a30;padding:6px 9px;font-size:11px;letter-spacing:.14em;cursor:pointer}.languages .active{background:#7e1726;color:#f5efe3;border-radius:40px}
.menu-toggle{display:none;width:42px;height:42px;border:1px solid rgba(42,26,23,.18);background:transparent;cursor:pointer}.menu-toggle i{display:block;width:19px;height:2px;margin:4px auto;background:#7e1726}
@media (max-width:900px){.menu-toggle{display:block}.main-nav{position:absolute;top:100%;left:0;right:0;display:none;flex-direction:column;gap:0;padding:4px 22px 20px;background:rgba(245,239,227,.98);box-shadow:0 26px 44px -30px rgba(42,10,16,.55)}.main-nav.open{display:flex}.main-nav a{padding:16px 2px;border-bottom:1px solid rgba(42,26,23,.08)}}
@media (max-width:640px){.site-header{padding:14px 22px}.languages{display:none}.brand strong{font-size:18px}.brand small{font-size:8px}}
</style>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import SiteHeader from '~/components/sections/SiteHeader.vue'
import HeroSection from '~/components/sections/HeroSection.vue'
import StorySection from '~/components/sections/StorySection.vue'
import TerritorySection from '~/components/sections/TerritorySection.vue'
import PillarsSection from '~/components/sections/PillarsSection.vue'
import WinesSection from '~/components/sections/WinesSection.vue'
import VintagesSection from '~/components/sections/VintagesSection.vue'
import ExperiencesSection from '~/components/sections/ExperiencesSection.vue'
import SiteFooter from '~/components/sections/SiteFooter.vue'

const { t } = useI18n()
</script>

<template>
  <div class="site-shell">
    <div class="scroll-progress" />
    <SiteHeader />
    <main>
      <HeroSection />
      <StorySection />
      <TerritorySection />
      <PillarsSection />
      <WinesSection />
      <VintagesSection />
      <ExperiencesSection />
    </main>
    <SiteFooter />
    <a href="#top" class="back-to-top">{{ t('backToTop') }}</a>
  </div>
</template>

<style scoped>
.site-shell{overflow-x:hidden;background:#f5efe3;color:#2a1a17}
.scroll-progress{position:fixed;inset:0 0 auto;z-index:80;height:3px;background:linear-gradient(90deg,#7e1726,#c01f2e,#c2a04a);transform-origin:left;animation:progress linear both;animation-timeline:scroll(root)}
@keyframes progress{to{transform:scaleX(1)}}
.back-to-top{position:fixed;right:24px;bottom:24px;z-index:50;padding:12px 18px;border-radius:999px;background:#2c0a10;color:#f4ecdc;text-decoration:none;font-size:11px;letter-spacing:.16em;text-transform:uppercase}
@media (max-width:640px){.back-to-top{right:16px;bottom:16px;padding:10px 14px;font-size:10px}}
</style>

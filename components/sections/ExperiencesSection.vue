<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { EXPERIENCES } from '~/data/experiences'

type ExpKey = 'classica' | 'verticale' | 'sumisura'

const assetUrl = useAssetUrl()
const { submitBooking } = useBookingApi()
const { t } = useI18n()

const selectedExperience = ref<ExpKey>('classica')
const guests = ref(2)
const name = ref('')
const email = ref('')
const date = ref('')
const bookingSent = ref(false)
const submitError = ref('')
const submitting = ref(false)

const activeExperience = computed(() => EXPERIENCES.find(item => item.key === selectedExperience.value)!)

const expName = (key: string) => t(`experiences.items.${key}.name`)
const expMeta = (key: string) => t(`experiences.items.${key}.meta`)
const expDesc = (key: string) => t(`experiences.items.${key}.desc`)
const expPrice = (exp: { key: string; price: string }) => exp.key === 'sumisura' ? t('experiences.onRequest') : exp.price

function goToBookingPage(key: ExpKey) {
  selectedExperience.value = key
  navigateTo({ path: '/prenota', query: { exp: key } })
}

async function onSubmit() {
  if (!date.value || !name.value.trim() || !email.value.trim()) {
    submitError.value = t('experiences.validateError')
    return
  }
  submitting.value = true
  submitError.value = ''
  try {
    await submitBooking({ experience: selectedExperience.value, date: date.value, guests: guests.value, name: name.value.trim(), email: email.value.trim() })
    bookingSent.value = true
  } catch {
    submitError.value = t('experiences.sendError')
  } finally {
    submitting.value = false
  }
}

function resetBooking() {
  bookingSent.value = false
  name.value = ''
  email.value = ''
  date.value = ''
  guests.value = 2
}
</script>

<template>
  <section id="esperienze" class="content-section experiences">
    <div class="experience-head">
      <div>
        <p class="eyebrow">{{ t('experiences.kicker') }}</p>
        <h2>{{ t('experiences.title') }}</h2>
        <p>{{ t('experiences.sub') }}</p>
      </div>
      <img :src="assetUrl('/uploads/zio in vigna migliorata.png')" alt="Vieni a Cialla">
    </div>
    <div class="experience-grid">
      <article v-for="experience in EXPERIENCES" :key="experience.key" :class="{ selected: selectedExperience === experience.key }">
        <span>{{ expMeta(experience.key) }}</span>
        <h3>{{ expName(experience.key) }}</h3>
        <p>{{ expDesc(experience.key) }}</p>
        <strong>{{ expPrice(experience) }}</strong>
        <button @click="goToBookingPage(experience.key)">{{ selectedExperience === experience.key ? t('experiences.selected') : t('experiences.book') }}</button>
      </article>
    </div>
    <div class="booking-panel">
      <div>
        <p class="eyebrow">{{ t('experiences.formKicker') }}</p>
        <h3>{{ expName(activeExperience.key) }}</h3>
        <p>{{ expDesc(activeExperience.key) }}</p>
        <strong>{{ expPrice(activeExperience) }} <small>&middot; {{ expMeta(activeExperience.key) }}</small></strong>
      </div>
      <div v-if="!bookingSent" class="booking-form">
        <label>{{ t('experiences.formExp') }}</label>
        <div class="chips">
          <button v-for="experience in EXPERIENCES" :key="experience.key" :class="{ selected: selectedExperience === experience.key }" @click="selectedExperience = experience.key">{{ expName(experience.key) }}</button>
        </div>
        <div class="form-grid">
          <label>{{ t('experiences.formDate') }}<input v-model="date" type="date"></label>
          <label>{{ t('experiences.formGuests') }}<div class="guest-stepper"><button @click="guests = Math.max(1, guests - 1)">&minus;</button><output>{{ guests }}</output><button @click="guests = Math.min(20, guests + 1)">+</button></div></label>
          <label>{{ t('experiences.formName') }}<input v-model="name" type="text" placeholder="Mario Rossi"></label>
          <label>{{ t('experiences.formEmail') }}<input v-model="email" type="email" placeholder="mario@email.it"></label>
        </div>
        <button class="submit" :disabled="submitting" @click="onSubmit">{{ submitting ? t('experiences.submitting') : t('experiences.formSubmit') }}</button>
        <p v-if="submitError" class="form-error">{{ submitError }}</p>
      </div>
      <div v-else class="confirmation">
        <strong>✓</strong>
        <h4>{{ t('experiences.confTitle') }}</h4>
        <p>{{ t('experiences.confText') }}</p>
        <button @click="resetBooking">{{ t('experiences.confAnother') }}</button>
      </div>
    </div>
    <img class="signature" :src="assetUrl('/uploads/HP-firma.png')" alt="Firma">
  </section>
</template>

<style scoped>
.experience-head{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;margin-bottom:56px}
.experience-head>div>p:last-child{max-width:56ch;color:#5a463f;font-size:16.5px;line-height:1.78;font-weight:300}
.experience-head img{max-width:100%;height:420px;object-fit:contain}
.experience-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-bottom:56px}
.experience-grid article{display:flex;flex-direction:column;padding:34px 30px;background:#fcf9f2;border:1px solid rgba(42,26,23,.12)}
.experience-grid article.selected{border:2px solid #c01f2e}
.experience-grid article>span{color:#9a7a30;font-size:11px;letter-spacing:.2em;text-transform:uppercase}
.experience-grid h3{margin:14px 0;font-size:30px;line-height:1.05}
.experience-grid p{flex:1;margin:0 0 26px;color:#5a463f;font-size:15px;line-height:1.7;font-weight:300}
.experience-grid article>strong{margin-bottom:20px;color:#7e1726;font:600 38px 'Cormorant Garamond',serif}
.experience-grid button,.submit{border:0;padding:14px;background:#2c0a10;color:#e6d29a;cursor:pointer;letter-spacing:.16em;text-transform:uppercase}
.experience-grid .selected button,.submit{background:#c01f2e;color:#f7f1e4}
.booking-panel{display:grid;grid-template-columns:.85fr 1.15fr;gap:clamp(32px,5vw,72px);padding:52px clamp(28px,5vw,64px);background:#2c0a10;color:#f0e6d6}
.booking-panel h3{margin:0 0 22px;color:#f4ecdc;font-size:clamp(30px,3.4vw,46px);font-weight:500}
.booking-panel p:not(.eyebrow){color:#c9b79e;font-size:15px;line-height:1.7;font-weight:300}
.booking-panel>div>strong{color:#e6d29a;font:600 52px 'Cormorant Garamond',serif}
.booking-panel>div>strong small{color:#c9b79e;font:13px Jost,sans-serif}
.booking-form>label{display:block;margin-bottom:9px;color:#c2a04a;font-size:11px;letter-spacing:.18em;text-transform:uppercase}
.chips{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px}
.chips button{padding:11px 22px;border:1px solid rgba(230,210,154,.3);border-radius:40px;background:transparent;color:#c9b79e;font-size:12px;cursor:pointer}
.chips button.selected{border-color:#7e1726;background:#7e1726;color:#f5efe3}
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.form-grid label{color:#c2a04a;font-size:11px;letter-spacing:.18em;text-transform:uppercase}
input{width:100%;margin-top:9px;padding:13px 14px;border:1px solid rgba(230,210,154,.28);background:rgba(247,241,228,.06);color:#f0e6d6;outline:0}
.guest-stepper{display:flex;align-items:center;margin-top:9px;border:1px solid rgba(230,210,154,.28)}
.guest-stepper button{width:46px;height:47px;border:0;background:transparent;color:#e6d29a;font-size:22px;cursor:pointer}
.guest-stepper output{flex:1;text-align:center;color:#f0e6d6}
.submit{width:100%;margin-top:18px}
.submit:disabled{opacity:.6;cursor:not-allowed}
.form-error{margin:10px 0 0;color:#f2b8b8;font-size:12px}
.confirmation{padding:48px 40px;border:1px solid rgba(230,210,154,.35);text-align:center}
.confirmation>strong{display:grid;place-items:center;width:56px;height:56px;margin:0 auto 22px;border:1px solid #c2a04a;border-radius:50%;color:#e6d29a;font-size:26px}
.confirmation h4{margin:0 0 12px;color:#f4ecdc;font-size:32px}
.confirmation button{padding:13px 26px;border:1px solid rgba(230,210,154,.5);background:transparent;color:#e6d29a;cursor:pointer}
.signature{display:block;max-width:100%;height:auto;margin:56px auto 0}
@media (max-width:1024px){.experience-head{grid-template-columns:1fr;gap:46px}.experience-grid{grid-template-columns:1fr}.booking-panel{grid-template-columns:1fr}}
@media (max-width:640px){.experience-head img{height:320px}.booking-panel{padding:38px 24px}.form-grid{grid-template-columns:1fr}}
</style>

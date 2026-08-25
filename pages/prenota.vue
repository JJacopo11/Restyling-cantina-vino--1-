<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { EXPERIENCES } from '~/data/experiences'

type ExpKey = 'classica' | 'verticale' | 'sumisura'

const { t, locale } = useI18n()
const assetUrl = useAssetUrl()
const { submitBooking } = useBookingApi()
const route = useRoute()
const bookingHeroMark = computed(() => `url('${assetUrl('/assets/emblem.png')}')`)

const keys: ExpKey[] = ['classica', 'verticale', 'sumisura']
const queryExp = route.query.exp as ExpKey | undefined
const selected = ref<ExpKey>(queryExp && keys.includes(queryExp) ? queryExp : 'classica')
const guests = ref(2)
const name = ref('')
const email = ref('')
const selectedDate = ref<Date | null>(null)
const viewMonth = ref(new Date())
const sent = ref(false)
const submitting = ref(false)
const errorMsg = ref('')

const localeTag = computed(() => (({ it: 'it-IT', en: 'en-GB', fr: 'fr-FR', de: 'de-DE' }) as Record<string, string>)[locale.value] || 'it-IT')

const activeExp = computed(() => EXPERIENCES.find(item => item.key === selected.value)!)
const expName = (key: string) => t(`experiences.items.${key}.name`)
const expMeta = (key: string) => t(`experiences.items.${key}.meta`)
const expPrice = computed(() => selected.value === 'sumisura' ? t('experiences.onRequest') : `${activeExp.value.price} ${t('experiences.perPerson')}`)

const weekdays = computed(() => {
  const fmt = new Intl.DateTimeFormat(localeTag.value, { weekday: 'short' })
  // 2024-01-01 is a Monday; build a Monday-first header row.
  return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(2024, 0, 1 + i)))
})
const monthLabel = computed(() => new Intl.DateTimeFormat(localeTag.value, { month: 'long', year: 'numeric' }).format(viewMonth.value))

type Cell = { day: number; date: Date; disabled: boolean } | null
const days = computed<Cell[]>(() => {
  const year = viewMonth.value.getFullYear()
  const month = viewMonth.value.getMonth()
  const offset = (new Date(year, month, 1).getDay() + 6) % 7
  const count = new Date(year, month + 1, 0).getDate()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const cells: Cell[] = Array.from({ length: offset }, () => null)
  for (let d = 1; d <= count; d++) {
    const date = new Date(year, month, d)
    cells.push({ day: d, date, disabled: date < today || date.getDay() === 0 })
  }
  return cells
})

const sameDay = (a: Date | null, b: Date) => !!a && a.toDateString() === b.toDateString()
const prevMonth = () => { viewMonth.value = new Date(viewMonth.value.getFullYear(), viewMonth.value.getMonth() - 1, 1) }
const nextMonth = () => { viewMonth.value = new Date(viewMonth.value.getFullYear(), viewMonth.value.getMonth() + 1, 1) }
const pickDate = (date: Date) => { selectedDate.value = date }

const summaryDate = computed(() => selectedDate.value
  ? new Intl.DateTimeFormat(localeTag.value, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(selectedDate.value)
  : t('prenota.selectDate'))
const summaryGuests = computed(() => `${guests.value} ${guests.value === 1 ? t('prenota.person') : t('prenota.persons')}`)

const pad = (n: number) => String(n).padStart(2, '0')
async function submit() {
  if (!selectedDate.value || !name.value.trim() || !email.value.trim()) {
    errorMsg.value = t('prenota.validateError')
    return
  }
  submitting.value = true
  errorMsg.value = ''
  const d = selectedDate.value
  try {
    await submitBooking({ experience: selected.value, date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`, guests: guests.value, name: name.value.trim(), email: email.value.trim() })
    sent.value = true
  } catch {
    errorMsg.value = t('prenota.sendError')
  } finally {
    submitting.value = false
  }
}

useHead({ title: computed(() => `${t('prenota.title')} | Ronchi di Cialla`) })
</script>

<template>
  <div class="page">
    <header class="topbar">
      <NuxtLink class="brand" to="/#top"><img :src="assetUrl('/assets/emblem.png')" alt=""><span><strong>RONCHI DI CIALLA</strong><small>Colli Orientali del Friuli</small></span></NuxtLink>
      <NuxtLink class="back" to="/#esperienze">{{ t('prenota.back') }}</NuxtLink>
    </header>
    <section class="hero" :style="{ '--booking-hero-mark': bookingHeroMark }"><div class="hero-inner"><p class="eyebrow">{{ t('prenota.kicker') }}</p><h1>{{ t('prenota.title') }}</h1><p>{{ t('prenota.sub') }}</p></div></section>
    <main class="booking-shell">
      <div class="booking-grid">
        <section class="panel form-panel">
          <p class="section-label">{{ t('prenota.step1') }}</p><h2>{{ t('prenota.step1title') }}</h2>
          <div class="field">
            <span class="field-label">{{ t('prenota.chooseOffer') }}</span>
            <div class="experiences">
              <button v-for="e in EXPERIENCES" :key="e.key" type="button" class="experience" :class="{ selected: selected === e.key }" @click="selected = e.key">
                <strong>{{ expName(e.key) }}</strong><small>{{ expMeta(e.key) }}</small>
              </button>
            </div>
          </div>
          <div class="form-row">
            <div class="field">
              <span class="field-label">{{ t('prenota.chooseDate') }}</span>
              <div class="calendar">
                <div class="calendar-head"><button class="cal-nav" type="button" aria-label="prev" @click="prevMonth">&lsaquo;</button><strong>{{ monthLabel }}</strong><button class="cal-nav" type="button" aria-label="next" @click="nextMonth">&rsaquo;</button></div>
                <div class="week"><span v-for="(w, i) in weekdays" :key="i">{{ w }}</span></div>
                <div class="days">
                  <template v-for="(cell, i) in days" :key="i">
                    <span v-if="!cell" />
                    <button v-else type="button" class="day" :class="{ selected: sameDay(selectedDate, cell.date) }" :disabled="cell.disabled" @click="pickDate(cell.date)">{{ cell.day }}</button>
                  </template>
                </div>
              </div>
            </div>
            <div class="field">
              <span class="field-label">{{ t('prenota.guestsLabel') }}</span>
              <div class="guests"><button type="button" aria-label="minus" @click="guests = Math.max(1, guests - 1)">&minus;</button><output>{{ guests }}</output><button type="button" aria-label="plus" @click="guests = Math.min(20, guests + 1)">+</button></div>
            </div>
          </div>
          <div class="form-row">
            <div class="field"><label class="field-label" for="name">{{ t('prenota.nameLabel') }}</label><input id="name" v-model="name" type="text" placeholder="Mario Rossi"></div>
            <div class="field"><label class="field-label" for="email">{{ t('prenota.emailLabel') }}</label><input id="email" v-model="email" type="email" placeholder="mario@email.it"></div>
          </div>
          <button class="submit" type="button" :disabled="submitting" @click="submit">{{ submitting ? t('prenota.submitting') : (sent ? t('prenota.sent') : t('prenota.submit')) }}</button>
          <p v-if="errorMsg" class="form-error">{{ errorMsg }}</p>
        </section>
        <aside class="summary">
          <p class="section-label">{{ t('prenota.step2') }}</p>
          <h3>{{ expName(selected) }}</h3>
          <div class="summary-line"><span>{{ t('prenota.date') }}</span><strong>{{ summaryDate }}</strong></div>
          <div class="summary-line"><span>{{ t('prenota.guests') }}</span><strong>{{ summaryGuests }}</strong></div>
          <div class="summary-line"><span>{{ t('prenota.duration') }}</span><strong>{{ expMeta(selected) }}</strong></div>
          <div class="summary-line"><span>{{ t('prenota.price') }}</span><strong>{{ expPrice }}</strong></div>
          <p class="summary-note">{{ t('prenota.note') }}</p>
          <div class="confirmation" :class="{ visible: sent }">{{ t('prenota.confirmation') }}</div>
        </aside>
      </div>
    </main>
  </div>
</template>

<style scoped>
.page{--wine:#2C0A10;--red:#C01F2E;--gold:#C2A04A;--cream:#F5EFE3;--paper:#FCF9F2;--ink:#2A1A17;--muted:#806E64;min-height:100vh;overflow:hidden;background:var(--cream);color:var(--ink)}
a{color:inherit}
.topbar{max-width:1240px;margin:auto;padding:20px 32px;display:flex;justify-content:space-between;align-items:center}
.brand{display:flex;gap:12px;align-items:center;text-decoration:none}
.brand img{width:42px;height:42px;object-fit:contain}
.brand span{display:flex;flex-direction:column;line-height:1}
.brand strong{font:600 21px 'Cormorant Garamond',serif;letter-spacing:.04em}
.brand small{margin-top:5px;color:#9A7A30;font-size:8px;letter-spacing:.3em;text-transform:uppercase}
.back{color:#7E1726;text-decoration:none;font-size:11px;letter-spacing:.16em;text-transform:uppercase}
.hero{background:var(--wine);color:var(--cream);padding:76px 32px 96px;position:relative}
.hero:after{content:'';position:absolute;right:8%;top:18%;width:280px;height:280px;opacity:.08;background:var(--booking-hero-mark) center/contain no-repeat}
.hero-inner{max-width:760px;margin:auto;position:relative;z-index:1}
.eyebrow{color:#E6D29A;font-size:11px;letter-spacing:.34em;text-transform:uppercase;margin:0 0 18px}
h1,h2,h3{font-family:'Cormorant Garamond',serif;font-weight:500}
h1{font-size:clamp(48px,7vw,88px);line-height:.94;margin:0 0 20px}
.hero p:last-child{max-width:48ch;color:#C9B79E;font-weight:300;line-height:1.7;margin:0}
.booking-shell{max-width:1160px;margin:-42px auto 90px;padding:0 24px;position:relative;z-index:2}
.booking-grid{display:flex;flex-direction:column;gap:18px}
.panel{background:var(--paper);border:1px solid rgba(42,26,23,.12);box-shadow:0 26px 60px rgba(42,26,23,.12)}
.form-panel{padding:clamp(26px,4vw,50px)}
.section-label{color:#9A7A30;font-size:10px;letter-spacing:.25em;text-transform:uppercase;margin:0 0 12px}
h2{font-size:clamp(32px,4vw,50px);line-height:1;margin:0 0 28px}
.field-label{display:block;color:#806E64;font-size:10px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;margin:0 0 9px}
.experiences{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:28px}
.experience{min-height:74px;padding:12px;text-align:left;border:1px solid rgba(42,26,23,.18);background:transparent;color:var(--ink);cursor:pointer;transition:.25s ease}
.experience:hover,.experience.selected{border-color:var(--red);background:#F8E6E1}
.experience strong{display:block;font:600 18px 'Cormorant Garamond',serif}
.experience small{color:var(--muted);font-size:10px}
.form-row{display:grid;grid-template-columns:minmax(0,1.55fr) minmax(180px,.65fr);gap:26px}
.form-row:last-of-type{grid-template-columns:1fr 1fr;gap:26px}
.field{margin-bottom:20px}
input[type=text],input[type=email]{width:100%;padding:13px 14px;border:1px solid rgba(42,26,23,.2);background:#fffdf9;color:var(--ink);outline:none}
input:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(194,160,74,.13)}
.calendar{width:min(100%,500px);border:1px solid rgba(42,26,23,.16);background:#fffdf9;padding:14px}
.calendar-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:15px}
.calendar-head strong{font:600 22px 'Cormorant Garamond',serif}
.cal-nav{border:0;background:transparent;color:var(--red);cursor:pointer;font-size:22px;padding:2px 8px}
.week,.days{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;text-align:center}
.week span{color:var(--gold);font-size:9px;letter-spacing:.08em;text-transform:uppercase;padding-bottom:7px}
.day{aspect-ratio:1.65;border:0;background:transparent;color:var(--ink);cursor:pointer;font-size:12px}
.day:hover:not(:disabled),.day.selected{background:var(--red);color:#fff}
.day:disabled{color:#D9D1C8;cursor:not-allowed;text-decoration:line-through}
.guests{display:flex;align-items:center;border:1px solid rgba(42,26,23,.2);background:#fffdf9}
.guests button{width:44px;height:44px;border:0;background:transparent;color:var(--red);cursor:pointer;font-size:22px}
.guests output{flex:1;text-align:center;font-size:14px}
.summary{order:-1;margin-top:0;background:var(--wine);color:var(--cream);padding:24px 30px;display:grid;grid-template-columns:minmax(210px,1.3fr) repeat(4,minmax(120px,.7fr)) minmax(220px,1.2fr);gap:22px;align-items:center}
.summary .section-label{grid-column:1 / -1;margin:0}
.summary h3{font-size:32px;line-height:1;margin:0;color:#F4ECDC}
.summary-line{padding:0 0 0 18px;border-left:1px solid rgba(230,210,154,.22);display:flex;flex-direction:column;gap:7px;font-size:12px}
.summary-line span:first-child{color:#C9B79E}
.summary-line strong{color:#E6D29A}
.summary-note{color:#9C8369;font-size:11px;line-height:1.55;margin:0}
.submit{width:100%;border:0;background:var(--red);color:#fff;padding:16px;cursor:pointer;font-size:11px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;transition:background .25s ease,transform .25s ease}
.submit:hover{background:#A8182A;transform:translateY(-2px)}
.submit:disabled{opacity:.6;cursor:not-allowed;transform:none}
.form-error{margin:12px 0 0;color:var(--red);font-size:12px}
.confirmation{display:none;padding:28px;border:1px solid rgba(194,160,74,.4);color:#E6D29A;line-height:1.7}
.confirmation.visible{display:block}
@media (max-width:980px){.summary{grid-template-columns:repeat(4,1fr)}.summary h3{grid-column:span 2}.summary-note{grid-column:span 2}}
@media (max-width:800px){.form-row,.form-row:last-of-type{grid-template-columns:1fr 1fr}.summary{grid-template-columns:repeat(2,1fr)}.summary h3,.summary-note{grid-column:1 / -1}}
@media (max-width:560px){.topbar{padding:16px 20px}.brand strong{font-size:18px}.brand small{font-size:7px}.hero{padding:56px 22px 82px}.booking-shell{padding:0 14px}.form-row,.form-row:last-of-type,.experiences{grid-template-columns:1fr}.form-panel,.summary{padding:24px}.summary-line{padding:12px 0 0;border-left:0;border-top:1px solid rgba(230,210,154,.22)}}
</style>

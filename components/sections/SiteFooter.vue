<script setup lang="ts">
const assetUrl = useAssetUrl()
</script>

<template>
  <footer id="contatti">
    <div class="footer-grid">
      <div>
        <div class="footer-brand"><img :src="assetUrl('/assets/emblem.png')" alt="Ronchi di Cialla"><strong>RONCHI DI CIALLA</strong></div>
        <p>Azienda Agricola Ronchi di Cialla<br>di Paolo e Dina Rapuzzi &amp; Figli<br>Via Cialla, 47 — 33040 Prepotto (UD), Italia<br>Tel. +39 0432 731679<br><a href="mailto:info@ronchidicialla.it">info@ronchidicialla.it</a></p>
      </div>
      <div>
        <p class="footer-label">Vini</p>
        <a href="#vini">Schioppettino di Cialla</a>
        <a href="#vini">Refosco di Cialla</a>
        <a href="#vini">Ribolla Gialla</a>
        <a href="#annate">Vini d’Annata</a>
      </div>
      <div>
        <p class="footer-label">Esplora</p>
        <a href="#esperienze">Esperienze</a>
        <a href="#azienda">Azienda</a>
        <a href="#territorio">Territorio</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 Ronchi di Cialla — Tutti i diritti riservati</span>
      <span>Colli Orientali del Friuli DOC &middot; Cru Cialla</span>
    </div>
  </footer>
</template>

<style scoped>
footer{padding:80px 0 36px;background:#1e0509;color:#c9b79e}
.footer-grid,.footer-bottom{max-width:1280px;margin:auto;padding:0 40px}
.footer-grid{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:48px}
.footer-brand{display:flex;align-items:center;gap:13px;margin-bottom:22px}
.footer-brand img{width:40px;height:40px;object-fit:contain}
.footer-brand strong{color:#f4ecdc;font:600 21px 'Cormorant Garamond',serif;letter-spacing:.04em}
footer p{font-size:14.5px;line-height:1.85;font-weight:300}
footer a{display:block;margin-bottom:11px;color:#b7a488;text-decoration:none;font-size:14px;font-weight:300}
footer a:hover{color:#f4ecdc}
.footer-label{margin:0 0 18px;color:#c2a04a;font-size:11px;letter-spacing:.22em;text-transform:uppercase}
.footer-bottom{display:flex;justify-content:space-between;gap:12px;margin-top:56px;padding-top:24px;border-top:1px solid rgba(201,183,158,.18);color:#897460;font-size:12px;letter-spacing:.04em}
@media (max-width:1024px){.footer-grid{grid-template-columns:1fr 1fr}}
@media (max-width:640px){.footer-grid,.footer-bottom{padding-left:22px;padding-right:22px}.footer-bottom{flex-direction:column}}
</style>

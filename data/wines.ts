import type { Wine } from '~/types/content'

// Image paths are root-relative; apply useAssetUrl() when rendering to respect the deploy baseURL.
export const WINES: Wine[] = [
  { type: 'Rosso', tone: '#C01F2E', name: 'Schioppettino di Cialla', grape: 'Schioppettino in purezza', image: '/uploads/schioppettino di cialla no sfondo.jpg', note: 'Il rosso simbolo di Cialla: pepe nero, frutti rossi e carattere minerale.' },
  { type: 'Rosso', tone: '#C01F2E', name: 'Refosco dal Peduncolo Rosso', grape: 'Refosco dal Peduncolo Rosso', image: '/assets/refosco.png', note: 'Vino intenso, con frutto scuro, acidità nervosa e tannini dritti.' },
  { type: 'Rosso', tone: '#C01F2E', name: 'Cialla Rosso', grape: 'Schioppettino · Refosco', image: '/assets/ciallarosso.png', note: 'Blend rosso classico di Cialla, speziato, succoso e di grande eleganza.' },
  { type: 'Bianco', tone: '#9A7A30', name: 'Cialla Bianco', grape: 'Ribolla · Verduzzo · Picolit', image: '/assets/ciallabianco.png', note: 'L\u2019uvaggio storico dei bianchi di Cialla: agrumi, fiori ed erbe, sapidità e lunga vita.' },
  { type: 'Bianco', tone: '#9A7A30', name: 'Ribolla Gialla', grape: 'Ribolla Gialla', image: '/uploads/ribolla no sfondo.jpg', note: 'Fresco e lineare, con note di mela verde, fiori bianchi e un finale salino.' },
  { type: 'Bianco', tone: '#9A7A30', name: 'Friulano', grape: 'Friulano', image: '/uploads/friulano no sfondo.jpg', note: 'Rotondo e sapido, con mandorla amara, erbe aromatiche e morbidezza.' },
  { type: 'Bianco', tone: '#9A7A30', name: 'Verduzzo', grape: 'Verduzzo', image: '/uploads/verduzzo no sfondo.jpg', note: 'Corposo e profumato, con miele, fiori secchi e un finale dolce-amaro.' },
  { type: 'Bianco', tone: '#9A7A30', name: 'Picolit', grape: 'Picolit', image: '/uploads/picolit no sfondo.jpg', note: 'Nobile e raro: frutto giallo, spezie dolci e una lunga suadenza.' },
  { type: 'Speciale', tone: '#9A7A30', name: 'Sol', grape: 'Blend di Cialla', image: '/uploads/sol no sfondo.jpg', note: 'Un sigillo del terroir: luminosità, calore e una trama di erbe e minerali.' }
]

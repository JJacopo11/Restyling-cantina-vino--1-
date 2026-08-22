require('dotenv').config();
const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const MAX_MESSAGE_LENGTH = 1000;
const MAX_HISTORY_ITEMS = 8;
const ALLOWED_LANGUAGES = new Set(['it', 'en', 'fr', 'de']);
const BOOKING_FILE = path.join(__dirname, 'bookings.json');

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Serve static files for the widget and admin UI
app.use('/chatbot', express.static(__dirname));

// Simple JSON file persistence for FAQs
const FAQ_FILE = path.join(__dirname, 'faq.json');
let faqs = [];
try {
  if (fs.existsSync(FAQ_FILE)) {
    faqs = JSON.parse(fs.readFileSync(FAQ_FILE, 'utf8') || '[]');
  } else {
    fs.writeFileSync(FAQ_FILE, JSON.stringify([]));
  }
} catch (e) {
  console.error('Failed to load FAQ file:', e);
  faqs = [];
}

function saveFaqs() {
  try {
    fs.writeFileSync(FAQ_FILE, JSON.stringify(faqs, null, 2));
  } catch (e) {
    console.error('Failed to save FAQ file:', e);
  }
}

function loadBookings() {
  try {
    if (!fs.existsSync(BOOKING_FILE)) fs.writeFileSync(BOOKING_FILE, '[]');
    return JSON.parse(fs.readFileSync(BOOKING_FILE, 'utf8') || '[]');
  } catch (error) {
    console.error('Failed to load bookings:', error);
    return [];
  }
}

function saveBookings(bookings) {
  fs.writeFileSync(BOOKING_FILE, JSON.stringify(bookings, null, 2));
}

app.post('/api/booking', (req, res) => {
  const { experience, date, guests, name, email } = req.body || {};
  const validExperiences = new Set(['classica', 'verticale', 'sumisura']);
  const parsedGuests = Number(guests);
  const parsedDate = typeof date === 'string' ? new Date(`${date}T00:00:00`) : null;

  if (!validExperiences.has(experience) || !date || !Number.isInteger(parsedGuests) || parsedGuests < 1 || parsedGuests > 20 || !name || !email) {
    return res.status(400).json({ error: 'Booking details are incomplete' });
  }
  if (!/^\S+@\S+\.\S+$/.test(email) || !parsedDate || Number.isNaN(parsedDate.getTime())) {
    return res.status(400).json({ error: 'Booking details are invalid' });
  }

  const bookings = loadBookings();
  bookings.push({
    id: Date.now().toString(),
    experience,
    date,
    guests: parsedGuests,
    name: String(name).trim().slice(0, 120),
    email: String(email).trim().slice(0, 160),
    createdAt: new Date().toISOString(),
    status: 'new',
  });
  try {
    saveBookings(bookings);
    res.status(201).json({ ok: true });
  } catch (error) {
    console.error('Failed to save booking:', error);
    res.status(500).json({ error: 'Booking temporarily unavailable' });
  }
});

app.post('/api/chat', async (req, res) => {
  const { message, history, language } = req.body || {};
  const OPENAI_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_KEY) return res.status(503).json({ error: 'Chat temporarily unavailable' });
  if (typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Message required' });
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return res.status(413).json({ error: 'Message too long' });
  }
  try {
    const selectedLanguage = ALLOWED_LANGUAGES.has(language) ? language : 'it';
    const safeHistory = Array.isArray(history)
      ? history
        .filter(item => item && (item.role === 'user' || item.role === 'assistant') && typeof item.content === 'string')
        .slice(-MAX_HISTORY_ITEMS)
        .map(item => ({ role: item.role, content: item.content.slice(0, MAX_MESSAGE_LENGTH) }))
      : [];

    const messages = [
      { role: 'system', content: [
        'Sei l’assistente testuale ufficiale di Ronchi di Cialla, azienda agricola della famiglia Rapuzzi nei Colli Orientali del Friuli.',
        `Rispondi nella lingua indicata dal codice: ${selectedLanguage}. Sii cordiale, chiaro e conciso.`,
        'Puoi parlare solo di azienda, territorio, vini, Schioppettino, esperienze, prenotazioni e contatti.',
        'Non inventare prezzi, disponibilità, orari, annate, spedizioni o dati non presenti nel contesto della pagina.',
        'Quando non hai una risposta certa, dichiaralo e invita l’utente a scrivere a info@ronchidicialla.it oppure a usare la sezione prenotazioni.',
        'Non chiedere né memorizzare dati personali o dati di pagamento in chat.',
      ].join(' ') },
      ...safeHistory,
      { role: 'user', content: message.trim() }
    ];

    const resp = await axios.post('https://api.openai.com/v1/chat/completions',
      {
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages,
        max_tokens: 350,
        temperature: 0.3
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const reply = resp.data.choices?.[0]?.message?.content?.trim() || '';
    if (!reply) return res.status(502).json({ error: 'Empty response' });
    res.json({ reply });
  } catch (err) {
    console.error(err.response?.data || err.message || err);
    res.status(502).json({ error: 'Chat temporarily unavailable' });
  }
});

// FAQ management endpoints
app.get('/api/faq', (req, res) => {
  res.json(faqs);
});

app.post('/api/faq', (req, res) => {
  const { question, answer } = req.body || {};
  if (!question || !answer) return res.status(400).json({ error: 'question and answer required' });
  const id = Date.now().toString();
  const item = { id, question, answer };
  faqs.push(item);
  saveFaqs();
  res.json(item);
});

app.delete('/api/faq/:id', (req, res) => {
  const id = req.params.id;
  const idx = faqs.findIndex(f => f.id === id);
  if (idx === -1) return res.status(404).json({ error: 'not found' });
  const removed = faqs.splice(idx, 1)[0];
  saveFaqs();
  res.json(removed);
});

app.listen(PORT, () => {
  console.log(`Chat proxy listening on port ${PORT}`);
});

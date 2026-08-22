(function () {
  const configuredApiBase = document.querySelector('meta[name="chat-api-base"]')?.content;
  const API_BASE = configuredApiBase || (window.location.protocol === 'file:' ? 'http://localhost:3000' : '');
  const pageLanguage = document.documentElement.lang || 'it';
  const copy = {
    it: { open: 'Apri assistente', close: 'Chiudi assistente', title: 'Assistente Cialla', intro: 'Ciao, posso aiutarti a conoscere i vini, il territorio e le esperienze a Cialla.', placeholder: 'Scrivi una domanda', send: 'Invia', loading: 'Sto cercando una risposta…', error: 'Non riesco a rispondere in questo momento. Puoi scrivere a info@ronchidicialla.it.' },
    en: { open: 'Open assistant', close: 'Close assistant', title: 'Cialla assistant', intro: 'Hello, I can help you discover our wines, territory and experiences in Cialla.', placeholder: 'Write a question', send: 'Send', loading: 'Looking for an answer…', error: 'I cannot answer right now. Please write to info@ronchidicialla.it.' },
    fr: { open: 'Ouvrir l’assistant', close: 'Fermer l’assistant', title: 'Assistant Cialla', intro: 'Bonjour, je peux vous aider à découvrir nos vins, notre territoire et nos expériences à Cialla.', placeholder: 'Écrivez une question', send: 'Envoyer', loading: 'Je cherche une réponse…', error: 'Je ne peux pas répondre maintenant. Écrivez à info@ronchidicialla.it.' },
    de: { open: 'Assistent öffnen', close: 'Assistent schließen', title: 'Cialla-Assistent', intro: 'Guten Tag, ich helfe Ihnen gerne, unsere Weine, unser Terroir und unsere Erlebnisse in Cialla zu entdecken.', placeholder: 'Frage schreiben', send: 'Senden', loading: 'Ich suche eine Antwort…', error: 'Ich kann derzeit nicht antworten. Schreiben Sie an info@ronchidicialla.it.' },
  };
  const text = copy[pageLanguage] || copy.it;
  const history = [];

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = new URL('chatbot/chat-widget.css', document.baseURI).href;
  document.head.appendChild(link);

  const container = document.createElement('div');
  container.id = 'chat-widget-container';
  container.innerHTML = `
    <button id="chat-toggle" type="button" aria-expanded="false" aria-controls="chat-panel">${text.open}</button>
    <section id="chat-panel" class="hidden" role="dialog" aria-labelledby="chat-title">
      <header id="chat-header"><span id="chat-title">${text.title}</span><button id="chat-close" type="button" aria-label="${text.close}">Chiudi</button></header>
      <div id="chat-messages" aria-live="polite"></div>
      <form id="chat-form">
        <input id="chat-input" maxlength="1000" placeholder="${text.placeholder}" autocomplete="off" aria-label="${text.placeholder}" />
        <button type="submit">${text.send}</button>
      </form>
    </section>
  `;
  document.body.appendChild(container);

  const qs = (selector) => container.querySelector(selector);
  const toggle = qs('#chat-toggle');
  const panel = qs('#chat-panel');
  const closeBtn = qs('#chat-close');
  const messagesEl = qs('#chat-messages');
  const form = qs('#chat-form');
  const input = qs('#chat-input');
  let pending = false;

  function appendMessage(message, role, loading) {
    const element = document.createElement('div');
    element.className = `chat-message ${role}${loading ? ' loading' : ''}`;
    element.textContent = message;
    messagesEl.appendChild(element);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return element;
  }

  function setOpen(open) {
    panel.classList.toggle('hidden', !open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? text.close : text.open;
    if (open) input.focus();
  }

  async function sendMessage(message) {
    pending = true;
    input.disabled = true;
    appendMessage(message, 'user');
    history.push({ role: 'user', content: message });
    const loading = appendMessage(text.loading, 'assistant', true);
    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history: history.slice(-7), language: pageLanguage }),
      });
      const data = await response.json();
      if (!response.ok || !data.reply) throw new Error('Chat request failed');
      loading.remove();
      appendMessage(data.reply, 'assistant');
      history.push({ role: 'assistant', content: data.reply });
    } catch (error) {
      loading.remove();
      appendMessage(text.error, 'assistant');
    } finally {
      pending = false;
      input.disabled = false;
      input.focus();
    }
  }

  appendMessage(text.intro, 'assistant');
  toggle.addEventListener('click', () => setOpen(panel.classList.contains('hidden')));
  closeBtn.addEventListener('click', () => setOpen(false));
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = input.value.trim();
    if (!message || pending) return;
    input.value = '';
    sendMessage(message);
  });
})();

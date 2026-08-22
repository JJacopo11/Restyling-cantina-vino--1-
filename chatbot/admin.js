async function api(path, opts) {
  const res = await fetch(path, opts);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

const qIn = document.getElementById('q');
const aIn = document.getElementById('a');
const addBtn = document.getElementById('add');
const listEl = document.getElementById('list');

async function load() {
  listEl.innerHTML = '<li>Caricamento…</li>';
  try {
    const faqs = await api('/api/faq');
    if (!faqs.length) listEl.innerHTML = '<li>Nessuna FAQ</li>';
    else listEl.innerHTML = '';
    faqs.forEach(f => {
      const li = document.createElement('li');
      li.innerHTML = `<div class="q">${escapeHtml(f.question)}</div><div class="a">${escapeHtml(f.answer)}</div><div class="actions"><button data-id="${f.id}" class="del">Elimina</button></div>`;
      listEl.appendChild(li);
    });
    document.querySelectorAll('.del').forEach(btn => btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.dataset.id;
      if (!confirm('Eliminare questa FAQ?')) return;
      await api('/api/faq/' + id, { method: 'DELETE' });
      load();
    }));
  } catch (err) {
    listEl.innerHTML = '<li>Errore caricamento</li>';
    console.error(err);
  }
}

function escapeHtml(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

addBtn.addEventListener('click', async () => {
  const q = qIn.value.trim();
  const a = aIn.value.trim();
  if (!q || !a) return alert('Inserisci domanda e risposta');
  try {
    await api('/api/faq', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ question: q, answer: a }) });
    qIn.value = '';
    aIn.value = '';
    load();
  } catch (err) { alert('Errore: ' + err.message); }
});

load();

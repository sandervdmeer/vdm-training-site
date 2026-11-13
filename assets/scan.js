// De Volhoudscan — 11 vragen over 5 gebieden. Elk antwoord scoort 0 t/m 3.
const AREAS = {
  verantwoording: {
    name: 'Verantwoording',
    title: 'Niemand merkt het als je stopt',
    say: '“Maandag begin ik weer.”',
    body: 'Op je werk heb je targets, een manager en een weekoverleg. Voor je gezondheid heb je niets van dat alles. Dus begint elke herstart weer bij nul.',
    help: 'Eén vast moment per week waarop iemand je week bekijkt: training, eten en slaap. Mis je twee keer, dan weet iemand het.'
  },
  planning: {
    name: 'Planning',
    title: 'Je plan is gemaakt voor een week die je nooit hebt',
    say: '“Deze week is gewoon gek.”',
    body: 'Je plant alleen je beste week. Loopt dinsdag uit, dan klopt het schema niet meer en valt alles om.',
    help: 'Elke week twee versies: een ceiling voor goede weken en een floor van 20 minuten voor zware weken. Die floor lukt altijd.'
  },
  voeding: {
    name: 'Voeding',
    title: 'Je eet goed, tot er geen plan is',
    say: '“Ik zie wel wat ik eet.”',
    body: 'Je weet wat gezond is. Het gaat mis op de momenten zonder plan: onderweg, om 12:30 tussen twee calls en in het weekend.',
    help: 'Een vast ontbijt en een vaste lunch met eiwit. Plus één bewust gekozen vrij moment in het weekend in plaats van twee losse dagen.'
  },
  training: {
    name: 'Training',
    title: 'Je traint, maar zonder opbouw',
    say: '“Als ik het doe, doe ik het goed.”',
    body: 'Te hard starten of trainen op gevoel. Zonder plan en zonder bijhouden is er geen progressie, en zonder progressie verdwijnt de zin.',
    help: 'Twee tot drie keer 45 minuten krachttraining met vier tot zes basisoefeningen. Noteer wat je doet, en doe volgende week net iets meer.'
  },
  herstel: {
    name: 'Slaap & energie',
    title: 'Je energie is op voordat je dag klaar is',
    say: '“Na een dag bellen heb ik nergens puf meer voor.”',
    body: 'Laat naar bed, werk tot in bed en trainen op het moment dat je energie het laagst is. Dan wint de bank.',
    help: 'Een vaste tijd waarop je scherm uitgaat, en trainen vóór het bankmoment: ’s ochtends of direct na het werk.'
  }
};

const QUESTIONS = [
  { area: 'verantwoording', q: 'Je slaat twee weken training over. Wie merkt het?',
    a: ['Niemand', 'Ikzelf, achteraf', 'Soms een trainingsmaatje', 'Iemand die het binnen een week checkt'] },
  { area: 'planning', q: 'Waar staat je training in je agenda?',
    a: ['Nergens. Ik ga als het lukt', 'In mijn hoofd', 'Soms ingepland', 'Als vaste afspraak, met tijd en duur'] },
  { area: 'voeding', q: 'Een dag met drie klantbezoeken. Wat is je lunch?',
    a: ['Wat de pomp heeft', 'Een broodje onderweg', 'Meestal iets redelijks', 'Vast. Regel ik de avond ervoor'] },
  { area: 'training', q: 'Je begint weer na een pauze. Hoe start je?',
    a: ['Vol gas: vijf keer per week', 'Met de gewichten van vroeger', 'Rustig, maar zonder plan', 'Twee à drie keer 45 minuten, en opbouwen'] },
  { area: 'herstel', q: 'Hoe laat leg je je telefoon weg?',
    a: ['Als ik in slaap val', 'Ergens na middernacht', 'Rond elf uur', 'Een uur voor ik ga slapen'] },
  { area: 'verantwoording', q: 'Hoe vaak ben je het afgelopen jaar “opnieuw begonnen”?',
    a: ['Vier keer of vaker', 'Twee of drie keer', 'Eén keer', 'Niet. Ik ben doorgegaan'] },
  { area: 'planning', q: 'Je hebt 25 minuten tussen werk en eten. Wat doe je?',
    a: ['Niks, dat is te kort', 'Misschien een wandeling', 'Iets, maar zonder plan', 'Mijn korte training, die staat klaar'] },
  { area: 'voeding', q: 'Hoe ziet je weekend eruit?',
    a: ['Vrijdag tot en met zondag los', 'Twee dagen los', 'Grotendeels normaal, met uitschieters', 'Eén vrij moment, de rest loopt door'] },
  { area: 'training', q: 'Weet je wat je vorige week tilde?',
    a: ['Ik train nu niet', 'Geen idee', 'Ongeveer', 'Ja, het staat genoteerd'] },
  { area: 'planning', q: 'De drukste week van je maand komt eraan. Dan…',
    a: ['…stopt alles', '…gaat het meestal mis', '…doe ik minder', '…heb ik er een apart plan voor'] },
  { area: 'herstel', q: '18:30, je bent thuis. Er staat een training gepland.',
    a: ['De bank wint', 'Fifty-fifty', 'Meestal ga ik', 'Ik heb al getraind vóór dit moment'] }
];

const root = document.getElementById('scan');
const intro = document.getElementById('scan-intro');
const startBtn = document.getElementById('scan-start');
const answers = new Array(QUESTIONS.length).fill(null);
let index = 0;

function el(tag, attrs = {}, html = '') {
  const n = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
  if (html) n.innerHTML = html;
  return n;
}

function renderQuestion() {
  const item = QUESTIONS[index];
  const pct = Math.round((index / QUESTIONS.length) * 100);
  root.innerHTML = `
    <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="${QUESTIONS.length}" aria-valuenow="${index}" aria-label="Voortgang"><span style="width:${pct}%"></span></div>
    <div class="progress-label"><span>Vraag ${index + 1} / ${QUESTIONS.length}</span><span>${AREAS[item.area].name}</span></div>
    <h2 class="q-title" id="q-title" tabindex="-1">${item.q}</h2>
    <div class="options" role="group" aria-labelledby="q-title"></div>
    <div class="scan-nav"><button class="back-btn" type="button" ${index === 0 ? 'hidden' : ''}>← Vorige vraag</button></div>`;
  const opts = root.querySelector('.options');
  item.a.forEach((label, i) => {
    const b = el('button', { type: 'button', class: 'option', 'aria-pressed': String(answers[index] === i) },
      `<span class="key" aria-hidden="true">${'ABCD'[i]}</span><span>${label}</span>`);
    b.addEventListener('click', () => choose(i));
    opts.appendChild(b);
  });
  root.querySelector('.back-btn').addEventListener('click', () => { index--; renderQuestion(); });
  root.querySelector('#q-title').focus({ preventScroll: true });
}

function choose(i) {
  answers[index] = i;
  root.querySelectorAll('.option').forEach((b, j) => b.setAttribute('aria-pressed', String(j === i)));
  setTimeout(() => {
    if (index < QUESTIONS.length - 1) { index++; renderQuestion(); }
    else renderResult();
  }, 180);
}

function renderResult() {
  const totals = {};
  QUESTIONS.forEach((q, i) => {
    totals[q.area] ??= { score: 0, max: 0 };
    totals[q.area].score += answers[i];
    totals[q.area].max += 3;
  });
  const pcts = Object.fromEntries(Object.entries(totals).map(([k, v]) => [k, Math.round((v.score / v.max) * 100)]));
  const weakest = Object.keys(pcts).sort((a, b) => pcts[a] - pcts[b])[0];
  const overall = Math.round(Object.values(pcts).reduce((s, v) => s + v, 0) / Object.keys(pcts).length);
  const area = AREAS[weakest];

  const verdict = overall >= 75
    ? 'Je fundament staat. Je winst zit in één gebied.'
    : overall >= 45
      ? 'Je weet wat je moet doen. Je systeem breekt op één punt.'
      : 'Het ligt niet aan je wilskracht. Er is nog geen systeem.';

  root.innerHTML = `
    <div class="result-head">
      <span class="eyebrow"><span class="dot"></span>Jouw Volhoudscan</span>
      <h2 class="h2" id="result-title" tabindex="-1">${verdict}</h2>
      <p class="lead">Je volhoudscore is <strong class="gold">${overall}%</strong>. Hieronder zie je per gebied waar je staat. Het laagste gebied is je breekpunt: daar haak je af als het druk wordt.</p>
    </div>
    <div class="card">
      <div class="scores">
        ${Object.keys(AREAS).map((k) => `
          <div class="score-row ${k === weakest ? 'weak' : ''}">
            <span class="name">${AREAS[k].name}</span>
            <div class="track" aria-hidden="true"><div class="fill" style="width:0%" data-w="${pcts[k]}"></div></div>
            <span class="val">${pcts[k]}%</span>
          </div>`).join('')}
      </div>
      <div class="breakpoint">
        <span class="tag">Jouw breekpunt: ${area.name}</span>
        <h3 class="h3">${area.title}</h3>
        <p class="say">${area.say}</p>
        <p class="muted">${area.body}</p>
        <div class="help"><strong>Wat helpt</strong><p>${area.help}</p></div>
      </div>
    </div>
    <div class="card mt-m">
      <h3 class="h3">Wil je het volledige plan voor jouw breekpunt?</h3>
      <p class="muted mt-s">Je krijgt van mij een persoonlijk advies met je eerste floor-week. Gratis, binnen twee werkdagen in je mail.</p>
      <form class="form mt-m" data-validate data-endpoint="" data-success="scan-success" novalidate>
        <input type="hidden" name="volhoudscore" value="${overall}">
        <input type="hidden" name="breekpunt" value="${area.name}">
        ${Object.keys(AREAS).map((k) => `<input type="hidden" name="score_${k}" value="${pcts[k]}">`).join('')}
        <div class="grid grid-2">
          <div class="field">
            <label for="s-name">Voornaam <span class="req" aria-hidden="true">*</span></label>
            <input class="input" id="s-name" name="voornaam" autocomplete="given-name" required aria-describedby="s-name-err">
            <span class="error-msg" id="s-name-err">Vul je voornaam in.</span>
          </div>
          <div class="field">
            <label for="s-email">E-mail <span class="req" aria-hidden="true">*</span></label>
            <input class="input" id="s-email" name="email" type="email" autocomplete="email" inputmode="email" required aria-describedby="s-email-err">
            <span class="error-msg" id="s-email-err">Vul een geldig e-mailadres in, bijvoorbeeld naam@bedrijf.nl.</span>
          </div>
        </div>
        <button class="btn btn-primary btn-block" type="submit">Stuur mij het plan <span class="arrow" aria-hidden="true">→</span></button>
        <p class="muted" style="font-size:13px">Geen spam. Je e-mail gebruik ik alleen voor dit advies.</p>
      </form>
      <div class="form-success" id="scan-success" role="status">
        <h3 class="h3">Staat genoteerd.</h3>
        <p class="muted mt-s">Je advies komt binnen twee werkdagen in je mail. Wil je niet wachten? Plan direct een gratis intake.</p>
        <a class="btn btn-primary mt-m" href="intake.html">Plan een gratis intake <span class="arrow" aria-hidden="true">→</span></a>
      </div>
    </div>
    <div class="btn-row mt-m">
      <a class="btn btn-ghost" href="intake.html">Liever direct een intake? <span class="arrow" aria-hidden="true">→</span></a>
      <button class="btn btn-ghost" type="button" id="scan-restart">Scan opnieuw doen</button>
    </div>`;

  requestAnimationFrame(() => root.querySelectorAll('.fill').forEach((f) => { f.style.width = f.dataset.w + '%'; }));
  root.querySelector('#result-title').focus({ preventScroll: true });
  root.scrollIntoView({ behavior: 'smooth', block: 'start' });
  root.querySelector('#scan-restart').addEventListener('click', () => { answers.fill(null); index = 0; renderQuestion(); });

  // Formulierlogica uit main.js opnieuw aanhaken op het dynamische formulier
  const form = root.querySelector('form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let bad = null;
    form.querySelectorAll('[required]').forEach((input) => {
      const ok = input.type === 'email' ? /\S+@\S+\.\S+/.test(input.value) : input.value.trim() !== '';
      input.setAttribute('aria-invalid', String(!ok));
      input.closest('.field').classList.toggle('has-error', !ok);
      if (!ok && !bad) bad = input;
    });
    if (bad) { bad.focus(); return; }
    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true; btn.textContent = 'Versturen…';
    try {
      if (form.dataset.endpoint) {
        const res = await fetch(form.dataset.endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error();
      }
      form.hidden = true;
      const s = document.getElementById('scan-success');
      s.classList.add('show'); s.setAttribute('tabindex', '-1'); s.focus();
    } catch {
      btn.disabled = false; btn.textContent = 'Stuur mij het plan →';
      alert('Versturen lukte niet. Probeer het opnieuw.');
    }
  });
}

startBtn?.addEventListener('click', () => {
  intro.hidden = true;
  root.hidden = false;
  renderQuestion();
});

// Toetsenbord: A–D kiest een antwoord
document.addEventListener('keydown', (e) => {
  if (root.hidden || !root.querySelector('.options')) return;
  if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
  const i = 'abcd'.indexOf(e.key.toLowerCase());
  if (i > -1) choose(i);
});

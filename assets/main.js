document.documentElement.classList.add('js');

// Mobiel menu
const menuBtn = document.querySelector('.menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    const open = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!open));
    menuBtn.setAttribute('aria-label', open ? 'Menu openen' : 'Menu sluiten');
    mobileMenu.classList.toggle('open', !open);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      mobileMenu.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.focus();
    }
  });
}

// Scroll reveal
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fades = document.querySelectorAll('.fade, .week');
if ('IntersectionObserver' in window && !reduce) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        if (en.target.classList.contains('week')) en.target.classList.add('reveal');
        io.unobserve(en.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  fades.forEach((el) => io.observe(el));
} else {
  fades.forEach((el) => el.classList.add('in'));
}

// Zwevende scan-pil verbergen boven de footer
const pill = document.querySelector('.float-pill');
const footer = document.querySelector('.site-footer');
if (pill && footer && 'IntersectionObserver' in window) {
  new IntersectionObserver(([en]) => pill.classList.toggle('hide', en.isIntersecting)).observe(footer);
}

// Formulieren (intake + scan-rapport)
// LET OP: nog niet gekoppeld. Zet de URL van je formulierdienst (bijv. Formspree, Tally of Make)
// in het data-endpoint attribuut van het <form>. Zonder endpoint toont het formulier alleen de bevestiging.
document.querySelectorAll('form[data-validate]').forEach((form) => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let firstInvalid = null;
    form.querySelectorAll('[required]').forEach((input) => {
      const field = input.closest('.field');
      const ok = input.type === 'email' ? /\S+@\S+\.\S+/.test(input.value) : input.value.trim() !== '';
      input.setAttribute('aria-invalid', String(!ok));
      if (field) field.classList.toggle('has-error', !ok);
      if (!ok && !firstInvalid) firstInvalid = input;
    });
    if (firstInvalid) { firstInvalid.focus(); return; }

    const btn = form.querySelector('[type="submit"]');
    const label = btn.innerHTML;
    btn.disabled = true;
    btn.textContent = 'Versturen…';

    const endpoint = form.dataset.endpoint;
    try {
      if (endpoint) {
        const res = await fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error('Versturen mislukt');
      }
      const success = document.getElementById(form.dataset.success);
      form.hidden = true;
      if (success) { success.classList.add('show'); success.setAttribute('tabindex', '-1'); success.focus(); }
    } catch (err) {
      btn.disabled = false;
      btn.innerHTML = label;
      alert('Versturen lukte niet. Probeer het opnieuw of mail me direct.');
    }
  });
  form.querySelectorAll('[required]').forEach((input) => {
    input.addEventListener('blur', () => {
      if (input.value.trim() === '') return;
      const ok = input.type === 'email' ? /\S+@\S+\.\S+/.test(input.value) : true;
      input.setAttribute('aria-invalid', String(!ok));
      input.closest('.field')?.classList.toggle('has-error', !ok);
    });
  });
});

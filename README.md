# VDM Training — website

Statische site met meerdere pagina's. Geen frameworks.

- `src/layout.html`: header, footer en menu (één keer aanpassen, geldt voor alle pagina's)
- `src/pages/*.html`: de inhoud per pagina
- `assets/`: CSS, JS (`scan.js` = Volhoudscan) en het tijdelijke logo
- `python3 build.py`: bouwt alles naar `site/`. Dat is de map die je online zet (bijv. Netlify of Vercel).

## Nog in te vullen (zoek op `TODO`)
- Prijzen voor online coaching en personal training (`src/pages/aanbod.html`)
- Formulier-endpoint voor de intake en de scan (`data-endpoint=""`)
- Naam, certificering en portretfoto (`src/pages/over-mij.html`)
- Exact adres, Instagram-link, definitief logo

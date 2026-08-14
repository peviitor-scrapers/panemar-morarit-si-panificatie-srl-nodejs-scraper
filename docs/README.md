# job_seeker_ro_spider

**job_seeker_ro_spider** — scraper pentru job-urile Panemar din România.

Extrage rolurile deschise de pe [Panemar — Angajări](https://panemar.ro/angajari/) și le publică în [peviitor.ro](https://peviitor.ro) prin API-ul Peviitor.

> **🌱 This Repo Is a Derived Scraper.** Acest repo este derivat din template-ul [EPAM scraper](https://github.com/sebiboga/epam-systems-international-srl-nodejs-scraper) al ecosistemului peviitor.ro.

## Identificare

Toate request-urile HTTP folosesc User-Agent-ul:

```
job_seeker_ro_spider
```

## Ce face

1. **Validează compania** — interoghează API-ul public ANAF ([demoanaf.ro](https://demoanaf.ro)) după CIF-ul Panemar (4844886) și verifică:
   - Denumirea oficială: PANEMAR MORARIT SI PANIFICATIE SRL
   - Status: activ/inactiv/radiat
   - Adresa completă din registrul comerțului
2. **Cross-validează cu Peviitor** — verifică existența companiei în API-ul Peviitor
3. **Scrape-uiește job-urile** — citește pagina de angajări Panemar (HTML) și extrage rolurile deschise din formularul de aplicare (selectul `menu-117`)
4. **Transformă datele** — normalizează locațiile (doar orașe românești), tag-urile (lowercase), workmode-ul (remote/on-site/hybrid)
5. **Stochează în Peviitor** — upsert prin API-ul Peviitor (job-uri și date companie)
6. **Generează jobs.md** — fișier markdown cu informații companie + toate job-urile curente

## API-uri folosite

| API | URL | Autentificare |
|---|---|---|
| Panemar (HTML) | `https://panemar.ro/angajari/` | Public |
| ANAF (demoanaf) | `https://demoanaf.ro/api/...` | Public |
| Peviitor | `https://api.peviitor.ro/v1/company/` | Public |

## Robots.txt

`https://panemar.ro/robots.txt` este analizat în [ai/ROBOTS.md](../ai/ROBOTS.md). Scraper-ul folosește un singur User-Agent identificabil (`job_seeker_ro_spider`) și o singură cerere pe rulare către pagina de angajări.

## Testare

```bash
# Toate testele
npm test

# Doar unitare
npm run test:unit

# Doar integrare (necesită ANAF live, Peviitor API conditional)
npm run test:integration

# Doar E2E (pagina reală Panemar + ANAF + Peviitor)
npm run test:e2e
```

Testele Peviitor API folosesc `itIfApi` — se auto-skip dacă API-ul Peviitor nu e disponibil.

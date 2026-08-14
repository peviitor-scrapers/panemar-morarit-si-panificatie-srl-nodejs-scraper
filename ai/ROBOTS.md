# Robots.txt Analysis — Panemar

Sursa: https://panemar.ro/robots.txt

## Reguli

```
User-agent: *
Disallow: /wp-content/uploads/wc-logs/
Disallow: /wp-content/uploads/woocommerce_transient_files/
Disallow: /wp-content/uploads/woocommerce_uploads/
Disallow: /*?add-to-cart=
Disallow: /*?*add-to-cart=
Disallow: /wp-admin/
Allow: /wp-admin/admin-ajax.php

Sitemap: https://panemar.ro/sitemap.xml
Sitemap: https://panemar.ro/sitemap.rss
```

## Interpretare

| Cale | Accesibil? | Ce conține |
|---|---|---|
| `/angajari/` | ✅ Allow | Pagina de cariere de la care scraper-ul extrage rolurile |
| `/wp-admin/` | ❌ Disallow | Zona de administrare (nu ne interesează) |
| `/*?add-to-cart=` | ❌ Disallow | Parametrii WooCommerce (nu ne interesează) |
| `/wp-content/uploads/wc-logs/` | ❌ Disallow | Loguri interne (nu ne interesează) |

## Diferență față de EPAM template

| Aspect | EPAM | Panemar |
|---|---|---|
| `robots.txt` | `Disallow: /` (tot site-ul) | Existent, restrictiv doar pe zonele interne |
| Pagina de cariere | Disallowed de robots.txt | **Permisă** (`/angajari/` nefiind disallowed) |
| Sursa datelor | API JSON public (`/api/jobs/v2/...`) | Pagină HTML publică (formular CF7) |
| Pagini individuale de job | Există per job, dar disallowed | Nu există — rolurile sunt synthetic-URL (`#fragment`) |

## Recomandare

robots.txt NU este legal binding, dar reprezintă intenția proprietarului site-ului.

- Pagina de cariere (`/angajari/`) este permisă de robots.txt și răspunde cu 200 OK cu `User-Agent` normal.
- Scraperul face **o singură cerere** pe rulare către pagina de cariere — comportament rezonabil, nu agresiv.
- URL-urile job-urilor generate (`https://panemar.ro/angajari/#brutar`) sunt ancore pe aceeași pagină — nu implică cereri suplimentare.

**Concluzie**: Risc minim. Pagina e publică, permisă de robots.txt, iar scraperul e politicos (User-Agent standard, o singură cerere simultană).

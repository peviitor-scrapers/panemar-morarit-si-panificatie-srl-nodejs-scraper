# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-08-14

### Added
- Initial scraper for **PANEMAR MORARIT SI PANIFICATIE SRL** (CIF: 4844886)
- Extracts roles from the Panemar careers form (`https://panemar.ro/angajari/`) using cheerio on the CF7 `menu-117` select
- ANOFM job enrichment by CIF
- ANAF/CUIScan/CUIFirma company validation with 7-day cache
- Peviitor API upsert (company core + jobs core), stale-job deletion
- Automatic `docs/jobs.md` generation served via GitHub Pages
- GitHub Actions: daily scrape (`job-seeker-ro-spider.yml`) + automation testing
- Derived from the EPAM template (`sebiboga/epam-systems-international-srl-nodejs-scraper`)

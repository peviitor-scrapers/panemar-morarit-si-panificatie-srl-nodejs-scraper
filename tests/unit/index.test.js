import { jest } from '@jest/globals';

const PANEMAR_HTML_FIXTURE = `
<!DOCTYPE html>
<html lang="ro-RO">
<head><title>Angajări - Panemar</title></head>
<body>
  <section class="elementor-section">
    <div class="elementor-widget-container">
      <p><strong>Brutar</strong></p><p>Brutarul este omul înțelept.</p>
      <p><strong>Patiser</strong></p><p>Patiserul este artistul rafinamentului.</p>
      <p><strong>Șofer</strong></p><p>Șoferul are grijă ca produsele să ajungă la timp.</p>
      <p><strong>Muncitor Necalificat</strong></p><p>Credem în potențialul fiecărui om.</p>
    </div>
  </section>
  <div class="elementor-shortcode">
    <div class="wpcf7">
      <form action="/angajari/#wpcf7-f1650-p1365-o1" method="post" class="wpcf7-form init">
        <p><label> Locul de muncă pentru care aplicați<br />
        <span class="wpcf7-form-control-wrap" data-name="menu-117"><select class="wpcf7-form-control wpcf7-select" aria-invalid="false" name="menu-117"><option value="Brutar">Brutar</option><option value="Patiser">Patiser</option><option value="Șofer">Șofer</option><option value="Muncitor necalificat">Muncitor necalificat</option></select></span> </label>
        </p>
      </form>
    </div>
  </div>
</body>
</html>
`;

describe('index.js Component Tests', () => {
  let index;

  beforeAll(async () => {
    index = await import('../../scraper/index.js');
  });

  describe('transformJobsForSOLR', () => {
    it('should filter locations to only Romanian cities', () => {
      const payload = {
        jobs: [
          { url: 'https://test.com/1', title: 'Job 1', location: ['România'] },
          { url: 'https://test.com/2', title: 'Job 2', location: ['Bucharest'] },
          { url: 'https://test.com/3', title: 'Job 3', location: ['Bulgaria'] },
          { url: 'https://test.com/4', title: 'Job 4', location: ['Cluj-Napoca'] },
          { url: 'https://test.com/5', title: 'Job 5', location: [] }
        ]
      };

      const result = index.transformJobsForSOLR(payload);

      expect(result.jobs[0].location).toEqual(['România']);
      expect(result.jobs[1].location).toEqual(['Bucharest']);
      expect(result.jobs[2].location).toEqual(['România']);
      expect(result.jobs[3].location).toEqual(['Cluj-Napoca']);
      expect(result.jobs[4].location).toEqual(['România']);
    });

    it('should keep company uppercase', () => {
      const payload = {
        source: 'panemar.ro',
        company: 'panemar morarit si panificatie srl',
        cif: '4844886',
        jobs: [
          { url: 'https://test.com/1', title: 'Job 1', company: 'panemar morarit', cif: '4844886' }
        ]
      };

      const result = index.transformJobsForSOLR(payload);

      expect(result.company).toBe('PANEMAR MORARIT SI PANIFICATIE SRL');
    });

    it('should normalize workmode values', () => {
      const payload = {
        jobs: [
          { url: 'https://test.com/1', title: 'Job 1', workmode: 'Remote' },
          { url: 'https://test.com/2', title: 'Job 2', workmode: 'ON-SITE' },
          { url: 'https://test.com/3', title: 'Job 3', workmode: 'Hybrid' },
          { url: 'https://test.com/4', title: 'Job 4', workmode: 'hybrid' }
        ]
      };

      const result = index.transformJobsForSOLR(payload);

      expect(result.jobs[0].workmode).toBe('remote');
      expect(result.jobs[1].workmode).toBe('on-site');
      expect(result.jobs[2].workmode).toBe('hybrid');
      expect(result.jobs[3].workmode).toBe('hybrid');
    });

    it('should handle empty jobs array', () => {
      const result = index.transformJobsForSOLR({ jobs: [] });
      expect(result.jobs).toEqual([]);
    });
  });

  describe('mapToJobModel', () => {
    it('should map raw job to job model format', () => {
      const rawJob = {
        url: 'https://panemar.ro/angajari/#brutar',
        title: 'Brutar',
        location: ['Cluj-Napoca'],
        tags: [],
        workmode: 'on-site'
      };

      const COMPANY_NAME = 'PANEMAR MORARIT SI PANIFICATIE SRL';
      const COMPANY_CIF = '4844886';

      const result = index.mapToJobModel(rawJob, COMPANY_CIF, COMPANY_NAME);

      expect(result.url).toBe(rawJob.url);
      expect(result.title).toBe(rawJob.title);
      expect(result.company).toBe(COMPANY_NAME);
      expect(result.cif).toBe(COMPANY_CIF);
      expect(result.location).toEqual(rawJob.location);
      expect(result.workmode).toBe(rawJob.workmode);
      expect(result.status).toBe('scraped');
      expect(result.date).toBeDefined();
    });

    it('should remove undefined fields', () => {
      const rawJob = {
        url: 'https://test.com/1',
        title: 'Job 1'
      };

      const result = index.mapToJobModel(rawJob, '4844886');

      expect(result.location).toBeUndefined();
      expect(result.tags).toBeUndefined();
      expect(result.workmode).toBeUndefined();
    });

    it('should handle missing title', () => {
      const rawJob = { url: 'https://test.com/1' };

      const result = index.mapToJobModel(rawJob, '4844886');

      expect(result.title).toBeUndefined();
      expect(result.url).toBe('https://test.com/1');
    });
  });

  describe('parsePanemarJobs', () => {
    it('should parse the careers page form options into jobs', () => {
      const result = index.parsePanemarJobs(PANEMAR_HTML_FIXTURE);

      expect(result.total).toBe(4);
      expect(result.jobs).toHaveLength(4);

      const titles = result.jobs.map(j => j.title);
      expect(titles).toEqual(['Brutar', 'Patiser', 'Șofer', 'Muncitor necalificat']);

      expect(result.jobs[0].url).toBe('https://panemar.ro/angajari/#brutar');
      expect(result.jobs[2].url).toBe('https://panemar.ro/angajari/#ofer');
      expect(result.jobs[3].url).toBe('https://panemar.ro/angajari/#muncitor-necalificat');
    });

    it('should set default workmode and location', () => {
      const result = index.parsePanemarJobs(PANEMAR_HTML_FIXTURE);

      for (const job of result.jobs) {
        expect(job.workmode).toBe('on-site');
        expect(job.location).toEqual(['Cluj-Napoca']);
      }
    });

    it('should dedupe repeated options', () => {
      const duplicatedHtml = PANEMAR_HTML_FIXTURE.replace(
        '</select>',
        '<option value="Brutar">Brutar</option></select>'
      );

      const result = index.parsePanemarJobs(duplicatedHtml);

      expect(result.jobs).toHaveLength(4);
    });

    it('should handle empty form (no jobs)', () => {
      const emptyHtml = '<html><body><form><select name="menu-117"></select></form></body></html>';

      const result = index.parsePanemarJobs(emptyHtml);

      expect(result.jobs).toEqual([]);
      expect(result.total).toBe(0);
    });

    it('should handle missing form entirely', () => {
      const result = index.parsePanemarJobs('<html><body><p>No careers form</p></body></html>');

      expect(result.jobs).toEqual([]);
    });
  });
});

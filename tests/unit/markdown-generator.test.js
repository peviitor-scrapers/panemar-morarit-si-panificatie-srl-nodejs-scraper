import { generateJobsMarkdown } from "../../scraper/markdown-generator.js";

const baseCompany = {
  id: "4844886",
  company: "PANEMAR MORARIT SI PANIFICATIE SRL",
  brand: "PANEMAR",
  status: "activ",
  location: ["Cluj-Napoca"],
  website: ["https://panemar.ro"],
  career: ["https://panemar.ro/angajari/"],
  lastScraped: "2026-06-17"
};

const baseJob = {
  url: "https://panemar.ro/angajari/#brutar",
  title: "Brutar",
  workmode: "on-site",
  location: ["Cluj-Napoca"],
  tags: ["panificatie"],
  status: "scraped"
};

describe("generateJobsMarkdown", () => {
  describe("company section", () => {
    it("includes company name as h1", () => {
      const md = generateJobsMarkdown(baseCompany, []);
      expect(md).toContain("# PANEMAR MORARIT SI PANIFICATIE SRL");
    });

    it("includes CIF", () => {
      const md = generateJobsMarkdown(baseCompany, []);
      expect(md).toContain("4844886");
    });

    it("includes brand", () => {
      const md = generateJobsMarkdown(baseCompany, []);
      expect(md).toContain("PANEMAR");
    });

    it("includes status", () => {
      const md = generateJobsMarkdown(baseCompany, []);
      expect(md).toContain("activ");
    });

    it("includes website as markdown link", () => {
      const md = generateJobsMarkdown(baseCompany, []);
      expect(md).toContain("[https://panemar.ro](https://panemar.ro)");
    });

    it("includes career page as markdown link", () => {
      const md = generateJobsMarkdown(baseCompany, []);
      expect(md).toContain("[https://panemar.ro/angajari/](https://panemar.ro/angajari/)");
    });

    it("includes lastScraped date", () => {
      const md = generateJobsMarkdown(baseCompany, []);
      expect(md).toContain("2026-06-17");
    });

    it("omits optional fields when not present", () => {
      const minimal = { id: "4844886", company: "PANEMAR MORARIT SI PANIFICATIE SRL" };
      const md = generateJobsMarkdown(minimal, []);
      expect(md).toContain("# PANEMAR MORARIT SI PANIFICATIE SRL");
      expect(md).not.toContain("Brand");
      expect(md).not.toContain("Last Scraped");
    });
  });

  describe("jobs section", () => {
    it("shows job count in heading", () => {
      const md = generateJobsMarkdown(baseCompany, [baseJob]);
      expect(md).toContain("## Current Job Listings (1)");
    });

    it("shows 0 when no jobs", () => {
      const md = generateJobsMarkdown(baseCompany, []);
      expect(md).toContain("## Current Job Listings (0)");
    });

    it("includes job title as h3", () => {
      const md = generateJobsMarkdown(baseCompany, [baseJob]);
      expect(md).toContain("### Brutar");
    });

    it("includes job URL as markdown link", () => {
      const md = generateJobsMarkdown(baseCompany, [baseJob]);
      expect(md).toContain("[https://panemar.ro/angajari/#brutar]");
    });

    it("includes workmode", () => {
      const md = generateJobsMarkdown(baseCompany, [baseJob]);
      expect(md).toContain("on-site");
    });

    it("includes location", () => {
      const md = generateJobsMarkdown(baseCompany, [baseJob]);
      expect(md).toContain("Cluj-Napoca");
    });

    it("includes tags", () => {
      const md = generateJobsMarkdown(baseCompany, [baseJob]);
      expect(md).toContain("panificatie");
    });

    it("includes status", () => {
      const md = generateJobsMarkdown(baseCompany, [baseJob]);
      expect(md).toContain("scraped");
    });

    it("renders multiple jobs", () => {
      const job2 = { ...baseJob, title: "Patiser", url: "https://panemar.ro/angajari/#patiser" };
      const md = generateJobsMarkdown(baseCompany, [baseJob, job2]);
      expect(md).toContain("### Brutar");
      expect(md).toContain("### Patiser");
      expect(md).toContain("## Current Job Listings (2)");
    });

    it("handles job with no optional fields", () => {
      const minimal = { url: "https://panemar.ro/angajari/#sofer", title: "Șofer" };
      const md = generateJobsMarkdown(baseCompany, [minimal]);
      expect(md).toContain("### Șofer");
      expect(md).not.toContain("Work Mode");
      expect(md).not.toContain("Tags");
    });
  });

  describe("output format", () => {
    it("returns a non-empty string", () => {
      const md = generateJobsMarkdown(baseCompany, [baseJob]);
      expect(typeof md).toBe("string");
      expect(md.length).toBeGreaterThan(0);
    });

    it("includes a generated timestamp", () => {
      const md = generateJobsMarkdown(baseCompany, []);
      expect(md).toMatch(/_Generated: \d{4}-\d{2}-\d{2}/);
    });
  });

  describe("markdown escaping", () => {
    it("escapes # in job titles", () => {
      const job = { ...baseJob, title: "C# Developer" };
      const md = generateJobsMarkdown(baseCompany, [job]);
      expect(md).toContain("### C\\# Developer");
    });

    it("escapes * in job titles", () => {
      const job = { ...baseJob, title: "Full-Stack * Developer" };
      const md = generateJobsMarkdown(baseCompany, [job]);
      expect(md).toContain("### Full-Stack \\* Developer");
    });

    it("escapes [ ] in company name", () => {
      const company = { ...baseCompany, company: "ACME [Tech] SRL" };
      const md = generateJobsMarkdown(company, []);
      expect(md).toContain("# ACME \\[Tech\\] SRL");
    });

    it("escapes ` in tags", () => {
      const job = { ...baseJob, tags: ["panificatie", "`bash`"] };
      const md = generateJobsMarkdown(baseCompany, [job]);
      expect(md).toContain("\\`bash\\`");
    });

    it("escapes # in location", () => {
      const job = { ...baseJob, location: ["Building #5"] };
      const md = generateJobsMarkdown(baseCompany, [job]);
      expect(md).toContain("Building \\#5");
    });
  });
});

import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

import { repoRoot } from "./helpers/registry-fixtures";

// /state-of-claude-tooling and /state-of-mcp-servers hand-roll their
// "@type": "Dataset" JSON-LD blocks instead of calling buildReportDataset(),
// and those blocks never got the `distribution` array linking the pages'
// already-working JSON/CSV exports — so structured-data consumers could not
// discover them, unlike the three sibling report pages. Routes are not
// importable in the node suite, so pin the corrected blocks at the source
// level, the same way browse-density-radiogroup.test.ts pins #5454.
const PAGES = [
  {
    route: "apps/web/src/routes/state-of-claude-tooling.tsx",
    exportSlug: "claude-tooling",
  },
  {
    route: "apps/web/src/routes/state-of-mcp-servers.tsx",
    exportSlug: "mcp-servers",
  },
] as const;

for (const { route, exportSlug } of PAGES) {
  describe(`${path.basename(route)} Dataset JSON-LD advertises its exports (#5455)`, () => {
    const source = fs.readFileSync(path.join(repoRoot, route), "utf8");
    const datasetStart = source.indexOf('"@type": "Dataset"');
    // The hand-rolled dataset literal: from the @type key through the closing
    // `};` of the `const dataset = { ... };` statement.
    const datasetBlock = source.slice(
      datasetStart,
      source.indexOf("};", datasetStart),
    );

    it("locates the hand-rolled Dataset block", () => {
      expect(datasetStart).toBeGreaterThan(-1);
    });

    it("links both export formats in a distribution array", () => {
      expect(datasetBlock).toContain("distribution: [");
      expect(datasetBlock).toContain('"@type": "DataDownload"');
      expect(datasetBlock).toContain('encodingFormat: "application/json"');
      expect(datasetBlock).toContain('encodingFormat: "text/csv"');
      expect(datasetBlock).toContain(
        `reportExportUrl("${exportSlug}", "json")`,
      );
      expect(datasetBlock).toContain(`reportExportUrl("${exportSlug}", "csv")`);
    });
  });
}

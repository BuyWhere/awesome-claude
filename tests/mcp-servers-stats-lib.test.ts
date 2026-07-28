import { describe, expect, it } from "vitest";
import { buildMcpServersReport } from "@/lib/mcp-servers-stats-lib";
import { buildMcpServersReport as buildFromWrapper } from "@/lib/mcp-servers-stats";
import { ENTRIES } from "@/data/entries";
import type { Entry } from "@/types/registry";

describe("mcp-servers-stats-lib", () => {
  it("builds a deterministic MCP servers report model", () => {
    const a = buildMcpServersReport(ENTRIES, "2026-07-16");
    const b = buildMcpServersReport(ENTRIES, "2026-07-16");
    expect(a).toEqual(b);
    expect(a.slug).toBe("/state-of-mcp-servers");
    expect(a.exportSlug).toBe("mcp-servers");
    expect(a.total).toBeGreaterThan(100);
    expect(a.dimensions.map((dimension) => dimension.key)).toEqual(
      expect.arrayContaining([
        "transport",
        "hosting",
        "trust",
        "source",
        "install-methods",
      ]),
    );
  });

  it("keeps wrapper re-export aligned", () => {
    expect(buildFromWrapper(ENTRIES, "2026-07-16")).toEqual(
      buildMcpServersReport(ENTRIES, "2026-07-16"),
    );
  });

  it("counts external sources toward Source-backed like index.tsx (#5579)", () => {
    const fixtures = [
      { category: "mcp", source: "first-party" },
      { category: "mcp", source: "source-backed" },
      { category: "mcp", source: "external" },
      { category: "mcp", source: "unverified" },
      { category: "skills", source: "external" },
    ] as Entry[];
    const report = buildMcpServersReport(fixtures, "2026-07-28");
    const sourceBacked = report.stats.find(
      (stat) => stat.key === "source-backed",
    );
    // Before: only first-party + source-backed => 2. After: anything not unverified => 3.
    expect(sourceBacked?.value).toBe(3);
    expect(report.total).toBe(4);
  });
});

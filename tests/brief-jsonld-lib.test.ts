import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

import { briefItemListJsonLd } from "../apps/web/src/lib/brief-jsonld-lib";
import { repoRoot } from "./helpers/registry-fixtures";

describe("briefItemListJsonLd (#5680)", () => {
  it("builds an ItemList named for the Weekly Brief archive", () => {
    const ld = briefItemListJsonLd([]);
    expect(ld["@type"]).toBe("ItemList");
    expect(ld.name).toBe("HeyClaude Weekly Brief archive");
    expect(ld.itemListElement).toEqual([]);
  });

  it("maps issues to positioned Articles", () => {
    const ld = briefItemListJsonLd([
      {
        title: "Issue one",
        date: "2026-01-01",
        summary: "first summary",
      },
      {
        title: "Issue two",
        date: "2026-01-08",
        summary: "second summary",
      },
    ]);
    expect(ld.itemListElement.map((i) => i.position)).toEqual([1, 2]);
    expect(ld.itemListElement[0].item).toMatchObject({
      "@type": "Article",
      headline: "Issue one",
      datePublished: "2026-01-01",
      description: "first summary",
    });
  });
});

describe("/brief archive JSON-LD scripts (#5680)", () => {
  const source = fs.readFileSync(
    path.join(repoRoot, "apps/web/src/routes/brief.tsx"),
    "utf8",
  );

  it("emits BreadcrumbList and ItemList scripts from head()", () => {
    expect(source).toContain("breadcrumbScript([");
    expect(source).toContain('{ name: "Weekly Brief", path: "/brief" }');
    expect(source).toContain("briefItemListJsonLd(BRIEF_ISSUES)");
    expect(source).toContain('type: "application/ld+json"');
  });
});

import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

import { repoRoot } from "./helpers/registry-fixtures";

describe("entry detail robotsIndex noindex enforcement (#5471)", () => {
  // `robotsIndex:false` is documented as the per-entry quality-gate opt-out
  // (sitemap-policy-lib), but the sitemap was the only surface honoring it —
  // the entry's own detail page never emitted a robots meta, so crawlers could
  // still index it via internal links or backlinks. Routes are not importable
  // in the node suite, so pin the guard at the source level, the same way
  // web-platform-pages.test.ts pins the thin-content noindex guard (#5537).
  const noindexGuard =
    '...(e.robotsIndex === false ? [{ name: "robots", content: "noindex, follow" }] : []),';

  it("emits a robots noindex meta for robotsIndex:false entries", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, "apps/web/src/routes/entry.$category.$slug.tsx"),
      "utf8",
    );
    expect(source).toContain(noindexGuard);
  });

  it("uses the same noindex meta shape as the sibling thin-content guards", () => {
    const sibling = fs.readFileSync(
      path.join(repoRoot, "apps/web/src/routes/tags.$tag.tsx"),
      "utf8",
    );
    expect(sibling).toContain('{ name: "robots", content: "noindex, follow" }');
  });
});

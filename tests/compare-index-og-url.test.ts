import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

import { repoRoot } from "./helpers/registry-fixtures";

describe("/compare index og:url (#5679)", () => {
  const source = fs.readFileSync(
    path.join(repoRoot, "apps/web/src/routes/compare.index.tsx"),
    "utf8",
  );

  it("emits og:url pointing at the compare canonical path", () => {
    expect(source).toContain(
      '{ property: "og:url", content: absoluteUrl("/compare") }',
    );
    expect(source).toContain(
      '{ rel: "canonical", href: absoluteUrl("/compare") }',
    );
  });
});

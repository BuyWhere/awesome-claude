import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

import { repoRoot } from "./helpers/registry-fixtures";

describe("saved-search alerts save announcement (#5678)", () => {
  const source = fs.readFileSync(
    path.join(repoRoot, "apps/web/src/components/saved-search-manager.tsx"),
    "utf8",
  );

  it("announces save-alerts result via a polite live region", () => {
    expect(source).toContain('role="status"');
    expect(source).toContain('aria-live="polite"');
    expect(source).toContain("{msg.text}");
    expect(source).toContain("Alerts saved · email confirmed.");
    expect(source).toContain("Saved locally, but:");
  });
});

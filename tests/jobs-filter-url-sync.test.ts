import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

import { repoRoot } from "./helpers/registry-fixtures";

const jobsSource = () =>
  fs.readFileSync(
    path.join(repoRoot, "apps/web/src/routes/jobs.index.tsx"),
    "utf8",
  );

describe("jobs filter bar URL sync (#5711)", () => {
  it("defines validateSearch for all seven filter dimensions and strips defaults", () => {
    const source = jobsSource();
    expect(source).toContain("validateSearch: jobsSearchSchema");
    expect(source).toContain("stripSearchParams(defaultSearch)");
    for (const key of [
      "q",
      "tier",
      "remote",
      "type",
      "freshOnly",
      "featuredOnly",
      "sortMode",
    ]) {
      expect(source).toContain(`${key}:`);
    }
  });

  it("reads filters from Route.useSearch and writes via navigate", () => {
    const source = jobsSource();
    expect(source).toContain("Route.useSearch()");
    expect(source).toContain("Route.useNavigate()");
    expect(source).toContain("useState(sp.q)");
    expect(source).toContain(
      "navigate({ search: (prev: typeof sp) => ({ ...prev, ...patch }) })",
    );
  });
});

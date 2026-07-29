export const RESERVED_OWNERS: ReadonlySet<string>;

export function parseGitHubRepoUrl(value: unknown): {
  host: string;
  owner: string;
  repo: string;
  url: string;
} | null;

/**
 * GitHub lib tests. Mocks fetch so we don't hit the real API.
 * Run: npm test
 */
import { getRepos, summarizeReadme } from "@/lib/github";

const originalFetch = globalThis.fetch;

describe("lib/github", () => {
  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe("getRepos", () => {
    it("returns empty array when API fails", async () => {
      globalThis.fetch = jest.fn(() => Promise.resolve({ ok: false }));
      const repos = await getRepos();
      expect(repos).toEqual([]);
    });

    it("returns mapped repos when API succeeds", async () => {
      globalThis.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              {
                name: "my-repo",
                full_name: "user/my-repo",
                description: "A test repo",
                html_url: "https://github.com/user/my-repo",
                homepage: "https://my-repo.vercel.app",
                default_branch: "main",
                updated_at: "2025-01-01T00:00:00Z",
              },
            ]),
        })
      );
      const repos = await getRepos();
      expect(repos).toHaveLength(1);
      expect(repos[0].name).toBe("my-repo");
      expect(repos[0].description).toBe("A test repo");
      expect(repos[0].homepage).toBe("https://my-repo.vercel.app");
    });
  });

  describe("summarizeReadme", () => {
    it("returns fallback when readme is null", () => {
      expect(summarizeReadme(null, "Fallback text")).toBe("Fallback text");
    });

    it("returns fallback when readme is empty", () => {
      expect(summarizeReadme("", "Fallback")).toBe("Fallback");
    });

    it("returns 'No description.' when both null", () => {
      expect(summarizeReadme(null, null)).toBe("No description.");
    });

    it("strips markdown and truncates to ~240 chars", () => {
      const readme = "# Title\n\n**Bold** and *italic* and [link](url) and `code`.";
      const out = summarizeReadme(readme, null);
      expect(out).not.toMatch(/^#/);
      expect(out).not.toMatch(/\*\*/);
      expect(out.length).toBeLessThanOrEqual(241);
    });
  });
});

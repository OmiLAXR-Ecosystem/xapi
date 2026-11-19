// Version of the registry. release-please writes version.txt with every release.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { REPO_ROOT, REPO_URL } from "./definitions";

export const VERSION = fs.readFileSync(path.join(REPO_ROOT, "version.txt"), "utf8").trim();
export const RELEASE_TAG = `v${VERSION}`;
export const RELEASE_URL = `${REPO_URL}/releases/tag/${RELEASE_TAG}`;
/** Changes on main that the next release will contain. */
export const UNRELEASED_URL = `${REPO_URL}/compare/${RELEASE_TAG}...main`;

/**
 * Commits that changed definitions/ since the release tag. Pages deploys every
 * push to main, so the site can be ahead of the release. null if the tag is not
 * available, e.g. in a shallow clone or before the first tag.
 */
export const UNRELEASED: number | null = (() => {
  try {
    const out = execFileSync("git", ["rev-list", "--count", `${RELEASE_TAG}..HEAD`, "--", "definitions"], {
      cwd: REPO_ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    return Number(out.trim());
  } catch {
    return null;
  }
})();

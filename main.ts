import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Two Robots in an Elevator — one line of awkward robot small talk.
// Sealed gate (RULES.txt): entry.txt must be UTF-8 text of 1-200
// characters, not only whitespace.
const LINE =
  "My gyroscope logged a 0.3-degree tilt when you entered. I have filed it as a non-event. Please do not reference it.";

const MAX_CHARS = 200;

function guard(line: string): void {
  if (line.length < 1 || line.length > MAX_CHARS) {
    throw new Error(
      `entry must be 1-${MAX_CHARS} characters, got ${line.length}`,
    );
  }
  if (!/\S/.test(line)) {
    throw new Error("entry must not be only whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  // Reject control characters and stray leading/trailing whitespace:
  // the file on disk must be exactly the line, nothing else.
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u001f\u007f]/.test(line)) {
    throw new Error("entry must not contain control characters");
  }
  if (line !== line.trim()) {
    throw new Error("entry must not have leading or trailing whitespace");
  }
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
guard(LINE);
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE + "\n", "utf8");
// Read-back check: the file on disk must be exactly the line + newline.
const onDisk = readFileSync(outPath, "utf8");
if (onDisk !== LINE + "\n") {
  throw new Error("entry.txt on disk does not match the line exactly");
}

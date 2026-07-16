// Executes user-submitted code via the public Piston API
// (https://github.com/engineer-man/piston). No API key required.
// Node 18+ provides global fetch, so no extra HTTP dependency is needed.

const PISTON_EXECUTE_URL = "https://emkc.org/api/v2/piston/execute";

// Piston language slugs. "*" as version means "use whatever is installed".
const LANGUAGE_MAP = {
  javascript: { language: "javascript", version: "*", filename: "main.js" },
  python: { language: "python", version: "*", filename: "main.py" },
  cpp: { language: "c++", version: "*", filename: "main.cpp" },
  java: { language: "java", version: "*", filename: "Main.java" },
  sql: { language: "sqlite3", version: "*", filename: "main.sql" },
};

export const SUPPORTED_LANGUAGES = Object.keys(LANGUAGE_MAP);

/**
 * Execute a single piece of code against one stdin input.
 * Returns { stdout, stderr, compileError, timedOut }
 */
export const executeCode = async ({ language, code, stdin = "" }) => {
  const mapped = LANGUAGE_MAP[language];

  if (!mapped) {
    throw new Error(`Unsupported language: ${language}`);
  }

  const body = {
    language: mapped.language,
    version: mapped.version,
    files: [
      {
        name: mapped.filename,
        content: code,
      },
    ],
    stdin,
    run_timeout: 8000,
    compile_timeout: 10000,
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(PISTON_EXECUTE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Judge API error (${response.status}): ${text}`);
    }

    const data = await response.json();

    const compileError =
      data.compile && data.compile.code !== 0 ? data.compile.stderr : null;

    return {
      stdout: data.run?.stdout || "",
      stderr: data.run?.stderr || "",
      compileError,
      timedOut: data.run?.signal === "SIGKILL",
    };
  } finally {
    clearTimeout(timeout);
  }
};

const normalize = (str = "") => str.replace(/\r\n/g, "\n").trim();

/**
 * Run code against a list of {input, output} test cases.
 * Returns { passedCount, totalCount, results: [{passed, input?, expected?, actual, error}] }
 * `exposeInput` controls whether input/expected are included per-result
 * (true for sample/"Run", false for hidden/"Submit" so we don't leak them).
 */
export const runAgainstTestCases = async ({
  language,
  code,
  testCases,
  exposeInput = true,
}) => {
  const results = [];
  let passedCount = 0;

  for (const tc of testCases) {
    try {
      const { stdout, stderr, compileError, timedOut } = await executeCode({
        language,
        code,
        stdin: tc.input,
      });

      if (compileError) {
        results.push({
          passed: false,
          error: "Compilation Error",
          details: compileError.slice(0, 500),
          ...(exposeInput ? { input: tc.input, expected: tc.output } : {}),
        });
        continue;
      }

      if (timedOut) {
        results.push({
          passed: false,
          error: "Time Limit Exceeded",
          ...(exposeInput ? { input: tc.input, expected: tc.output } : {}),
        });
        continue;
      }

      const passed = normalize(stdout) === normalize(tc.output);

      if (passed) passedCount += 1;

      results.push({
        passed,
        actual: stdout.trim(),
        error: stderr ? stderr.slice(0, 500) : null,
        ...(exposeInput ? { input: tc.input, expected: tc.output } : {}),
      });
    } catch (err) {
      results.push({
        passed: false,
        error: err.message,
        ...(exposeInput ? { input: tc.input, expected: tc.output } : {}),
      });
    }
  }

  return {
    passedCount,
    totalCount: testCases.length,
    results,
  };
};

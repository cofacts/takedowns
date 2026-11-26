/**
 * Parsing and execution of admin API commands written in a takedown PR description.
 *
 * A command is a `- API:` line immediately followed by a `- Body:` line and a code fence:
 *
 *   - API: `/moderation/blockUser`
 *   - Body:
 *     ```json
 *     {"userId": "..."}
 *     ```
 *
 * A description can contain several commands. They run in the order they appear.
 * Lines must start with `-` or `*` (after optional indentation), so quoted text such as
 * `> - API: ...` is not picked up.
 *
 * Anything that could run a command the reviewer did not clearly see is an error: API/Body lines
 * inside HTML comments or code blocks, near-miss formats (`+ API:`, `1. API:`, `-API:`), and
 * endpoints that are not plain absolute paths.
 */

const API_LINE = /^[ \t]*[-*][ \t]+API:[ \t]*`([^`\n]+)`[ \t]*$/gm;
const BODY_LINE = /^[ \t]*[-*][ \t]+Body:/gm;

// Right after an API line: optional blank lines, the Body line, then a fenced block.
const BODY_AFTER_API =
  /\n(?:[ \t]*\n)*[ \t]*[-*][ \t]+Body:[ \t]*\n(?:[ \t]*\n)*[ \t]*```(?:json)?[ \t]*\n([\s\S]*?)\n[ \t]*```[ \t]*(?=\n|$)/y;

// Anything that looks like an API/Body line, including near-miss list markers.
const LOOSE_LINE = /^[ \t]*(?:[-*+]|\d+[.)])?[ \t]*(?:API|Body)[ \t]*:/i;
const STRICT_LINE = /^[ \t]*[-*][ \t]+(?:API|Body):/;
const FENCE_LINE = /^[ \t]*(```|~~~)/;
const HTML_COMMENT = /<!--[\s\S]*?(?:-->|$)/g;
const ENDPOINT = /^\/[A-Za-z0-9/_-]+$/;

/**
 * Finds API/Body-like lines the reviewer may not see as commands.
 * @param {string} text - description with CRLF normalized
 * @returns {string[]} errors
 */
function findHiddenOrMalformedLines(text) {
  const errors = [];

  const commentsWithCommands = [...text.matchAll(HTML_COMMENT)].filter((m) =>
    m[0].split('\n').some((line) => LOOSE_LINE.test(line.replace(/^<!--/, '')))
  );
  if (commentsWithCommands.length) {
    errors.push('API/Body lines inside an HTML comment are not allowed');
  }

  let fence = null;
  let inFence = 0;
  let nearMiss = 0;
  for (const line of text.replace(HTML_COMMENT, '').split('\n')) {
    const fenceMatch = line.match(FENCE_LINE);
    if (fenceMatch) {
      if (!fence) fence = fenceMatch[1];
      else if (fenceMatch[1] === fence) fence = null;
      continue;
    }
    if (!LOOSE_LINE.test(line)) continue;
    if (fence) inFence += 1;
    else if (!STRICT_LINE.test(line)) nearMiss += 1;
  }
  if (inFence) {
    errors.push(
      `Found ${inFence} API/Body line(s) inside a code block; quote them with ">" instead`
    );
  }
  if (nearMiss) {
    errors.push(
      `Found ${nearMiss} line(s) that look like API/Body lines but are not written as "- API:" / "- Body:"`
    );
  }

  return errors;
}

/**
 * @param {string} description - PR description
 * @returns {{ commands: {endpoint: string, body: string}[], errors: string[] }}
 *   `errors` is non-empty when the description contains a malformed command; callers should not
 *   execute any command in that case.
 */
export function extractApiCommands(description) {
  const rawText = (description || '').replace(/\r\n/g, '\n');
  const errors = findHiddenOrMalformedLines(rawText);
  const text = rawText.replace(HTML_COMMENT, '');
  const commands = [];
  let consumedBodies = 0;

  let commandNo = 0;
  for (const apiMatch of text.matchAll(API_LINE)) {
    const endpoint = apiMatch[1].trim();
    commandNo += 1;

    BODY_AFTER_API.lastIndex = apiMatch.index + apiMatch[0].length;
    const bodyMatch = BODY_AFTER_API.exec(text);
    if (!bodyMatch) {
      errors.push(
        `Command #${commandNo} (${endpoint}): "- API:" must be directly followed by "- Body:" and a code block`
      );
      continue;
    }
    consumedBodies += 1;

    if (!ENDPOINT.test(endpoint)) {
      errors.push(
        `Command #${commandNo} (${endpoint}): endpoint must be an absolute path such as /moderation/blockUser`
      );
      continue;
    }

    const body = bodyMatch[1].trim();
    try {
      JSON.parse(body);
    } catch (e) {
      errors.push(
        `Command #${commandNo} (${endpoint}): invalid JSON body: ${e.message}`
      );
      continue;
    }

    commands.push({ endpoint, body });
  }

  const bodyCount = [...text.matchAll(BODY_LINE)].length;
  if (bodyCount > consumedBodies) {
    errors.push(
      `Found ${
        bodyCount - consumedBodies
      } "- Body:" line(s) not directly after an "- API:" line`
    );
  }

  return { commands, errors };
}

/**
 * Runs commands one by one and stops at the first failure.
 *
 * @param {{endpoint: string, body: string}[]} commands
 * @param {(endpoint: string, body: string) => Promise<{ok: boolean, status: number, data: unknown}>} call
 * @returns {Promise<{endpoint: string, status: 'SUCCESS'|'FAILED'|'NOT_RUN', detail?: string}[]>}
 */
export async function runApiCommands(commands, call) {
  const results = [];
  let failed = false;

  for (const { endpoint, body } of commands) {
    if (failed) {
      results.push({ endpoint, status: 'NOT_RUN' });
      continue;
    }

    try {
      const { ok, status, data } = await call(endpoint, body);
      const detail = JSON.stringify(data, null, 2);
      if (ok) {
        results.push({ endpoint, status: 'SUCCESS', detail });
      } else {
        failed = true;
        results.push({
          endpoint,
          status: 'FAILED',
          detail: `HTTP ${status}\n${detail}`,
        });
      }
    } catch (e) {
      failed = true;
      results.push({ endpoint, status: 'FAILED', detail: e.message });
    }
  }

  return results;
}

const MAX_DETAIL_LENGTH = 4000;
const MAX_COMMENT_LENGTH = 60000;

function truncate(str, maxLength) {
  return str.length <= maxLength
    ? str
    : `${str.slice(0, maxLength)}\n… (truncated, ${
        str.length - maxLength
      } more characters; see the workflow log)`;
}

const STATUS_LABEL = {
  SUCCESS: '✅ Succeeded',
  FAILED: '❌ Failed',
  NOT_RUN: '⏭️ Not run (an earlier command failed)',
};

/**
 * @param {Awaited<ReturnType<typeof runApiCommands>>} results
 * @returns {string} Markdown for the PR comment
 */
export function formatResultsComment(results) {
  const failed = results.some(({ status }) => status !== 'SUCCESS');
  const skipped = results.some(({ status }) => status === 'NOT_RUN');
  const heading = !failed
    ? `✅ All ${results.length} API call(s) executed successfully!`
    : skipped
    ? '❌ An API call failed. Commands after the failed one were not run.'
    : '❌ An API call failed.';

  const sections = results.map(({ endpoint, status, detail }, i) =>
    [
      `### ${i + 1}. \`${endpoint}\` — ${STATUS_LABEL[status]}`,
      ...(detail ? ['```', truncate(detail, MAX_DETAIL_LENGTH), '```'] : []),
    ].join('\n')
  );

  // GitHub rejects comments longer than 65536 characters
  return truncate([heading, ...sections].join('\n\n'), MAX_COMMENT_LENGTH);
}

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
 */

const API_LINE = /^[ \t]*[-*][ \t]+API:[ \t]*`([^`\n]+)`[ \t]*$/gm;
const BODY_LINE = /^[ \t]*[-*][ \t]+Body:/gm;

// Right after an API line: optional blank lines, the Body line, then a fenced block.
const BODY_AFTER_API =
  /\n(?:[ \t]*\n)*[ \t]*[-*][ \t]+Body:[ \t]*\n(?:[ \t]*\n)*[ \t]*```(?:json)?[ \t]*\n([\s\S]*?)\n[ \t]*```/y;

/**
 * @param {string} description - PR description
 * @returns {{ commands: {endpoint: string, body: string}[], errors: string[] }}
 *   `errors` is non-empty when the description contains a malformed command; callers should not
 *   execute any command in that case.
 */
export function extractApiCommands(description) {
  const text = (description || '').replace(/\r\n/g, '\n');
  const commands = [];
  const errors = [];
  let consumedBodies = 0;

  for (const apiMatch of text.matchAll(API_LINE)) {
    const endpoint = apiMatch[1].trim();
    const commandNo = commands.length + errors.length + 1;

    BODY_AFTER_API.lastIndex = apiMatch.index + apiMatch[0].length;
    const bodyMatch = BODY_AFTER_API.exec(text);
    if (!bodyMatch) {
      errors.push(
        `Command #${commandNo} (${endpoint}): "- API:" must be directly followed by "- Body:" and a code block`
      );
      continue;
    }
    consumedBodies += 1;

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
  const heading = failed
    ? '❌ Some API calls failed. Commands after the failed one were not run.'
    : `✅ All ${results.length} API call(s) executed successfully!`;

  const sections = results.map(({ endpoint, status, detail }, i) =>
    [
      `### ${i + 1}. \`${endpoint}\` — ${STATUS_LABEL[status]}`,
      ...(detail ? ['```', detail, '```'] : []),
    ].join('\n')
  );

  return [heading, ...sections].join('\n\n');
}

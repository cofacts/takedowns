import {
  extractApiCommands,
  runApiCommands,
  formatResultsComment,
} from '../apiCommands';

const block = (endpoint, body, indent = '') =>
  [
    `${indent}- API: \`${endpoint}\``,
    `${indent}- Body:`,
    `${indent}  \`\`\`json`,
    `${indent}  ${body}`,
    `${indent}  \`\`\``,
  ].join('\n');

describe('extractApiCommands', () => {
  it('returns nothing for a description without commands', () => {
    expect(extractApiCommands('Just an announcement')).toEqual({
      commands: [],
      errors: [],
    });
    expect(extractApiCommands(undefined)).toEqual({ commands: [], errors: [] });
  });

  it('extracts a single command in the documented format', () => {
    const description = `Takedown command:\n${block(
      '/moderation/blockUser',
      '{"userId":"u1","blockedReason":"https://example.com"}'
    )}\n\nSome footer`;

    expect(extractApiCommands(description)).toEqual({
      commands: [
        {
          endpoint: '/moderation/blockUser',
          body: '{"userId":"u1","blockedReason":"https://example.com"}',
        },
      ],
      errors: [],
    });
  });

  it('accepts unindented fences, no json tag, CRLF and blank lines between', () => {
    const description = [
      '* API: `/moderation/blockUser`',
      '',
      '* Body:',
      '```',
      '{',
      '  "userId": "u1"',
      '}',
      '```',
    ].join('\r\n');

    expect(extractApiCommands(description)).toEqual({
      commands: [
        { endpoint: '/moderation/blockUser', body: '{\n  "userId": "u1"\n}' },
      ],
      errors: [],
    });
  });

  it('extracts multiple commands in order', () => {
    const description = [
      'Takedown commands:',
      block('/moderation/blockUser', '{"userId":"u1"}', '  '),
      block(
        '/moderation/article/transcript',
        '{"articles":[{"articleId":"a1","versionCreatedAt":"2026-11-19T00:00:00.000Z"}]}',
        '  '
      ),
    ].join('\n');

    const { commands, errors } = extractApiCommands(description);
    expect(errors).toEqual([]);
    expect(commands.map(({ endpoint }) => endpoint)).toEqual([
      '/moderation/blockUser',
      '/moderation/article/transcript',
    ]);
    expect(JSON.parse(commands[1].body).articles[0].articleId).toBe('a1');
  });

  it('ignores quoted commands', () => {
    const description = [
      '> - API: `/moderation/blockUser`',
      '> - Body:',
      '> ```json',
      '> {"userId":"quoted"}',
      '> ```',
      'Inline mention of - API: `/foo` in a sentence',
    ].join('\n');

    expect(extractApiCommands(description)).toEqual({
      commands: [],
      errors: [],
    });
  });

  it('reports an API line without a body directly after it', () => {
    const description = [
      '- API: `/moderation/blockUser`',
      'Some text in between',
      '- Body:',
      '```json',
      '{"userId":"u1"}',
      '```',
    ].join('\n');

    expect(extractApiCommands(description).errors).toEqual([
      'Command #1 (/moderation/blockUser): "- API:" must be directly followed by "- Body:" and a code block',
      'Found 1 "- Body:" line(s) not directly after an "- API:" line',
    ]);
  });

  it('reports a body without an API line', () => {
    const description = [
      block('/moderation/blockUser', '{"userId":"u1"}'),
      '- Body:',
      '```json',
      '{"userId":"u2"}',
      '```',
    ].join('\n');

    const { commands, errors } = extractApiCommands(description);
    expect(commands).toHaveLength(1);
    expect(errors).toEqual([
      'Found 1 "- Body:" line(s) not directly after an "- API:" line',
    ]);
  });

  it('reports invalid JSON', () => {
    const { commands, errors } = extractApiCommands(
      block('/moderation/blockUser', '{"userId":')
    );
    expect(commands).toEqual([]);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(
      /^Command #1 \(\/moderation\/blockUser\): invalid JSON body:/
    );
  });
});

describe('extractApiCommands: commands a reviewer may not see', () => {
  const hidden = block('/moderation/blockUser', '{"userId":"hidden"}');

  it('rejects commands inside an HTML comment', () => {
    expect(extractApiCommands(`<!--\n${hidden}\n-->`)).toEqual({
      commands: [],
      errors: ['API/Body lines inside an HTML comment are not allowed'],
    });
    // Unclosed comment hides the rest of the description
    expect(extractApiCommands(`<!--\n${hidden}`).errors).toEqual([
      'API/Body lines inside an HTML comment are not allowed',
    ]);
  });

  it('rejects commands inside a code block', () => {
    const description = [
      block('/moderation/blockUser', '{"userId":"u1"}'),
      'Quoted from an old PR:',
      '```text',
      hidden,
      '```',
    ].join('\n');

    expect(extractApiCommands(description).errors).toEqual([
      'Found 2 API/Body line(s) inside a code block; quote them with ">" instead',
    ]);
  });

  it('rejects near-miss list markers', () => {
    const description = [
      '+ API: `/moderation/blockUser`',
      '+ Body:',
      '```json',
      '{"userId":"u1"}',
      '```',
      '1. API: `/moderation/blockUser`',
      '-API: `/moderation/blockUser`',
    ].join('\n');

    expect(extractApiCommands(description).errors).toEqual([
      'Found 4 line(s) that look like API/Body lines but are not written as "- API:" / "- Body:"',
    ]);
  });

  it('rejects endpoints that are not plain absolute paths', () => {
    const { errors } = extractApiCommands(
      [
        block('.evil.example/x', '{}'),
        block('@evil.example/', '{}'),
        block('/moderation/blockUser?x=1', '{}'),
      ].join('\n')
    );
    expect(errors).toEqual([
      'Command #1 (.evil.example/x): endpoint must be an absolute path such as /moderation/blockUser',
      'Command #2 (@evil.example/): endpoint must be an absolute path such as /moderation/blockUser',
      'Command #3 (/moderation/blockUser?x=1): endpoint must be an absolute path such as /moderation/blockUser',
    ]);
  });

  it('does not treat another opening fence as the closing fence', () => {
    const description = [
      '- API: `/a`',
      '- Body:',
      '```json',
      '{"a":1}',
      '```json',
      '```',
    ].join('\n');

    const { commands, errors } = extractApiCommands(description);
    expect(commands).toEqual([]);
    expect(errors[0]).toMatch(/^Command #1 \(\/a\): invalid JSON body:/);
  });
});

describe('runApiCommands', () => {
  const commands = [
    { endpoint: '/a', body: '{}' },
    { endpoint: '/b', body: '{}' },
    { endpoint: '/c', body: '{}' },
  ];

  it('runs all commands in order', async () => {
    const calls = [];
    const results = await runApiCommands(commands, async (endpoint) => {
      calls.push(endpoint);
      return { ok: true, status: 200, data: { endpoint } };
    });

    expect(calls).toEqual(['/a', '/b', '/c']);
    expect(results.map(({ status }) => status)).toEqual([
      'SUCCESS',
      'SUCCESS',
      'SUCCESS',
    ]);
  });

  it('stops at the first failure', async () => {
    const calls = [];
    const results = await runApiCommands(commands, async (endpoint) => {
      calls.push(endpoint);
      if (endpoint === '/b') return { ok: false, status: 400, data: { e: 1 } };
      return { ok: true, status: 200, data: {} };
    });

    expect(calls).toEqual(['/a', '/b']);
    expect(results).toEqual([
      { endpoint: '/a', status: 'SUCCESS', detail: '{}' },
      { endpoint: '/b', status: 'FAILED', detail: 'HTTP 400\n{\n  "e": 1\n}' },
      { endpoint: '/c', status: 'NOT_RUN' },
    ]);
  });

  it('treats a thrown error as failure', async () => {
    const results = await runApiCommands(commands.slice(0, 2), async () => {
      throw new Error('network down');
    });
    expect(results).toEqual([
      { endpoint: '/a', status: 'FAILED', detail: 'network down' },
      { endpoint: '/b', status: 'NOT_RUN' },
    ]);
  });
});

describe('formatResultsComment', () => {
  it('does not mention skipped commands when none were skipped', () => {
    expect(
      formatResultsComment([
        { endpoint: '/a', status: 'FAILED', detail: 'x' },
      ]).split('\n')[0]
    ).toBe('❌ An API call failed.');
  });

  it('keeps the comment under GitHub limits', () => {
    const detail = 'x'.repeat(10000);
    const comment = formatResultsComment(
      Array.from({ length: 20 }, () => ({
        endpoint: '/a',
        status: 'SUCCESS',
        detail,
      }))
    );
    expect(comment.length).toBeLessThan(65536);
    expect(comment).toContain('(truncated, 6000 more characters');
  });

  it('summarizes success', () => {
    expect(
      formatResultsComment([
        { endpoint: '/a', status: 'SUCCESS', detail: '{}' },
      ])
    ).toMatchInlineSnapshot(`
      "✅ All 1 API call(s) executed successfully!

      ### 1. \`/a\` — ✅ Succeeded
      \`\`\`
      {}
      \`\`\`"
    `);
  });

  it('summarizes failure', () => {
    expect(
      formatResultsComment([
        { endpoint: '/a', status: 'FAILED', detail: 'HTTP 500\n{}' },
        { endpoint: '/b', status: 'NOT_RUN' },
      ])
    ).toMatchInlineSnapshot(`
      "❌ An API call failed. Commands after the failed one were not run.

      ### 1. \`/a\` — ❌ Failed
      \`\`\`
      HTTP 500
      {}
      \`\`\`

      ### 2. \`/b\` — ⏭️ Not run (an earlier command failed)"
    `);
  });
});

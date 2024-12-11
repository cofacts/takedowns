import 'dotenv/config';

/**
 * @param {string} query - the query to execute in Cofacts GraphQL
 * @param {object} variables
 * @returns {object} Result from Cofacts GraphQL
 */
async function graphql(query, variables = {}) {
  const resp = await fetch(process.env.COFACTS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!resp.ok) {
    console.log('graphql query:', JSON.stringify({ query, variables }));
    throw new Error(`HTTP error! status: ${resp.status}`);
  }

  return resp.json();
}

// Async generator that gets a batch of replies with createdAt between `from` and `to`.
// The generator encapsulates complex pagination logic so that the function using it can focus on
// batch processing logic without worrying pagination.
//
export async function* getRepliesInBatch(from, to) {
  // Get pageInfo outside the loop since it's expensive for rumors-api
  const {
    data: {
      ListReplies: {
        pageInfo: { lastCursor },
      },
    },
  } = await graphql(
    `
      query ListRepliesStat($from: String!, $to: String!) {
        ListReplies(
          filter: { createdAt: { GT: $from, LT: $to } }
          orderBy: { createdAt: DESC }
        ) {
          pageInfo {
            firstCursor
            lastCursor
          }
          totalCount
        }
      }
    `,
    { from, to }
  );

  let after = null;
  while (lastCursor !== after) {
    // Actually loads `edges` and process.
    const {
      data: { ListReplies },
    } = await graphql(
      `
        query RepliesBetween($from: String!, $to: String!, $after: String) {
          ListReplies(
            filter: { createdAt: { GT: $from, LT: $to } }
            after: $after
            first: 25
            orderBy: { createdAt: DESC }
          ) {
            edges {
              node {
                id
                text
                status
                createdAt
                user {
                  id
                  name
                }
              }
              cursor
            }
          }
        }
      `,
      { from, to, after }
    );

    yield ListReplies.edges
      .filter(({ node }) => node.status !== 'BLOCKED')
      .map(({ node }) => node);

    // next graphql call should go after the last cursor of this page
    after = ListReplies.edges[ListReplies.edges.length - 1].cursor;
  }
}

// Get user's latest 10 replies
export async function getUserReplies(uid) {
  const {
    data: { ListReplies },
  } = await graphql(
    `
      query GetUserReplies($uid: String!) {
        ListReplies(
          filter: { userId: $uid }
          first: 10
          orderBy: { createdAt: DESC }
        ) {
          edges {
            node {
              id
              text
              createdAt
            }
          }
        }
      }
    `,
    { uid }
  );
  return ListReplies.edges.map(({ node }) => node);
}

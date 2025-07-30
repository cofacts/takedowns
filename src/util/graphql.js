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
            lastCursor
          }
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

/**
 * Async generator that gets a batch of reply requests with createdAt between `from` and `to`.
 * The generator encapsulates complex pagination logic so that the function using it can focus on
 * batch processing logic without worrying pagination.
 */
export async function* getReplyRequestsInBatch(from, to) {
  // Get pageInfo outside the loop since it's expensive for rumors-api
  const {
    data: {
      ListReplyRequests: {
        pageInfo: { lastCursor },
      },
    },
  } = await graphql(
    `
      query ListReplyRequestsStat($from: String!, $to: String!) {
        ListReplyRequests(
          filter: { createdAt: { GT: $from, LT: $to } }
          orderBy: { createdAt: DESC }
        ) {
          pageInfo {
            lastCursor
          }
        }
      }
    `,
    { from, to }
  );

  let after = null;
  while (lastCursor !== after) {
    // Actually loads `edges` and process.
    const {
      data: { ListReplyRequests },
    } = await graphql(
      `
        query ReplyRequestsBetween(
          $from: String!
          $to: String!
          $after: String
        ) {
          ListReplyRequests(
            filter: { createdAt: { GT: $from, LT: $to } }
            after: $after
            first: 25
            orderBy: { createdAt: DESC }
          ) {
            edges {
              node {
                id
                articleId
                userId
                createdAt
                status
                reason
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

    yield ListReplyRequests.edges
      .filter(({ node }) => node.status !== 'BLOCKED')
      .map(({ node }) => ({
        ...node,
        text: node.reason, // Map reason to text to reuse getSpamList
        id: node.articleId, // Override id with articleId for createPullRequest
      }));

    // next graphql call should go after the last cursor of this page
    after = ListReplyRequests.edges[ListReplyRequests.edges.length - 1].cursor;
  }
}

/**
 * Get user's latest 10 reply requests
 */
export async function getUserReplyRequests(uid) {
  const {
    data: { ListReplyRequests },
  } = await graphql(
    `
      query GetUserReplyRequests($uid: String!) {
        ListReplyRequests(
          filter: { userId: $uid }
          first: 10
          orderBy: { createdAt: DESC }
        ) {
          edges {
            node {
              id
              articleId
              reason
              createdAt
            }
          }
        }
      }
    `,
    { uid }
  );
  return ListReplyRequests.edges.map(({ node }) => ({
    ...node,
    text: node.reason, // Map reason to text to reuse getSpamList
    id: node.articleId, // Override id with articleId for createPullRequest
  }));
}

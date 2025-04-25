import {
  getRepliesInBatch,
  getUserReplies,
  getArticlesInBatch,
  getReplyRequestsInBatch,
  getUserReplyRequests,
  getUserArticles,
} from './util/graphql.js';
import { getSpamList } from './getSpamList.js';
import {
  getAllPRs,
  createPullRequest,
  updateEnvironmentVariable,
} from './githubPR.js';

const knownUsers = new Set();
const seenTexts = new Set();

async function initKnownUsers() {
  const list = await getAllPRs();
  list.forEach((pr) => {
    // get userid from lastWord of pr title
    const title = pr.title;
    if (title.startsWith('Takedown spam user')) {
      const userid = pr.title.slice(pr.title.lastIndexOf(' ') + 1);
      // console.log('userid: ', userid);
      if (!knownUsers.has(userid)) knownUsers.add(userid);
    }
  });
}

/**
 * Generic function to process potential spam content from a specific date
 * @param {Date} date - Date to scan from
 * @param {Function} getBatchFn - Batch retrieval function to fetch content (getRepliesInBatch, getArticlesInBatch, etc.)
 * @param {Function} getUserHistoryFn - function to get user history of specific type for creating PRs
 * @param {string} contentType - Type of content being processed ('reply', 'article', or 'replyRequest')
 * @returns {Promise<Array>} - List of processed unique spam items
 */
async function processSpamContentFromDate(
  date,
  getBatchFn,
  getUserHistoryFn,
  contentType
) {
  try {
    let spamContentItems = [];

    // get all content from date to now
    for await (const contentItems of getBatchFn(
      date.toISOString(),
      new Date().toISOString()
    )) {
      console.log(`${contentType}s: `, contentItems);
      // filter out known users and duplicate texts
      const filteredContentItems = contentItems.filter((item) => {
        if (!knownUsers.has(item.user.id) && !seenTexts.has(item.text)) {
          seenTexts.add(item.text);
          return true;
        }
        return false;
      });

      const list = await getSpamList(filteredContentItems);

      // add new spam users to knownUsers, we only need to create PR for them once
      list.forEach((item) => {
        knownUsers.add(item.user.id);
      });

      spamContentItems = spamContentItems.concat(list);
    }

    // deduplicate
    const spamContentMap = new Map();
    spamContentItems.forEach((item) => {
      if (!spamContentMap.get(item.user.id)) {
        spamContentMap.set(item.user.id, item);
      }
    });
    const uniqueSpamItems = Array.from(spamContentMap.values());

    await Promise.all(
      uniqueSpamItems.map(async ({ id, user, text, createdAt }) => {
        console.log('user: ', user.id, user.name, 'createdAt: ', createdAt);
        const userHistory = await getUserHistoryFn(user.id);
        await createPullRequest({
          id,
          userId: user.id,
          userName: user.name,
          spamContent: text,
          createdAt,
          userHistory,
          contentType,
        });
      })
    );
    return uniqueSpamItems;
  } catch (error) {
    console.error('Error:', error.message);
    return [];
  }
}

// Use the generic function for replies
async function processSpamRepliesFromDate(date) {
  return processSpamContentFromDate(
    date,
    getRepliesInBatch,
    getUserReplies,
    'reply'
  );
}

// Use the generic function for articles
async function processSpamArticlesFromDate(date) {
  return processSpamContentFromDate(
    date,
    getArticlesInBatch,
    getUserArticles,
    'article'
  );
}

// Use the generic function for reply requests
async function processSpamReplyRequestsFromDate(date) {
  return processSpamContentFromDate(
    date,
    getReplyRequestsInBatch,
    getUserReplyRequests,
    'replyRequest'
  );
}

async function main() {
  await initKnownUsers();

  const lastScannedAt = new Date(process.env.LAST_SCANNED_AT);
  // write last scanned time to github environment variable
  await updateEnvironmentVariable(
    process.env.ENV,
    'LAST_SCANNED_AT',
    new Date().toISOString()
  );
  await processSpamRepliesFromDate(lastScannedAt);
  await processSpamArticlesFromDate(lastScannedAt);
  await processSpamReplyRequestsFromDate(lastScannedAt);
}

main().catch((err) => {
  console.error('Main function error:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

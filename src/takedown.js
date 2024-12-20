import { getRepliesInBatch, getUserReplies } from './util/graphql.js';
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

async function processSpamRepliesFromDate(date) {
  try {
    let allSpamReplies = [];

    // get all replies from date to now
    for await (const replies of getRepliesInBatch(
      date.toISOString(),
      new Date().toISOString()
    )) {
      // filter out known users and duplicate texts
      const filteredReplies = replies.filter((reply) => {
        if (!knownUsers.has(reply.user.id) && !seenTexts.has(reply.text)) {
          seenTexts.add(reply.text);
          return true;
        }
        return false;
      });

      const list = await getSpamList(filteredReplies);

      // add new spam users to knownUsers, we only need to create PR for them once
      list.forEach((reply) => {
        knownUsers.add(reply.user.id);
      });

      allSpamReplies = allSpamReplies.concat(list);
    }

    // deduplicate
    const replyMap = new Map();
    allSpamReplies.forEach((reply) => {
      if (!replyMap.get(reply.user.id)) {
        replyMap.set(reply.user.id, reply);
      }
    });
    const uniqueSpamReplies = Array.from(replyMap.values());

    await Promise.all(
      uniqueSpamReplies.map(async ({ id, user, text, createdAt }) => {
        console.log('user: ', user.id, user.name, 'createdAt: ', createdAt);
        const userReplyHistory = await getUserReplies(user.id);
        await createPullRequest({
          id,
          userId: user.id,
          userName: user.name,
          spamContent: text,
          createdAt,
          userReplyHistory,
        });
      })
    );
  } catch (error) {
    console.error('Error:', error.message);
    return [];
  }
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

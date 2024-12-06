import { getRepliesInBatch, getUserReplies } from './util/graphql.js';
import { getSpamList } from './getSpamList.js';
import { createPullRequest } from './createPR.js';

const knownUsers = new Set();

async function getSpamRepliesFromDate(date) {
  try {
    let allSpamReplies = [];

    // get all replies from date to now
    for await (const replies of getRepliesInBatch(
      date.toISOString(),
      new Date().toISOString()
    )) {
      // filter out known users
      const filteredReplies = replies.filter(
        (reply) => !knownUsers.has(reply.user.id)
      );

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
          spam_content: text,
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

function getDateBeforeDays(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(6, 0, 0, 0);
  return date;
}

async function main() {
  await getSpamRepliesFromDate(getDateBeforeDays(20));
}

main();

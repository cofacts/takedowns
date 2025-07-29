import 'dotenv/config';
import { Octokit } from '@octokit/rest';
import { createAppAuth } from '@octokit/auth-app';

// set up target repo and branch
const owner = 'cofacts';
const repo = 'takedowns';
const prTargetBranch = 'master';

let cachedOctokit;
async function getGithubApp() {
  if (cachedOctokit) return cachedOctokit;
  const appId = process.env.GITHUBAPP_ID;

  // for easier to read from env, we base64 encode the private key
  const privateKey = Buffer.from(
    process.env.GITHUBAPP_PRIVATE_KEY_BASE64,
    'base64'
  ).toString('utf-8');
  const installationId = process.env.GITHUBAPP_INSTALLATION_ID;

  const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId,
      privateKey,
      installationId,
    },
  });
  cachedOctokit = octokit;
  return octokit;
}

function ellipsis(text, maxLength = 40) {
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength - 2)}⋯⋯`;
}

const textMap = {
  reply: '查核回應',
  replyRequest: '回報補充',
};

const communityBuilderTypeMap = {
  reply: 0,
  replyRequest: 2,
};

const urlMap = {
  reply: 'reply',
  replyRequest: 'article', // Currently there is no direct link to replyRequest, so use article instead
};

/**
 * Creates a pull request for takedown of spam content
 *
 * @param {Object} params - Parameters for creating a PR
 * @param {string} params.id - The ID of the spam content
 * @param {string} params.userId - The ID of the user who created the spam content
 * @param {string} params.userName - The name of the user who created the spam content
 * @param {string} params.spamContent - The content that was marked as spam
 * @param {string} params.createdAt - The creation date of the spam content
 * @param {Array} params.userHistory - Array of user's previous content
 * @param {string} params.contentType - Type of content ('reply', 'replyRequest')
 * @returns {Object} The created pull request data
 */
export async function createPullRequest({
  id,
  userId,
  userName,
  spamContent,
  createdAt,
  userHistory,
  contentType,
}) {
  try {
    const octokit = await getGithubApp();

    const formatter = new Intl.DateTimeFormat('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const today = new Date();
    const [year, month, day] = formatter.format(today).split('/');

    const spammerNameWithLinkToTheirWork = `[${userName}](https://cofacts.github.io/community-builder/#/editorworks?type=${communityBuilderTypeMap[contentType]}&day=365&userId=${userId})`;

    // Currently there is no direct link to replyRequest, so use article and articleId instead
    const trimmedContent = `[${textMap[contentType]}](${
      process.env.COFACTS_URL
    }/${urlMap[contentType]}/${id})<br>\`${ellipsis(spamContent, 300)}\``;
    const contentDate = Intl.DateTimeFormat('zh-TW', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
      timeZone: 'Asia/Taipei',
    }).format(new Date(createdAt));

    const tableRows = userHistory.map(({ id, text, createdAt }) => {
      // `\n` character will break github markdown table, remove it
      const textWithoutNewlines = text.replace(/\n/g, ' ');
      const trimmedContent = `[${ellipsis(textWithoutNewlines)}](${
        process.env.COFACTS_URL
      }/${urlMap[contentType]}/${id})`;
      const contentDate = Intl.DateTimeFormat('zh-TW', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
        timeZone: 'Asia/Taipei',
      }).format(new Date(createdAt));

      // |發佈時間|回應內容|
      return `| ${contentDate} | ${trimmedContent} |`;
    });

    // file name, commit message, file content
    const fileName = `${year}/${month}${day}-${userId}.md`;
    const commitMessage = `Takedown spam user ${userName} ${userId} via Takedown Bot`;
    const fileContent = `${formatter.format(today)} 公告違規帳號與處理方式
=========

以下 Cofacts 真的假的網站使用者發表之內容，經機器人偵測、Cofacts 真的假的工作小組（Cofacts WG）判定後，認為其違反[Cofacts 真的假的 網站使用者條款](https://github.com/cofacts/rumors-site/blob/master/LEGAL.md)，故 Cofacts WG 依照網站使用者條款一、6 與三、4，對相關內容進行處置如下。

使用者: ${spammerNameWithLinkToTheirWork}

偵測違規內容: ${trimmedContent}

發佈時間: ${contentDate}

同一使用者發布之其他內容:

|發佈時間|內容|
|---|---|
${tableRows.join('\n')}

經 Cofacts WG 研判，此使用者近期之所有內容均違反使用者條款（例如不斷進行廣告行為），故循[前例](https://github.com/cofacts/takedowns/blob/master/2021/1125-2nd-spam.md)，針對被檢舉人進行下面處置：
1. 於資料庫中註記此使用者為被封鎖的使用者，檢附此公告的連結。
2. 隱藏此使用者的所有「回應」、「補充」、與「評價」。
3. 透過被檢舉人登入過的瀏覽器，仍可在網站上看到自己的回應、補充與評價。
`;

    // PR title and description
    const prTitle = `Takedown spam user ${userName} ${userId}`;
    const prDescription = `This PR was created by Takedown Bot

Takedown command:
- API: \`/moderation/blockUser\`
- Body:
  \`\`\`json
    {"userId":"${userId}", "blockedReason":"https://github.com/cofacts/takedowns/blob/master/${fileName}"}
  \`\`\`
`;

    // fetch target branch
    const { data: refData } = await octokit.rest.git.getRef({
      owner,
      repo,
      ref: `heads/${prTargetBranch}`,
    });
    const mainSha = refData.object.sha;

    // create branch
    const branchName = `takedown/user-${userId}`;
    await octokit.rest.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${branchName}`,
      sha: mainSha,
    });

    // create file
    await octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: fileName,
      message: commitMessage,
      content: Buffer.from(fileContent).toString('base64'),
      branch: branchName,
    });

    // create Pull Request
    console.log('Creating PR...', id, userId, userName, createdAt);

    const { data: prData } = await octokit.rest.pulls.create({
      owner,
      repo,
      title: prTitle,
      body: prDescription,
      head: branchName,
      base: prTargetBranch,
    });

    return prData;
  } catch (error) {
    console.error('Error creating PR:', error);
    throw error;
  }
}

export async function getAllPRs() {
  try {
    let allPRs = [];
    let page = 1;
    const octokit = await getGithubApp();
    let hasPRs = false;
    do {
      const {
        data: { items: prs },
      } = await octokit.rest.search.issuesAndPullRequests({
        q: `repo:${owner}/${repo} is:pr in:title "Takedown spam user"`,
        per_page: 100, // get 100 pr per page
        page: page,
        advanced_search: true, // Use advanced search to avoid deprecation warning
      });

      hasPRs = prs.length > 0;

      if (hasPRs) {
        allPRs = [...allPRs, ...prs];
        page++;
      }
    } while (hasPRs);

    return allPRs;
  } catch (error) {
    console.error('Error fetching PRs:', error);
    throw error;
  }
}

// https://octokit.github.io/rest.js/v21/#actions-update-environment-variable
export async function updateEnvironmentVariable(env, varName, value) {
  if (!env || env === 'development') {
    console.log('Skip updating GitHub environment variable.');
    return;
  }
  const octokit = await getGithubApp();
  await octokit.rest.actions.updateEnvironmentVariable({
    owner,
    repo,
    environment_name: env,
    name: varName,
    value,
  });
}

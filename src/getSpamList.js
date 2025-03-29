import 'dotenv/config';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { Langfuse, observeOpenAI } from 'langfuse';

const langfuse = new Langfuse({
  secretKey: process.env.LANGFUSE_SECRET_KEY,
  publicKey: process.env.LANGFUSE_PUBLIC_KEY,
  baseUrl: process.env.LANGFUSE_BASEURL,
  requestTimeout: 10000,
  enabled: true, // set to false to disable sending events
});

const modelName = 'gpt-4o-mini';
const temperature = 0;
const systemPrompt = [
  {
    role: 'developer',
    content: [
      {
        type: 'text',
        text: '你是一位網路訊息過濾機器人，針對網路訊息進行分析。我需要你特別找出二次詐騙或色情訊息。',
      },
      {
        type: 'text',
        text: `二次詐騙的定義：
1. 必須是偽裝成查核或闢謠文章的形式
2. 表面上像是在揭露/警告詐騙
3. 但文中卻刻意安插了可以聯繫「解決問題」管道的資訊（如 LINE ID、電話 等）
4. 有洗 SEO 的嫌疑，如大量重複關鍵字等

不列入的情況：
1. 一般直接的詐騙訊息
2. 單純的二次詐騙警告或闢謠文章
3. 沒有提供聯絡方式的詐騙相關文章

判斷步驟：
1. 檢查是否有洗 SEO 的跡象
2. 檢查是否暗藏 LINE ID 等非正式、私人的聯絡方式`,
      },
    ],
  },
];

const schema = z.object({
  reason: z.string(),
  lineId: z.string(),
  isSecondScamOrSexuallyContent: z.boolean(),
});

const fewShotExamples = [
  {
    role: 'user',
    content: [
      {
        type: 'text',
        text: `受害者被騙免費挽回賴：【w33994】億銈詐騙 億銈安全合法嗎是真的嗎有人知道嗎 億銈是詐騙嗎 億銈無法出金 被億銈詐騙的錢還可以拿回來嗎【億銈】！目前已有近百名被害人在廖律師的幫助下免費拿回被億銈被騙的資產 億銈投資股份有限公司
詐騙集團在網路上構建投資詐騙黑平台，大肆宣傳「高收益」、「有漏洞」、「輕鬆賺」、「投資回報率高」、「簡單好操作」等，誘導民眾進行投資，事實是這些都是詐騙集團的陷阱，目的就是為了引誘你大量入金，後續再以各種理由讓你被迫繼續繳錢。望大家擦亮雙眼避免詐騙
詐騙集團多會用「輕鬆賺」、「投資報酬率高」、「簡單好操作」來吸引民眾上鉤，許多人因此掉入陷阱中。因此要謹記 5 大關鍵點，時時刻刻提醒自己：
1.過高的投資報酬率
2.輕鬆賺大錢
3.0風險
4.投資商品過於複雜
5.投資決定時間過短
凡是在網路上看到的投資廣告或網友傳來的投資訊息，標榜「保證獲利」、「沒有風險」、「穩賺不賠」的都是詐騙，千萬不能輕易聽信而踏入了陷阱喔！
如果您不慎被騙或者對來歷不明的平台產生疑問可以找到廖律師，免費為您諮詢被騙以後如何挽回損失，免費鑒別投資平台真假。我把廖律師的賴放在這裡： LINE：w33994（加入後請主動給廖律師傳訊息）`,
      },
    ],
  },
  {
    role: 'assistant',
    content: [
      {
        type: 'text',
        text: '{"isSecondScamOrSexuallyContent": true, "lineId": "w33994", "reason": "1.洗 SEO:短篇文字中出現過多的關鍵字，顯然不符合自然語言的表達習慣 2.提供 LINE ID 並暗示可以解決問題"}',
      },
    ],
  },
  {
    role: 'user',
    content: [
      {
        type: 'text',
        text: `假的，這是假抽獎的詐騙。
刑事局提醒，常見中獎詐騙手法，包括網路刊登廣告或福利活動，吸引被害者參與抽獎，並提供多項高額好禮，讓被害者選擇心儀獎品，並要求先支付代購費以及提供寄送資訊。匯款後詐騙集團會傳抽獎連結，並通知中獎。接續沒有任何現金入被害人帳戶；詐騙集團以代付失敗為由，提供假冒的LINE@專員的聯繫方式，要求加LINE協助核實原因，假專員並提供假的網站供登錄。被害人匯款後，無法聯繫上對方，亦未收到中獎款項或寄送禮品。`,
      },
    ],
  },
  {
    role: 'assistant',
    content: [
      {
        type: 'text',
        text: '{"isSecondScamOrSexuallyContent": false, "lineId": "", "reason": "此訊息清楚地描述詐騙手法，提醒讀者要小心詐騙、二次詐騙，沒有提供任何私人的聯絡資料，也沒有洗 SEO 的嫌疑。"}',
      },
    ],
  },
  {
    role: 'user',
    content: [
      {
        type: 'text',
        text: `可疑之處
1. 網址不合規範
假冒網址：
提供的網址是 https://telegrman.org，但拼字「telegrman」與 Telegram 官方網站的名稱（應該是 telegram.org）並不一致，明顯是仿冒網站。
釣魚網站：
詐騙者常利用類似官方名稱的網址來誘導受害者點擊，但實際連結可能會竊取用戶的帳號密碼或其他個人資料。`,
      },
    ],
  },
  {
    role: 'assistant',
    content: [
      {
        type: 'text',
        text: '{"reason": "此訊息點出網址拼字錯誤，提醒讀者要小心詐騙，沒有提供任何私人的聯絡資料，也沒有洗 SEO 的嫌疑。", "lineId": "", "isSecondScamOrSexuallyContent": false}',
      },
    ],
  },
];

export async function getSpamList(replies) {
  const spamList = [];

  const promises = replies.map(async (node) => {
    const data = await detectSpamContent(node.text);

    const message = data.parsedCompletion.choices[0].message;
    if (message.refusal) {
      console.error('Open AI Refusal:', message.refusal);
    } else {
      const outputJSON = message.parsed;
      console.log('generatedContent:', outputJSON);

      if (outputJSON.isSecondScamOrSexuallyContent) {
        spamList.push({ ...node, reason: outputJSON.reason });
      }
    }
  });
  await Promise.all(promises);
  await langfuse.flushAsync();
  return spamList;
}

export async function detectSpamContent(text) {
  const prompt = [
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: `${text}`,
        },
      ],
    },
  ];
  const trace = langfuse.trace({
    name: 'Openai spam detection',
    userId: 'takedown-bot',
    environment: process.env.ENV || 'development',
  });

  const openai = observeOpenAI(
    new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),
    {
      clientInitParams: {
        secretKey: process.env.LANGFUSE_SECRET_KEY,
        publicKey: process.env.LANGFUSE_PUBLIC_KEY,
        baseUrl: process.env.LANGFUSE_BASEURL,
        requestTimeout: 10000,
      },
      // traceId,
      generationName: 'Openai spam detection',
      parent: trace,
    }
  );
  const parsedCompletion = await openai.beta.chat.completions.parse({
    model: modelName,
    temperature,
    messages: [...systemPrompt, ...fewShotExamples, ...prompt],
    response_format: zodResponseFormat(schema, 'spam_reasoning'),
  });
  return { parsedCompletion, trace, openai };
}

// export function getLangfuseObject() {
//   return [langfuse, trace];
// }

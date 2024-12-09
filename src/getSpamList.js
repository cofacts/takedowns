import 'dotenv/config';
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
  SchemaType,
} from '@google/generative-ai';

const gModel = 'gemini-1.5-flash';
const systemInstruction = [
  '你是一位網路訊息過濾機器人，針對網路訊息進行分析。我需要你特別找出二次詐騙或色情訊息。',
];

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const schema = {
  type: SchemaType.OBJECT,
  properties: {
    reason: {
      type: SchemaType.STRING,
      description: 'The reason why the reply is considered as spam',
      nullable: false,
    },
    lineId: {
      type: SchemaType.STRING,
      description: 'Line ID found in the reply',
      nullable: false,
    },
    isSpam: {
      type: SchemaType.BOOLEAN,
      description: 'If the reply is second scam or sexually explicit content',
      nullable: false,
    },
  },
  required: ['reason', 'isSpam', 'lineId'],
};

const model = genAI.getGenerativeModel({
  model: gModel,
  generationConfig: {
    responseMimeType: 'application/json',
    responseSchema: schema,
  },
  systemInstruction: systemInstruction,
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ],
});

export async function getSpamList(replies) {
  const spamList = [];

  const promises = replies.map(async (node) => {
    const prompt = [
      `二次詐騙的定義：
1. 必須是偽裝成查核或闢謠文章的形式
2. 表面上像是在揭露/警告詐騙
3. 但文中卻刻意安插了可以聯繫「解決問題」管道的資訊（如 LINE ID、電話 等）

不列入的情況：
- 一般直接的詐騙訊息
- 單純的詐騙警告或闢謠文章
- 沒有提供聯絡方式的詐騙相關文章

判斷步驟：
1. 先確認是否為查核/闢謠形式的文章
2. 檢查是否暗藏聯絡方式
3. 確認這些聯絡方式是否被描述為「可以解決問題」的管道`,
      `請分類以下訊息:${node.text}`,
    ];

    const result = await model.generateContent(prompt);
    // console.log('generateContent:', result.response.text());
    const resultText = JSON.parse(result.response.text());

    // console.log(resultText);

    if (resultText.isSpam) {
      spamList.push({ ...node, reason: resultText.reason });
    }
  });
  await Promise.all(promises);

  return spamList;
}

import 'dotenv/config';
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
  SchemaType,
} from '@google/generative-ai';

export async function getSpamList(replies) {
  const spamList = [];
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const schema = {
    type: SchemaType.OBJECT,
    properties: {
      isSpam: {
        type: SchemaType.BOOLEAN,
        description: 'Return true if this message is scam or sexual content',
        nullable: false,
      },
      reason: {
        type: SchemaType.STRING,
        description:
          'Why this message is recognize as scam or sexual content? Or why not?',
        nullable: false,
      },
    },
    required: ['isSpam', 'reason'],
  };
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: schema,
    },
    systemInstruction: [
      '我會傳一些訊息是針對一些網路訊息的留言回覆，可能是詐騙或色情訊息，請判斷該訊息是否為詐騙或色情訊息。參考資料：如果訊息裡面有提供類似帳號的資訊，通常是「LINE」或、「賴」再搭配一串ID，或是提到律師的名字或律師的聯絡資訊，那麼它就是詐騙；但是如果該訊息只是請大家不要相信網路訊息，沒有提供可疑的額外資訊：LINE ID、律師名字等資訊，那它就不是詐騙。如果沒有具體的上下文內容可以分析，那就回答 false。',
    ],
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

  const promises = replies.map(async (node) => {
    const result = await model.generateContent(
      `請判斷引號內文字：「${node.text}」`
    );
    const resultText = JSON.parse(result.response.text());
    // console.log(resultText);

    if (resultText.isSpam) {
      spamList.push({ ...node, reason: resultText.reason });
    }
  });
  await Promise.all(promises);

  return spamList;
}

import { getSpamList } from '../getSpamList.js';
import {
  normalReply1,
  normalReply2,
  normalReply3,
  spamReply1,
  spamReply2,
  spamReply3,
} from '../__fixtures__/getSpamList.js';

describe('getSpamList ', () => {
  it('should return spam reply 1 2 3', async () => {
    const list = await getSpamList([
      normalReply1,
      normalReply2,
      normalReply3,
      spamReply1,
      spamReply2,
      spamReply3,
    ]);
    for (const item of list) delete item.reason;
    const sortedData = list.sort((a, b) => a.id.localeCompare(b.id));
    expect(sortedData.map(({ id }) => id)).toMatchInlineSnapshot(`
      Array [
        "spamReply1",
        "spamReply2",
        "spamReply3",
      ]
    `);
  });
});

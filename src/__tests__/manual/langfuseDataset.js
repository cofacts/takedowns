import { detectSpamContent } from '../../getSpamList.js';
import { Langfuse } from 'langfuse';

const langfuse = new Langfuse({
  secretKey: process.env.LANGFUSE_SECRET_KEY,
  publicKey: process.env.LANGFUSE_PUBLIC_KEY,
  baseUrl: process.env.LANGFUSE_BASEURL,
  requestTimeout: 10000,
  enabled: true, // set to false to disable sending events
});
langfuse.debug();

const dataset = await langfuse.getDataset('testdata');
const date = new Date().toISOString();

for (const item of dataset.items) {
  // const item = dataset.items[0];
  // execute application function and get langfuseObject (trace/span/generation/event)
  // output also returned as it is used to evaluate the run
  // you can also link using ids, see sdk reference for details
  if (item.status == 'ARCHIVED') continue;
  console.log('item input: ', item.input);

  const data = await detectSpamContent(item.input[0], langfuse);

  // link the execution trace to the dataset item and give it a run_name
  await item.link(data.trace, 'Test gpt-4o-mini ' + date, {
    //description: 'My first run', // optional run description
    metadata: { model: 'gpt-4o-mini' }, // optional run metadata
  });

  const message = data.parsedCompletion.choices[0].message;
  if (message.refusal) {
    console.error('Open AI Refusal:', message.refusal);
  } else {
    const outputJSON = message.parsed;
    // console.log('generatedContent:', outputJSON);

    if (item.expectedOutput) {
      console.log('');
      console.log('trace.score');
      // evaluate the output to compare different runs more easily
      data.trace.score({
        name: 'takedown_bool',
        value: +(
          outputJSON.isSecondScamOrSexuallyContent ===
          item.expectedOutput.isSecondScamOrSexuallyContent
        ),
      });
    }
  }
}

// Flush the langfuse client to ensure all data is sent to the server at the end of the experiment run
await langfuse.flushAsync();

const { WebClient } = require('@slack/web-api');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const SLACK_CHANNEL_ID = process.env.SLACK_CHANNEL_ID;
const USER_ID = process.env.USER_ID || ''; 

const web = new WebClient(SLACK_BOT_TOKEN);

// ✅ Send all blocks in chunks (Slack limit: 50 blocks per message)
async function sendMessageToSlack(channelId, blocksArray) {
  const chunkSize = 45; // Slack max is 50 blocks; stay safe

  for (let i = 0; i < blocksArray.length; i += chunkSize) {
    const chunk = blocksArray.slice(i, i + chunkSize);

    await web.chat.postMessage({
      channel: channelId,
      text: '📬 Unconfirmed answers', // Required fallback
      blocks: chunk,
    });

    // Slack recommends 1 request per second
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// ✅ Format unconfirmed answers into Slack-safe blocks
function formatUnconfirmedAnswersList(responseData) {
  if (!responseData?.data || !Array.isArray(responseData.data)) return [];

  const unconfirmed = responseData.data.filter(
    entry => entry.is_confirmed === false
  );

  if (unconfirmed.length === 0) {
    return [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `✅ No unconfirmed answers found.`,
        },
      },
    ];
  }

  const blocks = [];
  let currentText = '';

  unconfirmed.forEach((entry, index) => {
    const line = `${String(index + 1).padStart(2, '0')}. https://brainly.in/question/${entry.question_id}`;

    if ((currentText + '\n\n' + line).length > 2900) {
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: currentText,
        },
      });
      currentText = line;
    } else {
      currentText += (currentText ? '\n\n' : '') + line;
    }
  });

  if (currentText) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: currentText,
      },
    });
  }

  return blocks;
}

// ✅ Main function
(async () => {
  if (!USER_ID) {
    console.warn("⚠️ USER_ID not provided. Exiting.");
    await sendMessageToSlack(SLACK_CHANNEL_ID, [
      {
        type: 'section',
        text: { type: 'mrkdwn', text: "⚠️ USER_ID not provided. Exiting." }
      }
    ]);
    return;
  }

  const url = `https://brainly.in/api/28/api_responses/get_by_user?userId=${USER_ID}`;
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle0' });

  const bodyText = await page.evaluate(() => document.body.innerText);
  let json;
  try {
    json = JSON.parse(bodyText);
  } catch (e) {
    console.error("❌ Failed to parse JSON:", e);
    await browser.close();
    return;
  }

  await browser.close();

  const questions = formatUnconfirmedAnswersList(json);
  await sendMessageToSlack(SLACK_CHANNEL_ID, questions);
})();

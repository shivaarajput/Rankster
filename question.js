const { WebClient } = require('@slack/web-api');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN || 'xoxb-422730106544-8487359465809-5xyacBAimvzdkX1PjlidipDz';
const SLACK_CHANNEL_ID = process.env.SLACK_CHANNEL_ID || 'CDNC9EZHR';
const USER_ID = process.env.USER_ID || '14239290'; 

const web = new WebClient(SLACK_BOT_TOKEN);

async function sendMessageToSlack(channelId, message) {
    await web.chat.postMessage({
        channel: channelId,
        text: '📬 Here are your unconfirmed answers.', // Required fallback
        blocks: message,
    });

}

function formatUnconfirmedAnswersList(responseData, userId) {
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
          text: `No unconfirmed answers found.`,
        },
      },
    ];
  }

  const lines = unconfirmed.map((entry, index) => {
    const number = String(index + 1).padStart(2, '0'); // Makes 01, 02, etc.
    return `${number}. https://brainly.in/question/${entry.question_id}`;
  });

  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `${lines.join('\n\n')}`,
      },
    },
  ];
}




(async () => {
  const url = `https://brainly.in/api/28/api_responses/get_by_user?userId=${USER_ID}`;
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle0' });

  const bodyText = await page.evaluate(() => document.body.innerText);
  let json;
  try {
    json = JSON.parse(bodyText);
    // console.log(json.data)
  } catch (e) {
    console.error("❌ Failed to parse JSON:", e);
    await browser.close();
    return;
  }

  await browser.close();

  const questions = formatUnconfirmedAnswersList(json, USER_ID);
  await sendMessageToSlack(SLACK_CHANNEL_ID, questions);
})();

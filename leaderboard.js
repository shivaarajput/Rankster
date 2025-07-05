const { WebClient } = require('@slack/web-api');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const stream = require('stream');

puppeteer.use(StealthPlugin());

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const SLACK_CHANNEL_ID = process.env.SLACK_CHANNEL_ID;
const TIMEFRAME = process.env.TIMEFRAME || 'daily'; // daily, weekly, monthly, quarterly

const web = new WebClient(SLACK_BOT_TOKEN);

// Map timeframes to API paths
const timeframeMap = {
  daily: '0/10',
  weekly: '0/11',
  monthly: '0/12',
  quarterly: '0/13',
};

// Utility to get readable stream from buffer
function bufferToStream(buffer) {
  const readable = new stream.PassThrough();
  readable.end(buffer);
  return readable;
}

function getTitle(timeframe) {
  const date = new Date();
  const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const prettyDate = date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const labelMap = {
    daily: `📊 Daily Stats – ${prettyDate}`,
    weekly: `📈 Weekly Stats`,
    monthly: `📆 Monthly Stats`,
    quarterly: `🏆 Quarterly Stats`,
  };

  const label = labelMap[timeframe] || `📊 Stats – ${prettyDate}`;
  return { title: label, time };
}

function buildLeaderboardHTML(users) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Moderators' Ranking</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    </style>
  </head>
  <body class="bg-gradient-to-br from-indigo-50 to-white p-10 font-sans text-gray-800">
    <div class="max-w-4xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
      <div class="bg-indigo-600 text-white text-center py-6 px-4">
        <h1 class="text-3xl font-bold">Moderators' Ranking</h1>
      </div>
      <table class="w-full table-auto">
        <thead class="bg-indigo-100 text-indigo-700 text-sm uppercase tracking-wider">
          <tr>
            <th class="px-6 py-4 text-left">Place</th>
            <th class="px-6 py-4 text-left">Username</th>
            <th class="px-6 py-4 text-left">Actions</th>
            <th class="px-6 py-4 text-left">Role</th>
          </tr>
        </thead>
        <tbody class="bg-white text-sm divide-y divide-gray-200">
          ${users.map((user, i) => `
            <tr>
              <td class="px-6 py-4 font-semibold text-gray-700">${i + 1}</td>
              <td class="px-6 py-4 flex items-center space-x-3">
                <img src="${user.avatar?.['64'] || ''}" alt="${user.nick}" class="w-10 h-10 rounded-full shadow-sm border border-gray-300" />
                <span class="font-medium">${user.nick}</span>
              </td>
              <td class="px-6 py-4">${user.score}</td>
              <td class="px-6 py-4 text-gray-500">${user.roles?.[0] || '—'}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </body>
  </html>
  `;
}

async function generateLeaderboardImageBuffer(users) {
  const html = buildLeaderboardHTML(users);
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.setViewport({ width: 900, height: 800 });
  const buffer = await page.screenshot({ fullPage: true });
  await browser.close();
  return buffer;
}

async function sendImageToSlack(channelId, imageBuffer, comment) {
  const fileStream = bufferToStream(imageBuffer);
  const response = await web.files.uploadV2({
    file_uploads: [
      {
        file: fileStream,
        filename: 'leaderboard.png',
        title: 'Leaderboard',
      },
    ],
    channel_id: channelId,
    initial_comment: comment,
  });
  console.log('✅ Image sent to Slack:', response.ok);
}

function mergeRankings(rankingData, usersData) {
  return rankingData.map(entry => {
    const user = usersData.find(u => u.id === entry.user_id) || {};
    return {
      nick: user.nick || 'Unknown',
      avatar: user.avatar || {},
      roles: user.ranks?.names || [],
      score: entry.value || 0,
    };
  });
}

(async () => {
  const path = timeframeMap[TIMEFRAME] || timeframeMap.daily;
  const url = `https://brainly.in/api/28/api_global_rankings/view/${path}`;
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

  const users = mergeRankings(json.data || [], json.users_data || []);
  const { title, time } = getTitle(TIMEFRAME);
  const imageBuffer = await generateLeaderboardImageBuffer(users);
  await sendImageToSlack(SLACK_CHANNEL_ID, imageBuffer, `*${title}*\n🕒 ${time}`);
})();

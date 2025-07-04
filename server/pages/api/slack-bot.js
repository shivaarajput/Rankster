import axios from "axios";

export default async function handler(req, res) {
  // ✅ 1. Allow only POST
  if (req.method !== "POST") {
    return res.status(405).send("Only POST method is allowed");
  }

  // ✅ 2. Send early response to Slack (prevents timeout)
  res.status(200).json({
    response_type: "ephemeral",
    text: "⏳ Generating leaderboard...",
  });

  // ✅ 3. Validate required environment variables
  const { GITHUB_REPO, GITHUB_TOKEN } = process.env;

  if (!GITHUB_REPO || !GITHUB_TOKEN) {
    console.error("❌ Missing required environment variables:");
    console.error({ GITHUB_REPO, GITHUB_TOKEN });
    return;
  }

  // ✅ 4. Trigger GitHub Actions using repository_dispatch
  try {
    const url = `https://api.github.com/repos/${GITHUB_REPO}/dispatches`;

    await axios.post(
      url,
      {
        event_type: "run-leaderboard", // must match your workflow's event name
        client_payload: {
          source: "slack-bot", // optional data you can use in your action
        },
      },
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ repository_dispatch event triggered successfully.");
  } catch (err) {
    console.error("❌ Failed to trigger repository_dispatch:");
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Data:", err.response.data);
    } else {
      console.error(err.message);
    }
  }
}

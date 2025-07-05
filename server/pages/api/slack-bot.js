import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Only POST method is allowed");
  }

  const { GITHUB_REPO, GITHUB_TOKEN } = process.env;

  if (!GITHUB_REPO || !GITHUB_TOKEN) {
    console.error("❌ Missing env variables");
    return res.status(500).json({ error: "Missing env variables" });
  }

  // Extract timeframe from Slack command (e.g., `/stat weekly`)
  const timeframe = (req.body?.text || "").trim().toLowerCase(); // "daily", "weekly", etc.

  // Optional: Validate allowed values
  const validTimeframes = ["daily", "weekly", "monthly", "quarterly"];
  const finalTimeframe = validTimeframes.includes(timeframe) ? timeframe : "daily";

  try {
    const url = `https://api.github.com/repos/${GITHUB_REPO}/dispatches`;

    const response = await axios.post(
      url,
      {
        event_type: "run-leaderboard",
        client_payload: {
          source: "slack-bot",
          timeframe: finalTimeframe,
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

    console.log(`✅ Triggered leaderboard for "${finalTimeframe}"`);
    res.status(200).json({
      response_type: "ephemeral",
      text: `⏳ Generating the *${finalTimeframe}* leaderboard. Hang tight!`,
    });
  } catch (err) {
    console.error("❌ Failed to trigger repository_dispatch:");
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Data:", err.response.data);
    } else {
      console.error(err.message);
    }
    res.status(500).json({
      response_type: "ephemeral",
      text: "❌ Oops! Couldn't generate the leaderboard. Mind trying again?",
    });
  }
}

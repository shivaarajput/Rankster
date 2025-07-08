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

  // ✅ Ensure the command is exactly /stats
  const command = req.body?.command;
  if (command !== "/stats") {
    return res.status(200).json({
      response_type: "ephemeral",
      text: "❌ Invalid command. Only `/stats` is supported.",
    });
  }

  // Parse channel id
  const channel_id = req.body?.channel_id;

  // ✅ Parse and validate the argument
  const text = (req.body?.text || "").trim().toLowerCase();
  const validTimeframes = ["daily", "weekly", "monthly", "quarterly"];

  // Allow empty (default to "daily") or a valid timeframe
  if (text && !validTimeframes.includes(text)) {
    return res.status(200).json({
      response_type: "ephemeral",
      text: `❌ Invalid timeframe: *${text}*. Try \`/stats daily\`, \`weekly\`, \`monthly\`, or \`quarterly\`.`,
    });
  }

  const finalTimeframe = text || "daily";

  try {
    const url = `https://api.github.com/repos/${GITHUB_REPO}/dispatches`;

    await axios.post(
      url,
      {
        event_type: "run-slack-message", // Unified event type
        client_payload: {
          source: "slack-bot",
          timeframe: finalTimeframe,
          channelId: channel_id,
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

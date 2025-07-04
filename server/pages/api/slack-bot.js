import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Only POST allowed");
  }

  // Respond immediately to Slack to prevent timeouts
  res.status(200).json({
    response_type: "ephemeral",
    text: "⏳ Generating leaderboard...",
  });

  // Trigger GitHub Action in background
  try {
    await axios.post(
      `https://api.github.com/repos/${process.env.GITHUB_REPO}/actions/workflows/${process.env.WORKFLOW_FILE}/dispatches`,
      {
        ref: process.env.GITHUB_REF,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
        },
      }
    );
  } catch (err) {
    console.error("❌ Failed to trigger GitHub Action:", err?.response?.data || err.message);
    // Optional: send a follow-up message to Slack via response_url (if available)
  }
}

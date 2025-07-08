import axios from "axios";
import admin from "firebase-admin";

// Initialize Firebase Admin SDK (once)
if (!admin.apps.length) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
}

const db = admin.database();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Only POST method is allowed");
  }

  const {channel_id, command, text = "", user_id } = req.body;

  if (command !== "/question") {
    return res.status(200).json({
      response_type: "ephemeral",
      text: "❌ Invalid command. Only `/question` is supported.",
    });
  }

  // Check if the user already has a userId in Firebase
  const userRef = db.ref(`users/${user_id}`);
  const snapshot = await userRef.once("value");

  // First-time user: prompt for userId
  if (!snapshot.exists()) {
    return res.status(200).json({
      response_type: "ephemeral",
      text: `👋 Hi! Before we proceed, please provide your User ID.

            👉 Here's how to find it:
            1. Visit your profile: https://brainly.in/users/search/YourUsername
            2. Copy the full URL from your browser — it will look like:
            \`https://brainly.in/profile/username-123456\`

            3. Your User ID is the number at the end. For example:
            \`123456\`

            4. Now send the command like this:
            \`/question userid=123456\`

            Once saved, you won’t have to do this again. 👍`,

    });
  }

  const storedUserId = snapshot.val().userId;

  // If text starts with "userid=", save it
  if (text.includes("userid")) {
    const providedId = text.split("=")[1].trim();

    if (!providedId) {
      return res.status(200).json({
        response_type: "ephemeral",
        text: "❌ Please provide a valid User ID. Example: `/question userid=123456`",
      });
    }

    await userRef.set({ userId: providedId });
    return res.status(200).json({
      response_type: "ephemeral",
      text: `✅ Thanks! Your User ID (${providedId}) has been saved. You can now use \`/question\`.`,
    });
  }

  // Use the storedUserId instead of timeframe (example call)
  try {
    const url = `https://api.github.com/repos/${process.env.GITHUB_REPO}/dispatches`;

    await axios.post(
      url,
      {
        event_type: "run-slack-message",
        client_payload: {
          source: "slack-bot",
          userId: storedUserId,
          channelId: channel_id,
        },
      },
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({
      response_type: "ephemeral",
      text: `⏳ Got it. Sit tight while I send you the answer link...`,
    });
  } catch (err) {
    console.error("❌ GitHub API error:", err.message);
    res.status(500).json({
      response_type: "ephemeral",
      text: "❌ Oops! Something went wrong.",
    });
  }
}

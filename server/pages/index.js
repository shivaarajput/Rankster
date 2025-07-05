import React from "react";

// Placeholder components (consider replacing with a UI library like shadcn/ui or Material UI)
const Card = ({ children, className }) => <div className={className}>{children}</div>;
const CardContent = ({ children, className }) => <div className={className}>{children}</div>;

// --- Data and Logic for the Leaderboard ---

const responseData ={
  "users_data": [
    {
      "id": 14239290,
      "nick": "mathdude500",
      "avatars": {
        "64": "https://hi-static.z-dn.net/files/d62/2746c154c2a8f2d32104e8595876a1c1.jpeg"
      },
      "ranks": {
        "names": ["Super Moderator", "Genius"]
      }
    },
    {
      "id": 76897306,
      "nick": "Ashrylix",
      "avatars": {
        "64": "https://hi-static.z-dn.net/files/dc4/d99c78eb66ed4403c722e484cee49f9f.jpg"
      },
      "ranks": {
        "names": ["Apprentice Moderator", "Ace"]
      }
    },
    {
      "id": 23636146,
      "nick": "mrtwister748",
      "avatars": {
        "64": "https://hi-static.z-dn.net/files/d42/ea3439e6185aa23d9d74f0e45b96a91f.png"
      },
      "ranks": {
        "names": ["Apprentice Moderator", "Genius"]
      }
    },
    {
      "id": 40911531,
      "nick": "StarFighter",
      "avatars": {
        "64": "https://hi-static.z-dn.net/files/da5/0d7a6c97bb186566121ad019eb6e58ca.jpg"
      },
      "ranks": {
        "names": ["Advanced Moderator", "Genius"]
      }
    },
    {
      "id": 8774518,
      "nick": "BrainlyPopularman",
      "avatars": {
        "64": "https://hi-static.z-dn.net/files/d94/02c921a0b9962480ee93e78d1f0d9e76.jpg"
      },
      "ranks": {
        "names": ["Proficient Moderator", "Maths AryaBhatta", "BRAINLY TESTER", "Genius"]
      }
    },
    {
      "id": 42190311,
      "nick": "GoldenSparks",
      "avatars": {
        "64": "https://hi-static.z-dn.net/files/d46/df5422562b61663643519b43833af171.jpg"
      },
      "ranks": {
        "names": ["Emerger Moderator", "Ace"]
      }
    },
    {
      "id": 56077033,
      "nick": "jeni08aji",
      "avatars": {
        "64": "https://hi-static.z-dn.net/files/d48/75b408a1674ac8c99aefdd0f4a38856b.jpg"
      },
      "ranks": {
        "names": ["Apprentice Moderator", "Genius"]
      }
    },
    {
      "id": 50433733,
      "nick": "QualityGuard",
      "avatars": {
        "64": "https://hi-static.z-dn.net/files/d93/9aa96b7449cde3d2c2aea2553a206ea9.jpg"
      },
      "ranks": {
        "names": ["Brainly Team"]
      }
    },
    {
      "id": 7405793,
      "nick": "amansharma264",
      "avatars": {
        "64": "https://hi-static.z-dn.net/files/dce/5f1cf60c6670bef5510d1aa9b606bb43.jpg"
      },
      "ranks": {
        "names": ["Proficient Moderator", "Maths AryaBhatta", "BRAINLY TESTER", "Genius"]
      }
    },
    {
      "id": 4451081,
      "nick": "Equestriadash",
      "avatars": {
        "64": "https://hi-static.z-dn.net/files/de5/c59e6182fb40d532b54bad0a52258ba4.jpg"
      },
      "ranks": {
        "names": ["Super Moderator", "Brainly Challenger", "English Shakespeare", "Brainly Goblin", "Ace"]
      }
    },
    {
      "id": 29205751,
      "nick": "PopularStar",
      "avatars": {
        "64": "https://hi-static.z-dn.net/files/d0f/d020469227fdcfaef8e7f31054e8b410.jpg"
      },
      "ranks": {
        "names": ["Apprentice Moderator", "Ace"]
      }
    },
    {
      "id": 4528275,
      "nick": "TheBrainliestUser",
      "avatars": {
        "64": "https://hi-static.z-dn.net/files/db9/afbbd25882c33932eac06ae6c1e200ce.jpg"
      },
      "ranks": {
        "names": ["Apprentice Moderator", "BRAINLY TESTER", "Ace"]
      }
    },
    {
      "id": 15886732,
      "nick": "Ganesh6775",
      "avatars": {
        "64": "https://hi-static.z-dn.net/files/d20/6ad2a6161975a08ec131c508a595d2ab.jpg"
      },
      "ranks": {
        "names": ["Apprentice Moderator", "Genius"]
      }
    },
    {
      "id": 9646209,
      "nick": "ajr111",
      "avatars": {
        "64": "https://hi-static.z-dn.net/files/df1/049fac52daa6e1dd74deeece38ac4010.png"
      },
      "ranks": {
        "names": ["Apprentice Moderator", "Genius"]
      }
    },
    {
      "id": 13048115,
      "nick": "MystícPhoeníx",
      "avatars": {
        "64": "https://hi-static.z-dn.net/files/d47/58f4ecd34ddbf7da269a78996ae96fe5.jpg"
      },
      "ranks": {
        "names": ["Proficient Moderator", "Genius"]
      }
    },
    {
      "id": 11336612,
      "nick": "dreeblissa",
      "avatars": {
        "64": "https://hi-static.z-dn.net/files/d98/4ae90a52a309b893cd5e69fa14e65ac6.jpg"
      },
      "ranks": {
        "names": ["Apprentice Moderator", "Creative Design Wizard", "Genius"]
      }
    },
    {
      "id": 37147777,
      "nick": "BawariRadha",
      "avatars": {
        "64": "https://hi-static.z-dn.net/files/dbe/2cab6a5b06686edc0da9b556111f60a9.jpg"
      },
      "ranks": {
        "names": ["Apprentice Moderator", "Ace"]
      }
    },
    {
      "id": 12129398,
      "nick": "MoonlightVibes",
      "avatars": {
        "64": "https://hi-static.z-dn.net/files/d24/10828b80ef96a4d002b269552b1a1599.png"
      },
      "ranks": {
        "names": ["Proficient Moderator", "Maths AryaBhatta", "Ace"]
      }
    },
    {
      "id": 849625,
      "nick": "snehitha2",
      "avatars": {
        "64": "https://hi-static.z-dn.net/files/dd2/eedd84adc73082f3d98afae423792c37.jpg"
      },
      "ranks": {
        "names": ["Emerger Moderator", "Genius"]
      }
    },
    {
      "id": 6230400,
      "nick": "amitkumar44481",
      "avatars": {
        "64": "https://hi-static.z-dn.net/files/dec/82cecbd61a3d0cd11f41125374c67d1d.jpg"
      },
      "ranks": {
        "names": ["Emerger Moderator", "BRAINLY TESTER", "Ace"]
      }
    },
    {
      "id": 59471933,
      "nick": "BrainlySPG",
      "avatars": {
        "64": "https://hi-static.z-dn.net/files/d34/2c03c5af6a56a457414bfa387bcf3e12.jpg"
      },
      "ranks": {
        "names": ["Apprentice Moderator", "Genius"]
      }
    },
    {
      "id": 29385124,
      "nick": "sandhyasobti",
      "avatars": {
        "64": "https://hi-static.z-dn.net/files/db5/adcb3d7e942995ae100c8395fb6a4061.jpg"
      },
      "ranks": {
        "names": ["Apprentice Moderator", "Genius"]
      }
    }
  ]
}
;

// Reorder users (if needed)
const finalLeaderboard = [...responseData.users_data];

// --- Leaderboard Component ---
const Leaderboard = () => (
  <section>
    <h2 className="text-2xl font-semibold text-center text-gray-800">🌟 Our Moderators</h2>
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {finalLeaderboard.map((user) => {
        const profileUrl = `https://brainly.in/profile/${user.nick}-${user.id}`;
        return (
          <Card
            key={user.id}
            className="rounded-2xl bg-white shadow-md transition-transform hover:scale-105"
          >
            <CardContent className="flex items-center space-x-4 p-4">
              <a href={profileUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src={user.avatars?.["64"] || "https://placehold.co/64x64/e0e7ff/4f46e5?text=?"}
                  alt={user.nick}
                  className="w-16 h-16 rounded-full border-2 border-indigo-500"
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/64x64/e0e7ff/4f46e5?text=Error";
                  }}
                />
              </a>
              <div>
                <h3 className="text-lg font-semibold">
                  <a
                    href={profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-gray-900"
                  >
                    {user.nick}
                  </a>
                </h3>
                <div className="flex flex-wrap gap-1 mt-1">
                  {user.ranks.names.map((rank) => (
                    <span
                      key={`${user.id}-${rank}`}
                      className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-medium"
                    >
                      {rank}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  </section>
);

// --- Main Home Page Component ---
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      {/* Header */}
      <header className="text-center py-10 bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg">
        <h1 className="text-5xl font-bold">🚀 Rankster Bot</h1>
        <p className="mt-2 text-lg">
          Your daily Brainly moderator leaderboard, delivered on Slack
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-12 max-w-7xl mx-auto space-y-16">
        {/* Intro */}
        <section className="text-center">
          <h2 className="text-3xl font-semibold text-gray-800">
            Track moderator performance effortlessly
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Rankster Bot automatically posts a daily leaderboard of moderator activity before
            midnight. It also responds to{" "}
            <code className="bg-gray-200 text-gray-800 px-2 py-1 rounded-md">/stats</code> commands
            in Slack.
          </p>
        </section>

        {/* Leaderboard */}
        <Leaderboard />

        {/* Info Sections */}
        <div className="grid md:grid-cols-2 gap-12 pt-8">
          <section>
            <h3 className="text-2xl font-semibold text-indigo-600 mb-4">How It Works</h3>
            <ul className="space-y-4 list-disc list-inside text-gray-700 text-lg">
              <li>⏰ Posts rankings daily before 12:00 AM.</li>
              <li>💬 Slack integration responds to <code>/stats</code>.</li>
              <li>🤖 GitHub-powered automation ensures reliability.</li>
              <li>🔒 Access limited to Brainly moderators.</li>
            </ul>
          </section>
          <section>
            <h3 className="text-2xl font-semibold text-indigo-600 mb-4">Upcoming Features</h3>
            <ul className="space-y-4 list-disc list-inside text-gray-700 text-lg">
              <li>📈 Weekly/monthly summaries</li>
              <li>🏅 Achievement badges for top moderators</li>
              <li>📊 Optional web-based stats dashboard</li>
            </ul>
          </section>
        </div>

        {/* Call to Action */}
        <section className="text-center pt-8">
          <h3 className="text-2xl font-semibold text-gray-800">Want to see your rank?</h3>
          <p className="mt-2 text-lg text-gray-600">
            Just type{" "}
            <code className="bg-gray-200 text-gray-800 px-2 py-1 rounded-md">/stats</code> in your
            Brainly Slack and Rankster will show your current standing.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-6 border-t bg-white">
        Made with ❤️ by{" "}
        <a
          href="https://instagram.com/shivamsinghamrajput"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:underline"
        >
          Shiva
        </a>
      </footer>
    </div>
  );
}

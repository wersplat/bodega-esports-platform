const fs = require("fs/promises");
const path = require("path");

const sourceDir = path.join(__dirname, "../pages");
const keywordMap = {
  admin: ["Admin"],
  teams: ["Team", "Owner"],
  matches: ["Match"],
  profile: ["Profile", "Player"],
  leagues: ["League"],
  standings: ["Stand", "Rank"],
  contracts: ["Contract"],
  payments: ["Payment"],
  notifications: ["Notification"],
  public: ["Login", "Register", "Home", "Landing"],
};

const toKebabCase = (str) =>
  str
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/\.jsx$/, "")
    .toLowerCase();

async function movePages() {
  const files = await fs.readdir(sourceDir);
  const jsxFiles = files.filter((f) => f.endsWith(".jsx"));

  for (const file of jsxFiles) {
    const baseName = file.replace(".jsx", "");

    let targetFolder = "misc";
    for (const [folder, keywords] of Object.entries(keywordMap)) {
      if (keywords.some((key) => baseName.includes(key))) {
        targetFolder = folder;
        break;
      }
    }

    const newDir = path.join(sourceDir, targetFolder);
    await fs.mkdir(newDir, { recursive: true });

    const newName =
      /Dashboard|Index|Home/i.test(baseName) || baseName === targetFolder
        ? "index.jsx"
        : `${toKebabCase(baseName)}.jsx`;

    const from = path.join(sourceDir, file);
    const to = path.join(newDir, newName);

    if (from === to) {
      console.log(`⚠️  Skipping ${file}, source and destination are the same.`);
      continue;
    }

    try {
      await fs.access(to);
      console.log(`⚠️  Skipping ${file}, destination ${path.join(targetFolder, newName)} already exists.`);
      continue;
    } catch {
      // Destination does not exist, safe to move
    }

    console.log(`🔁 Moving ${file} → ${path.join(targetFolder, newName)}`);
    await fs.rename(from, to);
  }

  console.log("✅ All matching pages moved by API category.");
}

movePages().catch((err) => {
  console.error("❌ Error:", err);
});

const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

async function generateAddon(data, res) {
  const { name, damage } = data;

  const tempDir = path.join(process.cwd(), "temp");

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  const behaviorPath = path.join(tempDir, "behavior_pack");

  fs.mkdirSync(behaviorPath, { recursive: true });

  const itemJson = {
    format_version: "1.20.0",
    "minecraft:item": {
      description: {
        identifier: `custom:${name}`
      },
      components: {
        "minecraft:damage": Number(damage)
      }
    }
  };

  fs.writeFileSync(
    path.join(behaviorPath, `${name}.json`),
    JSON.stringify(itemJson, null, 2)
  );

  const archive = archiver("zip");

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${name}.mcaddon`
  );

  archive.pipe(res);

  archive.directory(tempDir, false);

  archive.finalize();
}

module.exports = { generateAddon };

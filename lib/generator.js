const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const { v4: uuidv4 } = require("uuid");

async function generateAddon(data, res) {
  const { name, damage, texture } = data;

  const tempDir = path.join(process.cwd(), "temp");

  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, {
      recursive: true,
      force: true
    });
  }

  fs.mkdirSync(tempDir);

  // =========================
  // BEHAVIOR PACK
  // =========================

  const behaviorPath = path.join(
    tempDir,
    "behavior_pack"
  );

  fs.mkdirSync(behaviorPath, {
    recursive: true
  });

  // Manifest BP
  const bpManifest = {
    format_version: 2,
    header: {
      name: "Custom Addon",
      description: "Generated addon",
      uuid: uuidv4(),
      version: [1, 0, 0],
      min_engine_version: [1, 20, 0]
    },
    modules: [
      {
        type: "data",
        uuid: uuidv4(),
        version: [1, 0, 0]
      }
    ]
  };

  fs.writeFileSync(
    path.join(
      behaviorPath,
      "manifest.json"
    ),
    JSON.stringify(bpManifest, null, 2)
  );

  // Item JSON
  const itemJson = {
    format_version: "1.20.0",
    "minecraft:item": {
      description: {
        identifier: `custom:${name}`,
        category: "Equipment"
      },
      components: {
        "minecraft:icon": {
          texture: name
        },
        "minecraft:display_name": {
          value: name
        }
      }
    }
  };

  const itemsPath = path.join(
    behaviorPath,
    "items"
  );

  fs.mkdirSync(itemsPath, {
    recursive: true
  });

  fs.writeFileSync(
    path.join(itemsPath, `${name}.json`),
    JSON.stringify(itemJson, null, 2)
  );

  // =========================
  // RESOURCE PACK
  // =========================

  const resourcePath = path.join(
    tempDir,
    "resource_pack"
  );

  fs.mkdirSync(resourcePath, {
    recursive: true
  });

  // Manifest RP
  const rpManifest = {
    format_version: 2,
    header: {
      name: "Custom Resources",
      description: "Generated resources",
      uuid: uuidv4(),
      version: [1, 0, 0],
      min_engine_version: [1, 20, 0]
    },
    modules: [
      {
        type: "resources",
        uuid: uuidv4(),
        version: [1, 0, 0]
      }
    ]
  };

  fs.writeFileSync(
    path.join(
      resourcePath,
      "manifest.json"
    ),
    JSON.stringify(rpManifest, null, 2)
  );

  // Texture folders
  const texturesPath = path.join(
    resourcePath,
    "textures/items"
  );

  fs.mkdirSync(texturesPath, {
    recursive: true
  });

  // Copy texture
  if (texture) {
    const sourceTexture = path.join(
      process.cwd(),
      "public",
      texture
    );

    const targetTexture = path.join(
      texturesPath,
      `${name}.png`
    );

    fs.copyFileSync(
      sourceTexture,
      targetTexture
    );
  }

  // item_texture.json
  const textureJson = {
    resource_pack_name: "custom",
    texture_name: "atlas.items",
    texture_data: {
      [name]: {
        textures: `textures/items/${name}`
      }
    }
  };

  const textureJsonPath = path.join(
    resourcePath,
    "textures",
    "item_texture.json"
  );

  fs.mkdirSync(
    path.dirname(textureJsonPath),
    { recursive: true }
  );

  fs.writeFileSync(
    textureJsonPath,
    JSON.stringify(textureJson, null, 2)
  );

  // =========================
  // ZIP ADDON
  // =========================

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

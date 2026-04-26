import { readFileSync, writeFileSync } from "fs";

const path = "dist/manifest.json";
const manifest = JSON.parse(readFileSync(path, "utf-8"));

delete manifest.use_dynamic_url;
if (Array.isArray(manifest.web_accessible_resources)) {
  for (const entry of manifest.web_accessible_resources) {
    delete entry.use_dynamic_url;
  }
}

writeFileSync(path, JSON.stringify(manifest, null, 2));

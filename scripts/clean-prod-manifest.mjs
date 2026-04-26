import { readFileSync, writeFileSync } from "fs";

const path = "dist/manifest.json";
const manifest = JSON.parse(readFileSync(path, "utf-8"));

delete manifest.use_dynamic_url;
if (Array.isArray(manifest.web_accessible_resources)) {
  for (const entry of manifest.web_accessible_resources) {
    delete entry.use_dynamic_url;
  }
}

// Firefox MV3 requires background.scripts as a fallback for service_worker.
// The crxjs-generated service-worker-loader.js uses ES module import syntax,
// so we resolve the actual background asset and reference it directly.
if (manifest.background?.service_worker) {
  const loaderPath = `dist/${manifest.background.service_worker}`;
  const loaderContent = readFileSync(loaderPath, "utf-8");
  const match = loaderContent.match(/import ['"](.+)['"]/);
  const bgScript = match
    ? match[1].replace(/^\.\//, "")
    : manifest.background.service_worker;
  manifest.background.scripts = [bgScript];
  delete manifest.background.type;
}

writeFileSync(path, JSON.stringify(manifest, null, 2));

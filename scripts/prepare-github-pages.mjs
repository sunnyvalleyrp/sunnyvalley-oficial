import { promises as fs } from "node:fs";
import path from "node:path";

const outputDirectory = path.resolve("out");
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "sunnyvalley-oficial";
const basePath = `/${repositoryName}`;
const textExtensions = new Set([".html", ".js", ".css", ".json", ".xml", ".txt"]);

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(async (entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  }))).flat();
}

for (const file of await walk(outputDirectory)) {
  if (!textExtensions.has(path.extname(file))) continue;
  const original = await fs.readFile(file, "utf8");
  const protectedAssets = "__SUNNYVALLEY_ASSET_PATH__";
  const protectedRules = "__SUNNYVALLEY_RULES_PATH__";
  const updated = original
    .replaceAll(`${basePath}/assets/`, protectedAssets)
    .replaceAll("/assets/", `${basePath}/assets/`)
    .replaceAll(protectedAssets, `${basePath}/assets/`)
    .replaceAll(`${basePath}/Regras_Oficiais_SunnyValley.docx`, protectedRules)
    .replaceAll("/Regras_Oficiais_SunnyValley.docx", `${basePath}/Regras_Oficiais_SunnyValley.docx`)
    .replaceAll(protectedRules, `${basePath}/Regras_Oficiais_SunnyValley.docx`);
  if (updated !== original) await fs.writeFile(file, updated);
}

await fs.writeFile(path.join(outputDirectory, ".nojekyll"), "");

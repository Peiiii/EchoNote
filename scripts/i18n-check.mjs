import fs from "node:fs";
import path from "node:path";

const LOCALES_DIR = path.resolve("public/locales");
const LANGS = ["en", "zh-CN"];

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function flattenKeys(obj, prefix = "") {
  const out = new Map();
  if (!isPlainObject(obj)) return out;
  for (const [key, value] of Object.entries(obj)) {
    const next = prefix ? `${prefix}.${key}` : key;
    if (isPlainObject(value)) {
      for (const [k, v] of flattenKeys(value, next).entries()) out.set(k, v);
      continue;
    }
    out.set(next, value);
  }
  return out;
}

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

function listNamespaces(lang) {
  const dir = path.join(LOCALES_DIR, lang);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter(f => f.endsWith(".json"))
    .map(f => f.replace(/\.json$/, ""));
}

function formatList(items) {
  return items.map(k => `  - ${k}`).join("\n");
}

const namespaces = new Set(LANGS.flatMap(listNamespaces));
if (namespaces.size === 0) {
  console.error(`[i18n-check] No namespaces found under ${LOCALES_DIR}`);
  process.exit(1);
}

let failed = false;

for (const ns of namespaces) {
  const catalogs = new Map();
  for (const lang of LANGS) {
    const filePath = path.join(LOCALES_DIR, lang, `${ns}.json`);
    if (!fs.existsSync(filePath)) {
      console.error(`[i18n-check] Missing catalog: ${path.relative(process.cwd(), filePath)}`);
      failed = true;
      continue;
    }
    catalogs.set(lang, flattenKeys(readJson(filePath)));
  }

  const en = catalogs.get("en");
  const zh = catalogs.get("zh-CN");
  if (!en || !zh) continue;

  const enKeys = new Set(en.keys());
  const zhKeys = new Set(zh.keys());

  const missingInZh = [...enKeys].filter(k => !zhKeys.has(k)).sort();
  const missingInEn = [...zhKeys].filter(k => !enKeys.has(k)).sort();

  if (missingInZh.length) {
    console.error(`[i18n-check] ${ns}: missing keys in zh-CN:`);
    console.error(formatList(missingInZh));
    failed = true;
  }
  if (missingInEn.length) {
    console.error(`[i18n-check] ${ns}: extra keys in zh-CN (not in en):`);
    console.error(formatList(missingInEn));
    failed = true;
  }

  const emptyEn = [...en.entries()]
    .filter(([, v]) => typeof v === "string" && v.trim() === "")
    .map(([k]) => k)
    .sort();
  const emptyZh = [...zh.entries()]
    .filter(([, v]) => typeof v === "string" && v.trim() === "")
    .map(([k]) => k)
    .sort();

  if (emptyEn.length) {
    console.error(`[i18n-check] ${ns}: empty values in en:`);
    console.error(formatList(emptyEn));
    failed = true;
  }
  if (emptyZh.length) {
    console.error(`[i18n-check] ${ns}: empty values in zh-CN:`);
    console.error(formatList(emptyZh));
    failed = true;
  }
}

if (failed) {
  process.exit(1);
}

console.log("[i18n-check] OK");

module.exports = {
  locales: ["en", "zh-CN"],
  input: ["src/**/*.{ts,tsx}"],
  output: "public/locales/$LOCALE/$NAMESPACE.json",
  defaultNamespace: "common",
  namespaceSeparator: ":",
  keySeparator: ".",
  // Keep catalogs stable; we don't want destructive changes during early adoption.
  createOldCatalogs: false,
  keepRemoved: true,
  sort: true,
  // For new keys, require humans (or AI) to fill translations; empty values will fail `i18n:check`.
  defaultValue: "",
};


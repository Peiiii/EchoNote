const CHECK_ATTRIBUTE_NAMES = new Set([
  "title",
  "description",
  "label",
  "placeholder",
  "alt",
  "aria-label",
  "aria-description",
]);

const IGNORE_ELEMENT_NAMES = new Set(["code", "pre", "kbd", "samp"]);

function getJsxElementName(openingElement) {
  const name = openingElement?.name;
  if (!name) return null;
  if (name.type === "JSXIdentifier") return name.name;
  // <Foo.Bar>
  if (name.type === "JSXMemberExpression" && name.property?.type === "JSXIdentifier") {
    return name.property.name;
  }
  return null;
}

function shouldIgnoreText(raw) {
  const text = raw.trim();
  if (!text) return true;

  // Versions / build stamps.
  if (/^v?\d+(?:\.\d+)+(?:[-+][0-9A-Za-z.-]+)?$/.test(text)) return true;

  // Only numbers / punctuation / separators.
  if (/^[\d\s.,:;!?(){}[\]<>/\\'"`~@#$%^&*|+=_-]+$/.test(text)) return true;

  return false;
}

function readStringLiteralFromJsxAttributeValue(valueNode) {
  if (!valueNode) return null;
  if (valueNode.type === "Literal" && typeof valueNode.value === "string") return valueNode.value;

  if (valueNode.type === "JSXExpressionContainer") {
    const expr = valueNode.expression;
    if (expr?.type === "Literal" && typeof expr.value === "string") return expr.value;
    if (expr?.type === "TemplateLiteral" && expr.expressions.length === 0) {
      return expr.quasis.map(q => q.value.cooked ?? "").join("");
    }
  }

  return null;
}

function getAttributeName(attr) {
  const name = attr?.name;
  if (!name) return null;
  if (name.type === "JSXIdentifier") return name.name;
  if (name.type === "JSXNamespacedName") {
    if (name.namespace?.type === "JSXIdentifier" && name.name?.type === "JSXIdentifier") {
      return `${name.namespace.name}:${name.name.name}`;
    }
  }
  return null;
}

/**
 * Best-practice hardcoded UI text guard:
 * - Only checks TSX/JSX markup (JSXText + a small allowlist of user-facing attributes).
 * - Allows non-user-facing strings (routes, ids, variants, className...) to avoid noise.
 * - Designed for incremental rollout (set to "warn" first, then expand scope / promote to "error").
 */
export const noHardcodedUiTextRule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Disallow hardcoded user-facing UI text in JSX; prefer i18n keys via t()/Trans.",
    },
    schema: [],
    messages: {
      hardcodedText:
        "Hardcoded UI text detected. Use i18n (e.g. t('...') / <Trans />) instead of literal text.",
    },
  },
  create(context) {
    const filename = context.getFilename?.() ?? "";
    const isTsx = filename.endsWith(".tsx") || filename.endsWith(".jsx");
    if (!isTsx) return {};

    return {
      JSXText(node) {
        if (!node?.value) return;
        const text = node.value;
        if (shouldIgnoreText(text)) return;

        const parentElement = node.parent?.type === "JSXElement" ? node.parent : null;
        const elementName = parentElement ? getJsxElementName(parentElement.openingElement) : null;
        if (elementName && IGNORE_ELEMENT_NAMES.has(elementName)) return;

        context.report({ node, messageId: "hardcodedText" });
      },
      JSXAttribute(node) {
        const attrName = getAttributeName(node);
        if (!attrName) return;
        if (!CHECK_ATTRIBUTE_NAMES.has(attrName)) return;

        const value = readStringLiteralFromJsxAttributeValue(node.value);
        if (value === null) return;
        if (shouldIgnoreText(value)) return;

        context.report({ node, messageId: "hardcodedText" });
      },
    };
  },
};

export default noHardcodedUiTextRule;


export function getDomain(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function getFaviconUrl(url) {
  const domain = getDomain(url);
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

export function getPreviewAlt(title) {
  return `${title} resource preview`;
}

export function getFaviconAlt(title) {
  return `${title} site icon`;
}

export function highlightMatch(text, query) {
  if (!query) return text;

  const tokens = normalize(query).split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return text;

  const pattern = new RegExp(
    `(${tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "gi"
  );
  const parts = text.split(pattern);

  return parts.map((part, i) => {
    if (tokens.some((token) => part.toLowerCase() === token.toLowerCase())) {
      return <mark key={i} className="search-highlight">{part}</mark>;
    }
    return part;
  });
}

function normalize(value) {
  return String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function getItemType(item) {
  return item.type || "Article";
}

export function getItemTitle(item) {
  return item.title;
}

export function getItemUrl(item) {
  return item.url;
}

export function normalize(value) {
  return String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function resourceSearchText(resource) {
  return normalize(
    [resource.title, resource.type, resource.category, resource.summary, ...resource.tags].join(" ")
  );
}

export function scoreResource(resource, query) {
  if (!query) return resource.priority;

  const normalizedTitle = normalize(resource.title);
  const normalizedCategory = normalize(resource.category);
  const normalizedTags = resource.tags.map(normalize);
  const searchText = resourceSearchText(resource);
  const tokens = normalize(query).split(/\s+/).filter(Boolean);

  return tokens.reduce((score, token) => {
    if (normalizedTitle === token) return score + 42;
    if (normalizedTitle.includes(token)) score += 28;
    if (normalizedCategory.includes(token)) score += 18;
    if (normalizedTags.some((tag) => tag.includes(token))) score += 14;
    if (searchText.includes(token)) score += 8;
    return score;
  }, resource.priority);
}

export function articleMatchesQuery(article, query) {
  if (!query) return true;
  const searchText = normalize([article.title, article.source, article.summary, ...article.tags].join(" "));
  return normalize(query).split(/\s+/).every((token) => searchText.includes(token));
}

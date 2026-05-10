import { useMemo, useState } from "react";
import catalog from "../data/ai-resources.json";
import { scoreResource, articleMatchesQuery } from "../utils/search";

const typeFilters = ["All", "Skill", "Tool", "Docs", "Framework", "Directory", "Protocol"];
const quickSearches = ["agent skills", "design", "refactoring", "prompting", "mcp"];

export function useSearch() {
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState("All");
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const visibleResources = useMemo(() => {
    return catalog.resources
      .filter((resource) => {
        const typeMatch = activeType === "All" || resource.type === activeType;
        const queryMatch = !query || scoreResource(resource, query) > resource.priority;
        return typeMatch && queryMatch;
      })
      .map((resource) => ({ ...resource, score: scoreResource(resource, query) }))
      .sort((a, b) => b.score - a.score || b.priority - a.priority || a.title.localeCompare(b.title));
  }, [activeType, query]);

  const dropdownResults = useMemo(() => {
    if (!query) return [];

    const scoredResources = catalog.resources
      .map((resource) => ({ ...resource, score: scoreResource(resource, query) }))
      .filter((r) => r.score > r.priority)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    const scoredArticles = catalog.articles
      .filter((article) => articleMatchesQuery(article, query))
      .slice(0, 2);

    return [...scoredResources, ...scoredArticles];
  }, [query]);

  const handleSearch = (value) => {
    setQuery(value);
    setIsSearching(Boolean(value));
    setShowDropdown(Boolean(value));
  };

  const handleDropdownSelect = (item) => {
    window.open(item.url, "_blank", "noreferrer");
    setShowDropdown(false);
  };

  const clearSearch = () => {
    handleSearch("");
  };

  return {
    query,
    activeType,
    isSearching,
    showDropdown,
    visibleResources,
    dropdownResults,
    typeFilters,
    quickSearches,
    setActiveType,
    setShowDropdown,
    handleSearch,
    handleDropdownSelect,
    clearSearch,
  };
}

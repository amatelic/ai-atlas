import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import catalog from "../data/ai-resources.json";
import { generateAllThumbnails } from "./pixelArt";

const typeFilters = ["All", "Skill", "Tool", "Docs", "Framework", "Directory", "Protocol"];
const quickSearches = ["agent skills", "design", "refactoring", "prompting", "mcp"];

function normalize(value) {
  return String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function resourceSearchText(resource) {
  return normalize(
    [resource.title, resource.type, resource.category, resource.summary, ...resource.tags].join(" ")
  );
}

function scoreResource(resource, query) {
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

function getDomain(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function getFaviconUrl(url) {
  const domain = getDomain(url);
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

function highlightMatch(text, query) {
  if (!query) return text;
  
  const tokens = normalize(query).split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return text;
  
  const pattern = new RegExp(`(${tokens.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  const parts = text.split(pattern);
  
  return parts.map((part, i) => {
    if (tokens.some(token => part.toLowerCase() === token.toLowerCase())) {
      return <mark key={i} className="search-highlight">{part}</mark>;
    }
    return part;
  });
}

function articleMatchesQuery(article, query) {
  if (!query) return true;
  const searchText = normalize([article.title, article.source, article.summary, ...article.tags].join(" "));
  return normalize(query).split(/\s+/).every((token) => searchText.includes(token));
}

export function App() {
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState("All");
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [thumbnails, setThumbnails] = useState({});
  const searchRef = useRef(null);
  const resultsRef = useRef(null);
  const dropdownRef = useRef(null);

  // Generate pixel art thumbnails on mount
  useEffect(() => {
    const thumbs = generateAllThumbnails(catalog);
    setThumbnails(thumbs);
  }, []);

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

  const featuredCount = catalog.resources.filter((resource) => resource.featured).length;
  const totalLinks = catalog.resources.length + catalog.articles.length;

  useEffect(() => {
    const handleShortcut = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  useEffect(() => {
    window.__AI_SEARCH_PAGE__ = {
      activeType,
      articleCount: catalog.articles.length,
      categoryCount: catalog.categories.length,
      query,
      resultCount: visibleResources.length,
      resourceCount: catalog.resources.length
    };
  }, [activeType, query, visibleResources.length]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowDropdown(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (value) => {
    setQuery(value);
    setIsSearching(Boolean(value));
    setShowDropdown(Boolean(value));
    setHasScrolled(false);
  };

  const handleDropdownSelect = (item) => {
    window.open(item.url, "_blank", "noreferrer");
    setShowDropdown(false);
  };

  useEffect(() => {
    if (query && !hasScrolled && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      setHasScrolled(true);
    }
  }, [query, hasScrolled]);

  const getItemType = (item) => item.type || "Article";
  const getItemTitle = (item) => item.title;
  const getItemUrl = (item) => item.url;

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <a className="logo" href="/" aria-label="AI Atlas home">
            <span className="logo-icon">AI</span>
            <span className="logo-text">Atlas</span>
          </a>
          <nav className="header-nav" aria-label="Primary">
            <a href="#resources">Resources</a>
            <a href="#articles">Articles</a>
          </nav>
          <div className="header-actions">
            <button className="btn btn-ghost" type="button" onClick={() => searchRef.current?.focus()}>
              <span className="shortcut-key">⌘</span>
              <span className="shortcut-key">K</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-container">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h1 className="hero-title">
              What AI resource<br />do you need?
            </h1>
            <p className="hero-subtitle">
              Search curated AI tools, skills, docs, workflows, and articles.
            </p>
          </motion.div>

          <motion.div
            className="search-container"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          >
            <div className="search-box-wrapper" ref={dropdownRef}>
              <div className="search-box">
                <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  id="ai-search"
                  ref={searchRef}
                  value={query}
                  onChange={(event) => handleSearch(event.target.value)}
                  placeholder="Search tools, skills, articles, workflows..."
                  autoComplete="off"
                  onFocus={() => query && setShowDropdown(true)}
                />
                {query && (
                  <button className="search-clear" type="button" onClick={() => handleSearch("")}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              <AnimatePresence>
                {showDropdown && dropdownResults.length > 0 && (
                  <motion.div
                    className="search-dropdown"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="search-dropdown-header">
                      <span>Top matches</span>
                      <button
                        className="search-dropdown-clear"
                        type="button"
                        onClick={() => {
                          handleSearch("");
                          searchRef.current?.focus();
                        }}
                      >
                        Clear
                      </button>
                    </div>
                    <div className="search-dropdown-list">
                      {dropdownResults.map((item, index) => (
                        <button
                          key={`${item.id}-${index}`}
                          className="search-dropdown-item"
                          type="button"
                          onClick={() => handleDropdownSelect(item)}
                        >
                          <div className="search-dropdown-favicon">
                            <img
                              src={getFaviconUrl(getItemUrl(item))}
                              alt=""
                              loading="lazy"
                              onError={(e) => { e.target.style.display = "none"; }}
                            />
                          </div>
                          <div className="search-dropdown-content">
                            <div className="search-dropdown-title">
                              {highlightMatch(getItemTitle(item), query)}
                            </div>
                            <div className="search-dropdown-meta">
                              <span className="search-dropdown-type">{getItemType(item)}</span>
                              <span className="search-dropdown-domain">{getDomain(getItemUrl(item))}</span>
                            </div>
                          </div>
                          <svg className="search-dropdown-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M7 17 17 7M17 7H7M17 7v10" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="quick-actions">
              {quickSearches.map((term) => (
                <button
                  key={term}
                  className="quick-action-btn"
                  type="button"
                  onClick={() => handleSearch(term)}
                >
                  {term}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="main-content">
        {/* Results Section */}
        <section className="section section-results" id="resources" ref={resultsRef}>
          <div className="section-header">
            <div>
              <h2 className="section-title">
                {isSearching ? `Results for "${query}"` : "Top resources"}
              </h2>
              <p className="section-description">
                {visibleResources.length} resources found
              </p>
            </div>
            <div className="type-filters">
              {typeFilters.map((type) => (
                <button
                  key={type}
                  className={`type-filter-btn ${activeType === type ? "is-active" : ""}`}
                  type="button"
                  onClick={() => setActiveType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="results-grid" aria-live="polite">
            <AnimatePresence mode="popLayout">
              {visibleResources.length > 0 ? (
                visibleResources.map((resource, index) => (
                  <motion.a
                    key={resource.id}
                    className="resource-card"
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer"
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ delay: Math.min(index * 0.03, 0.1), duration: 0.25 }}
                  >
                    <div className="resource-preview">
                      <img
                        className="resource-preview-pixel"
                        src={thumbnails[resource.id] || getFaviconUrl(resource.url)}
                        alt=""
                        loading="lazy"
                      />
                      <div className="resource-preview-favicon">
                        <img
                          src={getFaviconUrl(resource.url)}
                          alt=""
                          loading="lazy"
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      </div>
                    </div>
                    <span className="resource-domain">{getDomain(resource.url)}</span>
                    <div className="resource-card-header">
                      <span className="resource-type">{resource.type}</span>
                      <svg className="resource-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M7 17 17 7M17 7H7M17 7v10" />
                      </svg>
                    </div>
                    <h3 className="resource-title">{highlightMatch(resource.title, query)}</h3>
                    <p className="resource-summary">{highlightMatch(resource.summary, query)}</p>
                    <div className="resource-tags">
                      {resource.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="resource-tag">{tag}</span>
                      ))}
                    </div>
                  </motion.a>
                ))
              ) : (
                <motion.div
                  className="empty-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <h3>No results found for "{query}"</h3>
                  <p>Try adjusting your search or filters.</p>
                  <div className="empty-state-suggestions">
                    <span>Popular searches:</span>
                    <div className="empty-state-tags">
                      {quickSearches.map((term) => (
                        <button
                          key={term}
                          className="empty-state-tag"
                          type="button"
                          onClick={() => handleSearch(term)}
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Articles Section - Always show all articles */}
        <section className="section" id="articles">
          <div className="section-header">
            <h2 className="section-title">Reading queue</h2>
            <p className="section-description">Interesting articles and reads</p>
          </div>

          <div className="articles-grid">
            {catalog.articles.map((article, index) => (
              <motion.a
                key={article.id}
                className="article-card"
                href={article.url}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <div className="article-preview">
                  <img
                    className="article-preview-pixel"
                    src={thumbnails[article.id] || getFaviconUrl(article.url)}
                    alt=""
                    loading="lazy"
                  />
                </div>
                <span className="article-domain">{getDomain(article.url)}</span>
                <span className="article-source">{article.source}</span>
                <h3 className="article-title">{article.title}</h3>
                <p className="article-summary">{article.summary}</p>
              </motion.a>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="section section-stats">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">{catalog.resources.length}</span>
              <span className="stat-label">Resources</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{featuredCount}</span>
              <span className="stat-label">Featured</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{catalog.articles.length}</span>
              <span className="stat-label">Articles</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{catalog.categories.length}</span>
              <span className="stat-label">Categories</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <span className="logo-icon">AI</span>
            <span>Atlas</span>
          </div>
          <p className="footer-copy">
            Fast searchable directory of important AI links and resources.
          </p>
          <p className="footer-meta">
            {totalLinks} total resources · No external search dependency
          </p>
          <p className="footer-credit">
            Created by <a href="https://gdo-studio.si" target="_blank" rel="noreferrer">gdo-studio.si</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

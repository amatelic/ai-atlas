import { useEffect, useRef, useState } from "react";
import catalog from "../data/ai-resources.json";
import { generateAllThumbnails } from "../utils/pixelArt";
import { useSearch } from "../hooks/useSearch";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { ResourceCard } from "../components/ResourceCard";
import { ArticleCard } from "../components/ArticleCard";
import { StatsSection } from "../components/StatsSection";
import { Footer } from "../components/Footer";

export function App() {
  const [thumbnails, setThumbnails] = useState({});
  const [hasScrolled, setHasScrolled] = useState(false);
  const searchRef = useRef(null);
  const resultsRef = useRef(null);
  const dropdownRef = useRef(null);

  const {
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
  } = useSearch();

  // Generate pixel art thumbnails on mount
  useEffect(() => {
    const thumbs = generateAllThumbnails(catalog);
    setThumbnails(thumbs);
  }, []);

  // Keyboard shortcut: Cmd/Ctrl + K to focus search
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

  // Expose page state for debugging
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

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowDropdown]);

  // Scroll to close dropdown
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowDropdown(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setShowDropdown]);

  // Scroll to results on first search
  useEffect(() => {
    if (query && !hasScrolled && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      setHasScrolled(true);
    }
  }, [query, hasScrolled]);

  const handleFocusSearch = () => {
    searchRef.current?.focus();
  };

  const handleFocus = () => {
    if (query) setShowDropdown(true);
  };

  return (
    <div className="app">
      <Header onFocusSearch={handleFocusSearch} />

      <Hero
        query={query}
        searchRef={searchRef}
        dropdownRef={dropdownRef}
        showDropdown={showDropdown}
        dropdownResults={dropdownResults}
        quickSearches={quickSearches}
        onSearchChange={handleSearch}
        onDropdownSelect={handleDropdownSelect}
        onClear={clearSearch}
        onFocus={handleFocus}
      />

      <main className="main-content">
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
            {visibleResources.length > 0 ? (
              visibleResources.map((resource, index) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  query={query}
                  thumbnail={thumbnails[resource.id]}
                  index={index}
                />
              ))
            ) : (
              <div className="empty-state">
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
              </div>
            )}
          </div>
        </section>

        <section className="section" id="articles">
          <div className="section-header">
            <h2 className="section-title">Reading queue</h2>
            <p className="section-description">Interesting articles and reads</p>
          </div>

          <div className="articles-grid">
            {catalog.articles.map((article, index) => (
              <ArticleCard
                key={article.id}
                article={article}
                thumbnail={thumbnails[article.id]}
                index={index}
              />
            ))}
          </div>
        </section>

        <StatsSection />
      </main>

      <Footer />
    </div>
  );
}

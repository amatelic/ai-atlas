import { motion } from "motion/react";
import { SearchDropdown } from "./SearchDropdown";

export function Hero({
  query,
  searchRef,
  dropdownRef,
  showDropdown,
  dropdownResults,
  quickSearches,
  onSearchChange,
  onDropdownSelect,
  onClear,
  onFocus,
}) {
  return (
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
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search tools, skills, articles, workflows..."
                autoComplete="off"
                onFocus={onFocus}
              />
              {query && (
                <button className="search-clear" type="button" onClick={onClear}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <SearchDropdown
              show={showDropdown}
              results={dropdownResults}
              query={query}
              onSelect={onDropdownSelect}
              onClear={onClear}
              onFocusSearch={onFocus}
            />
          </div>

          <div className="quick-actions">
            {quickSearches.map((term) => (
              <button
                key={term}
                className="quick-action-btn"
                type="button"
                onClick={() => onSearchChange(term)}
              >
                {term}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

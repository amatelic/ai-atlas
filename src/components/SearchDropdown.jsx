import { AnimatePresence, motion } from "motion/react";
import { getDomain, getFaviconUrl, getFaviconAlt, getItemTitle, getItemUrl, getItemType } from "../utils/format.jsx";
import { highlightMatch } from "../utils/format.jsx";

export function SearchDropdown({ show, results, query, onSelect, onClear, onFocusSearch }) {
  if (!show || results.length === 0) return null;

  return (
    <AnimatePresence>
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
              onClear();
              onFocusSearch?.();
            }}
          >
            Clear
          </button>
        </div>
        <div className="search-dropdown-list">
          {results.map((item, index) => (
            <button
              key={`${item.id}-${index}`}
              className="search-dropdown-item"
              type="button"
              onClick={() => onSelect(item)}
            >
              <div className="search-dropdown-favicon">
                <img
                  src={getFaviconUrl(getItemUrl(item))}
                  alt={getFaviconAlt(getItemTitle(item))}
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
    </AnimatePresence>
  );
}

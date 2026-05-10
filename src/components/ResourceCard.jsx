import { motion } from "motion/react";
import { getDomain, getFaviconUrl, getPreviewAlt, getFaviconAlt, highlightMatch } from "../utils/format.jsx";

export function ResourceCard({ resource, query, thumbnail, index }) {
  return (
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
          src={thumbnail || getFaviconUrl(resource.url)}
          alt={getPreviewAlt(resource.title)}
          loading="lazy"
        />
        <div className="resource-preview-favicon">
          <img
            src={getFaviconUrl(resource.url)}
            alt={getFaviconAlt(resource.title)}
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
  );
}

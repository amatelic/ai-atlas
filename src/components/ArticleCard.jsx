import { motion } from "motion/react";
import { getDomain, getFaviconUrl, getPreviewAlt } from "../utils/format.jsx";

export function ArticleCard({ article, thumbnail, index }) {
  return (
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
          src={thumbnail || getFaviconUrl(article.url)}
          alt={getPreviewAlt(article.title)}
          loading="lazy"
        />
      </div>
      <span className="article-domain">{getDomain(article.url)}</span>
      <span className="article-source">{article.source}</span>
      <h3 className="article-title">{article.title}</h3>
      <p className="article-summary">{article.summary}</p>
    </motion.a>
  );
}

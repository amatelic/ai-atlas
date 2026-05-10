import catalog from "../data/ai-resources.json";

export function Footer() {
  const totalLinks = catalog.resources.length + catalog.articles.length;

  return (
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
  );
}

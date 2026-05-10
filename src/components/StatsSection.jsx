import catalog from "../data/ai-resources.json";

export function StatsSection() {
  const featuredCount = catalog.resources.filter((r) => r.featured).length;

  return (
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
  );
}

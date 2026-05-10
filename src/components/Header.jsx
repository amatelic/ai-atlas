export function Header({ onFocusSearch }) {
  return (
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
          <button className="btn btn-ghost" type="button" onClick={onFocusSearch}>
            <span className="shortcut-key">⌘</span>
            <span className="shortcut-key">K</span>
          </button>
        </div>
      </div>
    </header>
  );
}

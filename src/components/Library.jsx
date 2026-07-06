export default function Library({ items, onOpen }) {
  return (
    <main className="library-shell">
      <div className="library-frame">
        <h1 className="app-title">पाठ</h1>

        <nav aria-label="Scriptures" className="library-list">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className="library-button"
              onClick={() => onOpen(item.id)}
            >
              {item.title}
            </button>
          ))}
        </nav>
      </div>
    </main>
  );
}

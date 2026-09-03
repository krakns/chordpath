export function Home() {
  return (
    <main className="home">
      <h1 className="home__title">chordpath</h1>
      <button type="button" className="home__start">
        Start
      </button>
      <nav className="home__nav">
        <a href="#reference">Chords</a>
        <a href="#listen">Listen</a>
      </nav>
    </main>
  )
}

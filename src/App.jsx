import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import AuthCard from './components/AuthCard'
import GachaDeck from './components/GachaDeck'
import BattleArena from './components/BattleArena'

function App() {
  const [user, setUser] = useState('')
  const [collection, setCollection] = useState([])
  const [deck, setDeck] = useState([]) // holds ids from collection

  // Derive deck cards with full data
  const deckCards = useMemo(() => deck.map(id => collection.find(c => c.id === id)).filter(Boolean), [deck, collection])

  function signIn(name) {
    setUser(name)
  }

  function signOut() {
    setUser('')
    setDeck([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-slate-50 to-rose-50">
      <Header user={user} />
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-4">
        <AuthCard user={user} onSignIn={signIn} onSignOut={signOut} />

        <GachaDeck
          collection={collection}
          setCollection={setCollection}
          deck={deck}
          setDeck={setDeck}
          disabled={!user}
        />

        <BattleArena
          deckCards={deckCards}
          onResetMatch={() => {}}
        />
      </main>
      <footer className="py-6 text-center text-xs text-gray-500">Prototype client — server features are simulated locally</footer>
    </div>
  )
}

export default App

import { useMemo, useState } from 'react'
import { PackageOpen, Sparkles, Star, Plus, Minus } from 'lucide-react'

const CARD_POOL = [
  { key: 'Aegis Knight', rarity: 'R', power: 3, cost: 1 },
  { key: 'Pyre Mage', rarity: 'SR', power: 5, cost: 2 },
  { key: 'Shadow Rogue', rarity: 'R', power: 4, cost: 1 },
  { key: 'Stone Golem', rarity: 'N', power: 2, cost: 1 },
  { key: 'Storm Drake', rarity: 'UR', power: 7, cost: 3 },
  { key: 'Temple Healer', rarity: 'N', power: 1, cost: 1 },
  { key: 'Frost Archer', rarity: 'R', power: 3, cost: 1 },
  { key: 'Void Warlock', rarity: 'SR', power: 6, cost: 2 },
]

function rarityColor(r) {
  return r === 'UR' ? 'text-fuchsia-600' : r === 'SR' ? 'text-indigo-600' : r === 'R' ? 'text-emerald-600' : 'text-gray-600'
}

export default function GachaDeck({ collection, setCollection, deck, setDeck, disabled }) {
  const [lastPull, setLastPull] = useState(null)
  const [pulling, setPulling] = useState(false)

  const counts = useMemo(() => {
    const c = {}
    for (const card of collection) c[card.key] = (c[card.key] || 0) + 1
    return c
  }, [collection])

  function randomCard() {
    // Weighted by rarity
    const weights = { UR: 1, SR: 3, R: 7, N: 12 }
    const pool = CARD_POOL.flatMap(c => Array(weights[c.rarity]).fill(c))
    const base = pool[Math.floor(Math.random() * pool.length)]
    const instance = { id: crypto.randomUUID(), ...base }
    return instance
  }

  async function pullOnce() {
    if (pulling) return
    setPulling(true)
    await new Promise(r => setTimeout(r, 600))
    const card = randomCard()
    setCollection(prev => [card, ...prev])
    setLastPull(card)
    setPulling(false)
  }

  function addToDeck(cardKey) {
    const idx = collection.findIndex(c => c.key === cardKey && !deck.includes(c.id))
    if (idx === -1) return
    if (deck.length >= 10) return
    setDeck(prev => [...prev, collection[idx].id])
  }

  function removeFromDeck(cardId) {
    setDeck(prev => prev.filter(id => id !== cardId))
  }

  const deckCards = deck.map(id => collection.find(c => c.id === id)).filter(Boolean)

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-white border rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold flex items-center gap-2"><PackageOpen className="h-5 w-5 text-indigo-600"/> Gacha</div>
          <button disabled={disabled} onClick={pullOnce} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-indigo-600 text-white disabled:opacity-50">
            <Sparkles className="h-4 w-4"/> Pull x1
          </button>
        </div>
        {lastPull && (
          <div className="mb-3 p-3 rounded-lg bg-gradient-to-r from-indigo-50 to-fuchsia-50 border">
            <div className="text-sm text-gray-600 mb-1">Latest pull</div>
            <div className="flex items-center justify-between">
              <div className="font-medium">{lastPull.key}</div>
              <div className={`text-sm font-semibold ${rarityColor(lastPull.rarity)}`}>{lastPull.rarity}</div>
            </div>
          </div>
        )}
        <div className="text-sm text-gray-600 mb-2">Collection</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-72 overflow-auto pr-1">
          {Object.entries(counts).length === 0 && (
            <div className="text-gray-500 text-sm">No cards yet. Pull from the gacha!</div>
          )}
          {Object.entries(counts).map(([key, count]) => {
            const base = CARD_POOL.find(c => c.key === key)
            return (
              <div key={key} className="border rounded-lg p-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">{key}</div>
                  <div className={`text-xs font-semibold ${rarityColor(base.rarity)}`}>{base.rarity}</div>
                </div>
                <div className="text-xs text-gray-500">Power {base.power} • Cost {base.cost}</div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-gray-600">x{count}</span>
                  <button disabled={disabled || deck.length >= 10} onClick={() => addToDeck(key)} className="p-1 rounded-md border hover:bg-gray-50 disabled:opacity-40">
                    <Plus className="h-4 w-4"/>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-white border rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold flex items-center gap-2"><Star className="h-5 w-5 text-amber-500"/> Deck • {deck.length}/10</div>
          <div className="text-xs text-gray-500">Tap minus to remove</div>
        </div>
        <div className="grid grid-cols-1 gap-2 max-h-80 overflow-auto pr-1">
          {deckCards.length === 0 && (
            <div className="text-gray-500 text-sm">Add cards from your collection to build a 10-card deck.</div>
          )}
          {deckCards.map(card => (
            <div key={card.id} className="border rounded-lg p-2 flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">{card.key}</div>
                <div className="text-xs text-gray-500">Power {card.power} • Cost {card.cost} • <span className={rarityColor(card.rarity)}>{card.rarity}</span></div>
              </div>
              <button disabled={disabled} onClick={() => removeFromDeck(card.id)} className="p-1 rounded-md border hover:bg-gray-50">
                <Minus className="h-4 w-4"/>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

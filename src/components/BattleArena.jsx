import { useEffect, useMemo, useRef, useState } from 'react'
import { Swords, TimerReset, Dice5, Play, Loader2 } from 'lucide-react'

function rollDie() {
  return 1 + Math.floor(Math.random() * 6)
}

export default function BattleArena({ deckCards, onResetMatch }) {
  const [inQueue, setInQueue] = useState(false)
  const [matched, setMatched] = useState(false)
  const [playerHP, setPlayerHP] = useState(20)
  const [opponentHP, setOpponentHP] = useState(20)
  const [playerDeck, setPlayerDeck] = useState([])
  const [opDeck, setOpDeck] = useState([])
  const [playerHand, setPlayerHand] = useState([])
  const [opHand, setOpHand] = useState([])
  const [turn, setTurn] = useState(null) // 'you' | 'op'
  const [dice, setDice] = useState(null)
  const [log, setLog] = useState([])
  const [rolling, setRolling] = useState(false)

  const started = matched

  const canStart = deckCards.length >= 10

  function queue() {
    if (!canStart) return
    setInQueue(true)
    setTimeout(() => {
      // Shuffle decks and draw initial hands
      const your = [...deckCards]
      const opp = [...deckCards].sort(() => Math.random() - 0.5)
      your.sort(() => Math.random() - 0.5)
      setPlayerDeck(your)
      setOpDeck(opp)
      setPlayerHand(your.slice(0, 3))
      setOpHand(opp.slice(0, 3))
      setMatched(true)
      setInQueue(false)
      setLog([{ t: 'sys', msg: 'Matched! Roll the die to decide who starts.' }])
    }, 900)
  }

  function rollForTurn() {
    if (!started || turn !== null) return
    const a = rollDie()
    const b = rollDie()
    setDice(a)
    setLog(l => [{ t: 'sys', msg: `You rolled ${a}, opponent rolled ${b}` }, ...l])
    setTurn(a >= b ? 'you' : 'op')
  }

  useEffect(() => {
    if (turn === 'op') {
      // opponent simple AI after small delay
      const to = setTimeout(() => {
        const r = rollDie()
        const card = opHand[0]
        if (!card) return
        setOpHand(h => h.slice(1))
        setDice(r)
        const dmg = card.power + r
        setPlayerHP(hp => Math.max(0, hp - dmg))
        setLog(l => [{ t: 'op', msg: `Opponent plays ${card.key} (Power ${card.power}) with roll ${r} → deals ${dmg}` }, ...l])
        setTurn('you')
      }, 900)
      return () => clearTimeout(to)
    }
  }, [turn, opHand])

  function drawCard(fromDeckSetter, handSetter, currentDeck) {
    const deckCopy = [...currentDeck]
    const c = deckCopy.shift()
    fromDeckSetter(deckCopy)
    if (c) handSetter(h => [...h, c])
  }

  function playCard(card) {
    if (turn !== 'you') return
    if (rolling) return
    setRolling(true)
    const r = rollDie()
    setDice(r)
    setTimeout(() => {
      const dmg = card.power + r
      setOpponentHP(hp => Math.max(0, hp - dmg))
      setPlayerHand(h => h.filter(x => x.id !== card.id))
      setLog(l => [{ t: 'you', msg: `You play ${card.key} (Power ${card.power}) with roll ${r} → deal ${dmg}` }, ...l])
      setTurn('op')
      setRolling(false)
    }, 500)
  }

  useEffect(() => {
    if (!started) return
    if (playerHP <= 0 || opponentHP <= 0) return
    // auto draw at start of your turn if hand < 5
    if (turn === 'you' && playerHand.length < 5 && playerDeck.length > 0) {
      drawCard(setPlayerDeck, setPlayerHand, playerDeck)
    }
  }, [turn])

  useEffect(() => {
    if (!started) return
    if (playerHP <= 0 || opponentHP <= 0) {
      setLog(l => [{ t: 'sys', msg: opponentHP <= 0 ? 'You win!' : 'Defeat...'}, ...l])
    }
  }, [playerHP, opponentHP, started])

  function resetAll() {
    setInQueue(false); setMatched(false); setPlayerHP(20); setOpponentHP(20);
    setPlayerDeck([]); setOpDeck([]); setPlayerHand([]); setOpHand([]);
    setTurn(null); setDice(null); setLog([]); onResetMatch?.()
  }

  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold flex items-center gap-2"><Swords className="h-5 w-5 text-rose-600"/> Battle</div>
        <div className="flex items-center gap-2">
          <button onClick={resetAll} className="text-sm inline-flex items-center gap-1 px-3 py-1.5 rounded-md border hover:bg-gray-50"><TimerReset className="h-4 w-4"/> Reset</button>
        </div>
      </div>

      {!started && (
        <div className="flex flex-col items-center justify-center gap-4 py-8">
          <div className="text-center">
            <div className="font-medium">Queue for a match</div>
            <div className="text-sm text-gray-500">Requires a 10-card deck</div>
          </div>
          <button disabled={!canStart || inQueue} onClick={queue} className="px-4 py-2 rounded-md bg-rose-600 text-white disabled:opacity-50 inline-flex items-center gap-2">
            {inQueue && <Loader2 className="h-4 w-4 animate-spin"/>}
            Find Match
          </button>
        </div>
      )}

      {started && (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="grid grid-cols-2 gap-3">
              <HPBar label="You" hp={playerHP} color="bg-indigo-600"/>
              <HPBar label="Opponent" hp={opponentHP} color="bg-rose-600"/>
            </div>

            <div className="mt-3 p-3 rounded-lg border bg-gray-50 flex items-center justify-between">
              <div className="text-sm text-gray-600">Turn: {turn ? (turn === 'you' ? 'Your turn' : 'Opponent') : 'Decide with dice'}</div>
              <button disabled={turn !== null} onClick={rollForTurn} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border bg-white hover:bg-gray-50"><Dice5 className="h-4 w-4"/> Roll for First</button>
            </div>

            <div className="mt-3">
              <div className="text-sm text-gray-600 mb-1">Your hand</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {playerHand.length === 0 && <div className="text-sm text-gray-500">No cards in hand.</div>}
                {playerHand.map(card => (
                  <button key={card.id} onClick={() => playCard(card)} disabled={turn !== 'you' || rolling} className="text-left border rounded-lg p-2 bg-white hover:bg-indigo-50 disabled:opacity-50">
                    <div className="font-medium text-sm">{card.key}</div>
                    <div className="text-xs text-gray-500">Power {card.power} • Cost {card.cost}</div>
                    <div className="mt-2 inline-flex items-center gap-1 text-xs text-gray-600"><Play className="h-3 w-3"/> Play</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="text-sm text-gray-600 mb-2">Combat Log</div>
            <div className="h-64 overflow-auto border rounded-lg p-2 bg-white space-y-2">
              {log.map((e, i) => (
                <div key={i} className={`text-sm ${e.t === 'sys' ? 'text-gray-700' : e.t === 'you' ? 'text-indigo-700' : 'text-rose-700'}`}>{e.msg}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function HPBar({ label, hp, color }) {
  return (
    <div className="border rounded-lg p-2 bg-white">
      <div className="flex items-center justify-between mb-1 text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium">{hp}/20</span>
      </div>
      <div className="h-2 w-full bg-gray-200 rounded">
        <div className={`h-2 ${color} rounded`} style={{ width: `${(hp/20)*100}%` }} />
      </div>
    </div>
  )
}

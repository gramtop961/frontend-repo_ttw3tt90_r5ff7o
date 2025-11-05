import { Sword, Dice5, Package, Users } from 'lucide-react'

export default function Header({ user }) {
  return (
    <header className="w-full sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sword className="h-6 w-6 text-indigo-600" />
          <h1 className="text-xl font-bold tracking-tight">TCG Gacha: Imperius</h1>
        </div>
        <nav className="hidden sm:flex items-center gap-6 text-sm text-gray-600">
          <div className="inline-flex items-center gap-1"><Package className="h-4 w-4"/> Gacha</div>
          <div className="inline-flex items-center gap-1"><Users className="h-4 w-4"/> Deck</div>
          <div className="inline-flex items-center gap-1"><Dice5 className="h-4 w-4"/> Battle</div>
        </nav>
        <div className="text-sm">
          {user ? (
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">Signed in as {user}</span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-gray-50 text-gray-600 border">Guest</span>
          )}
        </div>
      </div>
    </header>
  )
}

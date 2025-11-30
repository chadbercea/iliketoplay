"use client";

import Link from "next/link";
import { GameList } from "@/components/game-list";
import { Button } from "@/components/ui/button";
import UserMenu from "@/components/user-menu";
import StatsPanel from "@/components/stats-panel";
import AuthGuard from "@/components/auth-guard";

export default function HomeContent() {
  return (
    <AuthGuard>
      <div className="min-h-screen">
        <header className="bg-white border-b shadow-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900">I Like To Play</h1>
            <UserMenu />
          </div>
        </header>
        <main className="p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-4xl font-bold mb-2">My Collection</h2>
                <p className="text-muted-foreground">Retro Game Collection Tool</p>
              </div>
              <Link href="/games/new">
                <Button>Add Game</Button>
              </Link>
            </div>
            
            {/* Stats Dashboard */}
            <StatsPanel />
            
            {/* Game Grid */}
            <div>
              <h3 className="text-2xl font-bold mb-4">Games</h3>
              <GameList />
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}


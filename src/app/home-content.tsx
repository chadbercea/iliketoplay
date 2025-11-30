"use client";

import Link from "next/link";
import { GameList } from "@/components/game-list";
import { Button } from "@/components/ui/button";
import UserMenu from "@/components/user-menu";
import StatsPanel from "@/components/stats-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HomeContent() {
  return (
    <div className="min-h-screen">
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">I Like To Play</h1>
          <UserMenu />
        </div>
      </header>
      <main className="p-8">
        <div className="max-w-7xl mx-auto space-y-8">
              <div className="flex justify-between items-center gap-4 flex-wrap">
                <div>
                  <h2 className="text-4xl font-bold mb-2">My Collection</h2>
                  <p className="text-muted-foreground">Retro Game Collection Tool</p>
                </div>
                <Link href="/games/new">
                  <Button className="min-h-[44px]" aria-label="Add new game to collection">Add Game</Button>
                </Link>
              </div>
          
          <Tabs defaultValue="games" className="w-full">
            <TabsList>
              <TabsTrigger value="games">Games</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
            </TabsList>
            
            <TabsContent value="games" className="mt-6">
              <GameList />
            </TabsContent>
            
            <TabsContent value="stats" className="mt-6">
              <StatsPanel />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}


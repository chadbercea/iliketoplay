"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IGame } from "@/types/game";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GameSearch } from "@/components/game-search";
import { toast } from "sonner";

interface GameFormProps {
  game?: IGame;
  isEdit?: boolean;
}

export function GameForm({ game, isEdit = false }: GameFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"search" | "manual">(isEdit ? "manual" : "search");
  const [formData, setFormData] = useState<Partial<IGame>>({
    title: game?.title || "",
    platform: game?.platform || "",
    year: game?.year || undefined,
    genre: game?.genre || "",
    status: game?.status || "owned",
    coverImageUrl: game?.coverImageUrl || "",
    notes: game?.notes || "",
    condition: game?.condition || undefined,
    purchaseInfo: {
      price: game?.purchaseInfo?.price || undefined,
      date: game?.purchaseInfo?.date || undefined,
      location: game?.purchaseInfo?.location || "",
    },
  });

  const handleSelectGame = (searchResult: any) => {
    setFormData({
      title: searchResult.title,
      platform: searchResult.platform,
      year: searchResult.year,
      genre: searchResult.genre,
      status: "owned",
      coverImageUrl: searchResult.coverImageUrl,
      notes: searchResult.notes || "",
      condition: undefined,
      purchaseInfo: {
        price: undefined,
        date: undefined,
        location: "",
      },
    });
    setMode("manual");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEdit ? `/api/games/${game?._id}` : "/api/games";
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(isEdit ? "Game updated successfully!" : "Game added to collection!");
        router.push("/");
        router.refresh();
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to save game");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("An error occurred while saving the game");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("purchaseInfo.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        purchaseInfo: {
          ...prev.purchaseInfo,
          [field]: field === "price" ? (value ? Number(value) : undefined) : value,
        },
      }));
    } else if (name === "year") {
      setFormData((prev) => ({
        ...prev,
        [name]: value ? Number(value) : undefined,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? "Edit Game" : "Add New Game"}</CardTitle>
      </CardHeader>
      <CardContent>
        {!isEdit && mode === "search" && (
          <GameSearch
            onSelectGame={handleSelectGame}
            onManualEntry={() => setMode("manual")}
          />
        )}

        {mode === "manual" && (
          <>
            {!isEdit && (
              <div className="mb-4 flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setMode("search")}
                >
                  ← Back to Search
                </Button>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="platform">Platform *</Label>
            <Input
              id="platform"
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                name="year"
                type="number"
                min="1970"
                max={new Date().getFullYear() + 1}
                value={formData.year || ""}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="genre">Genre</Label>
              <Input
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status *</Label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              >
                <option value="owned">Owned</option>
                <option value="wishlist">Wishlist</option>
              </select>
            </div>

            <div>
              <Label htmlFor="condition">Condition</Label>
              <select
                id="condition"
                name="condition"
                value={formData.condition || ""}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              >
                <option value="">Select condition</option>
                <option value="mint">Mint</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="coverImageUrl">Cover Image URL</Label>
            <Input
              id="coverImageUrl"
              name="coverImageUrl"
              type="url"
              value={formData.coverImageUrl}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Purchase Information</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="purchaseInfo.price">Price</Label>
                <Input
                  id="purchaseInfo.price"
                  name="purchaseInfo.price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.purchaseInfo?.price || ""}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="purchaseInfo.date">Purchase Date</Label>
                <Input
                  id="purchaseInfo.date"
                  name="purchaseInfo.date"
                  type="date"
                  value={
                    formData.purchaseInfo?.date
                      ? new Date(formData.purchaseInfo.date).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="purchaseInfo.location">Purchase Location</Label>
                <Input
                  id="purchaseInfo.location"
                  name="purchaseInfo.location"
                  value={formData.purchaseInfo?.location || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : isEdit ? "Update Game" : "Add Game"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/")}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
          </>
        )}
      </CardContent>
    </Card>
  );
}


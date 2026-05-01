// Store local pour favoris et comparateur.
"use client";

import { create } from "zustand";

type State = {
  favorites: string[];
  compare: string[];
  toggleFavorite: (id: string) => void;
  toggleCompare: (id: string) => void;
};

export const useGarageStore = create<State>((set) => ({
  favorites: [],
  compare: [],
  toggleFavorite: (id) => set((state) => ({
    favorites: state.favorites.includes(id)
      ? state.favorites.filter((x) => x !== id)
      : [...state.favorites, id]
  })),
  toggleCompare: (id) => set((state) => ({
    compare: state.compare.includes(id)
      ? state.compare.filter((x) => x !== id)
      : state.compare.length >= 3
        ? [...state.compare.slice(1), id]
        : [...state.compare, id]
  }))
}));
